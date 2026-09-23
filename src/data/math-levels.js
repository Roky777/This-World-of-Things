const item = (name, art, answer) => ({ name, art, answer });

const LEVELS = [
  {
    title: "Seeing Through Things",
    instruction: "Sort by how clearly you can see through each thing.",
    showNames: true,
    maxOnBelt: 4,
    beltTravelRate: 0.076,
    bins: [
      { id: "transparent", label: "Transparent", art: "windowglass" },
      { id: "translucent", label: "Translucent", art: "cloth" },
      { id: "opaque", label: "Opaque", art: "door" },
    ],
    items: [
      item("Window glass", "windowglass", "transparent"), item("Spectacle glass", "spectacleglass", "transparent"),
      item("Clear glass bottle", "glassbottle", "transparent"), item("Clear coloured glass", "colouredglass", "transparent"),
      item("Frosted plastic sheet", "plasticsheet", "translucent"), item("Sheer cloth", "cloth", "translucent"),
      item("Thin paper lampshade", "lampshade", "translucent"), item("Wooden door", "door", "opaque"),
      item("Ceramic plate", "plate", "opaque"), item("Wooden table", "table", "opaque"),
    ],
  },
  {
    title: "What Is It Made Of?",
    instruction: "Sort each thing by its material.",
    showNames: true,
    maxOnBelt: 3,
    beltTravelRate: 0.07,
    bins: [
      { id: "wood", label: "Wood", art: "table" },
      { id: "metal", label: "Metal", art: "spoon" },
      { id: "glass", label: "Glass", art: "windowpane" },
      { id: "plastic", label: "Plastic", art: "switch" },
    ],
    items: [
      item("Wooden table", "table", "wood"), item("Wooden chair", "chair", "wood"), item("Wooden door", "door", "wood"),
      item("Wooden pencil", "pencil", "wood"), item("Metal door hinge", "hinge", "metal"), item("Iron nail", "nail", "metal"),
      item("Metal spoon", "spoon", "metal"), item("Glass windowpane", "windowpane", "glass"),
      item("Glass light bulb", "bulb", "glass"), item("Plastic switch cover", "switch", "plastic"),
    ],
  },
  {
    title: "Natural or Artificial?",
    instruction: "Sort things made by nature or made by people.",
    showNames: true,
    maxOnBelt: 4,
    beltTravelRate: 0.08,
    bins: [
      { id: "natural", label: "Natural", art: "mango" },
      { id: "artificial", label: "Artificial", art: "pen" },
    ],
    items: [
      item("Mango", "mango", "natural"), item("Carrot", "carrot", "natural"),
      item("Chicken", "chicken", "natural"), item("Rock", "rock", "natural"), item("Water", "water", "natural"),
      item("Pen", "pen", "artificial"), item("Clothes", "clothes", "artificial"),
      item("Shoes", "shoes", "artificial"), item("Table", "table", "artificial"), item("School bag", "schoolbag", "artificial"),
    ],
  },
];

function buildTutorial(level, levelIndex) {
  const examples = level.bins.map((bin) => level.items.find((entry) => entry.answer === bin.id)).filter(Boolean);
  const demonstration = examples[0] ?? level.items[0];
  const interactive = examples[1] ?? level.items[1] ?? demonstration;
  const labelFor = (entry) => level.bins.find((bin) => bin.id === entry.answer)?.label ?? entry.answer;
  return {
    concept: level.title, intro: level.instruction, mandatory: levelIndex === 0,
    steps: [
      { type: "concept", instruction: level.instruction },
      { type: "demonstration", objectName: demonstration.name, instruction: `${demonstration.name} → ${labelFor(demonstration)}` },
      { type: "interactive", objectName: interactive.name, instruction: `Sort ${interactive.name}!`, allowHints: true },
      { type: "completion", instruction: "You're ready!" },
    ],
  };
}

export const MATH_LEVELS = LEVELS.map((level, index) => ({
  ...level, goal: level.items.length, requiredCorrectPerItem: 1, assetSet: `level${index + 1}`,
  bins: level.bins.map((entry) => ({ ...entry, assetSet: `level${index + 1}` })),
  items: level.items.map((entry) => ({ ...entry, assetSet: `level${index + 1}` })),
  tutorial: buildTutorial(level, index),
}));

export const getLevel = (index) => MATH_LEVELS[index];
