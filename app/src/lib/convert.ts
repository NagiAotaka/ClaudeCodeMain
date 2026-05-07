import { patterns, type Pattern } from "@/data/patterns";

export type ConvertResult = {
  output: string;
  hits: { match: string; replacement: string; ng: boolean }[];
};

type MatchEntry = { key: string; pattern: Pattern };

const staticEntries: MatchEntry[] = [];
for (const p of patterns) {
  staticEntries.push({ key: p.match, pattern: p });
  for (const v of p.variants ?? []) {
    staticEntries.push({ key: v, pattern: p });
  }
}
staticEntries.sort((a, b) => b.key.length - a.key.length);

function buildEntries(extraPatterns: Pattern[]): MatchEntry[] {
  if (extraPatterns.length === 0) return staticEntries;
  const map = new Map<string, Pattern>();
  for (const e of staticEntries) map.set(e.key, e.pattern);
  for (const p of extraPatterns) {
    map.set(p.match, p);
    for (const v of p.variants ?? []) map.set(v, p);
  }
  return Array.from(map.entries())
    .map(([key, pattern]) => ({ key, pattern }))
    .sort((a, b) => b.key.length - a.key.length);
}

export function convert(input: string, extraPatterns: Pattern[] = []): ConvertResult {
  if (!input) return { output: "", hits: [] };

  const entries = buildEntries(extraPatterns);
  let output = input;
  const hits: ConvertResult["hits"] = [];
  const used = new Set<string>();

  for (const { key, pattern } of entries) {
    if (used.has(key)) continue;
    if (output.includes(key)) {
      const replacement = pattern.replacements["gentle"];
      output = output.split(key).join(replacement);
      hits.push({ match: key, replacement, ng: !!pattern.ng });
      used.add(pattern.match);
      for (const v of pattern.variants ?? []) used.add(v);
    }
  }

  return { output, hits };
}

export function maskNgWords(input: string, found: Pattern[]): string {
  let masked = input;
  for (const p of found) {
    if (!p.ng) continue;
    const allKeys = [p.match, ...(p.variants ?? [])];
    for (const key of allKeys) {
      masked = masked.split(key).join("〇".repeat(key.length));
    }
  }
  return masked;
}
