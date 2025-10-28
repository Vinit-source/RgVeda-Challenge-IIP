
import type { HymnChunk, Topic } from '../types';

export const TOPICS: Topic[] = [
    {
        title: "Agni, The Divine Messenger",
        description: "Explore hymns to the god of fire, the priest of the gods and messenger for the sacrifice.",
        keywords: ["agni", "fire", "priest", "messenger", "अग्नि"],
        image: "https://picsum.photos/seed/agni/600/400"
    },
    {
        title: "Indra, Vayu & Varuna",
        description: "Hear praises for the gods of storms, wind, and the cosmic waters.",
        keywords: ["indra", "vayu", "varuna", "wind", "storm", "इंद्र", "वायु", "वरुण"],
        image: "https://picsum.photos/seed/indra-vayu/600/400"
    },
    {
        title: "The Ashvins, Divine Twins",
        description: "Discover the benevolent twin horsemen associated with dawn, healing, and rescue.",
        keywords: ["ashvin", "ashvins", "twins", "healing", "अश्विनीकुमार"],
        image: "https://picsum.photos/seed/ashvins/600/400"
    },
    {
        title: "Saraswati, River of Inspiration",
        description: "Invoke the goddess of knowledge, music, art, and the sacred river.",
        keywords: ["saraswati", "river", "knowledge", "goddess", "सरस्वती"],
        image: "https://picsum.photos/seed/saraswati/600/400"
    },
    {
        title: "The Maruts, Storm Deities",
        description: "Tales of the fierce storm gods who ride with Indra, wielding lightning and thunder.",
        keywords: ["maruts", "storm", "rudra", "wind", "मरुत"],
        image: "https://picsum.photos/seed/maruts/600/400"
    },
    {
        title: "Ushas, The Dawn",
        description: "Behold the beauty of the goddess of dawn who brings light and life to the world.",
        keywords: ["ushas", "dawn", "light", "उषा"],
        image: "https://picsum.photos/seed/ushas/600/400"
    }
];

export const getTopicByTitle = (title: string): Topic | undefined => TOPICS.find(t => t.title === title);

