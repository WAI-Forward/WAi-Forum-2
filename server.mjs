import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { createHash, createHmac, createSign, timingSafeEqual } from "node:crypto";
import { networkInterfaces } from "node:os";
import { extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { inflateSync } from "node:zlib";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 5020);
const host = process.env.HOST || "0.0.0.0";
const model = process.env.GOOGLE_GENAI_MODEL || "gemini-2.5-flash-image";
const authConfig = loadAuthConfig();
const defaultWebsiteUrl = "http://92.29.230.204:8082";
const websiteUrl = stripTrailingSlash(
  process.env.WAI_FORWARD_WEBSITE_URL ||
  process.env.WEBSITE_URL ||
  authConfig.website_url ||
  defaultWebsiteUrl
);
const configuredForumUrl = stripTrailingSlash(
  process.env.FORUM_PUBLIC_URL ||
  process.env.FORUM_URL ||
  authConfig.forum_public_url ||
  authConfig.forum_url ||
  ""
);
const coreTokenExchangeSecret = loadCoreTokenExchangeSecret();
const forumSessionSecret =
  process.env.FORUM_SESSION_SECRET ||
  coreTokenExchangeSecret ||
  process.env.SECRET_KEY ||
  "dev-forum-session-secret";
const forumSessionCookie = "wai_forum_session";
const forumSessionMaxAgeSeconds = Number(process.env.FORUM_SESSION_MAX_AGE_SECONDS || 12 * 60 * 60);
const databaseUrl = normalizeDatabaseUrl(loadConfiguredDatabaseUrl());
const forumApiToken = process.env.FORUM_API_TOKEN || process.env.WAI_FORUM_API_TOKEN || "";
const configuredClusternautsUrl = stripTrailingSlash(process.env.CLUSTERNAUTS_URL || "");
const cloudClusternautsUrl = "https://clusternauts-806779816452.us-central1.run.app";
const assetBucket = String(process.env.WAI_FORUM_ASSET_BUCKET || process.env.GCS_ASSET_BUCKET || "").trim();
const assetPrefix = String(process.env.WAI_FORUM_ASSET_PREFIX || "generated/building-assets").replace(/^\/+|\/+$/g, "");
const requiredForumRole = process.env.WAI_FORUM_REQUIRED_ROLE || "WAI Forum EA";
const defaultVertexProject = "wai-forward-runwai";
const defaultVertexLocation = process.env.GOOGLE_CLOUD_LOCATION || "global";
const cloudPlatformScope = "https://www.googleapis.com/auth/cloud-platform";
let cachedAccessToken = null;
let dbPoolPromise = null;

const HOME_MIN_X = -5;
const HOME_MAX_X = 5;
const HOME_MIN_Y = -5;
const HOME_MAX_Y = 5;
const HOME_SPAWN_MIN_DISTANCE = 200;
const HOME_SPAWN_STEP = 220;
const PLAYER_ACTIVE_MS = 45_000;
const HOME_GATE_FEATURE_PREFIX = "home-gate-";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp"
};

createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "127.0.0.1"}`);
    if (req.method === "GET" && url.pathname === "/healthz") {
      writeJson(res, 200, { ok: true, service: "wai-forum" });
      return;
    }

    if (req.method === "GET" && url.pathname === "/config.js") {
      res.writeHead(200, {
        "content-type": "text/javascript; charset=utf-8",
        "cache-control": "no-store"
      });
      res.end(`window.WAI_FUN_CONFIG=${JSON.stringify({ clusternautsUrl: clusternautsUrlForRequest(req) })};\n`);
      return;
    }

    if (req.method === "GET" && url.pathname === "/auth/login") {
      redirectToWebsiteLogin(req, res, url.searchParams.get("return_to"));
      return;
    }

    if (req.method === "GET" && url.pathname === "/auth/logout") {
      res.writeHead(302, {
        "location": "/auth/login",
        "set-cookie": clearForumSessionCookie(req)
      });
      res.end();
      return;
    }

    if (req.method === "GET" && url.pathname === "/auth/launch/callback") {
      await handleLaunchCallback(req, res, url);
      return;
    }

    const forumSession = readForumSession(req);
    if (req.method === "GET" && url.pathname === "/api/account") {
      if (!forumSession) {
        writeJson(res, 401, { error: "unauthenticated", login_url: buildForumLoginPath(url.pathname) });
        return;
      }
      if (!userHasForumAccess(forumSession.user)) {
        writeJson(res, 403, { error: "forbidden", message: "WAi Forum early access is required." });
        return;
      }
      await upsertForumUser(forumSession.user);
      writeJson(res, 200, { user: forumSession.user });
      return;
    }

    if (url.pathname === "/api/forum/boards" || url.pathname.startsWith("/api/forum/boards/") || url.pathname.startsWith("/api/forum/topics/")) {
      if (!forumApiRequestAllowed(req)) {
        writeJson(res, 401, { error: "unauthorized" });
        return;
      }

      if (req.method === "GET" && url.pathname === "/api/forum/boards") {
        await handleForumApiBoards(req, res);
        return;
      }

      if (req.method === "GET" && url.pathname.startsWith("/api/forum/boards/")) {
        await handleForumApiBoard(req, res, decodePathSuffix(url.pathname, "/api/forum/boards/"));
        return;
      }

      if (req.method === "GET" && url.pathname.startsWith("/api/forum/topics/")) {
        await handleForumApiTopic(req, res, decodePathSuffix(url.pathname, "/api/forum/topics/"));
        return;
      }

      writeJson(res, 405, { error: "method_not_allowed" });
      return;
    }

    if (!forumSession) {
      if (req.method === "GET") {
        redirectToWebsiteLogin(req, res, url.pathname + url.search);
      } else {
        writeJson(res, 401, { error: "unauthenticated" });
      }
      return;
    }

    if (!userHasForumAccess(forumSession.user)) {
      if (req.method === "GET") {
        writeAccessDenied(res);
      } else {
        writeJson(res, 403, { error: "forbidden", message: "WAi Forum early access is required." });
      }
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/world/live") {
      await handleGetLiveWorld(req, res, forumSession, url);
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/world") {
      await handleGetWorld(req, res, forumSession);
      return;
    }

    if ((req.method === "PUT" || req.method === "POST") && url.pathname === "/api/world") {
      await handlePutWorld(req, res, forumSession);
      return;
    }

    if ((req.method === "PUT" || req.method === "POST") && url.pathname === "/api/player-position") {
      await handlePutPlayerPosition(req, res, forumSession);
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/preview-building/status") {
      handlePreviewBuildingStatus(res);
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/preview-building") {
      await handlePreviewBuilding(req, res);
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/building-assets") {
      await handleBuildingAssetLibrary(req, res, forumSession);
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/building-assets") {
      await handleBuildingAssetUpload(req, res, forumSession);
      return;
    }

    const path = safeStaticPath(url.pathname === "/" ? "index.html" : url.pathname);
    const body = await readFile(path);
    res.writeHead(200, {
      "content-type": mimeTypes[extname(path)] || "application/octet-stream",
      "cache-control": "no-store"
    });
    res.end(body);
  } catch (error) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}).listen(port, host, () => {
  console.log(`Home Plot running at http://127.0.0.1:${port}/`);
  for (const address of localLanAddresses()) {
    console.log(`Home Plot also available at http://${address}:${port}/`);
  }
  void checkDatabaseConnection();
});

function stripTrailingSlash(value) {
  return String(value || "").replace(/\/+$/, "");
}

function normalizeDatabaseUrl(value) {
  return String(value || "").trim()
    .replace(/^postgresql\+psycopg2:/, "postgresql:")
    .replace(/^postgres\+psycopg2:/, "postgres:");
}

function loadAuthConfig() {
  const configPath = join(root, "data", "forum-auth.json");
  if (!existsSync(configPath)) return {};

  try {
    return JSON.parse(readFileSync(configPath, "utf8"));
  } catch (error) {
    console.warn(`Could not read WAi Forum auth config: ${error.message}`);
    return {};
  }
}

function loadConfiguredDatabaseUrl() {
  const envUrl = process.env.WAI_FORUM_DATABASE_URL || process.env.DATABASE_URL;
  if (envUrl) return databaseAddressFromConfigValue(envUrl, "WAi Forum database environment variable");

  const configPath = join(root, "data", "db-uri.json");
  if (!existsSync(configPath)) return "";

  try {
    const config = JSON.parse(readFileSync(configPath, "utf8"));
    return selectDatabaseAddress(config);
  } catch (error) {
    console.warn(`Could not read WAi Forum database config: ${error.message}`);
    return "";
  }
}

function databaseAddressFromConfigValue(value, source) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (!raw.startsWith("{")) return raw;

  try {
    return selectDatabaseAddress(JSON.parse(raw));
  } catch (error) {
    console.warn(`Could not read ${source}: ${error.message}`);
    return "";
  }
}

function selectDatabaseAddress(config) {
  if (!config || typeof config !== "object") return "";

  const devAddress = String(config.dev_address || "").trim();
  const prodAddress = String(config.prod_address || "").trim();
  const useProd = process.env.WAI_FORUM_DB_TARGET === "prod" || process.env.NODE_ENV === "production";
  return useProd ? prodAddress || devAddress : devAddress || prodAddress;
}

function requestOrigin(req) {
  const proto = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers["x-forwarded-host"] || req.headers.host || `127.0.0.1:${port}`;
  return `${proto}://${host}`;
}

function clusternautsUrlForRequest(req) {
  if (configuredClusternautsUrl) return configuredClusternautsUrl;
  if (isCloudRuntime()) return cloudClusternautsUrl;

  const hostHeader = String(req.headers["x-forwarded-host"] || req.headers.host || "").trim();
  const hostname = hostHeader.replace(/^\[|\]$/g, "").split(":")[0].toLowerCase();
  if (!hostname) return "";

  const devHost =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.") ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(hostname);
  if (!devHost) return "";

  const proto = req.headers["x-forwarded-proto"] || "http";
  const displayHost = hostname === "::1" ? "[::1]" : hostname;
  return `${proto}://${displayHost}:3000`;
}

