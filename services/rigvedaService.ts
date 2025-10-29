
import type { HymnChunk, Topic } from '../types';

export const TOPICS_CATEGORIZED: { [key: string]: Topic[] } = {
    Deities: [
        {
            title: "Agni, The Divine Messenger",
            description: "Explore hymns to the god of fire, the priest of the gods and messenger for the sacrifice.",
            keywords: ["agni", "fire", "priest", "messenger", "अग्नि"],
            image: "https://picsum.photos/seed/agni/600/400"
        },
        {
            title: "Indra, King of Gods",
            description: "The powerful king of the Devas, a heroic god of thunder, storms, and war.",
            keywords: ["indra", "storm", "thunder", "इंद्र", "इन्द्र"],
            image: "https://picsum.photos/seed/indra/600/400"
        },
        {
            title: "Soma, Plant of Immortality",
            description: "The deified plant whose juice is a drink of the gods, granting inspiration and power.",
            keywords: ["soma", "plant", "immortality", "सोम"],
            image: "https://picsum.photos/seed/soma/600/400"
        },
        {
            title: "The Ashvins, Divine Twins",
            description: "Discover the benevolent twin horsemen associated with dawn, healing, and rescue.",
            keywords: ["ashvin", "ashvins", "twins", "healing", "अश्विनीकुमार", "अश्विनौ"],
            image: "https://picsum.photos/seed/ashvins/600/400"
        },
        {
            title: "Ushas, The Dawn",
            description: "Behold the beauty of the goddess of dawn who brings light and life to the world.",
            keywords: ["ushas", "dawn", "light", "उषा"],
            image: "https://picsum.photos/seed/ushas/600/400"
        },
        {
            title: "Varuna, Cosmic Law Keeper",
            description: "The sovereign god of cosmic order (Rta), the sky, and the celestial ocean.",
            keywords: ["varuna", "rta", "cosmic order", "वरुण"],
            image: "https://picsum.photos/seed/varuna/600/400"
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
            title: "Surya, The Sun God",
            description: "The all-seeing eye of the cosmos, riding his chariot across the sky.",
            keywords: ["surya", "sun", "सूर्य"],
            image: "https://picsum.photos/seed/surya/600/400"
        },
        {
            title: "Vayu, Lord of the Wind",
            description: "The swift god of the wind, the first to drink the Soma offering.",
            keywords: ["vayu", "wind", "वायु"],
            image: "https://picsum.photos/seed/vayu/600/400"
        },
        {
            title: "Rudra, The Howler",
            description: "A fierce deity associated with storms, wind, and the hunt, possessing a fearsome and healing nature.",
            keywords: ["rudra", "storm", "healer", "रुद्र"],
            image: "https://picsum.photos/seed/rudra/600/400"
        },
    ],
    Rishis: [
        {
            title: "Madhuchhandas Vaishvamitra",
            description: "Son of Vishvamitra, composer of the opening hymns of the Rigveda to Agni and Indra.",
            keywords: ["madhuchhandas", "vishvamitra", " विश्वामित्र", "मधुच्छन्दस्"],
            image: "https://picsum.photos/seed/madhuchhandas/600/400"
        },
        {
            title: "Vishvamitra",
            description: "A great king who became a revered Rishi, credited with composing most of Mandala 3.",
            keywords: ["vishvamitra", "विश्वामित्र"],
            image: "https://picsum.photos/seed/vishvamitra-rishi/600/400"
        },
        {
            title: "Gritsamada",
            description: "A renowned Rishi, traditionally considered the author of most hymns in Mandala 2.",
            keywords: ["gritsamada", "गृत्समद"],
            image: "https://picsum.photos/seed/gritsamada/600/400"
        },
    ],
    "Locations, Objects & Concepts": [
        {
            title: "The Seven Rivers (Sapta Sindhu)",
            description: "The sacred land defined by seven major rivers, the heartland of Vedic civilization.",
            keywords: ["sapta sindhu", "seven rivers", "sindhu", "सप्त सिन्धु"],
            image: "https://picsum.photos/seed/saptasindhu/600/400"
        },
        {
            title: "Rta, Cosmic Order",
            description: "The principle of natural order which regulates and coordinates the operation of the universe.",
            keywords: ["rta", "rita", "cosmic order", "ऋत"],
            image: "https://picsum.photos/seed/rta/600/400"
        },
        {
            title: "Yajna, The Sacrifice",
            description: "The ritual of offering, a central practice for communicating with and nourishing the gods.",
            keywords: ["yajna", "sacrifice", "ritual", "यज्ञ"],
            image: "https://picsum.photos/seed/yajna/600/400"
        },
        {
            title: "Soma Pressing Ritual",
            description: "The ritual preparation of the sacred Soma juice, a key element of Vedic sacrifice.",
            keywords: ["soma", "pressing", "ritual", "सोम"],
            image: "https://picsum.photos/seed/somapressing/600/400"
        },
    ]
};

