import { CardItem, Catastrophe, ShelterSpecs, BunkerEvent } from '../types';

export const CATASTROPHES: Catastrophe[] = [
  // 1. KLASSIK APOKALIPSIS
  {
    id: 'cat-nuclear-winter',
    title: 'Yadro Qishi (2046-yil)',
    shortDesc: 'Dunyo miqyosidagi yadroviy to\'qnashuvdan so\'ng yer yuzini qalin qora tutun va -50°C sovuq qopladi.',
    fullStory: 'Yer yuzida quyosh nurlari ko\'rinmaydi. Radiatsiya darajasi o\'ta yuqori. Boshpanada kamida 36 oy yashash talab etiladi.',
    theme: 'classic',
    requiredSkills: ['tech', 'defense', 'food'],
    shelterMonths: 36,
    hazards: ['Kuchli radiatsiya', 'Qattiq sovuq (-50°C)', 'Suv muzlashi'],
    exclusiveSpecialCardIds: ['spc-rad-suit']
  },
  {
    id: 'cat-zombie-virus',
    title: 'Zombi Epidemiyasi (Toshkent-0)',
    shortDesc: 'Laboratoriyadan qochgan tajriba virusi odamlarni tajovuzkor mutatsiya qilingan jonzotlarga aylantirdi.',
    fullStory: 'Tashqi dunyoda xavfsiz joy qolmagan. Mutatsiyaga uchraganlar tovush orqali ov qilishadi. Boshpana eshigini 24 oy ochmaslik shart.',
    theme: 'classic',
    requiredSkills: ['defense', 'medical', 'psychology'],
    shelterMonths: 24,
    hazards: ['Yuqumli virus', 'Tashqi hujumlar', 'Psixologik vahima'],
    exclusiveSpecialCardIds: ['spc-antidote']
  },
  {
    id: 'cat-asteroid-impact',
    title: 'Ulkan Asteroid Zarbasi',
    shortDesc: 'Diametri 15 km bo\'lgan asteroid yerga quladi. Gigant sunami va chang bo\'roni atmosferani to\'sdi.',
    fullStory: 'Tektonik yoriqlar, zilzilalar va kislorod tanqisligi. Boshpanada havo filtrlarini 48 oy ushlab turish zarur.',
    theme: 'classic',
    requiredSkills: ['tech', 'food', 'medical'],
    shelterMonths: 48,
    hazards: ['Zilzilalar', 'Kislorod tanqisligi', 'Ozuqa yetishmovchiligi'],
    exclusiveSpecialCardIds: ['spc-air-filter-spare']
  },
  {
    id: 'cat-ai-uprising',
    title: 'Sun\'iy Intellekt Qo\'zg\'oloni (Kiber-Qirg\'in)',
    shortDesc: 'Avtonom kiber-tizimlar va dronlar insoniyatni yer resurslarini nobud qiluvchi deb topdi.',
    fullStory: 'Har qanday elektron signalni dronlar darhol skaner qilib yo\'q qiladi. Bunkerdan 18 oy mutlaq radio-sukut bilan chiqmaslik lozim.',
    theme: 'classic',
    requiredSkills: ['tech', 'defense', 'psychology'],
    shelterMonths: 18,
    hazards: ['Kiber-dronlar', 'Radio-skaner', 'Elektr toki uzilishi'],
    exclusiveSpecialCardIds: ['spc-emp-jammer']
  },

  // 2. O'ZBEKONA KOLORIT
  {
    id: 'cat-eternal-blackout',
    title: 'Abadiy Svet & Gaz O\'chishi (Buyuk Chilla)',
    shortDesc: 'Butun Markaziy Osiyo energetika tarmog\'i butunlay quladi. -35°C qish va birorta elektr manbai yo\'q.',
    fullStory: 'Tashqarida pechka va o\'tin jangi ketmoqda. Faqat avtonom "Registon-Boshpanasi"da 24 oy omon qolish mumkin.',
    theme: 'uzbek',
    requiredSkills: ['tech', 'food', 'defense'],
    shelterMonths: 24,
    hazards: ['Sovuq', 'Benzin taqchilligi', 'O\'tin talashish'],
    exclusiveSpecialCardIds: ['spc-pechka-wood']
  },
  {
    id: 'cat-sandstorm-2055',
    title: 'Buyuk Qum Bo\'roni (Orol-2055)',
    shortDesc: 'Tuz va qizil qum bo\'ronlari butun voha va shaharlarni 20 metrli qum ostiga ko\'mib yubordi.',
    fullStory: 'Ko\'z ochib bo\'lmaydi, nafas olish apparatisiz 5 daqiqada o\'pka tuzga to\'ladi. Boshpana muddati: 30 oy.',
    theme: 'uzbek',
    requiredSkills: ['medical', 'food', 'tech'],
    shelterMonths: 30,
    hazards: ['Tuzli chang', 'Suv quritishi', 'Filtrlar tiqilishi'],
    exclusiveSpecialCardIds: ['spc-sand-gear']
  },
  {
    id: 'cat-wedding-plague',
    title: 'Buyuk To\'y Epidemiyasi',
    shortDesc: '5000 kishilik dabdabali to\'ydagi salatdan to\'xtovsiz raqs tushiruvchi xavfli virus tarqaldi.',
    fullStory: 'Kasallanganlar tinmay karnay chalib boshqalarni ham quchoqlamoqda. Qattiq karantinda 12 oy saqlanish shart.',
    theme: 'uzbek',
    requiredSkills: ['medical', 'psychology', 'defense'],
    shelterMonths: 12,
    hazards: ['Karnay sadosi', 'To\'xtovsiz o\'yin-kulgi', 'Uyqusizlik']
  },

  // 3. 18+ QORA YUMOR
  {
    id: 'cat-hormone-overload',
    title: 'Feromon Gaz Qochishi (18+)',
    shortDesc: 'Yashirin laboratoriyadan kuchli nazoratsiz feromon gazi butun qit\'aga tarqaldi.',
    fullStory: 'Tashqarida qolgan barcha tirik mavjudotlar aqldan ozib, hayvoniy instinktlar ketidan quvmoqda. 18 oy aql-hushni saqlash lozim.',
    theme: 'nsfw18',
    requiredSkills: ['psychology', 'medical', 'defense'],
    shelterMonths: 18,
    hazards: ['Kuchli vasvasa', 'Axloqiy qulash', 'Hissiy portlash']
  }
];