function isCloudRuntime() {
  return Boolean(process.env.K_SERVICE || process.env.K_REVISION || process.env.K_CONFIGURATION);
}

function forumBaseUrl(req) {
  return configuredForumUrl || requestOrigin(req);
}

function callbackUrl(req) {
  return `${forumBaseUrl(req)}/auth/launch/callback`;
}

function localLanAddresses() {
  return Object.values(networkInterfaces())
    .flat()
    .filter((entry) => entry?.family === "IPv4" && !entry.internal && entry.address.startsWith("192."))
    .map((entry) => entry.address);
}

function safeReturnPath(value) {
  const path = String(value || "").trim();
  if (!path || !path.startsWith("/") || path.startsWith("//")) return "/";
  if (path.startsWith("/auth/launch/callback")) return "/";
  return path;
}

function buildForumLoginPath(returnTo = "/") {
  const safePath = safeReturnPath(returnTo);
  return `/auth/login?return_to=${encodeURIComponent(safePath)}`;
}

function redirectToWebsiteLogin(req, res, returnTo = "/") {
  const safePath = safeReturnPath(returnTo);
  const params = new URLSearchParams({
    app: "wai-forum",
    callback: safePath
  });
  res.writeHead(302, { "location": `${websiteUrl}/auth/app-launch?${params.toString()}` });
  res.end();
}

async function handleLaunchCallback(req, res, url) {
  const code = (url.searchParams.get("code") || "").trim();
  if (!code) {
    redirectToWebsiteLogin(req, res, "/");
    return;
  }

  const tokens = await exchangeAuthorizationCode(code, callbackUrl(req));
  if (!tokens?.wf_access_token) {
    res.writeHead(302, { "location": buildForumLoginPath("/") });
    res.end();
    return;
  }

  const tokenPayload = decodeAccessTokenPayload(tokens.wf_access_token);
  if (!tokenPayload?.user_id) {
    res.writeHead(302, { "location": buildForumLoginPath("/") });
    res.end();
    return;
  }

  const user = buildForumUser(tokenPayload);
  if (!userHasForumAccess(user)) {
    res.writeHead(403, {
      "content-type": "text/html; charset=utf-8",
      "set-cookie": clearForumSessionCookie(req)
    });
    res.end(accessDeniedHtml());
    return;
  }
  const sessionValue = signForumSession({
    user,
    wf_access_token: tokens.wf_access_token,
    wf_refresh_token: tokens.wf_refresh_token || tokenPayload.refresh_token || null,
    expires_at: Date.now() + forumSessionMaxAgeSeconds * 1000
  });

  res.writeHead(302, {
    "location": safeReturnPath(url.searchParams.get("return_to")),
    "set-cookie": buildForumSessionCookie(req, sessionValue)
  });
  res.end();
}

async function exchangeAuthorizationCode(code, callback) {
  const headers = { "content-type": "application/json" };
  if (coreTokenExchangeSecret) headers.authorization = `Bearer ${coreTokenExchangeSecret}`;

  let response;
  try {
    response = await fetch(`${websiteUrl}/auth/token`, {
      method: "POST",
      headers,
      body: JSON.stringify({ code, callback })
    });
  } catch (error) {
    console.warn(`WAi Forum auth exchange could not reach Website: ${error.message}`);
    return null;
  }

  if (!response.ok) {
    console.warn(`WAi Forum auth exchange failed with ${response.status}: ${await response.text()}`);
    return null;
  }

  return response.json();
}

function buildForumUser(payload) {
  const displayName = payload.display_name || payload.user_name || payload.email || "WAi Forward member";
  return {
    id: String(payload.user_id),
    customer_id: payload.customer_id || null,
    name: displayName,
    email: payload.email || "",
    roles: Array.isArray(payload.roles) ? payload.roles : [],
    profile_pic: payload.profile_pic || null,
    activity_status: payload.activity_status || "online",
    color: colorFromUserId(payload.user_id)
  };
}

function normalizedRole(value) {
  return String(value || "").trim().toLowerCase().replace(/[-_]+/g, " ").replace(/\s+/g, " ");
}

function userHasForumAccess(user) {
  const roles = Array.isArray(user?.roles) ? user.roles : [];
  const required = normalizedRole(requiredForumRole);
  return roles.some((role) => normalizedRole(role) === required);
}

