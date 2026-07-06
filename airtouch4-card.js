/*! AirTouch 4 Card v1.0.2
 *  A Lovelace card for the Home Assistant AirTouch 4 integration.
 *  Replicates the classic AirTouch console look: main AC status, mode,
 *  fan speed, and per-zone power / setpoint control.
 *  https://github.com/mycrouch/airtouch4-card
 *  MIT License
 */
(() => {
  "use strict";

  const VERSION = "1.0.2";

  /* ------------------------------------------------------------------ *
   *  MDI icon paths (Material Design Icons, Apache 2.0)                *
   * ------------------------------------------------------------------ */
  const ICONS = {
    power:
      "M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13V3Z",
    cool:
      "M20.79,13.95L18.46,14.57L16.46,13.44V10.56L18.46,9.43L20.79,10.05L21.31,8.12L19.54,7.65L20,5.88L18.07,5.36L17.45,7.69L15.45,8.82L13,7.38V5.12L14.71,3.41L13.29,2L12,3.29L10.71,2L9.29,3.41L11,5.12V7.38L8.55,8.82L6.55,7.69L5.93,5.36L4,5.88L4.47,7.65L2.7,8.12L3.22,10.05L5.55,9.43L7.55,10.56V13.45L5.55,14.58L3.22,13.96L2.7,15.89L4.47,16.36L4,18.12L5.93,18.64L6.55,16.31L8.55,15.18L11,16.62V18.88L9.29,20.59L10.71,22L12,20.71L13.29,22L14.71,20.59L13,18.88V16.62L15.45,15.17L17.45,16.3L18.07,18.63L20,18.12L19.53,16.35L21.3,15.88L20.79,13.95M9.5,10.56L12,9.11L14.5,10.56V13.44L12,14.89L9.5,13.44V10.56Z",
    heat:
      "M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 17.03 19.32C18.86 17.66 19.5 15 18.56 12.72L18.43 12.46C18.22 12 17.66 11.2 17.66 11.2M14.5 17.5C14.22 17.74 13.76 18 13.4 18.1C12.28 18.5 11.16 17.94 10.5 17.28C11.69 17 12.4 16.12 12.61 15.23C12.78 14.43 12.46 13.77 12.33 13C12.21 12.26 12.23 11.63 12.5 10.94C12.69 11.32 12.89 11.7 13.13 12C13.9 13 15.11 13.44 15.37 14.8C15.41 14.94 15.43 15.08 15.43 15.23C15.46 16.05 15.1 16.95 14.5 17.5Z",
    dry:
      "M12,3.25C12,3.25 6,10 6,14C6,17.32 8.69,20 12,20A6,6 0 0,0 18,14C18,10 12,3.25 12,3.25M14.47,9.97L15.53,11.03L9.53,17.03L8.47,15.97M9.75,10A1.25,1.25 0 0,1 11,11.25A1.25,1.25 0 0,1 9.75,12.5A1.25,1.25 0 0,1 8.5,11.25A1.25,1.25 0 0,1 9.75,10M14.25,14.5A1.25,1.25 0 0,1 15.5,15.75A1.25,1.25 0 0,1 14.25,17A1.25,1.25 0 0,1 13,15.75A1.25,1.25 0 0,1 14.25,14.5Z",
    fan_only:
      "M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.68 9.22,10.87C9.41,10.39 9.73,9.97 10.14,9.65C8.15,5.96 8.94,2 12.5,2Z",
    auto:
      "M12,6V9L16,5L12,1V4A8,8 0 0,0 4,12C4,13.57 4.46,15.03 5.24,16.26L6.7,14.8C6.25,13.97 6,13 6,12A6,6 0 0,1 12,6M18.76,7.74L17.3,9.2C17.74,10.04 18,11 18,12A6,6 0 0,1 12,18V15L8,19L12,23V20A8,8 0 0,0 20,12C20,10.43 19.54,8.97 18.76,7.74Z",
    off:
      "M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13V3Z",
    minus:
      "M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7,13H17V11H7V13Z",
    plus:
      "M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,7H11V11H7V13H11V17H13V13H17V11H13V7Z",
  };

  const MODE_COLORS = {
    cool: ["#0d2b45", "#1565c0"],
    heat: ["#3e1a0f", "#e65100"],
    dry: ["#3a2f0b", "#b28704"],
    fan_only: ["#0b3538", "#00838f"],
    auto: ["#12303d", "#00695c"],
    heat_cool: ["#12303d", "#00695c"],
    off: ["#23272b", "#3a4046"],
  };

  const MODE_LABELS = {
    cool: "Cool",
    heat: "Heat",
    dry: "Dry",
    fan_only: "Fan",
    auto: "Auto",
    heat_cool: "Auto",
    off: "Off",
  };

  const FAN_LABELS = { low: "Low", medium: "Medium", high: "High", auto: "Auto" };

  const svgIcon = (path, cls = "") =>
    `<svg class="${cls}" viewBox="0 0 24 24"><path d="${path}"/></svg>`;

  const fmt = (v, dp = 1) =>
    v === null || v === undefined || isNaN(v) ? "--" : Number(v).toFixed(dp).replace(/\.0$/, "");

  /* ------------------------------------------------------------------ *
   *  Zone discovery helpers (shared by card stub + editor)             *
   * ------------------------------------------------------------------ */
  const isMainAc = (st) => {
    if (!st || !st.entity_id.startsWith("climate.")) return false;
    // hass-airtouch sets device_class "ac"; core airtouch4 main AC is the
    // climate entity with a real fan-speed list.
    if (st.attributes.device_class === "ac") return true;
    const fm = st.attributes.fan_modes;
    return Array.isArray(fm) && fm.length > 2;
  };

  const isZone = (st) => {
    if (!st || !st.entity_id.startsWith("climate.")) return false;
    // hass-airtouch sets device_class "zone".
    if (st.attributes.device_class === "zone") return true;
    if (st.attributes.device_class === "ac") return false;
    // Core airtouch4 zones expose exactly [off, fan_only]; other AirTouch-like
    // zones expose "off" plus at most one active mode and no real fan speeds.
    const modes = (st.attributes.hvac_modes || []).slice().sort();
    if (modes.join(",") === "fan_only,off") return true;
    const fm = st.attributes.fan_modes;
    const zoneFan = !Array.isArray(fm) || fm.length <= 2;
    return zoneFan && modes.length <= 2 && modes.includes("off");
  };

  const discoverZonesHeuristic = (hass, mainEntity) =>
    Object.values(hass.states)
      .filter((st) => st.entity_id !== mainEntity && isZone(st))
      .map((st) => ({
        entity: st.entity_id,
        name: st.attributes.friendly_name || st.entity_id.split(".")[1],
      }));

  async function discoverZonesRegistry(hass, mainEntity) {
    try {
      const reg = await hass.callWS({ type: "config/entity_registry/list" });
      const main = reg.find((e) => e.entity_id === mainEntity);
      const platformOk = (e) => (e.platform || "").startsWith("airtouch");
      const sameSource = (e) =>
        main && main.config_entry_id
          ? e.config_entry_id === main.config_entry_id
          : platformOk(e);
      const zones = reg
        .filter(
          (e) =>
            e.entity_id.startsWith("climate.") &&
            e.entity_id !== mainEntity &&
            sameSource(e) &&
            isZone(hass.states[e.entity_id])
        )
        .map((e) => {
          const st = hass.states[e.entity_id];
          return {
            entity: e.entity_id,
            name:
              (st && st.attributes.friendly_name) ||
              e.name ||
              e.original_name ||
              e.entity_id.split(".")[1],
          };
        });
      if (zones.length) return zones;
    } catch (err) {
      /* fall through to heuristic */
    }
    return discoverZonesHeuristic(hass, mainEntity);
  }

  /* ------------------------------------------------------------------ *
   *  The card                                                          *
   * ------------------------------------------------------------------ */
  class AirTouch4Card extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._config = null;
      this._hass = null;
      this._renderedKey = null;
    }

    static getConfigElement() {
      return document.createElement("airtouch4-card-editor");
    }

    static getStubConfig(hass) {
      const main = Object.values(hass.states).find(isMainAc);
      const entity = main ? main.entity_id : "";
      return {
        entity,
        zones: entity ? discoverZonesHeuristic(hass, entity) : [],
      };
    }

    setConfig(config) {
      if (!config || !config.entity) {
        throw new Error("airtouch4-card: 'entity' (main AC climate entity) is required");
      }
      this._config = {
        step: 1,
        show_zone_current: true,
        ...config,
        zones: (config.zones || []).map((z) =>
          typeof z === "string" ? { entity: z } : { ...z }
        ),
      };
      this._renderedKey = null;
      if (this._hass) this._render();
    }

    set hass(hass) {
      this._hass = hass;
      if (!this._config) return;
      // cheap change detection: re-render only when a watched entity changed
      const key = [this._config.entity, ...this._config.zones.map((z) => z.entity)]
        .map((id) => {
          const st = hass.states[id];
          return st ? `${id}:${st.state}:${JSON.stringify(st.attributes)}` : `${id}:missing`;
        })
        .join("|");
      if (key !== this._renderedKey) {
        this._renderedKey = key;
        this._render();
      }
    }

    getCardSize() {
      return 4 + Math.ceil((this._config?.zones?.length || 0) / 2);
    }

    _callClimate(service, data) {
      this._hass.callService("climate", service, data);
    }

    _callCustom(serviceStr) {
      const [domain, service] = serviceStr.split(".", 2);
      if (domain && service) this._hass.callService(domain, service, {});
    }

    _zoneTemp(zone, dir) {
      const svc = dir > 0 ? zone.temp_up_service : zone.temp_down_service;
      if (svc) return this._callCustom(svc);
      const st = this._hass.states[zone.entity];
      if (!st) return;
      const cur = st.attributes.temperature;
      if (cur === null || cur === undefined) return;
      const step = Number(this._config.step) || 1;
      const min = st.attributes.min_temp ?? 0;
      const max = st.attributes.max_temp ?? 35;
      const next = Math.min(max, Math.max(min, cur + dir * step));
      this._callClimate("set_temperature", { entity_id: zone.entity, temperature: next });
    }

    _render() {
      const hass = this._hass;
      const cfg = this._config;
      const main = hass.states[cfg.entity];

      if (!main) {
        this.shadowRoot.innerHTML = `<ha-card><div style="padding:16px;color:var(--error-color)">
          airtouch4-card: entity <b>${cfg.entity}</b> not found</div></ha-card>`;
        return;
      }

      const mode = main.state;
      const [c1, c2] = MODE_COLORS[mode] || MODE_COLORS.off;
      const isOn = mode !== "off";
      const fanMode = main.attributes.fan_mode;
      const title = cfg.name || main.attributes.friendly_name || "AirTouch";

      const zoneRows = cfg.zones
        .map((zone, i) => {
          const st = hass.states[zone.entity];
          if (!st) {
            return `<div class="zone missing">${zone.entity} not found</div>`;
          }
          const zOn = st.state !== "off";
          const zName = zone.name || st.attributes.friendly_name || zone.entity;
          const setpoint = fmt(st.attributes.temperature, 0);
          const current = fmt(st.attributes.current_temperature, 1);
          return `
          <div class="zone ${zOn ? "on" : ""}">
            <button class="zpower" data-i="${i}" title="Toggle ${zName}">
              ${svgIcon(ICONS.power)}
            </button>
            <span class="zname" title="${zName}">${zName}</span>
            <button class="zbtn zdown" data-i="${i}" title="Decrease">${svgIcon(ICONS.minus)}</button>
            <span class="zset">${setpoint}&deg;</span>
            <button class="zbtn zup" data-i="${i}" title="Increase">${svgIcon(ICONS.plus)}</button>
            ${cfg.show_zone_current ? `<span class="zcur">${current}&deg;</span>` : ""}
          </div>`;
        })
        .join("");

      const modeChips = (main.attributes.hvac_modes || [])
        .map(
          (m) => `
          <button class="chip mode ${m === mode ? "active" : ""}" data-mode="${m}" title="${MODE_LABELS[m] || m}">
            ${svgIcon(ICONS[m] || ICONS.auto)}
          </button>`
        )
        .join("");

      const fanChips = (main.attributes.fan_modes || [])
        .map(
          (f) => `
          <button class="chip fan ${f === fanMode ? "active" : ""}" data-fan="${f}" title="${FAN_LABELS[f] || f}">
            <span class="fanlabel">${(FAN_LABELS[f] || f)[0]}</span>
          </button>`
        )
        .join("");

      this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        ha-card {
          overflow: hidden;
          color: #fff;
          background: linear-gradient(145deg, ${c1} 0%, ${c2} 130%);
          border: none;
        }
        .wrap { padding: 14px 16px 16px; }
        svg { fill: currentColor; width: 100%; height: 100%; display: block; }
        button {
          background: none; border: none; padding: 0; margin: 0;
          color: inherit; cursor: pointer; line-height: 0;
        }
        /* header */
        .head { display: flex; align-items: center; gap: 10px; }
        .mainpower {
          width: 34px; height: 34px; border-radius: 50%;
          padding: 6px; box-sizing: border-box;
          background: rgba(255,255,255,${isOn ? ".22" : ".08"});
          color: ${isOn ? "#7CFC98" : "rgba(255,255,255,.55)"};
          transition: background .2s;
        }
        .mainpower:hover { background: rgba(255,255,255,.3); }
        .title { font-size: 1.05em; font-weight: 500; flex: 1; opacity: .95;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .bigtemp { font-size: 2.6em; font-weight: 300; letter-spacing: -1px; }
        .bigtemp .unit { font-size: .45em; vertical-align: super; opacity: .8; }
        /* body */
        .body { display: flex; gap: 18px; margin-top: 12px; flex-wrap: wrap; }
        .zones { flex: 1 1 260px; min-width: 240px; display: flex; flex-direction: column; gap: 4px; }
        .zone {
          display: flex; align-items: center; gap: 8px;
          padding: 5px 8px; border-radius: 10px;
          background: rgba(0,0,0,.18); opacity: .75;
        }
        .zone.on { opacity: 1; background: rgba(255,255,255,.10); }
        .zone.missing { color: #ffb4a9; font-size: .85em; }
        .zpower { width: 24px; height: 24px; flex: none;
          color: rgba(255,255,255,.45); }
        .zone.on .zpower { color: #7CFC98; }
        .zname { flex: 1; font-size: .95em; white-space: nowrap;
          overflow: hidden; text-overflow: ellipsis; }
        .zbtn { width: 22px; height: 22px; flex: none; opacity: .85; }
        .zbtn:hover { opacity: 1; }
        .zset { width: 38px; text-align: center; font-size: 1.05em; font-weight: 500; }
        .zcur { width: 46px; text-align: right; font-size: .78em; opacity: .75; }
        /* right column: mode + fan */
        .controls { flex: 1 1 200px; min-width: 190px; display: grid;
          grid-template-columns: 1fr 1fr; gap: 14px; align-items: start; }
        .ctl { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .disc {
          width: 64px; height: 64px; border-radius: 50%;
          padding: 15px; box-sizing: border-box;
          background: rgba(255,255,255,.14);
          box-shadow: inset 0 0 0 2px rgba(255,255,255,.25);
        }
        .ctl .label { font-size: .85em; opacity: .9; }
        .chips { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; }
        .chip {
          width: 28px; height: 28px; border-radius: 50%;
          padding: 6px; box-sizing: border-box;
          background: rgba(0,0,0,.22); color: rgba(255,255,255,.65);
        }
        .chip.fan { padding: 0; }
        .fanlabel { font-size: .8em; font-weight: 600; line-height: 28px; }
        .chip.active { background: rgba(255,255,255,.9); color: ${c2}; }
        .chip:hover:not(.active) { background: rgba(0,0,0,.35); }
      </style>
      <ha-card>
        <div class="wrap">
          <div class="head">
            <button class="mainpower" title="${isOn ? "Turn off" : "Turn on"}">${svgIcon(ICONS.power)}</button>
            <span class="title">${title}</span>
            <span class="bigtemp">${fmt(main.attributes.current_temperature, 1)}<span class="unit">&deg;C</span></span>
          </div>
          <div class="body">
            <div class="zones">${zoneRows || `<div class="zone missing">No zones configured</div>`}</div>
            <div class="controls">
              <div class="ctl">
                <div class="disc">${svgIcon(ICONS[mode] || (mode === "off" ? ICONS.off : ICONS.auto))}</div>
                <span class="label">${MODE_LABELS[mode] || mode}</span>
                <div class="chips">${modeChips}</div>
              </div>
              <div class="ctl">
                <div class="disc">${svgIcon(ICONS.fan_only)}</div>
                <span class="label">${FAN_LABELS[fanMode] || fanMode || "--"}</span>
                <div class="chips">${fanChips}</div>
              </div>
            </div>
          </div>
        </div>
      </ha-card>`;

      this._bind();
    }

    _bind() {
      const root = this.shadowRoot;
      const cfg = this._config;

      root.querySelector(".mainpower")?.addEventListener("click", () => {
        const st = this._hass.states[cfg.entity];
        this._callClimate(st.state === "off" ? "turn_on" : "turn_off", {
          entity_id: cfg.entity,
        });
      });
      root.querySelector(".title")?.addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("hass-more-info", {
            detail: { entityId: cfg.entity },
            bubbles: true,
            composed: true,
          })
        );
      });
      root.querySelectorAll(".chip.mode").forEach((el) =>
        el.addEventListener("click", () =>
          this._callClimate("set_hvac_mode", {
            entity_id: cfg.entity,
            hvac_mode: el.dataset.mode,
          })
        )
      );
      root.querySelectorAll(".chip.fan").forEach((el) =>
        el.addEventListener("click", () =>
          this._callClimate("set_fan_mode", {
            entity_id: cfg.entity,
            fan_mode: el.dataset.fan,
          })
        )
      );
      root.querySelectorAll(".zpower").forEach((el) =>
        el.addEventListener("click", () => {
          const zone = cfg.zones[Number(el.dataset.i)];
          const st = this._hass.states[zone.entity];
          // Zone on/off via turn_on/turn_off — the airtouch4 integration's
          // set_hvac_mode path is unreliable for zones ("AirTouchGroup" error).
          this._callClimate(st.state === "off" ? "turn_on" : "turn_off", {
            entity_id: zone.entity,
          });
        })
      );
      root.querySelectorAll(".zdown").forEach((el) =>
        el.addEventListener("click", () =>
          this._zoneTemp(cfg.zones[Number(el.dataset.i)], -1)
        )
      );
      root.querySelectorAll(".zup").forEach((el) =>
        el.addEventListener("click", () =>
          this._zoneTemp(cfg.zones[Number(el.dataset.i)], +1)
        )
      );
    }
  }

  /* ------------------------------------------------------------------ *
   *  The GUI editor                                                    *
   * ------------------------------------------------------------------ */
  class AirTouch4CardEditor extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._config = null;
      this._hass = null;
      this._autoDiscovered = false;
    }

    set hass(hass) {
      this._hass = hass;
      this._forms().forEach((f) => (f.hass = hass));
      this._maybeAutoDiscover();
    }

    setConfig(config) {
      const next = {
        step: 1,
        show_zone_current: true,
        ...config,
        zones: (config.zones || []).map((z) =>
          typeof z === "string" ? { entity: z } : { ...z }
        ),
      };
      delete next.type;
      // When HA echoes back the config we just emitted, don't rebuild the
      // DOM — rebuilding steals focus from the field being typed in.
      const cur = this._config ? { ...this._config } : null;
      if (cur) delete cur.type;
      if (cur && JSON.stringify(cur) === JSON.stringify(next)) {
        this._config = next;
        return;
      }
      this._config = next;
      this._render();
      this._maybeAutoDiscover();
    }

    _forms() {
      return Array.from(this.shadowRoot?.querySelectorAll("ha-form") || []);
    }

    _emit() {
      this.dispatchEvent(
        new CustomEvent("config-changed", {
          detail: { config: { type: "custom:airtouch4-card", ...this._config } },
          bubbles: true,
          composed: true,
        })
      );
    }

    async _maybeAutoDiscover() {
      if (
        this._autoDiscovered ||
        !this._hass ||
        !this._config ||
        !this._config.entity ||
        (this._config.zones && this._config.zones.length)
      )
        return;
      this._autoDiscovered = true;
      const zones = await discoverZonesRegistry(this._hass, this._config.entity);
      if (zones.length) {
        this._config = { ...this._config, zones };
        this._render();
        this._emit();
      }
    }

    async _discoverClicked() {
      if (!this._hass || !this._config.entity) return;
      const zones = await discoverZonesRegistry(this._hass, this._config.entity);
      this._config = { ...this._config, zones };
      this._render();
      this._emit();
    }

    _render() {
      if (!this._config) return;
      this.shadowRoot.innerHTML = `
      <style>
        .box { display: flex; flex-direction: column; gap: 12px; }
        .zone {
          border: 1px solid var(--divider-color);
          border-radius: 8px; padding: 12px; position: relative;
        }
        .zonehead { display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 8px; font-weight: 500; }
        .rm { color: var(--error-color); background: none; border: none;
          cursor: pointer; font-size: .85em; }
        .row { display: flex; gap: 8px; }
        mwc-button, button.act {
          cursor: pointer;
          background: var(--primary-color); color: var(--text-primary-color, #fff);
          border: none; border-radius: 6px; padding: 8px 14px; font-size: .9em;
        }
        button.act.secondary { background: var(--secondary-background-color);
          color: var(--primary-text-color); border: 1px solid var(--divider-color); }
        .hint { font-size: .8em; color: var(--secondary-text-color); }
      </style>
      <div class="box">
        <ha-form id="main"></ha-form>
        <div class="row">
          <button class="act" id="discover">Discover zones</button>
          <button class="act secondary" id="addzone">Add zone</button>
        </div>
        <div class="hint">Discover finds AirTouch zone entities automatically
          (climate entities from the same AirTouch device). Rename zones below —
          names only affect this card.</div>
        <div id="zones"></div>
      </div>`;

      const mainForm = this.shadowRoot.getElementById("main");
      mainForm.schema = [
        {
          name: "entity",
          label: "Main AC entity (AirTouch console)",
          required: true,
          selector: { entity: { domain: "climate" } },
        },
        { name: "name", label: "Card title (optional)", selector: { text: {} } },
        {
          name: "step",
          label: "Zone setpoint step (°C)",
          selector: { number: { min: 0.5, max: 5, step: 0.5, mode: "box" } },
        },
        {
          name: "show_zone_current",
          label: "Show zone current temperature",
          selector: { boolean: {} },
        },
      ];
      mainForm.data = {
        entity: this._config.entity || "",
        name: this._config.name || "",
        step: this._config.step ?? 1,
        show_zone_current: this._config.show_zone_current ?? true,
      };
      mainForm.computeLabel = (s) => s.label || s.name;
      if (this._hass) mainForm.hass = this._hass;
      mainForm.addEventListener("value-changed", (ev) => {
        ev.stopPropagation();
        const v = ev.detail.value;
        const entityChanged = v.entity !== this._config.entity;
        this._config = { ...this._config, ...v };
        if (!this._config.name) delete this._config.name;
        if (entityChanged) this._autoDiscovered = false;
        this._emit();
        this._maybeAutoDiscover();
      });

      this.shadowRoot
        .getElementById("discover")
        .addEventListener("click", () => this._discoverClicked());
      this.shadowRoot.getElementById("addzone").addEventListener("click", () => {
        this._config = {
          ...this._config,
          zones: [...(this._config.zones || []), { entity: "", name: "" }],
        };
        this._render();
        this._emit();
      });

      const zonesEl = this.shadowRoot.getElementById("zones");
      (this._config.zones || []).forEach((zone, i) => {
        const div = document.createElement("div");
        div.className = "zone";
        div.innerHTML = `
          <div class="zonehead">
            <span>Zone ${i + 1}${zone.name ? ` — ${zone.name}` : ""}</span>
            <button class="rm">Remove</button>
          </div>`;
        const form = document.createElement("ha-form");
        form.schema = [
          {
            name: "entity",
            label: "Zone entity",
            required: true,
            selector: { entity: { domain: "climate" } },
          },
          { name: "name", label: "Display name", selector: { text: {} } },
          {
            name: "advanced",
            label: "Advanced: custom temp services",
            type: "expandable",
            flatten: true,
            schema: [
              {
                name: "temp_up_service",
                label: "Temp up service (e.g. script.lounge_temp_up)",
                selector: { text: {} },
              },
              {
                name: "temp_down_service",
                label: "Temp down service (e.g. script.lounge_temp_down)",
                selector: { text: {} },
              },
            ],
          },
        ];
        form.data = {
          entity: zone.entity || "",
          name: zone.name || "",
          temp_up_service: zone.temp_up_service || "",
          temp_down_service: zone.temp_down_service || "",
        };
        form.computeLabel = (s) => s.label || s.name;
        if (this._hass) form.hass = this._hass;
        form.addEventListener("value-changed", (ev) => {
          ev.stopPropagation();
          const v = { ...ev.detail.value, ...(ev.detail.value.advanced || {}) };
          const zones = [...this._config.zones];
          const z = { entity: v.entity, name: v.name };
          if (v.temp_up_service) z.temp_up_service = v.temp_up_service;
          if (v.temp_down_service) z.temp_down_service = v.temp_down_service;
          if (!z.name) delete z.name;
          zones[i] = z;
          this._config = { ...this._config, zones };
          this._emit();
        });
        div.querySelector(".rm").addEventListener("click", () => {
          const zones = this._config.zones.filter((_, j) => j !== i);
          this._config = { ...this._config, zones };
          this._render();
          this._emit();
        });
        div.appendChild(form);
        zonesEl.appendChild(div);
      });
    }
  }

  /* ------------------------------------------------------------------ */
  if (!customElements.get("airtouch4-card")) {
    customElements.define("airtouch4-card", AirTouch4Card);
  }
  if (!customElements.get("airtouch4-card-editor")) {
    customElements.define("airtouch4-card-editor", AirTouch4CardEditor);
  }

  window.customCards = window.customCards || [];
  if (!window.customCards.some((c) => c.type === "airtouch4-card")) {
    window.customCards.push({
      type: "airtouch4-card",
      name: "AirTouch 4 Card",
      description:
        "Control an AirTouch 4 system: main AC power/mode/fan and per-zone power and setpoints, with zone auto-discovery.",
      preview: true,
      documentationURL: "https://github.com/mycrouch/airtouch4-card",
    });
  }

  console.info(
    `%c AIRTOUCH4-CARD %c v${VERSION} `,
    "color:#fff;background:#00838f;font-weight:600;padding:2px 6px;border-radius:4px 0 0 4px",
    "color:#00838f;background:#e0f7fa;font-weight:600;padding:2px 6px;border-radius:0 4px 4px 0"
  );
})();
