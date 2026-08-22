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
    id: 'cat-salt-storm-aral',
    title: 'Orolbo\'yi Zaharli Tuz Bo\'roni',
    shortDesc: 'Orol tubidagi qadimiy kimyoviy qurollar va tuzlar havoga ko\'tarilib, o\'ta zaharli kislotali bo\'ron hosil qildi.',
    fullStory: 'Atmosferadagi tuz o\'pkani kuydiradi. Suv filtrlari va germetik bunker kerak.',
    theme: 'uzbek',
    requiredSkills: ['medical', 'tech', 'food'],
    shelterMonths: 30,
    hazards: ['Kislotali yomg\'ir', 'Ko\'z va o\'pka kuyishi', 'Suv sho\'rlanishi'],
    exclusiveSpecialCardIds: ['spc-aral-mask']
  },
  {
    id: 'cat-water-wars',
    title: 'Markaziy Osiyo Suv Urushi',
    shortDesc: 'Muzliklar erib bitdi. Daryolar qurib, ichimlik suvi uchun qurolli to\'qnashuvlar boshlandi.',
    fullStory: 'Faqat chuqur artezian qudug\'iga ega bo\'lgan boshpanada 36 oy yashash mumkin.',
    theme: 'uzbek',
    requiredSkills: ['defense', 'food', 'psychology'],
    shelterMonths: 36,
    hazards: ['Tashnalik', 'Suv talonchilari', 'Issiqlik urishi (+55°C)'],
    exclusiveSpecialCardIds: ['spc-water-well']
  },

  // 3. 18+ QORA YUMOR
  {
    id: 'cat-mad-party',
    title: 'Psixotrop Gaz Tarqalishi (18+)',
    shortDesc: 'Atmosferaga tarqalgan noma\'lum psixotrop modda barcha insonlarni o\'ta shafqatsiz va ehtirosli manyaklarga aylantirdi.',
    fullStory: 'Tashqi dunyo telbalik va axloqsizlik botqog\'iga botgan. Faqat sog\'lom aql egalari boshpanada yashirinishi kerak.',
    theme: 'nsfw18',
    requiredSkills: ['psychology', 'defense', 'medical'],
    shelterMonths: 20,
    hazards: ['Aqldan ozganlar to\'dasi', 'Psixotrop zaharlanish', 'Uyqusizlik'],
    exclusiveSpecialCardIds: ['spc-gas-mask']
  }
];

export const SHELTER_SPECS_PRESETS: ShelterSpecs[] = [
  {
    areaSqMeters: 180,
    durationMonths: 24,
    foodSuppliesMonths: 24,
    waterSuppliesMonths: 30,
    medicalSupplies: 'To\'liq harbiy operatsiya xonasi va 500 ta dori qutisi',
    defenseStatus: 'Titan qoplamali germetik eshik, pulemyotli datchiklar',
    specialFeature: 'Gidroponik issiqxona va 100 kg kartoshka urug\'i',
    internalThreat: 'Ventilyatsiya filtri har 6 oyda qo\'lda tozalanmasa tutun to\'ladi'
  },
  {
    areaSqMeters: 300,
    durationMonths: 36,
    foodSuppliesMonths: 36,
    waterSuppliesMonths: 40,
    medicalSupplies: 'Katta farmatsevtika ombori, kislorod ballonlari',
    defenseStatus: 'Yer osti 25 metr chuqurlikda, mustahkam beton gumbaz',
    specialFeature: 'Toshkent metrosining yopiq maxfiy bunkeri (Dizel generator)',
    internalThreat: 'Yer osti sizot suvlari bosib ketish xavfi bor'
  },
  {
    areaSqMeters: 120,
    durationMonths: 18,
    foodSuppliesMonths: 18,
    waterSuppliesMonths: 20,
    medicalSupplies: 'Boshlang\'ich birinchi yordam to\'plami',
    defenseStatus: 'Po\'lat eshik va kodli qulf',
    specialFeature: 'Avtonom chuqur artezian qudug\'i (Toza ichimlik suvi)',
    internalThreat: 'Zaxira generator yo\'q, sham va akkumulyatordan foydalaniladi'
  }
];

