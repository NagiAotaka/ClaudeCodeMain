export type Mode = "business" | "sns" | "gentle";

export type Pattern = {
  match: string;
  variants?: string[];
  replacements: Record<Mode, string>;
  ng?: boolean;
};

export const patterns: Pattern[] = [
  {
    match: "は？意味わからん",
    ng: true,
    replacements: {
      business: "申し訳ございませんが、もう少し詳細をいただけますでしょうか",
      sns: "ごめん、ちょっと飲み込めない",
      gentle: "もう少し噛み砕いて教えていただけますか",
    },
  },
  {
    match: "ぶっ殺す",
    ng: true,
    replacements: {
      business: "強い不快感を覚えております",
      sns: "もう本気で困ってる",
      gentle: "心からつらい気持ちです",
    },
  },
  {
    match: "ゴミクズ",
    ng: true,
    replacements: {
      business: "抜本的な見直しが必要です",
      sns: "ちょっと問題が多めかも",
      gentle: "改善の余地がたくさんあります",
    },
  },
  {
    match: "チンカス",
    ng: true,
    replacements: {
      business: "著しく改善の余地がある方",
      sns: "ちょっと残念な感じの人",
      gentle: "もっと輝ける可能性を持つ方",
    },
  },
  {
    match: "クズ野郎",
    ng: true,
    replacements: {
      business: "成長の伸びしろが非常に大きい方",
      sns: "かなり困ったちゃん",
      gentle: "まだ磨かれていない原石",
    },
  },
  {
    match: "は？うざ",
    ng: true,
    replacements: {
      business: "申し訳ございませんが、ご対応に苦慮しております",
      sns: "うーん、ちょっと負担感あるかも",
      gentle: "少し息が詰まる感じです",
    },
  },
  {
    match: "は？",
    ng: true,
    replacements: {
      business: "もう一度ご説明いただけますでしょうか",
      sns: "ん？どういうこと？",
      gentle: "もう少し詳しく教えてください",
    },
  },
  {
    match: "頭おかしい",
    ng: true,
    replacements: {
      business: "発想に驚かされております",
      sns: "ちょっと独特な発想だね",
      gentle: "とても自由な発想ですね",
    },
  },
  {
    match: "頭悪い",
    variants: ["あたまわるい", "頭わるい"],
    ng: true,
    replacements: {
      business: "発想が独創的でいらっしゃいます",
      sns: "ちょっと独自の世界観",
      gentle: "ユニークな考え方をお持ち",
    },
  },
  {
    match: "もう無理",
    replacements: {
      business: "現状での対応が限界に達しております",
      sns: "そろそろ限界かも",
      gentle: "少し休ませてください",
    },
  },
  {
    match: "早くしろ",
    ng: true,
    replacements: {
      business: "お早めのご対応をお願いいたします",
      sns: "ちょっと急いでもらえると助かる〜",
      gentle: "もう少し早めだと嬉しいです",
    },
  },
  {
    match: "うっとうしい",
    ng: true,
    replacements: {
      business: "ご熱心でいらっしゃいます",
      sns: "ちょっと粘り強めかも",
      gentle: "少し情熱的な感じ",
    },
  },
  {
    match: "めんどくさい",
    ng: true,
    replacements: {
      business: "工程に検討の余地がございます",
      sns: "ちょっと腰が重いかも",
      gentle: "少し気力が必要な感じ",
    },
  },
  {
    match: "ふざけるな",
    variants: ["ふざけんな"],
    ng: true,
    replacements: {
      business: "真摯なご対応をお願いいたします",
      sns: "もう、ちゃんとしてほしい〜",
      gentle: "少し真剣にお話ししたいです",
    },
  },
  {
    match: "なめてる",
    ng: true,
    replacements: {
      business: "軽視されているように感じられます",
      sns: "ちょっと見くびってない？",
      gentle: "少し物足りなさを感じています",
    },
  },
  {
    match: "嫌がらせ",
    replacements: {
      business: "好ましくない働きかけがございます",
      sns: "ちょっと困った絡まれ方",
      gentle: "少し心配な状況です",
    },
  },
  {
    match: "使えない",
    variants: ["つかえない"],
    ng: true,
    replacements: {
      business: "活用方法に検討の余地がございます",
      sns: "ちょっと使いどころ難しい",
      gentle: "もう少し工夫が必要かも",
    },
  },
  {
    match: "黙ってろ",
    ng: true,
    replacements: {
      business: "少しの間、ご静粛にお願いいたします",
      sns: "ちょっと聞き役に回って〜",
      gentle: "少し耳を傾けてもらえますか",
    },
  },
  {
    match: "役立たず",
    ng: true,
    replacements: {
      business: "現時点での貢献領域の再定義が必要です",
      sns: "ちょっと空回り気味かも",
      gentle: "まだ力を発揮できる場所を探している方",
    },
  },
  {
    match: "あっち行け",
    ng: true,
    replacements: {
      business: "少々お席を外していただけますでしょうか",
      sns: "ちょっと距離取ってほしいかも",
      gentle: "少しお互いのスペースが必要かな",
    },
  },
  {
    match: "終わってる",
    ng: true,
    replacements: {
      business: "抜本的な改善が必要な状況です",
      sns: "かなりヤバい状況かも",
      gentle: "大きな変化が必要な時期ですね",
    },
  },
  {
    match: "意味不明",
    replacements: {
      business: "理解にもう少し情報が必要です",
      sns: "ちょっと飲み込めないかも",
      gentle: "もう少し教えてもらえると嬉しい",
    },
  },
  {
    match: "わからない",
    replacements: {
      business: "理解の整理が必要です",
      sns: "ちょっと迷子かも",
      gentle: "もう少し考えさせてください",
    },
  },
  {
    match: "うんざり",
    replacements: {
      business: "繰り返しによる疲労を感じております",
      sns: "ちょっと飽きてきたかも",
      gentle: "少し気力が必要な状況",
    },
  },
  {
    match: "イライラ",
    replacements: {
      business: "ストレスを感じております",
      sns: "ちょっとモヤモヤ",
      gentle: "少し心がざわついています",
    },
  },
  {
    match: "つまらない",
    variants: ["つまんない"],
    replacements: {
      business: "刺激にやや欠ける印象です",
      sns: "ちょっと地味かも",
      gentle: "落ち着いた雰囲気ですね",
    },
  },
  {
    match: "しんどすぎ",
    replacements: {
      business: "非常に負荷が高い状況です",
      sns: "かなりしんどいかも",
      gentle: "とても大変な状況ですね",
    },
  },
  {
    match: "しんどい",
    replacements: {
      business: "相当の負荷がかかっております",
      sns: "ちょっとしんどいかも〜",
      gentle: "少し疲れを感じています",
    },
  },
  {
    match: "ぶっとばす",
    ng: true,
    replacements: {
      business: "強い憤りを感じております",
      sns: "もうほんとに限界",
      gentle: "感情の整理が必要な状況です",
    },
  },
  {
    match: "なんなの",
    variants: ["なんなん"],
    ng: true,
    replacements: {
      business: "状況の説明をお願いいたします",
      sns: "ちょっと、どういうこと？",
      gentle: "もう少し教えていただけますか",
    },
  },
  {
    match: "ありえない",
    variants: ["ありえん"],
    replacements: {
      business: "想定の範囲外でございます",
      sns: "ちょっと予想外かも",
      gentle: "少し驚きの展開ですね",
    },
  },
  {
    match: "バカ",
    variants: ["ばか", "バーカ", "ばーか", "バァカ", "馬鹿", "馬カ"],
    ng: true,
    replacements: {
      business: "知的探求の途上にある方",
      sns: "ちょっと天然なところがある人",
      gentle: "少しユニークな考え方をされる方",
    },
  },
  {
    match: "アホ",
    variants: ["あほ", "アホー", "あほー", "阿呆", "阿保"],
    ng: true,
    replacements: {
      business: "判断にやや時間を要する方",
      sns: "おちゃめな人",
      gentle: "ちょっと不思議ちゃん",
    },
  },
  {
    match: "うっせえ",
    variants: ["うっせー"],
    ng: true,
    replacements: {
      business: "音量を控えていただけますか",
      sns: "ちょっと声大きいよ〜",
      gentle: "もう少し穏やかに",
    },
  },
  {
    match: "うるさい",
    variants: ["うっさい", "うっさ", "うるせー"],
    ng: true,
    replacements: {
      business: "やや音量が大きく感じられます",
      sns: "ちょっと賑やかかも〜",
      gentle: "少しお声が響いていますね",
    },
  },
  {
    match: "うざい",
    variants: ["うっざ", "うざー", "うぜー", "うぜえ", "ウザい"],
    ng: true,
    replacements: {
      business: "やや存在感が強くいらっしゃいます",
      sns: "ちょっと圧が強めかも",
      gentle: "少しエネルギッシュな印象",
    },
  },
  {
    match: "うざ",
    variants: ["ウザ"],
    ng: true,
    replacements: {
      business: "やや負担を感じております",
      sns: "ちょっと圧多めかも",
      gentle: "少しエネルギーが強めかな",
    },
  },
  {
    match: "クソ",
    variants: ["くそ", "糞", "くそー"],
    ng: true,
    replacements: {
      business: "改善の余地が大きい",
      sns: "ちょっと残念な",
      gentle: "もう少し頑張れそうな",
    },
  },
  {
    match: "死ね",
    variants: ["しね", "タヒ", "タヒね", "氏ね"],
    ng: true,
    replacements: {
      business: "少々お距離を置かせていただけますと幸いです",
      sns: "しばらく離れていてほしいかな",
      gentle: "少しお互い距離を取りましょう",
    },
  },
  {
    match: "殺す",
    ng: true,
    replacements: {
      business: "強い不快感を表明いたします",
      sns: "もう、本気で困ってる",
      gentle: "心からつらく感じています",
    },
  },
  {
    match: "最悪",
    variants: ["さいあく"],
    ng: true,
    replacements: {
      business: "期待を大きく下回る結果でした",
      sns: "ちょっと残念な感じ",
      gentle: "今回は思うようにいかなかったみたい",
    },
  },
  {
    match: "最低",
    variants: ["さいてい"],
    ng: true,
    replacements: {
      business: "基準を下回っております",
      sns: "ちょっとひどすぎかも",
      gentle: "少し期待と違ってしまいました",
    },
  },
  {
    match: "ムカつく",
    variants: ["むかつく"],
    ng: true,
    replacements: {
      business: "心穏やかでいられない状況です",
      sns: "ちょっとモヤッとしてる",
      gentle: "少し心がざわついています",
    },
  },
  {
    match: "腹立つ",
    replacements: {
      business: "感情の整理が必要な状況です",
      sns: "ちょっとイラッとしちゃった",
      gentle: "少し気持ちが昂っています",
    },
  },
  {
    match: "黙れ",
    ng: true,
    replacements: {
      business: "少しの間、お静かにしていただけますか",
      sns: "ちょっと一旦落ち着こ？",
      gentle: "そっと耳を傾けてみませんか",
    },
  },
  {
    match: "キモい",
    variants: ["きもい", "きもっ", "キモっ", "気持ち悪い"],
    ng: true,
    replacements: {
      business: "個性的でいらっしゃいます",
      sns: "ちょっと独特だなぁ",
      gentle: "とてもオリジナリティのある方",
    },
  },
  {
    match: "ダサい",
    replacements: {
      business: "独自のセンスをお持ちです",
      sns: "ちょっとレトロな感じ",
      gentle: "懐かしさを感じる雰囲気",
    },
  },
  {
    match: "だるい",
    replacements: {
      business: "現在エネルギーの充電が必要です",
      sns: "ちょっとペース落としたいかも",
      gentle: "少し休憩を取りたい気分",
    },
  },
  {
    match: "面倒",
    replacements: {
      business: "工程の見直しが必要です",
      sns: "ちょっと手間かも",
      gentle: "少し時間がかかりそう",
    },
  },
  {
    match: "やめろ",
    ng: true,
    replacements: {
      business: "ご一考いただけますでしょうか",
      sns: "ちょっと待ってほしいかも",
      gentle: "一度立ち止まってみませんか",
    },
  },
  {
    match: "嫌い",
    replacements: {
      business: "苦手意識がございます",
      sns: "ちょっと得意じゃないかも",
      gentle: "少し距離を感じています",
    },
  },
  {
    match: "嫌だ",
    replacements: {
      business: "前向きな検討が難しい状況です",
      sns: "うーん、気が乗らないかも",
      gentle: "ちょっと気持ちの準備が必要",
    },
  },
  {
    match: "むり",
    variants: ["無理"],
    replacements: {
      business: "対応が困難な状況でございます",
      sns: "ちょっと厳しいかも〜",
      gentle: "少し荷が重い感じ",
    },
  },
  {
    match: "ヤバい",
    variants: ["やばい", "やば", "ヤバ", "やばっ", "ヤバすぎ", "やばすぎ"],
    replacements: {
      business: "看過できない状況です",
      sns: "ちょっと大ごとかも",
      gentle: "少し気にかかる事態",
    },
  },
  {
    match: "ひどい",
    replacements: {
      business: "誠に遺憾な状況でございます",
      sns: "ちょっと悲しい〜",
      gentle: "少し心が痛みます",
    },
  },
  {
    match: "ダメだ",
    replacements: {
      business: "再考の余地がございます",
      sns: "うーん、ちょっと違うかも",
      gentle: "もう少し時間が必要かな",
    },
  },
  {
    match: "ダメ",
    replacements: {
      business: "改善の必要がございます",
      sns: "ちょっと惜しい感じ",
      gentle: "もう一歩工夫したい",
    },
  },
  {
    match: "違う",
    replacements: {
      business: "認識に相違がございます",
      sns: "ちょっと話が噛み合ってないかも",
      gentle: "少し方向性が違うようです",
    },
  },
  {
    match: "おかしい",
    replacements: {
      business: "確認が必要な点がございます",
      sns: "ちょっと不思議だなぁ",
      gentle: "少し気になるところがあります",
    },
  },
  {
    match: "嘘",
    variants: ["うそ"],
    replacements: {
      business: "事実関係に確認が必要です",
      sns: "ほんとに〜？",
      gentle: "少し驚きました",
    },
  },
  {
    match: "サボる",
    replacements: {
      business: "業務から距離を取られているご様子",
      sns: "ちょっと一息ついてる感じ",
      gentle: "少し休憩中のようです",
    },
  },
  {
    match: "遅い",
    replacements: {
      business: "進捗にやや遅れが見られます",
      sns: "ちょっとゆっくりめ",
      gentle: "じっくり丁寧に進めていますね",
    },
  },
  {
    match: "キレた",
    variants: ["きれた"],
    ng: true,
    replacements: {
      business: "感情のコントロールが難しい状況です",
      sns: "ちょっと我慢の限界",
      gentle: "気持ちがあふれてしまいました",
    },
  },
  {
    match: "ゴミ",
    ng: true,
    replacements: {
      business: "活用方法の見直しが必要です",
      sns: "ちょっと使いみちが難しい",
      gentle: "別の見方が必要かもしれません",
    },
  },
  {
    match: "クズ",
    variants: ["くず"],
    ng: true,
    replacements: {
      business: "成長の伸びしろが大きい方",
      sns: "ちょっと困ったちゃん",
      gentle: "まだ磨かれていない原石",
    },
  },
  {
    match: "カス",
    variants: ["かす"],
    ng: true,
    replacements: {
      business: "改善の余地が著しくある方",
      sns: "ちょっと残念な人",
      gentle: "まだ本領発揮できていない方",
    },
  },
  {
    match: "無能",
    variants: ["むのう"],
    ng: true,
    replacements: {
      business: "能力発揮の機会をまだお持ちでない方",
      sns: "ちょっと空回り気味",
      gentle: "これから力を伸ばしていける方",
    },
  },
  {
    match: "消えろ",
    variants: ["うせろ"],
    ng: true,
    replacements: {
      business: "しばらくお時間をいただけますでしょうか",
      sns: "ちょっと距離置かせて",
      gentle: "少し一人にさせてください",
    },
  },
  {
    match: "邪魔",
    ng: true,
    replacements: {
      business: "業務の円滑な進行に影響がございます",
      sns: "ちょっと進みにくいかも",
      gentle: "少し立場が重なっていますね",
    },
  },
  {
    match: "目障り",
    ng: true,
    replacements: {
      business: "視覚的に注意が向いてしまいます",
      sns: "ちょっと気になっちゃう",
      gentle: "存在感がありますね",
    },
  },
  {
    match: "下手",
    replacements: {
      business: "技術的に成長余地がございます",
      sns: "ちょっと伸びしろある感じ",
      gentle: "これから上達していきそう",
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
      gentle: "あたたかみのある雰囲気",
    },
  },
  {
    match: "ハゲ",
    ng: true,
    replacements: {
      business: "知的な印象の頭部をお持ちです",
      sns: "渋カッコいい感じ",
      gentle: "落ち着いた大人の魅力",
    },
  },
  {
    match: "つらい",
    variants: ["つら"],
    replacements: {
      business: "心身への負荷が大きい状況です",
      sns: "ちょっとしんどいかも",
      gentle: "大変な思いをされているんですね",
    },
  },
  {
    match: "まじか",
    replacements: {
      business: "驚きを禁じえません",
      sns: "ほんとに〜！",
      gentle: "とても驚きました",
    },
  },
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
      gentle: "少し気持ちが昂っています",
    },
  },
];
