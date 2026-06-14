const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const funDashboard = document.querySelector("#funDashboard");
const openWaiForumGame = document.querySelector("#openWaiForumGame");
const openClusternautsGame = document.querySelector("#openClusternautsGame");
const dashboardAccount = document.querySelector("#dashboardAccount");
const dashboardAccountLabel = document.querySelector("#dashboardAccountLabel");
const dashboardAccountName = document.querySelector("#dashboardAccountName");
const dashboardAccountAvatar = document.querySelector("#dashboardAccountAvatar");
const goldEl = document.querySelector("#gold");
const playerXpEl = document.querySelector("#playerXp");
const homeXpEl = document.querySelector("#xp");
const plotEl = document.querySelector("#plot");
const coordinatesEl = document.querySelector("#coordinates");
const accountNameEl = document.querySelector("#accountName");
const accountAvatarEl = document.querySelector("#accountAvatar");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const selectionPanel = document.querySelector("#selectionPanel");
const selectionSummary = document.querySelector("#selectionSummary");
const buyButton = document.querySelector("#buyButton");
const buildButton = document.querySelector("#buildButton");
const decorationButton = document.querySelector("#decorationButton");
const editBoardButton = document.querySelector("#editBoardButton");
const sellButton = document.querySelector("#sellButton");
const woodResource = document.querySelector("#woodResource");
const stoneResource = document.querySelector("#stoneResource");
const sandResource = document.querySelector("#sandResource");
const grassResource = document.querySelector("#grassResource");
const hotbar = document.querySelector("#hotbar");
const craftingButton = document.querySelector("#craftingButton");
const craftingPanel = document.querySelector("#craftingPanel");
const closeCraftingButton = document.querySelector("#closeCraftingButton");
const craftingTitle = document.querySelector("#craftingTitle");
const craftingRecipeList = document.querySelector("#craftingRecipeList");
const craftingDetailIcon = document.querySelector("#craftingDetailIcon");
const craftingDetailTitle = document.querySelector("#craftingDetailTitle");
const craftingRequirements = document.querySelector("#craftingRequirements");
const craftButton = document.querySelector("#craftButton");
const inventoryButton = document.querySelector("#inventoryButton");
const inventoryPanel = document.querySelector("#inventoryPanel");
const closeInventoryButton = document.querySelector("#closeInventoryButton");
const inventoryList = document.querySelector("#inventoryList");
const inventoryHotbarSlots = document.querySelector("#inventoryHotbarSlots");
const forumButton = document.querySelector("#forumButton");
const clusternautsButton = document.querySelector("#clusternautsButton");
const forumPanel = document.querySelector("#forumPanel");
const closeForumButton = document.querySelector("#closeForumButton");
const forumTitle = document.querySelector("#forumTitle");
const forumSubtitle = document.querySelector("#forumSubtitle");
const forumBoardList = document.querySelector("#forumBoardList");
const forumTopicList = document.querySelector("#forumTopicList");
const forumPostList = document.querySelector("#forumPostList");
const forumBackButton = document.querySelector("#forumBackButton");
const forumBreadcrumb = document.querySelector("#forumBreadcrumb");
const forumTabs = document.querySelector("#forumTabs");
const homeChatPanel = document.querySelector("#homeChatPanel");
const homeChatList = document.querySelector("#homeChatList");
const closeHomeChatButton = document.querySelector("#closeHomeChatButton");
const boardEditor = document.querySelector("#boardEditor");
const boardEditorForm = document.querySelector("#boardEditorForm");
const boardEditorSummary = document.querySelector("#boardEditorSummary");
const closeBoardEditorButton = document.querySelector("#closeBoardEditorButton");
const boardPreviewImage = document.querySelector("#boardPreviewImage");
const boardNameInput = document.querySelector("#boardNameInput");
const boardDescriptionInput = document.querySelector("#boardDescriptionInput");
const boardVisibilityInput = document.querySelector("#boardVisibilityInput");
const deleteConfirm = document.querySelector("#deleteConfirm");
const deleteConfirmTitle = document.querySelector("#deleteConfirmTitle");
const deleteConfirmBody = document.querySelector("#deleteConfirmBody");
const deleteTopicCount = document.querySelector("#deleteTopicCount");
const deleteTopicLabel = document.querySelector("#deleteTopicLabel");
const deleteMessageNote = document.querySelector("#deleteMessageNote");
const closeDeleteConfirmButton = document.querySelector("#closeDeleteConfirmButton");
const cancelDeleteButton = document.querySelector("#cancelDeleteButton");
const confirmDeleteButton = document.querySelector("#confirmDeleteButton");
const buildingEditor = document.querySelector("#buildingEditor");
const editorSummary = document.querySelector("#editorSummary");
const closeEditorButton = document.querySelector("#closeEditorButton");
const editorBase = document.querySelector("#editorBase");
const doodleCanvas = document.querySelector("#doodleCanvas");
const editorBoardFields = document.querySelector("#editorBoardFields");
const editorImageTabs = [...document.querySelectorAll(".editor-image-tab")];
const newImageStage = document.querySelector("#newImageStage");
const newImagePanel = document.querySelector("#newImagePanel");
const existingImagePanel = document.querySelector("#existingImagePanel");
const existingImageDetails = document.querySelector("#existingImageDetails");
const editorVisibilityField = document.querySelector(".editor-visibility-field");
const newBoardNameInput = document.querySelector("#newBoardNameInput");
const newBoardDescriptionInput = document.querySelector("#newBoardDescriptionInput");
const newBoardVisibilityInput = document.querySelector("#newBoardVisibilityInput");
const brushSize = document.querySelector("#brushSize");
const brushBrightness = document.querySelector("#brushBrightness");
const clearDoodleButton = document.querySelector("#clearDoodleButton");
const previewBuildingButton = document.querySelector("#previewBuildingButton");
const placeBuildingButton = document.querySelector("#placeBuildingButton");
const editorBuildCost = document.querySelector("#editorBuildCost");
const materialSummary = document.querySelector("#materialSummary");
const assetLibraryList = document.querySelector("#assetLibraryList");
const refreshAssetLibraryButton = document.querySelector("#refreshAssetLibraryButton");
const previewPane = document.querySelector("#previewPane");
const previewStatus = document.querySelector("#previewStatus");
const swatchButtons = [...document.querySelectorAll(".swatch")];
const resourceToolButtons = [...document.querySelectorAll("[data-equip-resource]")];
const editorBaseCtx = editorBase.getContext("2d");
const doodleCtx = doodleCanvas.getContext("2d");
const materialCanvas = document.createElement("canvas");
const materialCtx = materialCanvas.getContext("2d");
const clusternautsUrl = String(window.WAI_FUN_CONFIG?.clusternautsUrl || "").trim();
const clusternautsLaunchUrl = buildClusternautsLaunchUrl(clusternautsUrl);
if (clusternautsButton && clusternautsLaunchUrl) {
  clusternautsButton.href = clusternautsLaunchUrl;
  clusternautsButton.hidden = false;
}
if (openClusternautsGame && clusternautsLaunchUrl) {
  openClusternautsGame.href = clusternautsLaunchUrl;
} else if (openClusternautsGame) {
  openClusternautsGame.setAttribute("aria-disabled", "true");
  openClusternautsGame.addEventListener("click", (event) => event.preventDefault());
}
if (openWaiForumGame) {
  openWaiForumGame.addEventListener("click", () => {
    document.body.classList.add("wai-forum-game-active");
    funDashboard.hidden = true;
    resize();
  });
}

function buildClusternautsLaunchUrl(rawUrl) {
  if (!rawUrl) return "";
  try {
    const url = new URL(rawUrl, window.location.href);
    url.pathname = "/auth/login";
    url.search = "";
    url.hash = "";
    url.searchParams.set("return_to", "/");
    return url.toString();
  } catch {
    return "";
  }
}

const TILE_W = 74;
const TILE_H = 38;
const VIEW_RADIUS = 19;
const HOME_MIN_X = -5;
const HOME_MAX_X = 5;
const HOME_MIN_Y = -5;
const HOME_MAX_Y = 5;
const START_X = 0;
const START_Y = 0;
const BUY_COST_PER_PLOT = 1;
const BUILDING_GOLD_PER_TILE = 1;
const BUILDING_SELL_VALUE = 3;
const DECORATION_GOLD_COST = 1;
const DECORATION_SELL_VALUE = 1;
const ROOM_GOLD_COST = 5;
const WALK_SCREEN_SPEED = 170;
const RUN_SCREEN_SPEED = 280;
const JUMP_VELOCITY = 315;
const GRAVITY = 1150;
const PLAYER_RADIUS = 0.2;
const PLAYER_FOOT_OFFSET = 0.38;
const WATER_COLLISION_INSET = 0.08;
const WATER_SPEED_MULTIPLIER = 0.48;
const WATER_SUBMERGE_Z = 12;
const ROCK_RADIUS = 0.34;
const TREE_RADIUS = 0.33;
const ROCK_TOP_HEIGHT = 16;
const ROCK_JUMP_CLEARANCE = ROCK_TOP_HEIGHT - 1;
const FENCE_COLLISION_RADIUS = 0.46;
const GATE_HALF_WIDTH = 0.72;
const GATE_OPEN_DISTANCE = 1.65;
const GATE_FULL_OPEN_DISTANCE = 0.78;
const GATE_DOOR_HEIGHT = 34;
const BUILDING_COLLISION_INSET = 0.16;
const ROOM_DOOR_HALF_WIDTH = 0.34;
const ROOM_DOOR_VISUAL_HALF_WIDTH = 0.39;
const TREE_HARVEST_MS = 2300;
const ROCK_HARVEST_MS = 2000;
const FISH_HARVEST_MS = 2600;
const ROOM_INTERACT_MS = 1450;
const TREE_WOOD_YIELD = 5;
const TREE_ACORN_YIELD = 2;
const FISH_YIELD = 1;
const MIN_FISHABLE_WATER_TILES = 9;
const GATE_WOOD_COST = 10;
const STARTER_GATE_EDGE_IDS = new Set(["0,5,south", "5,0,east"]);
const HOME_GATE_FEATURE_PREFIX = "home-gate-";
const ROCK_STONE_YIELD = 5;
const MATERIAL_PIXELS_PER_UNIT = 950;
const MATERIAL_COLOR_MATCH_DISTANCE = 92;
const HOTBAR_SLOTS = 5;
const ACORN_GROW_MIN_MS = 2 * 60 * 1000;
const ACORN_GROW_CHECK_MS = 30 * 1000;
const ACORN_GROW_CHANCE = 0.35;
const CURSOR_GRID_RADIUS = 3.2;
const GOLD_XP_INTERVAL = 10;
const MESSAGE_RECENT_LIMIT = 16;
const MESSAGE_SIMILARITY_LIMIT = 0.78;
const MESSAGE_REPEAT_LIMIT = 0.92;
const MESSAGE_REASONABLE_DELAY_MS = 4500;
const MESSAGE_LOW_QUALITY_WINDOW_MS = 30 * 1000;
const MESSAGE_LOW_QUALITY_LIMIT = 3;
const MESSAGE_FEEDBACK_EXTRA_PENALTY = 2;
const MESSAGE_QUALITY_XP = {
  length20: 1,
  length80: 1,
  words8: 1,
  variety: 1,
  punctuation: 1,
  realWords: 1,
  distinctRecent: 1,
  delay: 1
};
const MESSAGE_XP_PENALTIES = {
  swearing: 3,
  veryShort: 4,
  repeated: 8,
  repeatedCharacters: 4,
  gibberish: 4,
  lowQualityBurst: 3
};
const HARVEST_REACH_TILES = 3;
const FLOOR_TOOL_COST = 1;
const CHEAT_RESOURCE_IDS = new Set(["wood", "stone", "sand", "grass"]);
const CHEAT_MAX_AMOUNT = 2147483647;
const SWEAR_WORD_PATTERN = /\b(fuck|fucking|shit|shitting|bitch|bastard|asshole|damn|cunt)\b/i;
const LOW_EFFORT_MESSAGE_PATTERN = /^(p|k|kk|ok|okay|lol|lmao|rofl|haha|ha|yes|no|yep|nah|nope|hi|hey|yo|sup)$/i;
const COMMON_SHORT_WORDS = new Set([
  "a", "i", "am", "an", "as", "at", "be", "by", "do", "go", "he", "hi", "if", "in", "is", "it",
  "me", "my", "no", "of", "ok", "on", "or", "so", "to", "up", "us", "we"
]);
const WORLD_SAVE_DELAY_MS = 450;
const WORLD_REFRESH_INTERVAL_MS = 5000;
const LIVE_REFRESH_INTERVAL_MS = 800;
const PLAYER_POSITION_SYNC_MS = 300;
const PLAYER_POSITION_KEEPALIVE_MS = 10000;
const REMOTE_PLAYER_STALE_MS = 60000;

const keys = new Set();
const worldCache = new Map();
const ownedPlots = new Set();
const myOwnedPlots = new Set();
const myStarterPlots = new Set();
const plotOwners = new Map();
const purchasedPlots = new Set();
const buildings = [];
const remotePlayers = new Map();
const animals = [];
const harvestedFeatures = new Set();
const harvestedFeatureOwners = new Map();
const plantedSaplings = new Map();
const plantedSaplingOwners = new Map();
const floorMaterials = new Map();
const floorMaterialOwners = new Map();
const gateEdgeOwners = new Map();
const seenWorldMessageIds = new Set();
let worldLoaded = false;
let worldPersistenceUnavailable = false;
let worldSaveTimer = null;
let sharedWorldRefreshInFlight = false;
let liveWorldRefreshInFlight = false;
let lastSharedWorldRefreshAt = 0;
let lastLiveWorldRefreshAt = 0;
let playerPositionSyncInFlight = false;
let lastPlayerPositionSyncAt = 0;
let lastPlayerPositionSyncSnapshot = "";
let lastLiveMessageCreatedAt = "";
let terrainRevision = 0;
let fenceEdgesRevision = 0;
let cachedFenceEdges = null;
let cachedFenceEdgesRevision = -1;
const hudDisplayCache = {
  gold: "",
  playerXp: "",
  homeXp: "",
  plot: "",
  coordinates: "",
  accountName: "",
  accountInitials: "",
  accountColor: "",
  dashboardAccountName: "",
  dashboardAccountInitials: "",
  dashboardAccountLabel: "",
  dashboardAccountColor: ""
};
const buildingHitCanvas = document.createElement("canvas");
const buildingHitCtx = buildingHitCanvas.getContext("2d");

const inventoryItems = [
  { id: "acorns", name: "Acorns" },
  { id: "fish", name: "Fish" },
  { id: "bowls", name: "Wooden Bowl" }
];

const craftingRecipes = [
  {
    id: "wooden-bowl",
    name: "Wooden Bowl",
    icon: "bowls",
    costs: { wood: 5 },
    output: { bowls: 1 }
  }
];

const ANIMAL_TYPES = new Set(["cow", "sheep", "chicken", "bee"]);
const ANIMALS_ENABLED = false;
const STARTER_ANIMAL_TYPES = ["cow", "sheep", "chicken", "bee"];
const ANIMAL_WANDER_RADIUS = 5;
const ANIMAL_SPAWN_SEARCH_RADIUS = 80;
const ANIMAL_MOVE_PAUSE_MS = 1400;
const ANIMAL_SPEEDS = {
  cow: 0.38,
  sheep: 0.46,
  chicken: 0.72,
  bee: 0.9
};

const buildingMaterialBrushes = swatchButtons.map((button) => {
  const id = button.dataset.resource;
  const color = button.dataset.color || "#9b5d34";
  const name = button.querySelector(".swatch-name")?.textContent || id;
  return { id, name, color, rgb: hexToRgb(color), button };
}).filter((brush) => brush.id && brush.rgb);

for (let y = HOME_MIN_Y; y <= HOME_MAX_Y; y++) {
  for (let x = HOME_MIN_X; x <= HOME_MAX_X; x++) {
    const key = `${x},${y}`;
    ownedPlots.add(key);
    myOwnedPlots.add(key);
    myStarterPlots.add(key);
  }
}

const state = {
  width: 1,
  height: 1,
  dpr: 1,
  cameraX: 0,
  cameraY: 0,
  cameraReady: false,
  gold: 12,
  playerXp: 0,
  goldXpMilestone: 0,
  homeXp: 0,
  lastTime: performance.now(),
  account: {
    id: null,
    name: "WAi Forward member",
    email: "",
    initials: "WA",
    color: "#385f71"
  },
  accountLoading: true,
  accountOffline: false,
  chatActive: false,
  inWater: false,
  inventoryOpen: false,
  craftingOpen: false,
  selectedCraftingRecipeId: "wooden-bowl",
  forumOpen: false,
  homeChatOpen: false,
  forum: {
    tab: "your",
    boardId: "home",
    topicId: null
  },
  pendingDeleteBuildingId: null,
  gateEdgeIds: new Set(),
  homeMessages: [],
  recentChatMessages: [],
  // false for normal rendering, "context" for the editor screenshot, "generation" for clean AI references.
  previewCapture: false,
  fenceAnimationUntil: 0,
  fadingFenceEdges: [],
  resources: {
    wood: 0,
    stone: 0,
    sand: 0,
    grass: 0
  },
  items: {
    acorns: 0,
    fish: 0,
    bowls: 0
  },
  hotbar: Array(HOTBAR_SLOTS).fill(null),
  activeHotbarSlot: 0,
  itemToAssign: null,
  harvest: {
    active: false,
    target: null,
    start: 0,
    duration: 0,
    pointerId: null
  },
  roomAction: {
    active: false,
    type: null,
    target: null,
    start: 0,
    duration: 0,
    pointerId: null,
    completed: false
  },
  room: {
    active: false,
    buildingId: null,
    building: null,
    rooms: [],
    tiles: [],
    tileKeys: new Set(),
    roomIdByTile: new Map(),
    interiorDoors: [],
    interiorDoorKeys: new Set(),
    width: 0,
    height: 0,
    door: null,
    previousWorldPosition: null
  },
  resourceAction: {
    active: false,
    target: null,
    pointerId: null
  },
  materialTool: {
    equipped: null,
    painting: false,
    pointerId: null,
    pointer: null,
    lastPaintedKey: null,
    lastPaintedTile: null
  },
  editor: {
    active: false,
    drawing: false,
    brushResource: "wood",
    brushBaseColor: "#9b5d34",
    brushColor: "#9b5d34",
    materialCosts: {},
    lastPoint: null,
    snapshot: null,
    previewImage: null,
    previewAssetId: null,
    generatedPreviewImage: null,
    generatedPreviewAssetId: null,
    imageMode: "new",
    buildType: "board",
    boardName: "",
    boardDescription: "",
    boardVisibility: "public"
  },
  assetLibrary: {
    loaded: false,
    loading: false,
    error: "",
    assets: [],
    selectedUrl: null
  },
  selection: {
    active: false,
    mode: "paint",
    plotType: null,
    building: null,
    fenceEdgeId: null,
    anchor: null,
    hover: null,
    selected: new Map(),
    paintSelected: new Map()
  },
  bubbleText: "Home sweet home.",
  bubbleUntil: performance.now() + 3800,
  player: {
    x: START_X,
    y: START_Y,
    vx: 0,
    vy: 0,
    z: 0,
    vz: 0,
    facing: 1,
    grounded: true
  }
};

function resize() {
  state.dpr = Math.min(window.devicePixelRatio || 1, 2);
  state.width = window.innerWidth;
  state.height = window.innerHeight;
  canvas.width = Math.floor(state.width * state.dpr);
  canvas.height = Math.floor(state.height * state.dpr);
  canvas.style.width = `${state.width}px`;
  canvas.style.height = `${state.height}px`;
  ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
  if (!state.cameraReady) {
    state.cameraX = state.width / 2;
    state.cameraY = state.height * 0.52 - TILE_H / 2;
    state.cameraReady = true;
  }
}

window.addEventListener("resize", resize);
resize();

function invalidateTerrainCache() {
  terrainRevision++;
}

function invalidateFenceEdgesCache() {
  fenceEdgesRevision++;
  cachedFenceEdges = null;
  cachedFenceEdgesRevision = -1;
}

function hash2(x, y, seed = 0) {
  let n = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(seed, 1442695041);
  n = (n ^ (n >>> 13)) >>> 0;
  n = Math.imul(n, 1274126177) >>> 0;
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

function valueNoise(x, y, scale, seed) {
  const sx = x / scale;
  const sy = y / scale;
  const x0 = Math.floor(sx);
  const y0 = Math.floor(sy);
  const tx = smoothstep(sx - x0);
  const ty = smoothstep(sy - y0);
  const a = hash2(x0, y0, seed);
  const b = hash2(x0 + 1, y0, seed);
  const c = hash2(x0, y0 + 1, seed);
  const d = hash2(x0 + 1, y0 + 1, seed);
  const ab = a + (b - a) * tx;
  const cd = c + (d - c) * tx;
  return ab + (cd - ab) * ty;
}

function terrainAt(x, y) {
  const key = `${x},${y}`;
  const cached = worldCache.get(key);
  if (cached) return hydrateTile(cached);

  const continent = valueNoise(x, y, 18, 7);
  const detail = valueNoise(x + 1000, y - 900, 6, 19);
  const ridge = valueNoise(x - 220, y + 500, 11, 31);
  const moisture = valueNoise(x + 70, y - 35, 13, 43);
  const elevation = continent * 0.62 + detail * 0.25 + ridge * 0.13;
  const river = Math.abs(Math.sin(x * 0.18 + y * 0.23 + valueNoise(x, y, 30, 77) * 2.4));
  const homePond = Math.hypot(x + 9, y - 3);
  let baseType = "grass";

  if (homePond < 2.5 || river < 0.065 || elevation < 0.34) baseType = "water";
  else if (homePond < 4 || river < 0.11 || elevation < 0.42) baseType = "sand";
  else if (elevation > 0.76) baseType = "stone";
  else if (moisture > 0.72) baseType = "forest";
  else if (moisture < 0.26 && elevation < 0.58) baseType = "sand";

  const featureRoll = hash2(x, y, 99);
  let feature = null;
  if (baseType === "forest" && featureRoll > 0.34) feature = "tree";
  if (baseType === "grass" && featureRoll > 0.88) feature = "tree";
  if ((baseType === "grass" || baseType === "sand" || baseType === "stone") && featureRoll > 0.78 && featureRoll < 0.87) feature = "rock";

  const tile = { x, y, baseType, feature, elevation, moisture };
  worldCache.set(key, tile);
  return hydrateTile(tile);
}

function hydrateTile(tile) {
  if (tile.hydratedRevision === terrainRevision && tile.hydratedTile) return tile.hydratedTile;

  const home = isHomeTile(tile.x, tile.y);
  const key = tileKey(tile.x, tile.y);
  const planted = plantedSaplings.get(key);
  const harvested = harvestedFeatures.has(key);
  const floorMaterial = home ? floorMaterials.get(key) || null : null;
  let feature = harvested || home ? null : tile.feature;
  if (planted) feature = planted.grown ? "tree" : "sapling";
  if (!planted && !harvested && home && Math.abs(tile.x) <= 2 && Math.abs(tile.y) <= 2 && hash2(tile.x, tile.y, 124) > 0.91) feature = "flower";

  const hydrated = {
    x: tile.x,
    y: tile.y,
    baseType: tile.baseType,
    elevation: tile.elevation,
    moisture: tile.moisture,
    type: floorMaterial ? `${floorMaterial}Floor` : home ? "home" : tile.baseType,
    feature,
    home,
    floorMaterial
  };
  tile.hydratedRevision = terrainRevision;
  tile.hydratedTile = hydrated;
  return hydrated;
}

function normalizeAnimalType(value) {
  const type = String(value || "").toLowerCase().trim();
  return ANIMAL_TYPES.has(type) ? type : null;
}

function isWildUnclaimedAnimalLand(x, y) {
  if (!Number.isInteger(x) || !Number.isInteger(y)) return false;
  if (isHomeTile(x, y)) return false;
  if (buildingOccupiesTile(x, y)) return false;
  const tile = terrainAt(x, y);
  return tile.type !== "water" && tile.feature !== "tree" && tile.feature !== "rock";
}

function createAnimal(type, tile, index = animals.length) {
  if (!tile) return null;
  const phase = hash2(tile.x, tile.y, 203 + index) * Math.PI * 2;
  return {
    id: `animal-${type}-${tile.x}-${tile.y}-${index}`,
    type,
    x: tile.x,
    y: tile.y,
    originX: tile.x,
    originY: tile.y,
    targetX: tile.x,
    targetY: tile.y,
    facing: hash2(tile.x, tile.y, 231) > 0.5 ? 1 : -1,
    nextMoveAt: performance.now() + hash2(tile.x, tile.y, 241 + index) * ANIMAL_MOVE_PAUSE_MS,
    phase
  };
}

function animalFromFeature(feature, index = 0) {
  const type = normalizeAnimalType(feature?.state);
  if (!type || !Number.isInteger(feature?.x) || !Number.isInteger(feature?.y)) return null;
  return createAnimal(type, { x: feature.x, y: feature.y }, index);
}

function chooseAnimalSpawnTile(type, index = 0) {
  let best = null;
  const typeOffset = STARTER_ANIMAL_TYPES.indexOf(type) + 1;
  for (let radius = HOME_MAX_X + 2; radius <= ANIMAL_SPAWN_SEARCH_RADIUS; radius++) {
    for (let y = -radius; y <= radius; y++) {
      for (let x = -radius; x <= radius; x++) {
        if (Math.max(Math.abs(x), Math.abs(y)) !== radius) continue;
        if (!isWildUnclaimedAnimalLand(x, y)) continue;
        const score = hash2(x + index * 17, y - index * 13, 271 + typeOffset * 29) + Math.hypot(x, y) * 0.003;
        if (!best || score < best.score) best = { x, y, score };
      }
    }
    if (best) return { x: best.x, y: best.y };
  }
  return null;
}

function relocateAnimal(animal, index = 0) {
  const tile = chooseAnimalSpawnTile(animal.type, index);
  const relocated = createAnimal(animal.type, tile, index);
  if (!relocated) return false;
  Object.assign(animal, relocated, { id: animal.id || relocated.id });
  return true;
}

function ensureStarterAnimals() {
  if (!ANIMALS_ENABLED) return;
  STARTER_ANIMAL_TYPES.forEach((type, index) => {
    if (animals.some((animal) => animal.type === type)) return;
    const animal = createAnimal(type, chooseAnimalSpawnTile(type, index), index);
    if (animal) animals.push(animal);
  });
  normalizeAnimalLocations();
}

function normalizeAnimalLocations() {
  for (let index = animals.length - 1; index >= 0; index--) {
    const animal = animals[index];
    const tileX = Math.round(animal.x);
    const tileY = Math.round(animal.y);
    if (isWildUnclaimedAnimalLand(tileX, tileY)) {
      animal.x = tileX;
      animal.y = tileY;
      animal.originX = Number.isFinite(animal.originX) ? animal.originX : tileX;
      animal.originY = Number.isFinite(animal.originY) ? animal.originY : tileY;
      animal.targetX = tileX;
      animal.targetY = tileY;
      continue;
    }
    if (!relocateAnimal(animal, index)) animals.splice(index, 1);
  }
}

function animalFeaturePosition(animal, index = 0) {
  const current = { x: Math.round(animal.x), y: Math.round(animal.y) };
  if (isWildUnclaimedAnimalLand(current.x, current.y)) return current;
  const target = { x: Math.round(animal.targetX), y: Math.round(animal.targetY) };
  if (isWildUnclaimedAnimalLand(target.x, target.y)) return target;
  return chooseAnimalSpawnTile(animal.type, index);
}

function updateAnimals(dt, now = performance.now()) {
  if (!ANIMALS_ENABLED) return;
  for (const [index, animal] of animals.entries()) {
    const currentTile = { x: Math.round(animal.x), y: Math.round(animal.y) };
    if (!isWildUnclaimedAnimalLand(currentTile.x, currentTile.y)) {
      if (relocateAnimal(animal, index)) scheduleWorldSave();
      continue;
    }

    const dx = animal.targetX - animal.x;
    const dy = animal.targetY - animal.y;
    const distance = Math.hypot(dx, dy);
    if (distance <= 0.03) {
      animal.x = animal.targetX;
      animal.y = animal.targetY;
      if (!animal.nextMoveAt || now >= animal.nextMoveAt) chooseAnimalWanderTarget(animal, index, now);
      continue;
    }

    const step = Math.min(distance, (ANIMAL_SPEEDS[animal.type] || 0.48) * dt);
    animal.x += (dx / distance) * step;
    animal.y += (dy / distance) * step;
    const from = tileCenterScreen(animal.x, animal.y);
    const to = tileCenterScreen(animal.targetX, animal.targetY);
    if (Math.abs(to.x - from.x) > 0.2) animal.facing = to.x >= from.x ? 1 : -1;
  }
}

function chooseAnimalWanderTarget(animal, index = 0, now = performance.now()) {
  const originX = Number.isFinite(animal.originX) ? animal.originX : Math.round(animal.x);
  const originY = Number.isFinite(animal.originY) ? animal.originY : Math.round(animal.y);
  const currentX = Math.round(animal.x);
  const currentY = Math.round(animal.y);
  const candidates = [
    { x: currentX + 1, y: currentY },
    { x: currentX - 1, y: currentY },
    { x: currentX, y: currentY + 1 },
    { x: currentX, y: currentY - 1 },
    { x: currentX + 1, y: currentY - 1 },
    { x: currentX - 1, y: currentY + 1 }
  ].filter((tile) => (
    Math.hypot(tile.x - originX, tile.y - originY) <= ANIMAL_WANDER_RADIUS
      && isWildUnclaimedAnimalLand(tile.x, tile.y)
  ));

  if (!candidates.length) {
    animal.nextMoveAt = now + ANIMAL_MOVE_PAUSE_MS;
    return;
  }

  const roll = hash2(Math.floor(now / 900) + index * 19, currentX - currentY, 307 + animal.phase);
  const target = candidates[Math.floor(roll * candidates.length) % candidates.length];
  animal.targetX = target.x;
  animal.targetY = target.y;
  animal.nextMoveAt = now + ANIMAL_MOVE_PAUSE_MS + roll * ANIMAL_MOVE_PAUSE_MS;
}

function isHomeTile(x, y) {
  return ownedPlots.has(`${x},${y}`);
}

function isOwnHomeTile(x, y) {
  return myOwnedPlots.has(`${x},${y}`);
}

function tileOwnerUserId(x, y) {
  return plotOwners.get(tileKey(x, y)) || null;
}

function isFenceTile(x, y) {
  const onVertical = (x === HOME_MIN_X || x === HOME_MAX_X) && y >= HOME_MIN_Y && y <= HOME_MAX_Y;
  const onHorizontal = (y === HOME_MIN_Y || y === HOME_MAX_Y) && x >= HOME_MIN_X && x <= HOME_MAX_X;
  return onVertical || onHorizontal;
}

function isGateTile(x, y) {
  return (x === 0 && y === HOME_MAX_Y) || (x === HOME_MAX_X && y === 0);
}

function gateFeatureTypeForEdge(edge) {
  return `${HOME_GATE_FEATURE_PREFIX}${edge.side}`;
}

function edgeIdFromGateFeature(feature) {
  if (!feature || typeof feature.featureType !== "string") return null;
  if (!feature.featureType.startsWith(HOME_GATE_FEATURE_PREFIX)) return null;
  const side = feature.featureType.slice(HOME_GATE_FEATURE_PREFIX.length);
  if (!["north", "east", "south", "west"].includes(side)) return null;
  if (!Number.isInteger(feature.x) || !Number.isInteger(feature.y)) return null;
  return `${feature.x},${feature.y},${side}`;
}

function hasOwnedNeighbor(x, y, dx, dy) {
  const owner = tileOwnerUserId(x, y);
  const neighborOwner = tileOwnerUserId(x + dx, y + dy);
  if (owner || neighborOwner) return owner && owner === neighborOwner;
  return isHomeTile(x + dx, y + dy);
}

function generateFenceEdges() {
  if (cachedFenceEdges && cachedFenceEdgesRevision === fenceEdgesRevision) return cachedFenceEdges;

  const edges = [];

  for (const key of ownedPlots) {
    const [x, y] = key.split(",").map(Number);
    if (!hasOwnedNeighbor(x, y, 0, -1)) edges.push(makeFenceEdge(x, y, "north", x, y, x + 1, y));
    if (!hasOwnedNeighbor(x, y, 1, 0)) edges.push(makeFenceEdge(x, y, "east", x + 1, y, x + 1, y + 1));
    if (!hasOwnedNeighbor(x, y, 0, 1)) edges.push(makeFenceEdge(x, y, "south", x, y + 1, x + 1, y + 1));
    if (!hasOwnedNeighbor(x, y, -1, 0)) edges.push(makeFenceEdge(x, y, "west", x, y, x, y + 1));
  }

  markFenceGates(edges);
  cachedFenceEdges = edges;
  cachedFenceEdgesRevision = fenceEdgesRevision;
  return edges;
}

function makeFenceEdge(tileX, tileY, side, ax, ay, bx, by) {
  return {
    id: `${tileX},${tileY},${side}`,
    ownerUserId: tileOwnerUserId(tileX, tileY),
    tileX,
    tileY,
    side,
    ax,
    ay,
    bx,
    by,
    sort: (ax + ay + bx + by) / 2,
    gate: false
  };
}

function markFenceGates(edges) {
  syncGateEdgeIds(edges);
  for (const edge of edges) edge.gate = state.gateEdgeIds.has(edge.id);
}

function isOwnFenceEdge(edge) {
  return edge?.ownerUserId ? edge.ownerUserId === state.account.id : isOwnHomeTile(edge.tileX, edge.tileY);
}

function syncGateEdgeIds(edges = generateFenceEdgesWithoutGates()) {
  const edgeIds = new Set(edges.map((edge) => edge.id));
  for (const id of [...state.gateEdgeIds]) {
    if (!edgeIds.has(id)) {
      state.gateEdgeIds.delete(id);
      gateEdgeOwners.delete(id);
    }
  }

  if (state.gateEdgeIds.size) return;

  const starterGates = edges.filter((edge) => STARTER_GATE_EDGE_IDS.has(edge.id));
  if (starterGates.length) {
    for (const edge of starterGates) {
      state.gateEdgeIds.add(edge.id);
      if (isOwnFenceEdge(edge)) gateEdgeOwners.set(edge.id, state.account.id);
    }
    return;
  }

  const fallback = bestFallbackGateEdge(edges);
  if (fallback) {
    state.gateEdgeIds.add(fallback.id);
    if (isOwnFenceEdge(fallback)) gateEdgeOwners.set(fallback.id, state.account.id);
  }
}

function generateFenceEdgesWithoutGates() {
  const edges = [];

  for (const key of ownedPlots) {
    const [x, y] = key.split(",").map(Number);
    if (!hasOwnedNeighbor(x, y, 0, -1)) edges.push(makeFenceEdge(x, y, "north", x, y, x + 1, y));
    if (!hasOwnedNeighbor(x, y, 1, 0)) edges.push(makeFenceEdge(x, y, "east", x + 1, y, x + 1, y + 1));
    if (!hasOwnedNeighbor(x, y, 0, 1)) edges.push(makeFenceEdge(x, y, "south", x, y + 1, x + 1, y + 1));
    if (!hasOwnedNeighbor(x, y, -1, 0)) edges.push(makeFenceEdge(x, y, "west", x, y, x, y + 1));
  }

  return edges;
}

function bestFallbackGateEdge(edges) {
  return [...edges].sort((a, b) => {
    const aMid = { x: (a.ax + a.bx) / 2, y: (a.ay + a.by) / 2 };
    const bMid = { x: (b.ax + b.bx) / 2, y: (b.ay + b.by) / 2 };
    return Math.hypot(aMid.x, aMid.y) - Math.hypot(bMid.x, bMid.y);
  })[0] || null;
}

function circleIntersectsAabb(cx, cy, radius, minX, minY, maxX, maxY) {
  const closestX = Math.max(minX, Math.min(cx, maxX));
  const closestY = Math.max(minY, Math.min(cy, maxY));
  return Math.hypot(cx - closestX, cy - closestY) < radius;
}

function distanceToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSq = dx * dx + dy * dy;
  if (!lengthSq) return Math.hypot(px - ax, py - ay);
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSq));
  return Math.hypot(px - (ax + dx * t), py - (ay + dy * t));
}