export const BUNKER_EVENTS: BunkerEvent[] = [
  {
    id: 'evt-hidden-medkit',
    title: 'Yashirin Dori-Darmon Ombori Topildi!',
    description: 'Bunkerni tozalash chog\'ida devor orqasidan antibakterial preparatlar va vitaminlar qutisi chiqdi.',
    type: 'positive',
    impactText: 'Tibbiy holat yaxshilandi! Omon qoluvchilarning kasalliklari yengillashdi.',
    effect: { addShelterSlot: 0 }
  },
  {
    id: 'evt-extra-room',
    title: 'Kutilmagan Zaxira Xona Ochildi!',
    description: 'Qadimiy temir eshik ochildi — ichida 2 kishilik qo\'shimcha krovat va kislorod zaxirasi bor!',
    type: 'positive',
    impactText: 'Boshpanadagi omon qoluvchilar kvotasi +1 taga oshdi!',
    effect: { addShelterSlot: 1 }
  },
  {
    id: 'evt-rats-food',
    title: 'Kalamushlar Hujumi (Ozuqa Talafoti)',
    description: 'Omborga kirgan kemiruvchilar oziq-ovqat qoplarining 30 foizini yaroqsiz holga keltirdi.',
    type: 'negative',
    impactText: 'Oziq-ovqat zaxirasi 4 oyga qisqardi! Qattiq tejamkorlik zarur.',
    effect: { foodChangeMonths: -4 }
  },
  {
    id: 'evt-water-leak',
    title: 'Kanalizatsiya Quvuri Yoriqlari',
    description: 'Suv tozalash filtriga loy aralashdi. Santexnika va kimyoviy bilim zarur!',
    type: 'negative',
    impactText: 'Suv filtri buzildi. Kimyogar yoki Quruvchi kerak!',
    effect: { waterChangeMonths: -3 }
  },
  {
    id: 'evt-radio-signal',
    title: 'Sirli Radio Signal Tutildi!',
    description: 'Boshqa bunkerdan morze alifbosida xabar keldi: "Tog\'larda hayot bor..."',
    type: 'neutral',
    impactText: 'Jamoaning umidi va ruhiyati sezilarli darajada ko\'tarildi!',
    effect: { speedUpTimerSec: 0 }
  }
];

