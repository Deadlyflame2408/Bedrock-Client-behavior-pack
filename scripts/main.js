import { world, system, EquipmentSlot, EntityComponentTypes } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";

const hitTimes = new Map();
const lastReach = new Map();
const combo = new Map();
const lastPos = new Map();
const speed = new Map();

function countItem(player, typeId) {
  const inv = player.getComponent(EntityComponentTypes.Inventory).container;
  let total = 0;
  for (let i = 0; i < inv.size; i++) {
    const item = inv.getItem(i);
    if (item && item.typeId === typeId) total += item.amount;
  }
  return total;
}

function armorLine(player) {
  const eq = player.getComponent(EntityComponentTypes.Equippable);
  const slots = [
    ["H", EquipmentSlot.Head], ["C", EquipmentSlot.Chest],
    ["L", EquipmentSlot.Legs], ["B", EquipmentSlot.Feet],
  ];
  return slots.map(([label, slot]) => {
    const item = eq.getEquipment(slot);
    if (!item) return `${label}:-`;
    const dur = item.getComponent("minecraft:durability");
    if (!dur) return `${label}:ok`;
    const left = Math.round(((dur.maxDurability - dur.damage) / dur.maxDurability) * 100);
    return `${label}:${left}%`;
  }).join(" ");
}

function cps(player) {
  const now = Date.now();
  const recent = (hitTimes.get(player.id) ?? []).filter((t) => now - t < 1000);
  hitTimes.set(player.id, recent);
  return recent.length;
}

function facing(player) {
  const y = player.getRotation().y;
  const names = ["S", "SW", "W", "NW", "N", "NE", "E", "SE"];
  return names[Math.round(((y + 180) % 360) / 45) % 8];
}

function clockText() {
  const ticks = (world.getTimeOfDay() + 6000) % 24000;
  const hours = Math.floor(ticks / 1000);
  const minutes = Math.floor(((ticks % 1000) / 1000) * 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function effectText(player) {
  const effects = player.getEffects();
  if (effects.length === 0) return "no effects";
  return effects.map((e) => `${e.displayName} ${Math.ceil(e.duration / 20)}s`).join(", ");
}

const FEATURES = [
  { id: "coords", label: "Coordinates", on: true, show: (p) => `XYZ ${Math.floor(p.location.x)} ${Math.floor(p.location.y)} ${Math.floor(p.location.z)}` },
  { id: "cps", label: "CPS", on: true, show: (p) => `CPS ${cps(p)}` },
  { id: "combo", label: "Combo counter", on: false, show: (p) => `Combo ${combo.get(p.id) ?? 0}` },
  { id: "reach", label: "Reach display", on: false, show: (p) => `Reach ${(lastReach.get(p.id) ?? 0).toFixed(2)}` },
  { id: "bps", label: "Blocks per second", on: false, show: (p) => `BPS ${(speed.get(p.id) ?? 0).toFixed(1)}` },
  { id: "armor", label: "Armor HUD", on: true, show: (p) => armorLine(p) },
  { id: "arrows", label: "Arrow count", on: false, show: (p) => `Arrows ${countItem(p, "minecraft:arrow")}` },
  { id: "totems", label: "Totem counter", on: false, show: (p) => `Totems ${countItem(p, "minecraft:totem_of_undying")}` },
  { id: "clock", label: "Clock", on: false, show: () => clockText() },
  { id: "day", label: "Day count", on: false, show: () => `Day ${world.getDay()}` },
  { id: "compass", label: "Compass", on: false, show: (p) => facing(p) },
  { id: "effects", label: "Effect display", on: false, show: (p) => effectText(p) },
];

function isOn(player, feature) {
  const saved = player.getDynamicProperty(`df_${feature.id}`);
  return saved === undefined ? feature.on : saved;
}

world.afterEvents.entityHitEntity.subscribe((event) => {
  const player = event.damagingEntity;
  if (player.typeId !== "minecraft:player") return;
  const list = hitTimes.get(player.id) ?? [];
  list.push(Date.now());
  hitTimes.set(player.id, list);
  combo.set(player.id, (combo.get(player.id) ?? 0) + 1);
  const a = player.location;
  const b = event.hitEntity.location;
  lastReach.set(player.id, Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z));
});

world.afterEvents.entityHurt.subscribe((event) => {
  if (event.hurtEntity.typeId === "minecraft:player") {
    combo.set(event.hurtEntity.id, 0);
  }
});

system.runInterval(() => {
  for (const player of world.getAllPlayers()) {
    const prev = lastPos.get(player.id);
    const now = player.location;
    if (prev) {
      const flat = Math.hypot(now.x - prev.x, now.z - prev.z);
      speed.set(player.id, flat * 5);
    }
    lastPos.set(player.id, { x: now.x, z: now.z });

    const parts = FEATURES.filter((f) => isOn(player, f)).map((f) => f.show(player));
    if (parts.length > 0) {
      player.onScreenDisplay.setActionBar(parts.join("  |  "));
    }
  }
}, 4);

function openMenu(player) {
  const form = new ModalFormData().title("DeadlyFlame Menu");
  for (const f of FEATURES) form.toggle(f.label, isOn(player, f));
  form.show(player).then((response) => {
    if (response.canceled) return;
    FEATURES.forEach((f, i) => player.setDynamicProperty(`df_${f.id}`, response.formValues[i]));
  });
}

world.afterEvents.itemUse.subscribe((event) => {
  if (event.itemStack.typeId === "minecraft:compass") openMenu(event.source);
});