function pointNearSegment(px, py, ax, ay, bx, by, radius) {
  return distanceToSegment(px, py, ax, ay, bx, by) < radius;
}

function playerFootCenter(playerX = state.player.x, playerY = state.player.y) {
  return {
    x: playerX + 0.5 + PLAYER_FOOT_OFFSET,
    y: playerY + 0.5 + PLAYER_FOOT_OFFSET
  };
}

function playerPositionForFeet(x, y) {
  return {
    x: x - 0.5 - PLAYER_FOOT_OFFSET,
    y: y - 0.5 - PLAYER_FOOT_OFFSET
  };
}

function playerDepth() {
  return playerDepthFor(state.player);
}

function playerDepthFor(player) {
  const feet = playerFootCenter(player.x, player.y);
  return feet.x + feet.y + 0.08;
}

function isPlayerInWater(playerX = state.player.x, playerY = state.player.y, playerZ = state.player.z) {
  if (playerZ > WATER_SUBMERGE_Z) return false;
  const { x: cx, y: cy } = playerFootCenter(playerX, playerY);
  const minTileX = Math.floor(cx - PLAYER_RADIUS) - 1;
  const maxTileX = Math.floor(cx + PLAYER_RADIUS) + 1;
  const minTileY = Math.floor(cy - PLAYER_RADIUS) - 1;
  const maxTileY = Math.floor(cy + PLAYER_RADIUS) + 1;

  for (let y = minTileY; y <= maxTileY; y++) {
    for (let x = minTileX; x <= maxTileX; x++) {
      if (terrainAt(x, y).type !== "water") continue;
      if (
        circleIntersectsAabb(
          cx,
          cy,
          PLAYER_RADIUS,
          x + WATER_COLLISION_INSET,
          y + WATER_COLLISION_INSET,
          x + 1 - WATER_COLLISION_INSET,
          y + 1 - WATER_COLLISION_INSET
        )
      ) {
        return true;
      }
    }
  }

  return false;
}

function fishableWaterTileCount(startX, startY, limit = MIN_FISHABLE_WATER_TILES) {
  if (terrainAt(startX, startY).type !== "water") return 0;
  const queue = [{ x: startX, y: startY }];
  const visited = new Set();

  while (queue.length && visited.size < limit) {
    const tile = queue.shift();
    const key = tileKey(tile.x, tile.y);
    if (visited.has(key) || terrainAt(tile.x, tile.y).type !== "water") continue;
    visited.add(key);
    queue.push(
      { x: tile.x + 1, y: tile.y },
      { x: tile.x - 1, y: tile.y },
      { x: tile.x, y: tile.y + 1 },
      { x: tile.x, y: tile.y - 1 }
    );
  }

  return visited.size;
}

function isFishableWaterTile(x, y) {
  return fishableWaterTileCount(x, y) >= MIN_FISHABLE_WATER_TILES;
}

// Flowers and gold stay non-blocking; trees and low rocks use small base hitboxes.
function fenceBlocksPlayer(fromX, fromY, toX, toY) {
  const { x: toCx, y: toCy } = playerFootCenter(toX, toY);
  return generateFenceEdges().some((edge) => {
    if (edge.gate) return false;
    return pointNearSegment(toCx, toCy, edge.ax, edge.ay, edge.bx, edge.by, FENCE_COLLISION_RADIUS);
  });
}

function featureBlocksPlayer(playerX, playerY) {
  const feet = playerFootCenter(playerX, playerY);
  const minTileX = Math.floor(feet.x - 1);
  const maxTileX = Math.floor(feet.x + 1);
  const minTileY = Math.floor(feet.y - 1);
  const maxTileY = Math.floor(feet.y + 1);

  for (let y = minTileY; y <= maxTileY; y++) {
    for (let x = minTileX; x <= maxTileX; x++) {
      const tile = terrainAt(x, y);
      if (tile.feature !== "tree" && tile.feature !== "rock") continue;

      const featureX = x + 0.5;
      const featureY = y + 0.5;
      const radius = tile.feature === "tree" ? TREE_RADIUS : ROCK_RADIUS;
      const distance = Math.hypot(feet.x - featureX, feet.y - featureY);
      const touchesFeature = distance < PLAYER_RADIUS + radius;

      if (tile.feature === "tree" && touchesFeature) return true;
      if (tile.feature === "rock" && touchesFeature && state.player.z < ROCK_JUMP_CLEARANCE) return true;
    }
  }

  return false;
}

function rockSurfaceUnderPlayer(playerX = state.player.x, playerY = state.player.y) {
  const feet = playerFootCenter(playerX, playerY);
  const minTileX = Math.floor(feet.x - 1);
  const maxTileX = Math.floor(feet.x + 1);
  const minTileY = Math.floor(feet.y - 1);
  const maxTileY = Math.floor(feet.y + 1);

  for (let y = minTileY; y <= maxTileY; y++) {
    for (let x = minTileX; x <= maxTileX; x++) {
      const tile = terrainAt(x, y);
      if (tile.feature !== "rock") continue;

      const distance = Math.hypot(feet.x - (x + 0.5), feet.y - (y + 0.5));
      if (distance < PLAYER_RADIUS + ROCK_RADIUS * 0.9) return ROCK_TOP_HEIGHT;
    }
  }

  return 0;
}

function buildingCollisionRects(building) {
  if (building.collisionRects) return building.collisionRects;

  building.collisionRects = building.tiles.map((tile) => {
    const hasWest = building.tileKeys.has(tileKey(tile.x - 1, tile.y));
    const hasEast = building.tileKeys.has(tileKey(tile.x + 1, tile.y));
    const hasNorth = building.tileKeys.has(tileKey(tile.x, tile.y - 1));
    const hasSouth = building.tileKeys.has(tileKey(tile.x, tile.y + 1));
    return {
      minX: tile.x + (hasWest ? 0 : BUILDING_COLLISION_INSET),
      maxX: tile.x + 1 - (hasEast ? 0 : BUILDING_COLLISION_INSET),
      minY: tile.y + (hasNorth ? 0 : BUILDING_COLLISION_INSET),
      maxY: tile.y + 1 - (hasSouth ? 0 : BUILDING_COLLISION_INSET)
    };
  });

  return building.collisionRects;
}

function buildingCollisionSeverity(playerX, playerY) {
  const feet = playerFootCenter(playerX, playerY);
  let severity = 0;

  for (const building of buildings) {
    for (const rect of buildingCollisionRects(building)) {
      const closestX = Math.max(rect.minX, Math.min(feet.x, rect.maxX));
      const closestY = Math.max(rect.minY, Math.min(feet.y, rect.maxY));
      const distance = Math.hypot(feet.x - closestX, feet.y - closestY);
      if (distance >= PLAYER_RADIUS) continue;

      const inside = feet.x >= rect.minX && feet.x <= rect.maxX && feet.y >= rect.minY && feet.y <= rect.maxY;
      const currentSeverity = inside
        ? PLAYER_RADIUS + Math.min(feet.x - rect.minX, rect.maxX - feet.x, feet.y - rect.minY, rect.maxY - feet.y)
        : PLAYER_RADIUS - distance;
      severity = Math.max(severity, currentSeverity);
    }
  }

  return severity;
}

function buildingBlocksPlayer(fromX, fromY, toX, toY) {
  const toSeverity = buildingCollisionSeverity(toX, toY);
  if (toSeverity <= 0) return false;

  const fromSeverity = buildingCollisionSeverity(fromX, fromY);
  return !(fromSeverity > 0 && toSeverity <= fromSeverity + 0.002);
}

function canOccupy(playerX, playerY, fromX = state.player.x, fromY = state.player.y) {
  if (state.room.active) return roomCanOccupy(playerX, playerY, fromX, fromY);
  return !fenceBlocksPlayer(fromX, fromY, playerX, playerY) && !featureBlocksPlayer(playerX, playerY) && !buildingBlocksPlayer(fromX, fromY, playerX, playerY);
}

function screenFromWorld(x, y, z = 0) {
  return {
    x: (x - y) * (TILE_W / 2) + state.cameraX,
    y: (x + y) * (TILE_H / 2) + state.cameraY - z
  };
}

function tileCenterScreen(x, y) {
  return screenFromWorld(x + 0.5, y + 0.5, 0);
}

function worldFromScreen(screenX, screenY) {
  const dx = (screenX - state.cameraX) / (TILE_W / 2);
  const dy = (screenY - state.cameraY) / (TILE_H / 2);
  return {
    x: (dx + dy) / 2,
    y: (dy - dx) / 2
  };
}

function screenPointFromPointer(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

function tileFromPointer(event) {
  const point = screenPointFromPointer(event);
  return tileFromScreenPoint(point.x, point.y);
}

function tileFromScreenPoint(screenX, screenY) {
  const world = worldFromScreen(screenX, screenY);
  return {
    x: Math.floor(world.x),
    y: Math.floor(world.y)
  };
}

function tileKey(x, y) {
  return `${x},${y}`;
}

function keyToTile(key) {
  const [x, y] = String(key).split(",").map(Number);
  return { x, y };
}

function isStarterPlot(x, y) {
  return myStarterPlots.has(tileKey(x, y));
}

function plotTypeAt(x, y) {
  return isOwnHomeTile(x, y) ? "home" : "wild";
}

async function loadWorld() {
  try {
    const response = await fetch("/api/world", { credentials: "same-origin" });
    if (response.status === 503) {
      worldPersistenceUnavailable = true;
      return;
    }
    if (!response.ok) throw new Error(`World request failed: ${response.status}`);
    const payload = await response.json();
    applyWorld(payload.world || {});
  } catch (error) {
    console.warn(error);
  } finally {
    ensureStarterAnimals();
    worldLoaded = true;
    state.lastTime = performance.now();
    refreshInventoryUi();
    updateHud();
    updateSelectionPanel();
  }
}

function applyWorld(world, options = {}) {
  const preserveLocalPlayer = Boolean(options.preserveLocalPlayer);
  const player = world.player || null;
  const savedPosition = player?.position || null;
  let pendingRoomPosition = null;
  if (player && !preserveLocalPlayer) {
    state.gold = numberOr(player.gold, state.gold);
    state.playerXp = numberOr(player.playerXp, state.playerXp);
    state.homeXp = numberOr(player.homeXp, state.homeXp);
    state.goldXpMilestone = numberOr(player.goldXpMilestone, state.goldXpMilestone);
    state.resources = { wood: 0, stone: 0, sand: 0, grass: 0, ...(player.resources || {}) };
    state.items = { acorns: 0, fish: 0, bowls: 0, ...(player.items || {}) };
    state.hotbar = normalizeHotbar(player.hotbar);
    state.activeHotbarSlot = Math.min(HOTBAR_SLOTS - 1, Math.max(0, numberOr(player.activeHotbarSlot, 0)));

    if (savedPosition?.mode === "room" && savedPosition.roomBuildingId) {
      pendingRoomPosition = savedPosition;
      const previous = savedPosition.previousWorldPosition;
      if (Number.isFinite(previous?.x) && Number.isFinite(previous?.y)) {
        state.player.x = previous.x;
        state.player.y = previous.y;
      }
      state.player.facing = savedPosition.facing || previous?.facing || state.player.facing;
    } else if (Number.isFinite(savedPosition?.x) && Number.isFinite(savedPosition?.y)) {
      state.player.x = savedPosition.x;
      state.player.y = savedPosition.y;
      state.player.facing = savedPosition.facing || state.player.facing;
    }
  }

  if (Array.isArray(world.plots)) {
    ownedPlots.clear();
    myOwnedPlots.clear();
    myStarterPlots.clear();
    plotOwners.clear();
    purchasedPlots.clear();
    for (const plot of world.plots) {
      if (!Number.isInteger(plot.x) || !Number.isInteger(plot.y)) continue;
      const key = tileKey(plot.x, plot.y);
      const ownerUserId = plot.ownerUserId || null;
      ownedPlots.add(key);
      if (ownerUserId) plotOwners.set(key, ownerUserId);
      if (ownerUserId === state.account.id) {
        myOwnedPlots.add(key);
        if (plot.source === "starter") {
          myStarterPlots.add(key);
        } else {
          purchasedPlots.add(key);
        }
      }
    }
  }

  if (Array.isArray(world.buildings)) {
    buildings.length = 0;
    for (const item of world.buildings) {
      const tiles = Array.isArray(item.tiles) ? item.tiles.map((tile) => ({ x: tile.x, y: tile.y })).filter((tile) => Number.isInteger(tile.x) && Number.isInteger(tile.y)) : [];
      if (!item.id || !tiles.length) continue;
      buildings.push({
        id: item.id,
        boardId: item.boardId || null,
        ownerUserId: item.ownerUserId || state.account.id,
        ownerName: item.ownerName || "",
        ownerColor: item.ownerColor || null,
        name: item.name || item.artMeta?.forumTitle || item.artMeta?.name || "Building",
        tiles,
        tileKeys: new Set(tiles.map((tile) => tileKey(tile.x, tile.y))),
        imageUrl: item.imageUrl,
        image: null,
        width: numberOr(item.width, 0),
        height: numberOr(item.height, 0),
        materialCosts: item.materialCosts || {},
        artMeta: item.artMeta || {},
        createdAt: performance.now() - 1000
      });
    }
  }

  if (pendingRoomPosition) restoreSavedRoom(pendingRoomPosition);

  const savedGateEdgeIds = [];
  state.gateEdgeIds.clear();
  gateEdgeOwners.clear();
  animals.length = 0;
  if (Array.isArray(world.features)) {
    harvestedFeatures.clear();
    harvestedFeatureOwners.clear();
    plantedSaplings.clear();
    plantedSaplingOwners.clear();
    floorMaterials.clear();
    floorMaterialOwners.clear();
    for (const feature of world.features) {
      if (!Number.isInteger(feature.x) || !Number.isInteger(feature.y)) continue;
      const key = tileKey(feature.x, feature.y);
      const ownerUserId = feature.ownerUserId || null;
      const gateEdgeId = edgeIdFromGateFeature(feature);
      if (gateEdgeId && feature.state === "gate") {
        savedGateEdgeIds.push(gateEdgeId);
        if (ownerUserId) gateEdgeOwners.set(gateEdgeId, ownerUserId);
      } else if (feature.featureType === "animal") {
        const animal = animalFromFeature(feature, animals.length);
        if (animal) animals.push(animal);
      } else if (feature.featureType === "floor" && (feature.state === "wood" || feature.state === "stone")) {
        floorMaterials.set(key, feature.state);
        if (ownerUserId) floorMaterialOwners.set(key, ownerUserId);
      } else if (feature.state === "harvested") {
        harvestedFeatures.add(key);
        if (ownerUserId) harvestedFeatureOwners.set(key, ownerUserId);
      } else if (feature.featureType === "sapling") {
        plantedSaplings.set(key, {
          x: feature.x,
          y: feature.y,
          plantedAt: numberOr(feature.plantedAt, Date.now()),
          nextCheck: numberOr(feature.nextCheck, Date.now() + ACORN_GROW_CHECK_MS),
          grown: Boolean(feature.grown)
        });
        if (ownerUserId) plantedSaplingOwners.set(key, ownerUserId);
      }
    }
  }
  ensureStarterAnimals();
  for (const edgeId of savedGateEdgeIds) state.gateEdgeIds.add(edgeId);
  syncGateEdgeIds();
  invalidateTerrainCache();
  invalidateFenceEdgesCache();

  if (Array.isArray(world.homeMessages)) {
    applyHomeMessages(world.homeMessages, { preserveLocalPlayer });
  }

  if (Array.isArray(world.players)) {
    applyRemotePlayers(world.players);
  }
}

function normalizeHomeMessages(messages) {
  return (Array.isArray(messages) ? messages : []).slice(-120).map((entry) => ({
    id: entry.id || null,
    authorUserId: entry.authorUserId || null,
    author: entry.author || "You",
    authorColor: entry.authorColor || null,
    message: entry.message || "",
    time: entry.time || "",
    createdAt: entry.createdAt || new Date().toISOString(),
    worldPosition: entry.worldPosition || {},
    xpAwarded: Math.max(0, Math.floor(numberOr(entry.xpAwarded, 0))),
    qualityScore: Math.max(0, Math.floor(numberOr(entry.qualityScore, 0))),
    feedbackPenaltyApplied: Boolean(entry.feedbackPenaltyApplied)
  })).filter((entry) => entry.message);
}

function homeMessageKey(entry) {
  return entry.id || `${entry.authorUserId || ""}:${entry.createdAt || ""}:${entry.message || ""}`;
}

function updateLatestHomeMessageTimestamp(messages) {
  let latest = lastLiveMessageCreatedAt ? Date.parse(lastLiveMessageCreatedAt) : 0;
  for (const entry of messages) {
    const time = Date.parse(entry.createdAt);
    if (Number.isFinite(time) && time > latest) latest = time;
  }
  if (latest) lastLiveMessageCreatedAt = new Date(latest).toISOString();
}

function applyHomeMessages(messages, options = {}) {
  const preserveLocalPlayer = Boolean(options.preserveLocalPlayer);
  const append = Boolean(options.append);
  const incomingMessages = normalizeHomeMessages(messages);

  if (append) {
    if (!incomingMessages.length) return;
    const byKey = new Map(state.homeMessages.map((entry) => [homeMessageKey(entry), entry]));
    for (const entry of incomingMessages) byKey.set(homeMessageKey(entry), entry);
    state.homeMessages = [...byKey.values()]
      .sort((a, b) => (Date.parse(a.createdAt) || 0) - (Date.parse(b.createdAt) || 0))
      .slice(-120);
  } else {
    state.homeMessages = incomingMessages;
  }

  if (preserveLocalPlayer) {
    showNewRemoteMessages(append ? incomingMessages : state.homeMessages);
  } else {
    for (const entry of state.homeMessages) if (entry.id) seenWorldMessageIds.add(entry.id);
  }

  updateLatestHomeMessageTimestamp(append ? incomingMessages : state.homeMessages);
  state.recentChatMessages = state.homeMessages
    .slice(-MESSAGE_RECENT_LIMIT)
    .map((entry) => createMessageHistoryEntry(entry.message, Date.parse(entry.createdAt) || Date.now(), entry.xpAwarded));
  if (state.homeChatOpen) updateHomeChatPanel();
  if (state.forumOpen) updateForumPanel();
}

function applyLiveWorld(live) {
  if (!live || typeof live !== "object") return;
  if (Array.isArray(live.players)) applyRemotePlayers(live.players);
  if (Array.isArray(live.homeMessages)) {
    applyHomeMessages(live.homeMessages, { preserveLocalPlayer: true, append: true });
  }
}

function applyRemotePlayers(players) {
  const now = performance.now();
  const seen = new Set();
  for (const player of players) {
    if (!player?.userId || player.userId === state.account.id) continue;
    const position = normalizeRemotePosition(player.position);
    if (!position || position.mode === "room") continue;
    seen.add(player.userId);
    const existing = remotePlayers.get(player.userId);
    const displayName = player.name || player.email || "WAi Forward member";
    const next = existing || {
      userId: player.userId,
      x: position.x,
      y: position.y,
      z: position.z,
      targetX: position.x,
      targetY: position.y,
      targetZ: position.z,
      vx: 0,
      vy: 0,
      facing: position.facing,
      bubbleText: "",
      bubbleUntil: 0
    };
    next.name = displayName;
    next.email = player.email || "";
    next.initials = initialsForName(displayName);
    next.color = player.color || "#385f71";
    next.targetX = position.x;
    next.targetY = position.y;
    next.targetZ = position.z;
    next.facing = position.facing;
    next.mode = position.mode;
    next.lastSeenAt = now;
    remotePlayers.set(player.userId, next);
  }

  for (const [userId, player] of remotePlayers) {
    if (!seen.has(userId) && now - (player.lastSeenAt || 0) > REMOTE_PLAYER_STALE_MS) {
      remotePlayers.delete(userId);
    }
  }
}

function normalizeRemotePosition(position) {
  const x = Number(position?.x);
  const y = Number(position?.y);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  const z = Number(position?.z);
  const facing = Number(position?.facing);
  return {
    x,
    y,
    z: Number.isFinite(z) ? z : 0,
    facing: Number.isFinite(facing) && facing < 0 ? -1 : 1,
    mode: position?.mode === "room" ? "room" : "world"
  };
}

function showNewRemoteMessages(messages) {
  for (const entry of messages) {
    if (!entry.id || seenWorldMessageIds.has(entry.id)) continue;
    seenWorldMessageIds.add(entry.id);
    if (!entry.authorUserId || entry.authorUserId === state.account.id) continue;
    let remote = remotePlayers.get(entry.authorUserId);
    const position = normalizeRemotePosition(entry.worldPosition);
    if (!remote && position && position.mode !== "room") {
      remote = {
        userId: entry.authorUserId,
        name: entry.author || "WAi Forward member",
        initials: initialsForName(entry.author || "WA"),
        color: entry.authorColor || "#385f71",
        x: position.x,
        y: position.y,
        z: position.z,
        targetX: position.x,
        targetY: position.y,
        targetZ: position.z,
        vx: 0,
        vy: 0,
        facing: position.facing,
        mode: position.mode,
        lastSeenAt: performance.now()
      };
      remotePlayers.set(entry.authorUserId, remote);
    }
    if (!remote) continue;
    remote.bubbleText = entry.message;
    remote.bubbleUntil = performance.now() + Math.min(8000, 2400 + entry.message.length * 70);
    if (position && position.mode !== "room") {
      remote.targetX = position.x;
      remote.targetY = position.y;
      remote.targetZ = position.z;
    }
  }
}

function serializeWorld() {
  return {
    player: {
      gold: Math.floor(state.gold),
      playerXp: Math.floor(state.playerXp),
      homeXp: Math.floor(state.homeXp),
      goldXpMilestone: Math.floor(state.goldXpMilestone),
      resources: state.resources,
      items: state.items,
      hotbar: state.hotbar,
      activeHotbarSlot: state.activeHotbarSlot,
      position: serializePlayerPosition()
    },
    plots: [...myOwnedPlots].map((key) => {
      const tile = keyToTile(key);
      return {
        ...tile,
        ownerUserId: state.account.id,
        source: isStarterPlot(tile.x, tile.y) ? "starter" : "purchased"
      };
    }),
    buildings: buildings.filter(isOwnBuilding).map((building) => ({
      id: building.id,
      boardId: building.boardId || null,
      ownerUserId: state.account.id,
      name: building.name || building.artMeta?.forumTitle || building.artMeta?.name || "Building",
      tiles: building.tiles.map((tile) => ({ x: tile.x, y: tile.y })),
      imageUrl: building.imageUrl,
      width: building.width,
      height: building.height,
      materialCosts: building.materialCosts || {},
      artMeta: building.artMeta || {}
    })),
    features: [
      ...generateFenceEdges().filter((edge) => edge.gate && isOwnFenceEdge(edge)).map((edge) => ({
        x: edge.tileX,
        y: edge.tileY,
        ownerUserId: state.account.id,
        featureType: gateFeatureTypeForEdge(edge),
        state: "gate"
      })),
      ...[...floorMaterials.entries()].filter(([key]) => featureEntryBelongsToMe(key, floorMaterialOwners)).map(([key, material]) => {
        const tile = keyToTile(key);
        return { ...tile, ownerUserId: state.account.id, featureType: "floor", state: material };
      }),
      ...[...harvestedFeatures].filter((key) => featureEntryBelongsToMe(key, harvestedFeatureOwners)).map((key) => {
        const tile = keyToTile(key);
        return { ...tile, ownerUserId: state.account.id, featureType: "terrain", state: "harvested" };
      }),
      ...[...plantedSaplings.entries()].filter(([key]) => featureEntryBelongsToMe(key, plantedSaplingOwners)).map(([, sapling]) => ({
        x: sapling.x,
        y: sapling.y,
        ownerUserId: state.account.id,
        featureType: "sapling",
        state: "planted",
        plantedAt: sapling.plantedAt,
        nextCheck: sapling.nextCheck,
        grown: sapling.grown
      })),
      ...animals.map((animal, index) => {
        const position = animalFeaturePosition(animal, index);
        if (!position) return null;
        return {
          x: position.x,
          y: position.y,
          featureType: "animal",
          state: animal.type
        };
      }).filter(Boolean)
    ],
    homeMessages: state.homeMessages.filter((entry) => !entry.authorUserId || entry.authorUserId === state.account.id)
  };
}

function scheduleWorldSave() {
  if (!worldLoaded || worldPersistenceUnavailable) return;
  clearTimeout(worldSaveTimer);
  worldSaveTimer = setTimeout(saveWorld, WORLD_SAVE_DELAY_MS);
}

async function saveWorld() {
  if (worldPersistenceUnavailable) return;
  clearTimeout(worldSaveTimer);
  worldSaveTimer = null;
  try {
    const response = await fetch("/api/world", {
      method: "PUT",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ world: serializeWorld() })
    });
    if (response.status === 503) worldPersistenceUnavailable = true;
    if (!response.ok && response.status !== 503) throw new Error(`World save failed: ${response.status}`);
  } catch (error) {
    console.warn(error);
  }
}

function saveWorldBeforePageHide() {
  if (!worldLoaded || worldPersistenceUnavailable) return;
  clearTimeout(worldSaveTimer);
  worldSaveTimer = null;

  const body = JSON.stringify({ world: serializeWorld() });
  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon("/api/world", blob)) return;
  }

  fetch("/api/world", {
    method: "POST",
    credentials: "same-origin",
    headers: { "content-type": "application/json" },
    body,
    keepalive: true
  }).catch((error) => console.warn(error));
}

function maybeRefreshSharedWorld(now = performance.now()) {
  if (!worldLoaded || worldPersistenceUnavailable || sharedWorldRefreshInFlight || liveWorldRefreshInFlight) return;
  if (state.editor.active || state.previewCapture || worldSaveTimer) return;
  if (now - lastSharedWorldRefreshAt < WORLD_REFRESH_INTERVAL_MS) return;
  lastSharedWorldRefreshAt = now;
  sharedWorldRefreshInFlight = true;
  fetch("/api/world", { credentials: "same-origin" })
    .then((response) => {
      if (response.status === 503) {
        worldPersistenceUnavailable = true;
        return null;
      }
      if (!response.ok) throw new Error(`World refresh failed: ${response.status}`);
      return response.json();
    })
    .then((payload) => {
      if (payload?.world) applyWorld(payload.world, { preserveLocalPlayer: true });
    })
    .catch((error) => console.warn(error))
    .finally(() => {
      sharedWorldRefreshInFlight = false;
    });
}

function maybeRefreshLiveWorld(now = performance.now()) {
  if (!worldLoaded || worldPersistenceUnavailable || liveWorldRefreshInFlight || sharedWorldRefreshInFlight) return;
  if (state.editor.active || state.previewCapture || worldSaveTimer) return;
  if (now - lastLiveWorldRefreshAt < LIVE_REFRESH_INTERVAL_MS) return;

  lastLiveWorldRefreshAt = now;
  liveWorldRefreshInFlight = true;
  const messageQuery = lastLiveMessageCreatedAt
    ? `?messages_since=${encodeURIComponent(lastLiveMessageCreatedAt)}`
    : "";
  fetch(`/api/world/live${messageQuery}`, { credentials: "same-origin" })
    .then((response) => {
      if (response.status === 503) {
        worldPersistenceUnavailable = true;
        return null;
      }
      if (!response.ok) throw new Error(`Live world refresh failed: ${response.status}`);
      return response.json();
    })
    .then((payload) => {
      if (payload?.live) applyLiveWorld(payload.live);
    })
    .catch((error) => console.warn(error))
    .finally(() => {
      liveWorldRefreshInFlight = false;
    });
}

function maybeSyncPlayerPosition(now = performance.now()) {
  if (!worldLoaded || worldPersistenceUnavailable || playerPositionSyncInFlight) return;
  if (now - lastPlayerPositionSyncAt < PLAYER_POSITION_SYNC_MS) return;
  const position = serializePlayerPosition();
  const snapshot = JSON.stringify(position);
  const keepAliveDue = now - lastPlayerPositionSyncAt >= PLAYER_POSITION_KEEPALIVE_MS;
  if (snapshot === lastPlayerPositionSyncSnapshot && !keepAliveDue) return;

  lastPlayerPositionSyncAt = now;
  lastPlayerPositionSyncSnapshot = snapshot;
  playerPositionSyncInFlight = true;
  fetch("/api/player-position", {
    method: "POST",
    credentials: "same-origin",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ position })
  })
    .then((response) => {
      if (response.status === 503) worldPersistenceUnavailable = true;
      if (!response.ok && response.status !== 503) throw new Error(`Player position save failed: ${response.status}`);
    })
    .catch((error) => console.warn(error))
    .finally(() => {
      playerPositionSyncInFlight = false;
    });
}

function numberOr(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeHotbar(value) {
  const slots = Array.isArray(value) ? value.slice(0, HOTBAR_SLOTS) : [];
  while (slots.length < HOTBAR_SLOTS) slots.push(null);
  return slots.map((item) => item || null);
}

function serializePositionNumber(value) {
  return Math.round(numberOr(value, 0) * 1000) / 1000;
}

function serializePlayerPosition() {
  return {
    x: serializePositionNumber(state.player.x),
    y: serializePositionNumber(state.player.y),
    z: serializePositionNumber(state.player.z),
    facing: state.player.facing,
    mode: state.room.active ? "room" : "world",
    roomBuildingId: state.room.active ? state.room.buildingId : null,
    previousWorldPosition: state.room.active ? state.room.previousWorldPosition : null
  };
}

function isOwnBuilding(building) {
  return !building?.ownerUserId || building.ownerUserId === state.account.id;
}

function featureEntryBelongsToMe(key, ownerMap) {
  const ownerUserId = ownerMap.get(key);
  if (ownerUserId) return ownerUserId === state.account.id;
  const tile = keyToTile(key);
  return isOwnHomeTile(tile.x, tile.y);
}

function createClientId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (char) =>
    (Number(char) ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> Number(char) / 4).toString(16)
  );
}

function isWildAdjacentToHome(x, y) {
  if (isHomeTile(x, y)) return false;
  return isOwnHomeTile(x + 1, y) || isOwnHomeTile(x - 1, y) || isOwnHomeTile(x, y + 1) || isOwnHomeTile(x, y - 1);
}

function canStartSelection(tile) {
  return isOwnHomeTile(tile.x, tile.y) || isWildAdjacentToHome(tile.x, tile.y);
}

function selectedHotbarItem() {
  const id = state.hotbar[state.activeHotbarSlot];
  return inventoryItems.find((item) => item.id === id) || null;
}

function canPlantAcorn(tile) {
  const terrain = terrainAt(tile.x, tile.y);
  if ((state.items.acorns || 0) <= 0) return { ok: false, message: "No acorns." };
  if (terrain.baseType === "water") return { ok: false, message: "Acorns need dry land." };
  if (terrain.feature) return { ok: false, message: "Needs empty land." };
  if (buildingOccupiesTile(tile.x, tile.y)) return { ok: false, message: "Needs empty land." };
  return { ok: true, terrain };
}

function plantAcorn(tile) {
  const result = canPlantAcorn(tile);
  if (!result.ok) {
    state.bubbleText = result.message;
    state.bubbleUntil = performance.now() + 1600;
    return true;
  }

  const now = Date.now();
  const key = tileKey(tile.x, tile.y);
  if (!spendItem("acorns", 1)) return true;
  harvestedFeatures.delete(key);
  harvestedFeatureOwners.delete(key);
  plantedSaplings.set(key, {
    x: tile.x,
    y: tile.y,
    plantedAt: now,
    nextCheck: now + ACORN_GROW_MIN_MS,
    grown: false
  });
  plantedSaplingOwners.set(key, state.account.id);
  invalidateTerrainCache();
  clearSelection();
  state.bubbleText = "Planted acorn.";
  state.bubbleUntil = performance.now() + 1800;
  scheduleWorldSave();
  return true;
}

function useActiveItemOnTile(tile) {
  const item = selectedHotbarItem();
  if (!item) return false;
  if (item.id === "acorns") return plantAcorn(tile);
  return false;
}

function fenceEdgeScreenScore(edge, screenX, screenY) {
  const a = screenFromWorld(edge.ax, edge.ay, 0);
  const b = screenFromWorld(edge.bx, edge.by, 0);
  const railScore = distanceToSegment(screenX, screenY, a.x, a.y - 9, b.x, b.y - 9);
  const baseScore = distanceToSegment(screenX, screenY, a.x, a.y + 7, b.x, b.y + 7);
  const startPostScore = distanceToSegment(screenX, screenY, a.x, a.y - 35, a.x, a.y + 7);
  const endPostScore = distanceToSegment(screenX, screenY, b.x, b.y - 35, b.x, b.y + 7);
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const gateScore = Math.hypot(screenX - mid.x, screenY - (mid.y + 3));
  return edge.gate
    ? Math.min(gateScore, railScore, baseScore)
    : Math.min(railScore, baseScore, startPostScore, endPostScore);
}

