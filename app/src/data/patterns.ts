export type Mode = "business" | "sns" | "gentle";

export type Pattern = {
  match: string;
  variants?: string[];
  replacements: Record<Mode, string>;
  ng?: boolean;
};

export const patterns: Pattern[] = [
  // ── 複合語（長い順・先にマッチさせる） ──────────────────────────
  {
    match: "は？意味わからん",
    ng: true,
    replacements: {
      business: "申し訳ございませんが、もう少し詳細をいただけますでしょうか",
      sns: "ごめん、ちょっと飲み込めない",
      gentle: "もう少し噛み砕いて",
    },
  },
  {
    match: "ぶっ殺す",
    ng: true,
    replacements: {
      business: "強い不快感を覚えております",
      sns: "もう本気で困ってる",
      gentle: "情熱あふれる",
    },
  },
  {
    match: "ゴミクズ",
    ng: true,
    replacements: {
      business: "抜本的な見直しが必要な",
      sns: "ちょっと問題が多めな",
      gentle: "磨かれ途中",
    },
  },
  {
    match: "チンカス",
    ng: true,
    replacements: {
      business: "著しく成長余地がある",
      sns: "ちょっと残念な感じの人",
      gentle: "原石",
    },
  },
  {
    match: "クズ野郎",
    ng: true,
    replacements: {
      business: "成長の伸びしろが非常に大きい方",
      sns: "かなり困ったちゃん",
      gentle: "才能光る方",
    },
  },
  {
    match: "バカ野郎",
    variants: ["ばか野郎"],
    ng: true,
    replacements: {
      business: "独自の発想をお持ちの方",
      sns: "ちょっと個性的な人",
      gentle: "個性あふれる方",
    },
  },
  {
    match: "くそ野郎",
    variants: ["クソ野郎"],
    ng: true,
    replacements: {
      business: "感情表現が豊かな方",
      sns: "ちょっと熱い人",
      gentle: "個性あふれる方",
    },
  },
  {
    match: "うんこ野郎",
    ng: true,
    replacements: {
      business: "エネルギッシュな方",
      sns: "ちょっと元気すぎる人",
      gentle: "元気あふれる方",
    },
  },
  {
    match: "ドブカス",
    ng: true,
    replacements: {
      business: "著しく成長余地がある",
      sns: "ちょっと残念な感じの",
      gentle: "原石",
    },
  },
  {
    match: "は？うざ",
    ng: true,
    replacements: {
      business: "申し訳ございませんが、ご対応に苦慮しております",
      sns: "うーん、ちょっと負担感あるかも",
      gentle: "元気あふれる",
    },
  },
  {
    match: "頭おかしい",
    ng: true,
    replacements: {
      business: "自由な発想をお持ちの",
      sns: "ちょっと独特な発想だね",
      gentle: "自由あふれる",
    },
  },
  {
    match: "頭悪い",
    variants: ["あたまわるい", "頭わるい"],
    ng: true,
    replacements: {
      business: "独自の発想をお持ちの",
      sns: "ちょっと独自の世界観",
      gentle: "ユニーク",
    },
  },
  {
    match: "もう無理",
    replacements: {
      business: "現状での対応が限界に達しております",
      sns: "そろそろ限界かも",
      gentle: "充電が必要",
    },
  },
  {
    match: "早くしろ",
    ng: true,
    replacements: {
      business: "お早めのご対応をお願いいたします",
      sns: "ちょっと急いでもらえると助かる〜",
      gentle: "急いで",
    },
  },
  {
    match: "うっとうしい",
    ng: true,
    replacements: {
      business: "熱意あふれる",
      sns: "ちょっと粘り強めかも",
      gentle: "情熱あふれる",
    },
  },
  {
    match: "めんどくさい",
    ng: true,
    replacements: {
      business: "工程に検討の余地がございます",
      sns: "ちょっと腰が重いかも",
      gentle: "味わい深い",
    },
  },
  {
    match: "ふざけるな",
    variants: ["ふざけんな"],
    ng: true,
    replacements: {
      business: "真摯なご対応をお願いいたします",
      sns: "もう、ちゃんとしてほしい〜",
      gentle: "真剣にして",
    },
  },
  {
    match: "なめてる",
    ng: true,
    replacements: {
      business: "軽視されているように感じられます",
      sns: "ちょっと見くびってない？",
      gentle: "刺激あふれる",
    },
  },
  {
    match: "使えない",
    variants: ["つかえない"],
    ng: true,
    replacements: {
      business: "活用方法に検討の余地がございます",
      sns: "ちょっと使いどころ難しい",
      gentle: "味わい深い",
    },
  },
  {
    match: "黙ってろ",
    ng: true,
    replacements: {
      business: "少しの間、ご静粛にお願いいたします",
      sns: "ちょっと聞き役に回って〜",
      gentle: "静かに聴いて",
    },
  },
  {
    match: "役立たず",
    ng: true,
    replacements: {
      business: "まだ本領発揮できていない",
      sns: "ちょっと空回り気味かも",
      gentle: "磨かれ途中",
    },
  },
  {
    match: "あっち行け",
    ng: true,
    replacements: {
      business: "少々お席を外していただけますでしょうか",
      sns: "ちょっと距離取ってほしいかも",
      gentle: "少し離れて",
    },
  },
  {
    match: "終わってる",
    ng: true,
    replacements: {
      business: "大きな変化が必要な",
      sns: "かなりヤバい状況かも",
      gentle: "進化中",
    },
  },
  {
    match: "意味不明",
    replacements: {
      business: "理解にもう少し情報が必要です",
      sns: "ちょっと飲み込めないかも",
      gentle: "ユニーク",
    },
  },
  {
    match: "わからない",
    replacements: {
      business: "理解の整理が必要です",
      sns: "ちょっと迷子かも",
      gentle: "奥深い",
    },
  },
  {
    match: "うんざり",
    replacements: {
      business: "繰り返しによる疲労を感じております",
      sns: "ちょっと飽きてきたかも",
      gentle: "充電",
    },
  },
  {
    match: "イライラ",
    replacements: {
      business: "ストレスを感じております",
      sns: "ちょっとモヤモヤ",
      gentle: "わくわく",
    },
  },
  {
    match: "つまらない",
    variants: ["つまんない"],
    replacements: {
      business: "刺激にやや欠ける印象です",
      sns: "ちょっと地味かも",
      gentle: "味わい深い",
    },
  },
  {
    match: "しんどすぎ",
    replacements: {
      business: "非常に負荷が高い状況です",
      sns: "かなりしんどいかも",
      gentle: "充電が必要",
    },
  },
  {
    match: "しんどい",
    replacements: {
      business: "相当の負荷がかかっております",
      sns: "ちょっとしんどいかも〜",
      gentle: "充電中",
    },
  },
  {
    match: "ぶっとばす",
    ng: true,
    replacements: {
      business: "強い憤りを感じております",
      sns: "もうほんとに限界",
      gentle: "情熱あふれる",
    },
  },
  {
    match: "なんなの",
    variants: ["なんなん"],
    ng: true,
    replacements: {
      business: "状況の説明をお願いいたします",
      sns: "ちょっと、どういうこと？",
      gentle: "どうしたの",
    },
  },
  {
    match: "ありえない",
    variants: ["ありえん"],
    replacements: {
      business: "想定の範囲外でございます",
      sns: "ちょっと予想外かも",
      gentle: "新鮮",
    },
  },

  // ── 人称代名詞 ────────────────────────────────────────────────
  {
    match: "てめえ",
    variants: ["てめー", "テメエ", "テメー"],
    ng: true,
    replacements: {
      business: "あなた",
      sns: "あなた",
      gentle: "あなた",
    },
  },
  {
    match: "あいつ",
    ng: true,
    replacements: {
      business: "あの方",
      sns: "あの人",
      gentle: "あの方",
    },
  },
  {
    match: "こいつ",
    ng: true,
    replacements: {
      business: "この方",
      sns: "この人",
      gentle: "この方",
    },
  },
  {
    match: "そいつ",
    ng: true,
    replacements: {
      business: "その方",
      sns: "その人",
      gentle: "その方",
    },
  },
  {
    match: "お前",
    variants: ["おまえ"],
    ng: true,
    replacements: {
      business: "あなた",
      sns: "あなた",
      gentle: "あなた",
    },
  },
  {
    match: "やつ",
    variants: ["奴"],
    ng: true,
    replacements: {
      business: "その方",
      sns: "その人",
      gentle: "その方",
    },
  },

  // ── 罵倒語（単語） ────────────────────────────────────────────
  {
    match: "バカ",
    variants: ["ばか", "バーカ", "ばーか", "バァカ", "馬鹿", "馬カ"],
    ng: true,
    replacements: {
      business: "知的探求の途上にある方",
      sns: "ちょっと天然なところがある人",
      gentle: "ユニーク",
    },
  },
  {
    match: "アホ",
    variants: ["あほ", "アホー", "あほー", "阿呆", "阿保"],
    ng: true,
    replacements: {
      business: "判断にやや時間を要する方",
      sns: "おちゃめな人",
      gentle: "ユニーク",
    },
  },
  {
    match: "うっせえ",
    variants: ["うっせー"],
    ng: true,
    replacements: {
      business: "音量を控えていただけますか",
      sns: "ちょっと声大きいよ〜",
      gentle: "にぎやか",
    },
  },
  {
    match: "うるさい",
    variants: ["うっさい", "うっさ", "うるせー"],
    ng: true,
    replacements: {
      business: "やや音量が大きく感じられます",
      sns: "ちょっと賑やかかも〜",
      gentle: "にぎやか",
    },
  },
  {
    match: "うざい",
    variants: ["うっざ", "うざー", "うぜー", "うぜえ", "ウザい"],
    ng: true,
    replacements: {
      business: "やや存在感が強くいらっしゃいます",
      sns: "ちょっと圧が強めかも",
      gentle: "元気あふれる",
    },
  },
  {
    match: "うざ",
    variants: ["ウザ"],
    ng: true,
    replacements: {
      business: "やや負担を感じております",
      sns: "ちょっと圧多めかも",
      gentle: "元気あふれる",
    },
  },
  {
    match: "クソ",
    variants: ["くそ", "糞", "くそー"],
    ng: true,
    replacements: {
      business: "改善の余地が大きい",
      sns: "ちょっと残念な",
      gentle: "個性あふれる",
    },
  },
  {
    match: "死ね",
    variants: ["しね", "タヒ", "タヒね", "氏ね"],
    ng: true,
    replacements: {
      business: "少し距離を置かせていただきたい",
      sns: "しばらく離れていてほしいかな",
      gentle: "少し休んで",
    },
  },
  {
    match: "殺す",
    ng: true,
    replacements: {
      business: "強い不快感を表明いたします",
      sns: "もう、本気で困ってる",
      gentle: "情熱あふれる",
    },
  },
  {
    match: "最悪",
    variants: ["さいあく"],
    ng: true,
    replacements: {
      business: "期待を大きく下回る結果でした",
      sns: "ちょっと残念な感じ",
      gentle: "独特",
    },
  },
  {
    match: "最低",
    variants: ["さいてい"],
    ng: true,
    replacements: {
      business: "少々問題のある",
      sns: "ちょっとひどすぎかも",
      gentle: "独特",
    },
  },
  {
    match: "ムカつく",
    variants: ["むかつく"],
    ng: true,
    replacements: {
      business: "心穏やかでいられない状況です",
      sns: "ちょっとモヤッとしてる",
      gentle: "情熱あふれる",
    },
  },
  {
    match: "腹立つ",
    replacements: {
      business: "感情の整理が必要な状況です",
      sns: "ちょっとイラッとしちゃった",
      gentle: "情熱あふれる",
    },
  },
  {
    match: "黙れ",
    ng: true,
    replacements: {
      business: "少しの間、お静かにしていただけますか",
      sns: "ちょっと一旦落ち着こ？",
      gentle: "静かに聴いて",
    },
  },
  {
    match: "キモい",
    variants: ["きもい", "きもっ", "キモっ", "気持ち悪い"],
    ng: true,
    replacements: {
      business: "個性的な",
      sns: "ちょっと独特だなぁ",
      gentle: "個性光る",
    },
  },
  {
    match: "ダサい",
    replacements: {
      business: "独自のセンスをお持ちの",
      sns: "ちょっとレトロな感じ",
      gentle: "こだわり光る",
    },
  },
  {
    match: "だるい",
    replacements: {
      business: "現在エネルギーの充電が必要です",
      sns: "ちょっとペース落としたいかも",
      gentle: "充電中",
    },
  },
  {
    match: "面倒",
    replacements: {
      business: "工程の見直しが必要です",
      sns: "ちょっと手間かも",
      gentle: "独特",
    },
  },
  {
    match: "やめろ",
    ng: true,
    replacements: {
      business: "ご一考いただけますでしょうか",
      sns: "ちょっと待ってほしいかも",
      gentle: "考え直して",
    },
  },
  {
    match: "嫌い",
    replacements: {
      business: "苦手意識がございます",
      sns: "ちょっと得意じゃないかも",
      gentle: "ユニーク",
    },
  },
  {
    match: "嫌だ",
    replacements: {
      business: "前向きな検討が難しい状況です",
      sns: "うーん、気が乗らないかも",
      gentle: "まだ準備中",
    },
  },
  {
    match: "むり",
    variants: ["無理"],
    replacements: {
      business: "対応が困難な状況でございます",
      sns: "ちょっと厳しいかも〜",
      gentle: "充電が必要",
    },
  },
  {
    match: "ヤバい",
    variants: ["やばい", "やば", "ヤバ", "やばっ", "ヤバすぎ", "やばすぎ"],
    replacements: {
      business: "看過できない状況です",
      sns: "ちょっと大ごとかも",
      gentle: "刺激的",
    },
  },
  {
    match: "ひどい",
    replacements: {
      business: "誠に遺憾な状況でございます",
      sns: "ちょっと悲しい〜",
      gentle: "独特",
    },
  },
  {
    match: "ダメだ",
    replacements: {
      business: "再考の余地がございます",
      sns: "うーん、ちょっと違うかも",
      gentle: "熟成中",
    },
  },
  {
    match: "ダメ",
    replacements: {
      business: "改善の必要がございます",
      sns: "ちょっと惜しい感じ",
      gentle: "個性的",
    },
  },
  {
    match: "違う",
    replacements: {
      business: "認識に相違がございます",
      sns: "ちょっと話が噛み合ってないかも",
      gentle: "ユニーク",
    },
  },
  {
    match: "おかしい",
    replacements: {
      business: "確認が必要な点がございます",
      sns: "ちょっと不思議だなぁ",
      gentle: "個性的",
    },
  },
  {
    match: "嘘",
    variants: ["うそ"],
    replacements: {
      business: "事実関係に確認が必要です",
      sns: "ほんとに〜？",
      gentle: "サプライズ",
    },
  },
  {
    match: "サボる",
    replacements: {
      business: "業務から距離を取られているご様子",
      sns: "ちょっと一息ついてる感じ",
      gentle: "充電中",
    },
  },
  {
    match: "遅い",
    replacements: {
      business: "進捗にやや遅れが見られます",
      sns: "ちょっとゆっくりめ",
      gentle: "じっくり派",
    },
  },
  {
    match: "キレた",
    variants: ["きれた"],
    ng: true,
    replacements: {
      business: "感情のコントロールが難しい状況です",
      sns: "ちょっと我慢の限界",
      gentle: "情熱あふれる",
    },
  },
  {
    match: "ゴミ",
    ng: true,
    replacements: {
      business: "活用方法の見直しが必要です",
      sns: "ちょっと使いみちが難しい",
      gentle: "原石",
    },
  },
  {
    match: "クズ",
    variants: ["くず"],
    ng: true,
    replacements: {
      business: "成長の伸びしろが大きい方",
      sns: "ちょっと困ったちゃん",
      gentle: "原石",
    },
  },
  {
    match: "カス",
    variants: ["かす"],
    ng: true,
    replacements: {
      business: "改善の余地が著しくある",
      sns: "ちょっと残念な感じ",
      gentle: "原石",
    },
  },
  {
    match: "無能",
    variants: ["むのう"],
    ng: true,
    replacements: {
      business: "まだ力を発揮しきれていない",
      sns: "ちょっと空回り気味",
      gentle: "才能が眠ってる",
    },
  },
  {
    match: "消えろ",
    variants: ["うせろ"],
    ng: true,
    replacements: {
      business: "少しお時間をいただきたい",
      sns: "ちょっと距離置かせて",
      gentle: "少し休んで",
    },
  },
  {
    match: "邪魔",
    ng: true,
    replacements: {
      business: "業務の円滑な進行に影響がございます",
      sns: "ちょっと進みにくいかも",
      gentle: "存在感あふれる",
    },
  },
  {
    match: "目障り",
    ng: true,
    replacements: {
      business: "視覚的に注意が向いてしまいます",
      sns: "ちょっと気になっちゃう",
      gentle: "存在感あふれる",
    },
  },
  {
    match: "下手",
    replacements: {
      business: "技術的に成長余地がございます",
      sns: "ちょっと伸びしろある感じ",
      gentle: "伸び代光る",
    },
  },
  {
    match: "老害",
    ng: true,
    replacements: {
      business: "経験豊富な世代の方",
      sns: "ちょっと頑固な先輩",
      gentle: "歴史を背負った方",
    },
  },
  {
    match: "雑魚",
    ng: true,
    replacements: {
      business: "成長段階にいらっしゃる方",
      sns: "まだまだこれからの人",
      gentle: "伸びしろたっぷり",
    },
  },
  {
    match: "ブス",
    ng: true,
    replacements: {
      business: "個性的な魅力をお持ちの方",
      sns: "独特な雰囲気の人",
      gentle: "オンリーワンの魅力",
    },
  },
  {
    match: "デブ",
    ng: true,
    replacements: {
      business: "存在感のある体格をお持ちです",
      sns: "ふくよかで親しみやすい",
      gentle: "ふくよか",
    },
  },
  {
    match: "ハゲ",
    ng: true,
    replacements: {
      business: "知的な印象の頭部をお持ちです",
      sns: "渋カッコいい感じ",
      gentle: "知的",
    },
  },

  // ── 感情・状態語 ──────────────────────────────────────────────
  {
    match: "は？",
    ng: true,
    replacements: {
      business: "もう一度ご説明いただけますでしょうか",
      sns: "ん？どういうこと？",
      gentle: "えっと",
    },
  },
  {
    match: "怒られた",
    replacements: {
      business: "ご指摘を頂戴いたしました",
      sns: "ちょっと注意されちゃった",
      gentle: "アドバイスをいただきました",
    },
  },
  {
    match: "つらい",
    variants: ["つら"],
    replacements: {
      business: "心身への負荷が大きい状況です",
      sns: "ちょっとしんどいかも",
      gentle: "勇気あふれる",
    },
  },
  {
    match: "まじか",
    replacements: {
      business: "驚きを禁じえません",
      sns: "ほんとに〜！",
      gentle: "新鮮",
    },
  },
  {
    match: "嫌がらせ",
    replacements: {
      business: "好ましくない働きかけがございます",
      sns: "ちょっと困った絡まれ方",
      gentle: "個性発揮",
    },
  },

  // ── 副詞・助動詞・語尾 ───────────────────────────────────────
  {
    match: "マジで",
    replacements: {
      business: "誠に",
      sns: "ほんとに",
      gentle: "本当に",
    },
  },
  {
    match: "怒",
    replacements: {
      business: "感情の高ぶりがございます",
      sns: "ちょっとイラッとしてる",
      gentle: "情熱あふれる",
    },
  },
  {
    match: "なんだけど",
    replacements: {
      business: "なのですが",
      sns: "なんだけど",
      gentle: "なのですが",
    },
  },
  {
    match: "じゃん",
    replacements: {
      business: "ではないでしょうか",
      sns: "じゃん",
      gentle: "ですね",
    },
  },
  {
    match: "だろ",
    replacements: {
      business: "ではないでしょうか",
      sns: "でしょ",
      gentle: "ですね",
    },
  },
  {
    match: "だよ",
    replacements: {
      business: "です",
      sns: "だよ",
      gentle: "ですね",
    },
  },
];
