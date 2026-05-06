"use client";

import { useState } from "react";
import { convert } from "@/lib/convert";
import type { Mode } from "@/data/patterns";

const MODES: { id: Mode; label: string; description: string }[] = [
  { id: "business", label: "ビジネス", description: "上司・取引先向け" },
  { id: "sns", label: "SNS", description: "友達・カジュアル" },
  { id: "gentle", label: "やさしい", description: "穏やかに" },
];

const TEXT_AREA_CLASS =
  "w-full min-h-[120px] resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none";

export default function Home() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("business");
  const [result, setResult] = useState<{
    output: string;
    hits: { match: string; replacement: string; ng: boolean }[];
  } | null>(null);
  const [activeTab, setActiveTab] = useState<"before" | "after">("before");
  const [animating, setAnimating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [aiToast, setAiToast] = useState(false);
  const [feedback, setFeedback] = useState<"good" | "bad" | null>(null);

  const handleConvert = async () => {
    if (!input.trim()) return;
    setAnimating(true);
    await new Promise((r) => setTimeout(r, 325));
    const r = convert(input, mode);
    setResult(r);
    setActiveTab("after");
    setCopied(false);
    setFeedback(null);
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
    if (result) {
      try {
        const key = `feedback_${Date.now()}`;
        localStorage.setItem(key, JSON.stringify({ type, output: result.output, ts: Date.now() }));
      } catch {}
    }
  };

  const handleShare = () => {
    if (!result) return;
    const text = `${result.output}\n\n#やさしいフレーズ`;
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
        </header>

        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          {/* タブ */}
          <div className="mb-4 flex gap-1 rounded-lg bg-slate-100 p-1">
            <button
              onClick={() => setActiveTab("before")}
              className={`flex-1 rounded-md py-1.5 text-xs font-medium transition ${
                activeTab === "before"
                  ? "bg-white text-slate-700 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              変換前
            </button>
            <button
              onClick={() => result && setActiveTab("after")}
              disabled={!result}
              className={`flex-1 rounded-md py-1.5 text-xs font-medium transition ${
                activeTab === "after"
                  ? "bg-white text-rose-600 shadow-sm"
                  : result
                  ? "text-slate-400 hover:text-slate-600"
                  : "text-slate-300 cursor-not-allowed"
              }`}
            >
              ✨ 変換後
            </button>
          </div>

          {/* テキストエリア（共通UI） */}
          <div className={animating ? "animate-cloud" : ""}>
            {activeTab === "before" ? (
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="例: あいつマジでうざい、もう無理"
                className={`${TEXT_AREA_CLASS} focus:border-rose-300 focus:bg-white focus:ring-2 focus:ring-rose-100`}
                rows={5}
              />
            ) : (
              <div className={`${TEXT_AREA_CLASS} bg-rose-50 border-rose-100`}>
                {result?.hits.length === 0 ? (
                  <span className="text-amber-600 text-xs">
                    辞書に該当する表現が見つかりませんでした。今後 AI 変換に対応予定です。
                  </span>
                ) : (
                  <span className="whitespace-pre-wrap">{result?.output}</span>
                )}
              </div>
            )}
          </div>

          {/* モード選択 */}
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-slate-700">変換モード</p>
            <div className="grid grid-cols-3 gap-2">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`rounded-lg border p-2 text-sm transition ${
                    mode === m.id
                      ? "border-rose-400 bg-rose-50 text-rose-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <div className="font-medium">{m.label}</div>
                  <div className="text-xs opacity-70">{m.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* AIモード予告 */}
          <div className="mt-3 relative">
            <button
              onClick={handleAiModeClick}
              className="w-full rounded-lg border border-dashed border-slate-200 bg-slate-50 p-3 text-left opacity-60 cursor-pointer hover:opacity-75 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-500">✨ AI変換モード</span>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">近日公開</span>
                </div>
              </div>
              <p className="mt-1 text-xs text-slate-400">より自然で文脈を読んだ変換が可能になります</p>
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
            className="mt-5 w-full rounded-lg bg-rose-500 py-3 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {animating ? "✨ 変換中..." : "やさしく変換する"}
          </button>

          {/* コピー・シェア・フィードバックボタン（変換後のみ） */}
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
              <div className="mt-2 flex items-center justify-center gap-3">
                <span className="text-xs text-slate-400">この変換はどうでしたか？</span>
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
