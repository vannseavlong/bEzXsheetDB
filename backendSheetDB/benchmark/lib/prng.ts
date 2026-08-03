// Deterministic mulberry32 PRNG so benchmark data is reproducible across runs
// (same seed -> same generated rows), without pulling in a faker dependency.
export function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CATEGORIES = ['electronics', 'apparel', 'grocery', 'home', 'toys'] as const;
const ADJECTIVES = ['Compact', 'Premium', 'Classic', 'Portable', 'Deluxe', 'Standard', 'Rugged', 'Lightweight'];
const NOUNS = ['Widget', 'Gadget', 'Component', 'Assembly', 'Module', 'Kit', 'Unit', 'Device'];

export interface BenchmarkRow {
  title: string;
  description: string;
  price: number;
  stock: number;
  active: boolean;
  category: string;
  rating: number;
  featured: boolean;
  tags: string[];
  notes: string;
  created_by: string;
}

/** Generates one synthetic row's worth of field values (everything except the key/sku/run_id). */
export function makeRow(rand: () => number, index: number): BenchmarkRow {
  const adjective = ADJECTIVES[Math.floor(rand() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(rand() * NOUNS.length)];
  return {
    title: `${adjective} ${noun} ${index}`,
    description: `Synthetic benchmark record #${index} generated for thesis load testing.`,
    price: Math.round(rand() * 10000) / 100,
    stock: Math.floor(rand() * 5000),
    active: rand() > 0.15,
    category: CATEGORIES[Math.floor(rand() * CATEGORIES.length)],
    rating: Math.round(rand() * 50) / 10,
    featured: rand() > 0.8,
    tags: [CATEGORIES[Math.floor(rand() * CATEGORIES.length)], `batch-${Math.floor(index / 1000)}`],
    notes: '',
    created_by: 'benchmark-suite',
  };
}