const ALL_TOPICS: Topic[] = Object.values(TOPICS_CATEGORIZED).flat();

export const getTopicByTitle = (title: string): Topic | undefined => ALL_TOPICS.find(t => t.title === title);

// This dataset is a parsed sample from the full Rigveda Samhita provided.
// It simulates a much larger database of hymns for the AI to draw context from.
const rigvedaDB: HymnChunk[] = [
    { source: 'Rigveda', mandala: 1, sukta: 1, text: 'अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम् । होतारं रत्नधातमम् ॥', deity: 'अग्निः', rishi: 'मधुच्छन्दाः वैश्वामित्रः' },
    { source: 'Rigveda', mandala: 1, sukta: 1, text: 'अग्निः पूर्वेभिरृषिभिरीड्यो नूतनैरुत । स देवाँ एह वक्षति ॥', deity: 'अग्निः', rishi: 'मधुच्छन्दाः वैश्वामित्रः' },
    { source: 'Rigveda', mandala: 1, sukta: 1, text: 'अग्निना रयिमश्नवत्पोषमेव दिवेदिवे । यशसं वीरवत्तमम् ॥', deity: 'अग्निः', rishi: 'मधुच्छन्दाः वैश्वामित्रः' },
    { source: 'Rigveda', mandala: 1, sukta: 1, text: 'अग्ने यं यज्ञमध्वरं विश्वतः परिभूरसि । स इद्देवेषु गच्छति ॥', deity: 'अग्निः', rishi: 'मधुच्छन्दाः वैश्वामित्रः' },
    { source: 'Rigveda', mandala: 1, sukta: 1, text: 'अग्निर्होता कविक्रतुः सत्यश्चित्रश्रवस्तमः । देवो देवेभिरा गमत् ॥', deity: 'अग्निः', rishi: 'मधुच्छन्दाः वैश्वामित्रः' },
    { source: 'Rigveda', mandala: 1, sukta: 1, text: 'यदङ्ग दाशुषे त्वमग्ने भद्रं करिष्यसि । तवेत्तत्सत्यमङ्गिरः ॥', deity: 'अग्निः', rishi: 'मधुच्छन्दाः वैश्वामित्रः' },
    { source: 'Rigveda', mandala: 1, sukta: 1, text: 'उप त्वाग्ने दिवेदिवे दोषावस्तर्धिया वयम् । नमो भरन्त एमसि ॥', deity: 'अग्निः', rishi: 'मधुच्छन्दाः वैश्वामित्रः' },
    { source: 'Rigveda', mandala: 1, sukta: 1, text: 'राजन्तमध्वराणां गोपामृतस्य दीदिविम् । वर्धमानं स्वे दमे ॥', deity: 'अग्निः', rishi: 'मधुच्छन्दाः वैश्वामित्रः' },
    { source: 'Rigveda', mandala: 1, sukta: 1, text: 'स नः पितेव सूनवेऽग्ने सूपायनो भव । सचस्वा नः स्वस्तये ॥', deity: 'अग्निः', rishi: 'मधुच्छन्दाः वैश्वामित्रः' },
    { source: 'Rigveda', mandala: 1, sukta: 2, text: 'वायवा याहि दर्शतमे सोमा अरंकृताः । तेषां पाहि श्रुधी हवम् ॥', deity: 'वायुः', rishi: 'मधुच्छन्दाः वैश्वामित्रः' },
    { source: 'Rigveda', mandala: 1, sukta: 2, text: 'वाय उक्थेभिर्जरन्ते त्वामच्छा जरितारः । सुतसोमा अहर्विदः ॥', deity: 'वायुः', rishi: 'मधुच्छन्दाः वैश्वामित्रः' },
    { source: 'Rigveda', mandala: 1, sukta: 2, text: 'वायो तव प्रपृञ्चती धेना जिगाति दाशुषे । उरूची सोमपीतये ॥', deity: 'वायुः', rishi: 'मधुच्छन्दाः वैश्वामित्रः' },
    { source: 'Rigveda', mandala: 1, sukta: 2, text: 'इन्द्रवायू इमे सुता उप प्रयोभिरा गतम् । इन्दवो वामुशन्ति हि ॥', deity: 'इन्द्रवायू', rishi: 'मधुच्छन्दाः वैश्वामित्रः' },
    { source: 'Rigveda', mandala: 1, sukta: 2, text: 'वायविन्द्रश्च चेतथः सुतानां वाजिनीवसू । तावा यातमुप द्रवत् ॥', deity: 'इन्द्रवायू', rishi: 'मधुच्छन्दाः वैश्वामित्रः' },
    { source: 'Rigveda', mandala: 1, sukta: 2, text: 'वायविन्द्रश्च सुन्वत आ यातमुप निष्कृतम् । मक्ष्वित्था धिया नरा ॥', deity: 'इन्द्रवायू', rishi: 'मधुच्छन्दाः वैश्वामित्रः' },
    { source: 'Rigveda', mandala: 1, sukta: 2, text: 'मित्रं हुवे पूतदक्षं वरुणं च रिशादसम् । धियं घृताचीं साधन्ता ॥', deity: 'मित्रावरुणौ', rishi: 'मधुच्छन्दाः वैश्वामित्रः' },
    { source: 'Rigveda', mandala: 1, sukta: 2, text: 'ऋतेन मित्रावरुणावृतावृधावृतस्पृशा । क्रतुं बृहन्तमाशाथे ॥', deity: 'मित्रावरुणौ', rishi: 'मधुच्छन्दाः वैश्वामित्रः' },
    { source: 'Rigveda', mandala: 1, sukta: 2, text: 'कवी नो मित्रावरुणा तुविजाता उरुक्षया । दक्षं दधाते अपसम् ॥', deity: 'मित्रावरुणौ', rishi: 'मधुच्छन्दाः वैश्वामित्रः' },
    { source: 'Rigveda', mandala: 1, sukta: 3, text: 'अश्विना यज्वरीरिषो द्रवत्पाणी शुभस्पती । पुरुभुजा चनस्यतम् ॥', deity: 'अश्विनौ', rishi: 'मधुच्छन्दाः' },
    { source: 'Rigveda', mandala: 1, sukta: 3, text: 'अश्विना पुरुदंससा नरा शवीरया धिया । धिष्ण्या वनतं गिरः ॥', deity: 'अश्विनौ', rishi: 'मधुच्छन्दाः' },
    { source: 'Rigveda', mandala: 1, sukta: 3, text: 'दस्रा युवाकवः सुता नासत्या वृक्तबर्हिषः । आ यातं रुद्रवर्तनी ॥', deity: 'अश्विनौ', rishi: 'मधुच्छन्दाः' },
    { source: 'Rigveda', mandala: 1, sukta: 3, text: 'इन्द्रा याहि चित्रभानो सुता इमे त्वायवः । अण्वीभिस्तना पूतासः ॥', deity: 'इन्द्रः', rishi: 'मधुच्छन्दाः' },
    { source: 'Rigveda', mandala: 1, sukta: 3, text: 'इन्द्रा याहि धियेषितो विप्रजूतः सुतावतः । उप ब्रह्माणि वाघतः ॥', deity: 'इन्द्रः', rishi: 'मधुच्छन्दाः' },
    { source: 'Rigveda', mandala: 1, sukta: 3, text: 'इन्द्रा याहि तूतुजान उप ब्रह्माणि हरिवः । सुते दधिष्व नश्चनः ॥', deity: 'इन्द्रः', rishi: 'मधुच्छन्दाः' },
    { source: 'Rigveda', mandala: 1, sukta: 3, text: 'ओमासश्चर्षणीधृतो विश्वे देवास आ गत । दाश्वांसो दाशुषः सुतम् ॥', deity: 'विश्वेदेवाः', rishi: 'मधुच्छन्दाः' },
    { source: 'Rigveda', mandala: 1, sukta: 3, text: 'विश्वे देवासो अप्तुरः सुतमा गन्त तूर्णयः । उस्रा इव स्वसराणि ॥', deity: 'विश्वेदेवाः', rishi: 'मधुच्छन्दाः' },
    { source: 'Rigveda', mandala: 1, sukta: 3, text: 'विश्वे देवासो अस्रिध एहिमायासो अद्रुहः । मेधं जुषन्त वह्नयः ॥', deity: 'विश्वेदेवाः', rishi: 'मधुच्छन्दाः' },
    { source: 'Rigveda', mandala: 1, sukta: 3, text: 'पावका नः सरस्वती वाजेभिर्वाजिनीवती । यज्ञं वष्टु धियावसुः ॥', deity: 'सरस्वती', rishi: 'मधुच्छन्दाः' },
    { source: 'Rigveda', mandala: 1, sukta: 3, text: 'चोदयित्री सूनृतानां चेतन्ती सुमतीनाम् । यज्ञं दधे सरस्वती ॥', deity: 'सरस्वती', rishi: 'मधुच्छन्दाः' },
    { source: 'Rigveda', mandala: 1, sukta: 3, text: 'महो अर्णः सरस्वती प्र चेतयति केतुना । धियो विश्वा वि राजति ॥', deity: 'सरस्वती', rishi: 'मधुच्छन्दाः' },
    { source: 'Rigveda', mandala: 1, sukta: 4, text: 'सुरूपकृत्नुमूतये सुदुघामिव गोदुहे । जुहूमसि द्यविद्यवि ॥', deity: 'इन्द्रः', rishi: 'मधुच्छन्दाः' },
    { source: 'Rigveda', mandala: 1, sukta: 4, text: 'उप नः सवना गहि सोमस्य सोमपाः पिब । गोदा इद्रेवतो मदः ॥', deity: 'इन्द्रः', rishi: 'मधुच्छन्दाः' },
    { source: 'Rigveda', mandala: 1, sukta: 4, text: 'अथा ते अन्तमानां विद्याम सुमतीनाम् । मा नो अति ख्य आ गहि ॥', deity: 'इन्द्रः', rishi: 'मधुच्छन्दाः' },
    { source: 'Rigveda', mandala: 1, sukta: 5, text: 'आ त्वेता नि षीदतेन्द्रमभि प्र गायत । सखायः स्तोमवाहसः ॥', deity: 'इन्द्रः', rishi: 'मधुच्छन्दाः' },
    { source: 'Rigveda', mandala: 1, sukta: 5, text: 'पुरूतमं पुरूणामीशानं वार्याणाम् । इन्द्रं सोमे सचा सुते ॥', deity: 'इन्द्रः', rishi: 'मधुच्छन्दाः' },
    { source: 'Rigveda', mandala: 1, sukta: 5, text: 'स घा नो योग आ भुवत्स राये स पुरंध्याम् । गमद्वाजेभिरा स नः ॥', deity: 'इन्द्रः', rishi: 'मधुच्छन्दाः' },
    { source: 'Rigveda', mandala: 1, sukta: 5, text: 'यस्य संस्थे न वृण्वते हरी समत्सु शत्रवः । तस्मा इन्द्राय गायत ॥', deity: 'इन्द्रः', rishi: 'मधुच्छन्दाः' },
    { source: 'Rigveda', mandala: 1, sukta: 6, text: 'युञ्जन्ति ब्रध्नमरुषं चरन्तं परि तस्थुषः । रोचन्ते रोचना दिवि ॥', deity: 'इन्द्रः', rishi: 'मधुच्छन्दाः' },
    { source: 'Rigveda', mandala: 1, sukta: 6, text: 'युञ्जन्त्यस्य काम्या हरी विपक्षसा रथे । शोणा धृष्णु नृवाहसा ॥', deity: 'इन्द्रः', rishi: 'मधुच्छन्दाः' },
    { source: 'Rigveda', mandala: 1, sukta: 6, text: 'केतुं कृण्वन्नकेतवे पेशो मर्या अपेशसे । समुषद्भिरजायथाः ॥', deity: 'इन्द्रः', rishi: 'मधुच्छन्दाः' },
    { source: 'Rigveda', mandala: 1, sukta: 6, text: 'आदह स्वधामनु पुनर्गर्भत्वमेरिरे । दधाना नाम यज्ञियम् ॥', deity: 'मरुतः', rishi: 'मधुच्छन्दाः' },
    { source: 'Rigveda', mandala: 1, sukta: 6, text: 'वीळु चिदारुजत्नुभिर्गुहा चिदिन्द्र वन्हिभिः । अविन्द उत्रिया अनु ॥', deity: 'इन्द्र-मरुतः', rishi: 'मधुच्छन्दाः' },
    { source: 'Rigveda', mandala: 1, sukta: 6, text: 'देवयन्तो यथा मतिमच्छा विदद्वसुं गिरः । महामनूषत श्रुतम् ॥', deity: 'मरुतः', rishi: 'मधुच्छन्दाः' },
    { source: 'Rigveda', mandala: 1, sukta: 7, text: 'इन्द्रमिद्गाथिनो बृहदिन्द्रमर्केभिरर्किणः । इन्द्रं वाणीरनूषत ॥', deity: 'इन्द्रः', rishi: 'मधुच्छन्दाः' },
    { source: 'Rigveda', mandala: 1, sukta: 7, text: 'इन्द्र इद्धर्योः सचा सम्मिश्ल आ वचोयुजा । इन्द्रो वज्री हिरण्ययः ॥', deity: 'इन्द्रः', rishi: 'मधुच्छन्दाः' },
    { source: 'Rigveda', mandala: 1, sukta: 7, text: 'इन्द्रो दीर्घाय चक्षस आ सूर्यं रोहयद्दिवि । वि गोभिरद्रिमैरयत् ॥', deity: 'इन्द्रः', rishi: 'मधुच्छन्दाः' },
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
    const chunkText = `${chunk.deity.toLowerCase()} ${chunk.text.toLowerCase()} ${chunk.rishi.toLowerCase()}`;
    if (lowerKeywords.some(kw => chunkText.includes(kw))) {
      results.add(chunk);
    }
  });

  return Array.from(results);
};