export const SHELTER_SPECS_PRESETS: ShelterSpecs[] = [
  {
    areaSqMeters: 180,
    durationMonths: 24,
    foodSuppliesMonths: 18,
    waterSuppliesMonths: 24,
    medicalSupplies: 'Standart shahar aptechkasi va 1 ta kislorod balloni',
    defenseStatus: 'Mustahkamlangan titan eshik va tashqi videokameralar',
    specialFeature: 'Kichik gidroponik issiqxona va 2 ta velotrenajyor',
    internalThreat: 'Havo shamollatish turbinasida vaqti-vaqti bilan begona shovqin eshitiladi'
  },
  {
    areaSqMeters: 320,
    durationMonths: 36,
    foodSuppliesMonths: 36,
    waterSuppliesMonths: 40,
    medicalSupplies: 'To\'liq xirurgiya stoli, antibiotiklar va reanimatsiya apparati',
    defenseStatus: 'Avtomatik pulemyotli kirish xonasi va lazer datchiklari',
    specialFeature: 'Mini-kutubxona, 3D printer va 500 litr toza spirt',
    internalThreat: 'Suv quvurlarining bir qismi zanglagan, ta\'mirga usta zarur'
  },
  {
    areaSqMeters: 95,
    durationMonths: 12,
    foodSuppliesMonths: 14,
    waterSuppliesMonths: 12,
    medicalSupplies: 'Yod, bint va ko\'mir tabletkalari',
    defenseStatus: 'Eski sovet temir lyuki (ichkaridan kashak bilan yopiladi)',
    specialFeature: 'Dizel generator va 30 quti konserva tushonka',
    internalThreat: 'Klostrofobiya chaqiruvchi past shift (1.9 metr)'
  }
];

