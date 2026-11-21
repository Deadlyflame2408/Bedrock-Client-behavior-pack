# DeadlyFlame Client: Behavior Pack
DeadlyFlame is an information-only HUD and tools pack for Minecraft Bedrock, built on the official Script API. It adds a compact on-screen display, two in-game menus and a set of background alerts. It reads game state and shows it to you. It does not change combat, damage, reach, or what you can hit, and it draws nothing on other players.
How you use it
Right click a compass to open the settings menu, where every feature has an on or off switch. Right click a clock to open the tools menu. Your choices are saved per player, so they stay between sessions.
The bottom display
The bar sits above the hotbar and stays on screen. Labels are short, and the items stack into up to three lines so it fits. Only the features you switch on appear.
Feature
What it shows
Coordinates
Your X, Y and Z position
CPS
Landed hits in the last second
Combo counter
Hits in a row since you were last hurt
Reach display
Distance to the last entity you hit, measured from a few ticks before the hit
Blocks per second
Your horizontal speed
Armor HUD
Durability left on each armor piece
Arrow count
Arrows in your inventory
Totem counter
Totems of undying in your inventory
Clock
In-game time
Day count
The world day
Compass
The direction you face
Effect display
Active potion effects and seconds left
Food level
Your hunger value
Session timer
Time since you joined
Kills and deaths
Your running totals
Nearest waypoint
Name, distance and direction of your closest saved waypoint
Background alerts
These take no space on the bar. They appear briefly, with cooldowns so they do not repeat during a fight.
• Low health alert
• Low durability warning for armor and your held item
• Potion timer alert when an effect is about to run out
• Hit flash, a small mark when a hit lands
• Death logger, which prints where you died and saves it
• Chat timestamps, which put the time in front of chat messages where the game version supports it
The tools menu
• Stats: session time, hits landed, best combo, kills, deaths and K/D
• Waypoints: save up to five spots and remove them later
• Recent deaths: your last five death locations
• Post my coordinates: sends your position to chat
What it does not do
The Script API cannot read ping or FPS, change field of view, zoom, freelook, draw hitbox outlines, or see raw mouse clicks. CPS counts landed hits, not clicks. Reach is a readout based on positions a few ticks before the hit, so it is close but not an exact match for the game's own check.
Requirements and limits
• Minecraft Bedrock on Windows with Beta APIs switched on for the world
• Scripts run only in worlds you control or on servers that allow them. On servers that use their own packs, this pack's scripts will not run
• A few features depend on the game version, especially chat timestamps and the hunger reading
• Set the manifest's script module versions to match your game version
For players who want it on Xbox
This pack is meant to give console players the same kind of HUD that PC clients offer. Xbox players can only load packs through supported routes, and many Realms limit or ignore custom scripts, so check what your world allows before relying on it.
Notes for contributors
Anything that gives a combat advantage, such as extended reach, hitbox changes, or wallhack-style outlines, does not belong in this project. Features should read and display information only.
