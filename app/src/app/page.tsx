"use client";

import { useState, useEffect, useRef } from "react";
import { convert } from "@/lib/convert";
import type { Pattern } from "@/data/patterns";

const PLACEHOLDER = "例: あの人、ちょっとうるさいな…";
const COUNTER_KEY = "yasashii_total_count";

export default function Home() {
  const [input, setInput] = useState("");
  const [inputSnapshot, setInputSnapshot] = useState("");
  const [result, setResult] = useState<{
    output: string;
    hits: { match: string; replacement: string; ng: boolean }[];
  } | null>(null);
  const [animating, setAnimating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [aiToast, setAiToast] = useState(false);
  const [feedback, setFeedback] = useState<"good" | "bad" | null>(null);
  const [shareCompare, setShareCompare] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [showBefore, setShowBefore] = useState(false);
  const [learnedPatterns, setLearnedPatterns] = useState<Pattern[]>([]);
  const animatingRef = useRef(false);

  useEffect(() => {
    try {
      setTotalCount(Number(localStorage.getItem(COUNTER_KEY) ?? "0"));
    } catch {}

    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (!key?.startsWith("feedback_")) continue;
        const data = JSON.parse(localStorage.getItem(key) ?? "{}");
        if (!data.input) localStorage.removeItem(key);
      }
    } catch {}

    fetch("/learned-patterns.json")
      .then((r) => r.json())
      .then((data: Pattern[]) => {
        if (Array.isArray(data) && data.length > 0) setLearnedPatterns(data);
      })
      .catch(() => {});
  }, []);

  const handleConvert = async () => {
    if (!input.trim() || animatingRef.current) return;
    animatingRef.current = true;
    setAnimating(true);

    const r = convert(input, learnedPatterns);
    const original = input;
    setInputSnapshot(original);
    setResult(r);
    setCopied(false);
    setFeedback(null);
    setShowBefore(false);

    try {
      const next = Number(localStorage.getItem(COUNTER_KEY) ?? "0") + 1;
      localStorage.setItem(COUNTER_KEY, String(next));
      setTotalCount(next);
    } catch {}

    if (r.hits.length > 0) {
      const states: string[] = [original];
      let current = original;
      for (const hit of r.hits) {
        current = current.split(hit.match).join(hit.replacement);
        states.push(current);
      }
      const delay = Math.max(180, Math.min(450, 1100 / r.hits.length));
      for (let i = 1; i < states.length; i++) {
        await new Promise<void>((resolve) => setTimeout(resolve, delay));
        setInput(states[i]);
      }
    }

    animatingRef.current = false;
    setAnimating(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleAiModeClick = () => {
    setAiToast(true);
    setTimeout(() => setAiToast(false), 2000);
  };

  const handleFeedback = (type: "good" | "bad") => {
    setFeedback(type);
    if (!result) return;
    try {
      localStorage.setItem(
        `feedback_${Date.now()}`,
        JSON.stringify({
          type,
          input: inputSnapshot,
          output: result.output,
          hits: result.hits,
          ts: Date.now(),
        })
      );
    } catch {}
  };

  const handleShare = () => {
    if (!result) return;
    const text = shareCompare
      ? `「${inputSnapshot}」\n↓\n「${result.output}」\n\n#やさしいフレーズ`
      : `${result.output}\n\n#やさしいフレーズ`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-sky-50">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:py-16">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800 sm:text-4xl">
            やさしいフレーズ
          </h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            送る前に、ちょっとやさしく言い換える
          </p>
          {totalCount > 0 && (
            <p className="mt-1 text-xs text-slate-400">
              これまでに{" "}
              <span className="font-semibold text-rose-400">
                {totalCount.toLocaleString()}
              </span>{" "}
              件変換されました
            </p>
          )}
        </header>

        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          {/* 入力エリア */}
          <textarea
            value={input}
            onChange={(e) => !animating && setInput(e.target.value)}
            placeholder={PLACEHOLDER}
            readOnly={animating}
            className={`w-full min-h-[120px] resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none transition focus:border-rose-300 focus:bg-white focus:ring-2 focus:ring-rose-100 ${
              animating ? "cursor-wait opacity-75" : ""
            }`}
            rows={5}
          />

          {/* 変換結果エリア */}
          {result && (
            <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
              {result.hits.length === 0 ? (
                <p className="text-xs text-amber-600">
                  辞書に該当する表現が見つかりませんでした。今後 AI
                  変換に対応予定です。
                </p>
              ) : (
                <>
                  <button
                    onClick={() => setShowBefore(!showBefore)}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600"
                  >
                    {showBefore ? "▲ 変換前を隠す" : "▼ 変換前を見る"}
                  </button>
                  {showBefore && (
                    <div className="mt-3">
                      <p className="mb-1 text-xs font-medium text-slate-400">変換前</p>
                      <p className="whitespace-pre-wrap text-sm text-slate-500">
                        {inputSnapshot}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* AIモード予告 */}
          <div className="relative mt-4">
            <button
              onClick={handleAiModeClick}
              className="w-full cursor-pointer rounded-lg border border-dashed border-slate-200 bg-slate-50 p-3 text-left opacity-60 transition hover:opacity-75"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-500">
                  ✨ AI変換モード
                </span>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                  近日公開
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                より自然で文脈を読んだ変換が可能になります
              </p>
            </button>
            {aiToast && (
              <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-white shadow-lg">
                有料プランで利用可能になります
              </div>
            )}
          </div>

          {/* 変換ボタン */}
          <button
            onClick={handleConvert}
            disabled={!input.trim() || animating}
            className="mt-4 w-full rounded-lg bg-rose-500 py-3 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {animating ? "✨ 変換中..." : "やさしく変換する"}
          </button>

          {/* コピー・シェア・フィードバック（変換後のみ） */}
          {result && (
            <>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex-1 rounded-lg border border-slate-200 bg-white py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {copied ? "コピーしました ✓" : "コピー"}
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 rounded-lg bg-sky-500 py-2 text-sm font-medium text-white hover:bg-sky-600"
                >
                  X にシェア
                </button>
              </div>

              {/* シェアトグル */}
              <div className="mt-2 flex items-center justify-end gap-2">
                <span className="text-xs text-slate-400">シェア内容:</span>
                <div className="flex overflow-hidden rounded-md border border-slate-200 bg-white text-xs">
                  <button
                    onClick={() => setShareCompare(false)}
                    className={`px-2.5 py-1 transition ${
                      !shareCompare
                        ? "bg-sky-500 text-white"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    変換後のみ
                  </button>
                  <button
                    onClick={() => setShareCompare(true)}
                    className={`px-2.5 py-1 transition ${
                      shareCompare
                        ? "bg-sky-500 text-white"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    前後比較
                  </button>
                </div>
              </div>

              {/* フィードバック */}
              {!feedback ? (
                <div className="mt-2 flex items-center justify-center gap-3">
                  <span className="text-xs text-slate-400">
                    この変換はどうでしたか？
                  </span>
                  <button
                    onClick={() => handleFeedback("good")}
                    className="rounded-full px-3 py-1 text-sm text-slate-400 transition hover:text-green-600"
                  >
                    👍
                  </button>
                  <button
                    onClick={() => handleFeedback("bad")}
                    className="rounded-full px-3 py-1 text-sm text-slate-400 transition hover:text-red-500"
                  >
                    👎
                  </button>
                </div>
              ) : (
                <p className="mt-2 text-center text-xs text-slate-400">
                  使っていただきありがとうございます
                </p>
              )}
            </>
          )}
        </section>

        <footer className="mt-10 text-center text-xs text-slate-400">
          MVP v0.1 — 入力テキストはサーバーに保存されません
        </footer>
      </div>
    </main>
  );
}
