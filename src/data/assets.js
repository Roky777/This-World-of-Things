const thingArt = (path) => new URL(`../../assets/GRADE 3/This World of Things/${path}`, import.meta.url).href;

const levelArt = {
  level1: {
    windowglass: thingArt("level 1/window_glass (1).webp"), spectacleglass: thingArt("level 1/spectacle_glass (1).webp"),
    glassbottle: thingArt("level 1/clear_glass_bottle (1).webp"), colouredglass: thingArt("level 1/colored glass (1).webp"),
    plasticsheet: thingArt("level 1/thin_plastic_sheet (1).webp"), cloth: thingArt("level 1/thin_cloth (1).webp"),
    lampshade: thingArt("level 1/lamp (1).webp"), door: thingArt("level 1/wooden door (1).webp"),
    plate: thingArt("level 1/plate (2).webp"), table: thingArt("level 1/table (1).webp"),
  },
  level2: {
    table: thingArt("level 2/table (1).webp"), chair: thingArt("level 2/chair (1).webp"), door: thingArt("level 2/door (1).webp"),
    pencil: thingArt("level 2/pencil (1).webp"), hinge: thingArt("level 2/door_hinge (1).webp"),
    nail: thingArt("level 2/iron_nail (1).webp"), spoon: thingArt("level 2/spoon (1).webp"),
    windowpane: thingArt("level 2/wndow_pane (1).webp"), bulb: thingArt("level 2/bulb (2).webp"), switch: thingArt("level 2/switch (1).webp"),
  },
  level3: {
    mango: thingArt("level 3/mango (1).webp"), carrot: thingArt("level 3/carrot (1) (1).webp"),
    chicken: thingArt("level 3/chicken (1).webp"), rock: thingArt("level 3/rock (1).webp"), water: thingArt("level 3/water bottle.webp"),
    pen: thingArt("level 3/pen (1).webp"), clothes: thingArt("level 3/clothes (1).webp"), shoes: thingArt("level 3/shoes (1).webp"),
    table: thingArt("level 3/table (1).webp"), schoolbag: thingArt("level 3/SCHOOL_BAG (1).webp"),
  },
};

export function resolveMathArt(artId, assetSet) {
  return levelArt?.[assetSet]?.[artId] ?? levelArt.level1.windowglass;
}

const blankBin = "assets/ui/sorting-bin-blank.webp";
const binIds = ["transparent", "translucent", "opaque", "wood", "metal", "glass", "plastic", "natural", "artificial"];

export const assets = {
  characters: {
    idle: "assets/characters/idle.webp",
    presentation: "assets/characters/final_presentation_clean.webp",
    correct: "assets/characters/modified_thubms_up.webp",
    nod: "assets/characters/updated_nod.webp",
    happy: "assets/characters/happy.webp",
    thinking: "assets/characters/thinking.webp",
    surprised: "assets/characters/surprised.webp",
    successDance: "assets/characters/moon_walk_normalized.webp",
  },
  backgrounds: {}, items: { math: levelArt.level1, mathByLevel: levelArt },
  ui: {
    success: ["assets/ui/start-background.webp", "assets/ui/image 18.webp", "assets/ui/success-star-1.webp", "assets/ui/success-star-2.webp", "assets/ui/success-star-3.webp"],
    conveyorRims: "assets/ui/conveyor-rims.webp", conveyorFrame: "assets/ui/conveyor-frame.webp", conveyorTrackMask: "assets/ui/conveyor-track.webp",
    sortingBins: Object.fromEntries(binIds.map((id) => [id, blankBin])), boxLeaves: "assets/ui/ui-box-leaves.webp",
  },
  audio: {}, fx: {},
};

const imageRequests = new Map();
export function preloadImage(src) {
  if (!src) return Promise.resolve();
  if (imageRequests.has(src)) return imageRequests.get(src);
  const request = new Promise((resolve) => {
    const image = new Image(); image.decoding = "async";
    image.onload = async () => { await image.decode?.().catch(() => {}); resolve({ src, loaded: true }); };
    image.onerror = () => resolve({ src, loaded: false }); image.src = src;
  });
  imageRequests.set(src, request); return request;
}
export function hydrateDeferredImages(root = document) {
  return Promise.all([...root.querySelectorAll("img[data-src]")].map((image) => {
    const src = image.dataset.src; delete image.dataset.src; image.src = src;
    return image.decode?.().catch(() => {}) ?? preloadImage(src);
  }));
}
export function preloadLevelAssets(level) {
  if (!level) return Promise.resolve([]);
  const urls = new Set([assets.ui.boxLeaves, ...level.items.map((entry) => resolveMathArt(entry.art, entry.assetSet)),
    ...level.bins.flatMap((entry) => [resolveMathArt(entry.art, entry.assetSet), assets.ui.sortingBins[entry.id] ?? blankBin])]);
  return Promise.all([...urls].map(preloadImage));
}
