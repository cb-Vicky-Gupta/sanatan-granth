import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

const categories = [
  { name: "Vedas", slug: "vedas", subtitle: "4 Samhitas", icon: "lotus", position: 1 },
  { name: "Bhagavad Gita", slug: "bhagavad-gita", subtitle: "Multiple editions", icon: "diya", position: 2 },
  { name: "Upanishads", slug: "upanishads", subtitle: "Spiritual wisdom", icon: "chakra", position: 3 },
  { name: "Puranas", slug: "puranas", subtitle: "Sacred texts", icon: "book", position: 4 },
  { name: "Indian Philosophy", slug: "indian-philosophy", subtitle: "Six darshanas", icon: "mind", position: 5 },
  { name: "Other Scriptures", slug: "other-scriptures", subtitle: "Smriti, Itihasa", icon: "temple", position: 6 },
];

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@sanatangranth.in";
  const password = process.env.ADMIN_PASSWORD ?? "admin1234";

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Site Admin",
      passwordHash: await bcrypt.hash(password, 10),
    },
  });

  await prisma.setting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      siteName: "Sanatan Granth",
      tagline: "Timeless Wisdom for a Better Tomorrow",
      footerAbout:
        "A free, open library of Indian scripture. The source texts are in the public domain and every translation we publish is released for anyone to read, copy and share.",
      footerQuote: "May the wisdom of Bharat illuminate your path.",
      contactEmail: "hello@sanatangranth.in",
      contactPhone: "",
      contactAddress: "India",
      youtube: "#",
      instagram: "#",
      facebook: "#",
      twitter: "#",
      linkedin: "#",
    },
  });

  await prisma.homePage.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      heroEyebrow: "EXPLORE · LEARN · LIVE",
      heroTitleLine1: "India’s Eternal Wisdom",
      heroTitleLine2: "Now in Your Hands",
      heroSubtitle:
        "Read the Vedas, Bhagavad Gita and other sacred Indian texts in authentic, easy-to-read editions.",
      heroImage: "/images/hero.svg",
      heroCtaLabel: "Explore Books",
      heroCtaHref: "/books",
      heroNote: "Free to read · Free to download · No account needed",
      heroQuote: "A journey to inner peace begins with a single verse.",
      featuredEyebrow: "FEATURED BOOKS",
      featuredTitle: "Discover Timeless Scriptures",
      featuredSubtitle: "Authentic editions · Easy to read · Free for everyone",
      verseEnabled: true,
      aboutTitle: "Why this library exists",
      aboutBody:
        "The Vedas and the Gita have been copied by hand, chanted and preserved for thousands of years, yet most people never read them because the editions they find are expensive, hard to navigate, or written in language nobody speaks any more.\n\nSanatan Granth publishes these texts the way they deserve to be read: the original Sanskrit, a transliteration you can pronounce, and a plain modern translation, side by side. Everything is free, and always will be.",
      aboutImage: "/images/about.svg",
    },
  });

  const categoryIds: Record<string, string> = {};
  for (const category of categories) {
    const saved = await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
    categoryIds[category.slug] = saved.id;
  }

  const books = [
    {
      title: "Bhagavad Gita",
      slug: "bhagavad-gita",
      sanskritTitle: "श्रीमद्भगवद्गीता",
      subtitle: "Various translations",
      coverColor: "#9b3a1e",
      categorySlug: "bhagavad-gita",
      featured: true,
      position: 1,
      description:
        "Seven hundred verses set on a battlefield, spoken between Arjuna and Krishna at the moment Arjuna puts down his bow. The Gita asks what a person owes to their duty, their conscience and the outcome of their actions — and it answers in eighteen short chapters that can be read in an afternoon or studied for a lifetime.\n\nThis edition prints the Devanagari verse, an IAST transliteration for pronunciation, and a plain English translation with no ornament.",
      chapters: [
        {
          number: 1,
          title: "Arjuna’s Despondency",
          sanskritTitle: "अर्जुनविषादयोग",
          summary: "The armies face each other and Arjuna refuses to fight.",
          content:
            "The two armies stand ready at Kurukshetra. Arjuna asks Krishna to drive his chariot into the space between them so he can see who he has come to fight.\n\nHe sees fathers, grandfathers, teachers, uncles, brothers, sons and friends on both sides. His limbs give way, his mouth goes dry, the bow slips from his hand. He tells Krishna that he would rather be killed unarmed than win a kingdom over the bodies of his own family, and he sits down in the chariot and refuses to fight.\n\nThe chapter ends without an answer. Arjuna's collapse is the question the rest of the Gita responds to.",
        },
        {
          number: 2,
          title: "The Yoga of Knowledge",
          sanskritTitle: "सांख्ययोग",
          summary: "Krishna answers: the self is never destroyed, and action must be done without clinging to its fruit.",
          content:
            "Krishna begins by refusing to accept Arjuna's grief as wisdom. He draws a line between the body, which ends, and the self, which is never born and never dies.\n\nHe then turns from metaphysics to practice. Do your work, he says, because it is yours to do — not for the result it may bring you.\n\n> कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\n> मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥\n\n*karmaṇy evādhikāras te mā phaleṣu kadācana*\n*mā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi*\n\nYou have a right to your work, never to its fruits. Let not the fruit be your reason for acting — nor let that turn you toward doing nothing at all.\n\nThe chapter closes with a portrait of the person of steady wisdom: undisturbed in sorrow, without craving in pleasure, free of fear and anger.",
        },
        {
          number: 3,
          title: "The Yoga of Action",
          sanskritTitle: "कर्मयोग",
          summary: "Why withdrawal is not an option, and how work itself becomes an offering.",
          content:
            "Arjuna asks the obvious question: if understanding is better than action, why push me into a terrible war?\n\nKrishna answers that nobody stays still even for a moment. The body acts, the mind acts, and to sit apart while pretending otherwise is only another kind of action, taken dishonestly. What changes is not whether you act but why.\n\nWork done as an offering, without the grasping that says *this must turn out well for me*, leaves no residue. Work done to feed the ego binds the person who does it.\n\nKrishna adds a warning that closes the chapter: it is better to do your own work imperfectly than to do someone else's work well.",
        },
      ],
    },
    {
      title: "Rig Veda",
      slug: "rig-veda",
      sanskritTitle: "ऋग्वेद",
      subtitle: "Sanskrit with translation",
      coverColor: "#6d4419",
      categorySlug: "vedas",
      featured: true,
      position: 2,
      description:
        "The oldest layer of Indian literature: 1,028 hymns arranged in ten maṇḍalas, addressed to Agni, Indra, Usha, Varuna and the powers of the natural world. Composed to be heard rather than read, the Rig Veda is the ancestor of everything that follows in this library.\n\nThis edition gives the Samhita text with transliteration and translation, hymn by hymn.",
      chapters: [
        {
          number: 1,
          title: "Maṇḍala I — The Hymn to Agni",
          sanskritTitle: "प्रथम मण्डल",
          summary: "The opening hymn of the Rig Veda, addressed to the fire.",
          content:
            "The Rig Veda opens not with a story but with an invocation of fire, the messenger who carries every offering.\n\n> अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम्।\n> होतारं रत्नधातमम्॥\n\n*agnim īḷe purohitaṃ yajñasya devam ṛtvijam*\n*hotāraṃ ratnadhātamam*\n\nI call on Agni, placed in front, the god of the rite, the priest who invokes, the one who brings us most.\n\nEverything about the Rig Veda is contained in this first verse: the direct address, the compressed grammar, the sense of a voice speaking across a fire at dawn.",
        },
        {
          number: 2,
          title: "Maṇḍala X — The Hymn of Creation",
          sanskritTitle: "नासदीय सूक्त",
          summary: "The Nasadiya Sukta, which ends by admitting that nobody knows.",
          content:
            "Near the end of the tenth maṇḍala sits one of the strangest poems in any scripture. It asks where everything came from, and refuses to give a confident answer.\n\nThere was neither being nor non-being then, it says, no air, no sky beyond. There was no death, and nothing that was deathless. One thing breathed without breath, by its own nature.\n\nThe hymn closes on a question rather than a doctrine: the one who watches from the highest heaven knows — or perhaps does not know.\n\nThat last line is why this hymn is quoted so often. A tradition that opens with total confidence in the fire ends its earliest book by leaving the question open.",
        },
      ],
    },
    {
      title: "Yajur Veda",
      slug: "yajur-veda",
      sanskritTitle: "यजुर्वेद",
      subtitle: "Sanskrit with translation",
      coverColor: "#3f4a2e",
      categorySlug: "vedas",
      featured: true,
      position: 3,
      description:
        "The book of the officiating priest: prose formulae, measurements and instructions for the performance of the rite. It survives in two recensions, Shukla (white) and Krishna (black), which differ in how commentary is woven into the text.\n\nWhere the Rig Veda sings, the Yajur Veda instructs — and in doing so it preserves the oldest detailed picture we have of how a Vedic ceremony actually ran.",
      chapters: [],
    },
    {
      title: "Samaveda",
      slug: "samaveda",
      sanskritTitle: "सामवेद",
      subtitle: "Sanskrit with translation",
      coverColor: "#8a2f2f",
      categorySlug: "vedas",
      featured: true,
      position: 4,
      description:
        "Almost every verse of the Samaveda is borrowed from the Rig Veda — but set to melody. It is a songbook rather than a new collection, and the melodies it preserves are the root of the Indian classical tradition.\n\nThis edition marks the gāna forms alongside the verse so that a reader can follow how a spoken line becomes a sung one.",
      chapters: [],
    },
    {
      title: "Atharva Veda",
      slug: "atharva-veda",
      sanskritTitle: "अथर्ववेद",
      subtitle: "Sanskrit with translation",
      coverColor: "#a8761f",
      categorySlug: "vedas",
      featured: true,
      position: 5,
      description:
        "Twenty kāṇḍas concerned with ordinary life: healing, herbs, household rites, marriage, kingship, and some of the longest and most beautiful prayers for peace in the whole Vedic corpus.\n\nIf the Rig Veda looks upward at the gods, the Atharva Veda looks around at the world people actually lived in.",
      chapters: [],
    },
    {
      title: "Ten Principal Upanishads",
      slug: "upanishads",
      sanskritTitle: "उपनिषद्",
      subtitle: "Selected texts",
      coverColor: "#46325c",
      categorySlug: "upanishads",
      featured: true,
      position: 6,
      description:
        "Isha, Kena, Katha, Prashna, Mundaka, Mandukya, Taittiriya, Aitareya, Chandogya and Brihadaranyaka — the ten Upanishads on which the classical commentaries are written.\n\nThese are the texts that turn ritual inward. They are short, argumentative, often written as dialogue, and they ask the question the Vedas had left implied: what is the self, and what is it made of?",
      chapters: [
        {
          number: 1,
          title: "Isha Upanishad",
          sanskritTitle: "ईशोपनिषद्",
          summary: "Eighteen verses on renunciation and enjoyment held together.",
          content:
            "The shortest of the principal Upanishads, and the one most often learned first.\n\nIts opening line says that everything that moves in this moving world is enveloped by the divine — so enjoy what is given, and do not covet what belongs to another.\n\nThe verses that follow refuse to take either side of the usual argument. Those who chase only the world are lost, it says; but so are those who chase only withdrawal from it. Knowledge and action, being and becoming, are to be held together rather than chosen between.",
        },
        {
          number: 2,
          title: "Katha Upanishad",
          sanskritTitle: "कठोपनिषद्",
          summary: "A boy bargains with Death and is taught about the self.",
          content:
            "Nachiketa, a boy given away in anger by his father, arrives at the house of Death and waits three nights without food. Death, embarrassed, offers him three wishes.\n\nWith the first he asks that his father's anger be gone. With the second he asks about the fire that leads to heaven. With the third he asks what happens to a person after death — and Death tries to talk him out of it, offering him wealth, long life, chariots, music and every pleasure instead.\n\nNachiketa refuses them all, and the answer he is finally given includes the famous image of the body as a chariot, the senses as horses, the mind as the reins, and the self seated behind, not driving but owning the journey.",
        },
      ],
    },
    {
      title: "Valmiki Ramayana",
      slug: "valmiki-ramayana",
      sanskritTitle: "रामायण",
      subtitle: "Seven kāṇḍas",
      coverColor: "#7a3b12",
      categorySlug: "other-scriptures",
      featured: false,
      position: 7,
      description:
        "The older of the two great epics, traditionally ascribed to Valmiki, in seven books from Rama's boyhood in Ayodhya to his return and reign.\n\nRead as a story it is an adventure. Read closely it is a long argument about duty — what a son owes a father, a king his subjects, a husband his wife, and what happens when those debts contradict each other.",
      chapters: [],
    },
    {
      title: "Vishnu Purana",
      slug: "vishnu-purana",
      sanskritTitle: "विष्णुपुराण",
      subtitle: "Selected books",
      coverColor: "#1f4a52",
      categorySlug: "puranas",
      featured: false,
      position: 8,
      description:
        "One of the earliest and most tightly organised of the Puranas, covering creation, genealogy, the ages of the world, geography and the lives of kings and sages.\n\nThe Puranas are where Vedic material becomes story — and where most people, for most of Indian history, actually met it.",
      chapters: [],
    },
  ];

  for (const book of books) {
    const { chapters: bookChapters, categorySlug, ...rest } = book;
    const saved = await prisma.book.upsert({
      where: { slug: rest.slug },
      update: { ...rest, categoryId: categoryIds[categorySlug] },
      create: { ...rest, categoryId: categoryIds[categorySlug] },
    });

    for (const chapter of bookChapters) {
      await prisma.chapter.upsert({
        where: { bookId_number: { bookId: saved.id, number: chapter.number } },
        update: chapter,
        create: { ...chapter, bookId: saved.id },
      });
    }
  }

  const verseCount = await prisma.verse.count();
  if (verseCount === 0) {
    await prisma.verse.createMany({
      data: [
        {
          reference: "Bhagavad Gita 2.47",
          sanskrit:
            "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
          transliteration:
            "karmaṇy evādhikāras te mā phaleṣu kadācana\nmā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi",
          translation:
            "You have a right to your work, never to its fruits. Let not the fruit be your reason for acting — nor let that turn you toward doing nothing.",
          active: true,
        },
        {
          reference: "Rig Veda 1.1.1",
          sanskrit: "अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम्।\nहोतारं रत्नधातमम्॥",
          transliteration:
            "agnim īḷe purohitaṃ yajñasya devam ṛtvijam\nhotāraṃ ratnadhātamam",
          translation:
            "I call on Agni, placed in front, the god of the rite, the priest who invokes, the one who brings us most.",
          active: false,
        },
        {
          reference: "Isha Upanishad 1",
          sanskrit: "ईशा वास्यमिदं सर्वं यत्किञ्च जगत्यां जगत्।\nतेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम्॥",
          transliteration:
            "īśā vāsyam idaṃ sarvaṃ yat kiñca jagatyāṃ jagat\ntena tyaktena bhuñjīthā mā gṛdhaḥ kasya svid dhanam",
          translation:
            "All this, everything that moves in a moving world, is enveloped by the divine. Enjoy what is given up to you; do not covet what belongs to another.",
          active: false,
        },
      ],
    });
  }

  const featureCount = await prisma.feature.count();
  if (featureCount === 0) {
    await prisma.feature.createMany({
      data: [
        { title: "Authentic Content", subtitle: "Based on trusted printed sources", icon: "check", position: 1 },
        { title: "High Quality Editions", subtitle: "Typeset for comfortable reading", icon: "book", position: 2 },
        { title: "Free Forever", subtitle: "No payment, no subscription", icon: "heart", position: 3 },
        { title: "Read Anywhere", subtitle: "Phone, tablet, or print at home", icon: "globe", position: 4 },
      ],
    });
  }

  const faqCount = await prisma.faq.count();
  if (faqCount === 0) {
    await prisma.faq.createMany({
      data: [
        {
          question: "Is everything on this site really free?",
          answer:
            "Yes. Every text can be read online and downloaded as a PDF without paying, without registering and without an advertisement in sight. The source texts are in the public domain and the translations we publish are released for anyone to reuse.",
          position: 1,
        },
        {
          question: "Do I need an account to read?",
          answer:
            "No. Accounts exist only for the people who maintain the library. Readers never need one.",
          position: 2,
        },
        {
          question: "Which script and language do you publish in?",
          answer:
            "Each text carries the original Devanagari, an IAST transliteration so you can read it aloud without knowing the script, and a plain translation. Hindi translations are being added text by text.",
          position: 3,
        },
        {
          question: "Can I print or share these texts?",
          answer:
            "Please do. Print them, copy them, hand them to a friend, read them aloud in a class. That is the point of publishing them this way.",
          position: 4,
        },
        {
          question: "How do you choose a translation?",
          answer:
            "We prefer translations that stay close to the grammar of the original and avoid inserting doctrine that is not in the verse. Where a line is genuinely disputed we say so rather than picking a side quietly.",
          position: 5,
        },
        {
          question: "I found a mistake. How do I report it?",
          answer:
            "Use the contact form with the text, chapter and verse number. Corrections are the most useful thing anyone can send us.",
          position: 6,
        },
      ],
    });
  }

  const postCount = await prisma.post.count();
  if (postCount === 0) {
    await prisma.post.createMany({
      data: [
        {
          title: "Where to start if you have never read the Gita",
          slug: "where-to-start-with-the-gita",
          excerpt:
            "Eighteen chapters is not many, but the usual advice to start at chapter one and push through is how most people stop at chapter three.",
          content:
            "Eighteen chapters is not many. The whole text runs to about seven hundred verses, and a steady reader gets through it in a week.\n\nThe trouble is that chapter one is a list of names. Warriors, conches, army formations. It is the least inviting opening in Indian literature, and it is where most first attempts quietly end.\n\n## Read chapter two first\n\nChapter two is where the Gita actually begins to argue. Arjuna has already collapsed, Krishna has already refused to accept his grief as wisdom, and within forty verses you have the line everyone quotes about work and its fruits.\n\nOnce chapter two makes sense, chapter one reads very differently — as the setup for a problem rather than a catalogue.\n\n## Then read three, then twelve\n\nChapter three answers the objection most modern readers raise immediately: if detachment is so good, why act at all? Chapter twelve is the shortest and warmest chapter in the book.\n\nWith those four read, go back to the beginning and go straight through. You will have the spine of the argument already, and the chapters that seemed technical will land.",
          published: true,
          publishedAt: new Date("2026-02-11"),
        },
        {
          title: "Why we print the transliteration",
          slug: "why-we-print-the-transliteration",
          excerpt:
            "A line of Sanskrit you cannot pronounce is a line you cannot remember. Transliteration is not a crutch — it is how the text gets back into the mouth.",
          content:
            "These texts were composed to be heard. For most of their life they were not read at all; they were recited, and the recitation was the copy.\n\nPrinting only the Devanagari serves readers who already know the script. Printing only the translation serves readers who want the meaning and nothing else. Neither gives you the thing itself.\n\n## What IAST gives you\n\nThe International Alphabet of Sanskrit Transliteration marks every distinction the script makes — long and short vowels, retroflex consonants, the aspirated pairs. Once you learn a handful of diacritics you can pronounce any verse in the library without learning Devanagari first.\n\n## What it does not give you\n\nIt will not give you the rhythm. For that you need to hear the verse, and the audio recordings are the next thing we are adding.",
          published: true,
          publishedAt: new Date("2026-04-02"),
        },
        {
          title: "The Nasadiya Sukta and the honesty of not knowing",
          slug: "nasadiya-sukta",
          excerpt:
            "The earliest book in the library ends its creation hymn by admitting that perhaps nobody knows. It is worth sitting with that.",
          content:
            "Most creation accounts are confident. The Rig Veda's is not.\n\nThe hymn describes a state before being and non-being, before air, before the sky beyond. Then it asks who could possibly say where it all came from, since the gods themselves came later.\n\nIts closing line turns the question on the highest possible witness: the one who watches from the furthest heaven knows — or perhaps does not know.\n\nThis is the oldest layer of the tradition, and it ends on a shrug. That is not a weakness in the text. It is a standard of intellectual honesty that a great deal of later writing, in every tradition, failed to meet.",
          published: true,
          publishedAt: new Date("2026-06-18"),
        },
      ],
    });
  }

  console.log("Seed complete.");
  console.log(`Admin login: ${email} / ${password}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
