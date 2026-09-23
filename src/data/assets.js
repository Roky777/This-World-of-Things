const thingArt = (path) => new URL(`../../assets/GRADE 3/This World of Things/${path}`, import.meta.url).href;

const levelArt = {
  level1: {
    windowglass: thingArt("level 1/window_glass (1).png"), spectacleglass: thingArt("level 1/spectacle_glass (1).png"),
    glassbottle: thingArt("level 1/clear_glass_bottle (1).png"), colouredglass: thingArt("level 1/colored glass (1).png"),
    plasticsheet: thingArt("level 1/thin_plastic_sheet (1).png"), cloth: thingArt("level 1/thin_cloth (1).png"),
    lampshade: thingArt("level 1/lamp (1).png"), door: thingArt("level 1/wooden door (1).png"),
    plate: thingArt("level 1/plate (2).png"), table: thingArt("level 1/table (1).png"),
  },
  level2: {
    table: thingArt("level 2/table (1).png"), chair: thingArt("level 2/chair (1).png"), door: thingArt("level 2/door (1).png"),
    pencil: thingArt("level 2/pencil (1).png"), hinge: thingArt("level 2/door_hinge (1).png"),
    nail: thingArt("level 2/iron_nail (1).png"), spoon: thingArt("level 2/spoon (1).png"),
    windowpane: thingArt("level 2/wndow_pane (1).png"), bulb: thingArt("level 2/bulb (2).png"), switch: thingArt("level 2/switch (1).png"),
  },
  level3: {
    mango: thingArt("level 3/mango (1).png"), carrot: thingArt("level 3/carrot (1) (1).png"),
    chicken: thingArt("level 3/chicken (1).png"), rock: thingArt("level 3/rock (1).png"), water: thingArt("level 3/water bottle.png"),
    pen: thingArt("level 3/pen (1).png"), clothes: thingArt("level 3/clothes (1).png"), shoes: thingArt("level 3/shoes (1).png"),
    table: thingArt("level 3/table (1).png"), schoolbag: thingArt("level 3/SCHOOL_BAG (1).png"),
  },
};

export function resolveMathArt(artId, assetSet) {
  return levelArt?.[assetSet]?.[artId] ?? levelArt.level1.windowglass;
}

const blankBin = "assets/ui/sorting-bin-blank.png";
const binIds = ["transparent", "translucent", "opaque", "wood", "metal", "glass", "plastic", "natural", "artificial"];

export const assets = {
  characters: {
    idle: "assets/characters/idle.png",
    presentation: "assets/characters/final_presentation_clean.png",
    correct: "assets/characters/modified_thubms_up.png",
    nod: "assets/characters/updated_nod.png",
    happy: "assets/characters/happy.png",
    thinking: "assets/characters/thinking.png",
    surprised: "assets/characters/surprised.png",
    successDance: "assets/characters/moon_walk_normalized.png",
  },
  backgrounds: {}, items: { math: levelArt.level1, mathByLevel: levelArt },
  ui: {
    success: ["assets/ui/start-background.png", "assets/ui/image 18.png", "assets/ui/success-star-1.png", "assets/ui/success-star-2.png", "assets/ui/success-star-3.png"],
    conveyorRims: "assets/ui/conveyor-rims.png", conveyorFrame: "assets/ui/conveyor-frame.png", conveyorTrackMask: "assets/ui/conveyor-track.png",
    sortingBins: Object.fromEntries(binIds.map((id) => [id, blankBin])), boxLeaves: "assets/ui/ui-box-leaves.png",
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