// ================= 120+ EXPANDED CARDS DATA =================
export const CARDS_DATA: CardItem[] = [
  // ================= KASB (PROFESSIONS - 25+) =================
  { id: 'prof-surgeon', category: 'profession', title: 'Bosh Xirurg / Jarroh', description: 'Har qanday og\'ir jarohat, suyak sinishi va kasalliklarni operatsiya qila oladi.', theme: 'classic', icon: 'Stethoscope', impactScore: { medical: 5, psychology: 2 } },
  { id: 'prof-engineer', category: 'profession', title: 'Bosh Muhandis-Mexanik', description: 'Generatorlar, shamollatish tizimlari va avariya lyuklarini tuzatadi.', theme: 'classic', icon: 'Wrench', impactScore: { tech: 5, defense: 2 } },
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
  { id: 'prof-taksist', category: 'profession', title: 'Toshkent-Vodiy Taksisti', description: 'Har qanday nosozlikni sim bilan tuzatadi, butun yo\'llarni yoddan biladi.', theme: 'uzbek', icon: 'Car', impactScore: { tech: 3, defense: 2, psychology: 3 } },
  { id: 'prof-choyxona-oshpaz', category: 'profession', title: 'To\'y Oshpazi (Osh Pazi)', description: '500 kishiga 1 ta qozonda ajoyib palov damlaydi, 1 gramm ham isrof qilmaydi.', theme: 'uzbek', icon: 'Utensils', impactScore: { food: 5, psychology: 4 } },
  { id: 'prof-mahalla-raisi', category: 'profession', title: 'Katta Mahalla Raisi', description: 'Har qanday janjalni bir og\'iz gap bilan bosadi, qog\'ozbozlik va tartib qiroli.', theme: 'uzbek', icon: 'Users', impactScore: { psychology: 5, defense: 2 } },
  { id: 'prof-svarkachi', category: 'profession', title: 'Katta Svarkachi (Payvandchi)', description: 'Har qanday temirni choklab, bunker eshigini dushmanga ochilmaydigan qiladi.', theme: 'uzbek', icon: 'Flame', impactScore: { tech: 5, defense: 4 } },
  { id: 'prof-domla', category: 'profession', title: 'Notiq Domla', description: 'Odamlarning ruhiyatini ko\'taruvchi, xotirjamlik va sabrga chaqiruvchi kuchli shaxs.', theme: 'uzbek', icon: 'Sparkles', impactScore: { psychology: 5 } },
  { id: 'prof-paynetchi', category: 'profession', title: 'Malikadagi Telefon Ustasi (Paynetchi)', description: 'Har qanday mikrosxemani kavsharlaydi, bloklangan tizimlarni proshivka qiladi.', theme: 'uzbek', icon: 'Cpu', impactScore: { tech: 5 } },
  { id: 'prof-sartarosh', category: 'profession', title: 'Mahalla Sartaroshi', description: 'Gigiyena, jamoa kayfiyati va hamma sirlarni biladigan eng suhbatkash inson.', theme: 'uzbek', icon: 'Scissors', impactScore: { psychology: 3, medical: 1 } },
  { id: 'prof-qassob', category: 'profession', title: 'Go\'shtdor Qassob', description: 'Pichoq ishlatish, go\'shtni tuzlab yillab saqlash va jismoniy baquvvatlik.', theme: 'uzbek', icon: 'Beef', impactScore: { food: 4, defense: 3 } },
  { id: 'prof-buxgalter', category: 'profession', title: 'Tajribali Bosh Buxgalter', description: 'Har bir gramm un, har bir litr suvni oxirgi tomchisigacha hisob-kitob qiladi.', theme: 'uzbek', icon: 'Calculator', impactScore: { food: 3, tech: 2 } },
  { id: 'prof-stripper', category: 'profession', title: 'Professional Striptizchi', description: 'O\'ta egiluvchan tana, chidamlilik va har qanday insonni rom qilish mahorati.', theme: 'nsfw18', icon: 'Smile', impactScore: { psychology: 3, defense: 1 } },
  { id: 'prof-mafia-boss', category: 'profession', title: 'Yashirin Qimorxona Egasi', description: 'Odamlarning zaifliklarini biladi, muzokara va bosim o\'tkazish ustasi.', theme: 'nsfw18', icon: 'Crosshair', impactScore: { psychology: 4, defense: 3 } },

  // ================= BIOLOGIYA (BIOLOGY - 20+) =================
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
  { id: 'bio-m-18-teen', category: 'biology', title: 'Erkak, 18 yosh (Tez o\'rganuvchi)', description: 'Har qanday yangi hunarni 2 kunda o\'zlashtiradi.', theme: 'classic' },
  { id: 'bio-f-45-leader', category: 'biology', title: 'Ayol, 45 yosh (Tashkilotchi rahbar)', description: 'Krizis vaqtida jamoani tartibga solish qobiliyati.', theme: 'classic' },
  { id: 'bio-m-50-veteran', category: 'biology', title: 'Erkak, 50 yosh (Urush faxriysi)', description: 'Ko\'p sinovlarni ko\'rgan, ruhiyati mustahkam.', theme: 'classic' },
  { id: 'bio-f-29-gardener', category: 'biology', title: 'Ayol, 29 yosh (O\'simliklar ustasi)', description: 'Har qanday quruq tuproqda ko\'kat yetishtiradi.', theme: 'uzbek' },
  { id: 'bio-m-35-builder', category: 'biology', title: 'Erkak, 35 yosh (195 sm bo\'y, baquvvat)', description: 'Og\'ir tosh va metallarni bemalol ko\'taradi.', theme: 'uzbek' },
  { id: 'bio-f-21-student', category: 'biology', title: 'Ayol, 21 yosh (Tibbiyot talabasi)', description: 'Tezkor reaksiyaga ega, kechalari uxlamay ishlay oladi.', theme: 'classic' },
  { id: 'bio-m-28-diver', category: 'biology', title: 'Erkak, 28 yosh (G\'avvos / Suvchi)', description: 'Suv ostida 4 daqiqa nafasini ushlay oladi.', theme: 'classic' },
  { id: 'bio-f-55-bobo', category: 'biology', title: 'Ayol, 55 yosh (Tajribali buvijon)', description: 'Oziq-ovqatlarni yillab chirimasdan saqlash sirlarini biladi.', theme: 'uzbek' },
  { id: 'bio-m-33-driver', category: 'biology', title: 'Erkak, 33 yosh (Reaksiyasi soniyalik)', description: 'Xavfni 1 soniya oldin sezish qobiliyati.', theme: 'classic' },
  { id: 'bio-f-26-polyglot', category: 'biology', title: 'Ayol, 26 yosh (6 ta til biladi)', description: 'Boshqa chet el bunkerlari bilan aloqa o\'rnatadi.', theme: 'classic' },

  // ================= SALOMATLIK (HEALTH - 20+) =================
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
  { id: 'hlth-allergy-dust', category: 'health', title: 'Chang va Zamburug\' Allergiyasi', description: 'Ventilyatsiya toza bo\'lmasa, to\'xtovsiz aksiradi.', theme: 'classic', impactScore: { medical: -1 } },
  { id: 'hlth-high-blood', category: 'health', title: 'Gipertoniya (Qon bosimi baland)', description: 'Og\'ir jismoniy yukda bosh aylanishi mumkin.', theme: 'classic', impactScore: { medical: -1 } },
  { id: 'hlth-night-vision', category: 'health', title: 'Qorong\'uda A\'lo Ko\'rish', description: 'Chiroq o\'chganda ham bemalol harakatlanadi.', theme: 'classic', impactScore: { tech: 2, defense: 2 } },
  { id: 'hlth-prosthetic-leg', category: 'health', title: 'Mexanik Oyoq Protezi', description: 'Chidamli kiber-oyoq, hech qachon og\'rimaydi.', theme: 'classic', impactScore: { tech: 1 } },
  { id: 'hlth-migraine', category: 'health', title: 'Surunkali Migren', description: 'Qattiq shovqinda 1 kun ish qobiliyatini yo\'qotadi.', theme: 'classic', impactScore: { psychology: -2 } },
  { id: 'hlth-strong-bones', category: 'health', title: 'Qalin va Mustahkam Suyaklar', description: 'Yiqilganda ham suyaklari sinmaydigan mustahkam skelet.', theme: 'classic', impactScore: { defense: 2 } },
  { id: 'hlth-cardio-beast', category: 'health', title: 'Marafonchi Yurak (Puls 45)', description: 'Charchoq bilmay 12 soat tinimsiz ishlay oladi.', theme: 'classic', impactScore: { defense: 3 } },
  { id: 'hlth-flatfoot', category: 'health', title: 'Yassioyoqlik (Ploskostopiya)', description: 'Uzoq yugura olmaydi, lekin o\'tirib ishlashga usta.', theme: 'classic' },
  { id: 'hlth-dentist-fear', category: 'health', title: 'Tish Og\'rig\'i', description: 'Bunkerda stomatolog bo\'lmasa azoblanadi.', theme: 'classic', impactScore: { medical: -1 } },
  { id: 'hlth-hypochondriac', category: 'health', title: 'Ipoxondrik (O\'zini kasal deb o\'ylovchi)', description: 'Doim vahima qiladi, lekin aslida sog\'lom.', theme: 'classic', impactScore: { psychology: -2 } },

  // ================= BAGAJ (BAGGAGE - 20+) =================
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
  { id: 'bag-solar-panel', category: 'baggage', title: 'Katlanuvchi Quyosh Paneli (500W)', description: 'Har qanday batareya va chiroqlarni avtonom zaryadlaydi.', theme: 'classic', icon: 'Sun', impactScore: { tech: 4 } },
  { id: 'bag-gas-masks', category: 'baggage', title: '5 dona Harbiy Protivogaz (Filtrlar bilan)', description: 'Zaharli gaz va tutundan 100% himoya.', theme: 'classic', icon: 'Shield', impactScore: { medical: 3, defense: 3 } },
  { id: 'bag-geiger-counter', category: 'baggage', title: 'Raqamli Dozimetr (Geyger Sanoqchisi)', description: 'Suv va ozuqadagi radiatsiyani darhol aniqlaydi.', theme: 'classic', icon: 'Activity', impactScore: { medical: 3, tech: 2 } },
  { id: 'bag-canned-meat', category: 'baggage', title: '100 banka Mol Go\'shti Tushonkasi', description: '5 yil saqlanadigan oqsilga boy zaxira.', theme: 'classic', icon: 'Package', impactScore: { food: 5 } },
  { id: 'bag-flamethrower', category: 'baggage', title: 'Qo\'lbola Olovpurkagich (Ognetomet)', description: 'Zombi yoki yirtqich hayvonlarni 1 soniyada yoqib yuboradi.', theme: 'classic', icon: 'Flame', impactScore: { defense: 5 } },
  { id: 'bag-ham-radio', category: 'baggage', title: 'Kuchli Qisqa To\'lqinli Radiostansiya', description: '5000 km masofadagi boshqa bunkerlar bilan bog\'lanish.', theme: 'classic', icon: 'Radio', impactScore: { tech: 4, psychology: 2 } },

  // ================= XOBBI (HOBBIES - 20+) =================
  { id: 'hob-karate', category: 'hobby', title: 'Qo\'l Jangi / Karate (Qora belbog\')', description: 'Qurolsiz ham o\'zini va boshqalarni dushmandan himoya qiladi.', theme: 'classic', impactScore: { defense: 4 } },
  { id: 'hob-guitar', category: 'hobby', title: 'Gitara va Jonli Qo\'shiq Kuylash', description: 'Bunker ahlini tushkunlikdan olib chiqadi, ruhiyatni ko\'taradi.', theme: 'classic', impactScore: { psychology: 5 } },
  { id: 'hob-radio-ham', category: 'hobby', title: 'Radio-Havaskor (Morze alifbosi)', description: 'Eski qismlardan boshqa omon qolganlar bilan aloqa stansiyasi yasaydi.', theme: 'classic', impactScore: { tech: 4 } },
  { id: 'hob-herbalist', category: 'hobby', title: 'Xalq Tabobati va Giyafrushlik', description: 'Har qanday o\'t-o\'landan dorivor damlama va malham tayyorlaydi.', theme: 'uzbek', impactScore: { medical: 4 } },
  { id: 'hob-chess', category: 'hobby', title: 'Shaxmat Grossmeysteri', description: 'Strategik rejalashtirish va resurslarni 10 qadam oldindan hisoblash ustasi.', theme: 'classic', impactScore: { psychology: 3, tech: 2 } },
  { id: 'hob-lockpicking', category: 'hobby', title: 'Qulflarni Ochish (Spitsialist)', description: 'Qulflanib qolgan har qanday zanglagan eshikni 30 soniyada ochadi.', theme: 'classic', impactScore: { tech: 3, defense: 2 } },
  { id: 'hob-origami', category: 'hobby', title: 'Qog\'oz Buklash va Origami San\'ati', description: 'Bolalarga ta\'lim beradi, tinchlantiruvchi meditatsiya.', theme: 'classic', impactScore: { psychology: 2 } },
  { id: 'hob-brewing', category: 'hobby', title: 'Xonaki Ichimliklar Tayyorlash', description: 'Meva po\'stlog\'idan toza spirt va antiseptik haydash ustasi.', theme: 'classic', impactScore: { medical: 3, food: 2 } },
  { id: 'hob-electronics', category: 'hobby', title: 'Robototexnika va Mikrosxemalar', description: 'Buzilgan simlarni ulab, chiroq va batareya yasaydi.', theme: 'classic', impactScore: { tech: 4 } },
  { id: 'hob-sewing', category: 'hobby', title: 'Tikuvchilik va Kiyim Yamash', description: 'Bunker aholisiga yirtilgan kiyimlarni tikib, issiq kiyim yasaydi.', theme: 'uzbek', impactScore: { tech: 2, food: 1 } },
  { id: 'hob-astronomy', category: 'hobby', title: 'Astronomiya va Yulduzlar', description: 'Tashqariga chiqqanda yulduzlar orqali yo\'lni xatosiz topadi.', theme: 'classic', impactScore: { tech: 2 } },
  { id: 'hob-hunting', category: 'hobby', title: 'Qopqon Qo\'yish va Ovchilik', description: 'Har qanday kichik jonzotlarni tuzoqqa tushirish sirlari.', theme: 'classic', impactScore: { food: 4, defense: 2 } },
  { id: 'hob-carpentry', category: 'hobby', title: 'Duradgorlik (Yog\'ochsozlik)', description: 'Krovat, stol va mustahkam yog\'och to\'siqlar yasaydi.', theme: 'uzbek', impactScore: { tech: 3, defense: 2 } },
  { id: 'hob-poker', category: 'hobby', title: 'Professional Qimor va Bluff', description: 'Odamlarning yuz ifodasidan yolg\'onini 100% sezadi.', theme: 'nsfw18', impactScore: { psychology: 4 } },
  { id: 'hob-massage', category: 'hobby', title: 'Terapevtik Massaj Ustasi', description: 'Mushaklar og\'rig\'i va stressni 10 daqiqada yengadi.', theme: 'classic', impactScore: { medical: 3, psychology: 3 } },
  { id: 'hob-baking', category: 'hobby', title: 'Tandirda Non va Somsa Yopish', description: 'Har qanday xamirni pechkada lazzatli qilib pishiradi.', theme: 'uzbek', impactScore: { food: 4, psychology: 3 } },
  { id: 'hob-archery', category: 'hobby', title: 'Kamondan O\'q Otish (Kamondoz)', description: 'Tovushsiz ov qilish va 50 metrdan nishonga urish.', theme: 'classic', impactScore: { defense: 4, food: 2 } },
  { id: 'hob-leather', category: 'hobby', title: 'Ko\'nchilik (Teri Oshlash)', description: 'Chidamli botinka va himoya kamarlari yasaydi.', theme: 'classic', impactScore: { tech: 2 } },
  { id: 'hob-calligraphy', category: 'hobby', title: 'Xattotlik va Kitob Ko\'chirish', description: 'Bilimlarni kelajak avlod uchun qog\'ozga muhrlaydi.', theme: 'uzbek', impactScore: { psychology: 3 } },
  { id: 'hob-paragliding', category: 'hobby', title: 'Ekstremal Sayyohlik', description: 'G\'orlar, baland qoyalar va sovuqda chidamlilik.', theme: 'classic', impactScore: { defense: 3 } },

  // ================= FAKTLAR (FACTS - 20+) =================
  { id: 'fac-architect', category: 'fact', title: 'Boshpana Chizmasi Muallifi', description: 'Bu boshpananing barcha yashirin xonalari va zaxira lyuklarini biladi.', theme: 'classic', impactScore: { tech: 3, defense: 3 } },
  { id: 'fac-prison', category: 'fact', title: 'O\'tmishda Qamoqdan Qochgan', description: 'Har qanday qulfni ochadi, ammo o\'g\'irlikka moyilligi bor.', theme: 'classic', impactScore: { defense: 2, psychology: -2 } },
  { id: 'fac-poison-immune', category: 'fact', title: 'Zaharlarga Chidamli (Immunitet)', description: 'Ilgari zaharli moddalar bilan ishlagan, tanasi zahar qabul qilmaydi.', theme: 'classic', impactScore: { medical: 3 } },
  { id: 'fac-password', category: 'fact', title: 'Boshpana Boshqaruv Parolini Biladi', description: 'U bo\'lmasa, markaziy ombor qulflanib qolishi mumkin.', theme: 'uzbek', impactScore: { food: 3 } },
  { id: 'fac-agent', category: 'fact', title: 'Yashirin Maxfiy Agent', description: 'Yolg\'onni 1 soniyada sezadi, kim dushman ekanini darhol aniqlaydi.', theme: 'classic', impactScore: { defense: 4 } },
  { id: 'fac-billionaire-heir', category: 'fact', title: 'Bunkerni Moliyalashtirgan Homiysi', description: 'Barcha jihozlarning qayerda turishini yoddan biladi.', theme: 'classic', impactScore: { tech: 2, food: 2 } },
  { id: 'fac-cult-leader', category: 'fact', title: 'Qadimiy Sirli Jamiyat A\'zosi', description: 'Odamlarni ishontirish va o\'z ortidan ergashtirish kuchi.', theme: 'classic', impactScore: { psychology: 4 } },
  { id: 'fac-stolen-code', category: 'fact', title: 'Dizel Generatori Maxfiy Kodini Biladi', description: 'Generator to\'xtab qolsa, faqat u qayta ishga tushiradi.', theme: 'classic', impactScore: { tech: 4 } },
  { id: 'fac-arsonist', category: 'fact', title: 'Olov bilan O\'ynashni Yoqtiradi', description: 'Har qanday nam o\'tinni yoqa oladi, lekin ehtiyotkorlik zarur.', theme: 'classic', impactScore: { tech: 2, defense: -1 } },
  { id: 'fac-photographic-mem', category: 'fact', title: 'Fotografik Xotira Egasi', description: 'O\'qigan 1000 ta kitobini verguligacha eslab qolgan.', theme: 'classic', impactScore: { tech: 4, medical: 3 } },
  { id: 'fac-secret-tunnel', category: 'fact', title: 'Tashqariga Chiqadigan Maxfiy Teshikni Biladi', description: 'Xavf tug\'ilganda jamoani xavfsiz evakuatsiya qila oladi.', theme: 'uzbek', impactScore: { defense: 4 } },
  { id: 'fac-food-smuggler', category: 'fact', title: 'Bunkerdan Tashqarida Yashirin Ombori Bor', description: 'Tashqarida 50 kg konserva ko\'mib qo\'yilgan.', theme: 'uzbek', impactScore: { food: 4 } },
  { id: 'fac-fake-identity', category: 'fact', title: 'Soxta Hujjat bilan Kirgan', description: 'Aslida boshqa odam, lekin barcha qobiliyatlari haqiqiy.', theme: 'nsfw18', impactScore: { psychology: -1, defense: 2 } },
  { id: 'fac-bunker-builder', category: 'fact', title: 'Bunker Betonini Qorishda Qatnashgan', description: 'Devorlarning eng mustahkam va zaif nuqtalarini biladi.', theme: 'uzbek', impactScore: { tech: 3, defense: 2 } },
  { id: 'fac-hermit', category: 'fact', title: '5 Yil Tog\'da Yolg\'iz Yashagan', description: 'Odamlarsiz va sukunatda yashashga 100% moslashgan.', theme: 'classic', impactScore: { psychology: 4 } },
  { id: 'fac-black-belt-secret', category: 'fact', title: 'O\'tmishda Maxsus Xizmatda Xizmat Qilgan', description: 'Tashqi hujumda butun boshpanani yolg\'iz himoya qiladi.', theme: 'classic', impactScore: { defense: 5 } },
  { id: 'fac-chef-secret', category: 'fact', title: '5 Yulduzli Mehmonxona Oshpazi Shogirdi', description: 'Oddiy suv va nondan ajoyib taom qiladi.', theme: 'uzbek', impactScore: { food: 3, psychology: 3 } },
  { id: 'fac-codebreaker', category: 'fact', title: 'Kriptograf / Kod Buzuvchi', description: 'Begona radio signallarni va parollarni 1 daqiqada ochadi.', theme: 'classic', impactScore: { tech: 4 } },
  { id: 'fac-healer-family', category: 'fact', title: '7 Avloddan Beri Tabiblar Oilasi', description: 'Kamyob dorilar formulasini yoddan biladi.', theme: 'uzbek', impactScore: { medical: 4 } },
  { id: 'fac-radioactive-survivor', category: 'fact', title: 'Ilgari Radiatsiya Avariyasidan Omon Chiqqan', description: 'Qonida kuchli antitanachalar bor.', theme: 'classic', impactScore: { medical: 3 } },

  // ================= MAXSUS KARTALAR (SPECIAL - 20+) =================
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
  {
    id: 'spc-heal-condition',
    category: 'special',
    title: 'Mo\'jizaviy Shifo (Dori Inyeksiyasi)',
    description: 'O\'zingizdagi yoki do\'stingizdagi har qanday salbiy kasallik kartasini butunlay yo\'qotasiz.',
    theme: 'classic',
    icon: 'HeartPulse',
    specialAction: { type: 'heal_condition' }
  },
  {
    id: 'spc-immunity',
    category: 'special',
    title: 'To\'liq Immunitet (1 Raund Omon Qolish)',
    description: 'Ushbu raundda sizni hech kim ovoz berish orqali chiqara olmaydi.',
    theme: 'classic',
    icon: 'Shield',
    specialAction: { type: 'immunity' }
  },
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
    description: 'Faqat Zombi Epidemiyasida: virusga qarshi mutlaq dori.',
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
  },
  {
    id: 'spc-aral-mask',
    category: 'special',
    title: 'Orol Kimyoviy Respiratori',
    description: 'Faqat Tuz Bo\'roni falokatida: o\'pkani tuz va kislotadan 100% saqlaydi.',
    theme: 'uzbek',
    disasterSpecificId: 'cat-salt-storm-aral',
    icon: 'Shield',
    specialAction: { type: 'immunity' }
  },
  {
    id: 'spc-water-well',
    category: 'special',
    title: 'Chuqur Quduq Burg\'ulash Qurilmasi',
    description: 'Faqat Suv Urushida: boshpanani cheksiz ichimlik suvi bilan ta\'minlaydi.',
    theme: 'uzbek',
    disasterSpecificId: 'cat-water-wars',
    icon: 'Droplets',
    impactScore: { food: 5, tech: 3 }
  },
  {
    id: 'spc-gas-mask',
    category: 'special',
    title: 'Armiya Germetik Gaz Niqobi',
    description: 'Faqat Psixotrop Gaz falokatida: aqldan ozishdan to\'liq asraydi.',
    theme: 'nsfw18',
    disasterSpecificId: 'cat-mad-party',
    icon: 'Shield',
    specialAction: { type: 'immunity' }
  },
  {
    id: 'spc-air-filter-spare',
    category: 'special',
    title: 'Zaxira Titan Havo Filtri',
    description: 'Faqat Asteroid Zarbasi falokatida: chang va tutunni 100% tozalaydi.',
    theme: 'classic',
    disasterSpecificId: 'cat-asteroid-impact',
    icon: 'Wrench',
    impactScore: { tech: 4, medical: 3 }
  },
  {
    id: 'spc-emp-jammer',
    category: 'special',
    title: 'Kiber-EMP To\'lqin Generator',
    description: 'Faqat SI Qo\'zg\'oloni falokatida: bunker atrofidagi barcha dushman dronlarni kuydiradi.',
    theme: 'classic',
    disasterSpecificId: 'cat-ai-uprising',
    icon: 'Zap',
    impactScore: { defense: 5, tech: 4 }
  }
];
