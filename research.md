# Ronograd locked-room research

Checked on 2026-11-02 (Asia/Saigon). Scope: BRM5's Ronograd open world, five functioning loot rooms. Data in `dist/rooms.json` is paraphrased from the live community Wiki, not recovered game configuration and not an in-game survey.

## Method and sources

Search results returned older indexed versions of articles. The live Fandom pages were therefore opened in the in-app browser and their current article text read directly. No account login, age-verification submission, or wiki edits were made. The live pages contain substantially newer locked-room sections than the search index.

- [Locked Room overview](https://roblox-blackhawk-rescue-mission-5.fandom.com/wiki/Locked_Room): the five functioning rooms, general loot categories and unlock behavior.
- [Kozlovka](https://roblox-blackhawk-rescue-mission-5.fandom.com/wiki/Kozlovka#Locked_Room): room description, six possible key locations, quantities.
- [Naval Base](https://roblox-blackhawk-rescue-mission-5.fandom.com/wiki/Naval_Base#Locked_Room): three key locations and loot quantities; exact room-location sentence remains unfinished.
- [Quarry](https://roblox-blackhawk-rescue-mission-5.fandom.com/wiki/Quarry#Locked_Room): underground room, two key locations, objective requirement and quantities.
- [Ronograd City](https://roblox-blackhawk-rescue-mission-5.fandom.com/wiki/Ronograd_City#Locked_Room): floor-2 southeast apartment room, four key locations and quantities.
- [Sochraina City](https://roblox-blackhawk-rescue-mission-5.fandom.com/wiki/Sochraina_City#Locked_Room): floor-2 room, three key locations and quantities.
- [Items (Ronograd)](https://roblox-blackhawk-rescue-mission-5.fandom.com/wiki/Items_(Ronograd)): key identities and item sale values.
- [Fort Ronograd](https://roblox-blackhawk-rescue-mission-5.fandom.com/wiki/Fort_Ronograd): Rusted Key drainage access. This page marks some of its information outdated.

Wiki text is community-maintained and offered under [CC-BY-SA unless otherwise noted](https://www.fandom.com/licensing). This atlas uses its own concise wording and links each factual entry to the relevant source. Source images, if reused, need separate visible source credit and their applicable license retained.

## Findings

The five rooms are Kozlovka, Naval Base, Quarry, Ronograd City and Sochraina City. The current location articles list 18 possible key positions in total: 6 + 3 + 2 + 4 + 3 respectively. These describe alternative spawns, not that many simultaneous keys. Their corresponding keys are Apartment Key (the three apartment compounds), Secure Room Key (Naval) and Gate Key (Quarry). Identically named apartment keys have different destination descriptions and should not be presented as interchangeable.

Possible valuables across the five rooms include Cash Bags, Equipment Cases, Metals Cases and Jerry Cans. Some rooms also have supply boxes holding ammunition, magazines and grenades; Kozlovka additionally mentions an occasional backpack. Room-specific quantities are recorded in JSON exactly as ranges or counts rather than inferred drop probabilities. The wiki lists these sale values:

| Item | Credits | HQ resource |
| --- | ---: | --- |
| Cash Bag | 1,000 | — |
| Equipment Case | 100 | 2 Equipment |
| Jerry Can | 100 | 3 Fuel |
| Metals Case | 100 | 1 Precious Metal |

The overview says valuables can be sold at FOB Requisitions, whereas contents of supply boxes cannot. Opening a locked-room door prevents it being closed again. The overview describes room loot returning on map reset or after a player leaves and rejoins; location articles use similar wording. This is not independently verified server behavior.

## Uncertainty and conflicts

1. **Key lifecycle:** the overview says a chosen key position persists until rejoining, with respawns beginning at 00:00 until the door is unlocked. Ronograd City and Naval Base instead describe movement at day/night transitions. City also mentions occasional daytime reappearance after leaving the area. Do not claim a reliable rotation or respawn timer.
2. **Naval room floor:** the live location article still contains an unfinished location placeholder. Items (Ronograd) establishes the main office, but an exact floor is unverified. Older guides claiming floor 2 are not used as current wiki confirmation.
3. **Kozlovka floor numbering:** one key position is called floor 1 while also being described as the apartment directly below the floor-4 VIP. Both descriptions are retained as an unresolved source inconsistency.
4. **Quarry requirement:** both the location article and overview state that every objective must be complete before its key spawns. This is clearly labelled as a wiki claim. The wiki's proposed anti-cheat explanation is speculation and is not used.
5. **Incomplete wiki:** City marks itself as a cleanup/stub article; some location pages have older paragraphs alongside newer sections. Current detailed locked-room sections take precedence in the data, with conflicts recorded.
6. **Coordinates:** no source supplies surveyed world coordinates for these room doors and all key positions. Island-map markers must mean compound-level locations. Do not fabricate separate surface key coordinates, particularly for Quarry's underground rooms.
7. **Version drift:** checking a wiki today does not establish that every claim matches the running game today. No Roblox/gameplay verification was performed.

## Fort is separate

The Locked Room overview describes a room at Fort that is empty, with no findable key. It is therefore excluded from the five functioning loot-room entries.

The Rusted Key is a different item: it opens the drainage/sewer approach into Fort, not a supply room. The Fort article places the sewer by the ice shelf at approximately grid 04751 03015 and lists VIP areas at Mountain Radar Station, Quarry, Naval Base, Sochraina City and Ronograd City as potential Rusted Key sources. Because that page has an outdated warning and the feature is access rather than loot, this does not become a functioning loot-room entry or exact map marker.

## Optional visual references

The following diagrams were visibly present on their current wiki pages. They can support a sourced detail panel; they do not establish island-wide world coordinates.

- [Kozlovka key-spawn diagram](https://static.wikia.nocookie.net/roblox-blackhawk-rescue-mission-5/images/8/85/Kozlovka_Key_Spawn_Locations.png/revision/latest/scale-to-width-down/180?cb=20260926162848)
- [Quarry key-spawn diagram](https://static.wikia.nocookie.net/roblox-blackhawk-rescue-mission-5/images/c/ce/QuarryKeySpawnLocations.png/revision/latest/scale-to-width-down/180?cb=20260722082746)

Unreliable SEO lookalike domains were excluded. In particular, pages conflating Rusted Key with all loot-room keys, or renaming Sochraina to Sahrani, were not used as evidence.