function fenceEdgeForTile(tile, screenX, screenY) {
  return generateFenceEdges()
    .filter((edge) => edge.tileX === tile.x && edge.tileY === tile.y)
    .map((edge) => ({ edge, score: fenceEdgeScreenScore(edge, screenX, screenY) }))
    .sort((a, b) => a.score - b.score)[0]?.edge || null;
}

function setHomeChatOpen(open) {
  state.homeChatOpen = open;
  homeChatPanel.classList.toggle("active", open);
  if (open) updateHomeChatPanel();
}

function setForumOpen(open) {
  state.forumOpen = open;
  forumPanel.classList.toggle("active", open);
  forumButton.classList.toggle("active", open);
  forumButton.setAttribute("aria-expanded", open ? "true" : "false");
  forumButton.setAttribute("aria-label", open ? "Close forum" : "Open forum");
  if (open) {
    setInventoryOpen(false);
    setCraftingOpen(false);
    setHomeChatOpen(false);
    updateForumPanel();
  }
}

function forumBoardTitle(building, index) {
  const buildingName = String(building.name || "").trim();
  return building.artMeta?.forumTitle || building.artMeta?.name || (buildingName && buildingName !== "Building" ? buildingName : "") || `Building Board ${index + 1}`;
}

function forumBoardDescription(building, topics) {
  const savedDescription = String(building.artMeta?.forumDescription || building.artMeta?.description || "").trim();
  if (savedDescription) return savedDescription;
  return `${building.tiles.length} plot building board with ${topics.length} topic room${topics.length === 1 ? "" : "s"}.`;
}

function forumBoardVisibility(building) {
  const visibility = String(building.artMeta?.visibility || "public").toLowerCase();
  return visibility === "company" || visibility === "private" ? visibility : "public";
}

function forumDateLabel(value) {
  const timestamp = Date.parse(value || "");
  if (!Number.isFinite(timestamp)) return "No posts yet";
  return new Date(timestamp).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function buildForumData() {
  const boards = [];
  let boardIndex = 0;
  buildings.forEach((building) => {
    if (!isBoardBuilding(building)) return;

    const index = boardIndex++;
    const layout = roomLayoutForBuilding(building);
    const topics = layout.rooms.map((room) => ({
      id: room.id,
      title: room.name,
      description: `${room.tiles.length} tile room representation inside this board building.`,
      roomName: room.name,
      postCount: 0,
      lastActivity: null,
      posts: [],
      buildingId: building.id,
      roomId: room.id
    }));

    boards.push({
      id: building.id,
      title: forumBoardTitle(building, index),
      description: forumBoardDescription(building, topics),
      visibility: forumBoardVisibility(building),
      kind: "building",
      ownerUserId: building.ownerUserId || state.account.id,
      ownerName: building.ownerName || state.account.name,
      topicCount: topics.length,
      postCount: topics.reduce((total, topic) => total + topic.postCount, 0),
      lastActivity: topics.map((topic) => topic.lastActivity).filter(Boolean).sort().at(-1) || null,
      buildingId: building.id,
      topics
    });
  });

  return boards;
}

function forumTabLabel(tab = state.forum.tab) {
  return {
    public: "Public Boards",
    company: "Company Boards",
    private: "Private Boards",
    your: "Your Boards"
  }[tab] || "Boards";
}

function filterForumBoardsForTab(boards, tab = state.forum.tab) {
  if (tab === "your") return boards.filter((board) => !board.ownerUserId || board.ownerUserId === state.account.id);
  return boards.filter((board) => board.visibility === tab);
}

function selectedForumBoard(boards = buildForumData()) {
  return boards.find((board) => board.id === state.forum.boardId) || boards[0] || null;
}

function selectedForumTopic(board) {
  if (!board) return null;
  return board.topics.find((topic) => topic.id === state.forum.topicId) || null;
}

function renderForumBoardList(boards) {
  forumBoardList.innerHTML = "";

  if (!boards.length) {
    const empty = document.createElement("div");
    empty.className = "forum-empty";
    empty.textContent = `No ${forumTabLabel().toLowerCase()} yet.`;
    forumBoardList.appendChild(empty);
    return;
  }

  for (const board of boards) {
    const button = document.createElement("button");
    button.className = "forum-board-row";
    button.type = "button";
    button.classList.toggle("active", board.id === state.forum.boardId);
    button.addEventListener("click", () => {
      state.forum.boardId = board.id;
      state.forum.topicId = null;
      updateForumPanel();
    });

    const copy = document.createElement("span");
    copy.className = "forum-row-copy";
    const title = document.createElement("strong");
    title.textContent = board.title;
    const description = document.createElement("span");
    description.textContent = board.description;
    copy.append(title, description);

    const stats = document.createElement("span");
    stats.className = "forum-row-stats";
    stats.innerHTML = `<span>${board.topicCount} topics</span><span>${board.postCount} posts</span>`;

    button.append(copy, stats);
    forumBoardList.appendChild(button);
  }
}

function renderForumTopics(board, topic) {
  forumTopicList.innerHTML = "";
  forumPostList.innerHTML = "";
  if (!board) {
    forumTitle.textContent = forumTabLabel();
    forumSubtitle.textContent = "Boards in this tab will appear here when they are available.";
    forumBreadcrumb.textContent = forumTabLabel();
    forumBackButton.hidden = true;
    const empty = document.createElement("div");
    empty.className = "forum-empty";
    empty.textContent = `No ${forumTabLabel().toLowerCase()} yet.`;
    forumTopicList.appendChild(empty);
    return;
  }

  forumTitle.textContent = topic ? topic.title : board.title;
  forumSubtitle.textContent = topic ? topic.description : board.description;
  forumBreadcrumb.textContent = topic ? `${board.title} / ${topic.title}` : `${board.title} / topics`;
  forumBackButton.hidden = !topic;

  if (!topic && board.kind === "building") {
    const enterBoard = document.createElement("button");
    enterBoard.className = "forum-enter-button";
    enterBoard.type = "button";
    enterBoard.textContent = "Enter board building";
    enterBoard.addEventListener("click", () => openForumRoom(board.buildingId));
    forumTopicList.appendChild(enterBoard);
  }

  if (!topic) {
    const heading = document.createElement("div");
    heading.className = "forum-topic-heading";
    heading.innerHTML = "<span>Topic</span><span>Posts</span><span>Last post</span>";
    forumTopicList.appendChild(heading);

    for (const item of board.topics) {
      const row = document.createElement("button");
      row.className = "forum-topic-row";
      row.type = "button";
      row.addEventListener("click", () => {
        state.forum.topicId = item.id;
        updateForumPanel();
      });

      const copy = document.createElement("span");
      copy.className = "forum-row-copy";
      const title = document.createElement("strong");
      title.textContent = item.title;
      const description = document.createElement("span");
      description.textContent = item.description;
      copy.append(title, description);

      const posts = document.createElement("span");
      posts.className = "forum-count";
      posts.textContent = item.postCount.toString();

      const last = document.createElement("span");
      last.className = "forum-last-post";
      last.textContent = forumDateLabel(item.lastActivity);

      row.append(copy, posts, last);
      forumTopicList.appendChild(row);
    }
    return;
  }

  if (topic.buildingId) {
    const enterRoom = document.createElement("button");
    enterRoom.className = "forum-enter-button";
    enterRoom.type = "button";
    enterRoom.textContent = `Enter ${topic.roomName}`;
    enterRoom.addEventListener("click", () => openForumRoom(topic.buildingId, topic.roomId));
    forumTopicList.appendChild(enterRoom);
  }

  if (!topic.posts.length) {
    const empty = document.createElement("div");
    empty.className = "forum-empty";
    empty.textContent = "No posts in this topic yet.";
    forumPostList.appendChild(empty);
    return;
  }

  for (const post of topic.posts) {
    const article = document.createElement("article");
    article.className = "forum-post";

    const meta = document.createElement("div");
    meta.className = "forum-post-meta";
    const author = document.createElement("strong");
    author.textContent = post.author;
    const time = document.createElement("time");
    time.textContent = forumDateLabel(post.time);
    meta.append(author, time);

    const body = document.createElement("p");
    body.textContent = post.body;

    article.append(meta, body);
    if (post.xpAwarded) {
      const badge = document.createElement("span");
      badge.className = "forum-xp-badge";
      badge.textContent = `+${post.xpAwarded} XP`;
      article.appendChild(badge);
    }
    forumPostList.appendChild(article);
  }
}

function renderForumTabs() {
  forumTabs.querySelectorAll(".forum-tab").forEach((button) => {
    const active = button.dataset.forumTab === state.forum.tab;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", active ? "true" : "false");
    button.tabIndex = active ? 0 : -1;
  });
}

function updateForumPanel() {
  const boards = filterForumBoardsForTab(buildForumData());
  renderForumTabs();

  if (!boards.some((board) => board.id === state.forum.boardId)) {
    state.forum.boardId = boards[0]?.id || null;
    state.forum.topicId = null;
  }

  const board = selectedForumBoard(boards);
  const topic = selectedForumTopic(board);
  if (state.forum.topicId && !topic) state.forum.topicId = null;

  renderForumBoardList(boards);
  renderForumTopics(board, selectedForumTopic(board));
}

function openForumRoom(buildingId, roomId = null) {
  const building = buildings.find((item) => item.id === buildingId);
  if (!building) return;

  enterBuilding(building);
  if (roomId) {
    const room = state.room.rooms.find((item) => item.id === roomId);
    if (room?.tiles?.length) {
      const center = room.tiles.reduce((total, tile) => ({
        x: total.x + tile.x + 0.5,
        y: total.y + tile.y + 0.5
      }), { x: 0, y: 0 });
      const feet = {
        x: center.x / room.tiles.length,
        y: center.y / room.tiles.length
      };
      const position = playerPositionForFeet(feet.x, feet.y);
      state.player.x = position.x;
      state.player.y = position.y;
      state.player.vx = 0;
      state.player.vy = 0;
    }
  }

  state.bubbleText = roomId ? "Opened topic room." : "Opened board building.";
  state.bubbleUntil = performance.now() + 1800;
  setForumOpen(false);
}

function updateHomeChatPanel() {
  homeChatList.innerHTML = "";
  if (!state.homeMessages.length) {
    const empty = document.createElement("div");
    empty.className = "home-chat-empty";
    empty.textContent = "No messages have been sent inside this home yet.";
    homeChatList.appendChild(empty);
    return;
  }

  for (const entry of [...state.homeMessages].reverse()) {
    const item = document.createElement("article");
    item.className = "home-chat-entry";

    const meta = document.createElement("div");
    meta.className = "home-chat-meta";
    const author = document.createElement("span");
    author.textContent = entry.author;
    const time = document.createElement("time");
    time.textContent = entry.time;
    meta.append(author, time);

    const message = document.createElement("p");
    message.className = "home-chat-message";
    message.textContent = entry.message;

    item.append(meta, message);
    homeChatList.appendChild(item);
  }
}

function updateInventoryPanel() {
  inventoryPanel.classList.toggle("active", state.inventoryOpen);
  inventoryButton.classList.toggle("active", state.inventoryOpen);
  inventoryList.innerHTML = "";
  inventoryHotbarSlots.innerHTML = "";

  for (const item of inventoryItems) {
    const row = document.createElement("button");
    row.className = "inventory-item";
    row.type = "button";
    row.disabled = (state.items[item.id] || 0) <= 0;
    row.classList.toggle("active", state.itemToAssign === item.id);
    row.addEventListener("click", () => {
      state.itemToAssign = state.itemToAssign === item.id ? null : item.id;
      updateInventoryPanel();
      scheduleWorldSave();
    });

    const icon = document.createElement("span");
    icon.className = `item-icon ${item.id}`;
    icon.setAttribute("aria-hidden", "true");

    const name = document.createElement("span");
    name.className = "inventory-name";
    name.textContent = item.name;

    const count = document.createElement("strong");
    count.className = "inventory-count";
    count.textContent = (state.items[item.id] || 0).toString();

    row.append(icon, name, count);
    inventoryList.appendChild(row);
  }

  for (let i = 0; i < HOTBAR_SLOTS; i++) {
    inventoryHotbarSlots.appendChild(makeHotbarSlotButton(i, true));
  }
}

function selectedCraftingRecipe() {
  return craftingRecipes.find((recipe) => recipe.id === state.selectedCraftingRecipeId) || craftingRecipes[0];
}

function canCraftRecipe(recipe) {
  return Object.entries(recipe.costs).every(([id, amount]) => (state.resources[id] || 0) >= amount);
}

function updateCraftingPanel() {
  craftingPanel.classList.toggle("active", state.craftingOpen);
  craftingButton.classList.toggle("active", state.craftingOpen);
  craftingButton.setAttribute("aria-expanded", state.craftingOpen ? "true" : "false");
  craftingButton.setAttribute("aria-label", state.craftingOpen ? "Close crafting" : "Open crafting");
  craftingRecipeList.innerHTML = "";
  craftingRequirements.innerHTML = "";

  const recipe = selectedCraftingRecipe();
  craftingTitle.textContent = recipe?.name || "Recipes";
  craftingDetailTitle.textContent = recipe?.name || "Select a recipe";
  craftingDetailIcon.className = `item-icon ${recipe?.icon || "wood"}`;

  for (const candidate of craftingRecipes) {
    const button = document.createElement("button");
    button.className = "crafting-recipe";
    button.classList.toggle("active", candidate.id === recipe.id);
    button.type = "button";
    button.setAttribute("aria-pressed", candidate.id === recipe.id ? "true" : "false");
    button.addEventListener("click", () => {
      state.selectedCraftingRecipeId = candidate.id;
      updateCraftingPanel();
    });

    const icon = document.createElement("span");
    icon.className = `item-icon ${candidate.icon}`;
    icon.setAttribute("aria-hidden", "true");

    const name = document.createElement("span");
    name.className = "inventory-name";
    name.textContent = candidate.name;

    button.append(icon, name);
    craftingRecipeList.appendChild(button);
  }

  if (!recipe) {
    craftButton.disabled = true;
    craftButton.textContent = "Craft";
    return;
  }

  for (const [id, amount] of Object.entries(recipe.costs)) {
    const available = state.resources[id] || 0;
    const row = document.createElement("div");
    row.className = "crafting-requirement";
    row.classList.toggle("missing", available < amount);

    const icon = document.createElement("span");
    icon.className = `item-icon ${id}`;
    icon.setAttribute("aria-hidden", "true");

    const name = document.createElement("span");
    name.textContent = materialName(id);

    const count = document.createElement("strong");
    count.textContent = `${available}/${amount}`;

    row.append(icon, name, count);
    craftingRequirements.appendChild(row);
  }

  craftButton.disabled = !canCraftRecipe(recipe);
  craftButton.textContent = canCraftRecipe(recipe) ? "Craft" : "Need wood";
}

function setInventoryOpen(open) {
  state.inventoryOpen = open;
  if (open) {
    setForumOpen(false);
    setCraftingOpen(false);
  }
  if (!open) state.itemToAssign = null;
  updateInventoryPanel();
}

function setCraftingOpen(open) {
  state.craftingOpen = open;
  if (open) {
    setForumOpen(false);
    setInventoryOpen(false);
  }
  updateCraftingPanel();
}

function craftSelectedRecipe() {
  const recipe = selectedCraftingRecipe();
  if (!recipe) return;
  if (!canCraftRecipe(recipe)) {
    const missing = Object.entries(recipe.costs)
      .filter(([id, amount]) => (state.resources[id] || 0) < amount)
      .map(([id, amount]) => `${amount - (state.resources[id] || 0)} ${materialName(id)}`)
      .join(", ");
    state.bubbleText = `Need ${missing}.`;
    state.bubbleUntil = performance.now() + 1700;
    updateCraftingPanel();
    return;
  }

  spendResources(recipe.costs);
  addItems(recipe.output);
  state.bubbleText = `Crafted ${recipe.name}.`;
  state.bubbleUntil = performance.now() + 1800;
  updateCraftingPanel();
}

function updateResourcePanel() {
  woodResource.textContent = (state.resources.wood || 0).toString();
  stoneResource.textContent = (state.resources.stone || 0).toString();
  sandResource.textContent = (state.resources.sand || 0).toString();
  grassResource.textContent = (state.resources.grass || 0).toString();
  updateResourceToolUi();
  if (state.craftingOpen) updateCraftingPanel();
}

function updateHotbar() {
  hotbar.innerHTML = "";
  for (let i = 0; i < HOTBAR_SLOTS; i++) {
    hotbar.appendChild(makeHotbarSlotButton(i, false));
  }
}

function clearHotbarSlot(index) {
  state.hotbar[index] = null;
  if (state.activeHotbarSlot === index) setEquippedMaterialTool(null);
  updateInventoryPanel();
  updateHotbar();
  scheduleWorldSave();
}

function makeHotbarSlotButton(index, assignable) {
  const itemId = state.hotbar[index];
  const item = inventoryItems.find((candidate) => candidate.id === itemId);
  const button = document.createElement("button");
  button.className = `${assignable ? "inventory-hotbar-slot" : "hotbar-slot"}${item ? "" : " empty"}`;
  button.type = "button";
  button.dataset.slot = String(index + 1);
  button.classList.toggle("active", state.activeHotbarSlot === index);
  button.setAttribute("aria-label", item ? `${item.name} hotbar slot ${index + 1}` : `Empty hotbar slot ${index + 1}`);

  if (item) {
    const key = document.createElement("span");
    key.className = "hotbar-key";
    key.textContent = String(index + 1);
    const icon = document.createElement("span");
    icon.className = `item-icon ${item.id}`;
    icon.setAttribute("aria-hidden", "true");
    const count = document.createElement("span");
    count.className = "hotbar-count";
    count.textContent = (state.items[item.id] || 0).toString();
    button.append(key, icon, count);

    if (assignable) {
      const clear = document.createElement("span");
      clear.className = "hotbar-clear";
      clear.textContent = "x";
      clear.title = `Clear ${item.name} from hotbar slot ${index + 1}`;
      clear.setAttribute("aria-hidden", "true");
      button.append(clear);
    }
  }

  button.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (assignable && item && target?.closest(".hotbar-clear")) {
      clearHotbarSlot(index);
      return;
    }

    if (assignable && state.itemToAssign) {
      state.hotbar[index] = state.itemToAssign;
      state.activeHotbarSlot = index;
      setEquippedMaterialTool(null);
      state.itemToAssign = null;
      updateInventoryPanel();
      updateHotbar();
      scheduleWorldSave();
      return;
    }

    state.activeHotbarSlot = index;
    setEquippedMaterialTool(null);
    updateInventoryPanel();
    updateHotbar();
    scheduleWorldSave();
  });

  if (assignable && item) {
    button.addEventListener("keydown", (event) => {
      if (event.key !== "Backspace" && event.key !== "Delete") return;
      event.preventDefault();
      clearHotbarSlot(index);
    });
  }

  return button;
}

function refreshInventoryUi() {
  updateResourcePanel();
  updateInventoryPanel();
  updateCraftingPanel();
  updateHotbar();
  updateSelectionPanel();
}

function addResources(resources) {
  for (const [id, amount] of Object.entries(resources)) {
    state.resources[id] = (state.resources[id] || 0) + amount;
  }
  updateResourcePanel();
  updateSelectionPanel();
  if (state.editor.active) updateEditorMaterialUi();
  scheduleWorldSave();
}

function spendResources(resources) {
  for (const [id, amount] of Object.entries(resources)) {
    state.resources[id] = Math.max(0, (state.resources[id] || 0) - amount);
  }
  updateResourcePanel();
  updateSelectionPanel();
  if (state.editor.active) updateEditorMaterialUi();
  scheduleWorldSave();
}

function addItems(items) {
  for (const [id, amount] of Object.entries(items)) {
    state.items[id] = (state.items[id] || 0) + amount;
  }
  updateInventoryPanel();
  updateHotbar();
  scheduleWorldSave();
}

function spendItem(id, amount) {
  if ((state.items[id] || 0) < amount) return false;
  state.items[id] -= amount;
  updateInventoryPanel();
  updateHotbar();
  scheduleWorldSave();
  return true;
}

function resourceBrushForId(id) {
  return buildingMaterialBrushes.find((brush) => brush.id === id) || null;
}

function materialName(id) {
  return resourceBrushForId(id)?.name.toLowerCase() || id;
}

function setEquippedMaterialTool(id) {
  const next = id && state.materialTool.equipped !== id ? id : null;
  state.materialTool.equipped = next;
  state.materialTool.painting = false;
  state.materialTool.pointerId = null;
  state.materialTool.lastPaintedKey = null;
  state.materialTool.lastPaintedTile = null;
  if (next) {
    clearSelection();
    state.itemToAssign = null;
    updateInventoryPanel();
  }
  updateResourceToolUi();
}

function updateResourceToolUi() {
  for (const button of resourceToolButtons) {
    const active = state.materialTool.equipped === button.dataset.equipResource;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  }
}

function stopMaterialPainting(pointerId = state.materialTool.pointerId) {
  if (pointerId !== null && pointerId !== undefined && canvas.hasPointerCapture(pointerId)) canvas.releasePointerCapture(pointerId);
  state.materialTool.painting = false;
  state.materialTool.pointerId = null;
  state.materialTool.lastPaintedKey = null;
  state.materialTool.lastPaintedTile = null;
}

function minedResourceForFloor(tile) {
  if (tile.floorMaterial) return tile.floorMaterial;
  if (tile.baseType === "stone") return "stone";
  if (tile.baseType === "sand" || tile.baseType === "water") return "sand";
  return "grass";
}

function paintMaterialStroke(tile) {
  const previous = state.materialTool.lastPaintedTile;
  const steps = previous ? Math.max(Math.abs(tile.x - previous.x), Math.abs(tile.y - previous.y)) : 0;

  if (steps > 1) {
    for (let i = 1; i <= steps; i++) {
      paintMaterialFloor({
        x: Math.round(previous.x + (tile.x - previous.x) * (i / steps)),
        y: Math.round(previous.y + (tile.y - previous.y) * (i / steps))
      });
    }
  } else {
    paintMaterialFloor(tile);
  }

  state.materialTool.lastPaintedTile = tile;
}

function paintMaterialFloor(tile) {
  const material = state.materialTool.equipped;
  if (!material) return false;

  const key = tileKey(tile.x, tile.y);
  if (state.materialTool.lastPaintedKey === key) return true;
  state.materialTool.lastPaintedKey = key;

  if (!isOwnHomeTile(tile.x, tile.y)) {
    state.bubbleText = "Floors can only be placed on your home land.";
    state.bubbleUntil = performance.now() + 1600;
    return true;
  }

  if (buildingOccupiesTile(tile.x, tile.y)) {
    state.bubbleText = "Move the building before changing that floor.";
    state.bubbleUntil = performance.now() + 1600;
    return true;
  }

  const terrain = terrainAt(tile.x, tile.y);
  if (terrain.floorMaterial === material) return true;

  if ((state.resources[material] || 0) < FLOOR_TOOL_COST) {
    state.bubbleText = `Need ${materialName(material)}.`;
    state.bubbleUntil = performance.now() + 1600;
    return true;
  }

  const minedResource = minedResourceForFloor(terrain);
  state.resources[material] = Math.max(0, (state.resources[material] || 0) - FLOOR_TOOL_COST);
  if (minedResource) state.resources[minedResource] = (state.resources[minedResource] || 0) + 1;

  floorMaterials.set(key, material);
  floorMaterialOwners.set(key, state.account.id);
  harvestedFeatures.add(key);
  harvestedFeatureOwners.set(key, state.account.id);
  plantedSaplings.delete(key);
  plantedSaplingOwners.delete(key);
  invalidateTerrainCache();
  clearSelection();
  refreshInventoryUi();
  state.bubbleText = `Placed ${materialName(material)} floor. +1 ${materialName(minedResource)}.`;
  state.bubbleUntil = performance.now() + 1600;
  scheduleWorldSave();
  return true;
}

