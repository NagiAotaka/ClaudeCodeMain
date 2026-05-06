import { patterns, type Pattern } from "@/data/patterns";

export type ConvertResult = {
  output: string;
  hits: { match: string; replacement: string; ng: boolean }[];
};

type MatchEntry = { key: string; pattern: Pattern };

const matchEntries: MatchEntry[] = [];
for (const p of patterns) {
  matchEntries.push({ key: p.match, pattern: p });
  for (const v of p.variants ?? []) {
    matchEntries.push({ key: v, pattern: p });
  }
}
matchEntries.sort((a, b) => b.key.length - a.key.length);

export function convert(input: string): ConvertResult {
  if (!input) return { output: "", hits: [] };

  let output = input;
  const hits: ConvertResult["hits"] = [];
  const used = new Set<string>();

  for (const { key, pattern } of matchEntries) {
    if (used.has(key)) continue;
    if (output.includes(key)) {
      const replacement = pattern.replacements["gentle"];
      output = output.split(key).join(replacement);
      hits.push({
        match: key,
        replacement,
        ng: !!pattern.ng,
      });
      used.add(key);
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
