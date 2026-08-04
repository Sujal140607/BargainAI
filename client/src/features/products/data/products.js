export const PRODUCTS = [
  {
    id: "p-001",
    name: "Noise-Cancelling Headphones",
    description:
      "Over-ear wireless headphones with active noise cancellation and 40-hour battery life.",
    category: "Electronics",
    marketPrice: 249,
    minPrice: 120,
    image: "🎧",
  },
  {
    id: "p-002",
    name: "Smart Fitness Watch",
    description:
      "Track workouts, heart rate, and sleep with a bright AMOLED display.",
    category: "Electronics",
    marketPrice: 199,
    minPrice: 95,
    image: "⌚",
  },
  {
    id: "p-003",
    name: "E-Reader with Glare-Free Display",
    description:
      "Carry your whole library with a lightweight, waterproof e-ink reader.",
    category: "Electronics",
    marketPrice: 149,
    minPrice: 70,
    image: "📚",
  },
  {
    id: "p-004",
    name: "Portable Bluetooth Speaker",
    description:
      "Waterproof speaker with deep bass and 24 hours of playtime.",
    category: "Electronics",
    marketPrice: 129,
    minPrice: 60,
    image: "🔊",
  },
  {
    id: "p-005",
    name: "Leather Biker Jacket",
    description:
      "Genuine leather jacket with quilted lining and a tailored fit.",
    category: "Fashion",
    marketPrice: 299,
    minPrice: 150,
    image: "🧥",
  },
  {
    id: "p-006",
    name: "Retro Running Sneakers",
    description:
      "Classic silhouette with modern cushioning for all-day comfort.",
    category: "Fashion",
    marketPrice: 119,
    minPrice: 55,
    image: "👟",
  },
  {
    id: "p-007",
    name: "Denim Trucker Jacket",
    description:
      "Vintage-wash denim jacket that gets better with every wear.",
    category: "Fashion",
    marketPrice: 89,
    minPrice: 40,
    image: "🪡",
  },
  {
    id: "p-008",
    name: "Espresso Machine",
    description:
      "Home barista kit with 15-bar pump pressure and a milk frother.",
    category: "Home & Kitchen",
    marketPrice: 349,
    minPrice: 180,
    image: "☕",
  },
  {
    id: "p-009",
    name: "Air Fryer XL",
    description:
      "Crispy food with 90% less oil, plus a 6-quart family-sized basket.",
    category: "Home & Kitchen",
    marketPrice: 139,
    minPrice: 65,
    image: "🍟",
  },
  {
    id: "p-010",
    name: "Robot Vacuum",
    description:
      "Self-charging robot vacuum with smart mapping and app control.",
    category: "Home & Kitchen",
    marketPrice: 329,
    minPrice: 160,
    image: "🤖",
  },
  {
    id: "p-011",
    name: "Adjustable Dumbbell Set",
    description:
      "One pair replaces five sets, from 5 lb to 52.5 lb.",
    category: "Sports & Outdoors",
    marketPrice: 279,
    minPrice: 140,
    image: "🏋️",
  },
  {
    id: "p-012",
    name: "Pro Gaming Controller",
    description:
      "Remappable paddles, adjustable triggers, and a 10-hour battery.",
    category: "Gaming",
    marketPrice: 179,
    minPrice: 90,
    image: "🎮",
  },
  {
    id: "p-013",
    name: "Next-Gen Game Console",
    description:
      "4K gaming console with fast SSD storage and ray tracing.",
    category: "Gaming",
    marketPrice: 499,
    minPrice: 260,
    image: "🕹️",
  },
];

export const PRODUCT_CATEGORIES = [
  ...new Set(PRODUCTS.map((product) => product.category)),
];
