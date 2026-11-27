import type { GrimoireEntry, SearchSuggestion } from '../types/grimoire'

export const QUICK_SUGGESTIONS: SearchSuggestion[] = [
  { label: 'Spell to make a field of flowers', query: 'Field of flowers' },
  { label: 'Blue Moon Weed', query: 'Blue Moon Weed' },
  { label: 'Zoltraak', query: 'Zoltraak' },
  { label: 'Aureole (Ende)', query: 'Aureole' },
]

export const GRIMOIRE_ARCHIVE: GrimoireEntry[] = [
  {
    id: 'field-of-flowers',
    title: 'A Spell to Make a Field of Flowers',
    category: "Folk Magic · Flamme's Legacy",
    era: 'Mythical Era',
    excerpt:
      'Passed down from the Great Mage Flamme to her apprentice Frieren. Though dismissed by combat mages as frivolous, it was the spell that brought Himmel and Frieren together—blooming any flower the caster remembers vividly.',
    tags: ['flower', 'field', 'flamme', 'himmel', 'blue moon weed', 'folk', 'spell'],
  },
  {
    id: 'blue-moon-weed',
    title: 'Blue Moon Weed (Sougetsu-sou)',
    category: 'Botanical Lore · Northern Plateau',
    era: 'Rare Flora',
    excerpt:
      'A luminous azure flower native to Himmel’s hometown. Once thought extinct outside hidden valleys, its pale blue petals softly refract moonlight and symbolize enduring memory across centuries.',
    tags: ['blue', 'moon', 'weed', 'flower', 'himmel', 'flora', 'petal'],
  },
  {
    id: 'zoltraak',
    title: 'Zoltraak — Ordinary Offensive Magic',
    category: 'Combat Grimoire · Continental Magic Assoc.',
    era: '80 Years Ago → Modern',
    excerpt:
      'Originally devised by Qual, the Elder Sage of Corruption, as the first piercing killing spell. Analyzed and adapted by humanity during Frieren’s era, it is now taught to every apprentice as fundamental offensive magic.',
    tags: ['zoltraak', 'qual', 'offensive', 'magic', 'combat', 'fern', 'spell'],
  },
  {
    id: 'aureole',
    title: 'Aureole — The Land Where Souls Rest',
    category: 'Geography · Ende, Northernmost Tip',
    era: 'Current Destination',
    excerpt:
      'Situated at the northernmost reaches of the continent where the Demon King’s castle once stood. Legends preserved in Flamme’s authentic notes say travelers may converse with the departed there.',
    tags: ['aureole', 'ende', 'north', 'souls', 'himmel', 'journey', 'flamme'],
  },
  {
    id: 'remove-rust',
    title: 'Spell to Remove Rust from Bronze Statues',
    category: 'Folk Magic · Restoration',
    era: 'First-Class Archive',
    excerpt:
      'A gentle, practical incantation acquired during a quiet village errand. Restores weathered bronze monuments to their original luster without disturbing the moss growing gently at their base.',
    tags: ['rust', 'statue', 'himmel', 'folk', 'spell', 'village'],
  },
  {
    id: 'mana-concealment',
    title: 'Mana Concealment & Suppression',
    category: 'Arcane Discipline · Advanced',
    era: '1,000+ Years of Practice',
    excerpt:
      "The lifelong discipline of continuously restraining one's visible aura to a fraction of its true scale. Requires unwavering focus even while asleep, designed solely to deceive demons who judge strength by mana.",
    tags: ['mana', 'concealment', 'suppression', 'aura', 'flamme', 'frieren', 'demon'],
  },
]

export function searchGrimoireArchive(query: string): GrimoireEntry[] {
  const q = query.toLowerCase()
  const matches = GRIMOIRE_ARCHIVE.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.excerpt.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.tags ?? []).some((tag) => tag.includes(q) || q.includes(tag)),
  )

  if (matches.length > 0) {
    return matches
  }

  return [
    {
      id: `compendium-${q}`,
      title: `Compendium Entry: "${query}"`,
      category: 'Folk Magic · Uncatalogued Manuscript',
      era: 'Central Lands Archive',
      excerpt: `A weathered parchment referencing "${query}" discovered in a quiet roadside bookstore. Though faded by decades of rain and travel, faint traces of mana still linger along its margins.`,
    },
    {
      id: `footnotes-${q}`,
      title: `Traveler's Footnotes on ${query}`,
      category: 'Journey Chronicle · First-Class Mage Notes',
      era: 'Recent Recording',
      excerpt: `Marginalia written during a northern stopover: "People often forget small details like ${query}, yet taking the time to look for them is half the reason we travel at all."`,
    },
  ]
}