function writeAccessDenied(res) {
  res.writeHead(403, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
  res.end(accessDeniedHtml());
}

function accessDeniedHtml() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>WAi Forum access required</title>
    <style>
      body{margin:0;display:grid;min-height:100vh;place-items:center;background:#101811;color:#fff6db;font-family:Inter,system-ui,sans-serif}
      main{max-width:520px;padding:28px;border:1px solid rgba(255,244,213,.22);border-radius:8px;background:rgba(23,29,24,.84)}
      h1{margin:0 0 10px;font-size:24px}p{margin:0 0 18px;color:#dbc8a1;line-height:1.5}a{color:#9ee7ff;font-weight:800}
    </style>
  </head>
  <body>
    <main>
      <h1>WAi Forum early access required</h1>
      <p>Your WAi Forward account is logged in, but it does not include the ${escapeHtml(requiredForumRole)} role yet.</p>
      <a href="${websiteUrl}">Return to WAi Forward</a>
    </main>
  </body>
</html>`;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function colorFromUserId(userId) {
  const text = String(userId || "wai-forum");
  let hash = 0;
  for (const char of text) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue} 52% 45%)`;
}

function signForumSession(payload) {
  const body = toBase64Url(Buffer.from(JSON.stringify(payload)));
  const sig = createHmac("sha256", forumSessionSecret).update(body).digest();
  return `${body}.${toBase64Url(sig)}`;
}

function readForumSession(req) {
  const value = parseCookies(req.headers.cookie || "")[forumSessionCookie];
  if (!value) return null;

  const [body, signature] = value.split(".");
  if (!body || !signature) return null;

  const expected = toBase64Url(createHmac("sha256", forumSessionSecret).update(body).digest());
  if (!safeEqual(signature, expected)) return null;

  try {
    const payload = JSON.parse(fromBase64Url(body).toString("utf8"));
    if (!payload?.user?.id || Number(payload.expires_at || 0) <= Date.now()) return null;
    return payload;
  } catch (error) {
    return null;
  }
}

function parseCookies(header) {
  const cookies = {};
  for (const part of String(header || "").split(";")) {
    const index = part.indexOf("=");
    if (index < 0) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (key) cookies[key] = decodeURIComponent(value);
  }
  return cookies;
}

function buildForumSessionCookie(req, value) {
  const secure = requestOrigin(req).startsWith("https://") ? "; Secure" : "";
  return `${forumSessionCookie}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${forumSessionMaxAgeSeconds}${secure}`;
}

function clearForumSessionCookie(req) {
  const secure = requestOrigin(req).startsWith("https://") ? "; Secure" : "";
  return `${forumSessionCookie}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && timingSafeEqual(left, right);
}

function decodeAccessTokenPayload(token) {
  const parts = String(token || "").split(".");
  if (!parts.length) return null;

  const compressed = parts[0] === "";
  const payloadPart = compressed ? parts[1] : parts[0];
  if (!payloadPart) return null;

  try {
    const payloadBytes = fromBase64Url(payloadPart);
    const jsonBytes = compressed ? inflateSync(payloadBytes) : payloadBytes;
    return JSON.parse(jsonBytes.toString("utf8"));
  } catch (error) {
    console.warn(`Could not decode WAi Forward access token payload: ${error.message}`);
    return null;
  }
}

function fromBase64Url(value) {
  const padded = String(value).replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(padded + "=".repeat((4 - (padded.length % 4)) % 4), "base64");
}

function loadCoreTokenExchangeSecret() {
  const envSecret =
    process.env.CORE_TOKEN_EXCHANGE_SECRET ||
    process.env.CORE_SECRET ||
    process.env.WAI_CORE_SECRET;
  const normalizedEnvSecret = normalizeCoreTokenExchangeSecret(envSecret);
  if (normalizedEnvSecret) return normalizedEnvSecret;

  const candidates = [
    join(root, "data", "core.json"),
    join(root, "..", "Website", "data", "core.json"),
    join(root, "..", "RunWAI", "data", "core.json")
  ];

  for (const path of candidates) {
    try {
      if (!existsSync(path)) continue;
      const raw = readFileSync(path, "utf8").trim();
      if (!raw) continue;
      const normalizedSecret = normalizeCoreTokenExchangeSecret(raw);
      if (normalizedSecret) return normalizedSecret;
    } catch (error) {
      console.warn(`Could not load core token exchange secret from ${path}: ${error.message}`);
    }
  }

  return "";
}

function normalizeCoreTokenExchangeSecret(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "string") return parsed.trim();
    if (parsed && typeof parsed === "object" && "secret" in parsed) {
      return String(parsed.secret || "").trim();
    }
    return "";
  } catch {
    return raw;
  }
}

function writeJson(res, status, payload) {
  res.writeHead(status, { "content-type": "application/json", "cache-control": "no-store" });
  res.end(JSON.stringify(payload));
}

function forumApiRequestAllowed(req) {
  if (!forumApiToken) return true;
  return req.headers.authorization === `Bearer ${forumApiToken}`;
}

function decodePathSuffix(pathname, prefix) {
  try {
    return decodeURIComponent(String(pathname || "").slice(prefix.length));
  } catch {
    return "";
  }
}

function forumAssetUrl(req, value) {
  const imageUrl = String(value || "").trim();
  if (!imageUrl) return null;
  if (/^(https?:|data:)/i.test(imageUrl)) return imageUrl;
  if (imageUrl.startsWith("/")) return `${forumBaseUrl(req)}${imageUrl}`;
  return imageUrl;
}

function decorateForumBoard(req, row) {
  return {
    ...row,
    id: String(row.id),
    image_url: forumAssetUrl(req, row.image_url),
    route_ref: row.slug || String(row.id),
    topic_count: Number(row.topic_count || 0),
    post_count: Number(row.post_count || 0)
  };
}

async function handleForumApiBoards(req, res) {
  const db = await getDatabase();
  if (!db.ok) {
    writeJson(res, 503, { error: "persistence_unavailable", detail: db.error });
    return;
  }

  try {
    const result = await db.pool.query(
      `
      select
        b.id::text,
        b.title,
        b.slug,
        b.description,
        b.visibility,
        coalesce(topic_stats.topic_count, 0)::int as topic_count,
        coalesce(message_stats.post_count, 0)::int as post_count,
        wb.image_url,
        latest.topic_id::text as latest_topic_id,
        latest.topic_title as latest_topic_title,
        latest.activity_at as latest_activity_at,
        latest.author_name as latest_author_name
      from wai_forum_boards b
      left join wai_forum_buildings wb on wb.board_id = b.id
      left join (
        select board_id, count(*) as topic_count
        from wai_forum_topics
        group by board_id
      ) topic_stats on topic_stats.board_id = b.id
      left join (
        select coalesce(m.board_id, t.board_id) as board_id, count(*) as post_count
        from wai_forum_messages m
        left join wai_forum_topics t on t.id = m.topic_id
        where m.deleted_at is null
        group by coalesce(m.board_id, t.board_id)
      ) message_stats on message_stats.board_id = b.id
      left join lateral (
        select
          t.id as topic_id,
          t.title as topic_title,
          coalesce(m.created_at, t.updated_at, t.created_at) as activity_at,
          coalesce(u.display_name, 'WAi Forward member') as author_name
        from wai_forum_topics t
        left join lateral (
          select author_user_id, created_at
          from wai_forum_messages
          where topic_id = t.id and deleted_at is null
          order by created_at desc
          limit 1
        ) m on true
        left join wai_forum_users u on u.id = coalesce(m.author_user_id, t.author_user_id)
        where t.board_id = b.id
        order by coalesce(m.created_at, t.updated_at, t.created_at) desc
        limit 1
      ) latest on true
      where b.visibility in ('public', 'members', 'company', 'private')
      order by b.sort_order, b.title
      `
    );
    writeJson(res, 200, { ok: true, boards: result.rows.map((row) => decorateForumBoard(req, row)) });
  } catch (error) {
    console.error(`Could not load WAi Forum boards API: ${error.message}`);
    writeJson(res, 500, { error: "forum_boards_failed" });
  }
}

async function handleForumApiBoard(req, res, boardRef) {
  if (!boardRef) {
    writeJson(res, 404, { error: "board_not_found" });
    return;
  }

  const db = await getDatabase();
  if (!db.ok) {
    writeJson(res, 503, { error: "persistence_unavailable", detail: db.error });
    return;
  }

  try {
    const boardResult = await db.pool.query(
      `
      select
        b.id::text,
        b.title,
        b.slug,
        b.description,
        b.visibility,
        wb.image_url
      from wai_forum_boards b
      left join wai_forum_buildings wb on wb.board_id = b.id
      where b.id::text = $1 or b.slug = $1
      limit 1
      `,
      [boardRef]
    );
    const board = boardResult.rows[0];
    if (!board) {
      writeJson(res, 404, { error: "board_not_found" });
      return;
    }

    const topicsResult = await db.pool.query(
      `
      select
        t.id::text,
        t.title,
        t.slug,
        t.status,
        t.pinned,
        t.locked,
        t.created_at,
        coalesce(message_stats.reply_count, 0)::int as reply_count,
        latest.activity_at as latest_activity_at,
        latest.author_name as latest_author_name
      from wai_forum_topics t
      left join (
        select topic_id, count(*) as reply_count
        from wai_forum_messages
        where deleted_at is null
        group by topic_id
      ) message_stats on message_stats.topic_id = t.id
      left join lateral (
        select
          m.created_at as activity_at,
          coalesce(u.display_name, 'WAi Forward member') as author_name
        from wai_forum_messages m
        left join wai_forum_users u on u.id = m.author_user_id
        where m.topic_id = t.id and m.deleted_at is null
        order by m.created_at desc
        limit 1
      ) latest on true
      where t.board_id::text = $1
      order by t.pinned desc, coalesce(latest.activity_at, t.updated_at, t.created_at) desc
      `,
      [board.id]
    );

    writeJson(res, 200, {
      ok: true,
      board: decorateForumBoard(req, board),
      topics: topicsResult.rows
    });
  } catch (error) {
    console.error(`Could not load WAi Forum board API: ${error.message}`);
    writeJson(res, 500, { error: "forum_board_failed" });
  }
}

async function handleForumApiTopic(req, res, topicRef) {
  if (!topicRef) {
    writeJson(res, 404, { error: "topic_not_found" });
    return;
  }

  const db = await getDatabase();
  if (!db.ok) {
    writeJson(res, 503, { error: "persistence_unavailable", detail: db.error });
    return;
  }

  try {
    const topicResult = await db.pool.query(
      `
      select
        t.id::text,
        t.title,
        t.slug,
        t.status,
        t.pinned,
        t.locked,
        t.created_at,
        b.id::text as board_id,
        b.title as board_title,
        coalesce(b.slug, b.id::text) as board_ref
      from wai_forum_topics t
      join wai_forum_boards b on b.id = t.board_id
      where t.id::text = $1 or t.slug = $1
      order by t.created_at desc
      limit 1
      `,
      [topicRef]
    );
    const topic = topicResult.rows[0];
    if (!topic) {
      writeJson(res, 404, { error: "topic_not_found" });
      return;
    }

    const postsResult = await db.pool.query(
      `
      select
        m.id::text,
        m.body,
        m.created_at,
        m.edited_at,
        coalesce(u.display_name, 'WAi Forward member') as author_name,
        u.profile_pic,
        u.color
      from wai_forum_messages m
      left join wai_forum_users u on u.id = m.author_user_id
      where m.topic_id::text = $1 and m.deleted_at is null
      order by m.created_at asc
      `,
      [topic.id]
    );

    writeJson(res, 200, { ok: true, topic, posts: postsResult.rows });
  } catch (error) {
    console.error(`Could not load WAi Forum topic API: ${error.message}`);
    writeJson(res, 500, { error: "forum_topic_failed" });
  }
}

async function handleGetWorld(req, res, forumSession) {
  const db = await getDatabase();
  if (!db.ok) {
    writeJson(res, 503, { error: "persistence_unavailable", detail: db.error });
    return;
  }

  await upsertForumUser(forumSession.user);
  const userId = forumSession.user.id;
  const client = await db.pool.connect();
  let inTransaction = false;
  try {
    await client.query("begin");
    inTransaction = true;
    const home = await ensurePlayerHome(client, forumSession.user);
    await client.query("commit");
    inTransaction = false;

    const [stateResult, plotsResult, buildingsResult, featuresResult, messagesResult, playersResult] = await Promise.all([
      client.query(
        `select gold, player_xp, home_xp, gold_xp_milestone, resources, items, hotbar, active_hotbar_slot, player_position
           from wai_forum_player_state
          where user_id = $1`,
        [userId]
      ),
      client.query(
        `select p.user_id, p.x, p.y, p.source, coalesce(u.display_name, 'WAi Forward member') as owner_name, u.color
           from wai_forum_user_plots p
           left join wai_forum_users u on u.id = p.user_id
          order by p.y, p.x`
      ),
      client.query(
        `select b.id, b.board_id, b.owner_user_id, coalesce(u.display_name, 'WAi Forward member') as owner_name, u.color,
                b.name, b.tiles, b.image_url, b.width, b.height, b.material_costs, b.art_meta, b.created_at
           from wai_forum_buildings b
           left join wai_forum_users u on u.id = b.owner_user_id
          order by b.created_at`
      ),
      client.query(
        `select user_id, x, y, feature_type, state, planted_at, next_check, grown
           from wai_forum_world_features`
      ),
      client.query(
        `select m.id, m.client_id, m.author_user_id, coalesce(u.display_name, 'WAi Forward member') as author_name, u.color,
                m.body, m.world_position, m.payload, m.created_at
           from wai_forum_messages m
           left join wai_forum_users u on u.id = m.author_user_id
          where m.message_kind = 'home-chat'
            and m.deleted_at is null
          order by m.created_at desc
          limit 120`
      ),
      client.query(
        `select ps.user_id, ps.player_position, ps.updated_at,
                coalesce(u.display_name, 'WAi Forward member') as display_name,
                u.email, u.color
           from wai_forum_player_state ps
           join wai_forum_users u on u.id = ps.user_id
          where ps.updated_at > now() - ($1::integer * interval '1 millisecond')
          order by ps.updated_at desc
          limit 80`,
        [PLAYER_ACTIVE_MS]
      )
    ]);

    const playerState = stateResult.rows[0] || null;
    writeJson(res, 200, {
      ok: true,
      world: {
        home: {
          originX: home.origin.x,
          originY: home.origin.y,
          minSpawnDistance: HOME_SPAWN_MIN_DISTANCE
        },
        player: playerState ? {
          gold: playerState.gold,
          playerXp: playerState.player_xp,
          homeXp: playerState.home_xp,
          goldXpMilestone: playerState.gold_xp_milestone,
          resources: playerState.resources || {},
          items: playerState.items || {},
          hotbar: playerState.hotbar || [],
          activeHotbarSlot: playerState.active_hotbar_slot || 0,
          position: playerState.player_position || {}
        } : null,
        players: playersResult.rows.map((row) => ({
          userId: row.user_id,
          name: row.display_name || "WAi Forward member",
          email: row.email || "",
          color: row.color || null,
          position: row.player_position || {},
          updatedAt: row.updated_at
        })),
        plots: plotsResult.rows.map((row) => ({
          ownerUserId: row.user_id,
          ownerName: row.owner_name || "WAi Forward member",
          ownerColor: row.color || null,
          x: row.x,
          y: row.y,
          source: row.source
        })),
        buildings: buildingsResult.rows.map((row) => ({
          id: row.id,
          boardId: row.board_id,
          ownerUserId: row.owner_user_id,
          ownerName: row.owner_name || "WAi Forward member",
          ownerColor: row.color || null,
          name: row.name,
          tiles: row.tiles || [],
          imageUrl: row.image_url,
          width: row.width,
          height: row.height,
          materialCosts: row.material_costs || {},
          artMeta: row.art_meta || {},
          createdAt: row.created_at
        })),
        features: featuresResult.rows.map((row) => ({
          ownerUserId: row.user_id,
          x: row.x,
          y: row.y,
          featureType: row.feature_type,
          state: row.state,
          plantedAt: row.planted_at,
          nextCheck: row.next_check,
          grown: row.grown
        })),
        homeMessages: messagesResult.rows.reverse().map((row) => ({
          id: row.client_id || row.id,
          authorUserId: row.author_user_id,
          author: row.payload?.author || row.author_name || "WAi Forward member",
          authorColor: row.color || null,
          message: row.body,
          time: row.payload?.time || formatMessageTime(row.created_at),
          createdAt: row.created_at,
          worldPosition: row.world_position || row.payload?.worldPosition || {},
          xpAwarded: row.payload?.xpAwarded || 0,
          qualityScore: row.payload?.qualityScore || 0,
          feedbackPenaltyApplied: Boolean(row.payload?.feedbackPenaltyApplied)
        }))
      }
    });
  } catch (error) {
    if (inTransaction) {
      try {
        await client.query("rollback");
      } catch (rollbackError) {
        console.warn(`Could not rollback WAi Forum world load: ${rollbackError.message}`);
      }
    }
    console.error(`Could not load WAi Forum world: ${error.message}`);
    writeJson(res, 500, { error: "world_load_failed" });
  } finally {
    client.release();
  }
}

async function handleGetLiveWorld(req, res, forumSession, url) {
  const db = await getDatabase();
  if (!db.ok) {
    writeJson(res, 503, { error: "persistence_unavailable", detail: db.error });
    return;
  }

  const messagesSince = validDateOrNull(url.searchParams.get("messages_since"));
  const messageParams = [];
  let messageSinceSql = "";
  if (messagesSince) {
    messageParams.push(messagesSince);
    messageSinceSql = "and m.created_at > $1::timestamptz";
  }

  try {
    const [playersResult, messagesResult] = await Promise.all([
      db.pool.query(
        `select ps.user_id, ps.player_position, ps.updated_at,
                coalesce(u.display_name, 'WAi Forward member') as display_name,
                u.email, u.color
           from wai_forum_player_state ps
           join wai_forum_users u on u.id = ps.user_id
          where ps.updated_at > now() - ($1::integer * interval '1 millisecond')
          order by ps.updated_at desc
          limit 80`,
        [PLAYER_ACTIVE_MS]
      ),
      db.pool.query(
        `select m.id, m.client_id, m.author_user_id, coalesce(u.display_name, 'WAi Forward member') as author_name, u.color,
                m.body, m.world_position, m.payload, m.created_at
           from wai_forum_messages m
           left join wai_forum_users u on u.id = m.author_user_id
          where m.message_kind = 'home-chat'
            and m.deleted_at is null
            ${messageSinceSql}
          order by m.created_at desc
          limit 40`,
        messageParams
      )
    ]);

    writeJson(res, 200, {
      ok: true,
      live: {
        players: playersResult.rows.map((row) => ({
          userId: row.user_id,
          name: row.display_name || "WAi Forward member",
          email: row.email || "",
          color: row.color || null,
          position: row.player_position || {},
          updatedAt: row.updated_at
        })),
        homeMessages: messagesResult.rows.reverse().map((row) => ({
          id: row.client_id || row.id,
          authorUserId: row.author_user_id,
          author: row.payload?.author || row.author_name || "WAi Forward member",
          authorColor: row.color || null,
          message: row.body,
          time: row.payload?.time || formatMessageTime(row.created_at),
          createdAt: row.created_at,
          worldPosition: row.world_position || row.payload?.worldPosition || {},
          xpAwarded: row.payload?.xpAwarded || 0,
          qualityScore: row.payload?.qualityScore || 0,
          feedbackPenaltyApplied: Boolean(row.payload?.feedbackPenaltyApplied)
        }))
      }
    });
  } catch (error) {
    console.error(`Could not load WAi Forum live world: ${error.message}`);
    writeJson(res, 500, { error: "live_world_load_failed" });
  }
}

async function handlePutWorld(req, res, forumSession) {
  const db = await getDatabase();
  if (!db.ok) {
    writeJson(res, 503, { error: "persistence_unavailable", detail: db.error });
    return;
  }

  const data = await readJson(req);
  const world = data.world || {};
  const userId = forumSession.user.id;
  const player = sanitizePlayerState(world.player || {});
  const plots = sanitizePlots(filterUserOwnedPayload(world.plots, userId, ["ownerUserId", "userId"]));
  const buildings = sanitizeBuildings(filterUserOwnedPayload(world.buildings, userId, ["ownerUserId"]));
  const features = sanitizeFeatures(filterUserOwnedPayload(world.features, userId, ["ownerUserId", "userId"]));
  const homeMessages = sanitizeHomeMessages(filterUserOwnedPayload(world.homeMessages, userId, ["authorUserId", "ownerUserId", "userId"]), forumSession.user);

  await upsertForumUser(forumSession.user);
  const client = await db.pool.connect();
  try {
    await client.query("begin");
    const home = await ensurePlayerHome(client, forumSession.user);
    await client.query(
      `insert into wai_forum_player_state
        (user_id, gold, player_xp, home_xp, gold_xp_milestone, resources, items, hotbar, active_hotbar_slot, player_position, updated_at)
       values ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8::jsonb, $9, $10::jsonb, now())
       on conflict (user_id) do update set
        gold = excluded.gold,
        player_xp = excluded.player_xp,
        home_xp = excluded.home_xp,
        gold_xp_milestone = excluded.gold_xp_milestone,
        resources = excluded.resources,
        items = excluded.items,
        hotbar = excluded.hotbar,
        active_hotbar_slot = excluded.active_hotbar_slot,
        player_position = excluded.player_position,
        updated_at = now()`,
      [
        userId,
        player.gold,
        player.playerXp,
        player.homeXp,
        player.goldXpMilestone,
        JSON.stringify(player.resources),
        JSON.stringify(player.items),
        JSON.stringify(player.hotbar),
        player.activeHotbarSlot,
        JSON.stringify(player.position)
      ]
    );

    await client.query("delete from wai_forum_user_plots where user_id = $1", [userId]);
    for (const plot of plots) {
      await client.query(
        `insert into wai_forum_user_plots (user_id, x, y, source)
         values ($1, $2, $3, $4)
         on conflict (user_id, x, y) do update set source = excluded.source`,
        [userId, plot.x, plot.y, plot.source]
      );
    }
    await ensureStarterPlotsForUser(client, userId, home.origin);

    const existingBuildings = await client.query(
      `select id, board_id
         from wai_forum_buildings
        where owner_user_id = $1`,
      [userId]
    );
    const nextBuildingIds = new Set(buildings.map((building) => building.id));
    const removedBuildings = existingBuildings.rows.filter((row) => !nextBuildingIds.has(row.id));
    const removedBuildingIds = removedBuildings.map((row) => row.id);
    const removedBoardIds = [...new Set([
      ...removedBuildings.map((row) => row.board_id).filter(Boolean),
      ...removedBuildingIds
    ])];

    if (removedBuildingIds.length) {
      await client.query(
        `delete from wai_forum_messages
          where building_id = any($1::uuid[])`,
        [removedBuildingIds]
      );
      await client.query(
        `delete from wai_forum_topics
          where id in (
            select topic_id
              from wai_forum_rooms
             where building_id = any($1::uuid[])
               and topic_id is not null
          )`,
        [removedBuildingIds]
      );
      await client.query(
        `delete from wai_forum_rooms
          where building_id = any($1::uuid[])`,
        [removedBuildingIds]
      );
      await client.query(
        `delete from wai_forum_buildings
          where owner_user_id = $1
            and id = any($2::uuid[])`,
        [userId, removedBuildingIds]
      );
    }

    if (removedBoardIds.length) {
      await client.query(
        `delete from wai_forum_boards
          where owner_user_id = $1
            and id = any($2::uuid[])`,
        [userId, removedBoardIds]
      );
    }

    const existingBuildingById = new Map(existingBuildings.rows.map((row) => [row.id, row]));
    const staleBoardIds = new Set();
    let boardIndex = 0;

    for (const building of buildings) {
      const existingBuilding = existingBuildingById.get(building.id);
      const boardBuilding = isBoardBuilding(building);
      let boardId = null;

      if (boardBuilding) {
        boardId = existingBuilding?.board_id || building.id;
        const boardMeta = boardForumMeta(building, boardIndex++);

        await client.query(
          `insert into wai_forum_boards
            (id, owner_user_id, title, slug, description, visibility, professional_meta, updated_at)
           values ($1::uuid, $2, $3, $4, $5, $6, $7::jsonb, now())
           on conflict (id) do update set
            title = excluded.title,
            slug = excluded.slug,
            description = excluded.description,
            visibility = excluded.visibility,
            professional_meta = excluded.professional_meta,
            updated_at = now()
           where wai_forum_boards.owner_user_id = excluded.owner_user_id`,
          [
            boardId,
            userId,
            boardMeta.title,
            boardMeta.slug,
            boardMeta.description,
            boardMeta.visibility,
            JSON.stringify(boardMeta.professionalMeta)
          ]
        );
      } else if (existingBuilding?.board_id) {
        staleBoardIds.add(existingBuilding.board_id);
      }

      await client.query(
        `insert into wai_forum_buildings
          (id, board_id, owner_user_id, name, tiles, image_url, width, height, material_costs, art_meta, updated_at)
         values ($1::uuid, $2::uuid, $3, $4, $5::jsonb, $6, $7, $8, $9::jsonb, $10::jsonb, now())
         on conflict (id) do update set
          board_id = excluded.board_id,
          name = excluded.name,
          tiles = excluded.tiles,
          image_url = excluded.image_url,
          width = excluded.width,
          height = excluded.height,
          material_costs = excluded.material_costs,
          art_meta = excluded.art_meta,
          updated_at = now()
         where wai_forum_buildings.owner_user_id = excluded.owner_user_id`,
        [
          building.id,
          boardId,
          userId,
          building.name,
          JSON.stringify(building.tiles),
          building.imageUrl,
          building.width,
          building.height,
          JSON.stringify(building.materialCosts),
          JSON.stringify(building.artMeta)
        ]
      );

      if (boardBuilding) {
        await upsertForumRoomsForBuilding(client, userId, building, boardId);
      }
    }

    if (staleBoardIds.size) {
      await client.query(
        `delete from wai_forum_boards
          where owner_user_id = $1
            and id = any($2::uuid[])`,
        [userId, [...staleBoardIds]]
      );
    }

    await client.query("delete from wai_forum_world_features where user_id = $1", [userId]);
    for (const feature of features) {
      await client.query(
        `insert into wai_forum_world_features
          (user_id, x, y, feature_type, state, planted_at, next_check, grown, updated_at)
         values ($1, $2, $3, $4, $5, $6, $7, $8, now())`,
        [
          userId,
          feature.x,
          feature.y,
          feature.featureType,
          feature.state,
          feature.plantedAt,
          feature.nextCheck,
          feature.grown
        ]
      );
    }

    for (const message of homeMessages) {
      const payload = JSON.stringify({
        author: message.author,
        time: message.time,
        worldPosition: message.worldPosition,
        xpAwarded: message.xpAwarded,
        qualityScore: message.qualityScore,
        feedbackPenaltyApplied: message.feedbackPenaltyApplied
      });
      const updateResult = await client.query(
        `update wai_forum_messages
            set body = $3,
                world_position = $4::jsonb,
                payload = $5::jsonb,
                created_at = coalesce($6::timestamptz, created_at)
          where author_user_id = $2
            and message_kind = 'home-chat'
            and client_id = $1`,
        [
          message.id,
          userId,
          message.message,
          JSON.stringify(message.worldPosition),
          payload,
          message.createdAt
        ]
      );
      if (updateResult.rowCount) continue;

      await client.query(
        `insert into wai_forum_messages
          (client_id, author_user_id, message_kind, body, world_position, payload, created_at)
         values ($1, $2, 'home-chat', $3, $4::jsonb, $5::jsonb, coalesce($6::timestamptz, now()))`,
        [
          message.id,
          userId,
          message.message,
          JSON.stringify(message.worldPosition),
          payload,
          message.createdAt
        ]
      );
    }

    await client.query("commit");
    writeJson(res, 200, { ok: true });
  } catch (error) {
    await client.query("rollback");
    console.error(`Could not save WAi Forum world: ${error.message}`);
    writeJson(res, 500, { error: "world_save_failed" });
  } finally {
    client.release();
  }
}

async function handlePutPlayerPosition(req, res, forumSession) {
  const db = await getDatabase();
  if (!db.ok) {
    writeJson(res, 503, { error: "persistence_unavailable", detail: db.error });
    return;
  }

  const data = await readJson(req);
  const position = sanitizePosition(data.position || data.player?.position || {});
  const userId = forumSession.user.id;

  await upsertForumUser(forumSession.user);
  const client = await db.pool.connect();
  try {
    await client.query("begin");
    await ensurePlayerHome(client, forumSession.user);
    await client.query(
      `insert into wai_forum_player_state (user_id, player_position, updated_at)
       values ($1, $2::jsonb, now())
       on conflict (user_id) do update set
        player_position = excluded.player_position,
        updated_at = now()`,
      [userId, JSON.stringify(position)]
    );
    await client.query("commit");
    writeJson(res, 200, { ok: true });
  } catch (error) {
    await client.query("rollback");
    console.error(`Could not save WAi Forum player position: ${error.message}`);
    writeJson(res, 500, { error: "player_position_save_failed" });
  } finally {
    client.release();
  }
}

async function ensurePlayerHome(client, user) {
  const userId = user.id;
  const homesResult = await client.query(
    `select u.id, u.created_at,
            min(p.x) as min_x,
            max(p.x) as max_x,
            min(p.y) as min_y,
            max(p.y) as max_y,
            count(p.x)::integer as starter_count
       from wai_forum_users u
       left join wai_forum_user_plots p
         on p.user_id = u.id
        and p.source = 'starter'
      group by u.id, u.created_at
      order by u.created_at asc, u.id asc`
  );
  const homes = homesResult.rows.map((row) => ({
    userId: row.id,
    center: homeCenterFromRow(row)
  }));
  const currentIndex = homes.findIndex((home) => home.userId === userId);
  const currentHome = homes[currentIndex] || { userId, center: null };
  const olderCenters = homes.slice(0, Math.max(0, currentIndex)).map((home) => home.center).filter(Boolean);
  const otherCenters = homes.filter((home) => home.userId !== userId).map((home) => home.center).filter(Boolean);

  let origin = currentHome.center;
  let moved = false;

  if (!origin) {
    origin = chooseHomeOrigin(otherCenters);
    await ensurePlayerStateExists(client, userId, origin);
    await ensureStarterPlotsForUser(client, userId, origin);
    await ensureStarterGateFeatures(client, userId, origin, false);
    return { origin, moved, created: true };
  }

  if (olderCenters.some((center) => homeCentersTooClose(origin, center))) {
    const target = chooseHomeOrigin(otherCenters);
    await translateUserWorld(client, userId, origin, target);
    origin = target;
    moved = true;
  }

  await ensurePlayerStateExists(client, userId, origin);
  await ensureStarterPlotsForUser(client, userId, origin);
  await ensureStarterGateFeatures(client, userId, origin, true);
  return { origin, moved, created: false };
}

function homeCenterFromRow(row) {
  if (!row || !row.starter_count) return null;
  const minX = safeInt(row.min_x);
  const maxX = safeInt(row.max_x);
  const minY = safeInt(row.min_y);
  const maxY = safeInt(row.max_y);
  if (![minX, maxX, minY, maxY].every(Number.isInteger)) return null;
  return {
    x: Math.round((minX + maxX) / 2),
    y: Math.round((minY + maxY) / 2)
  };
}

function homeCentersTooClose(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y) < HOME_SPAWN_MIN_DISTANCE;
}

function chooseHomeOrigin(existingCenters = []) {
  const centers = existingCenters.filter(Boolean);
  for (let ring = 0; ring < 200; ring++) {
    const candidates = [];
    for (let gx = -ring; gx <= ring; gx++) {
      for (let gy = -ring; gy <= ring; gy++) {
        if (Math.max(Math.abs(gx), Math.abs(gy)) !== ring) continue;
        candidates.push({ x: gx * HOME_SPAWN_STEP, y: gy * HOME_SPAWN_STEP });
      }
    }
    candidates.sort((a, b) => Math.hypot(a.x, a.y) - Math.hypot(b.x, b.y));
    for (const candidate of candidates) {
      if (!centers.some((center) => homeCentersTooClose(candidate, center))) return candidate;
    }
  }
  return { x: (centers.length + 1) * HOME_SPAWN_STEP, y: 0 };
}

async function ensurePlayerStateExists(client, userId, origin) {
  const result = await client.query(
    `select player_position
       from wai_forum_player_state
      where user_id = $1`,
    [userId]
  );
  const defaultPosition = { x: origin.x, y: origin.y, facing: 1, mode: "world" };
  if (!result.rows.length) {
    await client.query(
      `insert into wai_forum_player_state (user_id, player_position, updated_at)
       values ($1, $2::jsonb, now())`,
      [userId, JSON.stringify(defaultPosition)]
    );
    return;
  }

  const position = result.rows[0].player_position || {};
  if (!Number.isFinite(Number(position.x)) || !Number.isFinite(Number(position.y))) {
    await client.query(
      `update wai_forum_player_state
          set player_position = $2::jsonb,
              updated_at = now()
        where user_id = $1`,
      [userId, JSON.stringify(defaultPosition)]
    );
  }
}

async function ensureStarterPlotsForUser(client, userId, origin) {
  for (const plot of starterPlotsForOrigin(origin)) {
    await client.query(
      `insert into wai_forum_user_plots (user_id, x, y, source)
       values ($1, $2, $3, 'starter')
       on conflict (user_id, x, y) do update set source = 'starter'`,
      [userId, plot.x, plot.y]
    );
  }
}

function starterPlotsForOrigin(origin) {
  const plots = [];
  for (let y = HOME_MIN_Y; y <= HOME_MAX_Y; y++) {
    for (let x = HOME_MIN_X; x <= HOME_MAX_X; x++) {
      plots.push({ x: origin.x + x, y: origin.y + y });
    }
  }
  return plots;
}

async function ensureStarterGateFeatures(client, userId, origin, onlyIfMissing) {
  if (onlyIfMissing) {
    const existing = await client.query(
      `select 1
         from wai_forum_world_features
        where user_id = $1
          and feature_type like $2
        limit 1`,
      [userId, `${HOME_GATE_FEATURE_PREFIX}%`]
    );
    if (existing.rows.length) return;
  }

  for (const gate of starterGateFeaturesForOrigin(origin)) {
    await client.query(
      `insert into wai_forum_world_features
        (user_id, x, y, feature_type, state, updated_at)
       values ($1, $2, $3, $4, 'gate', now())
       on conflict (user_id, x, y, feature_type) do update set
        state = 'gate',
        updated_at = now()`,
      [userId, gate.x, gate.y, gate.featureType]
    );
  }
}

function starterGateFeaturesForOrigin(origin) {
  return [
    { x: origin.x, y: origin.y + HOME_MAX_Y, featureType: `${HOME_GATE_FEATURE_PREFIX}south` },
    { x: origin.x + HOME_MAX_X, y: origin.y, featureType: `${HOME_GATE_FEATURE_PREFIX}east` }
  ];
}

async function translateUserWorld(client, userId, fromOrigin, toOrigin) {
  const dx = toOrigin.x - fromOrigin.x;
  const dy = toOrigin.y - fromOrigin.y;
  if (!dx && !dy) return;

  await client.query(
    `update wai_forum_user_plots
        set x = x + $2,
            y = y + $3
      where user_id = $1`,
    [userId, dx, dy]
  );
  await client.query(
    `update wai_forum_world_features
        set x = x + $2,
            y = y + $3,
            updated_at = now()
      where user_id = $1`,
    [userId, dx, dy]
  );

  const buildings = await client.query(
    `select id, tiles
       from wai_forum_buildings
      where owner_user_id = $1`,
    [userId]
  );
  for (const building of buildings.rows) {
    await client.query(
      `update wai_forum_buildings
          set tiles = $2::jsonb,
              updated_at = now()
        where owner_user_id = $1
          and id = $3::uuid`,
      [userId, JSON.stringify(translateTiles(building.tiles, dx, dy)), building.id]
    );
  }

  const stateResult = await client.query(
    `select player_position
       from wai_forum_player_state
      where user_id = $1`,
    [userId]
  );
  if (stateResult.rows.length) {
    await client.query(
      `update wai_forum_player_state
          set player_position = $2::jsonb,
              updated_at = now()
        where user_id = $1`,
      [userId, JSON.stringify(translatePosition(stateResult.rows[0].player_position || {}, dx, dy))]
    );
  }

  const messages = await client.query(
    `select id, world_position, payload
       from wai_forum_messages
      where author_user_id = $1
        and message_kind = 'home-chat'`,
    [userId]
  );
  for (const message of messages.rows) {
    const payload = plainObject(message.payload);
    if (payload.worldPosition) payload.worldPosition = translatePosition(payload.worldPosition, dx, dy);
    await client.query(
      `update wai_forum_messages
          set world_position = $2::jsonb,
              payload = $3::jsonb
        where id = $1::uuid`,
      [
        message.id,
        JSON.stringify(translatePosition(message.world_position || {}, dx, dy)),
        JSON.stringify(payload)
      ]
    );
  }
}

function translateTiles(tiles, dx, dy) {
  return uniqueIntegerTiles(tiles).map((tile) => ({ x: tile.x + dx, y: tile.y + dy }));
}

function translatePosition(value, dx, dy) {
  const position = plainObject(value);
  if (Number.isFinite(Number(position.x))) position.x = Number(position.x) + dx;
  if (Number.isFinite(Number(position.y))) position.y = Number(position.y) + dy;
  if (position.previousWorldPosition && typeof position.previousWorldPosition === "object") {
    position.previousWorldPosition = translatePosition(position.previousWorldPosition, dx, dy);
  }
  return position;
}

function filterUserOwnedPayload(items, userId, fields) {
  return (Array.isArray(items) ? items : []).filter((item) => {
    const owner = fields.map((field) => item?.[field]).find((value) => typeof value === "string" && value);
    return !owner || owner === userId;
  });
}

async function getDatabase() {
  if (!databaseUrl) return { ok: false, error: "Set data/db-uri.json, WAI_FORUM_DATABASE_URL, or DATABASE_URL." };
  if (!dbPoolPromise) {
    dbPoolPromise = import("pg")
      .then(({ Pool }) => {
        const pool = new Pool({ connectionString: databaseUrl });
        pool.on("error", (error) => console.error(`WAi Forum database error: ${error.message}`));
        return pool;
      })
      .catch((error) => ({ importError: error }));
  }

  const pool = await dbPoolPromise;
  if (pool?.importError) {
    return { ok: false, error: "Install dependencies with npm install so the pg package is available." };
  }
  return { ok: true, pool };
}

async function checkDatabaseConnection() {
  const db = await getDatabase();
  if (!db.ok) {
    console.warn(`WAi Forum database unavailable: ${db.error}`);
    return;
  }

  try {
    await db.pool.query("select 1");
    console.log("WAi Forum database connected successfully.");
  } catch (error) {
    console.error(`WAi Forum database connection failed: ${error.message}`);
  }
}

async function upsertForumUser(user) {
  const db = await getDatabase();
  if (!db.ok || !user?.id) return;
  try {
    await db.pool.query(
      `insert into wai_forum_users
        (id, customer_id, display_name, email, roles, profile_pic, color, updated_at)
       values ($1, $2, $3, $4, $5::jsonb, $6, $7, now())
       on conflict (id) do update set
        customer_id = excluded.customer_id,
        display_name = excluded.display_name,
        email = excluded.email,
        roles = excluded.roles,
        profile_pic = excluded.profile_pic,
        color = excluded.color,
        updated_at = now()`,
      [
        user.id,
        user.customer_id || null,
        user.name || user.email || "WAi Forward member",
        user.email || "",
        JSON.stringify(Array.isArray(user.roles) ? user.roles : []),
        user.profile_pic || null,
        user.color || null
      ]
    );
  } catch (error) {
    console.warn(`Could not upsert WAi Forum user: ${error.message}`);
  }
}

function sanitizePlayerState(value) {
  return {
    gold: nonNegativeInt(value.gold, 12),
    playerXp: nonNegativeInt(value.playerXp, 0),
    homeXp: nonNegativeInt(value.homeXp, 0),
    goldXpMilestone: nonNegativeInt(value.goldXpMilestone, 0),
    resources: plainNumberMap(value.resources),
    items: plainNumberMap(value.items),
    hotbar: Array.isArray(value.hotbar) ? value.hotbar.slice(0, 10).map((item) => item || null) : [],
    activeHotbarSlot: nonNegativeInt(value.activeHotbarSlot, 0),
    position: sanitizePosition(value.position)
  };
}

function sanitizePlots(plots) {
  const seen = new Set();
  return (Array.isArray(plots) ? plots : []).map((plot) => ({
    x: safeInt(plot?.x),
    y: safeInt(plot?.y),
    source: String(plot?.source || "purchased").slice(0, 40)
  })).filter((plot) => {
    const key = `${plot.x},${plot.y}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return Number.isInteger(plot.x) && Number.isInteger(plot.y);
  });
}

