export interface Poem {
  id: string;
  title: string;
  content: string;
  author: 'me' | 'mom' | 'dad';
  date: string;
  tags: string[];
  favorite: boolean;
}

const STORAGE_KEY = 'family-poems';

const defaultPoems: Poem[] = [
  {
    id: '1',
    title: 'Morning Light',
    content: `The sun peels back the night\nlike a letter long awaited,\nspilling gold across the kitchen floor\nwhere coffee steams\nand silence speaks\nin the language of beginnings.\n\nI hold this moment\nlike a breath held underwater—\nknowing it will pass,\nbut grateful\nfor the weight of it.`,
    author: 'me',
    date: '2024-12-15',
    tags: ['morning', 'reflection'],
    favorite: false,
  },
  {
    id: '2',
    title: 'The Garden She Keeps',
    content: `Her hands know the earth\nthe way a river knows its bed—\nnot by memory,\nbut by surrender.\n\nShe plants marigolds\nwhere grief once grew,\nand calls it healing.\n\nI call it magic.`,
    author: 'mom',
    date: '2024-11-20',
    tags: ['nature', 'love'],
    favorite: true,
  },
  {
    id: '3',
    title: 'Old Roads',
    content: `I drove the road I drove at seventeen,\nthe one that bends where the oak\nstill refuses to fall.\n\nThe fields have changed—\nnew fences, new faces—\nbut the sky remembers.\n\nAnd so do I,\nthough my hands are slower now\nand the radio plays songs\nI once thought I'd never forget.`,
    author: 'dad',
    date: '2024-10-05',
    tags: ['memory', 'time'],
    favorite: false,
  },
  {
    id: '4',
    title: 'Unfinished Letters',
    content: `I started writing to you\nbut the words kept arriving\nout of order—\n\nlove before hello,\ngoodbye before the middle,\nand somewhere in between,\na silence that said everything.`,
    author: 'me',
    date: '2025-01-10',
    tags: ['love', 'words'],
    favorite: true,
  },
  {
    id: '5',
    title: 'Kitchen Hymn',
    content: `The dough rises like a prayer\nunder her patient hands.\nFlour dusts the counter\nlike the first snow of December.\n\nShe hums a tune\nthat has no name—\njust the sound of a woman\nwho has made peace\nwith time.`,
    author: 'mom',
    date: '2025-02-14',
    tags: ['home', 'peace'],
    favorite: false,
  },
  {
    id: '6',
    title: 'The Workshop',
    content: `Sawdust remembers\nwhat hands have shaped—\neach curl a sentence,\neach groove a story told\nin the dialect of cedar and pine.\n\nHe measures twice,\ncuts once,\nand calls it patience.\n\nI call it love\nwith calloused hands.`,
    author: 'dad',
    date: '2025-01-28',
    tags: ['craft', 'father'],
    favorite: true,
  },
];

export function getPoems(): Poem[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPoems));
  return defaultPoems;
}

export function savePoems(poems: Poem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(poems));
}

export function addPoem(poem: Omit<Poem, 'id'>): Poem {
  const poems = getPoems();
  const newPoem = { ...poem, id: Date.now().toString() };
  poems.unshift(newPoem);
  savePoems(poems);
  return newPoem;
}

export function updatePoem(id: string, updates: Partial<Poem>) {
  const poems = getPoems();
  const idx = poems.findIndex(p => p.id === id);
  if (idx !== -1) {
    poems[idx] = { ...poems[idx], ...updates };
    savePoems(poems);
  }
}

export function deletePoem(id: string) {
  const poems = getPoems().filter(p => p.id !== id);
  savePoems(poems);
}

export function toggleFavorite(id: string) {
  const poems = getPoems();
  const idx = poems.findIndex(p => p.id === id);
  if (idx !== -1) {
    poems[idx].favorite = !poems[idx].favorite;
    savePoems(poems);
  }
}

export const authorLabels: Record<string, string> = {
  me: 'My Poems',
  mom: "Mom's Poems",
  dad: "Dad's Poems",
};

export const authorDescriptions: Record<string, string> = {
  me: 'Verses from my heart, capturing moments and musings.',
  mom: 'Words of wisdom, warmth, and the beauty she sees in everyday life.',
  dad: 'Stories of time, memory, and the quiet strength of fatherhood.',
};
