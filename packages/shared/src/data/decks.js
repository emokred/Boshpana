"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CARDS_DATA = exports.SHELTER_SPECS_PRESETS = exports.CATASTROPHES = void 0;
exports.CATASTROPHES = [
    // KLASSIK
    {
        id: 'cat-nuclear-winter',
        title: 'Yadro Qishi (2046-yil)',
        shortDesc: 'Dunyo miqyosidagi yadroviy to\'qnashuvdan so\'ng yer yuzini qalin qora tutun va -50°C sovuq qopladi.',
        fullStory: 'Yer yuzida quyosh nurlari deyarli ko\'rinmaydi. Radiatsiya darajasi o\'ta yuqori. Omon qolish uchun yer ostidagi boshpanada kamida 3 yil (36 oy) yashash talab etiladi.',
        theme: 'classic',
        requiredSkills: ['tech', 'defense', 'food'],
        shelterMonths: 36,
        hazards: ['Radiatsiya', 'Kuchli sovuq (-50°C)', 'Suv muzlashi']
    },
    {
        id: 'cat-zombie-virus',
        title: 'Zombi Epidemiyasi (Toshkent-0)',
        shortDesc: 'Laboratoriyadan qochgan tajriba virusi odamlarni tajovuzkor mutatsiya qilingan jonzotlarga aylantirdi.',
        fullStory: 'Tashqi dunyoda xavfsiz joy qolmagan. Mutatsiyaga uchraganlar hid va tovush orqali ov qilishadi. Boshpana eshigi germetik yopilishi va 2 yil davomida mustahkam saqlanishi kerak.',
        theme: 'classic',
        requiredSkills: ['defense', 'medical', 'psychology'],
        shelterMonths: 24,
        hazards: ['Yuqumli virus', 'Tashqi hujumlar', 'Psixologik vahima']
    },
    {
        id: 'cat-asteroid-impact',
        title: 'Ulkan Asteroid Zarbasi',
        shortDesc: 'Diametri 15 km bo\'lgan asteroid Tinch okeaniga quladi. Gigant sunami va chang bo\'roni yer atmosferasini to\'sdi.',
        fullStory: 'Tektonik yoriqlar, zilzilalar va kislorod tanqisligi. Erta chiqish halokatli. Boshpana ichida havo filtrlash tizimi va oziq-ovqat ta\'minotini 4 yil ushlab turish zarur.',
        theme: 'classic',
        requiredSkills: ['tech', 'food', 'medical'],
        shelterMonths: 48,
        hazards: ['Zilzilalar', 'Kislorod tanqisligi', 'Ozuqa yetishmovchiligi']
    },
    {
        id: 'cat-ai-uprising',
        title: 'Sun\'iy Intellekt Qo\'zg\'oloni',
        shortDesc: 'Avtonom kiber-tizimlar va jangovar dronlar insoniyatni yer resurslarini nobud qiluvchi deb topdi.',
        fullStory: 'Har qanday elektron signalni dronlar darhol skaner qilib yo\'q qiladi. Bunkerdan faqat passiv kiber-himoya va mutlaq radio-sukut bilan 1.5 yil chiqmaslik lozim.',
        theme: 'classic',
        requiredSkills: ['tech', 'defense', 'psychology'],
        shelterMonths: 18,
        hazards: ['Kiber-dronlar', 'Radio-skaner', 'Elektr toki uzilishi']
    },
    // O'ZBEKONA KOLORIT
    {
        id: 'cat-eternal-blackout',
        title: 'Abadiy Svet & Gaz O\'chishi (Buyuk Chilla)',
        shortDesc: 'Butun Markaziy Osiyo energetika tarmog\'i butunlay quladi. -35°C qish va birorta elektr manbai yo\'q.',
        fullStory: 'Tashqarida pechka va o\'tin jangi ketmoqda. Faqat eng qalin va avtonom generatorga ega "Registon-Boshpanasi"da omon qolish mumkin. Boshpana muddati: 24 oy.',
        theme: 'uzbek',
        requiredSkills: ['tech', 'food', 'defense'],
        shelterMonths: 24,
        hazards: ['Sovuq', 'Benzin taqchilligi', 'Qo\'shnilarning o\'tin talashishi']
    },
    {
        id: 'cat-sandstorm-2055',
        title: 'Buyuk Qum Bo\'roni (Orol-2055)',
        shortDesc: 'Tuz va qizil qum bo\'ronlari butun voha va shaharlarni 20 metrli qum ostiga ko\'mib yubordi.',
        fullStory: 'Ko\'z ochib bo\'lmaydi, nafas olish apparatisiz 5 daqiqada o\'pka tuzga to\'ladi. Boshpanada suv filtrlari va shisha issiqxona bor. Muddati: 30 oy.',
        theme: 'uzbek',
        requiredSkills: ['medical', 'food', 'tech'],
        shelterMonths: 30,
        hazards: ['Tuzli chang', 'Suv quritishi', 'Filtrlar tiqilishi']
    },
    {
        id: 'cat-wedding-plague',
        title: 'Buyuk To\'y Epidemiyasi',
        shortDesc: '5000 kishilik dabdabali to\'ydagi salatdan butun mamlakatga g\'alati, kulgili va to\'xtovsiz raqs tushiruvchi xavfli virus tarqaldi.',
        fullStory: 'Kasallanganlar tinmay karnay-surnay chalib boshqalarni ham quchoqlamoqda. Faqat qattiq karantinli Boshpanada 12 oy saqlanish shart.',
        theme: 'uzbek',
        requiredSkills: ['medical', 'psychology', 'defense'],
        shelterMonths: 12,
        hazards: ['Karnay sadosi', 'To\'xtovsiz o\'yin-kulgi xuruji', 'Uyqusizlik']
    },
    // 18+ QORA YUMOR
    {
        id: 'cat-hormone-overload',
        title: 'Feromon Gaz Qochishi (18+)',
        shortDesc: 'Yashirin parfyumeriya harbiy bazasidan kuchli nazoratsiz feromon gazi butun qit\'aga tarqaldi.',
        fullStory: 'Tashqarida qolgan barcha tirik mavjudotlar aqldan ozib, hayvoniy instinktlar ketidan quvmoqda. Boshpana eshigini mustahkam qulflab, 18 oy aql-hushni saqlash lozim.',
        theme: 'nsfw18',
        requiredSkills: ['psychology', 'medical', 'defense'],
        shelterMonths: 18,
        hazards: ['Kuchli vasvasa', 'Axloqiy qulash', 'Hissiy portlash']
    }
];
exports.SHELTER_SPECS_PRESETS = [
    {
        areaSqMeters: 180,
        durationMonths: 24,
        foodSuppliesMonths: 18,
        waterSuppliesMonths: 24,
        medicalSupplies: 'Standart shahar aptechkasi va 1 ta kislorod balloni',
        defenseStatus: 'Mustahkamlangan titan eshik va tashqi videokameralar',
        specialFeature: 'Kichik gidroponik bodring-pomidor issiqxonasi',
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
exports.CARDS_DATA = [
    // ==================== KASBLAR (PROFESSIONS) ====================
    // Klassik
    { id: 'prof-surgeon', category: 'profession', title: 'Bosh Xirurg (Jarroh)', description: 'O\'ta murakkab operatsiyalarni o\'tkaza oladi, 15 yillik tajribaga ega.', theme: 'classic', icon: 'Stethoscope', impactScore: { medical: 5, tech: 1 } },
    { id: 'prof-engineer', category: 'profession', title: 'Bosh Muhandis-Energetik', description: 'Har qanday generator, elektr tarmog\'i va turbinalarni ta\'mirlay oladi.', theme: 'classic', icon: 'Wrench', impactScore: { tech: 5, defense: 2 } },
    { id: 'prof-agronomist', category: 'profession', title: 'Agronom / Fermer', description: 'Yopiq xonalarda sun\'iy yorug\'likda ekin ekish va hosil olish ustasi.', theme: 'classic', icon: 'Sprout', impactScore: { food: 5, tech: 1 } },
    { id: 'prof-soldier', category: 'profession', title: 'Maxsus Kuchlar Ofitseri', description: 'Harbiy taktika, qurol-yarog\' va himoya postlarini tashkil qilish bo\'yicha mutaxassis.', theme: 'classic', icon: 'Shield', impactScore: { defense: 5, psychology: 1 } },
    { id: 'prof-programmer', category: 'profession', title: 'Dasturchi / Tizim Administratori', description: 'Kiber-xavfsizlik, avtomatlashtirish va bunker kompyuter tizimlarini boshqaradi.', theme: 'classic', icon: 'Terminal', impactScore: { tech: 4, defense: 2 } },
    { id: 'prof-psychologist', category: 'profession', title: 'Klinik Psixoterapevt', description: 'Bunker ichidagi vahima, isterika va o\'zaro janjallarni tinchitish qobiliyati.', theme: 'classic', icon: 'Brain', impactScore: { psychology: 5, medical: 2 } },
    { id: 'prof-teacher', category: 'profession', title: 'Boshlang\'ich Sinf O\'qituvchisi', description: 'Kelajak avlodga bilimlarni tizimli o\'rgatish va sivilizatsiyani tiklash asosi.', theme: 'classic', icon: 'BookOpen', impactScore: { psychology: 3, food: 1 } },
    { id: 'prof-chemist', category: 'profession', title: 'Kimyogar / Toksikolog', description: 'Suvni, havoni zaharlardan tozalash va dori vositalarini sintez qilish uquvi.', theme: 'classic', icon: 'FlaskConical', impactScore: { medical: 4, tech: 3 } },
    { id: 'prof-builder', category: 'profession', title: 'Usta Quruvchi / Santexnik', description: 'Quvurlar, beton devorlar va mustahkam konstruksiyalar ustasi.', theme: 'classic', icon: 'Hammer', impactScore: { tech: 4, defense: 3 } },
    // O'zbekona
    { id: 'prof-taksist', category: 'profession', title: 'Toshkent-Vodiy Taksisti', description: 'Har qanday nosozlikni sim va izolyatsiya lentasi bilan tuzatadi, butun xaritani yoddan biladi.', theme: 'uzbek', icon: 'Car', impactScore: { tech: 3, defense: 2, psychology: 3 } },
    { id: 'prof-choyxona-oshpaz', category: 'profession', title: 'To\'y Oshpazi (Osh Pazi)', description: '500 kishiga 1 ta qozonda ajoyib palov damlay oladi, oziq-ovqatni 1 grammini ham isrof qilmaydi.', theme: 'uzbek', icon: 'Utensils', impactScore: { food: 5, psychology: 3 } },
    { id: 'prof-mahalla-raisi', category: 'profession', title: 'Mahalla Raisi', description: 'Har qanday janjalni "og\'alar, bosiq bo\'laylik" deb yarashitiradi, qog\'ozbozlik va tartib qiroli.', theme: 'uzbek', icon: 'Users', impactScore: { psychology: 4, defense: 2 } },
    { id: 'prof-svarkachi', category: 'profession', title: 'Katta Svarkachi (Payvandchi)', description: 'Har qanday temirni bir-biriga choklab, bunker eshigini dushman ocholmaydigan qilib tashlaydi.', theme: 'uzbek', icon: 'Flame', impactScore: { tech: 4, defense: 4 } },
    { id: 'prof-domla', category: 'profession', title: 'Bosh Domla / Notiq', description: 'Odamlarning ruhiyatini ko\'taruvchi, xotirjamlik va sabrga chaqiruvchi kuchli ta\'sir kuchi.', theme: 'uzbek', icon: 'Sparkles', impactScore: { psychology: 5 } },
    { id: 'prof-paynetchi', category: 'profession', title: 'Malikadagi Telefon Ustasi (Paynetchi)', description: 'Har qanday mikrosxemani kavsharlaydi, bloklangan tizimlarni proshivka qiladi.', theme: 'uzbek', icon: 'Cpu', impactScore: { tech: 4 } },
    // 18+
    { id: 'prof-stripper', category: 'profession', title: 'Professional Striptizchi', description: 'O\'ta egiluvchan tana, chidamlilik va har qanday erkak/ayolni o\'ziga rom qilish mahorati.', theme: 'nsfw18', icon: 'Smile', impactScore: { psychology: 3, defense: 1 } },
    { id: 'prof-mafia-boss', category: 'profession', title: 'Yashirin Qimorxona Egasi', description: 'Odamlarning eng nozik zaifliklarini biladi, manipulyatsiya ustasi.', theme: 'nsfw18', icon: 'Crosshair', impactScore: { psychology: 4, defense: 3 } },
    // ==================== BIOLOGIYA (BIOLOGY) ====================
    { id: 'bio-m-25-fertile', category: 'biology', title: 'Erkak, 25 yosh (A\'lo nasl berish qobiliyati)', description: 'Kuch-quvvatga to\'lgan, jismonan baquvvat.', theme: 'classic' },
    { id: 'bio-f-23-fertile', category: 'biology', title: 'Ayol, 23 yosh (Farzand ko\'rishga mutlaq tayyor)', description: 'Genetik jihatdan sog\'lom va yosh.', theme: 'classic' },
    { id: 'bio-m-42-infertile', category: 'biology', title: 'Erkak, 42 yosh (Bepusht)', description: 'Tajribali, ammo yangi avlod qoldira olmaydi.', theme: 'classic' },
    { id: 'bio-f-38-fertile', category: 'biology', title: 'Ayol, 38 yosh (Egizaklar tug\'ish geniga ega)', description: 'Oila tarixida doim sog\'lom egizaklar tug\'ilgan.', theme: 'classic' },
    { id: 'bio-m-65-elder', category: 'biology', title: 'Erkak, 65 yosh (Nafaqaxo\'r)', description: 'Hayotiy tajribasi juda katta, lekin tez charchaydi.', theme: 'classic' },
    { id: 'bio-f-19-fertile', category: 'biology', title: 'Ayol, 19 yosh (Sportchi qiz)', description: 'Gimnastika bo\'yicha chempion, immuniteti yuqori.', theme: 'classic' },
    { id: 'bio-m-30-athletic', category: 'biology', title: 'Erkak, 30 yosh (Polvon gavdali, bepusht)', description: '100 kg yukni bemalol ko\'taradi.', theme: 'uzbek' },
    { id: 'bio-f-27-twinmom', category: 'biology', title: 'Ayol, 27 yosh (3 ta sog\'lom bola onasi)', description: 'Katta oila boshqargan, sabrli.', theme: 'uzbek' },
    { id: 'bio-m-22-super', category: 'biology', title: 'Erkak, 22 yosh (Kamyob qon guruhi: 1-salbiy)', description: 'Har qanday insonga universal qon donori bo\'la oladi.', theme: 'classic' },
    // ==================== SALOMATLIK (HEALTH) ====================
    { id: 'hlth-perfect', category: 'health', title: 'Mutlaqo Sog\'lom (Olimpiya darajasi)', description: 'Birorta surunkali kasalligi yo\'q, temirdek immunitet.', theme: 'classic', impactScore: { medical: 2 } },
    { id: 'hlth-diabetes', category: 'health', title: '1-Tip Qandli Diabet (Insulinga qaram)', description: 'Har oy muntazam insulin qabul qilishi shart.', theme: 'classic', impactScore: { medical: -3 } },
    { id: 'hlth-blind-one-eye', category: 'health', title: 'Bir ko\'zi ko\'r (50% ko\'rish qobiliyati)', description: 'Mo\'ljalga olishda biroz qiynaladi, lekin yashashga to\'sqinlik qilmaydi.', theme: 'classic' },
    { id: 'hlth-claustrophobia', category: 'health', title: 'Og\'ir Klostrofobiya (Tor joydan qo\'rqish)', description: 'Bunkerda qattiq isterika va vahima xurujiga tushishi mumkin.', theme: 'classic', impactScore: { psychology: -3 } },
    { id: 'hlth-asthma', category: 'health', title: 'Bronxial Astma', description: 'Chang va tutunda ingalyator kerak bo\'ladi.', theme: 'classic', impactScore: { medical: -2 } },
    { id: 'hlth-stone-stomach', category: 'health', title: 'Temir Oshqozon (O\'zbekcha immunitet)', description: 'Muzdek xom go\'sht yoki loyqa suv ichsa ham qorni og\'rimaydi.', theme: 'uzbek', impactScore: { food: 2 } },
    { id: 'hlth-insomnia', category: 'health', title: 'Surunkali Uyqusizlik', description: 'Kechalari uxlamaydi, doim hushyor, lekin asablari tarang.', theme: 'classic', impactScore: { defense: 1, psychology: -1 } },
    { id: 'hlth-amnesia', category: 'health', title: 'Qisman Xotira Yo\'qotish (Amneziya)', description: 'O\'tmishdagi ayrim voqealarni eslay olmaydi.', theme: 'classic' },
    { id: 'hlth-std-secret', category: 'health', title: 'Yashirin Yuqumli Zaxm (18+)', description: 'Faqat jinsiy yo\'l bilan yuqadi, jiddiy davolanish talab qiladi.', theme: 'nsfw18', impactScore: { medical: -3 } },
    // ==================== BADAJ (ITEMS / LUGGAGE) ====================
    // Klassik
    { id: 'bag-shotgun', category: 'baggage', title: 'Ov Miltig\'i va 50 ta patron', description: 'Bunkerni tashqi tajovuzkorlardan himoya qilish uchun qurol.', theme: 'classic', icon: 'ShieldAlert', impactScore: { defense: 5 } },
    { id: 'bag-medkit', category: 'baggage', title: 'Katta Harbiy Aptechka', description: 'Skalpel, antibiotiklar, og\'riqsizlantiruvchi va tikish iplari.', theme: 'classic', icon: 'BriefcaseMedical', impactScore: { medical: 5 } },
    { id: 'bag-seeds', category: 'baggage', title: 'Gidroponik Urug\'lar To\'plami', description: 'Bug\'doy, pomidor, loviya va soya urug\'lari (10 kg).', theme: 'classic', icon: 'Leaf', impactScore: { food: 5 } },
    { id: 'bag-toolbox', category: 'baggage', title: 'Professional Asboblar Qutisi', description: 'Har qanday mexanizm va elektronikani ochish uchun to\'liq to\'plam.', theme: 'classic', icon: 'Wrench', impactScore: { tech: 4 } },
    { id: 'bag-books', category: 'baggage', title: '30 jildli Qomus (Ensiklopediya)', description: 'Barcha insoniyat bilimlari: kimyo, fizika, dehqonchilik va tibbiyot.', theme: 'classic', icon: 'BookMarked', impactScore: { tech: 3, psychology: 3 } },
    { id: 'bag-water-filter', category: 'baggage', title: 'Portativ Nano-Suv Filtri', description: 'Har qanday loyqa yoki radiatsion suvni 99.9% tozalaydi.', theme: 'classic', icon: 'Droplets', impactScore: { medical: 3, food: 3 } },
    // O'zbekona
    { id: 'bag-samovar', category: 'baggage', title: 'O\'t yoqiladigan Jez Samovar', description: 'Elektrsiz ham 10 daqiqada butun jamoaga qaynoq ko\'k choy damlab beradi.', theme: 'uzbek', icon: 'Coffee', impactScore: { psychology: 4, food: 2 } },
    { id: 'bag-damas-tire', category: 'baggage', title: 'Damasning Yangi Zapaskasi va Domkrat', description: 'Rezina, mustahkam temir disk va har qanday og\'ir yukni ko\'tarish quroli.', theme: 'uzbek', icon: 'Disc', impactScore: { tech: 3 } },
    { id: 'bag-kishmish-bag', category: 'baggage', title: 'Bir qop Qora Kishmish va Yong\'oq (50 kg)', description: '10 yil buzilmaydigan, kaloriyaga o\'ta boy super-oziq-ovqat.', theme: 'uzbek', icon: 'Package', impactScore: { food: 5 } },
    { id: 'bag-kazan', category: 'baggage', title: 'Chuyan Qozon (50 litrlik) va Kapgir', description: 'Bunkerdagi har qanday narsani pishirish yoki suv qaynatish uchun abadiy idish.', theme: 'uzbek', icon: 'Soup', impactScore: { food: 4 } },
    { id: 'bag-svarka-generator', category: 'baggage', title: 'Benzinli Mini-Generator va Svarka', description: 'Avtonom tok beradi va temir konstruksiyalarni eritib ulaydi.', theme: 'uzbek', icon: 'Zap', impactScore: { tech: 5, defense: 2 } },
    { id: 'bag-samarkand-bread', category: 'baggage', title: '20 dona Qotirilgan Samarqand Noni', description: 'Suv sepsangiz darhol yangidek bo\'ladi, 3 yil buzilmaydi.', theme: 'uzbek', icon: 'Cookie', impactScore: { food: 4 } },
    // 18+
    { id: 'bag-condom-box', category: 'baggage', title: '500 dona Himoyalovchi Kontratseptivlar (18+)', description: 'Bunker ichida kutilmagan homiladorlik va kasalliklarning oldini oladi.', theme: 'nsfw18', icon: 'Heart', impactScore: { medical: 3 } },
    { id: 'bag-whiskey-box', category: 'baggage', title: '12 shisha 18 yillik Shotland Visvisi', description: 'Kuchli antiseptik, og\'riq qoldiruvchi yoki jamoani mast qilib sirini bilish vositasi.', theme: 'nsfw18', icon: 'Wine', impactScore: { medical: 2, psychology: 3 } },
    // ==================== XOBBI (HOBBIES & SKILLS) ====================
    { id: 'hob-martial-arts', category: 'hobby', title: 'Qo\'l Jangi / Karate (Qora belbog\')', description: 'Qurolsiz ham o\'zini va boshqalarni tajovuzkorlardan himoya qila oladi.', theme: 'classic', impactScore: { defense: 4 } },
    { id: 'hob-guitar', category: 'hobby', title: 'Gitara va Jonli Qo\'shiq Kuylash', description: 'Bunker ahlini tushkunlikdan olib chiqadi, ruhiyatni ko\'taradi.', theme: 'classic', impactScore: { psychology: 5 } },
    { id: 'hob-radio-ham', category: 'hobby', title: 'Radio-Havaskor (Morze alifbosi)', description: 'Eski qismlardan boshqa omon qolganlar bilan aloqa stansiyasi yasay oladi.', theme: 'classic', impactScore: { tech: 4 } },
    { id: 'hob-herbalist', category: 'hobby', title: 'Xalq Tabobati va Giyafrushlik', description: 'Har qanday o\'t-o\'landan dorivor damlama va malham tayyorlaydi.', theme: 'uzbek', impactScore: { medical: 4 } },
    { id: 'hob-chess-master', category: 'hobby', title: 'Shaxmat Bo\'yicha Grossmeyster', description: 'Strategik rejalashtirish va resurslarni 10 qadam oldindan hisoblash ustasi.', theme: 'classic', impactScore: { psychology: 3, tech: 2 } },
    { id: 'hob-hunting', category: 'hobby', title: 'Tuzoq Qo\'yish va Yovvoyi Ov', description: 'Kichik hasharot yoki kalamushlardan ham tuzoq bilan ozuqa topadi.', theme: 'classic', impactScore: { food: 4 } },
    // ==================== FAKTLAR (FACTS) ====================
    { id: 'fac-shelter-builder', category: 'fact', title: 'Boshpana Chizmasi Muallifi', description: 'Bu boshpananing barcha yashirin xonalari va zaxira lyuklarini biladi.', theme: 'classic', impactScore: { tech: 3, defense: 3 } },
    { id: 'fac-prison-escape', category: 'fact', title: 'O\'tmishda Qamoqdan Qochgan', description: 'Har qanday qulfni ochadi, ammo o\'g\'irlik va nayrangga moyilligi bor.', theme: 'classic', impactScore: { defense: 2, psychology: -2 } },
    { id: 'fac-poison-immunity', category: 'fact', title: 'Zaharlarga Chidamli (Immunitet)', description: 'Ilgari ilon va zaharli moddalar bilan ishlagan, tanasi zahar qabul qilmaydi.', theme: 'classic', impactScore: { medical: 3 } },
    { id: 'fac-bunker-code', category: 'fact', title: 'Boshpana Boshqaruv Parolini Biladi', description: 'U bo\'lmasa, markaziy oziq-ovqat ombori qulflanib qolishi mumkin.', theme: 'uzbek', impactScore: { food: 3 } },
    { id: 'fac-millionaire', category: 'fact', title: 'Eski Dunyoda Milliarder Bo\'lgan', description: 'Hozir pullari bir tiyinga qimmat, ammo odamlarni boshqarishni biladi.', theme: 'classic' },
    { id: 'fac-secret-agent', category: 'fact', title: 'Yashirin Maxfiy Agent', description: 'Yolg\'onni 1 soniyada sezadi, kim dushman ekanini darhol aniqlaydi.', theme: 'classic', impactScore: { defense: 4 } },
    // ==================== MAXSUS HARAKAT KARTALARI (SPECIAL ACTION CARDS) ====================
    {
        id: 'spc-cancel-vote',
        category: 'special',
        title: 'Veto Huquqi (Ovozni Bekor Qilish)',
        description: 'Ushbu raundda o\'zingizga berilgan barcha ovozlarni bekor qilasiz.',
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
        description: 'Boshpanada yashirin zaxira xona ochiladi: tirik qoluvchilar soni 1 taga oshadi!',
        theme: 'classic',
        icon: 'PlusCircle',
        specialAction: { type: 'add_shelter_slot' }
    },
    {
        id: 'spc-steal-baggage',
        category: 'special',
        title: 'Bagajni Tortib Olish (Musodara)',
        description: 'Ixtiyoriy o\'yinchining bagaj kartasini tortib olib, o\'zingizga olasiz.',
        theme: 'classic',
        icon: 'ShoppingBag',
        specialAction: { type: 'steal_baggage' }
    },
    {
        id: 'spc-force-reveal',
        category: 'special',
        title: 'Rostgo\'ylik Sarumi (Majburiy Ochish)',
        description: 'Tanlangan o\'yinchining ixtiyoriy 1 ta yashirin kartasini hammaga ochib tashlaysiz.',
        theme: 'classic',
        icon: 'Eye',
        specialAction: { type: 'force_reveal' }
    },
    {
        id: 'spc-double-vote',
        category: 'special',
        title: 'Ikki Hissa Ovoz (Qo\'sh Ovoz)',
        description: 'Joriy raund ovoz berishda sizning ovozingiz 2 ta deb hisoblanadi.',
        theme: 'uzbek',
        icon: 'Vote',
        specialAction: { type: 'extra_vote' }
    }
];