function sanitizeBuildings(buildings) {
  return (Array.isArray(buildings) ? buildings : [])
    .filter((building) => isUuid(building?.id))
    .slice(0, 500)
    .map((building) => ({
      id: building.id,
      boardId: isUuid(building.boardId) ? building.boardId : null,
      name: String(building.name || "Building").slice(0, 120),
      tiles: Array.isArray(building.tiles) ? building.tiles.map((tile) => ({ x: safeInt(tile?.x), y: safeInt(tile?.y) })) : [],
      imageUrl: typeof building.imageUrl === "string" ? building.imageUrl : null,
      width: nonNegativeInt(building.width, 0),
      height: nonNegativeInt(building.height, 0),
      materialCosts: plainNumberMap(building.materialCosts),
      artMeta: plainObject(building.artMeta)
    }));
}

function isBoardBuilding(building) {
  return building?.artMeta?.buildType !== "decoration";
}

function boardForumMeta(building, index) {
  const artMeta = building.artMeta || {};
  const buildingName = String(building.name || "").trim();
  const explicitTitle = artMeta.forumTitle || artMeta.name || (buildingName && buildingName !== "Building" ? buildingName : "");
  const title = String(explicitTitle || `Building Board ${index + 1}`)
    .trim()
    .slice(0, 120) || `Building Board ${index + 1}`;
  const savedDescription = String(artMeta.forumDescription || artMeta.description || "").trim();
  const description = (savedDescription || `${building.tiles.length} plot building board.`).slice(0, 500);
  const visibility = sanitizeForumVisibility(artMeta.visibility);

  return {
    title,
    slug: forumSlug(title, building.id),
    description,
    visibility,
    professionalMeta: {
      buildingId: building.id,
      buildType: "board"
    }
  };
}