// ==================== BUNKER DISCOVERY EVENTS (BOSHPANA HODISALARI) ====================
export const BUNKER_EVENTS: BunkerEvent[] = [
  {
    id: 'evt-med-cache',
    title: '🏥 Yashirin Tibbiyot Ombori Topildi!',
    description: 'Boshpananing g\'arbiy devori ortida qulflangan tibbiy quti topildi: 50 ta shpris va og\'riqsizlantiruvchi vositalar.',
    type: 'positive',
    impactText: 'Boshpananing umumiy tibbiy tayyorgarligi sezilarli oshdi.'
  },
  {
    id: 'evt-hydroponics-bloom',
    title: '🌱 Issiqxonada Mo\'l Hosil!',
    description: 'Gidroponik polkalar kutilganidan 2 barobar ko\'p pomidor va barra ko\'kat berdi.',
    type: 'positive',
    impactText: 'Oziq-ovqat zaxirasi +6 oyga ko\'paydi!',
    effect: { foodChangeMonths: 6 }
  },
  {
    id: 'evt-secret-room',
    title: '🚪 Zaxira Kichik Xona Ochildi!',
    description: 'Devor orqasidagi shamollatish yo\'lagi tozalangach, yana 1 kishi bemalol uxlashi mumkin bo\'lgan bo\'sh xona ochildi.',
    type: 'positive',
    impactText: 'Boshpanadagi g\'oliblar o\'rni +1 taga oshdi!',
    effect: { addShelterSlot: 1 }
  },
  {
    id: 'evt-water-leak',
    title: '💧 Suv Quvuri Yorildi!',
    description: 'Zanglagan quvurlardan biri bosimga dosh bera olmay yorildi va 100 litr toza ichimlik suvi oqib ketdi.',
    type: 'negative',
    impactText: 'Suv zaxirasi -4 oyga qisqardi. Santexnik yoki usta kerak!',
    effect: { waterChangeMonths: -4 }
  },
  {
    id: 'evt-generator-spark',
    title: '⚡ Generator Nosozligi va Tutun!',
    description: 'Elektr generatori qizib ketib tutadi. Zudlik bilan muhandis yoki texnik xodim zarur!',
    type: 'negative',
    impactText: 'Keyingi raundda hamma tezroq gapirishi shart (Taymer 10s ga qisqaradi).',
    effect: { speedUpTimerSec: 10 }
  },
  {
    id: 'evt-radio-signal',
    title: '📻 Begona Radio To\'lqin Sadosi!',
    description: 'Eski radiopriyomnikdan xira ovoz eshitildi: boshqa bir noma\'lum bunker bilan qisqa aloqa o\'rnatildi.',
    type: 'neutral',
    impactText: 'Dunyo bo\'ylab yana boshqa tirik odamlar borligi ma\'lum bo\'ldi.'
  },
  {
    id: 'evt-rat-infestation',
    title: '🐀 Omborxonada Kalamushlar!',
    description: 'Konservalar saqlanadigan xonaga kemiruvchilar kirib olgan. Bir necha quti oziq-ovqat zararlangan.',
    type: 'negative',
    impactText: 'Oziq-ovqat zaxirasi biroz kamaydi.',
    effect: { foodChangeMonths: -2 }
  },
  {
    id: 'evt-old-cash',
    title: '💰 1995-yilgi Sumlar Qutisi!',
    description: 'Eski temir sandiqdan 1 milliard sovet sumi va 1995-yilgi qog\'oz pullar topildi. Ammo hozir ular bir tiyinga qimmat.',
    type: 'neutral',
    impactText: 'Jamoa shunchaki xotiralarni eslab kulishdi (0 foyda).'
  }
];

