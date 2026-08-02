import { faqs, type FaqEntry } from "./faq"

const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "do", "does", "did", "can", "could", "should",
  "would", "i", "you", "your", "my", "me", "it", "its", "this", "that", "these", "those", "of",
  "for", "to", "in", "on", "with", "about", "how", "what", "where", "when", "why", "who", "which",
  "and", "or", "if", "will", "have", "has", "had", "be", "been", "being", "get", "got", "just",
  "please", "hi", "hello", "hey", "there", "need", "want", "know", "tell", "us", "we", "our", "so",
  "any", "some", "im", "ive", "youre", "does", "doesn't", "doesnt", "not", "no", "still", "available",
  "actually", "really", "guys",
])

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
}

function significantTokens(text: string): string[] {
  return tokenize(text).filter((t) => !STOPWORDS.has(t))
}

export type FaqMatch = { entry: FaqEntry; score: number; confidence: number }

// Precomputed per-entry vocab of meaningful (non-stopword) terms, built from
// both the question and every keyword phrase, so paraphrases of either match.
const entryVocab = new Map<string, Set<string>>(
  faqs.map((entry) => {
    const vocab = new Set<string>(significantTokens(entry.question))
    for (const phrase of entry.keywords) {
      for (const t of significantTokens(phrase)) vocab.add(t)
    }
    return [entry.id, vocab]
  }),
)

// Words shared across several topics (e.g. "deal", "order" — inevitable on a
// deals site) are weak evidence alone; words unique to one topic are strong.
const wordDocFreq = new Map<string, number>()
for (const vocab of entryVocab.values()) {
  for (const word of vocab) wordDocFreq.set(word, (wordDocFreq.get(word) ?? 0) + 1)
}
function wordWeight(word: string): number {
  const df = wordDocFreq.get(word) ?? 1
  return df <= 1 ? 2 : df === 2 ? 1 : 0.5
}

/**
 * Scores every FAQ entry against the query and returns the best match, or null
 * if nothing clears the confidence bar (caller should escalate to a human in that case).
 */
export function matchFaq(query: string): FaqMatch | null {
  const queryTokens = new Set(tokenize(query))
  const querySignificant = significantTokens(query)
  const querySignificantSet = new Set(querySignificant)
  if (querySignificant.length === 0) return null

  let best: { entry: FaqEntry; score: number } | null = null

  for (const entry of faqs) {
    const vocab = entryVocab.get(entry.id)!
    let score = 0

    // Base score: how many meaningful query words this entry's vocab recognizes,
    // weighted down for words that are ambiguous across multiple topics.
    for (const t of querySignificantSet) {
      if (vocab.has(t)) score += wordWeight(t)
    }

    // Bonus: a whole keyword phrase matched verbatim (as a set of words) — a much
    // stronger signal than scattered word overlap, so it counts even for phrases
    // with only one distinctive word (the rest being connective/stopwords).
    for (const phrase of entry.keywords) {
      const meaningfulPhraseTokens = significantTokens(phrase)
      const phraseTokens = tokenize(phrase)
      if (phraseTokens.length < 2 || meaningfulPhraseTokens.length < 1) continue
      if (phraseTokens.every((t) => queryTokens.has(t))) {
        score += meaningfulPhraseTokens.length * 1.5
      }
    }

    if (score > 0 && (!best || score > best.score)) {
      best = { entry, score }
    }
  }

  if (!best) return null

  const confidence = best.score / Math.max(querySignificant.length, 3)
  if (confidence < 0.55) return null

  return { ...best, confidence }
}