async function upsertForumRoomsForBuilding(client, userId, building, boardId) {
  const rooms = forumRoomsForBuilding(building);
  const topicIds = [];
  const roomIds = [];

  for (const room of rooms) {
    const topicId = deterministicUuid(`${building.id}:topic:${room.id}`);
    const roomDbId = deterministicUuid(`${building.id}:room:${room.id}`);
    const topicMeta = {
      buildingId: building.id,
      roomId: room.id
    };

    topicIds.push(topicId);
    roomIds.push(roomDbId);

    await client.query(
      `insert into wai_forum_topics
        (id, board_id, author_user_id, title, slug, professional_meta, updated_at)
       values ($1::uuid, $2::uuid, $3, $4, $5, $6::jsonb, now())
       on conflict (id) do update set
        board_id = excluded.board_id,
        title = excluded.title,
        slug = excluded.slug,
        professional_meta = excluded.professional_meta,
        updated_at = now()`,
      [
        topicId,
        boardId,
        userId,
        room.name,
        forumSlug(room.name, room.id),
        JSON.stringify(topicMeta)
      ]
    );

    await client.query(
      `insert into wai_forum_rooms
        (id, topic_id, building_id, owner_user_id, name, world_position, room_meta, art_meta, updated_at)
       values ($1::uuid, $2::uuid, $3::uuid, $4, $5, $6::jsonb, $7::jsonb, $8::jsonb, now())
       on conflict (id) do update set
        topic_id = excluded.topic_id,
        building_id = excluded.building_id,
        owner_user_id = excluded.owner_user_id,
        name = excluded.name,
        world_position = excluded.world_position,
        room_meta = excluded.room_meta,
        art_meta = excluded.art_meta,
        updated_at = now()`,
      [
        roomDbId,
        topicId,
        building.id,
        userId,
        room.name,
        JSON.stringify({ buildingId: building.id, roomId: room.id }),
        JSON.stringify({ tiles: room.tiles }),
        JSON.stringify({ source: "world-building" })
      ]
    );
  }

  await client.query(
    `delete from wai_forum_topics
      where board_id = $1::uuid
        and professional_meta->>'buildingId' = $3
        and not (id = any($2::uuid[]))`,
    [boardId, topicIds, building.id]
  );
  await client.query(
    `delete from wai_forum_rooms
      where building_id = $1::uuid
        and not (id = any($2::uuid[]))`,
    [building.id, roomIds]
  );
}