// A small, representative dataset simulating a vector database of the Rigveda.
const rigvedaDB: HymnChunk[] = [
  // Mandala 1, Sukta 1
  { source: "Rigveda", mandala: 1, sukta: 1, text: "मैं अग्नि की स्तुति करता हूँ. वे यज्ञ के पुरोहित, दानादि गुणों से युक्त, यज्ञ में देवों को बुलाने वाले एवं यज्ञ के फल रूपी रत्नों को धारण करने वाले हैं.", deity: "Agni", rishi: "Madhuchhandas Vaishvamitra" },
  { source: "Rigveda", mandala: 1, sukta: 1, text: "प्राचीन ऋषियों ने अग्नि की स्तुति की थी. वर्तमान ऋषि भी उनकी स्तुति करते हैं. वे अग्नि इस यज्ञ में देवों को बुलावें.", deity: "Agni", rishi: "Madhuchhandas Vaishvamitra" },
  { source: "Rigveda", mandala: 1, sukta: 1, text: "अग्नि की कृपा से यजमान को धन मिलता है. उन्हीं की कृपा से वह धन दिन-दिन बढ़ता है. उस धन से यजमान यश प्राप्त करता है एवं अनेक वीर पुरुषों को अपने यहां रखता है.", deity: "Agni", rishi: "Madhuchhandas Vaishvamitra" },
  { source: "Rigveda", mandala: 1, sukta: 1, text: "हे अग्नि! जिस यज्ञ की तुम चारों ओर से रक्षा करते हो, उसमें राक्षस आदि हिंसा नहीं कर सकते. वही यज्ञ देवताओं को तृप्ति देने स्वर्ग जाता है.", deity: "Agni", rishi: "Madhuchhandas Vaishvamitra" },
  { source: "Rigveda", mandala: 1, sukta: 1, text: "हे अग्नि देव! तुम दूसरे देवों के साथ इस यज्ञ में आओ. तुम यज्ञ के होता, बुद्धिसंपन्न, सत्यशील एवं परमकीर्ति वाले हो.", deity: "Agni", rishi: "Madhuchhandas Vaishvamitra" },
  { source: "Rigveda", mandala: 1, sukta: 1, text: "हे अग्नि! तुम यज्ञ में हवि देने वाले यजमान का जो कल्याण करते हो, वह वास्तव में तुम्हारी ही प्रसन्नता का साधन बनता है.", deity: "Agni", rishi: "Madhuchhandas Vaishvamitra" },
  { source: "Rigveda", mandala: 1, sukta: 1, text: "हे अग्नि! हम सच्चे हृदय से तुम्हें रात-दिन नमस्कार करते हैं और प्रतिदिन तुम्हारे समीप आते हैं.", deity: "Agni", rishi: "Madhuchhandas Vaishvamitra" },
  { source: "Rigveda", mandala: 1, sukta: 1, text: "हे अग्नि! तुम प्रकाशवान्, यज्ञ की रचना करने वाले और कर्मफल के द्योतक हो. तुम यज्ञशाला में बढ़ने वाले हो.", deity: "Agni", rishi: "Madhuchhandas Vaishvamitra" },
  { source: "Rigveda", mandala: 1, sukta: 1, text: "हे अग्नि! जिस प्रकार पुत्र पिता को सरलता से पा लेता है, उसी प्रकार हम भी तुम्हें सहज ही प्राप्त कर सकें. तुम हमारा कल्याण करने के लिए हमारे समीप निवास करो.", deity: "Agni", rishi: "Madhuchhandas Vaishvamitra" },
  // Mandala 1, Sukta 2
  { source: "Rigveda", mandala: 1, sukta: 2, text: "हे दर्शनीय वायु! आओ, यह सोमरस तैयार है, इसे पिओ. हम सोमपान के लिए तुम्हें बुला रहे हैं. तुम हमारी यह पुकार सुनो.", deity: "Vayu, Indra", rishi: "Madhuchhandas Vaishvamitra" },
  { source: "Rigveda", mandala: 1, sukta: 2, text: "हे वायु! अग्nistोम आदि यज्ञों के ज्ञाता ऋत्विज् तथा यजमान आदि हम संस्कार द्वारा शुद्ध सोमरस के साथ तुम्हारी स्तुति करते हैं.", deity: "Vayu, Indra", rishi: "Madhuchhandas Vaishvamitra" },
  { source: "Rigveda", mandala: 1, sukta: 2, text: "हे वायु! तुम सोमरस की प्रशंसा करते हुए उसे पीने की जो बात कहते हो, वह बहुत से यजमानों के पास तक जाती है.", deity: "Vayu, Indra", rishi: "Madhuchhandas Vaishvamitra" },
  { source: "Rigveda", mandala: 1, sukta: 2, text: "हे इंद्र और वायु! तुम दोनों हमें देने के लिए अन्न लेकर आओ. सोमरस तैयार है और तुम दोनों की अभिलाषा कर रहा है.", deity: "Vayu, Indra", rishi: "Madhuchhandas Vaishvamitra" },
  { source: "Rigveda", mandala: 1, sukta: 2, text: "हे वायु और इंद्र! तुम दोनों यह जान लो कि सोमरस तैयार है. तुम दोनों अप्रयुक्त द्रव्य में रहने वाले हो. तुम दोनों शीघ्र ही यज्ञ के समीप आओ.", deity: "Vayu, Indra", rishi: "Madhuchhandas Vaishvamitra" },
  { source: "Rigveda", mandala: 1, sukta: 2, text: "हे वायु और इंद्र! सोमरस देने वाले यजमान ने जो सोमरस तैयार किया है, तुम दोनों उसके समीप आओ. हे दोनों देवो! तुम्हारे आने से यह यज्ञकर्म शीघ्र पूरा हो जाएगा.", deity: "Vayu, Indra", rishi: "Madhuchhandas Vaishvamitra" },
  { source: "Rigveda", mandala: 1, sukta: 2, text: "मैं पवित्र बल वाले मित्र तथा हिंसकों का नाश करने वाले वरुण का यज्ञ में आह्वान करता हूँ. ये दोनों धरती पर जल लाने का काम करते हैं.", deity: "Mitra, Varuna", rishi: "Madhuchhandas Vaishvamitra" },
  { source: "Rigveda", mandala: 1, sukta: 2, text: "हे मित्र और वरुण! तुम दोनों यज्ञ के वर्धक और यज्ञ का स्पर्श करने वाले हो. तुम लोग हमें यज्ञ का फल देने के लिए इस विशाल यज्ञ को व्याप्त किए हुए हो.", deity: "Mitra, Varuna", rishi: "Madhuchhandas Vaishvamitra" },
  { source: "Rigveda", mandala: 1, sukta: 2, text: "मित्र और वरुण बुद्धिमान् लोगों का कल्याण करने वाले और अनेक लोगों के आश्रय हैं. ये हमारे बल और कर्म की रक्षा करें.", deity: "Mitra, Varuna", rishi: "Madhuchhandas Vaishvamitra" },
  // Mandala 1, Sukta 3
  { source: "Rigveda", mandala: 1, sukta: 3, text: "हे अश्विनीकुमारो! तुम्हारी भुजाएं विस्तीर्ण एवं हवि ग्रहण करने के लिए चंचल हैं. तुम शुभ कर्म के पालक हो. तुम दोनों यज्ञ का अन्न ग्रहण करो.", deity: "Ashvins", rishi: "Madhuchhandas Vaishvamitra" },
  { source: "Rigveda", mandala: 1, sukta: 3, text: "हे अश्विनीकुमारो! तुम अनेक कर्म वाले, नेता और बुद्धिमान् हो. तुम दोनों आदरपूर्ण बुद्धि से हमारी स्तुति सुनो.", deity: "Ashvins", rishi: "Madhuchhandas Vaishvamitra" },
  { source: "Rigveda", mandala: 1, sukta: 3, text: "हे शत्रु-विनाशक, सत्यभाषी और शत्रुओं को लाने वाले अश्विनीकुमारो! सोमरस तैयार करके बिछे हुए कुशों पर रख दिया गया है. तुम इस यज्ञ में आओ.", deity: "Ashvins", rishi: "Madhuchhandas Vaishvamitra" },
  { source: "Rigveda", mandala: 1, sukta: 3, text: "हे विश्वेदेवगण! तुम मनुष्यों के रक्षक एवं पालन करने वाले हो. हव्यदाता यजमान ने सोमरस तैयार कर लिया है, तुम इसे ग्रहण करने के लिए आओ. तुम लोगों को यज्ञ का फल देने वाले हो.", deity: "Vishvedevas", rishi: "Madhuchhandas Vaishvamitra" },
  { source: "Rigveda", mandala: 1, sukta: 3, text: "देवी सरस्वती पवित्र करने वाली तथा अन्न एवं धन देने वाली हैं. वे धन साथ लेकर हमारे इस यज्ञ में आवें.", deity: "Saraswati", rishi: "Madhuchhandas Vaishvamitra" }
];

/**
 * Simulates a hybrid (semantic + keyword) search on the Rigveda data.
 * In a real application, this would involve vector embeddings and a vector DB.
 * Here, we use keyword matching for simplicity.
 */
export const retrieveHymns = (keywords: string[]): HymnChunk[] => {
  const lowerKeywords = keywords.map(k => k.toLowerCase());
  const results = new Set<HymnChunk>();

  rigvedaDB.forEach(chunk => {
    const chunkText = `${chunk.deity.toLowerCase()} ${chunk.text.toLowerCase()}`;
    if (lowerKeywords.some(kw => chunkText.includes(kw))) {
      results.add(chunk);
    }
  });

  return Array.from(results);
};
