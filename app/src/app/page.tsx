"use client";

import { useState, useEffect } from "react";
import { convert } from "@/lib/convert";

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

  useEffect(() => {
    try {
      setTotalCount(Number(localStorage.getItem(COUNTER_KEY) ?? "0"));
    } catch {}
  }, []);

  const handleConvert = async () => {
    if (!input.trim()) return;
    setAnimating(true);
    await new Promise((r) => setTimeout(r, 325));
    const r = convert(input);
    setInputSnapshot(input);
    setResult(r);
    setCopied(false);
    setFeedback(null);
    setShowBefore(false);
    setAnimating(false);
    try {
      const next = Number(localStorage.getItem(COUNTER_KEY) ?? "0") + 1;
      localStorage.setItem(COUNTER_KEY, String(next));
      setTotalCount(next);
    } catch {}
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
    if (result) {
      try {
        localStorage.setItem(
          `feedback_${Date.now()}`,
          JSON.stringify({ type, output: result.output, ts: Date.now() })
        );
      } catch {}
    }
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
          <div className={animating ? "animate-cloud" : ""}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={PLACEHOLDER}
              className="w-full min-h-[120px] resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none focus:border-rose-300 focus:bg-white focus:ring-2 focus:ring-rose-100"
              rows={5}
            />
          </div>

          {/* 変換結果の表示 */}
          {result && (
            <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="mb-1 text-xs font-medium text-rose-400">変換後</p>
              {result.hits.length === 0 ? (
                <p className="text-xs text-amber-600">
                  辞書に該当する表現が見つかりませんでした。今後 AI
                  変換に対応予定です。
                </p>
              ) : (
                <p className="whitespace-pre-wrap text-sm font-medium text-slate-800">
                  {result.output}
                </p>
              )}
              <button
                onClick={() => setShowBefore(!showBefore)}
                className="mt-3 flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600"
              >
                {showBefore ? "▲ 変換前を隠す" : "▼ 変換前を見る"}
              </button>
              {showBefore && (
                <>
                  <div className="my-3 flex items-center gap-2 text-slate-300">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-base">↑</span>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>
                  <p className="mb-1 text-xs font-medium text-slate-400">変換前</p>
                  <p className="whitespace-pre-wrap text-sm text-slate-500">
                    {inputSnapshot}
                  </p>
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
              <div className="mt-2 flex items-center justify-center gap-3">
                <span className="text-xs text-slate-400">
                  この変換はどうでしたか？
                </span>
                <button
                  onClick={() => handleFeedback("good")}
                  className={`rounded-full px-3 py-1 text-sm transition ${
                    feedback === "good"
                      ? "bg-green-100 text-green-700"
                      : "text-slate-400 hover:text-green-600"
                  }`}
                >
                  👍
                </button>
                <button
                  onClick={() => handleFeedback("bad")}
                  className={`rounded-full px-3 py-1 text-sm transition ${
                    feedback === "bad"
                      ? "bg-red-100 text-red-600"
                      : "text-slate-400 hover:text-red-500"
                  }`}
                >
                  👎
                </button>
              </div>
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