function forumRoomsForBuilding(building) {
  const baseTiles = uniqueIntegerTiles(building.tiles);
  const rooms = [{
    id: "main",
    name: "Main room",
    tiles: baseTiles
  }];

  const extraRooms = Array.isArray(building.artMeta?.extraRooms) ? building.artMeta.extraRooms : [];
  for (const extraRoom of extraRooms) {
    const id = String(extraRoom?.id || "").slice(0, 80);
    const tiles = uniqueIntegerTiles(extraRoom?.tiles);
    if (!id || !tiles.length) continue;

    rooms.push({
      id,
      name: String(extraRoom?.name || `Room ${rooms.length + 1}`).trim().slice(0, 120) || `Room ${rooms.length + 1}`,
      tiles
    });
  }

  return rooms;
}

function uniqueIntegerTiles(tiles) {
  const seen = new Set();
  const output = [];
  if (!Array.isArray(tiles)) return output;

  for (const tile of tiles) {
    const x = safeInt(tile?.x);
    const y = safeInt(tile?.y);
    const key = `${x},${y}`;
    if (!Number.isInteger(x) || !Number.isInteger(y) || seen.has(key)) continue;
    seen.add(key);
    output.push({ x, y });
  }

  return output;
}

function sanitizeForumVisibility(value) {
  const visibility = String(value || "public").toLowerCase();
  return ["public", "members", "company", "private"].includes(visibility) ? visibility : "public";
}

