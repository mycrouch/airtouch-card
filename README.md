# AirTouch 4 Card

A Lovelace card for Home Assistant's [AirTouch 4](https://www.home-assistant.io/integrations/airtouch4/) integration, styled after the AirTouch wall console. Shows the main AC (power, mode, fan speed, current temperature) alongside every zone with per-zone power toggles and setpoint +/- controls.

No scripts, helpers or image files required — zone temperature changes call `climate.set_temperature` directly and all graphics are inline SVG.

## Features

- Main AC power toggle, HVAC mode selector (cool / heat / dry / fan / auto / off) and fan speed selector (low / medium / high / auto), with the card background tinted by the active mode.
- Per-zone rows: power toggle (fan_only ↔ off), setpoint down/up, setpoint display, and current zone temperature.
- **GUI editor with zone auto-discovery** — pick your main AC entity and the card finds the AirTouch zone entities from the same device (entity registry, with a heuristic fallback). Zones can be renamed in the card without touching the entity registry.
- Optional per-zone override to call custom scripts for temp up/down instead of `climate.set_temperature` (Advanced section in the editor).

## Installation

### HACS (recommended)

1. HACS → menu (⋮) → **Custom repositories** → add this repo URL, category **Dashboard**.
2. Search for **AirTouch 4 Card** and download it.
3. HACS registers the resource automatically. If you manage resources manually, add:

```yaml
url: /hacsfiles/airtouch4-card/airtouch4-card.js
type: module
```

### Manual

Copy `airtouch4-card.js` to `config/www/` and add the resource:

```yaml
url: /local/airtouch4-card.js
type: module
```

## Configuration

Use the GUI editor (Add card → AirTouch 4 Card), or YAML:

```yaml
type: custom:airtouch4-card
entity: climate.ac_0          # main AC (the climate entity with fan modes)
name: Daikin AC               # optional card title
step: 1                       # optional, zone setpoint step in °C (default 1)
show_zone_current: true       # optional, show zone current temperature (default true)
zones:
  - entity: climate.lounge
    name: Lounge              # optional display-name override
  - entity: climate.kitchen
  - entity: climate.master
    name: Master Bedroom
    temp_up_service: script.master_temp_up      # optional custom service
    temp_down_service: script.master_temp_down  # optional custom service
```

| Option | Required | Default | Description |
|---|---|---|---|
| `entity` | yes | — | Main AC climate entity |
| `name` | no | entity friendly name | Card title |
| `step` | no | `1` | Zone setpoint increment (°C) |
| `show_zone_current` | no | `true` | Show zone current temperature |
| `zones` | no | auto-discovered | List of zone objects (see below) |
| `zones[].entity` | yes | — | Zone climate entity |
| `zones[].name` | no | entity friendly name | Display name (card-only rename) |
| `zones[].temp_up_service` | no | — | Custom service for temp up (e.g. `script.x`) |
| `zones[].temp_down_service` | no | — | Custom service for temp down |

## Notes

- Built against the AirTouch 4 core integration, where the console is a climate entity with `fan_modes` and each zone is a climate entity with modes `[off, fan_only]`. Anything matching that shape should work.
- Zone auto-discovery prefers entities sharing the main entity's config entry; if the entity registry can't be read it falls back to matching climate entities with exactly `off`/`fan_only` modes.

## License

MIT