function hexToRgb(hex) {
  const normalized = hex.replace("#", "").trim();
  if (normalized.length !== 6) return null;
  const value = Number.parseInt(normalized, 16);
  if (Number.isNaN(value)) return null;
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function rgbToHex({ r, g, b }) {
  return `#${[r, g, b].map((value) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0")).join("")}`;
}

function mixRgb(a, b, t) {
  const amount = Math.max(0, Math.min(1, t));
  return {
    r: a.r + (b.r - a.r) * amount,
    g: a.g + (b.g - a.g) * amount,
    b: a.b + (b.b - a.b) * amount
  };
}

function brushColorForBrightness(baseColor, brightnessValue = Number(brushBrightness.value)) {
  const base = hexToRgb(baseColor) || { r: 155, g: 93, b: 52 };
  const brightness = Math.max(0, Math.min(100, brightnessValue));
  if (brightness <= 50) return rgbToHex(mixRgb({ r: 0, g: 0, b: 0 }, base, brightness / 50));
  return rgbToHex(mixRgb(base, { r: 255, g: 255, b: 255 }, (brightness - 50) / 50));
}

function selectedMaterialBrush() {
  return buildingMaterialBrushes.find((brush) => brush.id === state.editor.brushResource) || buildingMaterialBrushes[0];
}

function updateEditorBrushColor() {
  state.editor.brushColor = brushColorForBrightness(state.editor.brushBaseColor);
  brushBrightness.style.setProperty("--brightness-color", state.editor.brushBaseColor);
  brushBrightness.style.setProperty("--brightness-current", state.editor.brushColor);
}

function materialCostTemplate() {
  return Object.fromEntries(buildingMaterialBrushes.map((brush) => [brush.id, 0]));
}

function nearestMaterialBrush(r, g, b) {
  let best = null;
  for (const brush of buildingMaterialBrushes) {
    const distance = Math.hypot(r - brush.rgb.r, g - brush.rgb.g, b - brush.rgb.b);
    if (distance < (best?.distance ?? Infinity)) best = { brush, distance };
  }
  return best && best.distance <= MATERIAL_COLOR_MATCH_DISTANCE ? best.brush : null;
}

function calculateDoodleMaterialCosts() {
  const costs = materialCostTemplate();
  if (!materialCanvas.width || !materialCanvas.height) return costs;

  const coverage = materialCostTemplate();
  const pixels = materialCtx.getImageData(0, 0, materialCanvas.width, materialCanvas.height).data;
  for (let i = 0; i < pixels.length; i += 4) {
    const alpha = pixels[i + 3] / 255;
    if (alpha < 0.08) continue;
    const brush = nearestMaterialBrush(pixels[i], pixels[i + 1], pixels[i + 2]);
    if (brush) coverage[brush.id] += alpha;
  }

  for (const brush of buildingMaterialBrushes) {
    costs[brush.id] = Math.ceil(coverage[brush.id] / MATERIAL_PIXELS_PER_UNIT);
  }
  return costs;
}

function currentEditorMaterialCosts() {
  return state.editor.imageMode === "existing" ? materialCostTemplate() : calculateDoodleMaterialCosts();
}

function formatMaterialCosts(costs, includeZero = false) {
  return buildingMaterialBrushes
    .filter((brush) => includeZero || (costs[brush.id] || 0) > 0)
    .map((brush) => `${costs[brush.id] || 0} ${brush.name.toLowerCase()}`);
}

function buildingGoldCost(tileCount) {
  return tileCount * BUILDING_GOLD_PER_TILE;
}

function currentEditorBuildingGoldCost() {
  if (state.editor.buildType === "decoration") return DECORATION_GOLD_COST;
  return buildingGoldCost(state.editor.snapshot?.tiles.length || 0);
}

function formatBuildingCost(costs, goldCost = currentEditorBuildingGoldCost()) {
  const parts = [`${goldCost} gold`, ...formatMaterialCosts(costs)];
  return parts.join(", ");
}

function missingMaterialRequirements(costs) {
  return buildingMaterialBrushes
    .filter((brush) => (state.resources[brush.id] || 0) < (costs[brush.id] || 0))
    .map((brush) => ({
      id: brush.id,
      name: brush.name.toLowerCase(),
      missing: (costs[brush.id] || 0) - (state.resources[brush.id] || 0)
    }));
}

function updateEditorMaterialUi() {
  if (!state.editor.active) return;

  const costs = currentEditorMaterialCosts();
  state.editor.materialCosts = costs;

  for (const brush of buildingMaterialBrushes) {
    const available = state.resources[brush.id] || 0;
    const required = costs[brush.id] || 0;
    const count = brush.button.querySelector(".swatch-count");
    const requiredEl = brush.button.querySelector(".swatch-required");
    if (count) count.textContent = available.toString();
    if (requiredEl) requiredEl.textContent = required ? `${required} needed` : "0 used";
    brush.button.classList.toggle("short", required > available);
    brush.button.setAttribute("aria-label", `${brush.name} brush, ${available} available, ${required} needed`);
  }

  const materialParts = formatMaterialCosts(costs);
  const missing = missingMaterialRequirements(costs);
  if (!materialParts.length) {
    materialSummary.textContent = "No materials used";
  } else if (missing.length) {
    materialSummary.textContent = `Missing ${missing.map((item) => `${item.missing} ${item.name}`).join(", ")}`;
  } else {
    materialSummary.textContent = `Requires ${materialParts.join(", ")}`;
  }

  const goldCost = currentEditorBuildingGoldCost();
  const hasGold = state.gold >= goldCost;
  const hasMaterials = missing.length === 0;
  const costText = formatBuildingCost(costs, goldCost);
  if (editorBuildCost) editorBuildCost.textContent = costText;
  placeBuildingButton.textContent = `Build ${buildTypeLabel()}`;
  placeBuildingButton.disabled = !state.editor.previewImage || !hasGold || !hasMaterials;
}

function resetPreviewPane() {
  state.editor.previewImage = null;
  state.editor.previewAssetId = null;
  state.editor.generatedPreviewImage = null;
  state.editor.generatedPreviewAssetId = null;
  state.assetLibrary.selectedUrl = null;
  previewPane.innerHTML = "";
  previewStatus.textContent = "No preview";
  previewPane.appendChild(previewStatus);
  renderAssetLibrary();
  updateExistingImageDetails();
}

function handleDoodleChanged() {
  resetPreviewPane();
  updateEditorMaterialUi();
}

async function loadAssetLibrary(force = false) {
  if (state.assetLibrary.loading || (state.assetLibrary.loaded && !force)) {
    renderAssetLibrary();
    return;
  }

  state.assetLibrary.loading = true;
  state.assetLibrary.error = "";
  renderAssetLibrary();

  try {
    const response = await fetch("/api/building-assets", { credentials: "same-origin" });
    if (!response.ok) throw new Error(`Asset library request failed: ${response.status}`);
    const payload = await response.json();
    state.assetLibrary.assets = Array.isArray(payload.assets) ? payload.assets : [];
    state.assetLibrary.loaded = true;
  } catch (error) {
    state.assetLibrary.error = error?.message || "Could not load saved assets.";
    console.warn(error);
  } finally {
    state.assetLibrary.loading = false;
    renderAssetLibrary();
  }
}

function addAssetToLibrary(asset) {
  if (!asset?.url) return;
  state.assetLibrary.loaded = true;
  state.assetLibrary.assets = [
    asset,
    ...state.assetLibrary.assets.filter((item) => item.url !== asset.url && item.id !== asset.id)
  ].slice(0, 240);
  renderAssetLibrary();
}

function editorAssetLibraryItems() {
  const currentType = state.editor.buildType === "decoration" ? "decoration" : "board";
  const current = [];
  const other = [];
  for (const asset of state.assetLibrary.assets) {
    if (!asset?.url) continue;
    if ((asset.assetType || "board") === currentType) current.push(asset);
    else other.push(asset);
  }
  return [...current, ...other];
}

function renderAssetLibrary() {
  if (!assetLibraryList) return;
  assetLibraryList.innerHTML = "";

  if (state.assetLibrary.loading) {
    const text = document.createElement("span");
    text.className = "asset-library-empty";
    text.textContent = "Loading saved assets...";
    assetLibraryList.appendChild(text);
    updateExistingImageDetails();
    return;
  }

  if (state.assetLibrary.error) {
    const text = document.createElement("span");
    text.className = "asset-library-empty";
    text.textContent = "Could not load assets";
    assetLibraryList.appendChild(text);
    updateExistingImageDetails();
    return;
  }

  const assets = editorAssetLibraryItems();
  if (!assets.length) {
    const text = document.createElement("span");
    text.className = "asset-library-empty";
    text.textContent = "Generated previews will appear here";
    assetLibraryList.appendChild(text);
    updateExistingImageDetails();
    return;
  }

  for (const asset of assets) {
    const button = document.createElement("button");
    button.className = "asset-library-item";
    button.type = "button";
    button.classList.toggle("active", asset.url === state.assetLibrary.selectedUrl);
    button.dataset.assetUrl = asset.url;
    button.setAttribute("aria-label", `Reuse ${asset.name || "asset"}`);

    const img = new Image();
    img.alt = "";
    img.src = asset.url;
    button.appendChild(img);

    const label = document.createElement("span");
    label.textContent = asset.name || (asset.assetType === "decoration" ? "Decoration" : "Board");
    button.appendChild(label);
    assetLibraryList.appendChild(button);
  }
  updateExistingImageDetails();
}

function selectedEditorAsset() {
  return state.assetLibrary.assets.find((asset) => asset.url === state.assetLibrary.selectedUrl) || null;
}

function updateExistingImageDetails() {
  if (!existingImageDetails) return;
  existingImageDetails.innerHTML = "";

  const label = document.createElement("span");
  label.className = "range-label";
  label.textContent = "Selected Image";
  existingImageDetails.appendChild(label);

  const asset = selectedEditorAsset();
  if (!asset) {
    const empty = document.createElement("div");
    empty.className = "asset-detail-empty";
    empty.textContent = state.assetLibrary.loading ? "Loading images..." : "Choose an image from the library";
    existingImageDetails.appendChild(empty);
    return;
  }

  const preview = document.createElement("div");
  preview.className = "asset-detail-preview";
  const img = new Image();
  img.alt = asset.name || "Selected image";
  img.src = asset.url;
  preview.appendChild(img);
  existingImageDetails.appendChild(preview);

  const title = document.createElement("div");
  title.className = "asset-detail-name";
  title.textContent = asset.name || (asset.assetType === "decoration" ? "Decoration" : "Board");
  existingImageDetails.appendChild(title);

  const details = document.createElement("div");
  details.className = "asset-detail-meta";
  const type = asset.assetType === "decoration" ? "Decoration" : "Board";
  const dimensions = asset.width && asset.height ? `${asset.width} x ${asset.height}` : "Saved image";
  const created = Date.parse(asset.createdAt || "")
    ? new Date(asset.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : "";
  for (const text of [`Type: ${type}`, `Size: ${dimensions}`, created ? `Saved: ${created}` : "Ready to reuse"]) {
    const row = document.createElement("span");
    row.textContent = text;
    details.appendChild(row);
  }
  existingImageDetails.appendChild(details);
}

function setEditorImageMode(mode) {
  state.editor.imageMode = mode === "existing" ? "existing" : "new";
  const existing = state.editor.imageMode === "existing";

  for (const tab of editorImageTabs) {
    const active = tab.dataset.editorImageMode === state.editor.imageMode;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", active ? "true" : "false");
  }

  newImageStage.classList.toggle("active", !existing);
  newImagePanel.classList.toggle("active", !existing);
  existingImagePanel.classList.toggle("active", existing);
  existingImageDetails.classList.toggle("active", existing);
  doodleCanvas.style.pointerEvents = existing ? "none" : "";

  if (existing) {
    const selected = selectedEditorAsset();
    state.editor.previewImage = selected?.url || null;
    state.editor.previewAssetId = selected?.id || null;
    editorSummary.textContent = selected
      ? `Reusing ${selected.name || buildTypeNoun()}`
      : `${state.editor.snapshot?.tiles.length || 0} plot ${buildTypeNoun()}`;
    void loadAssetLibrary();
  } else {
    state.editor.previewImage = state.editor.generatedPreviewImage;
    state.editor.previewAssetId = state.editor.generatedPreviewAssetId;
    editorSummary.textContent = `${state.editor.snapshot?.tiles.length || 0} plot ${buildTypeNoun()}`;
  }

  updateEditorMaterialUi();
  renderAssetLibrary();
  updateExistingImageDetails();
}

function reuseAsset(assetUrl) {
  const asset = state.assetLibrary.assets.find((item) => item.url === assetUrl);
  if (!asset?.url) return;
  state.editor.imageMode = "existing";
  state.assetLibrary.selectedUrl = asset.url;
  state.editor.previewAssetId = asset.id || null;
  setPreviewImage(asset.url, asset.name || `${buildTypeLabel()} preview`, "existing");
  editorSummary.textContent = `Reusing ${asset.name || buildTypeNoun()}`;
  updateEditorMaterialUi();
  renderAssetLibrary();
  updateExistingImageDetails();
}

function currentHarvestForTile(x, y) {
  const target = state.harvest.target;
  if (!state.harvest.active || !target) return null;
  return target.x === x && target.y === y ? state.harvest : null;
}

function harvestTargetDistance(target) {
  const feet = playerFootCenter();
  return Math.hypot(feet.x - (target.x + 0.5), feet.y - (target.y + 0.5));
}

function targetStillHarvestable(target) {
  if (target.feature === "fish") return isFishableWaterTile(target.x, target.y);
  return terrainAt(target.x, target.y).feature === target.feature;
}

function harvestTargetInReach(target) {
  return harvestTargetDistance(target) <= HARVEST_REACH_TILES;
}

function harvestTargetFromPointer(event) {
  const point = screenPointFromPointer(event);
  return harvestTargetAtScreenPoint(point.x, point.y);
}

function harvestTargetAtScreenPoint(screenX, screenY) {
  const px = Math.floor(state.player.x);
  const py = Math.floor(state.player.y);
  let best = null;

  for (let y = py - VIEW_RADIUS; y <= py + VIEW_RADIUS; y++) {
    for (let x = px - VIEW_RADIUS; x <= px + VIEW_RADIUS; x++) {
      const tile = terrainAt(x, y);
      if (tile.feature !== "tree" && tile.feature !== "rock") continue;

      const pos = tileCenterScreen(x, y);
      const dx = Math.abs(screenX - pos.x);
      const dy = screenY - pos.y;
      let score = Infinity;

      if (tile.feature === "tree") {
        const tall = 43 + hash2(x, y, 60) * 18;
        if (dx <= 38 && dy >= -tall - 24 && dy <= 20) {
          score = dx + Math.abs(dy + tall * 0.45) * 0.45;
        }
      } else if (dx <= 28 && dy >= -24 && dy <= 20) {
        score = dx + Math.abs(dy + 3) * 0.8;
      }

      if (score < (best?.score ?? Infinity)) {
        best = {
          x,
          y,
          feature: tile.feature,
          duration: tile.feature === "tree" ? TREE_HARVEST_MS : ROCK_HARVEST_MS,
          score
        };
      }
    }
  }

  if (best) return best;

  const waterWorld = worldFromScreen(screenX, screenY);
  const waterX = Math.floor(waterWorld.x);
  const waterY = Math.floor(waterWorld.y);
  if (isFishableWaterTile(waterX, waterY)) {
    return {
      x: waterX,
      y: waterY,
      feature: "fish",
      duration: FISH_HARVEST_MS,
      score: 0
    };
  }

  return null;
}

function waterTileFromPointer(event) {
  const tile = tileFromPointer(event);
  return terrainAt(tile.x, tile.y).type === "water" ? tile : null;
}

function startHarvest(target, eventOrPointerId) {
  const pointerId = typeof eventOrPointerId === "number" ? eventOrPointerId : eventOrPointerId?.pointerId;
  clearSelection();
  keys.clear();
  state.resourceAction.active = false;
  state.resourceAction.target = null;
  state.resourceAction.pointerId = null;
  state.harvest = {
    active: true,
    target,
    start: performance.now(),
    duration: target.duration,
    pointerId
  };
  if (pointerId !== null && pointerId !== undefined) canvas.setPointerCapture(pointerId);
  state.bubbleText = target.feature === "tree" ? "Chopping..." : target.feature === "rock" ? "Mining..." : "Fishing...";
  state.bubbleUntil = performance.now() + target.duration + 300;
}

function cancelHarvest(pointerId = state.harvest.pointerId) {
  if (!state.harvest.active) return;
  if (pointerId !== null && pointerId !== undefined && canvas.hasPointerCapture(pointerId)) canvas.releasePointerCapture(pointerId);
  state.harvest.active = false;
  state.harvest.target = null;
  state.harvest.pointerId = null;
}

function startRoomAction(type, target, event) {
  clearSelection();
  keys.clear();
  cancelResourceAction();
  cancelHarvest();
  stopMaterialPainting();
  state.roomAction = {
    active: true,
    type,
    target,
    start: performance.now(),
    duration: ROOM_INTERACT_MS,
    pointerId: event.pointerId,
    completed: false
  };
  canvas.setPointerCapture(event.pointerId);
  state.bubbleText = type === "enter" ? "Entering..." : "Leaving...";
  state.bubbleUntil = performance.now() + ROOM_INTERACT_MS + 300;
}

function cancelRoomAction(pointerId = state.roomAction.pointerId, selectBuildingOnCancel = false) {
  if (!state.roomAction.active) return;
  const actionType = state.roomAction.type;
  const actionTarget = state.roomAction.target;
  if (pointerId !== null && pointerId !== undefined && canvas.hasPointerCapture(pointerId)) canvas.releasePointerCapture(pointerId);
  state.roomAction.active = false;
  state.roomAction.type = null;
  state.roomAction.target = null;
  state.roomAction.pointerId = null;
  state.roomAction.completed = false;
  if (selectBuildingOnCancel && actionType === "enter" && actionTarget) selectBuilding(actionTarget);
}

function completeRoomAction() {
  if (!state.roomAction.active || !state.roomAction.target) return;
  const actionType = state.roomAction.type;
  const actionTarget = state.roomAction.target;
  const pointerId = state.roomAction.pointerId;
  state.roomAction.completed = true;
  if (pointerId !== null && pointerId !== undefined && canvas.hasPointerCapture(pointerId)) {
    canvas.releasePointerCapture(pointerId);
  }

  state.roomAction.active = false;
  state.roomAction.type = null;
  state.roomAction.target = null;
  state.roomAction.pointerId = null;
  state.roomAction.completed = false;

  if (actionType === "enter") enterBuilding(actionTarget);
  if (actionType === "leave") leaveRoom();
}

function startResourceAction(target, event) {
  clearSelection();
  keys.clear();
  if (harvestTargetInReach(target)) {
    startHarvest(target, event);
    return;
  }

  state.resourceAction = {
    active: true,
    target,
    pointerId: event.pointerId
  };
  canvas.setPointerCapture(event.pointerId);
  state.bubbleText = "Moving closer...";
  state.bubbleUntil = performance.now() + 1400;
}

function cancelResourceAction(pointerId = state.resourceAction.pointerId) {
  if (!state.resourceAction.active) return;
  if (pointerId !== null && pointerId !== undefined && canvas.hasPointerCapture(pointerId)) canvas.releasePointerCapture(pointerId);
  state.resourceAction.active = false;
  state.resourceAction.target = null;
  state.resourceAction.pointerId = null;
}

function updateResourceActionMovement(speedWorld) {
  if (!state.resourceAction.active || !state.resourceAction.target) return false;
  const target = state.resourceAction.target;
  if (!targetStillHarvestable(target)) {
    cancelResourceAction();
    return false;
  }

  if (harvestTargetInReach(target)) {
    const pointerId = state.resourceAction.pointerId;
    state.resourceAction.active = false;
    state.resourceAction.target = null;
    state.resourceAction.pointerId = null;
    startHarvest(target, pointerId);
    return false;
  }

  const feet = playerFootCenter();
  const waypoint = resourceActionWaypoint(target, feet);
  const dx = waypoint.x - feet.x;
  const dy = waypoint.y - feet.y;
  const distance = Math.hypot(dx, dy) || 1;
  state.player.vx = (dx / distance) * speedWorld;
  state.player.vy = (dy / distance) * speedWorld;

  const playerScreen = screenFromWorld(feet.x, feet.y, state.player.z);
  const targetScreen = screenFromWorld(waypoint.x, waypoint.y, 0);
  state.player.facing = targetScreen.x >= playerScreen.x ? 1 : -1;
  return true;
}

function resourceActionWaypoint(target, feet) {
  const targetCenter = { x: target.x + 0.5, y: target.y + 0.5 };
  const playerHome = isHomeTile(Math.floor(feet.x), Math.floor(feet.y));
  const targetHome = isHomeTile(target.x, target.y);
  if (playerHome === targetHome) return targetCenter;

  const gates = generateFenceEdges().filter((edge) => edge.gate);
  if (!gates.length) return targetCenter;

  const bestGate = gates
    .map((edge) => {
      const point = { x: (edge.ax + edge.bx) / 2, y: (edge.ay + edge.by) / 2 };
      return {
        point,
        score: Math.hypot(point.x - feet.x, point.y - feet.y) + Math.hypot(point.x - targetCenter.x, point.y - targetCenter.y)
      };
    })
    .sort((a, b) => a.score - b.score)[0].point;

  return Math.hypot(bestGate.x - feet.x, bestGate.y - feet.y) > 0.7 ? bestGate : targetCenter;
}

function completeHarvest() {
  const target = state.harvest.target;
  if (!target) return;

  if (target.feature === "fish") {
    if (isFishableWaterTile(target.x, target.y)) {
      changePlayerXp(1);
      addItems({ fish: FISH_YIELD });
      state.bubbleText = `+${FISH_YIELD} fish, +1 XP`;
      state.bubbleUntil = performance.now() + 1800;
    }
    cancelHarvest();
    return;
  }

  const tile = terrainAt(target.x, target.y);
  if (tile.feature === target.feature) {
    harvestedFeatures.add(tileKey(target.x, target.y));
    harvestedFeatureOwners.set(tileKey(target.x, target.y), state.account.id);
    plantedSaplings.delete(tileKey(target.x, target.y));
    plantedSaplingOwners.delete(tileKey(target.x, target.y));
    invalidateTerrainCache();
    changePlayerXp(1);
    if (target.feature === "tree") {
      addResources({ wood: TREE_WOOD_YIELD });
      addItems({ acorns: TREE_ACORN_YIELD });
      state.bubbleText = `+${TREE_WOOD_YIELD} wood, +${TREE_ACORN_YIELD} acorns, +1 XP`;
    } else {
      addResources({ stone: ROCK_STONE_YIELD });
      state.bubbleText = `+${ROCK_STONE_YIELD} stone, +1 XP`;
    }
    state.bubbleUntil = performance.now() + 1800;
    scheduleWorldSave();
  }

  cancelHarvest();
}

function updateHarvest(now) {
  if (!state.harvest.active) return;
  if (now - state.harvest.start >= state.harvest.duration) completeHarvest();
}

function updateRoomAction(now) {
  if (!state.roomAction.active) return;
  if (now - state.roomAction.start >= state.roomAction.duration) completeRoomAction();
}

function updateSaplings(now) {
  const wallNow = Date.now();
  for (const [key, sapling] of plantedSaplings) {
    if (sapling.grown || wallNow < sapling.nextCheck) continue;

    if (wallNow - sapling.plantedAt >= ACORN_GROW_MIN_MS && Math.random() < ACORN_GROW_CHANCE) {
      sapling.grown = true;
      harvestedFeatures.delete(key);
      harvestedFeatureOwners.delete(key);
      invalidateTerrainCache();
      const feet = playerFootCenter();
      if (Math.hypot(feet.x - (sapling.x + 0.5), feet.y - (sapling.y + 0.5)) < 6) {
        state.bubbleText = "A tree grew.";
        state.bubbleUntil = now + 1800;
      }
      scheduleWorldSave();
    } else {
      sapling.nextCheck = wallNow + ACORN_GROW_CHECK_MS;
      scheduleWorldSave();
    }
  }
}

function drawIsoDiamond(x, y, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x, y - TILE_H / 2);
  ctx.lineTo(x + TILE_W / 2, y);
  ctx.lineTo(x, y + TILE_H / 2);
  ctx.lineTo(x - TILE_W / 2, y);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

const TILE_COLOR_VARIATION = 0.055;
const TILE_COLOR_NOISE_SCALE = 7;
const TILE_BASE_COLORS = {
  water: "#397fad",
  sand: "#c7b06d",
  grass: "#4f8b52",
  forest: "#3f7d4b",
  stone: "#777d76",
  home: "#64985d",
  woodFloor: "#9b6135",
  stoneFloor: "#8d9591"
};

function adjustBrightness(rgb, amount) {
  const target = amount < 0 ? { r: 0, g: 0, b: 0 } : { r: 255, g: 255, b: 255 };
  return mixRgb(rgb, target, Math.abs(amount));
}

function tileColors(type, x, y) {
  const base = hexToRgb(TILE_BASE_COLORS[type] || TILE_BASE_COLORS.grass);
  const localShade = valueNoise(x + 31, y - 47, TILE_COLOR_NOISE_SCALE, 5);
  const broadShade = valueNoise(x - 89, y + 113, TILE_COLOR_NOISE_SCALE * 2.7, 151);
  const shade = localShade * 0.72 + broadShade * 0.28;
  const amount = clamp((shade - 0.5) * 2 * TILE_COLOR_VARIATION, -TILE_COLOR_VARIATION, TILE_COLOR_VARIATION);
  return rgbToHex(adjustBrightness(base, amount));
}

function tileGridStroke(tile) {
  if (state.previewCapture || !state.selection.hover) return null;

  const dx = tile.x - state.selection.hover.x;
  const dy = tile.y - state.selection.hover.y;
  const distance = Math.hypot(dx, dy);
  if (distance > CURSOR_GRID_RADIUS) return null;

  const alpha = 0.04 + (1 - distance / CURSOR_GRID_RADIUS) * 0.2;
  return `rgba(14, 34, 23, ${alpha.toFixed(3)})`;
}

function drawTile(tile) {
  const pos = tileCenterScreen(tile.x, tile.y);
  const shade = hash2(tile.x, tile.y, 5);
  drawIsoDiamond(pos.x, pos.y, tileColors(tile.type, tile.x, tile.y), tileGridStroke(tile));

  if (tile.floorMaterial === "wood") {
    ctx.strokeStyle = "rgba(63, 34, 19, 0.32)";
    ctx.lineWidth = 1;
    for (let offset = -18; offset <= 18; offset += 12) {
      ctx.beginPath();
      ctx.moveTo(pos.x - 30, pos.y + offset * 0.5);
      ctx.lineTo(pos.x, pos.y + offset * 0.5 - 15);
      ctx.lineTo(pos.x + 30, pos.y + offset * 0.5);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(255, 229, 164, 0.15)";
    ctx.beginPath();
    ctx.moveTo(pos.x - 22, pos.y + 2);
    ctx.lineTo(pos.x + 16, pos.y - 8);
    ctx.stroke();
  }

  if (tile.floorMaterial === "stone") {
    ctx.strokeStyle = "rgba(43, 52, 48, 0.24)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pos.x - 20, pos.y - 3);
    ctx.lineTo(pos.x - 2, pos.y - 12);
    ctx.lineTo(pos.x + 18, pos.y - 2);
    ctx.moveTo(pos.x - 9, pos.y + 9);
    ctx.lineTo(pos.x + 7, pos.y + 1);
    ctx.lineTo(pos.x + 23, pos.y + 7);
    ctx.stroke();
  }

  if (tile.type === "water") {
    ctx.strokeStyle = `rgba(221, 246, 255, ${0.18 + shade * 0.18})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pos.x - 21, pos.y - 1);
    ctx.quadraticCurveTo(pos.x - 8, pos.y - 8, pos.x + 8, pos.y - 1);
    ctx.quadraticCurveTo(pos.x + 18, pos.y + 4, pos.x + 25, pos.y - 2);
    ctx.stroke();
  }

  if (tile.type === "sand" && shade > 0.72) {
    ctx.fillStyle = "rgba(92, 75, 47, 0.18)";
    ctx.beginPath();
    ctx.ellipse(pos.x + 3, pos.y + 3, 8, 2.5, -0.22, 0, Math.PI * 2);
    ctx.fill();
  }

  if (tile.type === "stone" && shade > 0.46) {
    ctx.fillStyle = "rgba(239, 236, 218, 0.13)";
    ctx.beginPath();
    ctx.moveTo(pos.x - 13, pos.y - 1);
    ctx.lineTo(pos.x + 6, pos.y - 9);
    ctx.lineTo(pos.x + 14, pos.y - 1);
    ctx.lineTo(pos.x - 3, pos.y + 7);
    ctx.closePath();
    ctx.fill();
  }
}

function drawMaterialToolCursor() {
  const material = state.materialTool.equipped;
  const pointer = state.materialTool.pointer;
  if (!material || !pointer) return;

  const x = pointer.x + 24;
  const y = pointer.y + 18;
  const width = 28;
  const height = 15;
  const colors = material === "wood" ? ["#aa6c3b", "#6f4024"] : ["#a1aaa5", "#68716c"];

  ctx.save();
  ctx.globalAlpha = 0.95;
  ctx.beginPath();
  ctx.moveTo(x, y - height / 2);
  ctx.lineTo(x + width / 2, y);
  ctx.lineTo(x, y + height / 2);
  ctx.lineTo(x - width / 2, y);
  ctx.closePath();
  ctx.fillStyle = colors[0];
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 246, 219, 0.78)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.strokeStyle = material === "wood" ? "rgba(66, 35, 18, 0.38)" : "rgba(44, 53, 49, 0.36)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  if (material === "wood") {
    ctx.moveTo(x - 8, y + 2);
    ctx.lineTo(x + 8, y - 5);
    ctx.moveTo(x - 5, y + 6);
    ctx.lineTo(x + 11, y - 1);
  } else {
    ctx.moveTo(x - 9, y + 1);
    ctx.lineTo(x - 1, y - 5);
    ctx.lineTo(x + 9, y);
    ctx.moveTo(x - 2, y + 5);
    ctx.lineTo(x + 6, y + 1);
  }
  ctx.stroke();
  ctx.restore();
}

function selectedTiles() {
  return [...state.selection.selected.values()];
}

function selectedFenceEdge() {
  if (!state.selection.fenceEdgeId) return null;
  return generateFenceEdges().find((edge) => edge.id === state.selection.fenceEdgeId) || null;
}

function currentGateCount() {
  return generateFenceEdges().filter((edge) => edge.gate && isOwnFenceEdge(edge)).length;
}

function buildingBuildType(building) {
  return building?.artMeta?.buildType === "decoration" ? "decoration" : "board";
}

function isBoardBuilding(building) {
  return buildingBuildType(building) === "board";
}

function buildTypeLabel(type = state.editor.buildType) {
  return type === "decoration" ? "Decoration" : "Board";
}

function buildTypeNoun(type = state.editor.buildType) {
  return type === "decoration" ? "decoration" : "board";
}

function nextBoardTitle() {
  const count = buildings.filter((item) => isBoardBuilding(item) && isOwnBuilding(item)).length;
  return `Building Board ${count + 1}`;
}

function sanitizeEditorVisibility(value) {
  return value === "company" || value === "private" ? value : "public";
}

function editorBoardMeta() {
  const fallbackName = state.editor.buildType === "decoration" ? "Decoration" : nextBoardTitle();
  const name = String(newBoardNameInput.value || "").trim();
  const description = String(newBoardDescriptionInput.value || "").trim();
  const visibility = sanitizeEditorVisibility(newBoardVisibilityInput.value);

  return {
    name: (name || fallbackName).slice(0, 80),
    description: description.slice(0, 240),
    visibility
  };
}

function syncEditorBoardMetaState() {
  const meta = editorBoardMeta();
  state.editor.boardName = meta.name;
  state.editor.boardDescription = meta.description;
  state.editor.boardVisibility = meta.visibility;
  return meta;
}

function buildingSellValue(building) {
  return buildingBuildType(building) === "decoration" ? DECORATION_SELL_VALUE : BUILDING_SELL_VALUE;
}

function buildingOccupiesTile(x, y) {
  return buildings.some((building) => building.tileKeys.has(tileKey(x, y)));
}

function selectedBuilding() {
  return state.selection.building;
}

function selectedHomePlotsAreBuildable() {
  const tiles = selectedTiles();
  return tiles.length > 0 && state.selection.plotType === "home" && tiles.every((tile) => isOwnHomeTile(tile.x, tile.y) && !buildingOccupiesTile(tile.x, tile.y));
}

function roomTileHasExistingNeighbor(x, y) {
  if (!state.room.active) return false;
  return state.room.tileKeys.has(tileKey(x + 1, y))
    || state.room.tileKeys.has(tileKey(x - 1, y))
    || state.room.tileKeys.has(tileKey(x, y + 1))
    || state.room.tileKeys.has(tileKey(x, y - 1));
}

function roomTileHasSelectedNeighbor(x, y) {
  return isSelectedTile(x + 1, y)
    || isSelectedTile(x - 1, y)
    || isSelectedTile(x, y + 1)
    || isSelectedTile(x, y - 1);
}

function canSelectNewRoomTile(tile) {
  return state.room.active && !state.room.tileKeys.has(tileKey(tile.x, tile.y));
}

function canStartRoomSelection(tile) {
  return canSelectNewRoomTile(tile) && roomTileHasExistingNeighbor(tile.x, tile.y);
}

function selectedRoomCanBeAdded() {
  if (!state.room.active || state.selection.plotType !== "room") return false;
  if (!isOwnBuilding(state.room.building)) return false;
  const tiles = uniqueIntegerTiles(selectedTiles());
  if (!tiles.length || !tilesAreConnected(tiles)) return false;
  if (tiles.some((tile) => !canSelectNewRoomTile(tile))) return false;
  const room = { id: "pending", tiles };
  return !!chooseInteriorDoorForRoom(room, state.room.roomIdByTile);
}

function isSelectedTile(x, y) {
  return state.selection.selected.has(tileKey(x, y));
}

function rememberPaintSelection() {
  state.selection.paintSelected.clear();
  for (const [key, tile] of state.selection.selected) {
    state.selection.paintSelected.set(key, { x: tile.x, y: tile.y });
  }
}

function restorePaintSelection() {
  state.selection.building = null;
  state.selection.fenceEdgeId = null;
  state.selection.selected.clear();
  for (const [key, tile] of state.selection.paintSelected) {
    state.selection.selected.set(key, { x: tile.x, y: tile.y });
  }
  updateSelectionPanel();
}

function addSelectionTile(tile) {
  const key = tileKey(tile.x, tile.y);
  const selectedTile = { x: tile.x, y: tile.y };

  if (state.selection.plotType === "room") {
    if (!canSelectNewRoomTile(tile)) return false;
    if (!roomTileHasExistingNeighbor(tile.x, tile.y) && !roomTileHasSelectedNeighbor(tile.x, tile.y)) return false;
    state.selection.selected.set(key, selectedTile);
    if (state.selection.active && state.selection.mode === "paint") {
      state.selection.paintSelected.set(key, selectedTile);
    }
    return true;
  }

  if (!state.selection.plotType || plotTypeAt(tile.x, tile.y) !== state.selection.plotType) return false;
  if (state.selection.plotType === "wild" && !isWildTileAttachable(tile)) return false;

  state.selection.selected.set(key, selectedTile);
  if (state.selection.active && state.selection.mode === "paint") {
    state.selection.paintSelected.set(key, selectedTile);
  }
  return true;
}

function isWildTileAttachable(tile) {
  if (isWildAdjacentToHome(tile.x, tile.y)) return true;
  const neighbors = [
    [tile.x + 1, tile.y],
    [tile.x - 1, tile.y],
    [tile.x, tile.y + 1],
    [tile.x, tile.y - 1]
  ];
  return neighbors.some(([x, y]) => isSelectedTile(x, y));
}

function matchingTilesInRect(anchor, current, plotType) {
  const minX = Math.min(anchor.x, current.x);
  const maxX = Math.max(anchor.x, current.x);
  const minY = Math.min(anchor.y, current.y);
  const maxY = Math.max(anchor.y, current.y);
  const tiles = [];

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      if (plotType === "room") {
        if (canSelectNewRoomTile({ x, y })) tiles.push({ x, y });
      } else if (plotTypeAt(x, y) === plotType) {
        tiles.push({ x, y });
      }
    }
  }

  if (plotType === "room") return connectedRoomTiles(tiles);
  return plotType === "wild" ? connectedWildTiles(tiles) : tiles;
}

function connectedRoomTiles(tiles) {
  const candidates = new Map(tiles.map((tile) => [tileKey(tile.x, tile.y), tile]));
  const queue = tiles.filter((tile) => roomTileHasExistingNeighbor(tile.x, tile.y));
  const connected = new Map();

  while (queue.length) {
    const tile = queue.shift();
    const key = tileKey(tile.x, tile.y);
    if (connected.has(key) || !candidates.has(key)) continue;
    connected.set(key, tile);

    const neighbors = [
      [tile.x + 1, tile.y],
      [tile.x - 1, tile.y],
      [tile.x, tile.y + 1],
      [tile.x, tile.y - 1]
    ];
    for (const [x, y] of neighbors) {
      const neighbor = candidates.get(tileKey(x, y));
      if (neighbor && !connected.has(tileKey(x, y))) queue.push(neighbor);
    }
  }

  return [...connected.values()];
}

function connectedWildTiles(tiles) {
  const candidates = new Map(tiles.map((tile) => [tileKey(tile.x, tile.y), tile]));
  const queue = tiles.filter((tile) => isWildAdjacentToHome(tile.x, tile.y));
  const connected = new Map();

  while (queue.length) {
    const tile = queue.shift();
    const key = tileKey(tile.x, tile.y);
    if (connected.has(key) || !candidates.has(key)) continue;
    connected.set(key, tile);

    const neighbors = [
      [tile.x + 1, tile.y],
      [tile.x - 1, tile.y],
      [tile.x, tile.y + 1],
      [tile.x, tile.y - 1]
    ];
    for (const [x, y] of neighbors) {
      const neighbor = candidates.get(tileKey(x, y));
      if (neighbor && !connected.has(tileKey(x, y))) queue.push(neighbor);
    }
  }

  return [...connected.values()];
}

function updateRectangleSelection(current) {
  state.selection.building = null;
  state.selection.fenceEdgeId = null;
  state.selection.selected.clear();
  for (const tile of matchingTilesInRect(state.selection.anchor, current, state.selection.plotType)) {
    state.selection.selected.set(tileKey(tile.x, tile.y), tile);
  }
  updateSelectionPanel();
}

function updateSelectionModeFromShift(shiftDown) {
  if (!state.selection.active) return;
  const nextMode = shiftDown ? "rect" : "paint";
  if (state.selection.mode === nextMode) return;

  if (state.selection.mode === "paint") rememberPaintSelection();
  state.selection.mode = nextMode;

  if (nextMode === "rect") {
    updateRectangleSelection(state.selection.hover || state.selection.anchor);
  } else {
    restorePaintSelection();
  }
}

function clearSelection() {
  state.selection.active = false;
  state.selection.plotType = null;
  state.selection.building = null;
  state.selection.fenceEdgeId = null;
  state.selection.anchor = null;
  state.selection.selected.clear();
  state.selection.paintSelected.clear();
  closeBoardEditor();
  updateSelectionPanel();
}

function selectBuilding(building) {
  state.selection.active = false;
  state.selection.plotType = "building";
  state.selection.building = building;
  state.selection.fenceEdgeId = null;
  state.selection.anchor = null;
  state.selection.selected.clear();
  state.selection.paintSelected.clear();
  updateSelectionPanel();
}

function selectFenceEdge(edge) {
  state.selection.active = false;
  state.selection.plotType = "fence";
  state.selection.building = null;
  state.selection.fenceEdgeId = edge.id;
  state.selection.anchor = null;
  state.selection.selected.clear();
  state.selection.paintSelected.clear();
  setHomeChatOpen(false);
  updateSelectionPanel();
}

function updateSelectionPanel() {
  const building = selectedBuilding();
  const fenceEdge = selectedFenceEdge();
  const count = state.selection.selected.size;
  selectionPanel.classList.toggle("active", count > 0 || !!building || !!fenceEdge);

  if (building) {
    const buildType = buildingBuildType(building);
    const label = buildType === "decoration" ? "decoration" : "board";
    const ownBuilding = isOwnBuilding(building);
    selectionSummary.textContent = ownBuilding ? `1 ${label}` : `${building.ownerName || "Another member"}'s ${label}`;
    buyButton.disabled = true;
    buildButton.disabled = true;
    decorationButton.disabled = true;
    editBoardButton.textContent = "Edit";
    editBoardButton.disabled = buildType !== "board" || !ownBuilding;
    sellButton.textContent = `Sell +${buildingSellValue(building)} gold`;
    sellButton.disabled = !ownBuilding;
    return;
  }

  if (fenceEdge) {
    const ownFence = isOwnFenceEdge(fenceEdge);
    const gateCount = currentGateCount();
    selectionSummary.textContent = ownFence ? (fenceEdge.gate ? (gateCount <= 1 ? "Last gate" : "Gate") : "Fence") : "Another home fence";
    buyButton.textContent = "Buy Land";
    buyButton.disabled = true;
    buildButton.textContent = fenceEdge.gate ? "Make Fence" : `Make Gate - ${GATE_WOOD_COST} wood`;
    buildButton.disabled = !ownFence || (fenceEdge.gate ? gateCount <= 1 : (state.resources.wood || 0) < GATE_WOOD_COST);
    decorationButton.textContent = "New Decoration";
    decorationButton.disabled = true;
    editBoardButton.textContent = "Edit";
    editBoardButton.disabled = true;
    sellButton.textContent = "Sell";
    sellButton.disabled = true;
    return;
  }

  if (!count) {
    selectionSummary.textContent = "No plots selected";
    buyButton.textContent = "Buy Land";
    buyButton.disabled = true;
    buildButton.textContent = "Build";
    buildButton.disabled = true;
    decorationButton.textContent = "New Decoration";
    decorationButton.disabled = true;
    editBoardButton.textContent = "Edit";
    editBoardButton.disabled = true;
    sellButton.textContent = "Sell";
    sellButton.disabled = true;
    return;
  }

  if (state.selection.plotType === "room") {
    selectionSummary.textContent = `${count} room tile${count === 1 ? "" : "s"}`;
    buyButton.textContent = "Buy Land";
    buyButton.disabled = true;
    buildButton.textContent = `Add Room - ${ROOM_GOLD_COST} gold`;
    buildButton.disabled = !selectedRoomCanBeAdded() || state.gold < ROOM_GOLD_COST;
    decorationButton.disabled = true;
    editBoardButton.disabled = true;
    sellButton.textContent = "Sell";
    sellButton.disabled = true;
    return;
  }

  const label = state.selection.plotType === "home" ? "home" : "wild";
  selectionSummary.textContent = `${count} ${label} plot${count === 1 ? "" : "s"}`;
  const cost = count * BUY_COST_PER_PLOT;
  buyButton.textContent = state.selection.plotType === "wild" ? `Buy - ${cost} gold` : "Buy Land";
  buyButton.disabled = state.selection.plotType !== "wild";
  buildButton.textContent = `New Board - ${buildingGoldCost(count)} gold`;
  buildButton.disabled = !selectedHomePlotsAreBuildable();
  decorationButton.textContent = `New Decoration - ${DECORATION_GOLD_COST} gold`;
  decorationButton.disabled = !selectedHomePlotsAreBuildable();
  editBoardButton.disabled = true;
  sellButton.disabled = true;
}

function buySelectedPlots() {
  if (state.selection.plotType !== "wild" || !state.selection.selected.size) return;

  const plots = selectedTiles().filter((tile) => !isHomeTile(tile.x, tile.y));
  const cost = plots.length * BUY_COST_PER_PLOT;
  if (!plots.length) return;

  if (state.gold < cost) {
    state.bubbleText = `Need ${cost} gold.`;
    state.bubbleUntil = performance.now() + 2200;
    return;
  }

  const previousEdges = generateFenceEdges();
  state.gold -= cost;
  for (const tile of plots) {
    const key = tileKey(tile.x, tile.y);
    ownedPlots.add(key);
    myOwnedPlots.add(key);
    plotOwners.set(key, state.account.id);
    purchasedPlots.add(key);
  }
  invalidateTerrainCache();
  invalidateFenceEdgesCache();
  const nextEdgeIds = new Set(generateFenceEdges().map((edge) => edge.id));
  state.fadingFenceEdges = previousEdges.filter((edge) => !nextEdgeIds.has(edge.id)).map((edge) => ({ ...edge, fading: true }));

  state.selection.plotType = "home";
  state.selection.selected.clear();
  for (const tile of plots) state.selection.selected.set(tileKey(tile.x, tile.y), tile);
  state.fenceAnimationUntil = performance.now() + 900;
  state.bubbleText = `Bought ${plots.length} plot${plots.length === 1 ? "" : "s"}.`;
  state.bubbleUntil = performance.now() + 2200;
  updateHud();
  updateSelectionPanel();
  scheduleWorldSave();
}

function convertSelectedFenceEdge() {
  const edge = selectedFenceEdge();
  if (!edge) {
    clearSelection();
    return;
  }

  if (!isOwnFenceEdge(edge)) {
    state.bubbleText = "That gate belongs to another home.";
    state.bubbleUntil = performance.now() + 1800;
    updateSelectionPanel();
    return;
  }

  if (edge.gate) {
    if (currentGateCount() <= 1) {
      state.bubbleText = "You need at least one gate.";
      state.bubbleUntil = performance.now() + 1800;
      updateSelectionPanel();
      return;
    }

    state.gateEdgeIds.delete(edge.id);
    gateEdgeOwners.delete(edge.id);
    state.bubbleText = "Changed gate into fence.";
    state.bubbleUntil = performance.now() + 1800;
  } else {
    if ((state.resources.wood || 0) < GATE_WOOD_COST) {
      state.bubbleText = `Need ${GATE_WOOD_COST} wood.`;
      state.bubbleUntil = performance.now() + 1800;
      updateSelectionPanel();
      return;
    }

    state.resources.wood = Math.max(0, (state.resources.wood || 0) - GATE_WOOD_COST);
    state.gateEdgeIds.add(edge.id);
    gateEdgeOwners.set(edge.id, state.account.id);
    state.bubbleText = `Built gate for ${GATE_WOOD_COST} wood.`;
    state.bubbleUntil = performance.now() + 1800;
  }

  invalidateFenceEdgesCache();
  refreshInventoryUi();
  updateSelectionPanel();
  scheduleWorldSave();
}

async function addSelectedRoom() {
  if (!selectedRoomCanBeAdded()) {
    state.bubbleText = "Drag a new room from an interior wall.";
    state.bubbleUntil = performance.now() + 2200;
    return;
  }

  if (state.gold < ROOM_GOLD_COST) {
    state.bubbleText = `Need ${ROOM_GOLD_COST} gold.`;
    state.bubbleUntil = performance.now() + 2200;
    updateSelectionPanel();
    return;
  }

  const building = state.room.building;
  if (!building) return;

  const roomNumber = (building.artMeta?.extraRooms?.length || 0) + 2;
  const room = {
    id: createClientId(),
    name: `Room ${roomNumber}`,
    tiles: uniqueIntegerTiles(selectedTiles()).map((tile) => ({ x: tile.x, y: tile.y }))
  };

  building.artMeta = building.artMeta && typeof building.artMeta === "object" ? building.artMeta : {};
  building.artMeta.extraRooms = [
    ...(Array.isArray(building.artMeta.extraRooms) ? building.artMeta.extraRooms : []),
    room
  ];

  state.gold -= ROOM_GOLD_COST;
  const previousWorldPosition = state.room.previousWorldPosition;
  state.room = createRoomForBuilding(building, previousWorldPosition);
  clearSelection();
  state.bubbleText = `Added room for ${ROOM_GOLD_COST} gold.`;
  state.bubbleUntil = performance.now() + 2200;
  updateHud();
  if (state.forumOpen) updateForumPanel();
  await saveWorld();
}

function buildingDeleteTopicCount(building) {
  if (!building || !isBoardBuilding(building)) return 0;
  return roomLayoutForBuilding(building).rooms.length;
}

function deleteConfirmIsOpen() {
  return deleteConfirm.classList.contains("active");
}

function openDeleteConfirm() {
  const building = selectedBuilding();
  if (!building) return;
  if (!isOwnBuilding(building)) {
    state.bubbleText = "That building belongs to another member.";
    state.bubbleUntil = performance.now() + 1800;
    updateSelectionPanel();
    return;
  }

  const index = buildings.findIndex((item) => item.id === building.id);
  if (index === -1) {
    clearSelection();
    return;
  }

  const buildType = buildingBuildType(building);
  const label = buildTypeNoun(buildType);
  const sellValue = buildingSellValue(building);
  const topicCount = buildingDeleteTopicCount(building);
  const boardIndex = buildType === "board"
    ? buildings.filter((item) => isBoardBuilding(item)).findIndex((item) => item.id === building.id)
    : -1;
  const fallbackName = buildType === "board"
    ? forumBoardTitle(building, Math.max(0, boardIndex))
    : building.artMeta?.name || "Decoration";

  state.pendingDeleteBuildingId = building.id;
  deleteConfirmTitle.textContent = `Sell ${label}?`;
  deleteConfirmBody.textContent = `Selling "${fallbackName}" returns ${sellValue} gold and deletes this ${label}.`;
  deleteTopicCount.textContent = String(topicCount);
  deleteTopicLabel.textContent = `${topicCount === 1 ? "topic" : "topics"} also deleted`;
  deleteMessageNote.textContent = buildType === "board"
    ? `Rooms and all messages in ${topicCount === 1 ? "that topic" : "those topics"} will be deleted too.`
    : "This decoration has no topic rooms or forum messages.";
  confirmDeleteButton.textContent = `Sell +${sellValue} gold`;
  deleteConfirm.hidden = false;
  deleteConfirm.classList.add("active");
  requestAnimationFrame(() => confirmDeleteButton.focus());
}

function closeDeleteConfirm(returnFocus = true) {
  state.pendingDeleteBuildingId = null;
  deleteConfirm.classList.remove("active");
  deleteConfirm.hidden = true;
  if (returnFocus) sellButton.focus();
}

function confirmDeleteBuilding() {
  const building = buildings.find((item) => item.id === state.pendingDeleteBuildingId);
  closeDeleteConfirm(false);
  if (!building) {
    clearSelection();
    return;
  }

  sellSelectedBuilding(building);
}

function sellSelectedBuilding(building = selectedBuilding()) {
  if (!building) return;
  if (!isOwnBuilding(building)) {
    state.bubbleText = "That building belongs to another member.";
    state.bubbleUntil = performance.now() + 1800;
    updateSelectionPanel();
    return;
  }

  const index = buildings.findIndex((item) => item.id === building.id);
  if (index === -1) {
    clearSelection();
    return;
  }

  buildings.splice(index, 1);
  const sellValue = buildingSellValue(building);
  const label = buildTypeNoun(buildingBuildType(building));
  state.gold += sellValue;
  state.bubbleText = `Sold ${label} for ${sellValue} gold.`;
  state.bubbleUntil = performance.now() + 2200;
  updateHud();
  clearSelection();
  if (state.forumOpen) updateForumPanel();
  scheduleWorldSave();
}

function openBoardEditor() {
  const building = selectedBuilding();
  if (!building || !isBoardBuilding(building)) return;
  if (!isOwnBuilding(building)) {
    state.bubbleText = "That board belongs to another member.";
    state.bubbleUntil = performance.now() + 1800;
    updateSelectionPanel();
    return;
  }

  const boardIndex = buildings.filter((item) => isBoardBuilding(item)).findIndex((item) => item.id === building.id);
  const fallbackName = forumBoardTitle(building, Math.max(0, boardIndex));
  const topics = roomLayoutForBuilding(building).rooms;

  building.artMeta = building.artMeta && typeof building.artMeta === "object" ? building.artMeta : {};
  boardEditorSummary.textContent = fallbackName;
  boardPreviewImage.src = building.imageUrl || "";
  boardPreviewImage.alt = fallbackName;
  boardNameInput.value = fallbackName;
  boardDescriptionInput.value = forumBoardDescription(building, topics);
  boardVisibilityInput.value = forumBoardVisibility(building);
  boardEditor.classList.add("active");
  keys.clear();
  requestAnimationFrame(() => boardNameInput.focus());
}

function closeBoardEditor() {
  boardEditor.classList.remove("active");
}

function saveBoardEditor(event) {
  event.preventDefault();
  const building = selectedBuilding();
  if (!building || !isBoardBuilding(building)) {
    closeBoardEditor();
    return;
  }
  if (!isOwnBuilding(building)) {
    closeBoardEditor();
    state.bubbleText = "That board belongs to another member.";
    state.bubbleUntil = performance.now() + 1800;
    updateSelectionPanel();
    return;
  }

  const name = boardNameInput.value.trim();
  const description = boardDescriptionInput.value.trim();
  const visibility = boardVisibilityInput.value;
  building.artMeta = building.artMeta && typeof building.artMeta === "object" ? building.artMeta : {};
  building.artMeta.forumTitle = name || "Untitled Board";
  building.artMeta.name = building.artMeta.forumTitle;
  building.artMeta.forumDescription = description;
  building.artMeta.description = description;
  building.artMeta.visibility = visibility === "company" || visibility === "private" ? visibility : "public";
  building.name = building.artMeta.forumTitle;

  selectionSummary.textContent = "1 board";
  state.bubbleText = "Board updated.";
  state.bubbleUntil = performance.now() + 2200;
  closeBoardEditor();
  if (state.forumOpen) updateForumPanel();
  scheduleWorldSave();
}

function openBuildingEditor(buildType = "board") {
  if (!selectedHomePlotsAreBuildable()) {
    state.bubbleText = "Select empty home plots to build.";
    state.bubbleUntil = performance.now() + 2200;
    updateSelectionPanel();
    return;
  }

  const snapshot = captureSelectedPlotSnapshot();
  if (!snapshot) return;

  state.editor.active = true;
  keys.clear();
  state.editor.buildType = buildType === "decoration" ? "decoration" : "board";
  state.editor.snapshot = snapshot;
  state.editor.previewImage = null;
  state.editor.previewAssetId = null;
  state.editor.generatedPreviewImage = null;
  state.editor.generatedPreviewAssetId = null;
  state.editor.imageMode = "new";
  state.assetLibrary.selectedUrl = null;
  state.editor.materialCosts = materialCostTemplate();
  state.editor.lastPoint = null;
  state.editor.boardName = state.editor.buildType === "board" ? nextBoardTitle() : "Decoration";
  state.editor.boardDescription = "";
  state.editor.boardVisibility = "public";
  editorBoardFields.hidden = false;
  if (editorVisibilityField) editorVisibilityField.hidden = state.editor.buildType !== "board";
  newBoardNameInput.value = state.editor.boardName;
  newBoardDescriptionInput.value = "";
  newBoardVisibilityInput.value = "public";
  buildingEditor.classList.add("active");
  editorSummary.textContent = `${snapshot.tiles.length} plot ${buildTypeNoun()}`;
  previewBuildingButton.textContent = `Preview ${buildTypeLabel()}`;
  placeBuildingButton.textContent = `Build ${buildTypeLabel()}`;
  resetPreviewPane();

  editorBase.width = snapshot.width;
  editorBase.height = snapshot.height;
  doodleCanvas.width = snapshot.width;
  doodleCanvas.height = snapshot.height;
  materialCanvas.width = snapshot.width;
  materialCanvas.height = snapshot.height;
  editorBaseCtx.clearRect(0, 0, snapshot.width, snapshot.height);
  doodleCtx.clearRect(0, 0, snapshot.width, snapshot.height);
  materialCtx.clearRect(0, 0, snapshot.width, snapshot.height);
  editorBaseCtx.drawImage(snapshot.image, 0, 0);
  updateEditorBrushColor();

  const aspect = `${snapshot.width} / ${snapshot.height}`;
  editorBase.parentElement.style.aspectRatio = aspect;
  setEditorImageMode("new");
  updateEditorMaterialUi();
  renderAssetLibrary();
  void loadAssetLibrary();
}

function closeBuildingEditor() {
  state.editor.active = false;
  state.editor.drawing = false;
  buildingEditor.classList.remove("active");
}

function captureSelectedPlotSnapshot() {
  const tiles = selectedTiles().filter((tile) => isOwnHomeTile(tile.x, tile.y));
  if (!tiles.length) return null;

  const bounds = screenBoundsForTiles(tiles, 64);
  const cropX = Math.max(0, Math.floor(bounds.x));
  const cropY = Math.max(0, Math.floor(bounds.y));
  const cropRight = Math.min(state.width, Math.ceil(bounds.x + bounds.width));
  const cropBottom = Math.min(state.height, Math.ceil(bounds.y + bounds.height));
  const width = Math.max(80, cropRight - cropX);
  const height = Math.max(80, cropBottom - cropY);
  const image = document.createElement("canvas");
  const generationImage = document.createElement("canvas");
  image.width = Math.floor(width * state.dpr);
  image.height = Math.floor(height * state.dpr);
  generationImage.width = image.width;
  generationImage.height = image.height;
  const imageCtx = image.getContext("2d");
  const generationImageCtx = generationImage.getContext("2d");
  const previousCapture = state.previewCapture;

  state.previewCapture = "context";
  drawWorld();
  imageCtx.drawImage(
    canvas,
    Math.floor(cropX * state.dpr),
    Math.floor(cropY * state.dpr),
    Math.floor(width * state.dpr),
    Math.floor(height * state.dpr),
    0,
    0,
    image.width,
    image.height
  );

  state.previewCapture = "generation";
  drawWorld();
  generationImageCtx.drawImage(
    canvas,
    Math.floor(cropX * state.dpr),
    Math.floor(cropY * state.dpr),
    Math.floor(width * state.dpr),
    Math.floor(height * state.dpr),
    0,
    0,
    generationImage.width,
    generationImage.height
  );

  state.previewCapture = previousCapture;
  drawWorld();

  return {
    image,
    generationImage,
    tiles: tiles.map((tile) => ({ x: tile.x, y: tile.y })),
    tileKeys: new Set(tiles.map((tile) => tileKey(tile.x, tile.y))),
    crop: { x: cropX, y: cropY, width, height },
    width: image.width,
    height: image.height
  };
}

function screenBoundsForTiles(tiles, margin = 0) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const tile of tiles) {
    const pos = tileCenterScreen(tile.x, tile.y);
    minX = Math.min(minX, pos.x - TILE_W / 2);
    maxX = Math.max(maxX, pos.x + TILE_W / 2);
    minY = Math.min(minY, pos.y - TILE_H / 2);
    maxY = Math.max(maxY, pos.y + TILE_H / 2);
  }

  return {
    x: minX - margin,
    y: minY - margin * 1.25,
    width: maxX - minX + margin * 2,
    height: maxY - minY + margin * 1.8
  };
}

function editorPointFromEvent(event) {
  const rect = doodleCanvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * doodleCanvas.width,
    y: ((event.clientY - rect.top) / rect.height) * doodleCanvas.height
  };
}

