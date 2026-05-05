"use client";

import { useState } from "react";
import { convert } from "@/lib/convert";
import type { Mode } from "@/data/patterns";

const MODES: { id: Mode; label: string; description: string }[] = [
  { id: "business", label: "ビジネス", description: "上司・取引先向け" },
  { id: "sns", label: "SNS", description: "友達・カジュアル" },
  { id: "gentle", label: "やさしい", description: "穏やかに" },
];

export default function Home() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("business");
  const [result, setResult] = useState<{
    output: string;
    hits: { match: string; replacement: string; ng: boolean }[];
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [activeTab, setActiveTab] = useState<"output" | "original">("output");

  const handleConvert = async () => {
    if (!input.trim()) return;
    setIsConverting(true);
    await new Promise((r) => setTimeout(r, 400));
    const r = convert(input, mode);
    setResult(r);
    setActiveTab("output");
    setCopied(false);
    setIsConverting(false);
  };

  const handleReset = () => {
    setResult(null);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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
          {!result ? (
            /* ── 入力フェーズ ── */
            <div key="input">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                言い換えたいテキスト
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="例: あいつマジでうざい、もう無理"
                className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none focus:border-rose-300 focus:bg-white focus:ring-2 focus:ring-rose-100"
                rows={4}
              />

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

              <button
                onClick={handleConvert}
                disabled={!input.trim() || isConverting}
                className="mt-5 w-full rounded-lg bg-rose-500 py-3 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isConverting ? "✨ 変換中..." : "やさしく変換する"}
              </button>
            </div>
          ) : (
            /* ── 結果フェーズ（同じカード内に表示） ── */
            <div key="result" className="animate-result">
              <div className="mb-4 flex gap-1 rounded-lg bg-slate-100 p-1">
                <button
                  onClick={() => setActiveTab("output")}
                  className={`flex-1 rounded-md py-1.5 text-xs font-medium transition ${
                    activeTab === "output"
                      ? "bg-white text-rose-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  ✨ やさしい版
                </button>
                <button
                  onClick={() => setActiveTab("original")}
                  className={`flex-1 rounded-md py-1.5 text-xs font-medium transition ${
                    activeTab === "original"
                      ? "bg-white text-slate-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  元の文
                </button>
              </div>

              {activeTab === "output" ? (
                <div className="mb-4 min-h-[96px] rounded-lg bg-rose-50 p-4 ring-1 ring-rose-100">
                  <div className="mb-1 text-xs font-medium text-rose-400">
                    {MODES.find((m) => m.id === mode)?.label}モード
                  </div>
                  <div className="whitespace-pre-wrap text-sm font-medium text-slate-800">
                    {result.output}
                  </div>
                </div>
              ) : (
                <div className="mb-4 min-h-[96px] rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="mb-1 text-xs font-medium text-slate-400">元の文</div>
                  <div className="whitespace-pre-wrap text-sm text-slate-600">{input}</div>
                </div>
              )}

              {result.hits.length === 0 && (
                <div className="mb-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-700 ring-1 ring-amber-100">
                  辞書に該当する表現が見つかりませんでした。今後 AI 変換に対応予定です。
                </div>
              )}

              <div className="flex gap-2 mb-3">
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

              <button
                onClick={handleReset}
                className="w-full rounded-lg border border-slate-200 py-2 text-xs text-slate-400 hover:text-slate-600 transition"
              >
                ← もう一度入力する
              </button>
            </div>
          )}
        </section>

        <footer className="mt-10 text-center text-xs text-slate-400">
          MVP v0.1 — 入力テキストはサーバーに保存されません
        </footer>
      </div>
    </main>
  );
}
