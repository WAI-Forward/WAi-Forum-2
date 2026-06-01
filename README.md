# WAi Forum

## Auth website configuration

When WAi Forum needs a login it sends users to the WAi Forward website.

The WAi Forward website URL is configured in `data/forum-auth.json`:

```json
{
  "website_url": "http://92.29.230.204:8082",
  "forum_public_url": ""
}
```

If the external IP changes, update `website_url` and restart the forum server.

Environment variables override the file when present:

- `WAI_FORWARD_WEBSITE_URL` or `WEBSITE_URL` controls the WAi Forward website address.
- `FORUM_PUBLIC_URL` or `FORUM_URL` controls the public WAi Forum callback base URL, if request headers are not enough.