function drawDoodleLine(from, to) {
  const materialBrush = selectedMaterialBrush();
  doodleCtx.strokeStyle = state.editor.brushColor;
  doodleCtx.lineWidth = Number(brushSize.value);
  doodleCtx.lineCap = "round";
  doodleCtx.lineJoin = "round";
  doodleCtx.beginPath();
  doodleCtx.moveTo(from.x, from.y);
  doodleCtx.lineTo(to.x, to.y);
  doodleCtx.stroke();

  materialCtx.strokeStyle = materialBrush?.color || state.editor.brushBaseColor;
  materialCtx.lineWidth = Number(brushSize.value);
  materialCtx.lineCap = "round";
  materialCtx.lineJoin = "round";
  materialCtx.beginPath();
  materialCtx.moveTo(from.x, from.y);
  materialCtx.lineTo(to.x, to.y);
  materialCtx.stroke();
}

async function previewBuilding() {
  if (!state.editor.snapshot) return;
  previewBuildingButton.disabled = true;
  placeBuildingButton.disabled = true;
  previewPane.innerHTML = "<span>Generating preview...</span>";

  const baseImage = state.editor.snapshot.generationImage.toDataURL("image/png");
  const doodleImage = doodleCanvas.toDataURL("image/png");
  const compositeImage = buildingCompositeImageDataUrl();
  const assetType = buildTypeNoun();
  const promptSubject = state.editor.buildType === "decoration"
    ? "decorative prop, ornament, garden item, statue, sign, plant arrangement, or similar non-building decoration"
    : "forum board building";
  const payload = {
    prompt: `Create a transparent-background 2D isometric game ${assetType} sprite that fits the selected plot. Interpret the doodle as a ${promptSubject}. The user doodle is the primary design brief: preserve its silhouette, proportions, color hints, and footprint as much as possible while turning it into a polished natural cozy settlement game asset. Use true PNG alpha transparency around the ${assetType}, not a black or solid-color backdrop. Do not include any player character, flowers, fences, grid lines, UI, screenshot background, or text.`,
    baseImage,
    doodleImage,
    compositeImage,
    assetType: state.editor.buildType,
    width: state.editor.snapshot.width,
    height: state.editor.snapshot.height
  };

  try {
    const response = await fetch("/api/preview-building", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      let message = `Preview endpoint returned ${response.status}`;
      try {
        const data = await response.json();
        if (data?.error) message = data.error;
      } catch (parseError) {
        try {
          const text = await response.text();
          if (text) message = text;
        } catch (textError) {
          // Keep the status-based message if the response body cannot be read.
        }
      }
      throw new Error(message);
    }
    const data = await response.json();
    if (!data.url) throw new Error("Preview response did not include an image URL");
    const transparentPreview = await makeGeneratedBackgroundTransparent(data.url);
    const assetId = createClientId();
    previewPane.innerHTML = "<span>Saving to library...</span>";
    const saved = await uploadBuildingImageAsset(assetId, transparentPreview, {
      assetType: state.editor.buildType,
      name: currentEditorAssetName(),
      width: state.editor.snapshot.width,
      height: state.editor.snapshot.height,
      source: "generated"
    });
    state.editor.previewAssetId = assetId;
    if (saved.asset) addAssetToLibrary(saved.asset);
    state.assetLibrary.selectedUrl = saved.url;
    setPreviewImage(saved.url);
    renderAssetLibrary();
  } catch (error) {
    setPreviewError(error);
  } finally {
    previewBuildingButton.disabled = false;
    updateEditorMaterialUi();
  }
}

function buildingCompositeImageDataUrl() {
  const snapshot = state.editor.snapshot;
  const composite = document.createElement("canvas");
  composite.width = snapshot.width;
  composite.height = snapshot.height;
  const compositeCtx = composite.getContext("2d");
  compositeCtx.drawImage(snapshot.generationImage, 0, 0);
  compositeCtx.drawImage(doodleCanvas, 0, 0);
  return composite.toDataURL("image/png");
}

async function makeGeneratedBackgroundTransparent(url) {
  const image = await loadImage(url);
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;
  if (!width || !height) return url;

  const matteCanvas = document.createElement("canvas");
  matteCanvas.width = width;
  matteCanvas.height = height;
  const matteCtx = matteCanvas.getContext("2d", { willReadFrequently: true });
  matteCtx.drawImage(image, 0, 0, width, height);

  const imageData = matteCtx.getImageData(0, 0, width, height);
  const pixels = imageData.data;
  const background = dominantEdgeColor(pixels, width, height);
  if (!background || background.alpha < 16) return matteCanvas.toDataURL("image/png");

  const visited = new Uint8Array(width * height);
  const queue = [];
  const enqueue = (x, y) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const index = y * width + x;
    if (visited[index]) return;
    const offset = index * 4;
    if (!matchesBackground(pixels, offset, background)) return;
    visited[index] = 1;
    queue.push(index);
  };

  for (let x = 0; x < width; x++) {
    enqueue(x, 0);
    enqueue(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    enqueue(0, y);
    enqueue(width - 1, y);
  }

  while (queue.length) {
    const index = queue.pop();
    const x = index % width;
    const y = Math.floor(index / width);
    const offset = index * 4;
    pixels[offset + 3] = 0;
    enqueue(x + 1, y);
    enqueue(x - 1, y);
    enqueue(x, y + 1);
    enqueue(x, y - 1);
  }

  softenTransparentEdge(pixels, width, height, background);
  matteCtx.putImageData(imageData, 0, 0);
  return matteCanvas.toDataURL("image/png");
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Generated image could not be loaded."));
    image.src = url;
  });
}

function dominantEdgeColor(pixels, width, height) {
  const bins = new Map();
  const addPixel = (x, y) => {
    const offset = (y * width + x) * 4;
    const alpha = pixels[offset + 3];
    if (alpha < 16) return;
    const key = [
      Math.round(pixels[offset] / 16) * 16,
      Math.round(pixels[offset + 1] / 16) * 16,
      Math.round(pixels[offset + 2] / 16) * 16
    ].join(",");
    const entry = bins.get(key) || { count: 0, r: 0, g: 0, b: 0, alpha: 0 };
    entry.count++;
    entry.r += pixels[offset];
    entry.g += pixels[offset + 1];
    entry.b += pixels[offset + 2];
    entry.alpha += alpha;
    bins.set(key, entry);
  };

  for (let x = 0; x < width; x += 2) {
    addPixel(x, 0);
    addPixel(x, height - 1);
  }
  for (let y = 0; y < height; y += 2) {
    addPixel(0, y);
    addPixel(width - 1, y);
  }

  let best = null;
  for (const entry of bins.values()) {
    if (!best || entry.count > best.count) best = entry;
  }
  if (!best || best.count < 8) return null;
  return {
    r: best.r / best.count,
    g: best.g / best.count,
    b: best.b / best.count,
    alpha: best.alpha / best.count,
    tolerance: 54
  };
}

function matchesBackground(pixels, offset, background) {
  const alpha = pixels[offset + 3];
  if (alpha < 16) return true;
  const r = pixels[offset];
  const g = pixels[offset + 1];
  const b = pixels[offset + 2];
  const distance = Math.hypot(r - background.r, g - background.g, b - background.b);
  const veryDarkMatte = background.r < 36 && background.g < 36 && background.b < 36 && r < 56 && g < 56 && b < 56;
  return distance < background.tolerance || veryDarkMatte;
}

function softenTransparentEdge(pixels, width, height, background) {
  const transparent = new Uint8Array(width * height);
  for (let i = 0; i < transparent.length; i++) {
    transparent[i] = pixels[i * 4 + 3] < 16 ? 1 : 0;
  }

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const index = y * width + x;
      const offset = index * 4;
      if (transparent[index] || !matchesBackground(pixels, offset, background)) continue;
      const touchesTransparent =
        transparent[index - 1] ||
        transparent[index + 1] ||
        transparent[index - width] ||
        transparent[index + width];
      if (touchesTransparent) pixels[offset + 3] = Math.min(pixels[offset + 3], 90);
    }
  }
}

function setPreviewError(error) {
  state.editor.previewImage = null;
  placeBuildingButton.disabled = true;
  const rawMessage = error?.message || "Unable to generate preview.";
  const message = rawMessage.length > 240 ? `${rawMessage.slice(0, 240)}...` : rawMessage;
  previewPane.innerHTML = "";
  const text = document.createElement("span");
  text.className = "preview-error";
  text.textContent = `Preview failed: ${message}`;
  previewPane.appendChild(text);
  console.error("Building preview failed", error);
  updateEditorMaterialUi();
}

function setPreviewImage(url, altText = `${buildTypeLabel()} preview`, mode = state.editor.imageMode) {
  state.editor.previewImage = url;
  if (mode === "new") {
    state.editor.generatedPreviewImage = url;
    state.editor.generatedPreviewAssetId = state.editor.previewAssetId;
  }
  previewPane.innerHTML = "";
  const img = new Image();
  img.alt = altText;
  img.src = url;
  previewPane.appendChild(img);
  updateEditorMaterialUi();
}

function isInlineImageDataUrl(url) {
  return /^data:image\/(png|jpe?g|webp);base64,/i.test(String(url || ""));
}

async function persistBuildingImageAsset(buildingId, imageUrl) {
  if (!isInlineImageDataUrl(imageUrl)) return imageUrl;
  const data = await uploadBuildingImageAsset(buildingId, imageUrl, {
    assetType: state.editor.buildType,
    name: currentEditorAssetName(),
    width: state.editor.snapshot?.width || 0,
    height: state.editor.snapshot?.height || 0,
    source: "generated"
  });
  if (data.asset) addAssetToLibrary(data.asset);
  return data.url;
}

async function uploadBuildingImageAsset(buildingId, imageUrl, meta = {}) {
  const response = await fetch("/api/building-assets", {
    method: "POST",
    credentials: "same-origin",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      buildingId,
      imageData: imageUrl,
      assetType: meta.assetType || state.editor.buildType,
      name: meta.name || currentEditorAssetName(),
      width: meta.width || state.editor.snapshot?.width || 0,
      height: meta.height || state.editor.snapshot?.height || 0,
      source: meta.source || "generated"
    })
  });

  if (!response.ok) {
    let message = `Asset save failed: ${response.status}`;
    try {
      const data = await response.json();
      if (data?.error) message = data.error;
    } catch (error) {
      // Keep the status-based message if the response body cannot be read.
    }
    throw new Error(message);
  }

  const data = await response.json();
  if (!data.url) throw new Error("Asset save response did not include a URL.");
  return data;
}

function currentEditorAssetName() {
  return editorBoardMeta().name || buildTypeLabel();
}

function makeLocalBuildingPreview() {
  const snapshot = state.editor.snapshot;
  const asset = document.createElement("canvas");
  asset.width = snapshot.width;
  asset.height = snapshot.height;
  const c = asset.getContext("2d");
  const cx = asset.width / 2;
  const cy = asset.height * 0.58;
  const scale = Math.max(0.85, Math.min(1.7, snapshot.tiles.length ** 0.5));
  const roof = state.editor.brushColor || "#d85f4d";

  c.fillStyle = "rgba(0, 0, 0, 0.22)";
  c.beginPath();
  c.ellipse(cx, cy + 38 * scale, 62 * scale, 18 * scale, 0, 0, Math.PI * 2);
  c.fill();

  c.fillStyle = "#9f6a3f";
  c.beginPath();
  c.moveTo(cx - 54 * scale, cy);
  c.lineTo(cx, cy + 28 * scale);
  c.lineTo(cx + 54 * scale, cy);
  c.lineTo(cx, cy - 28 * scale);
  c.closePath();
  c.fill();

  c.fillStyle = "#cfa86b";
  c.beginPath();
  c.moveTo(cx - 54 * scale, cy);
  c.lineTo(cx, cy + 28 * scale);
  c.lineTo(cx, cy + 72 * scale);
  c.lineTo(cx - 54 * scale, cy + 40 * scale);
  c.closePath();
  c.fill();

  c.fillStyle = "#b98953";
  c.beginPath();
  c.moveTo(cx + 54 * scale, cy);
  c.lineTo(cx, cy + 28 * scale);
  c.lineTo(cx, cy + 72 * scale);
  c.lineTo(cx + 54 * scale, cy + 40 * scale);
  c.closePath();
  c.fill();

  c.fillStyle = roof;
  c.beginPath();
  c.moveTo(cx - 65 * scale, cy - 2 * scale);
  c.lineTo(cx, cy - 48 * scale);
  c.lineTo(cx + 65 * scale, cy - 2 * scale);
  c.lineTo(cx, cy + 34 * scale);
  c.closePath();
  c.fill();

  c.fillStyle = "rgba(255, 246, 210, 0.85)";
  c.beginPath();
  c.moveTo(cx - 14 * scale, cy + 35 * scale);
  c.lineTo(cx, cy + 42 * scale);
  c.lineTo(cx, cy + 68 * scale);
  c.lineTo(cx - 14 * scale, cy + 59 * scale);
  c.closePath();
  c.fill();

  c.globalAlpha = 0.28;
  c.drawImage(doodleCanvas, 0, 0);
  c.globalAlpha = 1;

  return asset.toDataURL("image/png");
}

async function placePreviewBuilding() {
  if (!state.editor.snapshot || !state.editor.previewImage) return;
  const assetMeta = syncEditorBoardMetaState();
  const boardMeta = state.editor.buildType === "board" ? assetMeta : null;
  if (state.editor.buildType === "board" && !String(newBoardNameInput.value || "").trim()) {
    editorSummary.textContent = "Name this board to place it";
    state.bubbleText = "Name this board first.";
    state.bubbleUntil = performance.now() + 2200;
    newBoardNameInput.focus();
    return;
  }

  const goldCost = currentEditorBuildingGoldCost();
  const materialCosts = currentEditorMaterialCosts();
  state.editor.materialCosts = materialCosts;

  if (state.gold < goldCost) {
    editorSummary.textContent = `Need ${goldCost} gold to build`;
    state.bubbleText = `Need ${goldCost} gold.`;
    state.bubbleUntil = performance.now() + 2200;
    updateEditorMaterialUi();
    return;
  }

  const missingMaterials = missingMaterialRequirements(materialCosts);
  if (missingMaterials.length) {
    const missingText = missingMaterials.map((item) => `${item.missing} ${item.name}`).join(", ");
    editorSummary.textContent = `Need ${missingText}`;
    state.bubbleText = `Need ${missingText}.`;
    state.bubbleUntil = performance.now() + 2200;
    updateEditorMaterialUi();
    return;
  }

  const snapshot = state.editor.snapshot;
  const buildingId = createClientId();
  let imageUrl = state.editor.previewImage;

  placeBuildingButton.disabled = true;
  previewBuildingButton.disabled = true;
  editorSummary.textContent = `Saving ${buildTypeNoun()} asset...`;
  try {
    imageUrl = await persistBuildingImageAsset(buildingId, imageUrl);
  } catch (error) {
    const rawMessage = error?.message || "Unable to save building asset.";
    const message = rawMessage.length > 120 ? `${rawMessage.slice(0, 120)}...` : rawMessage;
    editorSummary.textContent = `Could not save asset`;
    state.bubbleText = message;
    state.bubbleUntil = performance.now() + 2600;
    previewBuildingButton.disabled = false;
    updateEditorMaterialUi();
    console.error("Building asset save failed", error);
    return;
  }

  const building = {
    id: buildingId,
    boardId: null,
    ownerUserId: state.account.id,
    ownerName: state.account.name,
    ownerColor: state.account.color,
    name: boardMeta?.name || assetMeta.name || buildTypeLabel(),
    tiles: snapshot.tiles.map((tile) => ({ ...tile })),
    tileKeys: new Set([...snapshot.tileKeys]),
    imageUrl,
    image: null,
    width: snapshot.width,
    height: snapshot.height,
    materialCosts,
    artMeta: state.editor.buildType === "board" ? {
      buildType: "board",
      name: boardMeta.name,
      forumTitle: boardMeta.name,
      description: boardMeta.description,
      forumDescription: boardMeta.description,
      visibility: boardMeta.visibility,
      assetId: state.editor.previewAssetId,
      assetUrl: imageUrl
    } : {
      buildType: "decoration",
      name: assetMeta.name || "Decoration",
      description: assetMeta.description,
      assetId: state.editor.previewAssetId,
      assetUrl: imageUrl
    },
    createdAt: performance.now()
  };

  state.gold -= goldCost;
  spendResources(materialCosts);
  buildings.push(building);
  state.bubbleText = `Built ${buildTypeNoun()} for ${formatBuildingCost(materialCosts, goldCost)}.`;
  state.bubbleUntil = performance.now() + 2200;
  closeBuildingEditor();
  selectBuilding(building);
  updateHud();
  if (state.forumOpen) updateForumPanel();
  await saveWorld();
}

function drawSelectionOverlay(tile) {
  const building = selectedBuilding();
  const buildingSelected = building?.tileKeys.has(tileKey(tile.x, tile.y));
  const selected = isSelectedTile(tile.x, tile.y) || buildingSelected;
  const hover = state.selection.hover && state.selection.hover.x === tile.x && state.selection.hover.y === tile.y;
  if (!selected && !hover) return;

  const pos = tileCenterScreen(tile.x, tile.y);
  const type = buildingSelected ? "building" : selected ? state.selection.plotType : plotTypeAt(tile.x, tile.y);
  const validHover = hover && canStartSelection(tile);
  const fill = selected
    ? type === "building" ? "rgba(120, 205, 255, 0.22)" : type === "home" ? "rgba(78, 190, 143, 0.28)" : "rgba(238, 188, 77, 0.3)"
    : validHover ? "rgba(255, 255, 255, 0.12)" : "rgba(226, 88, 71, 0.18)";
  const stroke = selected
    ? type === "building" ? "rgba(192, 235, 255, 0.95)" : type === "home" ? "rgba(170, 255, 215, 0.9)" : "rgba(255, 231, 150, 0.95)"
    : validHover ? "rgba(255, 255, 255, 0.45)" : "rgba(255, 126, 106, 0.75)";

  drawIsoDiamond(pos.x, pos.y, fill, stroke);
  if (selected) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function drawEditorBuildSelectionOverlay() {
  const tiles = selectedTiles();
  if (!tiles.length) return;

  ctx.save();
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  for (const tile of tiles) {
    const pos = tileCenterScreen(tile.x, tile.y);

    drawIsoDiamond(pos.x, pos.y, "rgba(81, 224, 255, 0.18)", null);

    ctx.strokeStyle = "rgba(255, 250, 218, 0.96)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y - TILE_H / 2 + 2);
    ctx.lineTo(pos.x + TILE_W / 2 - 3, pos.y);
    ctx.lineTo(pos.x, pos.y + TILE_H / 2 - 2);
    ctx.lineTo(pos.x - TILE_W / 2 + 3, pos.y);
    ctx.closePath();
    ctx.stroke();

    ctx.strokeStyle = "rgba(70, 236, 255, 0.98)";
    ctx.lineWidth = 2.5;
    ctx.setLineDash([9, 5]);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y - TILE_H / 2 + 5);
    ctx.lineTo(pos.x + TILE_W / 2 - 7, pos.y);
    ctx.lineTo(pos.x, pos.y + TILE_H / 2 - 5);
    ctx.lineTo(pos.x - TILE_W / 2 + 7, pos.y);
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);
  }

  ctx.restore();
}

