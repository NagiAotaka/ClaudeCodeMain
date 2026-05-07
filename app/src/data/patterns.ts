export type Pattern = {
  match: string;
  variants?: string[];
  replacement: string;
  ng?: boolean;
};

export const patterns: Pattern[] = [
  // ── 複合語（長い順・先にマッチさせる） ──────────────────────────
  {
    match: "は？意味わからん",
    ng: true,
    replacement: "もう少し噛み砕いて",
  },
  {
    match: "ぶっ殺す",
    ng: true,
    replacement: "情熱あふれる",
  },
  {
    match: "ゴミクズ",
    ng: true,
    replacement: "磨かれ途中",
  },
  {
    match: "チンカス",
    ng: true,
    replacement: "原石",
  },
  {
    match: "クズ野郎",
    ng: true,
    replacement: "才能光る方",
  },
  {
    match: "バカ野郎",
    variants: ["ばか野郎"],
    ng: true,
    replacement: "個性あふれる方",
  },
  {
    match: "くそ野郎",
    variants: ["クソ野郎"],
    ng: true,
    replacement: "個性あふれる方",
  },
  {
    match: "うんこ野郎",
    ng: true,
    replacement: "元気あふれる方",
  },
  {
    match: "ドブカス",
    ng: true,
    replacement: "原石",
  },
  {
    match: "は？うざ",
    ng: true,
    replacement: "元気あふれる",
  },
  {
    match: "頭おかしい",
    ng: true,
    replacement: "自由あふれる",
  },
  {
    match: "頭悪い",
    variants: ["あたまわるい", "頭わるい"],
    ng: true,
    replacement: "ユニーク",
  },
  {
    match: "もう無理",
    replacement: "充電が必要",
  },
  {
    match: "早くしろ",
    ng: true,
    replacement: "急いで",
  },
  {
    match: "うっとうしい",
    ng: true,
    replacement: "情熱あふれる",
  },
  {
    match: "めんどくさい",
    ng: true,
    replacement: "奥行きある",
  },
  {
    match: "ふざけるな",
    variants: ["ふざけんな"],
    ng: true,
    replacement: "真剣にして",
  },
  {
    match: "なめてる",
    ng: true,
    replacement: "自信あふれる",
  },
  {
    match: "使えない",
    variants: ["つかえない"],
    ng: true,
    replacement: "伸びしろ光る",
  },
  {
    match: "黙ってろ",
    ng: true,
    replacement: "静かに聴いて",
  },
  {
    match: "役立たず",
    ng: true,
    replacement: "磨かれ途中",
  },
  {
    match: "あっち行け",
    ng: true,
    replacement: "少し離れて",
  },
  {
    match: "終わってる",
    ng: true,
    replacement: "進化中",
  },
  {
    match: "意味不明",
    replacement: "ユニーク",
  },
  {
    match: "わからない",
    replacement: "奥深い",
  },
  {
    match: "うんざり",
    replacement: "充電",
  },
  {
    match: "イライラ",
    replacement: "熱量",
  },
  {
    match: "つまらない",
    variants: ["つまんない"],
    replacement: "落ち着き光る",
  },
  {
    match: "しんどすぎ",
    replacement: "充電が必要",
  },
  {
    match: "しんどい",
    replacement: "充電中",
  },
  {
    match: "ぶっとばす",
    ng: true,
    replacement: "情熱あふれる",
  },
  {
    match: "なんなの",
    variants: ["なんなん"],
    ng: true,
    replacement: "どうしたの",
  },
  {
    match: "ありえない",
    variants: ["ありえん"],
    replacement: "新鮮",
  },

  // ── 人称代名詞 ────────────────────────────────────────────────
  {
    match: "てめえ",
    variants: ["てめー", "テメエ", "テメー"],
    ng: true,
    replacement: "あなた",
  },
  {
    match: "あいつ",
    ng: true,
    replacement: "あの方",
  },
  {
    match: "こいつ",
    ng: true,
    replacement: "この方",
  },
  {
    match: "そいつ",
    ng: true,
    replacement: "その方",
  },
  {
    match: "お前",
    variants: ["おまえ"],
    ng: true,
    replacement: "あなた",
  },
  {
    match: "やつ",
    variants: ["奴"],
    ng: true,
    replacement: "その方",
  },

  // ── 罵倒語（単語） ────────────────────────────────────────────
  {
    match: "バカ",
    variants: ["ばか", "バーカ", "ばーか", "バァカ", "馬鹿", "馬カ"],
    ng: true,
    replacement: "ユニーク",
  },
  {
    match: "アホ",
    variants: ["あほ", "アホー", "あほー", "阿呆", "阿保"],
    ng: true,
    replacement: "ユニーク",
  },
  {
    match: "うっせえ",
    variants: ["うっせー"],
    ng: true,
    replacement: "にぎやか",
  },
  {
    match: "うるさい",
    variants: ["うっさい", "うっさ", "うるせー"],
    ng: true,
    replacement: "にぎやか",
  },
  {
    match: "うざい",
    variants: ["うっざ", "うざー", "うぜー", "うぜえ", "ウザい"],
    ng: true,
    replacement: "元気あふれる",
  },
  {
    match: "うざ",
    variants: ["ウザ"],
    ng: true,
    replacement: "元気あふれる",
  },
  {
    match: "クソ",
    variants: ["くそ", "糞", "くそー"],
    ng: true,
    replacement: "個性あふれる",
  },
  {
    match: "死ね",
    variants: ["しね", "タヒ", "タヒね", "氏ね"],
    ng: true,
    replacement: "少し休んで",
  },
  {
    match: "殺す",
    ng: true,
    replacement: "情熱あふれる",
  },
  {
    match: "最悪",
    variants: ["さいあく"],
    ng: true,
    replacement: "独特",
  },
  {
    match: "最低",
    variants: ["さいてい"],
    ng: true,
    replacement: "独特",
  },
  {
    match: "ムカつく",
    variants: ["むかつく"],
    ng: true,
    replacement: "情熱あふれる",
  },
  {
    match: "腹立つ",
    replacement: "情熱あふれる",
  },
  {
    match: "黙れ",
    ng: true,
    replacement: "静かに聴いて",
  },
  {
    match: "キモい",
    variants: ["きもい", "きもっ", "キモっ", "気持ち悪い"],
    ng: true,
    replacement: "個性光る",
  },
  {
    match: "ダサい",
    replacement: "こだわり光る",
  },
  {
    match: "だるい",
    replacement: "充電中",
  },
  {
    match: "面倒",
    replacement: "独特",
  },
  {
    match: "やめろ",
    ng: true,
    replacement: "考え直して",
  },
  {
    match: "嫌い",
    replacement: "ユニーク",
  },
  {
    match: "嫌だ",
    replacement: "まだ準備中",
  },
  {
    match: "むり",
    variants: ["無理"],
    replacement: "充電が必要",
  },
  {
    match: "ヤバい",
    variants: ["やばい", "やば", "ヤバ", "やばっ", "ヤバすぎ", "やばすぎ"],
    replacement: "刺激的",
  },
  {
    match: "ひどい",
    replacement: "独特",
  },
  {
    match: "ダメだ",
    replacement: "熟成中",
  },
  {
    match: "ダメ",
    replacement: "個性的",
  },
  {
    match: "違う",
    replacement: "ユニーク",
  },
  {
    match: "おかしい",
    replacement: "個性的",
  },
  {
    match: "嘘",
    variants: ["うそ"],
    replacement: "サプライズ",
  },
  {
    match: "サボる",
    replacement: "充電中",
  },
  {
    match: "遅い",
    replacement: "じっくり派",
  },
  {
    match: "キレた",
    variants: ["きれた"],
    ng: true,
    replacement: "情熱あふれる",
  },
  {
    match: "ゴミ",
    ng: true,
    replacement: "原石",
  },
  {
    match: "クズ",
    variants: ["くず"],
    ng: true,
    replacement: "原石",
  },
  {
    match: "カス",
    variants: ["かす"],
    ng: true,
    replacement: "原石",
  },
  {
    match: "無能",
    variants: ["むのう"],
    ng: true,
    replacement: "才能が眠ってる",
  },
  {
    match: "消えろ",
    variants: ["うせろ"],
    ng: true,
    replacement: "少し休んで",
  },
  {
    match: "邪魔",
    ng: true,
    replacement: "存在感あふれる",
  },
  {
    match: "目障り",
    ng: true,
    replacement: "存在感あふれる",
  },
  {
    match: "下手",
    replacement: "伸び代光る",
  },
  {
    match: "老害",
    ng: true,
    replacement: "歴史を背負った方",
  },
  {
    match: "雑魚",
    ng: true,
    replacement: "伸びしろたっぷり",
  },
  {
    match: "ブス",
    ng: true,
    replacement: "オンリーワンの魅力",
  },
  {
    match: "デブ",
    ng: true,
    replacement: "ふくよか",
  },
  {
    match: "ハゲ",
    ng: true,
    replacement: "知的",
  },

  // ── 感情・状態語 ──────────────────────────────────────────────
  {
    match: "は？",
    ng: true,
    replacement: "えっと",
  },
  {
    match: "怒られた",
    replacement: "アドバイスをいただきました",
  },
  {
    match: "つらい",
    variants: ["つら"],
    replacement: "勇気あふれる",
  },
  {
    match: "まじか",
    replacement: "新鮮",
  },
  {
    match: "嫌がらせ",
    replacement: "個性発揮",
  },

  // ── 副詞・助動詞・語尾 ───────────────────────────────────────
  {
    match: "マジで",
    replacement: "本当に",
  },
  {
    match: "怒",
    replacement: "情熱あふれる",
  },
  {
    match: "なんだけど",
    replacement: "なのですが",
  },
  {
    match: "じゃん",
    replacement: "ですね",
  },
  {
    match: "だろ",
    replacement: "ですね",
  },
  {
    match: "だよ",
    replacement: "ですね",
  },
];
