# WAi Forum Persistence

This schema is the shared truth layer for the persistent forum world.

The important pairings are explicit:

- `wai_forum_boards` stores the normal forum/category information.
- `wai_forum_buildings` stores the game-world art and placement for a board.
- `wai_forum_topics` stores the normal thread/topic information.
- `wai_forum_rooms` stores the game-world space for a topic.

The current canvas prototype persists the state it already has through:

- `wai_forum_player_state`
- `wai_forum_user_plots`
- `wai_forum_buildings`
- `wai_forum_world_features`
- `wai_forum_messages`

Run `schema.sql` against the `WAi Forum` database. The server reads its default
connection URL from `data/db-uri.json`, using `dev_address` locally and
`prod_address` when `NODE_ENV=production` and that value is set. You can still
override this with `WAI_FORUM_DATABASE_URL` or `DATABASE_URL`; those environment
variables may be either a raw PostgreSQL URL or the same JSON shape used by the
Cloud Run `db-uri` secret.