function drawFence(tile) {
  if (!isFenceTile(tile.x, tile.y) || isGateTile(tile.x, tile.y)) return;
  const pos = tileCenterScreen(tile.x, tile.y);
  const connections = fenceConnections(tile.x, tile.y);
  const corner = isFenceCorner(tile.x, tile.y);
  const postHeight = corner ? 34 : 25;
  const postWidth = corner ? 7 : 5;

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.strokeStyle = "rgba(32, 21, 13, 0.22)";
  ctx.lineWidth = 8;
  for (const connection of connections) {
    drawFenceRail(pos, connection, 0, 7);
  }

  ctx.strokeStyle = "#5f3d24";
  ctx.lineWidth = 4;
  for (const connection of connections) {
    drawFenceRail(pos, connection, -15, -15);
    drawFenceRail(pos, connection, -5, -5);
  }

  ctx.strokeStyle = "#8a5d35";
  ctx.lineWidth = postWidth;
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y + 4);
  ctx.lineTo(pos.x, pos.y - postHeight);
  ctx.stroke();

  ctx.fillStyle = corner ? "#c08a4a" : "#a7753f";
  ctx.beginPath();
  ctx.moveTo(pos.x - postWidth, pos.y - postHeight);
  ctx.lineTo(pos.x, pos.y - postHeight - 9);
  ctx.lineTo(pos.x + postWidth, pos.y - postHeight);
  ctx.closePath();
  ctx.fill();

  if (isGateNeighbor(tile.x, tile.y)) {
    ctx.strokeStyle = "#d0a15b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pos.x - 5, pos.y - postHeight + 6);
    ctx.lineTo(pos.x + 5, pos.y - postHeight + 2);
    ctx.stroke();
  }

  ctx.restore();
}

function fenceConnections(x, y) {
  const directions = [
    { dx: 1, dy: 0, sx: TILE_W / 2, sy: TILE_H / 2 },
    { dx: -1, dy: 0, sx: -TILE_W / 2, sy: -TILE_H / 2 },
    { dx: 0, dy: 1, sx: -TILE_W / 2, sy: TILE_H / 2 },
    { dx: 0, dy: -1, sx: TILE_W / 2, sy: -TILE_H / 2 }
  ];

  return directions.filter(({ dx, dy }) => {
    const nx = x + dx;
    const ny = y + dy;
    return isFenceTile(nx, ny) && !isGateTile(nx, ny);
  });
}

function isFenceCorner(x, y) {
  return (x === HOME_MIN_X || x === HOME_MAX_X) && (y === HOME_MIN_Y || y === HOME_MAX_Y);
}

function isGateNeighbor(x, y) {
  const neighbors = [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1]
  ];
  return neighbors.some(([nx, ny]) => isGateTile(nx, ny));
}

function drawFenceRail(pos, connection, startYOffset, endYOffset) {
  const inset = 7;
  const length = Math.hypot(connection.sx, connection.sy) || 1;
  const ux = connection.sx / length;
  const uy = connection.sy / length;
  ctx.beginPath();
  ctx.moveTo(pos.x + ux * inset, pos.y + uy * inset + startYOffset);
  ctx.lineTo(pos.x + connection.sx - ux * inset, pos.y + connection.sy - uy * inset + endYOffset);
  ctx.stroke();
}

function drawGateMarker(tile) {
  if (!isGateTile(tile.x, tile.y)) return;
  const pos = tileCenterScreen(tile.x, tile.y);

  ctx.save();
  ctx.strokeStyle = "rgba(255, 238, 190, 0.62)";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(pos.x - 12, pos.y + 11);
  ctx.lineTo(pos.x, pos.y + 17);
  ctx.lineTo(pos.x + 12, pos.y + 11);
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 238, 190, 0.9)";
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y - 10);
  ctx.lineTo(pos.x + 8, pos.y + 3);
  ctx.lineTo(pos.x, pos.y + 13);
  ctx.lineTo(pos.x - 8, pos.y + 3);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#5d7a49";
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y - 3);
  ctx.lineTo(pos.x + 4, pos.y + 3);
  ctx.lineTo(pos.x, pos.y + 8);
  ctx.lineTo(pos.x - 4, pos.y + 3);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawFencePart(tile) {
  if (!isFenceTile(tile.x, tile.y)) return;
  if (isGateTile(tile.x, tile.y)) {
    drawGateMarker(tile);
  } else {
    drawFence(tile);
  }
}

function buildingDepth(building) {
  if (Number.isFinite(building.depth)) return building.depth;
  building.depth = Math.max(...building.tiles.map((tile) => tile.x + tile.y)) + 0.7;
  return building.depth;
}

function buildingBounds(building) {
  return screenBoundsForTiles(building.tiles, 64);
}

function ensureBuildingImage(building) {
  if (!building.image) {
    building.image = new Image();
    building.image.src = building.imageUrl;
  }
  return building.image;
}

function buildingContainsScreenPoint(building, x, y) {
  const bounds = buildingBounds(building);
  if (x < bounds.x || x > bounds.x + bounds.width || y < bounds.y || y > bounds.y + bounds.height) return false;

  const image = ensureBuildingImage(building);
  if (!image.complete || !image.naturalWidth || !image.naturalHeight) return true;

  const sampleX = Math.floor(((x - bounds.x) / bounds.width) * image.naturalWidth);
  const sampleY = Math.floor(((y - bounds.y) / bounds.height) * image.naturalHeight);

  try {
    if (buildingHitCanvas.width !== image.naturalWidth || buildingHitCanvas.height !== image.naturalHeight) {
      buildingHitCanvas.width = image.naturalWidth;
      buildingHitCanvas.height = image.naturalHeight;
    }
    buildingHitCtx.clearRect(0, 0, buildingHitCanvas.width, buildingHitCanvas.height);
    buildingHitCtx.drawImage(image, 0, 0);
    return buildingHitCtx.getImageData(sampleX, sampleY, 1, 1).data[3] > 18;
  } catch (error) {
    return true;
  }
}

function buildingAtScreenPoint(x, y) {
  return [...buildings]
    .sort((a, b) => buildingDepth(b) - buildingDepth(a))
    .find((building) => buildingContainsScreenPoint(building, x, y)) || null;
}

function roomEdgeMidpoint(tile, side) {
  if (side === "north") return { x: tile.x + 0.5, y: tile.y };
  if (side === "east") return { x: tile.x + 1, y: tile.y + 0.5 };
  if (side === "south") return { x: tile.x + 0.5, y: tile.y + 1 };
  return { x: tile.x, y: tile.y + 0.5 };
}

function roomOutwardVector(side) {
  if (side === "north") return { x: 0, y: -1 };
  if (side === "east") return { x: 1, y: 0 };
  if (side === "south") return { x: 0, y: 1 };
  return { x: -1, y: 0 };
}

function roomSideDelta(side) {
  if (side === "north") return { dx: 0, dy: -1 };
  if (side === "east") return { dx: 1, dy: 0 };
  if (side === "south") return { dx: 0, dy: 1 };
  return { dx: -1, dy: 0 };
}

function oppositeRoomSide(side) {
  if (side === "north") return "south";
  if (side === "east") return "west";
  if (side === "south") return "north";
  return "east";
}

function roomWallEdgeKey(x, y, side) {
  if (side === "north") return `${x},${y},h`;
  if (side === "south") return `${x},${y + 1},h`;
  if (side === "west") return `${x},${y},v`;
  return `${x + 1},${y},v`;
}

function roomWallEdgeKeyBetween(fromX, fromY, toX, toY) {
  if (toX === fromX + 1 && toY === fromY) return roomWallEdgeKey(fromX, fromY, "east");
  if (toX === fromX - 1 && toY === fromY) return roomWallEdgeKey(fromX, fromY, "west");
  if (toY === fromY + 1 && toX === fromX) return roomWallEdgeKey(fromX, fromY, "south");
  if (toY === fromY - 1 && toX === fromX) return roomWallEdgeKey(fromX, fromY, "north");
  return null;
}

function roomInteriorDoorForEdge(edgeKey) {
  return state.room.interiorDoors.find((door) => door.edgeKey === edgeKey) || null;
}

function roomInteriorDoorAllowsCrossing(edgeKey, fromFeet, toFeet) {
  const door = roomInteriorDoorForEdge(edgeKey);
  if (!door) return false;

  const alongAxis = door.side === "east" || door.side === "west" ? "y" : "x";
  const doorCenter = alongAxis === "y" ? door.edgeY : door.edgeX;
  const crossingCenter = (fromFeet[alongAxis] + toFeet[alongAxis]) / 2;
  return Math.abs(crossingCenter - doorCenter) <= ROOM_DOOR_HALF_WIDTH;
}

function uniqueIntegerTiles(tiles) {
  const byKey = new Map();
  for (const tile of Array.isArray(tiles) ? tiles : []) {
    const x = Number(tile?.x);
    const y = Number(tile?.y);
    if (!Number.isInteger(x) || !Number.isInteger(y)) continue;
    byKey.set(tileKey(x, y), { x, y });
  }
  return [...byKey.values()];
}

function tilesAreConnected(tiles) {
  if (!tiles.length) return false;
  const keys = new Set(tiles.map((tile) => tileKey(tile.x, tile.y)));
  const queue = [tiles[0]];
  const visited = new Set();

  while (queue.length) {
    const tile = queue.shift();
    const key = tileKey(tile.x, tile.y);
    if (visited.has(key) || !keys.has(key)) continue;
    visited.add(key);
    queue.push(
      { x: tile.x + 1, y: tile.y },
      { x: tile.x - 1, y: tile.y },
      { x: tile.x, y: tile.y + 1 },
      { x: tile.x, y: tile.y - 1 }
    );
  }

  return visited.size === keys.size;
}

function chooseRoomDoor(tiles, tileKeys) {
  const sides = [
    { id: "south", dx: 0, dy: 1, bias: 0.3 },
    { id: "east", dx: 1, dy: 0, bias: 0.22 },
    { id: "west", dx: -1, dy: 0, bias: -0.08 },
    { id: "north", dx: 0, dy: -1, bias: -0.12 }
  ];
  let best = null;

  for (const tile of tiles) {
    for (const side of sides) {
      if (tileKeys.has(tileKey(tile.x + side.dx, tile.y + side.dy))) continue;
      const edge = roomEdgeMidpoint(tile, side.id);
      const score = edge.x + edge.y + side.bias;
      if (!best || score > best.score) {
        best = {
          x: tile.x,
          y: tile.y,
          side: side.id,
          edgeX: edge.x,
          edgeY: edge.y,
          score
        };
      }
    }
  }

  return best || {
    x: tiles[0]?.x || 0,
    y: tiles[0]?.y || 0,
    side: "south",
    edgeX: (tiles[0]?.x || 0) + 0.5,
    edgeY: (tiles[0]?.y || 0) + 1
  };
}

function chooseInteriorDoorForRoom(newRoom, existingRoomIdByTile) {
  const sides = [
    { id: "south", dx: 0, dy: 1, bias: 0.3 },
    { id: "east", dx: 1, dy: 0, bias: 0.22 },
    { id: "west", dx: -1, dy: 0, bias: -0.08 },
    { id: "north", dx: 0, dy: -1, bias: -0.12 }
  ];
  let best = null;

  for (const tile of newRoom.tiles) {
    for (const side of sides) {
      const neighborKey = tileKey(tile.x + side.dx, tile.y + side.dy);
      const fromRoomId = existingRoomIdByTile.get(neighborKey);
      if (!fromRoomId) continue;
      const edge = roomEdgeMidpoint(tile, side.id);
      const score = edge.x + edge.y + side.bias;
      if (!best || score > best.score) {
        best = {
          x: tile.x,
          y: tile.y,
          side: side.id,
          edgeX: edge.x,
          edgeY: edge.y,
          edgeKey: roomWallEdgeKey(tile.x, tile.y, side.id),
          fromRoomId,
          toRoomId: newRoom.id,
          score
        };
      }
    }
  }

  return best;
}

function roomLayoutForBuilding(building) {
  const minX = Math.min(...building.tiles.map((tile) => tile.x));
  const minY = Math.min(...building.tiles.map((tile) => tile.y));
  const maxX = Math.max(...building.tiles.map((tile) => tile.x));
  const maxY = Math.max(...building.tiles.map((tile) => tile.y));
  const baseTiles = building.tiles.map((tile) => ({
    x: tile.x - minX,
    y: tile.y - minY,
    worldX: tile.x,
    worldY: tile.y
  }));
  const baseKeys = new Set(baseTiles.map((tile) => tileKey(tile.x, tile.y)));
  const rooms = [{
    id: "main",
    name: "Main room",
    tiles: baseTiles.map((tile) => ({ ...tile })),
    tileKeys: new Set(baseKeys)
  }];
  const tileKeys = new Set(baseKeys);
  const roomIdByTile = new Map(baseTiles.map((tile) => [tileKey(tile.x, tile.y), "main"]));
  const interiorDoors = [];
  const interiorDoorKeys = new Set();

  const storedRooms = Array.isArray(building.artMeta?.extraRooms) ? building.artMeta.extraRooms : [];
  for (const storedRoom of storedRooms) {
    const tiles = uniqueIntegerTiles(storedRoom?.tiles);
    const id = String(storedRoom?.id || `room-${rooms.length + 1}`).slice(0, 80);
    if (!tiles.length || !tilesAreConnected(tiles)) continue;
    if (tiles.some((tile) => tileKeys.has(tileKey(tile.x, tile.y)))) continue;

    const room = {
      id,
      name: String(storedRoom?.name || `Room ${rooms.length + 1}`).slice(0, 80),
      tiles,
      tileKeys: new Set(tiles.map((tile) => tileKey(tile.x, tile.y)))
    };
    const door = chooseInteriorDoorForRoom(room, roomIdByTile);
    if (!door) continue;

    rooms.push(room);
    interiorDoors.push(door);
    interiorDoorKeys.add(door.edgeKey);
    for (const tile of tiles) {
      const key = tileKey(tile.x, tile.y);
      tileKeys.add(key);
      roomIdByTile.set(key, room.id);
    }
  }

  const allTiles = [...tileKeys].map(keyToTile);
  const door = chooseRoomDoor(baseTiles, baseKeys);
  const worldTile = baseTiles.find((tile) => tile.x === door.x && tile.y === door.y) || baseTiles[0];
  const worldEdge = roomEdgeMidpoint({ x: worldTile.worldX, y: worldTile.worldY }, door.side);

  return {
    rooms,
    tiles: allTiles,
    tileKeys,
    roomIdByTile,
    interiorDoors,
    interiorDoorKeys,
    width: Math.max(...allTiles.map((tile) => tile.x)) - Math.min(...allTiles.map((tile) => tile.x)) + 1,
    height: Math.max(...allTiles.map((tile) => tile.y)) - Math.min(...allTiles.map((tile) => tile.y)) + 1,
    door: {
      ...door,
      worldX: worldTile.worldX,
      worldY: worldTile.worldY,
      worldEdgeX: worldEdge.x,
      worldEdgeY: worldEdge.y
    }
  };
}

function createRoomForBuilding(building, previousWorldPosition = null) {
  const layout = roomLayoutForBuilding(building);

  return {
    active: true,
    buildingId: building.id,
    building,
    rooms: layout.rooms,
    tiles: layout.tiles,
    tileKeys: layout.tileKeys,
    roomIdByTile: layout.roomIdByTile,
    interiorDoors: layout.interiorDoors,
    interiorDoorKeys: layout.interiorDoorKeys,
    width: layout.width,
    height: layout.height,
    door: layout.door,
    previousWorldPosition
  };
}

function restoreSavedRoom(position) {
  const building = buildings.find((item) => item.id === position.roomBuildingId);
  if (!building || !isBoardBuilding(building)) return;

  const previousWorldPosition = Number.isFinite(position.previousWorldPosition?.x) && Number.isFinite(position.previousWorldPosition?.y)
    ? position.previousWorldPosition
    : { x: START_X, y: START_Y, facing: 1 };
  state.room = createRoomForBuilding(building, previousWorldPosition);

  if (Number.isFinite(position.x) && Number.isFinite(position.y)) {
    state.player.x = position.x;
    state.player.y = position.y;
  } else {
    movePlayerToRoomDoor();
  }
  state.player.facing = position.facing || state.player.facing;
  state.player.z = 0;
  state.player.vz = 0;
}

function movePlayerToRoomDoor() {
  const door = state.room.door;
  const pos = playerPositionForFeet(door.x + 0.5, door.y + 0.5);
  state.player.x = pos.x;
  state.player.y = pos.y;
  state.player.vx = 0;
  state.player.vy = 0;
  state.player.z = 0;
  state.player.vz = 0;
}

function enterBuilding(building) {
  if (!isBoardBuilding(building)) {
    selectBuilding(building);
    return;
  }

  const previousWorldPosition = {
    x: state.player.x,
    y: state.player.y,
    facing: state.player.facing
  };
  state.room = createRoomForBuilding(building, previousWorldPosition);
  clearSelection();
  keys.clear();
  movePlayerToRoomDoor();
  state.bubbleText = "Inside.";
  state.bubbleUntil = performance.now() + 1600;
  scheduleWorldSave();
}

function leaveRoom() {
  const room = state.room;
  if (!room.active || !room.door) return;

  const door = room.door;
  const outward = roomOutwardVector(door.side);
  const exitFeet = {
    x: door.worldEdgeX + outward.x * 0.78,
    y: door.worldEdgeY + outward.y * 0.78
  };
  const fallback = room.previousWorldPosition || { x: START_X, y: START_Y, facing: state.player.facing };
  const target = playerPositionForFeet(exitFeet.x, exitFeet.y);

  state.room = {
    active: false,
    buildingId: null,
    building: null,
    rooms: [],
    tiles: [],
    tileKeys: new Set(),
    roomIdByTile: new Map(),
    interiorDoors: [],
    interiorDoorKeys: new Set(),
    width: 0,
    height: 0,
    door: null,
    previousWorldPosition: null
  };
  state.player.x = target.x;
  state.player.y = target.y;
  state.player.vx = 0;
  state.player.vy = 0;
  state.player.z = 0;
  state.player.vz = 0;

  if (!canOccupy(state.player.x, state.player.y, fallback.x, fallback.y)) {
    state.player.x = fallback.x;
    state.player.y = fallback.y;
  }

  state.bubbleText = "Back outside.";
  state.bubbleUntil = performance.now() + 1600;
  scheduleWorldSave();
}

function roomInteriorWallBlocksMovement(fromX, fromY, toX, toY) {
  if (!state.room.active || !state.room.interiorDoors.length) return false;
  const fromFeet = playerFootCenter(fromX, fromY);
  const toFeet = playerFootCenter(toX, toY);
  const fromTile = { x: Math.floor(fromFeet.x), y: Math.floor(fromFeet.y) };
  const toTile = { x: Math.floor(toFeet.x), y: Math.floor(toFeet.y) };
  if (fromTile.x === toTile.x && fromTile.y === toTile.y) return false;

  const fromRoomId = state.room.roomIdByTile.get(tileKey(fromTile.x, fromTile.y));
  const toRoomId = state.room.roomIdByTile.get(tileKey(toTile.x, toTile.y));
  if (!fromRoomId || !toRoomId || fromRoomId === toRoomId) return false;

  const edgeKey = roomWallEdgeKeyBetween(fromTile.x, fromTile.y, toTile.x, toTile.y);
  if (edgeKey) return !roomInteriorDoorAllowsCrossing(edgeKey, fromFeet, toFeet);

  const horizontalStep = toTile.x === fromTile.x ? null : { x: fromTile.x + Math.sign(toTile.x - fromTile.x), y: fromTile.y };
  const verticalStep = toTile.y === fromTile.y ? null : { x: fromTile.x, y: fromTile.y + Math.sign(toTile.y - fromTile.y) };
  return [horizontalStep, verticalStep].filter(Boolean).some((step) => {
    const key = roomWallEdgeKeyBetween(fromTile.x, fromTile.y, step.x, step.y);
    const stepRoomId = state.room.roomIdByTile.get(tileKey(step.x, step.y));
    return key && stepRoomId && stepRoomId !== fromRoomId && !roomInteriorDoorAllowsCrossing(key, fromFeet, toFeet);
  });
}

function roomCanOccupy(playerX, playerY, fromX = state.player.x, fromY = state.player.y) {
  if (!state.room.active) return true;
  const feet = playerFootCenter(playerX, playerY);
  const samples = [
    [0, 0],
    [PLAYER_RADIUS, 0],
    [-PLAYER_RADIUS, 0],
    [0, PLAYER_RADIUS],
    [0, -PLAYER_RADIUS],
    [PLAYER_RADIUS * 0.7, PLAYER_RADIUS * 0.7],
    [-PLAYER_RADIUS * 0.7, PLAYER_RADIUS * 0.7],
    [PLAYER_RADIUS * 0.7, -PLAYER_RADIUS * 0.7],
    [-PLAYER_RADIUS * 0.7, -PLAYER_RADIUS * 0.7]
  ];

  return samples.every(([dx, dy]) => state.room.tileKeys.has(tileKey(Math.floor(feet.x + dx), Math.floor(feet.y + dy))))
    && !roomInteriorWallBlocksMovement(fromX, fromY, playerX, playerY);
}

function buildingActionAnchor(building) {
  const room = createRoomForBuilding(building);
  const pos = tileCenterScreen(room.door.worldX, room.door.worldY);
  return { x: pos.x, y: pos.y - 38 };
}

function roomDoorScreenPoint() {
  const door = state.room.door;
  if (!door) return null;
  const edge = screenFromWorld(door.edgeX, door.edgeY, 0);
  return { x: edge.x, y: edge.y - 24 };
}

function roomDoorAtScreenPoint(screenX, screenY) {
  if (!state.room.active) return false;
  const pos = roomDoorScreenPoint();
  if (!pos) return false;
  const dx = Math.abs(screenX - pos.x);
  const dy = screenY - pos.y;
  return dx <= 34 && dy >= -38 && dy <= 34;
}

function drawBuilding(building) {
  const image = ensureBuildingImage(building);
  if (!image.complete) return;

  const bounds = buildingBounds(building);
  ctx.save();
  const age = performance.now() - building.createdAt;
  if (age < 450) ctx.globalAlpha = Math.max(0.1, age / 450);
  ctx.drawImage(image, bounds.x, bounds.y, bounds.width, bounds.height);
  ctx.restore();
}

function roomFloorPalette() {
  const costs = state.room.building?.materialCosts || {};
  const material = Object.entries(costs).sort((a, b) => (b[1] || 0) - (a[1] || 0))[0]?.[0] || "wood";
  if (material === "stone") return { light: "#8c9692", dark: "#6f7975", line: "rgba(38, 47, 43, 0.32)" };
  if (material === "sand") return { light: "#c4a869", dark: "#a58b57", line: "rgba(78, 58, 34, 0.24)" };
  if (material === "grass") return { light: "#5f9a61", dark: "#477b4b", line: "rgba(24, 56, 31, 0.26)" };
  return { light: "#a66a3c", dark: "#80502f", line: "rgba(61, 32, 18, 0.32)" };
}

function drawRoom() {
  ctx.clearRect(0, 0, state.width, state.height);
  ctx.fillStyle = "#1e211d";
  ctx.fillRect(0, 0, state.width, state.height);

  const p = state.player;
  const targetCameraX = state.width / 2 - (p.x - p.y) * (TILE_W / 2);
  const targetCameraY = state.height * 0.56 - (p.x + p.y + 1) * (TILE_H / 2);
  state.cameraX += (targetCameraX - state.cameraX) * 0.16;
  state.cameraY += (targetCameraY - state.cameraY) * 0.16;

  const palette = roomFloorPalette();
  const drawables = [];

  for (const tile of state.room.tiles) {
    drawRoomFloorTile(tile, palette);
    drawables.push({ sort: tile.x + tile.y + 0.18, kind: "roomWalls", tile });
  }

  for (const tile of roomSelectionPreviewTiles()) {
    drawRoomSelectionOverlay(tile);
  }

  for (const door of state.room.interiorDoors) {
    drawables.push({ sort: door.edgeX + door.edgeY + 0.34, kind: "roomInteriorDoor", door });
  }
  drawables.push({ sort: (state.room.door?.x || 0) + (state.room.door?.y || 0) + 0.35, kind: "roomDoor" });
  drawables.push({ sort: playerDepth(), kind: "player" });
  drawables.sort((a, b) => a.sort - b.sort);

  for (const item of drawables) {
    if (item.kind === "roomWalls") drawRoomBoundaryWalls(item.tile);
    if (item.kind === "roomInteriorDoor") drawRoomInteriorDoor(item.door);
    if (item.kind === "roomDoor") drawRoomDoor();
    if (item.kind === "player") drawPlayer();
  }

  drawRoomActionOverlay();
}

function drawRoomFloorTile(tile, palette) {
  const pos = tileCenterScreen(tile.x, tile.y);
  const shade = hash2(tile.x, tile.y, state.room.buildingId?.length || 3);
  drawIsoDiamond(pos.x, pos.y, shade > 0.48 ? palette.light : palette.dark, "rgba(255, 241, 204, 0.12)");

  ctx.save();
  ctx.strokeStyle = palette.line;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pos.x - 24, pos.y + 2);
  ctx.lineTo(pos.x + 4, pos.y - 11);
  ctx.moveTo(pos.x - 5, pos.y + 11);
  ctx.lineTo(pos.x + 24, pos.y - 2);
  ctx.stroke();
  ctx.restore();
}

function roomSelectionPreviewTiles() {
  if (!state.room.active) return [];
  const tiles = new Map();
  for (const tile of selectedTiles()) tiles.set(tileKey(tile.x, tile.y), tile);
  const hover = state.selection.hover;
  if (hover && !state.room.tileKeys.has(tileKey(hover.x, hover.y))) {
    tiles.set(tileKey(hover.x, hover.y), hover);
  }
  return [...tiles.values()];
}