// ==================== MASSIVE CARDS POOL (120+ CARDS) ====================
export const CARDS_DATA: CardItem[] = [
  // ---------- KASBLAR (40+ PROFESSIONS) ----------
  { id: 'prof-surgeon', category: 'profession', title: 'Bosh Xirurg (Jarroh)', description: 'O\'ta murakkab operatsiyalarni o\'tkaza oladi, 15 yillik tajribaga ega.', theme: 'classic', icon: 'Stethoscope', impactScore: { medical: 5, tech: 1 } },
  { id: 'prof-engineer', category: 'profession', title: 'Muhandis-Energetik', description: 'Har qanday generator, elektr tarmog\'i va turbinalarni ta\'mirlay oladi.', theme: 'classic', icon: 'Wrench', impactScore: { tech: 5, defense: 2 } },
  { id: 'prof-agronomist', category: 'profession', title: 'Agronom / Fermer', description: 'Yopiq xonalarda sun\'iy yorug\'likda ekin ekish va hosil olish ustasi.', theme: 'classic', icon: 'Sprout', impactScore: { food: 5, tech: 1 } },
  { id: 'prof-soldier', category: 'profession', title: 'Maxsus Kuchlar Ofitseri', description: 'Harbiy taktika, qurol-yarog\' va himoya postlarini tashkil qilish mutaxassisi.', theme: 'classic', icon: 'Shield', impactScore: { defense: 5, psychology: 1 } },
  { id: 'prof-programmer', category: 'profession', title: 'Kiber-Xavfsizlik Dasturchisi', description: 'Bunker kompyuter tizimlarini boshqaradi, robotlarni qayta dasturlaydi.', theme: 'classic', icon: 'Terminal', impactScore: { tech: 5, defense: 2 } },
  { id: 'prof-psychologist', category: 'profession', title: 'Klinik Psixoterapevt', description: 'Bunker ichidagi vahima, isterika va o\'zaro janjallarni tinchitish qobiliyati.', theme: 'classic', icon: 'Brain', impactScore: { psychology: 5, medical: 2 } },
  { id: 'prof-teacher', category: 'profession', title: 'Boshlang\'ich Sinf O\'qituvchisi', description: 'Kelajak avlodga bilimlarni tizimli o\'rgatish va sivilizatsiyani tiklash asosi.', theme: 'classic', icon: 'BookOpen', impactScore: { psychology: 3, food: 1 } },
  { id: 'prof-chemist', category: 'profession', title: 'Kimyogar-Toksikolog', description: 'Suvni va havoni zaharlardan tozalaydi, dori sintez qiladi.', theme: 'classic', icon: 'FlaskConical', impactScore: { medical: 4, tech: 4 } },
  { id: 'prof-builder', category: 'profession', title: 'Quruvchi-Santexnik', description: 'Quvurlar, beton devorlar va mustahkam bunker konstruksiyalari ustasi.', theme: 'classic', icon: 'Hammer', impactScore: { tech: 4, defense: 3 } },
  { id: 'prof-biologist', category: 'profession', title: 'Genetik Biolog', description: 'O\'simlik va hayvonlar klonlash, urug\'larni mutatsiyadan saqlash mutaxassisi.', theme: 'classic', icon: 'Dna', impactScore: { food: 4, medical: 3 } },
  { id: 'prof-geologist', category: 'profession', title: 'Geolog / Qidiruvchi', description: 'Yer osti suvlari, minerallar va seysmik yoriqlarni aniqlay oladi.', theme: 'classic', icon: 'Mountain', impactScore: { tech: 3, food: 2 } },
  { id: 'prof-cook-general', category: 'profession', title: 'Restoran Bosh Oshpazi', description: 'Har qanday kamyob mahsulotdan to\'yimli va uzoq saqlanuvchi taomlar tayyorlaydi.', theme: 'classic', icon: 'Utensils', impactScore: { food: 5, psychology: 2 } },
  { id: 'prof-firefighter', category: 'profession', title: 'Qutqaruvchi O\'t O\'chiruvchi', description: 'Yong\'in, tutun va vayronalar ostidan odamlarni qutqarish ustasi.', theme: 'classic', icon: 'Flame', impactScore: { defense: 4, medical: 2 } },
  { id: 'prof-pilot', category: 'profession', title: 'Dron va Aviatsiya Uchuvchisi', description: 'Tashqi razvedka dronlarini boshqarib xavfsiz marshrutlarni aniqlaydi.', theme: 'classic', icon: 'Compass', impactScore: { tech: 4, defense: 2 } },

  // O'zbekona Kasblar
  { id: 'prof-taksist', category: 'profession', title: 'Toshkent-Vodiy Taksisti', description: 'Har qanday nosozlikni sim bilan tuzatadi, butun yo\'llarni yoddan biladi.', theme: 'uzbek', icon: 'Car', impactScore: { tech: 3, defense: 2, psychology: 3 } },
  { id: 'prof-choyxona-oshpaz', category: 'profession', title: 'To\'y Oshpazi (Osh Pazi)', description: '500 kishiga 1 ta qozonda ajoyib palov damlaydi, 1 gramm ham isrof qilmaydi.', theme: 'uzbek', icon: 'Utensils', impactScore: { food: 5, psychology: 4 } },
  { id: 'prof-mahalla-raisi', category: 'profession', title: 'Katta Mahalla Raisi', description: 'Har qanday janjalni bir og\'iz gap bilan bosadi, qog\'ozbozlik va tartib qiroli.', theme: 'uzbek', icon: 'Users', impactScore: { psychology: 5, defense: 2 } },
  { id: 'prof-svarkachi', category: 'profession', title: 'Katta Svarkachi (Payvandchi)', description: 'Har qanday temirni choklab, bunker eshigini dushmanga ochilmaydigan qiladi.', theme: 'uzbek', icon: 'Flame', impactScore: { tech: 5, defense: 4 } },
  { id: 'prof-domla', category: 'profession', title: 'Notiq Domla', description: 'Odamlarning ruhiyatini ko\'taruvchi, xotirjamlik va sabrga chaqiruvchi kuchli shaxs.', theme: 'uzbek', icon: 'Sparkles', impactScore: { psychology: 5 } },
  { id: 'prof-paynetchi', category: 'profession', title: 'Malikadagi Telefon Ustasi (Paynetchi)', description: 'Har qanday mikrosxemani kavsharlaydi, bloklangan tizimlarni proshivka qiladi.', theme: 'uzbek', icon: 'Cpu', impactScore: { tech: 5 } },
  { id: 'prof-sartarosh', category: 'profession', title: 'Mahalla Sartaroshi', description: 'Gigiyena, jamoa kayfiyati va hamma sirlarni biladigan eng suhbatkash inson.', theme: 'uzbek', icon: 'Scissors', impactScore: { psychology: 3, medical: 1 } },
  { id: 'prof-qassob', category: 'profession', title: 'Go\'shtdor Qassob', description: 'Pichoq ishlatish, go\'shtni tuzlab yillab saqlash va jismoniy baquvvatlik.', theme: 'uzbek', icon: 'Beef', impactScore: { food: 4, defense: 3 } },
  { id: 'prof-buxgalter', category: 'profession', title: 'Tajribali Bosh Buxgalter', description: 'Har bir gramm un, har bir litr suvni oxirgi tomchisigacha hisob-kitob qiladi.', theme: 'uzbek', icon: 'Calculator', impactScore: { food: 3, tech: 2 } },

  // 18+ Kasblar
  { id: 'prof-stripper', category: 'profession', title: 'Professional Striptizchi', description: 'O\'ta egiluvchan tana, chidamlilik va har qanday insonni rom qilish mahorati.', theme: 'nsfw18', icon: 'Smile', impactScore: { psychology: 3, defense: 1 } },
  { id: 'prof-mafia-boss', category: 'profession', title: 'Yashirin Qimorxona Egasi', description: 'Odamlarning zaifliklarini biladi, muzokara va bosim o\'tkazish ustasi.', theme: 'nsfw18', icon: 'Crosshair', impactScore: { psychology: 4, defense: 3 } },
  { id: 'prof-hacker-darknet', category: 'profession', title: 'Darknet Xakeri', description: 'Tizimlarni buzish, parollarni ochish va yashirin kameralarni o\'rnatish mutaxassisi.', theme: 'nsfw18', icon: 'Key', impactScore: { tech: 5 } },

  // ---------- BIOLOGIYA (20+ BIOLOGY) ----------
  { id: 'bio-m-25-fertile', category: 'biology', title: 'Erkak, 25 yosh (A\'lo nasl beruvchi)', description: 'Kuch-quvvatga to\'lgan, jismonan mutlaq baquvvat.', theme: 'classic' },
  { id: 'bio-f-23-fertile', category: 'biology', title: 'Ayol, 23 yosh (Farzand ko\'rishga tayyor)', description: 'Genetik jihatdan sog\'lom va yosh.', theme: 'classic' },
  { id: 'bio-m-42-infertile', category: 'biology', title: 'Erkak, 42 yosh (Bepusht)', description: 'Katta hayotiy tajribaga ega, ammo nasl qoldirolmaydi.', theme: 'classic' },
  { id: 'bio-f-38-twins', category: 'biology', title: 'Ayol, 38 yosh (Egizaklar tug\'ish geni)', description: 'Oila tarixida doim sog\'lom egizaklar tug\'ilgan.', theme: 'classic' },
  { id: 'bio-m-65-elder', category: 'biology', title: 'Erkak, 65 yosh (Nafaqaxo\'r oqsoqol)', description: 'Hayotiy maslahatlar manbai, ammo tez charchaydi.', theme: 'classic' },
  { id: 'bio-f-19-athlete', category: 'biology', title: 'Ayol, 19 yosh (Sportchi qiz)', description: 'Gimnastika bo\'yicha chempion, immuniteti yuqori.', theme: 'classic' },
  { id: 'bio-m-30-polvon', category: 'biology', title: 'Erkak, 30 yosh (Kurashchi polvon)', description: '100 kg yukni bemalol ko\'taradi, jismoniy kuch.', theme: 'uzbek' },
  { id: 'bio-f-27-mom', category: 'biology', title: 'Ayol, 27 yosh (3 ta bola onasi)', description: 'Katta oila boshqargan, sabrli va mehribon.', theme: 'uzbek' },
  { id: 'bio-m-21-blood', category: 'biology', title: 'Erkak, 21 yosh (1-Salbiy universal qon donori)', description: 'Har qanday jarohatlangan insonga universal qon bera oladi.', theme: 'classic' },
  { id: 'bio-f-32-doctorate', category: 'biology', title: 'Ayol, 32 yosh (2 ta fan doktori)', description: 'Yuqori intellekt va aql egasi.', theme: 'classic' },

  // ---------- SALOMATLIK (20+ HEALTH) ----------
  { id: 'hlth-perfect', category: 'health', title: 'Mutlaqo Sog\'lom (Temir Immunitet)', description: 'Birorta surunkali kasalligi yo\'q, shamollamaydi.', theme: 'classic', impactScore: { medical: 2 } },
  { id: 'hlth-diabetes', category: 'health', title: '1-Tip Qandli Diabet (Insulin zarur)', description: 'Har oy muntazam insulin qabul qilishi shart.', theme: 'classic', impactScore: { medical: -3 } },
  { id: 'hlth-blind-one', category: 'health', title: 'Bir Ko\'zi Ko\'r (50% ko\'rish)', description: 'Mo\'ljalga olishda biroz qiynaladi, lekin yashashga xalal bermaydi.', theme: 'classic' },
  { id: 'hlth-claustrophobia', category: 'health', title: 'Og\'ir Klostrofobiya (Tor joydan qo\'rqish)', description: 'Bunkerda qattiq isterika va vahima xurujiga tushishi mumkin.', theme: 'classic', impactScore: { psychology: -3 } },
  { id: 'hlth-asthma', category: 'health', title: 'Bronxial Astma', description: 'Chang va tutunda ingalyator kerak bo\'ladi.', theme: 'classic', impactScore: { medical: -2 } },
  { id: 'hlth-iron-stomach', category: 'health', title: 'Temir Oshqozon (O\'zbekcha immunitet)', description: 'Loyqa suv yoki muzdek qatiq ichsa ham qorni og\'rimaydi.', theme: 'uzbek', impactScore: { food: 2 } },
  { id: 'hlth-insomnia', category: 'health', title: 'Surunkali Uyqusizlik', description: 'Kechalari uxlamaydi, doim hushyor, lekin asablari tarang.', theme: 'classic', impactScore: { defense: 1, psychology: -1 } },
  { id: 'hlth-colorblind', category: 'health', title: 'Daltonik (Ranglarni ajratolmaydi)', description: 'Qizil va yashil simlarni adashtirishi mumkin.', theme: 'classic', impactScore: { tech: -1 } },
  { id: 'hlth-super-hearing', category: 'health', title: 'O\'tkir Eshitish Qobiliyati', description: 'Devor ortidagi har qanday qadam tovushini 100 metrdan sezadi.', theme: 'classic', impactScore: { defense: 3 } },
  { id: 'hlth-std-secret', category: 'health', title: 'Yashirin Yuqumli Zaxm (18+)', description: 'Faqat yaqin aloqada yuqadi, jiddiy davolanish talab qiladi.', theme: 'nsfw18', impactScore: { medical: -3 } },

  // ---------- BAGAJ / BUYUMLAR (25+ BAGGAGE) ----------
  { id: 'bag-shotgun', category: 'baggage', title: 'Ov Miltig\'i va 50 ta Patron', description: 'Bunkerni tashqi tajovuzkorlardan himoya qilish vositasi.', theme: 'classic', icon: 'ShieldAlert', impactScore: { defense: 5 } },
  { id: 'bag-medkit', category: 'baggage', title: 'Harbiy Katta Aptechka', description: 'Skalpel, antibiotiklar, og\'riqsizlantiruvchi va tikish iplari.', theme: 'classic', icon: 'BriefcaseMedical', impactScore: { medical: 5 } },
  { id: 'bag-seeds', category: 'baggage', title: 'Gidroponik Urug\'lar To\'plami (10 kg)', description: 'Bug\'doy, pomidor, loviya va soya urug\'lari.', theme: 'classic', icon: 'Leaf', impactScore: { food: 5 } },
  { id: 'bag-toolbox', category: 'baggage', title: 'Professional Asboblar Qutisi', description: 'Har qanday mexanizm va elektronikani ochish kalitlari.', theme: 'classic', icon: 'Wrench', impactScore: { tech: 4 } },
  { id: 'bag-books', category: 'baggage', title: '30 jildli Qomus (Ensiklopediya)', description: 'Barcha insoniyat bilimlari: kimyo, fizika, dehqonchilik va tibbiyot.', theme: 'classic', icon: 'BookMarked', impactScore: { tech: 3, psychology: 3 } },
  { id: 'bag-water-filter', category: 'baggage', title: 'Nano-Suv Tozalash Filtri', description: 'Har qanday loyqa yoki radiatsion suvni 99.9% tozalaydi.', theme: 'classic', icon: 'Droplets', impactScore: { medical: 3, food: 3 } },
  { id: 'bag-samovar', category: 'baggage', title: 'O\'t Yoqiladigan Jez Samovar', description: 'Elektrsiz ham 10 daqiqada butun jamoaga qaynoq ko\'k choy damlaydi.', theme: 'uzbek', icon: 'Coffee', impactScore: { psychology: 4, food: 2 } },
  { id: 'bag-damas-tire', category: 'baggage', title: 'Damas Zapaskasi va Domkrat', description: 'Mustahkam rezina va har qanday og\'ir yukni ko\'tarish mexanizmi.', theme: 'uzbek', icon: 'Disc', impactScore: { tech: 3 } },
  { id: 'bag-kishmish', category: 'baggage', title: 'Bir qop Qora Kishmish va Yong\'oq (50 kg)', description: '10 yil buzilmaydigan, kaloriyaga o\'ta boy super-oziq-ovqat.', theme: 'uzbek', icon: 'Package', impactScore: { food: 5 } },
  { id: 'bag-kazan', category: 'baggage', title: '50 litrlik Chuyan Qozon', description: 'Bunkerdagi har qanday narsani pishirish yoki suv qaynatish idishi.', theme: 'uzbek', icon: 'Soup', impactScore: { food: 4 } },
  { id: 'bag-svarka-gen', category: 'baggage', title: 'Benzinli Mini-Generator va Svarka', description: 'Avtonom tok beradi va temir konstruksiyalarni eritib ulaydi.', theme: 'uzbek', icon: 'Zap', impactScore: { tech: 5, defense: 2 } },
  { id: 'bag-samarkand-bread', category: 'baggage', title: '20 dona Samarqand Qotgan Noni', description: 'Suv sepsangiz darhol yumshaydi, 3 yil buzilmaydi.', theme: 'uzbek', icon: 'Cookie', impactScore: { food: 4 } },
  { id: 'bag-drone-survey', category: 'baggage', title: 'Termal Kamerali Mini-Dron', description: 'Bunker atrofidagi vaziyatni xavfsiz kuzatish apparati.', theme: 'classic', icon: 'Camera', impactScore: { defense: 4, tech: 2 } },
  { id: 'bag-whiskey', category: 'baggage', title: '12 shisha 18 yillik Viski (18+)', description: 'Kuchli antiseptik, og\'riq qoldiruvchi yoki jamoani mast qilish vositasi.', theme: 'nsfw18', icon: 'Wine', impactScore: { medical: 2, psychology: 3 } },

  // ---------- XOBBI & KO'NIKMALAR (15+ HOBBIES) ----------
  { id: 'hob-karate', category: 'hobby', title: 'Qo\'l Jangi / Karate (Qora belbog\')', description: 'Qurolsiz ham o\'zini va boshqalarni dushmandan himoya qiladi.', theme: 'classic', impactScore: { defense: 4 } },
  { id: 'hob-guitar', category: 'hobby', title: 'Gitara va Jonli Qo\'shiq Kuylash', description: 'Bunker ahlini tushkunlikdan olib chiqadi, ruhiyatni ko\'taradi.', theme: 'classic', impactScore: { psychology: 5 } },
  { id: 'hob-radio-ham', category: 'hobby', title: 'Radio-Havaskor (Morze alifbosi)', description: 'Eski qismlardan boshqa omon qolganlar bilan aloqa stansiyasi yasaydi.', theme: 'classic', impactScore: { tech: 4 } },
  { id: 'hob-herbalist', category: 'hobby', title: 'Xalq Tabobati va Giyafrushlik', description: 'Har qanday o\'t-o\'landan dorivor damlama va malham tayyorlaydi.', theme: 'uzbek', impactScore: { medical: 4 } },
  { id: 'hob-chess', category: 'hobby', title: 'Shaxmat Grossmeysteri', description: 'Strategik rejalashtirish va resurslarni 10 qadam oldindan hisoblash ustasi.', theme: 'classic', impactScore: { psychology: 3, tech: 2 } },
  { id: 'hob-lockpicking', category: 'hobby', title: 'Qulflarni Ochish (Spitsialist)', description: 'Qulflanib qolgan har qanday zanglagan eshikni 30 soniyada ochadi.', theme: 'classic', impactScore: { tech: 3, defense: 2 } },

  // ---------- FAKTLAR (15+ FACTS) ----------
  { id: 'fac-architect', category: 'fact', title: 'Boshpana Chizmasi Muallifi', description: 'Bu boshpananing barcha yashirin xonalari va zaxira lyuklarini biladi.', theme: 'classic', impactScore: { tech: 3, defense: 3 } },
  { id: 'fac-prison', category: 'fact', title: 'O\'tmishda Qamoqdan Qochgan', description: 'Har qanday qulfni ochadi, ammo o\'g\'irlikka moyilligi bor.', theme: 'classic', impactScore: { defense: 2, psychology: -2 } },
  { id: 'fac-poison-immune', category: 'fact', title: 'Zaharlarga Chidamli (Immunitet)', description: 'Ilgari zaharli moddalar bilan ishlagan, tanasi zahar qabul qilmaydi.', theme: 'classic', impactScore: { medical: 3 } },
  { id: 'fac-password', category: 'fact', title: 'Boshpana Boshqaruv Parolini Biladi', description: 'U bo\'lmasa, markaziy ombor qulflanib qolishi mumkin.', theme: 'uzbek', impactScore: { food: 3 } },
  { id: 'fac-agent', category: 'fact', title: 'Yashirin Maxfiy Agent', description: 'Yolg\'onni 1 soniyada sezadi, kim dushman ekanini darhol aniqlaydi.', theme: 'classic', impactScore: { defense: 4 } },

  // ---------- MAXSUS HARAKAT KARTALARI (SPECIAL CARDS) ----------
  {
    id: 'spc-cancel-vote',
    category: 'special',
    title: 'Veto Huquqi (Ovozni Bekor Qilish)',
    description: 'Joriy raundda o\'zingizga berilgan barcha ovozlarni bekor qilasiz.',
    theme: 'classic',
    icon: 'Ban',
    specialAction: { type: 'cancel_vote' }
  },
  {
    id: 'spc-swap-profession',
    category: 'special',
    title: 'Kasbni Almashtirish (Rokirovka)',
    description: 'Ixtiyoriy boshqa o\'yinchi bilan kasbingizni majburiy almashtirasiz.',
    theme: 'classic',
    icon: 'Shuffle',
    specialAction: { type: 'swap_profession' }
  },
  {
    id: 'spc-add-slot',
    category: 'special',
    title: 'Qo\'shimcha O\'rin (+1 Boshpana Joyi)',
    description: 'Boshpanada zaxira xona ochiladi: g\'oliblar soni 1 taga oshadi!',
    theme: 'classic',
    icon: 'PlusCircle',
    specialAction: { type: 'add_shelter_slot' }
  },
  {
    id: 'spc-steal-baggage',
    category: 'special',
    title: 'Bagajni Musodara Qilish',
    description: 'Ixtiyoriy o\'yinchining bagaj kartasini tortib olib o\'zingizga olasiz.',
    theme: 'classic',
    icon: 'ShoppingBag',
    specialAction: { type: 'steal_baggage' }
  },
  {
    id: 'spc-force-reveal',
    category: 'special',
    title: 'Rostgo\'ylik Sarumi',
    description: 'Tanlangan o\'yinchining ixtiyoriy 1 ta yashirin kartasini hammaga ochib tashlaysiz.',
    theme: 'classic',
    icon: 'Eye',
    specialAction: { type: 'force_reveal' }
  },
  {
    id: 'spc-double-vote',
    category: 'special',
    title: 'Ikki Hissa Ovoz (Qo\'sh Ovoz)',
    description: 'Ovoz berishda sizning ovozingiz 2 ta deb hisoblanadi.',
    theme: 'uzbek',
    icon: 'Vote',
    specialAction: { type: 'extra_vote' }
  },

  // Falokatlarga bog'liq maxsus kartalar:
  {
    id: 'spc-rad-suit',
    category: 'special',
    title: 'Kevlar Radiatsiya Kostyumi',
    description: 'Faqat Yadro Qishi falokatida: siz radiatsiyaga 100% chidamlilikka ega bo\'lasiz.',
    theme: 'classic',
    disasterSpecificId: 'cat-nuclear-winter',
    icon: 'Shield',
    specialAction: { type: 'immunity' }
  },
  {
    id: 'spc-antidote',
    category: 'special',
    title: 'Tajriba Vaksina Ampulasi',
    description: 'Faqat Zombi Epidemiyasida: o\'zingizdagi yoki do\'stingizdagi har qanday kasallikni davolaydi.',
    theme: 'classic',
    disasterSpecificId: 'cat-zombie-virus',
    icon: 'HeartPulse',
    specialAction: { type: 'heal_condition' }
  },
  {
    id: 'spc-pechka-wood',
    category: 'special',
    title: 'Cho\'yan Pechka va 1 Qop Ko\'mir',
    description: 'Faqat Buyuk Chilla falokatida: boshpanani 6 oy issiq ushlab turadi.',
    theme: 'uzbek',
    disasterSpecificId: 'cat-eternal-blackout',
    icon: 'Flame',
    impactScore: { tech: 3, defense: 2 }
  }
];
