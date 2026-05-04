import { patterns, type Mode, type Pattern } from "@/data/patterns";

export type ConvertResult = {
  output: string;
  hits: { match: string; replacement: string; ng: boolean }[];
};

const sortedPatterns = [...patterns].sort(
  (a, b) => b.match.length - a.match.length,
);

export function convert(input: string, mode: Mode): ConvertResult {
  if (!input) return { output: "", hits: [] };

  let output = input;
  const hits: ConvertResult["hits"] = [];
  const used = new Set<string>();

  for (const pattern of sortedPatterns) {
    if (used.has(pattern.match)) continue;
    if (output.includes(pattern.match)) {
      const replacement = pattern.replacements[mode];
      output = output.split(pattern.match).join(replacement);
      hits.push({
        match: pattern.match,
        replacement,
        ng: !!pattern.ng,
      });
      used.add(pattern.match);
    }
  }

  return { output, hits };
}

export function maskNgWords(input: string, found: Pattern[]): string {
  let masked = input;
  for (const p of found) {
    if (!p.ng) continue;
    const replacement = "〇".repeat(p.match.length);
    masked = masked.split(p.match).join(replacement);
  }
  return masked;
}