function drawRoomSelectionOverlay(tile) {
  const selected = isSelectedTile(tile.x, tile.y);
  const hover = state.selection.hover && state.selection.hover.x === tile.x && state.selection.hover.y === tile.y;
  if (!selected && !hover) return;

  const pos = tileCenterScreen(tile.x, tile.y);
  const validHover = hover && (state.selection.active ? canSelectNewRoomTile(tile) : canStartRoomSelection(tile));
  const fill = selected ? "rgba(78, 190, 143, 0.28)" : validHover ? "rgba(255, 255, 255, 0.12)" : "rgba(226, 88, 71, 0.18)";
  const stroke = selected ? "rgba(170, 255, 215, 0.9)" : validHover ? "rgba(255, 255, 255, 0.45)" : "rgba(255, 126, 106, 0.75)";
  drawIsoDiamond(pos.x, pos.y, fill, stroke);
  if (selected) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function drawRoomBoundaryWalls(tile) {
  const key = tileKey(tile.x, tile.y);
  const roomId = state.room.roomIdByTile.get(key);
  const neighbors = [
    { side: "north", dx: 0, dy: -1 },
    { side: "east", dx: 1, dy: 0 },
    { side: "south", dx: 0, dy: 1 },
    { side: "west", dx: -1, dy: 0 }
  ];

  for (const neighbor of neighbors) {
    const neighborKey = tileKey(tile.x + neighbor.dx, tile.y + neighbor.dy);
    if (!state.room.tileKeys.has(neighborKey)) {
      drawRoomWallEdge(tile, neighbor.side);
      continue;
    }

    if (state.room.roomIdByTile.get(neighborKey) === roomId) continue;
    if (neighbor.side === "north" || neighbor.side === "west") continue;
    drawRoomWallEdge(tile, neighbor.side);
  }
}

function roomDoorSegment(door, halfWidth = ROOM_DOOR_VISUAL_HALF_WIDTH) {
  if (!door) return null;
  if (door.side === "east" || door.side === "west") {
    return {
      start: { x: door.edgeX, y: door.edgeY - halfWidth },
      end: { x: door.edgeX, y: door.edgeY + halfWidth }
    };
  }
  return {
    start: { x: door.edgeX - halfWidth, y: door.edgeY },
    end: { x: door.edgeX + halfWidth, y: door.edgeY }
  };
}

function drawRoomWallPanel(a, b, side, alpha = 1) {
  const topA = { x: a.x, y: a.y - 34 };
  const topB = { x: b.x, y: b.y - 34 };

  ctx.save();
  ctx.fillStyle = side === "north" || side === "west" ? "#6f5c4a" : "#5d4c3f";
  ctx.strokeStyle = "rgba(36, 26, 19, 0.45)";
  ctx.lineWidth = 1;
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.lineTo(topB.x, topB.y);
  ctx.lineTo(topA.x, topA.y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = "rgba(255, 235, 184, 0.2)";
  ctx.lineWidth = 2;
  drawScreenLine(topA.x, topA.y, topB.x, topB.y);
  ctx.restore();
}

function drawRoomWallEdge(tile, side) {
  const corners = {
    north: [[tile.x, tile.y], [tile.x + 1, tile.y]],
    east: [[tile.x + 1, tile.y], [tile.x + 1, tile.y + 1]],
    south: [[tile.x, tile.y + 1], [tile.x + 1, tile.y + 1]],
    west: [[tile.x, tile.y], [tile.x, tile.y + 1]]
  }[side];
  const a = screenFromWorld(corners[0][0], corners[0][1], 0);
  const b = screenFromWorld(corners[1][0], corners[1][1], 0);
  const isExteriorDoorEdge = state.room.door?.x === tile.x && state.room.door?.y === tile.y && state.room.door?.side === side;
  const isInteriorDoorEdge = state.room.interiorDoorKeys?.has(roomWallEdgeKey(tile.x, tile.y, side));
  const door = isInteriorDoorEdge ? roomInteriorDoorForEdge(roomWallEdgeKey(tile.x, tile.y, side)) : isExteriorDoorEdge ? state.room.door : null;

  if (!door) {
    drawRoomWallPanel(a, b, side);
    return;
  }

  const segment = roomDoorSegment(door);
  const gapA = screenFromWorld(segment.start.x, segment.start.y, 0);
  const gapB = screenFromWorld(segment.end.x, segment.end.y, 0);
  drawRoomWallPanel(a, gapA, side);
  drawRoomWallPanel(gapB, b, side);
}

function drawRoomDoor() {
  const door = state.room.door;
  if (!door) return;
  const hovered = roomDoorAtScreenPoint(state.materialTool.pointer?.x ?? -9999, state.materialTool.pointer?.y ?? -9999);
  drawRoomDoorPanel(door, { open: true, lit: true, highlighted: hovered });
}

function drawRoomInteriorDoor(door) {
  if (!door) return;
  drawRoomDoorPanel(door);
}

function drawRoomDoorPanel(door, options = {}) {
  const segment = roomDoorSegment(door);
  const baseA = screenFromWorld(segment.start.x, segment.start.y, 0);
  const baseB = screenFromWorld(segment.end.x, segment.end.y, 0);
  const topA = { x: baseA.x, y: baseA.y - 32 };
  const topB = { x: baseB.x, y: baseB.y - 32 };
  const center = screenFromWorld(door.edgeX, door.edgeY, 0);
  const open = Boolean(options.open);

  ctx.save();
  if (options.highlighted) {
    ctx.shadowColor = "rgba(246, 206, 117, 0.86)";
    ctx.shadowBlur = 18;
  }

  if (options.lit) drawRoomDoorLight(baseA, baseB, topA, topB, center);
  drawRoomDoorFrame(baseA, baseB, topA, topB);
  if (open) {
    drawOpenRoomDoorPanel(door, baseA, baseB, topA, topB);
  } else {
    drawClosedRoomDoorPanel(door, baseA, baseB, topA, topB, center);
  }
  ctx.restore();
}

function drawRoomDoorLight(baseA, baseB, topA, topB, center) {
  ctx.save();
  ctx.fillStyle = "rgba(255, 219, 130, 0.42)";
  ctx.beginPath();
  ctx.moveTo(baseA.x, baseA.y);
  ctx.lineTo(baseB.x, baseB.y);
  ctx.lineTo(topB.x, topB.y);
  ctx.lineTo(topA.x, topA.y);
  ctx.closePath();
  ctx.fill();

  ctx.shadowColor = "rgba(255, 219, 130, 0.78)";
  ctx.shadowBlur = 18;
  ctx.fillStyle = "rgba(255, 220, 130, 0.36)";
  ctx.beginPath();
  ctx.ellipse(center.x, center.y + 16, 34, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawRoomDoorFrame(baseA, baseB, topA, topB) {
  ctx.save();
  ctx.strokeStyle = "#3c271b";
  ctx.lineWidth = 5;
  drawScreenLine(topA.x, topA.y, topB.x, topB.y);
  drawScreenLine(topA.x, topA.y, baseA.x, baseA.y);
  drawScreenLine(topB.x, topB.y, baseB.x, baseB.y);

  ctx.strokeStyle = "rgba(255, 235, 184, 0.28)";
  ctx.lineWidth = 1.5;
  drawScreenLine(topA.x, topA.y + 2, topB.x, topB.y + 2);
  ctx.restore();
}

function drawClosedRoomDoorPanel(door, baseA, baseB, topA, topB, center) {
  const knobT = door.side === "north" || door.side === "west" ? 0.35 : 0.65;
  const knob = {
    x: baseA.x + (baseB.x - baseA.x) * knobT,
    y: baseA.y + (baseB.y - baseA.y) * knobT - 14
  };

  ctx.save();
  ctx.fillStyle = "#a96d36";
  ctx.strokeStyle = "#4d3121";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(baseA.x, baseA.y);
  ctx.lineTo(baseB.x, baseB.y);
  ctx.lineTo(topB.x, topB.y);
  ctx.lineTo(topA.x, topA.y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "rgba(71, 42, 24, 0.5)";
  ctx.lineWidth = 1.5;
  drawScreenLine(center.x, center.y - 30, center.x, center.y - 3);
  ctx.strokeStyle = "rgba(255, 226, 149, 0.24)";
  drawScreenLine(baseA.x + (baseB.x - baseA.x) * 0.2, baseA.y + (baseB.y - baseA.y) * 0.2 - 7, baseB.x - (baseB.x - baseA.x) * 0.2, baseB.y - (baseB.y - baseA.y) * 0.2 - 7);

  ctx.strokeStyle = "#3c271b";
  ctx.lineWidth = 4;
  drawScreenLine(topA.x, topA.y, topB.x, topB.y);
  drawScreenLine(topA.x, topA.y, baseA.x, baseA.y);
  drawScreenLine(topB.x, topB.y, baseB.x, baseB.y);

  ctx.fillStyle = "#ffe2a2";
  ctx.beginPath();
  ctx.arc(knob.x, knob.y, 2.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawOpenRoomDoorPanel(door, baseA, baseB, topA) {
  const along = { x: baseB.x - baseA.x, y: baseB.y - baseA.y };
  const width = Math.hypot(along.x, along.y) || 1;
  const outward = roomOutwardVector(door.side);
  const outside = screenFromWorld(door.edgeX + outward.x * 0.55, door.edgeY + outward.y * 0.55, 0);
  const center = screenFromWorld(door.edgeX, door.edgeY, 0);
  let swing = { x: outside.x - center.x, y: outside.y - center.y };
  const swingLength = Math.hypot(swing.x, swing.y) || 1;
  swing = {
    x: (swing.x / swingLength) * width * 0.9 + (along.x / width) * width * 0.18,
    y: (swing.y / swingLength) * width * 0.9 + (along.y / width) * width * 0.18
  };

  const hingeBase = baseA;
  const hingeTop = topA;
  const freeBase = { x: hingeBase.x + swing.x, y: hingeBase.y + swing.y };
  const freeTop = { x: hingeTop.x + swing.x, y: hingeTop.y + swing.y };
  const knob = {
    x: hingeBase.x + swing.x * 0.78,
    y: hingeBase.y + swing.y * 0.78 - 14
  };

  ctx.save();
  ctx.fillStyle = "#a96d36";
  ctx.strokeStyle = "#4d3121";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(hingeBase.x, hingeBase.y);
  ctx.lineTo(freeBase.x, freeBase.y);
  ctx.lineTo(freeTop.x, freeTop.y);
  ctx.lineTo(hingeTop.x, hingeTop.y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "rgba(71, 42, 24, 0.5)";
  ctx.lineWidth = 1.5;
  drawScreenLine(
    hingeBase.x + swing.x * 0.5,
    hingeBase.y + swing.y * 0.5 - 29,
    hingeBase.x + swing.x * 0.5,
    hingeBase.y + swing.y * 0.5 - 3
  );
  ctx.strokeStyle = "rgba(255, 226, 149, 0.24)";
  drawScreenLine(
    hingeBase.x + swing.x * 0.18,
    hingeBase.y + swing.y * 0.18 - 7,
    hingeBase.x + swing.x * 0.82,
    hingeBase.y + swing.y * 0.82 - 7
  );

  ctx.strokeStyle = "#3c271b";
  ctx.lineWidth = 4;
  drawScreenLine(hingeTop.x, hingeTop.y, freeTop.x, freeTop.y);
  drawScreenLine(freeTop.x, freeTop.y, freeBase.x, freeBase.y);

  ctx.fillStyle = "#ffe2a2";
  ctx.beginPath();
  ctx.arc(knob.x, knob.y, 2.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawRoomActionOverlay() {
  if (!state.roomAction.active || !state.roomAction.target) return;

  const progress = Math.max(0, Math.min(1, (performance.now() - state.roomAction.start) / state.roomAction.duration));
  const pos = state.roomAction.type === "enter"
    ? buildingActionAnchor(state.roomAction.target)
    : roomDoorScreenPoint();
  if (!pos) return;

  drawCircularActionOverlay(pos.x, pos.y, progress, "#f3d27b");
}

function drawCircularActionOverlay(x, y, progress, color) {
  ctx.save();
  ctx.lineCap = "round";
  ctx.strokeStyle = "rgba(9, 15, 12, 0.42)";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(x, y, 19, -Math.PI / 2, Math.PI * 1.5);
  ctx.stroke();

  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(x, y, 19, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 246, 218, 0.92)";
  ctx.beginPath();
  ctx.moveTo(x - 7, y + 8);
  ctx.lineTo(x - 7, y - 5);
  ctx.quadraticCurveTo(x - 7, y - 13, x, y - 13);
  ctx.quadraticCurveTo(x + 7, y - 13, x + 7, y - 5);
  ctx.lineTo(x + 7, y + 8);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawFenceEdge(edge) {
  if (edge.gate) {
    drawDynamicGate(edge);
    return;
  }

  const selected = state.selection.fenceEdgeId === edge.id;
  const progress = fenceEdgeAnimationProgress(edge);
  const alpha = fenceEdgeAlpha(edge);
  const a = screenFromWorld(edge.ax, edge.ay, 0);
  const b = screenFromWorld(edge.bx, edge.by, 0);
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const start = {
    x: mid.x + (a.x - mid.x) * progress,
    y: mid.y + (a.y - mid.y) * progress
  };
  const end = {
    x: mid.x + (b.x - mid.x) * progress,
    y: mid.y + (b.y - mid.y) * progress
  };

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (selected) {
    ctx.shadowColor = "rgba(255, 246, 197, 0.95)";
    ctx.shadowBlur = 20;
  }

  ctx.strokeStyle = "rgba(32, 21, 13, 0.22)";
  ctx.lineWidth = 8;
  drawScreenLine(start.x, start.y + 7, end.x, end.y + 7);

  if (selected) {
    ctx.strokeStyle = "rgba(255, 248, 207, 0.82)";
    ctx.lineWidth = 8;
    drawScreenLine(start.x, start.y - 10, end.x, end.y - 10);
  }

  ctx.strokeStyle = "#5f3d24";
  ctx.lineWidth = 4;
  drawScreenLine(start.x, start.y - 15, end.x, end.y - 15);
  drawScreenLine(start.x, start.y - 5, end.x, end.y - 5);

  drawFencePost(start.x, start.y, edgeTouchesPurchased(edge), progress);
  drawFencePost(end.x, end.y, edgeTouchesPurchased(edge), progress);
  ctx.restore();
}

function drawDynamicGate(edge) {
  const a = screenFromWorld(edge.ax, edge.ay, 0);
  const b = screenFromWorld(edge.bx, edge.by, 0);
  const x = (a.x + b.x) / 2;
  const y = (a.y + b.y) / 2;
  const selected = state.selection.fenceEdgeId === edge.id;
  const progress = fenceEdgeAnimationProgress(edge);
  const alpha = fenceEdgeAlpha(edge);
  const open = gateOpenAmount(edge);
  const outward = gateOutwardScreenVector(edge);
  const panelLift = open * 4;
  const swing = open * 27;
  const centerGap = 5 + open * 10;
  const leftHinge = { x: a.x, y: a.y };
  const rightHinge = { x: b.x, y: b.y };
  const leftClosed = {
    x: x + (a.x - x) * 0.12 - centerGap / 2,
    y: y + (a.y - y) * 0.12
  };
  const rightClosed = {
    x: x + (b.x - x) * 0.12 + centerGap / 2,
    y: y + (b.y - y) * 0.12
  };
  const leftFree = {
    x: leftClosed.x + outward.x * swing,
    y: leftClosed.y + outward.y * swing - panelLift
  };
  const rightFree = {
    x: rightClosed.x + outward.x * swing,
    y: rightClosed.y + outward.y * swing - panelLift
  };

  ctx.save();
  ctx.globalAlpha = alpha;
  if (selected) {
    ctx.shadowColor = "rgba(255, 246, 197, 0.95)";
    ctx.shadowBlur = 20;

    ctx.strokeStyle = "rgba(255, 248, 207, 0.88)";
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x - 15, y + 11);
    ctx.lineTo(x, y + 19);
    ctx.lineTo(x + 15, y + 11);
    ctx.stroke();
  }

  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  drawGateDoorPanel(leftHinge, leftFree, "left");
  drawGateDoorPanel(rightHinge, rightFree, "right");

  drawFencePost(a.x, a.y, false, progress);
  drawFencePost(b.x, b.y, false, progress);
  ctx.restore();
}

function drawGateDoorPanel(hinge, free, side) {
  const height = GATE_DOOR_HEIGHT;
  const topHinge = { x: hinge.x, y: hinge.y - height };
  const topFree = { x: free.x, y: free.y - height };

  ctx.fillStyle = "#8b562e";
  ctx.strokeStyle = "#4c2f1d";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(hinge.x, hinge.y + 1);
  ctx.lineTo(free.x, free.y + 1);
  ctx.lineTo(topFree.x, topFree.y);
  ctx.lineTo(topHinge.x, topHinge.y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "#5f3d24";
  ctx.lineWidth = 4;
  drawScreenLine(topHinge.x, topHinge.y + 7, topFree.x, topFree.y + 7);
  drawScreenLine(hinge.x, hinge.y - 8, free.x, free.y - 8);

  ctx.strokeStyle = "rgba(255, 226, 149, 0.22)";
  ctx.lineWidth = 2;
  drawScreenLine(topHinge.x, topHinge.y + 3, topFree.x, topFree.y + 3);

  ctx.strokeStyle = "#6f4426";
  ctx.lineWidth = 2;
  const thirds = [0.36, 0.68];
  for (const t of thirds) {
    const bottom = {
      x: hinge.x + (free.x - hinge.x) * t,
      y: hinge.y + (free.y - hinge.y) * t
    };
    drawScreenLine(bottom.x, bottom.y, bottom.x, bottom.y - height + 2);
  }

  ctx.strokeStyle = "#3f2819";
  ctx.lineWidth = 3;
  if (side === "left") {
    drawScreenLine(topHinge.x, topHinge.y + 11, free.x, free.y - 5);
  } else {
    drawScreenLine(hinge.x, hinge.y - 5, topFree.x, topFree.y + 11);
  }
}

function gateOpenAmount(edge) {
  const feet = playerFootCenter();
  const midX = (edge.ax + edge.bx) / 2;
  const midY = (edge.ay + edge.by) / 2;
  const distance = Math.hypot(feet.x - midX, feet.y - midY);
  const t = (GATE_OPEN_DISTANCE - distance) / (GATE_OPEN_DISTANCE - GATE_FULL_OPEN_DISTANCE);
  return smoothstep(Math.max(0, Math.min(1, t)));
}

function gateOutwardScreenVector(edge) {
  const outward =
    edge.side === "north" ? { x: 0, y: -1 } :
    edge.side === "east" ? { x: 1, y: 0 } :
    edge.side === "south" ? { x: 0, y: 1 } :
    { x: -1, y: 0 };
  const midX = (edge.ax + edge.bx) / 2;
  const midY = (edge.ay + edge.by) / 2;
  const center = screenFromWorld(midX, midY, 0);
  const outside = screenFromWorld(midX + outward.x, midY + outward.y, 0);
  const dx = outside.x - center.x;
  const dy = outside.y - center.y;
  const length = Math.hypot(dx, dy) || 1;
  return { x: dx / length, y: dy / length };
}

function drawFencePost(x, y, fresh, progress) {
  const height = fresh ? 34 : 28;
  const width = fresh ? 7 : 5;
  const yScale = Math.max(0.2, progress);

  ctx.strokeStyle = fresh ? "#9b6839" : "#8a5d35";
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x, y + 4);
  ctx.lineTo(x, y + 4 - height * yScale);
  ctx.stroke();

  ctx.fillStyle = fresh ? "#c08a4a" : "#a7753f";
  ctx.beginPath();
  ctx.moveTo(x - width, y + 4 - height * yScale);
  ctx.lineTo(x, y - 5 - height * yScale);
  ctx.lineTo(x + width, y + 4 - height * yScale);
  ctx.closePath();
  ctx.fill();
}

function drawScreenLine(ax, ay, bx, by) {
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(bx, by);
  ctx.stroke();
}

function edgeTouchesPurchased(edge) {
  return purchasedPlots.has(`${edge.tileX},${edge.tileY}`);
}

function fenceEdgeAnimationProgress(edge) {
  if (edge.fading) {
    const remaining = Math.max(0, state.fenceAnimationUntil - performance.now());
    if (!remaining) return 0;
    return Math.max(0.05, remaining / 900);
  }
  if (!edgeTouchesPurchased(edge)) return 1;
  const remaining = Math.max(0, state.fenceAnimationUntil - performance.now());
  if (!remaining) return 1;
  const t = 1 - remaining / 900;
  return Math.max(0.12, easeOutCubic(t));
}

function fenceEdgeAlpha(edge) {
  if (!edge.fading) return 1;
  return Math.max(0, Math.min(1, fenceEdgeAnimationProgress(edge)));
}

function easeOutCubic(t) {
  const clamped = Math.max(0, Math.min(1, t));
  return 1 - Math.pow(1 - clamped, 3);
}

function drawFeature(tile) {
  const pos = tileCenterScreen(tile.x, tile.y);
  const harvest = currentHarvestForTile(tile.x, tile.y);

  if (harvest) {
    const shake = Math.sin(performance.now() * (tile.feature === "tree" ? 0.05 : 0.08)) * (tile.feature === "tree" ? 2.5 : 1.3);
    ctx.save();
    ctx.translate(shake, 0);
  }

  if (tile.feature === "tree") {
    const tall = 43 + hash2(tile.x, tile.y, 60) * 18;
    ctx.fillStyle = "rgba(11, 23, 16, 0.22)";
    ctx.beginPath();
    ctx.ellipse(pos.x + 3, pos.y + 12, 18, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#6a4526";
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y + 4);
    ctx.lineTo(pos.x, pos.y - tall + 20);
    ctx.stroke();

    const leaf = tile.type === "forest" ? "#1f693d" : "#287843";
    ctx.fillStyle = leaf;
    drawLeafCluster(pos.x, pos.y - tall + 8, 25, "#225f39", leaf);
    drawLeafCluster(pos.x - 13, pos.y - tall + 21, 20, "#2f8045", leaf);
    drawLeafCluster(pos.x + 13, pos.y - tall + 23, 19, "#1c5d36", leaf);
  }

  if (tile.feature === "rock") {
    ctx.fillStyle = "rgba(14, 19, 17, 0.22)";
    ctx.beginPath();
    ctx.ellipse(pos.x + 2, pos.y + 11, 17, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#8f9288";
    ctx.beginPath();
    ctx.moveTo(pos.x - 16, pos.y + 4);
    ctx.lineTo(pos.x - 7, pos.y - 11);
    ctx.lineTo(pos.x + 9, pos.y - 15);
    ctx.lineTo(pos.x + 18, pos.y - 2);
    ctx.lineTo(pos.x + 9, pos.y + 10);
    ctx.lineTo(pos.x - 10, pos.y + 12);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.beginPath();
    ctx.moveTo(pos.x - 7, pos.y - 9);
    ctx.lineTo(pos.x + 8, pos.y - 13);
    ctx.lineTo(pos.x + 1, pos.y - 2);
    ctx.closePath();
    ctx.fill();
  }

  if (tile.feature === "sapling") {
    ctx.fillStyle = "rgba(11, 23, 16, 0.18)";
    ctx.beginPath();
    ctx.ellipse(pos.x + 1, pos.y + 10, 11, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#7a4a28";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y + 7);
    ctx.lineTo(pos.x, pos.y - 12);
    ctx.stroke();

    ctx.fillStyle = "#2f8045";
    ctx.beginPath();
    ctx.ellipse(pos.x - 6, pos.y - 8, 8, 5, -0.5, 0, Math.PI * 2);
    ctx.ellipse(pos.x + 6, pos.y - 11, 8, 5, 0.45, 0, Math.PI * 2);
    ctx.fill();
  }

  if (tile.feature === "flower") {
    const colors = ["#e8cf5f", "#e78373", "#d9efff"];
    ctx.fillStyle = colors[Math.floor(hash2(tile.x, tile.y, 129) * colors.length)];
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      ctx.beginPath();
      ctx.ellipse(pos.x + Math.cos(angle) * 5, pos.y - 3 + Math.sin(angle) * 3, 3.2, 2.2, angle, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#f5e7a0";
    ctx.beginPath();
    ctx.arc(pos.x, pos.y - 3, 2.4, 0, Math.PI * 2);
    ctx.fill();
  }

  if (harvest) {
    ctx.restore();
    drawHarvestOverlay(tile, pos, harvest);
  }
}

function animalScreenPosition(animal, now = performance.now()) {
  const pos = tileCenterScreen(animal.x, animal.y);
  const t = now * 0.001 + animal.phase;
  const wanderX = animal.type === "bee" ? Math.sin(t * 1.8) * 6 : 0;
  const wanderY = animal.type === "bee" ? Math.cos(t * 1.45) * 5 - 15 : 0;
  return { x: pos.x + wanderX, y: pos.y + wanderY };
}

function animalDepth(animal) {
  return animal.x + animal.y + 0.46;
}

function animalFacing(animal, now = performance.now()) {
  return animal.facing || (Math.sin(now * 0.00035 + animal.phase) > 0 ? 1 : -1);
}

function drawAnimal(animal) {
  const now = performance.now();
  const pos = animalScreenPosition(animal, now);
  const facing = animalFacing(animal, now);
  const bob = Math.sin(now * (animal.type === "chicken" ? 0.011 : 0.004) + animal.phase);

  if (animal.type === "cow") drawCow(pos.x, pos.y, facing, bob);
  if (animal.type === "sheep") drawSheep(pos.x, pos.y, facing, bob);
  if (animal.type === "chicken") drawChicken(pos.x, pos.y, facing, bob);
  if (animal.type === "bee") drawBeeSwarm(pos.x, pos.y, animal.phase, now);
}

function drawAnimalShadow(x, y, width, height) {
  ctx.fillStyle = "rgba(6, 12, 10, 0.24)";
  ctx.beginPath();
  ctx.ellipse(x, y + 11, width, height, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawCow(x, y, facing, bob) {
  ctx.save();
  drawAnimalShadow(x, y, 22, 7);
  ctx.translate(x, y + bob);
  ctx.scale(facing, 1);

  ctx.fillStyle = "#f4ead8";
  ctx.beginPath();
  ctx.ellipse(0, -18, 23, 13, -0.04, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#3f332c";
  ctx.beginPath();
  ctx.ellipse(-7, -20, 7, 5, 0.25, 0, Math.PI * 2);
  ctx.ellipse(8, -14, 6, 4.5, -0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#5b4536";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-13, -7);
  ctx.lineTo(-13, 1);
  ctx.moveTo(9, -7);
  ctx.lineTo(9, 1);
  ctx.stroke();

  ctx.fillStyle = "#f1e1c9";
  ctx.beginPath();
  ctx.ellipse(23, -22, 11, 9, -0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#d49d92";
  ctx.beginPath();
  ctx.ellipse(27, -18, 7, 4.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#3f332c";
  ctx.beginPath();
  ctx.arc(25, -24, 1.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#f6eddc";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(17, -29);
  ctx.lineTo(13, -34);
  ctx.moveTo(28, -29);
  ctx.lineTo(32, -34);
  ctx.stroke();
  ctx.restore();
}

function drawSheep(x, y, facing, bob) {
  ctx.save();
  drawAnimalShadow(x, y, 18, 6);
  ctx.translate(x, y + bob * 0.6);
  ctx.scale(facing, 1);

  ctx.fillStyle = "#f3eadc";
  const fluffs = [
    [-9, -18, 11], [0, -22, 12], [10, -18, 11],
    [-3, -12, 12], [8, -11, 10], [-13, -12, 8]
  ];
  for (const [fx, fy, radius] of fluffs) {
    ctx.beginPath();
    ctx.arc(fx, fy, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = "#5a5146";
  ctx.lineWidth = 3.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-8, -4);
  ctx.lineTo(-8, 2);
  ctx.moveTo(8, -4);
  ctx.lineTo(8, 2);
  ctx.stroke();

  ctx.fillStyle = "#4d453c";
  ctx.beginPath();
  ctx.ellipse(19, -18, 8, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f7f1e8";
  ctx.beginPath();
  ctx.arc(21, -20, 1.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawChicken(x, y, facing, bob) {
  ctx.save();
  drawAnimalShadow(x, y, 10, 4);
  ctx.translate(x, y + bob * 1.6);
  ctx.scale(facing, 1);

  ctx.strokeStyle = "#d89b37";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-3, -1);
  ctx.lineTo(-3, 5);
  ctx.moveTo(4, -1);
  ctx.lineTo(4, 5);
  ctx.stroke();

  ctx.fillStyle = "#f5f0df";
  ctx.beginPath();
  ctx.ellipse(0, -10, 11, 10, -0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(9, -18, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#d94732";
  ctx.beginPath();
  ctx.arc(7, -25, 2.2, 0, Math.PI * 2);
  ctx.arc(10, -26, 2.2, 0, Math.PI * 2);
  ctx.arc(13, -24, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#e5a63d";
  ctx.beginPath();
  ctx.moveTo(16, -18);
  ctx.lineTo(24, -15);
  ctx.lineTo(16, -13);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#332a22";
  ctx.beginPath();
  ctx.arc(11, -19, 1.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBeeSwarm(x, y, phase, now) {
  ctx.save();
  drawAnimalShadow(x, y + 10, 12, 4);
  for (let i = 0; i < 5; i++) {
    const t = now * 0.004 + phase + i * 1.7;
    const bx = x + Math.cos(t) * (8 + i * 1.4);
    const by = y - 7 + Math.sin(t * 1.3) * (5 + (i % 2) * 2);
    drawBee(bx, by, i % 2 ? -1 : 1);
  }
  ctx.restore();
}

function drawBee(x, y, facing) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);

  ctx.fillStyle = "rgba(246, 250, 255, 0.78)";
  ctx.beginPath();
  ctx.ellipse(-2, -4, 4, 2.4, -0.5, 0, Math.PI * 2);
  ctx.ellipse(2, -4, 4, 2.4, 0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#e6b83a";
  ctx.beginPath();
  ctx.ellipse(0, 0, 6, 3.8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#3d2f1f";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(-2, -3);
  ctx.lineTo(-2, 3);
  ctx.moveTo(2, -3);
  ctx.lineTo(2, 3);
  ctx.stroke();
  ctx.restore();
}

function drawHarvestOverlay(tile, pos, harvest) {
  const progress = Math.max(0, Math.min(1, (performance.now() - harvest.start) / harvest.duration));
  const y = harvest.target?.feature === "fish" ? pos.y - 16 : tile.feature === "tree" ? pos.y - 58 : pos.y - 32;

  ctx.save();
  ctx.lineCap = "round";
  ctx.strokeStyle = "rgba(9, 15, 12, 0.42)";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(pos.x, y, 19, -Math.PI / 2, Math.PI * 1.5);
  ctx.stroke();

  ctx.strokeStyle = harvest.target?.feature === "fish" ? "#9be7ff" : tile.feature === "tree" ? "#f3d27b" : "#cfd7d2";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(pos.x, y, 19, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
  ctx.stroke();

  const swing = Math.sin(performance.now() * 0.018);
  if (harvest.target?.feature === "fish") {
    drawFishingRodTool(pos.x + 5, pos.y - 22, swing);
  } else if (tile.feature === "tree") {
    drawAxeTool(pos.x - 4 + swing * 8, pos.y - 17, -0.85 + swing * 0.55);
  } else {
    drawPickaxeTool(pos.x + 2 + swing * 5, pos.y - 10, -0.65 + swing * 0.42);
  }

  ctx.restore();
}

function drawFishingRodTool(x, y, swing) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.22 + swing * 0.08);
  ctx.lineCap = "round";

  ctx.strokeStyle = "#7c4c29";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-18, 24);
  ctx.quadraticCurveTo(-5, -10, 19, -30);
  ctx.stroke();

  ctx.strokeStyle = "rgba(235, 250, 255, 0.78)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(19, -30);
  ctx.quadraticCurveTo(29, -8, 10, 12);
  ctx.stroke();

  ctx.fillStyle = "#e8c16d";
  ctx.beginPath();
  ctx.ellipse(10, 13, 4, 2.8, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawAxeTool(x, y, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.strokeStyle = "#7c4c29";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, 18);
  ctx.lineTo(0, -18);
  ctx.stroke();

  ctx.fillStyle = "#d6dfdc";
  ctx.strokeStyle = "#748078";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-18, -20);
  ctx.quadraticCurveTo(-5, -30, 11, -21);
  ctx.lineTo(6, -12);
  ctx.quadraticCurveTo(-6, -18, -18, -14);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawPickaxeTool(x, y, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.strokeStyle = "#7c4c29";
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(0, 20);
  ctx.lineTo(0, -18);
  ctx.stroke();

  ctx.strokeStyle = "#cfd7d2";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-19, -18);
  ctx.quadraticCurveTo(0, -28, 21, -17);
  ctx.stroke();

  ctx.strokeStyle = "#7f8a84";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-22, -17);
  ctx.lineTo(-14, -19);
  ctx.moveTo(24, -16);
  ctx.lineTo(15, -19);
  ctx.stroke();
  ctx.restore();
}

function drawLeafCluster(x, y, radius, dark, light) {
  const gradient = ctx.createRadialGradient(x - radius * 0.25, y - radius * 0.3, 2, x, y, radius);
  gradient.addColorStop(0, light);
  gradient.addColorStop(1, dark);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(x, y, radius, radius * 0.78, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawPlayer() {
  drawPlayerAvatar(state.player, state.account, {
    bubbleText: state.bubbleText,
    bubbleUntil: state.bubbleUntil,
    submerged: state.inWater && state.player.z <= WATER_SUBMERGE_Z
  });
}

function drawRemotePlayer(player) {
  drawPlayerAvatar(player, player, {
    bubbleText: player.bubbleText,
    bubbleUntil: player.bubbleUntil,
    submerged: isPlayerInWater(player.x, player.y, player.z || 0)
  });
}

function drawPlayerAvatar(p, profile, options = {}) {
  const z = Number.isFinite(p.z) ? p.z : 0;
  const pos = screenFromWorld(p.x + 0.5, p.y + 0.5, z);
  const ground = screenFromWorld(p.x + 0.5, p.y + 0.5, 0);
  const lean = Math.max(-1, Math.min(1, (p.vx - p.vy) * 2));
  const t = performance.now() * 0.012;
  const stride = Math.sin(t) * Math.min(1, Math.hypot(p.vx, p.vy) * 4);
  const submerged = Boolean(options.submerged);

  ctx.fillStyle = submerged ? "rgba(11, 34, 48, 0.22)" : "rgba(6, 12, 10, 0.32)";
  ctx.beginPath();
  ctx.ellipse(ground.x, ground.y + 15, 17 + z * 0.035, 7 + z * 0.018, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(pos.x, pos.y);
  ctx.rotate(lean * 0.04);
  if (submerged) {
    ctx.beginPath();
    ctx.rect(-42, -74, 84, 84);
    ctx.clip();
  }

  ctx.strokeStyle = "#263d3e";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-4, 9);
  ctx.lineTo(-8 - stride * 4, 23);
  ctx.moveTo(5, 9);
  ctx.lineTo(8 + stride * 4, 23);
  ctx.stroke();

  ctx.fillStyle = profile.color || "#385f71";
  roundRect(-12, -15, 24, 28, 7);
  ctx.fill();

  ctx.fillStyle = "#d9a46d";
  ctx.beginPath();
  ctx.arc(0, -25, 11, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#2a2520";
  ctx.beginPath();
  ctx.ellipse(0, -31, 12, 7, 0, Math.PI, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#d9a46d";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-10, -8);
  ctx.lineTo(-18, 1 + stride * 2);
  ctx.moveTo(10, -8);
  ctx.lineTo(18, 1 - stride * 2);
  ctx.stroke();

  ctx.fillStyle = "#f7f2e8";
  ctx.beginPath();
  ctx.arc(4 * p.facing, -26, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  drawPlayerNameplate(pos.x, pos.y - 76, profile.name || "WAi Forward member");

  if (submerged) drawWaterWake(ground.x, ground.y + 10, stride);

  if (options.bubbleText && performance.now() < options.bubbleUntil) {
    drawSpeechBubble(pos.x, pos.y - 55, options.bubbleText);
  }
}

function drawPlayerNameplate(x, y, label = state.account.name || "WAi Forward member") {
  ctx.save();
  ctx.font = "800 12px Inter, system-ui, sans-serif";
  const width = Math.min(190, Math.max(58, ctx.measureText(label).width + 22));
  const bx = Math.max(12, Math.min(state.width - width - 12, x - width / 2));
  ctx.fillStyle = "rgba(18, 21, 20, 0.78)";
  ctx.strokeStyle = "rgba(255, 244, 213, 0.18)";
  ctx.lineWidth = 1;
  roundRect(bx, y, width, 24, 8);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#fff6db";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, bx + width / 2, y + 12, width - 16);
  ctx.restore();
}

function drawWaterWake(x, y, stride) {
  ctx.save();
  ctx.strokeStyle = "rgba(222, 246, 255, 0.72)";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.ellipse(x, y, 20 + Math.abs(stride) * 2, 6, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(71, 142, 183, 0.46)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.ellipse(x, y + 2, 17, 5, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawSpeechBubble(x, y, text) {
  const maxWidth = Math.min(320, state.width - 40);
  ctx.font = "600 15px Inter, system-ui, sans-serif";
  const words = text.trim().split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const attempt = line ? `${line} ${word}` : word;
    if (ctx.measureText(attempt).width > maxWidth - 30 && line) {
      lines.push(line);
      line = word;
    } else {
      line = attempt;
    }
  }
  if (line) lines.push(line);
  const width = Math.min(maxWidth, Math.max(80, ...lines.map((l) => ctx.measureText(l).width + 30)));
  const height = lines.length * 20 + 18;
  const bx = Math.max(12, Math.min(state.width - width - 12, x - width / 2));
  const by = Math.max(72, y - height);

  ctx.fillStyle = "rgba(255, 250, 235, 0.96)";
  ctx.strokeStyle = "rgba(73, 56, 34, 0.22)";
  ctx.lineWidth = 1;
  roundRect(bx, by, width, height, 8);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x - 8, by + height - 1);
  ctx.lineTo(x + 8, by + height - 1);
  ctx.lineTo(x, by + height + 11);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#211a14";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  lines.forEach((l, i) => ctx.fillText(l, bx + 15, by + 10 + i * 20));
}

function roundRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawWorld() {
  if (state.room.active) {
    drawRoom();
    return;
  }

  ctx.clearRect(0, 0, state.width, state.height);
  const captureMode = state.previewCapture;
  const isCapture = Boolean(captureMode);
  const isGenerationCapture = captureMode === "generation";

  const p = state.player;
  const targetCameraX = state.width / 2 - (p.x - p.y) * (TILE_W / 2);
  const targetCameraY = state.height * 0.52 - (p.x + p.y + 1) * (TILE_H / 2);
  state.cameraX += (targetCameraX - state.cameraX) * 0.12;
  state.cameraY += (targetCameraY - state.cameraY) * 0.12;

  const cx = Math.floor(p.x);
  const cy = Math.floor(p.y);
  const drawables = [];

  for (let y = cy - VIEW_RADIUS; y <= cy + VIEW_RADIUS; y++) {
    for (let x = cx - VIEW_RADIUS; x <= cx + VIEW_RADIUS; x++) {
      const tile = terrainAt(x, y);
      const pos = tileCenterScreen(x, y);
      if (pos.x < -TILE_W || pos.x > state.width + TILE_W || pos.y < -120 || pos.y > state.height + 120) continue;
      drawTile(tile);
      if (!isCapture) drawSelectionOverlay(tile);
      const harvest = currentHarvestForTile(x, y);
      if (!isCapture && harvest?.target?.feature === "fish") drawHarvestOverlay(tile, pos, harvest);
      if (tile.feature && !isGenerationCapture) drawables.push({ sort: x + y + 0.4, kind: "feature", tile });
    }
  }

  if (!isGenerationCapture) {
    for (const edge of generateFenceEdges()) {
      const a = screenFromWorld(edge.ax, edge.ay, 0);
      const b = screenFromWorld(edge.bx, edge.by, 0);
      const midX = (a.x + b.x) / 2;
      const midY = (a.y + b.y) / 2;
      if (midX < -TILE_W || midX > state.width + TILE_W || midY < -120 || midY > state.height + 120) continue;
      drawables.push({ sort: edge.sort, kind: "fenceEdge", edge });
    }

    if (!isCapture && performance.now() < state.fenceAnimationUntil) {
      for (const edge of state.fadingFenceEdges) {
        const a = screenFromWorld(edge.ax, edge.ay, 0);
        const b = screenFromWorld(edge.bx, edge.by, 0);
        const midX = (a.x + b.x) / 2;
        const midY = (a.y + b.y) / 2;
        if (midX < -TILE_W || midX > state.width + TILE_W || midY < -120 || midY > state.height + 120) continue;
        drawables.push({ sort: edge.sort + 0.04, kind: "fenceEdge", edge });
      }
    }

    for (const building of buildings) {
      const bounds = screenBoundsForTiles(building.tiles, 64);
      if (bounds.x + bounds.width < -TILE_W || bounds.x > state.width + TILE_W || bounds.y + bounds.height < -120 || bounds.y > state.height + 120) continue;
      drawables.push({ sort: buildingDepth(building), kind: "building", building });
    }

    if (ANIMALS_ENABLED) {
      for (const animal of animals) {
        const pos = animalScreenPosition(animal);
        if (pos.x < -TILE_W || pos.x > state.width + TILE_W || pos.y < -120 || pos.y > state.height + 120) continue;
        drawables.push({ sort: animalDepth(animal), kind: "animal", animal });
      }
    }

    for (const player of remotePlayers.values()) {
      if (player.mode === "room") continue;
      const pos = screenFromWorld(player.x + 0.5, player.y + 0.5, player.z || 0);
      if (pos.x < -TILE_W || pos.x > state.width + TILE_W || pos.y < -120 || pos.y > state.height + 120) continue;
      drawables.push({ sort: playerDepthFor(player), kind: "remotePlayer", player });
    }

    if (!isCapture) drawables.push({ sort: playerDepth(), kind: "player" });
  }
  drawables.sort((a, b) => a.sort - b.sort);
  for (const item of drawables) {
    if (item.kind === "fenceEdge") drawFenceEdge(item.edge);
    if (item.kind === "feature") drawFeature(item.tile);
    if (item.kind === "building") drawBuilding(item.building);
    if (item.kind === "animal") drawAnimal(item.animal);
    if (item.kind === "remotePlayer") drawRemotePlayer(item.player);
    if (item.kind === "player") drawPlayer();
  }

  if (!isCapture) drawRoomActionOverlay();
  if (captureMode === "context") drawEditorBuildSelectionOverlay();
  if (!isCapture) drawMiniCompass();
  if (!isCapture) drawMaterialToolCursor();
}

function drawMiniCompass() {
  const x = state.width - 78;
  const y = state.width <= 620 ? 132 : 82;
  ctx.save();
  ctx.globalAlpha = 0.78;
  ctx.strokeStyle = "#fff1cf";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - 25);
  ctx.lineTo(x + 26, y);
  ctx.lineTo(x, y + 25);
  ctx.lineTo(x - 26, y);
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = "#e8c16d";
  ctx.beginPath();
  ctx.moveTo(x, y - 18);
  ctx.lineTo(x + 8, y);
  ctx.lineTo(x, y + 5);
  ctx.lineTo(x - 8, y);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function update(dt) {
  const now = performance.now();
  updateRoomAction(now);
  updateHarvest(now);
  if (!state.room.active) {
    updateSaplings(now);
    updateAnimals(dt, now);
  }
  updateRemotePlayerMovement(dt, now);
  state.inWater = !state.room.active && isPlayerInWater();

  if (!state.chatActive && !state.harvest.active && !state.roomAction.active) {
    const screenX = (keys.has("d") || keys.has("arrowright") ? 1 : 0) - (keys.has("a") || keys.has("arrowleft") ? 1 : 0);
    const screenY = (keys.has("s") || keys.has("arrowdown") ? 1 : 0) - (keys.has("w") || keys.has("arrowup") ? 1 : 0);
    const len = Math.hypot(screenX, screenY) || 1;
    const moveX = screenX / len;
    const moveY = screenY / len;
    const baseSpeed = keys.has("shift") ? RUN_SCREEN_SPEED : WALK_SCREEN_SPEED;
    const speed = baseSpeed * (state.inWater ? WATER_SPEED_MULTIPLIER : 1);

    if (state.resourceAction.active) {
      const walkedTowardResource = updateResourceActionMovement(speed / TILE_H);
      if (!walkedTowardResource) {
        state.player.vx = 0;
        state.player.vy = 0;
      }
    } else {
      state.player.vx = speed * (moveX / TILE_W + moveY / TILE_H);
      state.player.vy = speed * (-moveX / TILE_W + moveY / TILE_H);
      if (screenX || screenY) state.player.facing = screenX >= 0 ? 1 : -1;
    }
  } else {
    state.player.vx = 0;
    state.player.vy = 0;
  }

  const nextX = state.player.x + state.player.vx * dt;
  const nextY = state.player.y + state.player.vy * dt;
  movePlayer(nextX, nextY);

  const previousZ = state.player.z;
  state.player.vz -= GRAVITY * dt;
  state.player.z += state.player.vz * dt;
  const rockSurface = rockSurfaceUnderPlayer();

  if (rockSurface && state.player.vz <= 0 && previousZ >= rockSurface && state.player.z <= rockSurface) {
    state.player.z = rockSurface;
    state.player.vz = 0;
    state.player.grounded = true;
  } else if (state.player.z <= 0) {
    state.player.z = 0;
    state.player.vz = 0;
    state.player.grounded = true;
  } else {
    state.player.grounded = false;
  }

  updateHomeXp(dt);
  updateHud();
  maybeSyncPlayerPosition(now);
  maybeRefreshLiveWorld(now);
  maybeRefreshSharedWorld(now);
}

function updateRemotePlayerMovement(dt, now = performance.now()) {
  const smoothing = Math.min(1, dt * 8);
  for (const [userId, player] of remotePlayers) {
    if (now - (player.lastSeenAt || 0) > REMOTE_PLAYER_STALE_MS) {
      remotePlayers.delete(userId);
      continue;
    }
    const previousX = player.x;
    const previousY = player.y;
    player.x += (player.targetX - player.x) * smoothing;
    player.y += (player.targetY - player.y) * smoothing;
    player.z += ((player.targetZ || 0) - (player.z || 0)) * smoothing;
    player.vx = (player.x - previousX) / Math.max(dt, 0.001);
    player.vy = (player.y - previousY) / Math.max(dt, 0.001);
    if (Math.abs(player.vx - player.vy) > 0.005) player.facing = player.vx - player.vy >= 0 ? 1 : -1;
  }
}

function movePlayer(nextX, nextY) {
  const startX = state.player.x;
  const startY = state.player.y;
  let movedX = false;
  let movedY = false;

  if (canOccupy(nextX, startY, startX, startY)) {
    state.player.x = nextX;
    movedX = true;
  }

  if (canOccupy(state.player.x, nextY, state.player.x, startY)) {
    state.player.y = nextY;
    movedY = true;
  }

  if (!movedX && !movedY && canOccupy(nextX, nextY, startX, startY)) {
    state.player.x = nextX;
    state.player.y = nextY;
    movedX = true;
    movedY = true;
  }

  if (!movedX) state.player.vx = 0;
  if (!movedY) state.player.vy = 0;
}

function updateHomeXp(dt) {
  if (state.room.active) {
    setTextIfChanged(plotEl, "plot", "Room");
    return;
  }

  const feet = playerFootCenter();
  const tileX = Math.floor(feet.x);
  const tileY = Math.floor(feet.y);
  const plotLabel = isOwnHomeTile(tileX, tileY)
    ? "Home"
    : isHomeTile(tileX, tileY) ? "Base" : "Wild";
  setTextIfChanged(plotEl, "plot", plotLabel);
}

function setTextIfChanged(element, cacheKey, value) {
  const text = String(value);
  if (hudDisplayCache[cacheKey] === text) return;
  element.textContent = text;
  hudDisplayCache[cacheKey] = text;
}

function setAccountColorIfChanged(color) {
  if (hudDisplayCache.accountColor === color) return;
  accountAvatarEl.style.setProperty("--account-color", color);
  hudDisplayCache.accountColor = color;
}

function updateDashboardAccountUi() {
  if (!dashboardAccount) return;

  const label = state.accountLoading
    ? "WAi Forward account"
    : state.accountOffline
    ? "Account unavailable"
    : "Signed in as";
  const name = state.accountLoading
    ? "Checking session..."
    : state.accountOffline
    ? "Offline"
    : state.account.name || "WAi Forward member";
  const initials = state.accountLoading || state.accountOffline ? "WA" : state.account.initials || "WA";
  const color = state.accountLoading || state.accountOffline ? "#385f71" : state.account.color || "#385f71";

  dashboardAccount.classList.toggle("is-loading", state.accountLoading);
  dashboardAccount.classList.toggle("is-offline", state.accountOffline);
  if (dashboardAccountLabel && hudDisplayCache.dashboardAccountLabel !== label) {
    dashboardAccountLabel.textContent = label;
    hudDisplayCache.dashboardAccountLabel = label;
  }
  if (dashboardAccountName && hudDisplayCache.dashboardAccountName !== name) {
    dashboardAccountName.textContent = name;
    hudDisplayCache.dashboardAccountName = name;
  }
  if (dashboardAccountAvatar && hudDisplayCache.dashboardAccountInitials !== initials) {
    dashboardAccountAvatar.textContent = initials;
    hudDisplayCache.dashboardAccountInitials = initials;
  }
  if (dashboardAccountAvatar && hudDisplayCache.dashboardAccountColor !== color) {
    dashboardAccountAvatar.style.setProperty("--account-color", color);
    hudDisplayCache.dashboardAccountColor = color;
  }
}

function updateHud() {
  setTextIfChanged(goldEl, "gold", Math.floor(state.gold));
  setTextIfChanged(playerXpEl, "playerXp", formatPlayerXpProgress());
  setTextIfChanged(homeXpEl, "homeXp", Math.floor(state.homeXp));
  setTextIfChanged(coordinatesEl, "coordinates", formatCurrentCoordinates());
  setTextIfChanged(accountNameEl, "accountName", state.account.name || "WAi Forward member");
  setTextIfChanged(accountAvatarEl, "accountInitials", state.account.initials || "WA");
  setAccountColorIfChanged(state.account.color || "#385f71");
  updateDashboardAccountUi();
}

function nextGoldXpMilestone() {
  const currentXpMilestone = Math.floor(state.playerXp / GOLD_XP_INTERVAL);
  const claimedXpMilestone = Math.floor(state.goldXpMilestone);
  return (Math.max(currentXpMilestone, claimedXpMilestone) + 1) * GOLD_XP_INTERVAL;
}

function formatPlayerXpProgress() {
  return `${Math.floor(state.playerXp)} / ${nextGoldXpMilestone()}`;
}

function formatCurrentCoordinates() {
  const position = state.room.active && state.room.previousWorldPosition
    ? state.room.previousWorldPosition
    : playerFootCenter();
  return `X ${Math.floor(position.x)}, Y ${Math.floor(position.y)}`;
}

async function loadAccount() {
  try {
    const response = await fetch("/api/account", { credentials: "same-origin" });
    if (response.status === 401) {
      window.location.href = "/auth/login";
      return false;
    }
    if (!response.ok) throw new Error(`Account request failed: ${response.status}`);
    const payload = await response.json();
    const user = payload.user || {};
    state.account = {
      id: user.id || null,
      name: user.name || user.email || "WAi Forward member",
      email: user.email || "",
      initials: initialsForName(user.name || user.email || "WA"),
      color: user.color || "#385f71"
    };
    state.accountLoading = false;
    state.accountOffline = false;
    state.bubbleText = `Welcome, ${state.account.name}`;
    state.bubbleUntil = performance.now() + 2600;
    updateHud();
    return true;
  } catch (error) {
    console.warn(error);
    state.accountLoading = false;
    state.accountOffline = true;
    if (accountNameEl) accountNameEl.textContent = "Offline";
    updateDashboardAccountUi();
    return false;
  }
}

function initialsForName(name) {
  const parts = String(name || "")
    .trim()
    .split(/[\s@._-]+/)
    .filter(Boolean);
  if (!parts.length) return "WA";
  return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function containsSwear(message) {
  return SWEAR_WORD_PATTERN.test(message);
}

function messageWords(message) {
  return String(message || "").toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) || [];
}

function normalizeMessageForComparison(message) {
  return messageWords(message).join(" ");
}

function isLikelyRealWord(word) {
  if (COMMON_SHORT_WORDS.has(word)) return true;
  if (word.length < 2) return false;
  if (!/[aeiouy]/i.test(word)) return false;
  if (/(.)\1{3,}/i.test(word)) return false;
  if (/[bcdfghjklmnpqrstvwxyz]{5,}/i.test(word)) return false;
  return true;
}

function hasReasonableWordVariety(words) {
  if (words.length < 4) return false;
  const uniqueWords = new Set(words);
  return uniqueWords.size >= 4 && uniqueWords.size / words.length >= 0.55;
}

function hasMostlyRealWords(words) {
  if (!words.length) return false;
  const realWords = words.filter(isLikelyRealWord).length;
  return realWords / words.length >= 0.7;
}

function usesPunctuationProperly(message) {
  const text = String(message || "").trim();
  if (!text) return false;
  const punctuation = text.match(/[.,!?;:]/g) || [];
  const symbols = text.match(/[^a-z0-9\s'.,!?;:-]/gi) || [];
  if (/[!?.,;:]{4,}/.test(text)) return false;
  if (/\s+[.,!?;:]/.test(text)) return false;
  if (symbols.length > Math.max(2, text.length * 0.08)) return false;
  if (punctuation.length > Math.max(4, text.length * 0.22)) return false;
  return text.length < 80 || /[.!?]$/.test(text) || /[.!?]\s+\w/.test(text);
}

function hasMostlyRepeatedCharacters(message) {
  const compact = String(message || "").toLowerCase().replace(/\s+/g, "");
  if (compact.length < 5) return false;
  const counts = new Map();
  for (const character of compact) counts.set(character, (counts.get(character) || 0) + 1);
  const highestShare = Math.max(...counts.values()) / compact.length;
  return highestShare >= 0.65 || /(.)\1{5,}/i.test(compact);
}

function bigrams(text) {
  const padded = ` ${text} `;
  const values = [];
  for (let index = 0; index < padded.length - 1; index++) values.push(padded.slice(index, index + 2));
  return values;
}

function diceSimilarity(a, b) {
  if (!a || !b) return 0;
  if (a === b) return 1;
  const left = bigrams(a);
  const rightCounts = new Map();
  for (const gram of bigrams(b)) rightCounts.set(gram, (rightCounts.get(gram) || 0) + 1);
  let intersection = 0;
  for (const gram of left) {
    const count = rightCounts.get(gram) || 0;
    if (count <= 0) continue;
    intersection++;
    rightCounts.set(gram, count - 1);
  }
  return (2 * intersection) / (left.length + bigrams(b).length);
}

function tokenSimilarity(leftWords, rightWords) {
  if (!leftWords.length || !rightWords.length) return 0;
  const left = new Set(leftWords);
  const right = new Set(rightWords);
  let shared = 0;
  for (const word of left) if (right.has(word)) shared++;
  return shared / new Set([...left, ...right]).size;
}

function messageSimilarity(message, recent) {
  const normalized = normalizeMessageForComparison(message);
  if (!normalized || !recent?.normalized) return 0;
  return Math.max(
    diceSimilarity(normalized, recent.normalized),
    tokenSimilarity(messageWords(message), recent.words || [])
  );
}

function createMessageHistoryEntry(message, createdAt, xpAwarded = 0) {
  return {
    message,
    normalized: normalizeMessageForComparison(message),
    words: messageWords(message),
    createdAt,
    xpAwarded
  };
}

function rememberChatMessage(message, xpAwarded, now) {
  state.recentChatMessages.push(createMessageHistoryEntry(message, now, xpAwarded));
  state.recentChatMessages = state.recentChatMessages
    .filter((entry) => now - entry.createdAt <= MESSAGE_LOW_QUALITY_WINDOW_MS * 3)
    .slice(-MESSAGE_RECENT_LIMIT);
}

function scoreMessageXp(message, now = Date.now()) {
  const text = String(message || "").trim();
  const words = messageWords(text);
  const normalized = normalizeMessageForComparison(text);
  const recentMessages = state.recentChatMessages.slice(-MESSAGE_RECENT_LIMIT);
  const lastMessage = recentMessages.at(-1);
  const highestSimilarity = recentMessages.reduce((highest, recent) => Math.max(highest, messageSimilarity(text, recent)), 0);
  const recentLowQualityCount = recentMessages.filter((recent) => (
    now - recent.createdAt <= MESSAGE_LOW_QUALITY_WINDOW_MS && recent.xpAwarded <= 1
  )).length;
  const signals = {
    length20: text.length >= 20,
    length80: text.length >= 80,
    words8: words.length >= 8,
    variety: hasReasonableWordVariety(words),
    punctuation: usesPunctuationProperly(text),
    realWords: hasMostlyRealWords(words),
    distinctRecent: highestSimilarity < MESSAGE_SIMILARITY_LIMIT,
    delay: !lastMessage || now - lastMessage.createdAt >= MESSAGE_REASONABLE_DELAY_MS
  };
  const penalties = {
    swearing: containsSwear(text),
    veryShort: text.length < 5 || (words.length <= 1 && text.length <= 12) || LOW_EFFORT_MESSAGE_PATTERN.test(text),
    repeated: Boolean(normalized) && highestSimilarity >= MESSAGE_REPEAT_LIMIT,
    repeatedCharacters: hasMostlyRepeatedCharacters(text),
    gibberish: (!hasMostlyRealWords(words) && words.length >= 3) || (!words.length && text.length >= 5),
    lowQualityBurst: recentLowQualityCount >= MESSAGE_LOW_QUALITY_LIMIT
  };
  const qualityScore = Object.entries(signals).reduce((total, [key, active]) => (
    total + (active ? MESSAGE_QUALITY_XP[key] : 0)
  ), 0);
  const penaltyScore = Object.entries(penalties).reduce((total, [key, active]) => (
    total + (active ? MESSAGE_XP_PENALTIES[key] : 0)
  ), 0);

  return {
    xpAwarded: Math.max(0, qualityScore - penaltyScore),
    qualityScore,
    penaltyScore,
    signals,
    penalties
  };
}

function changePlayerXp(amount) {
  const previousXp = state.playerXp;
  state.playerXp = Math.max(0, state.playerXp + amount);
  if (state.playerXp > previousXp) awardGoldForXpMilestones();
  scheduleWorldSave();
}

function addGold(amount) {
  state.gold = Math.min(CHEAT_MAX_AMOUNT, Math.max(0, state.gold + amount));
  updateHud();
  updateSelectionPanel();
  if (state.editor.active) updateEditorMaterialUi();
  scheduleWorldSave();
}

function applyMessageFeedbackPenalty(messageId, reason = "removed") {
  const message = state.homeMessages.find((entry) => entry.id === messageId);
  if (!message || message.feedbackPenaltyApplied) return 0;
  const extraPenalty = reason === "downvoted" ? 1 : MESSAGE_FEEDBACK_EXTRA_PENALTY;
  const xpAwarded = Math.max(0, Math.floor(numberOr(message.xpAwarded, 0)));
  const penalty = xpAwarded + extraPenalty;
  message.feedbackPenaltyApplied = true;
  changePlayerXp(-penalty);
  state.homeXp = Math.max(0, state.homeXp - xpAwarded);
  scheduleWorldSave();
  return penalty;
}

window.applyMessageFeedbackPenalty = applyMessageFeedbackPenalty;

function awardGoldForXpMilestones() {
  const currentMilestone = Math.floor(state.playerXp / GOLD_XP_INTERVAL);
  if (currentMilestone <= state.goldXpMilestone) return;

  const goldEarned = currentMilestone - state.goldXpMilestone;
  state.goldXpMilestone = currentMilestone;
  state.gold += goldEarned;
  state.bubbleText = `+${goldEarned} gold`;
  state.bubbleUntil = performance.now() + 1600;
}

function gameLoop(now) {
  const dt = Math.min(0.033, (now - state.lastTime) / 1000);
  state.lastTime = now;
  update(dt);
  drawWorld();
  requestAnimationFrame(gameLoop);
}

function openChat() {
  state.chatActive = true;
  chatForm.classList.add("active");
  chatInput.value = "";
  requestAnimationFrame(() => chatInput.focus());
}

function closeChat() {
  state.chatActive = false;
  chatForm.classList.remove("active");
  chatInput.blur();
}

function parseCheatAmount(rawAmount) {
  const amountText = String(rawAmount || "").replace(/,/g, "").trim();
  if (!/^\d+$/.test(amountText)) return null;
  const amount = Number(amountText);
  if (!Number.isSafeInteger(amount) || amount <= 0) return null;
  return Math.min(amount, CHEAT_MAX_AMOUNT);
}

function runCheatCommand(message) {
  const match = /^\/plus-([a-z]+)(?:\s+(.+))?$/i.exec(message);
  if (!match) return false;

  const target = match[1].toLowerCase();
  if (target !== "gold" && !CHEAT_RESOURCE_IDS.has(target)) {
    state.bubbleText = "Unknown cheat command.";
    state.bubbleUntil = performance.now() + 2200;
    return true;
  }

  const amount = parseCheatAmount(match[2]);
  if (!amount) {
    state.bubbleText = `Use /plus-${target} 2000`;
    state.bubbleUntil = performance.now() + 2200;
    return true;
  }

  if (target === "gold") {
    addGold(amount);
    state.bubbleText = `+${amount} gold`;
    state.bubbleUntil = performance.now() + 1800;
    return true;
  }

  addResources({ [target]: amount });
  state.bubbleText = `+${amount} ${materialName(target)}`;
  state.bubbleUntil = performance.now() + 1800;
  return true;
}

function submitChat() {
  const message = chatInput.value.trim();
  if (message) {
    if (runCheatCommand(message)) {
      closeChat();
      return;
    }

    state.bubbleText = message;
    state.bubbleUntil = performance.now() + Math.min(8000, 2400 + message.length * 70);
    const feet = playerFootCenter();
    const now = Date.now();
    const messageXp = scoreMessageXp(message, now);
    const xpGain = messageXp.xpAwarded;
    const insideHome = isOwnHomeTile(Math.floor(feet.x), Math.floor(feet.y));

    if (xpGain > 0) {
      changePlayerXp(xpGain);
    }
    rememberChatMessage(message, xpGain, now);

    if (insideHome && xpGain > 0) {
      state.homeXp += xpGain;
    }

    state.homeMessages.push({
      id: createClientId(),
      authorUserId: state.account.id,
      author: state.account.name || "You",
      authorColor: state.account.color || null,
      message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      createdAt: new Date(now).toISOString(),
      worldPosition: serializePlayerPosition(),
      xpAwarded: xpGain,
      qualityScore: messageXp.qualityScore,
      feedbackPenaltyApplied: false
    });
    if (state.homeMessages.length > 120) state.homeMessages.shift();
    if (state.homeChatOpen) updateHomeChatPanel();
    if (state.forumOpen) updateForumPanel();
    scheduleWorldSave();
  }
  closeChat();
}

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();

  if (state.harvest.active && event.key === "Escape") {
    event.preventDefault();
    cancelHarvest();
    return;
  }

  if (state.roomAction.active && event.key === "Escape") {
    event.preventDefault();
    cancelRoomAction();
    return;
  }

  if (state.resourceAction.active && event.key === "Escape") {
    event.preventDefault();
    cancelResourceAction();
    return;
  }

  if ((state.materialTool.painting || state.materialTool.equipped) && event.key === "Escape") {
    event.preventDefault();
    stopMaterialPainting();
    setEquippedMaterialTool(null);
    return;
  }

  if (deleteConfirmIsOpen()) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeDeleteConfirm();
    }
    return;
  }

  if (boardEditor.classList.contains("active")) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeBoardEditor();
    }
    return;
  }

  if (state.editor.active) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeBuildingEditor();
    }
    return;
  }

  if (state.chatActive) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeChat();
    }
    return;
  }

  if (state.forumOpen) {
    if (event.key === "Escape" || key === "f") {
      event.preventDefault();
      setForumOpen(false);
    }
    return;
  }

  if (state.craftingOpen) {
    if (event.key === "Escape" || key === "c") {
      event.preventDefault();
      setCraftingOpen(false);
    }
    return;
  }

  if (event.key === "Escape" && state.homeChatOpen) {
    event.preventDefault();
    setHomeChatOpen(false);
    return;
  }

  if (event.key === "Escape" && (state.selection.selected.size || selectedFenceEdge())) {
    event.preventDefault();
    clearSelection();
    return;
  }

  if (event.key === "Escape" && selectedBuilding()) {
    event.preventDefault();
    clearSelection();
    return;
  }

  if (key === "shift") {
    updateSelectionModeFromShift(true);
  }

  if (key === "f" && !event.repeat && !event.ctrlKey && !event.metaKey && !event.altKey) {
    event.preventDefault();
    setForumOpen(true);
    return;
  }

  if (key === "c" && !event.repeat && !event.ctrlKey && !event.metaKey && !event.altKey) {
    event.preventDefault();
    setCraftingOpen(true);
    return;
  }

  if (/^[1-5]$/.test(event.key)) {
    event.preventDefault();
    state.activeHotbarSlot = Number(event.key) - 1;
    setEquippedMaterialTool(null);
    updateHotbar();
    updateInventoryPanel();
    scheduleWorldSave();
    return;
  }

  if (event.key === "Enter") {
    event.preventDefault();
    openChat();
    return;
  }

  if ((event.key === " " || key === "spacebar") && state.player.grounded) {
    event.preventDefault();
    state.player.vz = JUMP_VELOCITY;
    state.player.grounded = false;
    return;
  }

  keys.add(key);
});

window.addEventListener("keyup", (event) => {
  const key = event.key.toLowerCase();
  if (key === "shift") updateSelectionModeFromShift(false);
  keys.delete(key);
});

window.addEventListener("blur", () => {
  keys.clear();
  cancelRoomAction();
  cancelResourceAction();
  cancelHarvest();
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  submitChat();
});

chatInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    event.stopPropagation();
    submitChat();
  }
});

canvas.addEventListener("pointerdown", (event) => {
  if (state.chatActive || state.editor.active || state.forumOpen || state.craftingOpen || deleteConfirmIsOpen() || event.button !== 0) return;
  const point = screenPointFromPointer(event);
  state.materialTool.pointer = point;

  if (state.room.active) {
    event.preventDefault();
    if (roomDoorAtScreenPoint(point.x, point.y)) {
      startRoomAction("leave", state.room.door, event);
      return;
    }

    const tile = tileFromPointer(event);
    state.selection.hover = tile;
    if (!canStartRoomSelection(tile)) {
      clearSelection();
      state.bubbleText = "Drag from an interior wall to add a room.";
      state.bubbleUntil = performance.now() + 1600;
      return;
    }

    canvas.setPointerCapture(event.pointerId);
    state.selection.active = true;
    state.selection.mode = event.shiftKey ? "rect" : "paint";
    state.selection.plotType = "room";
    state.selection.building = null;
    state.selection.fenceEdgeId = null;
    state.selection.anchor = tile;
    state.selection.selected.clear();
    state.selection.paintSelected.clear();
    addSelectionTile(tile);
    rememberPaintSelection();
    if (state.selection.mode === "rect") updateRectangleSelection(tile);
    else updateSelectionPanel();
    return;
  }

  const tile = tileFromPointer(event);
  if (state.materialTool.equipped) {
    event.preventDefault();
    clearSelection();
    state.materialTool.painting = true;
    state.materialTool.pointerId = event.pointerId;
    state.materialTool.lastPaintedKey = null;
    state.materialTool.lastPaintedTile = null;
    canvas.setPointerCapture(event.pointerId);
    paintMaterialStroke(tile);
    return;
  }

  const building = buildingAtScreenPoint(point.x, point.y);
  if (building) {
    event.preventDefault();
    if (isBoardBuilding(building)) {
      startRoomAction("enter", building, event);
    } else {
      selectBuilding(building);
    }
    return;
  }

  const fenceEdge = fenceEdgeForTile(tile, point.x, point.y);
  if (fenceEdge) {
    event.preventDefault();
    selectFenceEdge(fenceEdge);
    return;
  }

  if (useActiveItemOnTile(tile)) {
    event.preventDefault();
    return;
  }

  const harvestTarget = harvestTargetFromPointer(event);
  if (harvestTarget) {
    event.preventDefault();
    startResourceAction(harvestTarget, event);
    return;
  }

  if (waterTileFromPointer(event)) {
    event.preventDefault();
    clearSelection();
    state.bubbleText = `Fishing needs at least ${MIN_FISHABLE_WATER_TILES} connected water tiles.`;
    state.bubbleUntil = performance.now() + 1800;
    return;
  }

  state.selection.hover = tile;

  if (!canStartSelection(tile)) {
    clearSelection();
    state.bubbleText = "Select home plots or wild plots touching home.";
    state.bubbleUntil = performance.now() + 1800;
    return;
  }

  event.preventDefault();
  canvas.setPointerCapture(event.pointerId);
  state.selection.active = true;
  state.selection.mode = event.shiftKey ? "rect" : "paint";
  state.selection.plotType = plotTypeAt(tile.x, tile.y);
  state.selection.building = null;
  state.selection.fenceEdgeId = null;
  state.selection.anchor = tile;
  state.selection.selected.clear();
  state.selection.paintSelected.clear();
  addSelectionTile(tile);
  rememberPaintSelection();
  if (state.selection.mode === "rect") updateRectangleSelection(tile);
  else updateSelectionPanel();
});

canvas.addEventListener("pointermove", (event) => {
  if (state.harvest.active || state.resourceAction.active || state.roomAction.active) {
    event.preventDefault();
    return;
  }

  const point = screenPointFromPointer(event);
  state.materialTool.pointer = point;

  if (state.room.active) {
    const overDoor = roomDoorAtScreenPoint(point.x, point.y);
    const tile = tileFromScreenPoint(point.x, point.y);
    state.selection.hover = tile;
    canvas.style.cursor = overDoor ? "pointer" : canStartRoomSelection(tile) || state.selection.active ? "crosshair" : "default";
    if (state.selection.active) {
      event.preventDefault();
      updateSelectionModeFromShift(event.shiftKey);
      if (state.selection.mode === "rect") {
        updateRectangleSelection(tile);
      } else {
        addSelectionTile(tile);
        updateSelectionPanel();
      }
    }
    return;
  }

  const tile = tileFromScreenPoint(point.x, point.y);
  state.selection.hover = tile;

  if (state.materialTool.painting) {
    event.preventDefault();
    paintMaterialStroke(tile);
    return;
  }

  if (state.selection.active) {
    event.preventDefault();
    updateSelectionModeFromShift(event.shiftKey);
    if (state.selection.mode === "rect") {
      updateRectangleSelection(tile);
    } else if (plotTypeAt(tile.x, tile.y) === state.selection.plotType) {
      addSelectionTile(tile);
      updateSelectionPanel();
    }
    return;
  }

  const building = buildingAtScreenPoint(point.x, point.y);
  const resourceTarget = harvestTargetAtScreenPoint(point.x, point.y);
  const fenceEdge = fenceEdgeForTile(tile, point.x, point.y);
  canvas.style.cursor = fenceEdge || building || resourceTarget ? "pointer" : "crosshair";
});

canvas.addEventListener("pointerup", (event) => {
  if (state.roomAction.active) {
    event.preventDefault();
    cancelRoomAction(event.pointerId, state.roomAction.type === "enter");
    return;
  }

  if (state.harvest.active) {
    event.preventDefault();
    cancelHarvest(event.pointerId);
    return;
  }

  if (state.resourceAction.active) {
    event.preventDefault();
    cancelResourceAction(event.pointerId);
    return;
  }

  if (state.materialTool.painting) {
    event.preventDefault();
    stopMaterialPainting(event.pointerId);
    return;
  }

  if (!state.selection.active) return;
  state.selection.active = false;
  if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
});

canvas.addEventListener("pointercancel", (event) => {
  if (state.roomAction.active) cancelRoomAction(event.pointerId);
  if (state.harvest.active) cancelHarvest(event.pointerId);
  if (state.resourceAction.active) cancelResourceAction(event.pointerId);
  if (state.materialTool.painting) stopMaterialPainting(event.pointerId);
  state.selection.active = false;
  if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
});

canvas.addEventListener("pointerleave", () => {
  state.materialTool.pointer = null;
  canvas.style.cursor = state.room.active ? "default" : "crosshair";
  if (!state.selection.active) state.selection.hover = null;
});

buyButton.addEventListener("click", () => {
  buySelectedPlots();
});

buildButton.addEventListener("click", () => {
  if (state.selection.plotType === "fence") {
    convertSelectedFenceEdge();
    return;
  }

  if (state.selection.plotType === "room") {
    addSelectedRoom();
    return;
  }
  openBuildingEditor("board");
});

decorationButton.addEventListener("click", () => {
  openBuildingEditor("decoration");
});
editBoardButton.addEventListener("click", openBoardEditor);
sellButton.addEventListener("click", openDeleteConfirm);

inventoryButton.addEventListener("click", () => {
  setInventoryOpen(!state.inventoryOpen);
});

closeInventoryButton.addEventListener("click", () => {
  setInventoryOpen(false);
});

craftingButton.addEventListener("click", () => {
  setCraftingOpen(!state.craftingOpen);
});

closeCraftingButton.addEventListener("click", () => {
  setCraftingOpen(false);
});

craftButton.addEventListener("click", craftSelectedRecipe);

forumButton.addEventListener("click", () => {
  setForumOpen(!state.forumOpen);
});

closeForumButton.addEventListener("click", () => {
  setForumOpen(false);
});

forumBackButton.addEventListener("click", () => {
  state.forum.topicId = null;
  updateForumPanel();
});

forumTabs.addEventListener("click", (event) => {
  const button = event.target.closest(".forum-tab");
  if (!button) return;
  state.forum.tab = button.dataset.forumTab || "your";
  state.forum.boardId = null;
  state.forum.topicId = null;
  updateForumPanel();
});

closeHomeChatButton.addEventListener("click", () => {
  setHomeChatOpen(false);
});

closeBoardEditorButton.addEventListener("click", closeBoardEditor);
boardEditorForm.addEventListener("submit", saveBoardEditor);

closeDeleteConfirmButton.addEventListener("click", () => closeDeleteConfirm());
cancelDeleteButton.addEventListener("click", () => closeDeleteConfirm());
confirmDeleteButton.addEventListener("click", confirmDeleteBuilding);

closeEditorButton.addEventListener("click", closeBuildingEditor);

clearDoodleButton.addEventListener("click", () => {
  doodleCtx.clearRect(0, 0, doodleCanvas.width, doodleCanvas.height);
  materialCtx.clearRect(0, 0, materialCanvas.width, materialCanvas.height);
  handleDoodleChanged();
});

previewBuildingButton.addEventListener("click", previewBuilding);
placeBuildingButton.addEventListener("click", placePreviewBuilding);
refreshAssetLibraryButton.addEventListener("click", () => loadAssetLibrary(true));
for (const tabButton of editorImageTabs) {
  tabButton.addEventListener("click", () => setEditorImageMode(tabButton.dataset.editorImageMode));
}
assetLibraryList.addEventListener("click", (event) => {
  const button = event.target.closest(".asset-library-item");
  if (!button) return;
  reuseAsset(button.dataset.assetUrl);
});
newBoardNameInput.addEventListener("input", syncEditorBoardMetaState);
newBoardDescriptionInput.addEventListener("input", syncEditorBoardMetaState);
newBoardVisibilityInput.addEventListener("change", syncEditorBoardMetaState);

for (const button of resourceToolButtons) {
  button.addEventListener("click", () => {
    setEquippedMaterialTool(button.dataset.equipResource);
  });
}

for (const button of swatchButtons) {
  button.addEventListener("click", () => {
    state.editor.brushResource = button.dataset.resource || "wood";
    state.editor.brushBaseColor = button.dataset.color || "#9b5d34";
    updateEditorBrushColor();
    for (const swatch of swatchButtons) swatch.classList.toggle("active", swatch === button);
  });
}

brushBrightness.addEventListener("input", updateEditorBrushColor);
window.addEventListener("pagehide", saveWorldBeforePageHide);

doodleCanvas.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  doodleCanvas.setPointerCapture(event.pointerId);
  state.editor.drawing = true;
  state.editor.lastPoint = editorPointFromEvent(event);
});

doodleCanvas.addEventListener("pointermove", (event) => {
  if (!state.editor.drawing || !state.editor.lastPoint) return;
  event.preventDefault();
  const point = editorPointFromEvent(event);
  drawDoodleLine(state.editor.lastPoint, point);
  state.editor.lastPoint = point;
  handleDoodleChanged();
});

doodleCanvas.addEventListener("pointerup", (event) => {
  state.editor.drawing = false;
  state.editor.lastPoint = null;
  if (doodleCanvas.hasPointerCapture(event.pointerId)) doodleCanvas.releasePointerCapture(event.pointerId);
});

doodleCanvas.addEventListener("pointercancel", (event) => {
  state.editor.drawing = false;
  state.editor.lastPoint = null;
  if (doodleCanvas.hasPointerCapture(event.pointerId)) doodleCanvas.releasePointerCapture(event.pointerId);
});

ensureStarterAnimals();
updateSelectionPanel();
refreshInventoryUi();
updateHud();
loadAccount()
  .then((ok) => ok ? loadWorld() : null)
  .finally(() => requestAnimationFrame(gameLoop));