function forumSlug(title, id) {
  const stem = String(title || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64) || "board";
  return `${stem}-${String(id).slice(0, 8)}`;
}

function deterministicUuid(seed) {
  const hex = createHash("sha256").update(String(seed)).digest("hex").slice(0, 32).split("");
  hex[12] = "5";
  hex[16] = ((parseInt(hex[16], 16) & 0x3) | 0x8).toString(16);
  return `${hex.slice(0, 8).join("")}-${hex.slice(8, 12).join("")}-${hex.slice(12, 16).join("")}-${hex.slice(16, 20).join("")}-${hex.slice(20, 32).join("")}`;
}

function sanitizeFeatures(features) {
  return (Array.isArray(features) ? features : []).slice(0, 2000).map((feature) => ({
    x: safeInt(feature?.x),
    y: safeInt(feature?.y),
    featureType: String(feature?.featureType || "feature").slice(0, 40),
    state: String(feature?.state || "changed").slice(0, 40),
    plantedAt: nullableInt(feature?.plantedAt),
    nextCheck: nullableInt(feature?.nextCheck),
    grown: Boolean(feature?.grown)
  })).filter((feature) => Number.isInteger(feature.x) && Number.isInteger(feature.y));
}

function sanitizeHomeMessages(messages, user) {
  return (Array.isArray(messages) ? messages : []).slice(-80).map((message) => ({
    id: typeof message?.id === "string" ? message.id.slice(0, 120) : null,
    author: String(message?.author || user?.name || "You").slice(0, 120),
    message: String(message?.message || "").slice(0, 1000),
    time: String(message?.time || "").slice(0, 40),
    createdAt: validDateOrNull(message?.createdAt),
    worldPosition: sanitizePosition(message?.worldPosition || message?.position || {}),
    xpAwarded: nonNegativeInt(message?.xpAwarded, 0),
    qualityScore: nonNegativeInt(message?.qualityScore, 0),
    feedbackPenaltyApplied: Boolean(message?.feedbackPenaltyApplied)
  })).filter((message) => message.message);
}

function sanitizePosition(value) {
  const input = plainObject(value);
  const output = {};
  for (const key of ["x", "y", "z", "facing"]) {
    const number = Number(input[key]);
    if (Number.isFinite(number)) output[key] = number;
  }
  output.mode = input.mode === "room" ? "room" : "world";
  if (isUuid(input.roomBuildingId)) output.roomBuildingId = input.roomBuildingId;
  if (input.previousWorldPosition && typeof input.previousWorldPosition === "object") {
    output.previousWorldPosition = sanitizePosition(input.previousWorldPosition);
  }
  return output;
}

function safeInt(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.trunc(number) : null;
}

function nullableInt(value) {
  const number = safeInt(value);
  return Number.isInteger(number) ? number : null;
}

function nonNegativeInt(value, fallback) {
  const number = safeInt(value);
  return Number.isInteger(number) && number >= 0 ? number : fallback;
}

function plainNumberMap(value) {
  const output = {};
  if (!value || typeof value !== "object" || Array.isArray(value)) return output;
  for (const [key, amount] of Object.entries(value)) {
    const number = nonNegativeInt(amount, 0);
    if (/^[a-z0-9_-]{1,64}$/i.test(key)) output[key] = number;
  }
  return output;
}

function plainObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return JSON.parse(JSON.stringify(value));
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ""));
}

function validDateOrNull(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function formatMessageTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function handlePreviewBuildingStatus(res) {
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  const credentials = apiKey ? null : loadGoogleCredentials();
  res.writeHead(200, { "content-type": "application/json" });
  res.end(JSON.stringify({
    ok: Boolean(apiKey || credentials),
    model,
    auth: apiKey ? "api-key" : credentials ? "service-account" : "missing",
    project: process.env.GOOGLE_CLOUD_PROJECT || credentials?.project_id || defaultVertexProject,
    location: defaultVertexLocation
  }));
}

async function handlePreviewBuilding(req, res) {
  const data = await readJson(req);
  const composite = dataUrlToInlineData(data.compositeImage);
  const base = dataUrlToInlineData(data.baseImage);
  const doodle = dataUrlToInlineData(data.doodleImage);
  const assetType = data.assetType === "decoration" ? "decoration" : "building";
  const prompt = [
    data.prompt || `Create a 2D isometric game ${assetType} sprite.`,
    "Reference image order: first is the plot screenshot with the user's doodle drawn in place, second is the clean plot screenshot, third is the doodle alone.",
    "The doodle is the most important design constraint. Preserve its main shape, footprint, color hints, and visual intent while making it production-ready.",
    `Return one clean transparent-background PNG game asset with true alpha transparency around the ${assetType}, not a black or solid-color backdrop. Do not include any player character, flowers, fences, grid lines, UI, text, or screenshot background.`
  ].join(" ");

  let response;
  try {
    response = await generateBuildingImage({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            composite ? { inlineData: composite } : null,
            base ? { inlineData: base } : null,
            doodle ? { inlineData: doodle } : null
          ].filter(Boolean)
        }
      ],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"]
      }
    });
  } catch (error) {
    res.writeHead(error.status || 500, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: error.message || "Image preview failed" }));
    return;
  }

  if (!response.ok) {
    res.writeHead(response.status, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: await response.text() }));
    return;
  }

  const result = await response.json();
  const part = result?.candidates?.[0]?.content?.parts?.find((item) => item.inlineData || item.inline_data);
  const inline = part?.inlineData || part?.inline_data;
  if (!inline?.data) {
    res.writeHead(500, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "Google response did not include image data" }));
    return;
  }

  const mimeType = inline.mimeType || inline.mime_type || "image/png";
  res.writeHead(200, { "content-type": "application/json" });
  res.end(JSON.stringify({ url: `data:${mimeType};base64,${inline.data}` }));
}

async function handleBuildingAssetLibrary(req, res, forumSession) {
  const userSegment = safePathSegment(forumSession.user.id || "user");
  if (assetBucket) {
    await handleCloudBuildingAssetLibrary(req, res, userSegment);
    return;
  }

  const assetDir = join(root, "generated", "building-assets", userSegment);
  const manifest = await readAssetManifest(assetDir);
  const manifestItems = Array.isArray(manifest.assets) ? manifest.assets : [];
  const byUrl = new Map();

  for (const item of manifestItems) {
    const asset = sanitizeAssetManifestItem(item);
    if (asset) byUrl.set(asset.url, asset);
  }

  try {
    const files = await readdir(assetDir);
    for (const file of files) {
      if (!/\.(png|jpe?g|webp)$/i.test(file)) continue;
      const url = `/generated/building-assets/${userSegment}/${file}`;
      if (!byUrl.has(url)) {
        const id = file.replace(/\.(png|jpe?g|webp)$/i, "");
        byUrl.set(url, {
          id,
          name: "Saved Asset",
          assetType: "board",
          url,
          width: 0,
          height: 0,
          createdAt: null,
          source: "generated"
        });
      }
    }
  } catch (error) {
    if (error.code !== "ENOENT") console.warn(`Could not scan building assets: ${error.message}`);
  }

  const assets = [...byUrl.values()].sort((a, b) => {
    const left = Date.parse(a.createdAt || "") || 0;
    const right = Date.parse(b.createdAt || "") || 0;
    return right - left;
  });

  writeJson(res, 200, { ok: true, assets });
}

async function handleBuildingAssetUpload(req, res, forumSession) {
  const data = await readJson(req);
  const buildingId = String(data.buildingId || "");
  if (!isUuid(buildingId)) {
    writeJson(res, 400, { error: "invalid_building_id" });
    return;
  }

  const image = dataUrlToImageAsset(data.imageData || data.imageUrl);
  if (!image) {
    writeJson(res, 400, { error: "invalid_building_image" });
    return;
  }

  if (image.buffer.length > 10_000_000) {
    writeJson(res, 413, { error: "building_image_too_large" });
    return;
  }

  const userSegment = safePathSegment(forumSession.user.id || "user");
  if (assetBucket) {
    await handleCloudBuildingAssetUpload(req, res, userSegment, buildingId, image, data);
    return;
  }

  const assetDir = join(root, "generated", "building-assets", userSegment);
  const filename = `${buildingId}.${image.extension}`;
  await mkdir(assetDir, { recursive: true });
  await writeFile(join(assetDir, filename), image.buffer);
  const url = `/generated/building-assets/${userSegment}/${filename}`;
  const manifest = await readAssetManifest(assetDir);
  const assets = Array.isArray(manifest.assets) ? manifest.assets.map(sanitizeAssetManifestItem).filter(Boolean) : [];
  const nextAsset = sanitizeAssetManifestItem({
    id: buildingId,
    name: data.name,
    assetType: data.assetType,
    url,
    width: data.width,
    height: data.height,
    createdAt: new Date().toISOString(),
    source: data.source || "generated"
  });
  const nextAssets = [
    nextAsset,
    ...assets.filter((asset) => asset.id !== buildingId && asset.url !== url)
  ].filter(Boolean).slice(0, 240);
  await writeAssetManifest(assetDir, { assets: nextAssets });

  writeJson(res, 200, {
    ok: true,
    url,
    asset: nextAsset
  });
}

