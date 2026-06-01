# WAi Forum State Audit

The current WAi Forum game is a client-side canvas prototype backed by a small
Node server for authentication and AI building previews. Before this persistence
pass, the world state lived in browser memory and disappeared on refresh.

## State Already Present In The Game

- Account identity from `/api/account`.
- User economy: gold, player XP, home XP, XP-to-gold milestone progress.
- User resources: wood and stone.
- User items: acorns.
- User hotbar assignment and active slot.
- Owned plots, including the starter home area and newly bought land.
- Placed buildings, including occupied tiles, preview image, dimensions, and material costs.
- Harvested world features, so chopped trees and mined rocks stay changed.
- Planted saplings, including growth timing and grown state.
- Home chat messages.
- Player position and facing, useful for reconnect/resume.

## Forum/World Pairings

- Boards are the professional forum/category object.
- Buildings are the game-world/art representation of a board.
- Topics are the professional thread/discussion object.
- Rooms are the game-world representation of a topic.

Boards and buildings should be associated, but not collapsed into one table:
board data should stay readable and professional, while building data can store
art, placement, materials, collision, and world presentation metadata.

Topics and rooms follow the same rule:
topic data should store forum concerns such as title, status, pinned/locked
state, and moderation metadata, while room data stores the navigable location,
visual treatment, spawn points, and room-specific world state.

## State To Persist For A Long-Lived Multiplayer World

- Users and public profile display data.
- Player economy, XP, resources, inventory, equipment/hotbar, and current position.
- Land ownership and permissions.
- Buildings and their linked boards.
- Topics and their linked rooms.
- Messages, with enough foreign keys to know whether each message belongs to a
  board, topic, room, building, or positional world chat.
- World feature deltas such as harvested trees/rocks and planted/grown saplings.
- World events as an append-only audit trail for buys, sells, harvests, builds,
  moderation actions, and future multiplayer reconciliation.

## Still To Add Later

- Permission roles for shared boards, buildings, rooms, and moderation.
- Resource transaction ledger so gold/material changes can be audited.
- Server-authoritative action endpoints for buy/build/sell/harvest instead of
  accepting whole client snapshots.
- Multiplayer presence and movement snapshots with rate limits.
- Asset storage for generated building images instead of long data URLs.
- Message threading/replies, reactions, edits, deletes, and moderation state.