async function handleCloudBuildingAssetLibrary(req, res, userSegment) {
  const manifest = await readCloudAssetManifest(userSegment);
  const assets = (Array.isArray(manifest.assets) ? manifest.assets : [])
    .map(sanitizeAssetManifestItem)
    .filter(Boolean)
    .sort((a, b) => {
      const left = Date.parse(a.createdAt || "") || 0;
      const right = Date.parse(b.createdAt || "") || 0;
      return right - left;
    });
  writeJson(res, 200, { ok: true, assets });
}

async function handleCloudBuildingAssetUpload(req, res, userSegment, buildingId, image, data) {
  const objectName = `${assetPrefix}/${userSegment}/${buildingId}.${image.extension}`;
  await uploadCloudStorageObject(objectName, image.buffer, image.mimeType);
  const url = publicCloudStorageUrl(objectName);
  const manifest = await readCloudAssetManifest(userSegment);
  const assets = Array.isArray(manifest.assets) ? manifest.assets.map(sanitizeAssetManifestItem).filter(Boolean) : [];
  const nextAsset = sanitizeAssetManifestItem({
    id: buildingId,
    name: data.name,
    assetType: data.assetType,
    url,
    width: data.width,
    height: data.height,
    createdAt: new Date().toISOString(),
    source: data.source || "generated"
  });
  const nextAssets = [
    nextAsset,
    ...assets.filter((asset) => asset.id !== buildingId && asset.url !== url)
  ].filter(Boolean).slice(0, 240);
  await writeCloudAssetManifest(userSegment, { assets: nextAssets });

  writeJson(res, 200, {
    ok: true,
    url,
    asset: nextAsset
  });
}

function cloudAssetManifestObjectName(userSegment) {
  return `${assetPrefix}/${userSegment}/manifest.json`;
}

async function readCloudAssetManifest(userSegment) {
  try {
    const response = await fetch(
      `https://storage.googleapis.com/storage/v1/b/${encodeURIComponent(assetBucket)}/o/${encodeURIComponent(cloudAssetManifestObjectName(userSegment))}?alt=media`,
      { headers: await cloudStorageHeaders() }
    );
    if (response.status === 404) return { assets: [] };
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
  } catch (error) {
    console.warn(`Could not read cloud building asset manifest: ${error.message}`);
    return { assets: [] };
  }
}

async function writeCloudAssetManifest(userSegment, manifest) {
  await uploadCloudStorageObject(
    cloudAssetManifestObjectName(userSegment),
    Buffer.from(JSON.stringify(manifest, null, 2)),
    "application/json; charset=utf-8"
  );
}

async function uploadCloudStorageObject(objectName, buffer, contentType) {
  const response = await fetch(
    `https://storage.googleapis.com/upload/storage/v1/b/${encodeURIComponent(assetBucket)}/o?uploadType=media&name=${encodeURIComponent(objectName)}`,
    {
      method: "POST",
      headers: {
        ...(await cloudStorageHeaders()),
        "content-type": contentType || "application/octet-stream"
      },
      body: buffer
    }
  );
  if (!response.ok) {
    throw new Error(`Cloud Storage upload failed: ${await response.text()}`);
  }
}

async function cloudStorageHeaders() {
  const credentials = loadGoogleCredentials();
  const accessToken = credentials
    ? await getServiceAccountAccessToken(credentials)
    : await getCloudRunAccessToken();
  if (!accessToken) {
    throw new Error("No Google credentials found for Cloud Storage asset persistence.");
  }
  return { authorization: `Bearer ${accessToken}` };
}

function publicCloudStorageUrl(objectName) {
  return `https://storage.googleapis.com/${encodeURIComponent(assetBucket)}/${objectName.split("/").map(encodeURIComponent).join("/")}`;
}

async function readAssetManifest(assetDir) {
  try {
    return JSON.parse(await readFile(join(assetDir, "manifest.json"), "utf8"));
  } catch (error) {
    return { assets: [] };
  }
}

async function writeAssetManifest(assetDir, manifest) {
  await mkdir(assetDir, { recursive: true });
  await writeFile(join(assetDir, "manifest.json"), JSON.stringify(manifest, null, 2));
}

function sanitizeAssetManifestItem(item) {
  if (!item || typeof item !== "object") return null;
  const id = String(item.id || "").slice(0, 120);
  const url = String(item.url || "");
  if (!url.startsWith("/generated/building-assets/") && !url.startsWith("https://storage.googleapis.com/")) return null;
  return {
    id: id || createHash("sha256").update(url).digest("hex").slice(0, 24),
    name: String(item.name || "Saved Asset").slice(0, 80),
    assetType: item.assetType === "decoration" ? "decoration" : "board",
    url,
    width: nonNegativeInt(item.width, 0),
    height: nonNegativeInt(item.height, 0),
    createdAt: validDateOrNull(item.createdAt),
    source: String(item.source || "generated").slice(0, 40)
  };
}

function safeStaticPath(pathname) {
  const decoded = decodeURIComponent(pathname).replace(/^[/\\]+/, "");
  const normalized = normalize(decoded);
  if (normalized.startsWith("..") || normalized.includes(`..${sep}`)) {
    throw new Error("Invalid path");
  }
  return join(root, normalized);
}

async function generateBuildingImage(payload) {
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (apiKey) {
    return fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      }
    );
  }

  const credentials = loadGoogleCredentials();
  if (!credentials) {
    const error = new Error("No Google image credentials found. Set GOOGLE_API_KEY, GEMINI_API_KEY, GOOGLE_APPLICATION_CREDENTIALS, or DATA_PATH.");
    error.status = 503;
    throw error;
  }

  const accessToken = await getServiceAccountAccessToken(credentials);
  const project = process.env.GOOGLE_CLOUD_PROJECT || credentials.project_id || defaultVertexProject;
  const location = defaultVertexLocation;
  const apiVersion = process.env.GOOGLE_VERTEX_API_VERSION || "v1";
  const host = location === "global" ? "aiplatform.googleapis.com" : `${location}-aiplatform.googleapis.com`;

  return fetch(
    `https://${host}/${apiVersion}/projects/${project}/locations/${location}/publishers/google/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "authorization": `Bearer ${accessToken}`,
        "content-type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );
}

function loadGoogleCredentials() {
  const candidates = [
    process.env.GOOGLE_APPLICATION_CREDENTIALS,
    process.env.DATA_PATH ? join(process.env.DATA_PATH, "runwai-credentials.json") : null,
    join(root, "data", "runwai-credentials.json"),
    join(root, "..", "RunWAI", "data", "runwai-credentials.json")
  ].filter(Boolean);

  for (const path of candidates) {
    try {
      if (!existsSync(path)) continue;
      const credentials = JSON.parse(readFileSync(path, "utf8"));
      if (credentials.client_email && credentials.private_key) return credentials;
    } catch (error) {
      console.warn(`Could not load Google credentials from ${path}: ${error.message}`);
    }
  }

  return null;
}

async function getServiceAccountAccessToken(credentials) {
  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now() + 60_000) {
    return cachedAccessToken.token;
  }

  const now = Math.floor(Date.now() / 1000);
  const assertion = [
    base64UrlJson({ alg: "RS256", typ: "JWT" }),
    base64UrlJson({
      iss: credentials.client_email,
      scope: cloudPlatformScope,
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600
    })
  ].join(".");

  const signer = createSign("RSA-SHA256");
  signer.update(assertion);
  signer.end();
  const signature = toBase64Url(signer.sign(credentials.private_key));

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${assertion}.${signature}`
    })
  });

  if (!response.ok) {
    const error = new Error(`Google auth failed: ${await response.text()}`);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  cachedAccessToken = {
    token: data.access_token,
    expiresAt: Date.now() + Number(data.expires_in || 3600) * 1000
  };
  return cachedAccessToken.token;
}

async function getCloudRunAccessToken() {
  try {
    const response = await fetch(
      "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token",
      { headers: { "Metadata-Flavor": "Google" } }
    );
    if (!response.ok) return "";
    const data = await response.json();
    return data.access_token || "";
  } catch {
    return "";
  }
}

function base64UrlJson(value) {
  return toBase64Url(Buffer.from(JSON.stringify(value)));
}

function toBase64Url(buffer) {
  return Buffer.from(buffer)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 15_000_000) {
        req.destroy();
        reject(new Error("Request too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function dataUrlToInlineData(dataUrl) {
  const match = /^data:([^;]+);base64,(.+)$/i.exec(String(dataUrl || ""));
  if (!match) return null;
  return {
    mimeType: match[1],
    data: match[2]
  };
}

function dataUrlToImageAsset(dataUrl) {
  const inline = dataUrlToInlineData(dataUrl);
  if (!inline) return null;

  const extensionByMime = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp"
  };
  const mimeType = String(inline.mimeType || "").toLowerCase();
  const extension = extensionByMime[mimeType];
  if (!extension) return null;

  try {
    return {
      extension,
      mimeType,
      buffer: Buffer.from(inline.data, "base64")
    };
  } catch (error) {
    return null;
  }
}

function safePathSegment(value) {
  return String(value || "")
    .replace(/[^a-z0-9_-]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96) || "user";
}
