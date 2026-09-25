// Dürre Wand & Plattenstein Túra Adatbázis - 2026. szeptember 26.
const TOUR_DATA = {
  tourInfo: {
    id: "durre_wand_plattenstein",
    title: "Dürre Wand, túra a Plattenstein panorámahegyére",
    subTitle: "A népszerű Hohe Wand mostohatestvérének leglátványosabb csúcsán",
    date: "2026. szeptember 26. (Szombat)",
    dateIso: "2026-09-26",
    region: "Alsó-Ausztria (Bécsi-Alpok / Gutensteini-Alpok)",
    distanceKm: 9.1,
    elevationGainM: 656,
    elevationLossM: 656,
    minElevationM: 533,
    maxElevationM: 1154,
    durationHours: "3.5 - 4.5 óra",
    difficulty: "Közepes gyalogtúra",
    difficultyBadge: "Közepes (T2)",
    difficultyColor: "#10b981",
    trailType: "Körtúra (Loop trail)",
    trailMarking: "Wiener Alpenbogen (WAB), 01. sz. Nordalpenweg, 231-es és piros-fehér-piros",
    startLocation: "Miesenbach, Frohnberg turistaparkoló (Gasthof Michlwirt felett)",
    startCoordinates: [47.857731, 15.975154],
    summitCoordinates: [47.840816, 15.939293],
    gpxFile: "plattenstein.gpx",
    coverImage: "images/durre-wand-plattenstein.jpg",
    description: "A Bécsi-Alpok népszerű Hohe Wand vonulatától nyugatra húzódik a kevésbé ismert Dürre Wand 1200 méter fölé is emelkedő mészkőhegylánca. Leglátványosabb, sziklás letörésekben és széles panorámákban gazdag csúcsa, a Plattenstein (1154 m) tetején áll az 1908-ban emelt idilli Gauermannhütte. A túra Miesenbach mellől, Frohnbergből indul, a Wurzelsteig meredek, sziklás kaptatóján éri el a főgerincet pazar Schneeberg-kilátással, majd az Ochsenweg és a Schwaighofer-tanya virágos mezein tér vissza."
  },

  heroSlides: [
    {
      image: "images/durre-wand-plattenstein.jpg",
      title: "Plattenstein (1 154 m)",
      caption: "Sziklás plató csúcskereszttel & Schneeberg panorámával",
      tag: "Hegycsúcs"
    },
    {
      image: "images/p1431-20.jpg",
      title: "Gauermannhütte (1 144 m)",
      caption: "Autentikus alpesi menedékház és napfényes terasz (1908)",
      tag: "Menedékház"
    },
    {
      image: "images/p1431-7.jpg",
      title: "Wurzelsteig Gerinc",
      caption: "Vadregényes mészkősziklák és fenyves gerincösvény",
      tag: "Gerinctúra"
    },
    {
      image: "images/p1431-10.jpg",
      title: "Hohe Wand Kilátás",
      caption: "Lélegzetelállító panoráma a szomszédos sziklafalakra",
      tag: "Kilátópont"
    },
    {
      image: "images/p1431-28.jpg",
      title: "Schwaighofer-tanya",
      caption: "Idilli hegyi legelők és vadvirágos rétek a völgyben",
      tag: "Alpesi táj"
    }
  ],

  waypoints: [
    {
      id: "frohnberg_start",
      name: "Frohnberg Parkoló (Start)",
      elevation: 577,
      distKm: 0.0,
      lat: 47.857731,
      lon: 15.975154,
      icon: "fa-car",
      badge: "Start / Cél (577 m)",
      type: "start",
      image: "images/p1431-31.jpg",
      desc: "Kényelmes, ingyenes turistaparkoló az aszfaltút végén, a Gasthof Michlwirt felett. Innen vágunk neki a körtúrának."
    },
    {
      id: "hundsgrube",
      name: "Hundsgrube kereszt",
      elevation: 660,
      distKm: 1.04,
      lat: 47.856978,
      lon: 15.966917,
      icon: "fa-cross",
      badge: "Kereszteződés (660 m)",
      type: "waypoint",
      image: "images/p1431-1.jpg",
      desc: "Mezőn és fenyvesen átvágva elérjük a keresztet, ahol becsatlakozunk a Wiener Alpenbogen (WAB) és a 01. Nordalpenweg túraútvonalba."
    },
    {
      id: "martersberg_flank",
      name: "Martersberg erdei szekérút",
      elevation: 759,
      distKm: 1.98,
      lat: 47.849980,
      lon: 15.964393,
      icon: "fa-tree",
      badge: "Erdei szakasz (759 m)",
      type: "waypoint",
      image: "images/p1431-4.jpg",
      desc: "Árnyas, enyhén emelkedő szekérút vadkerítés kíséretében, időnként szép kitekintéssel a Hohe Wand sziklafalaira."
    },
    {
      id: "martersberg_col",
      name: "Martersberg Nyereg",
      elevation: 842,
      distKm: 2.76,
      lat: 47.847158,
      lon: 15.955993,
      icon: "fa-signs-post",
      badge: "Nyereg (842 m)",
      type: "waypoint",
      image: "images/p1431-27.jpg",
      desc: "Fontos táblás csomópont. Itt kezdjük meg a közvetlen kaptatót a Dürre Wand gerincére a Wurzelsteig ösvényen."
    },
    {
      id: "wurzelsteig",
      name: "Wurzelsteig & Sziklatömbök",
      elevation: 994,
      distKm: 3.41,
      lat: 47.843052,
      lon: 15.950405,
      icon: "fa-mountain",
      badge: "Gerinckaptató (994 m)",
      type: "climb",
      image: "images/p1431-7.jpg",
      desc: "Nevéhez méltó meredek gyökér-ösvény gigantikus mészkőbástyák mellett a Plattenstein keleti gerincén."
    },
    {
      id: "gutenstein_view",
      name: "Gutensteini Panorámapont",
      elevation: 1059,
      distKm: 3.79,
      lat: 47.841841,
      lon: 15.945887,
      icon: "fa-binoculars",
      badge: "Kilátópont (1059 m)",
      type: "viewpoint",
      image: "images/p1431-8.jpg",
      desc: "Pihenőpad a szikla peremén, pazar kilátás az Unterberg sípályáira és a Gutensteini-Alpok hegyvonulatára."
    },
    {
      id: "tablerhohle",
      name: "Tablerhöhle barlangleágazás",
      elevation: 1111,
      distKm: 4.01,
      lat: 47.841660,
      lon: 15.943183,
      icon: "fa-dungeon",
      badge: "Barlang (1111 m)",
      type: "poi",
      image: "images/p1431-12.jpg",
      desc: "Rövid kitérő a függőleges sziklafal tövében tátongó karsztos barlangnyíláshoz. Fejlámpával érdemes bekukkantani!"
    },
    {
      id: "gschaiderrast",
      name: "Gschaiderrast kilátóhely",
      elevation: 1129,
      distKm: 4.15,
      lat: 47.841159,
      lon: 15.941440,
      icon: "fa-mountain-sun",
      badge: "Kilátópont (1129 m)",
      type: "viewpoint",
      image: "images/p1431-15.jpg",
      desc: "Látványos sziklaperem nyugati tájolással: tiszta időben egészen az Ötscher és a Dürrenstein távoli csúcsáig ellátni."
    },
    {
      id: "plattenstein_summit",
      name: "Plattenstein Csúcs & Kereszt",
      elevation: 1148,
      distKm: 4.315,
      lat: 47.840816,
      lon: 15.939293,
      icon: "fa-trophy",
      badge: "Legmagasabb pont (1 154 m)",
      type: "summit",
      image: "images/p1431-19.jpg",
      desc: "A túra legmagasabb pontja! Lélegzetelállító közelségben emelkedik a hatalmas, 2076 méteres Schneeberg és a Schneealpe vonulata."
    },
    {
      id: "gauermannhutte",
      name: "Gauermannhütte (ÖTK)",
      elevation: 1144,
      distKm: 4.34,
      lat: 47.840659,
      lon: 15.939105,
      icon: "fa-utensils",
      badge: "Hütte (1 144 m)",
      type: "hut",
      image: "images/p1431-21.jpg",
      desc: "1908-ban emelt rusztikus menedékház szombati nyitvatartással! Házias levesek, császármorzsa, osztrák sörök és napfényes terasz."
    },
    {
      id: "ochsenweg",
      name: "Ochsenweg lejtő (231-es út)",
      elevation: 1037,
      distKm: 4.97,
      lat: 47.837500,
      lon: 15.938413,
      icon: "fa-shoe-prints",
      badge: "Ereszkedés (1037 m)",
      type: "waypoint",
      image: "images/p1431-25.jpg",
      desc: "Lankásabb, kényelmes erdei út és kanyarlevágó ösvény a Plattenstein erdős déli lejtőin lefelé."
    },
    {
      id: "schwaighofer",
      name: "Schwaighofer-tanya",
      elevation: 804,
      distKm: 6.55,
      lat: 47.841780,
      lon: 15.956720,
      icon: "fa-house-chimney",
      badge: "Alpesi tanya (804 m)",
      type: "poi",
      image: "images/p1431-28.jpg",
      desc: "Festői fekvésű, idilli alpesi gazdaság zöldellő hegyi legelőkkel, legelésző állatokkal és tágas kilátással a nyeregben."
    },
    {
      id: "ungerberg",
      name: "Ungerberg & erdei mélyút",
      elevation: 690,
      distKm: 7.82,
      lat: 47.849419,
      lon: 15.966934,
      icon: "fa-leaf",
      badge: "Völgyi szakasz (690 m)",
      type: "waypoint",
      image: "images/p1431-29.jpg",
      desc: "Vadvirágos mezei szakasz, majd romantikus erdei mélyút vezet vissza a völgytalpra és Frohnberg házai közé."
    },
    {
      id: "michlwirt",
      name: "Gasthof Michlwirt & Cél",
      elevation: 577,
      distKm: 9.07,
      lat: 47.857750,
      lon: 15.975154,
      icon: "fa-flag-checkered",
      badge: "Cél (577 m)",
      type: "end",
      image: "images/durre-wand-plattenstein.jpg",
      desc: "Sikeres körtúra! Visszaérkezés a kiindulási ponthoz, levezető frissítő a vendéglő teraszán."
    }
  ],

  timelineSchedule: [
    {
      time: "06:30",
      title: "Indulás Budapestről",
      subtitle: "M1 autópálya - Hegyeshalom / Sopron - Wiener Neustadt - Miesenbach",
      icon: "fa-car",
      badge: "Utazás (kb. 2.5 - 3 óra)",
      desc: "Kényelmes kora reggeli indulás autóval. Útközben egy rövid kávé- és matricaszünet az osztrák határnál."
    },
    {
      time: "09:30",
      title: "Érkezés Miesenbach / Frohnberg parkolóba (575 m)",
      subtitle: "Bakancshúzás, hátizsák-ellenőrzés, eligazítás",
      icon: "fa-location-dot",
      badge: "Bázis (575 m)",
      wpId: "frohnberg_start",
      desc: "Parkolás a kijelölt ingyenes turistaparkolóban. Naptej, túrabotok beállítása, ivóvíz ellenőrzése."
    },
    {
      time: "09:45",
      title: "Túra rajt: Mezőkön át a Hundsgrube felé",
      subtitle: "Csatlakozás a Wiener Alpenbogen (WAB) és a 01. Nordalpenweg ösvényre",
      icon: "fa-person-walking",
      badge: "1.0 km • +83 m",
      wpId: "hundsgrube",
      desc: "Könnyed bemelegítő séta a virágos réteken és fenyvesen át a Hundsgrube keresztig."
    },
    {
      time: "10:45",
      title: "Martersberg gerinc & Nyereg (842 m)",
      subtitle: "Kellemes erdei kaptató a vadvédelmi kerítés mellett",
      icon: "fa-mountain-sun",
      badge: "2.8 km • +265 m",
      wpId: "martersberg_col",
      desc: "Felérünk a nyeregbe, ahol megpillantjuk a Plattenstein látványos, meredek mészkőszirtjeit. Rövid ivószünet."
    },
    {
      time: "11:15",
      title: "Wurzelsteig gerincösvény, Barlang & Kilátók",
      subtitle: "Gyökérlépcsős meredek kaptató, sziklaletörések, Tablerhöhle, Gschaiderrast",
      icon: "fa-person-hiking",
      badge: "3.4–4.1 km • Kaptató",
      wpId: "wurzelsteig",
      desc: "A túra legkarakteresebb szakasza! Hatalmas sziklatömbök, panoráma az Unterbergre, tiszta időben az Ötscherre."
    },
    {
      time: "12:15",
      title: "Plattenstein Csúcs (1154 m) & Csúcskereszt",
      subtitle: "Páratlan panoráma a közvetlen közelben magasodó fenséges Schneebergre",
      icon: "fa-trophy",
      badge: "4.3 km • 1 154 m (Csúcs)",
      wpId: "plattenstein_summit",
      desc: "Megérkezés a túra legmagasabb pontjára! Közös csúcsfotók a keresztnél a Schneeberg díszletével."
    },
    {
      time: "12:30 – 13:45",
      title: "Ebéd & Pihenő a Gauermannhüttében",
      subtitle: "1908-ban alapított autentikus hegyi menedékház (szombaton nyitva)",
      icon: "fa-mug-hot",
      badge: "4.3 km • Hüttézés",
      wpId: "gauermannhutte",
      desc: "Meleg alpesi levesek (Gulaschsuppe, Kaspressknödelsuppe), kolbászok, császármorzsa, osztrák sörök és kávé a napfényes teraszon."
    },
    {
      time: "13:45",
      title: "Ereszkedés az Ochsenweg & Schwaighofer-tanya felé",
      subtitle: "Lankásabb 231-es szekérút, idilli legelők és vadvirágos rétek",
      icon: "fa-arrow-down",
      badge: "6.5 km • Ereszkedés",
      wpId: "schwaighofer",
      desc: "Kényelmes lejtmenet a Plattenstein déli oldalán a Schwaighofer-tanya (804 m) és Ungerberg felé."
    },
    {
      time: "15:15",
      title: "Visszaérkezés Frohnbergbe (577 m)",
      subtitle: "Túra zárása, levezető ital a Gasthof Michlwirtnél",
      icon: "fa-circle-check",
      badge: "9.1 km Teljesítve!",
      wpId: "michlwirt",
      desc: "Átöltözés, bakancscsere, sikeres csúcstúra ünneplése hideg itallal a Michlwirt teraszán."
    },
    {
      time: "16:30",
      title: "Hazaindulás",
      subtitle: "Opcionális kitérő a szomszédos Hohe Wand Skywalk kilátóteraszára, vagy közvetlen hazautazás",
      icon: "fa-car-side",
      badge: "Visszaút",
      desc: "Nyugodt visszautazás Magyarországra."
    },
    {
      time: "19:30",
      title: "Hazaérkezés Budapestre",
      subtitle: "Egy tartalmas, alpesi csúcsélményekkel teli nap emlékeivel",
      icon: "fa-house",
      badge: "Érkezés",
      desc: "Kipihenés, képek válogatása és megosztása."
    }
  ],

  gallery: [
    {
      file: "images/durre-wand-plattenstein.jpg",
      title: "Plattenstein (1154 m)",
      caption: "A Dürre Wand legszebb panorámacsúcsa a csúcskereszttel és a háttérben terpeszkedő Schneeberggel."
    },
    {
      file: "images/p1431-20.jpg",
      title: "Gauermannhütte",
      caption: "A csúcson 1908-ban megnyitott békebeli menedékház festői környezetben."
    },
    {
      file: "images/p1431-21.jpg",
      title: "Pihenőterasz a Gauermannhütténél",
      caption: "Napsütéses terasz, ahol a túrázók megpihenhetnek a csúcspanorámát élvezve."
    },
    {
      file: "images/p1431-1.jpg",
      title: "A Hundsgrube keresztje",
      caption: "Erdei útkereszteződés, ahol csatlakozunk a Wiener Alpenbogen és a 01. Nordalpenweg útvonalhoz."
    },
    {
      file: "images/p1431-4.jpg",
      title: "Kényelmes szekérúton Frohnberg felett",
      caption: "Lankásan emelkedő árnyas erdei út a Martersberg keleti oldalában."
    },
    {
      file: "images/p1431-6.jpg",
      title: "Pillantás a szomszédos Hohe Wand felé",
      caption: "A fák közül időnként felbukkannak a Hohe Wand impozáns mészkőfalai."
    },
    {
      file: "images/p1431-7.jpg",
      title: "Dürre Wand, hatalmas sziklák mellett",
      caption: "A Wurzelsteig meredek ösvénye hatalmas, mohával fedett sziklatömbök között kanyarog."
    },
    {
      file: "images/p1431-8.jpg",
      title: "Kilátás a Gutensteini-Alpokra",
      caption: "Pihenőpad a gerinc élén: jól kivehető a túloldali Unterberg tömbje és a sípályák."
    },
    {
      file: "images/p1431-9.jpg",
      title: "Ösvényünk a Dürre Wand gerincén",
      caption: "Keskeny, köves túraösvény a fenyőfákkal szegélyezett gerincvonalon."
    },
    {
      file: "images/p1431-10.jpg",
      title: "Panoráma a Hohe Wand felé",
      caption: "Nyílt gerincszakasz pazar kilátással a környező völgyekre és dombokra."
    },
    {
      file: "images/p1431-11.jpg",
      title: "Panoráma ösvényünkről",
      caption: "Egyre tágasabb látóhatár, ahogy közeledünk az 1100 méteres magassághoz."
    },
    {
      file: "images/p1431-12.jpg",
      title: "A Dürre Wand sziklás nyugati oldala",
      caption: "Függőleges mészkőletörések a Tablerhöhle barlang közelében."
    },
    {
      file: "images/p1431-14.jpg",
      title: "Kilátás Pernitz és a völgy felé",
      caption: "Mélyen alattunk húzódnak a Piesting-völgy települései."
    },
    {
      file: "images/p1431-15.jpg",
      title: "Dürre Wand, a Plattenstein szikláin",
      caption: "A sziklafal peremén vezető ösvény igazi magashegyi élményt nyújt."
    },
    {
      file: "images/p1431-16.jpg",
      title: "Kilátás a Gschaiderrast pontról",
      caption: "Nyugatra tiszta időben egészen a fenséges Ötscher jellegzetes csúcsáig ellátni."
    },
    {
      file: "images/p1431-17.jpg",
      title: "A Plattenstein és a háttérben a Schneeberg",
      caption: "A túra legikonikusabb látképe: a Plattenstein sziklái mögött a 2076 méteres Schneeberg magasodik."
    },
    {
      file: "images/p1431-19.jpg",
      title: "A Plattenstein csúcsán",
      caption: "A sziklás platón álló csúcskereszt, a túra csúcspontja (1154 m)."
    },
    {
      file: "images/p1431-24.jpg",
      title: "Plattenstein sziklafalak",
      caption: "Dél felé meredeken letörő fehér mészkőfalak a menedékház alatt."
    },
    {
      file: "images/p1431-25.jpg",
      title: "Ereszkedés az Ochsenweg úton",
      caption: "Kényelmes, murvás szekérút a hegy déli oldalában a 231-es turistaúton."
    },
    {
      file: "images/p1431-27.jpg",
      title: "Alpesi útjelzőtáblák",
      caption: "Sárga osztrák turistajelzések a nyeregben (Gauermannhütte über'n Wurzelsteig)."
    },
    {
      file: "images/p1431-28.jpg",
      title: "A Schwaighofer-tanya látképe",
      caption: "Idilli fekvésű alpesi tanya zöld hegyi legelőkkel a nyeregben (805 m)."
    },
    {
      file: "images/p1431-29.jpg",
      title: "Táj a Dürre Wand és a Hohe Wand között",
      caption: "Bukolikus, békés völgyi táj szénabálákkal és tanyákkal."
    },
    {
      file: "images/p1431-31.jpg",
      title: "Frohnberg",
      caption: "Csendes falusi hangulat Miesenbach Frohnberg településrészén, a túra kiindulópontján."
    },
    {
      file: "images/p1431-32.jpg",
      title: "A Balberstein látképe",
      caption: "Jellegzetes magányos sziklatorony a völgy bejáratánál."
    }
  ],

  packingList: [
    {
      category: "🥾 Felszerelés & Ruházat",
      items: [
        { id: "boots", text: "Magasszárú, bejáratott túrabakancs jó talpprofillal (Vibram ajánlott a sziklás-gyökeres Wurzelsteigre)", required: true },
        { id: "poles", text: "Teleszkópos túrabot (nagy segítség a 656 m emelkedésnél és az ereszkedésnél)", required: true },
        { id: "backpack", text: "20-30 literes kényelmes túrahátizsák esővédő huzattal", required: true },
        { id: "layers", text: "Réteges öltözködés: lélegző technikai póló + meleg polár pulóver", required: true },
        { id: "jacket", text: "Szél- és esőálló kabát (hardshell vagy softshell)", required: true },
        { id: "pants", text: "Kényelmes, rugalmas túranadrág (lecipzározható vagy vízlepergető)", required: true },
        { id: "socks", text: "1 pár tartalék technikai túrazokni a hátizsákba", required: false },
        { id: "cap", text: "Napellenzős sapka / csősál (buff) szél esetére", required: false }
      ]
    },
    {
      category: "🔦 Biztonság & Kiegészítők",
      items: [
        { id: "headlamp", text: "Fejlámpa / zseblámpa (a Tablerhöhle barlang felderítéséhez kötelező!)", required: true },
        { id: "powerbank", text: "Feltöltött powerbank és telefon töltőkábel (fotózás és GPS navigáció miatt)", required: true },
        { id: "gpx_app", text: "Telefonra letöltött offline térkép & GPX nyomvonal (Mapy.cz / OsmAnd / Komoot)", required: true },
        { id: "firstaid", text: "Kisméretű elsősegélycsomag: ragtapasz, vízhólyagtapasz, fásli, fertőtlenítő kendő, fájdalomcsillapító", required: true },
        { id: "sunscreen", text: "Naptej (UV30+) és napszemüveg a nyílt gerincre és csúcsra", required: false },
        { id: "tissues", text: "Papírzsebkendő, nedves törlőkendő és egy kis szemetes zacskó (Leave No Trace)", required: false }
      ]
    },
    {
      category: "🥪 Élelem & Folyadék",
      items: [
        { id: "water", text: "1.5 – 2.0 liter ivóvíz vagy izotóniás sportital fejenként (a hegyen útközben nincs forrás)", required: true },
        { id: "energy", text: "Energiaszelet, müzliszelet, szőlőcukor, magvak / aszalt gyümölcs a kaptatókra", required: true },
        { id: "snack", text: "Csúcscsoki / szendvics az útközbeni pihenőkhöz (bár a Gauermannhütte nyitva lesz!)", required: false }
      ]
    },
    {
      category: "📑 Okmányok & Pénz",
      items: [
        { id: "cash", text: "Készpénz Euro (€) a Gauermannhüttébe! (A hegytetőn NINCS bankkártyás fizetés!)", required: true },
        { id: "id_card", text: "Érvényes személyi igazolvány vagy útlevél (határátlépéshez)", required: true },
        { id: "ehic", text: "Európai Egészségbiztosítási Kártya (kék kártya) vagy utasbiztosítás", required: true },
        { id: "vignette", text: "Osztrák autópálya-matrica (1 napos digitális matrica kb. 8.60 € az asfinag.at oldalon, vagy 10 napos)", required: true },
        { id: "driver_docs", text: "Jogosítvány, forgalmi engedély, nemzetközi zöldkártya az autóhoz", required: true }
      ]
    }
  ],

  practicalInfo: {
    travel: {
      fromBudapest: "kb. 260 km, 2 óra 45 perc",
      route: "Budapest (M1) ➔ Hegyeshalom ➔ A4 Bécs felé ➔ A3 / S4 Wiener Neustadt ➔ B26 Puchberg felé ➔ L138 Miesenbach ➔ Frohnberg",
      highwayVignette: "Ausztriában kötelező az autópálya matrica. Kapható 1 napos digitális matrica (kb. 8.60 €) vagy 10 napos matrica (kb. 11.50 €) az Asfinag hivatalos oldalán vagy az utolsó magyarországi benzinkutakon.",
      parking: "Frohnberg, Miesenbach: ingyenes turista parkoló a Gasthof Michlwirt fogadó felett az utca végén (575 m). Koordináták: 47.85773, 15.97515."
    },
    hutInfo: {
      name: "Gauermannhütte (1154 m)",
      club: "Österreichischer Touristenklub (ÖTK) Sektion Wiener Neustadt",
      opened: "1908",
      openingHours: "Május 1-től október végéig: szombaton, vasárnap és osztrák ünnepnapokon nyitva (2026. szeptember 26. SZOMBAT, így nyitva lesz!).",
      food: "Házias meleg levesek (Gulaschsuppe, Nudelsuppe, Kaspressknödel), virsli, melegszendvics, házi sütemények, kávé, teák, osztrák csapolt sörök.",
      payment: "KIZÁRÓLAG KÉSZPÉNZ (Euro €)!",
      phone: "+43 2632 72545 / +43 676 7401140"
    },
    emergency: {
      austriaMountainRescue: "140",
      austriaMountainRescueDesc: "Osztrák Alpesi Mentők (Bergrettung Österreich)",
      europeGeneral: "112",
      europeGeneralDesc: "Általános európai segélyhívó"
    },
    crossLinks: {
      dolomitokUrl: "/",
      dolomitokTitle: "🏔️ 4 Napos Dolomitok Expedíció (Cortina d'Ampezzo)"
    }
  }
};


TOUR_DATA.elevationData = {
    "totalDistKm":  9.07,
    "minEle":  533,
    "maxEle":  1148,
    "elevationGain":  656,
    "elevationLoss":  656,
    "pointsCount":  322,
    "track":  [
                  {
                      "dist":  0,
                      "ele":  577,
                      "lat":  47.857731,
                      "lon":  15.975154
                  },
                  {
                      "dist":  0.004,
                      "ele":  577,
                      "lat":  47.857768,
                      "lon":  15.975154
                  },
                  {
                      "dist":  0.017,
                      "ele":  576,
                      "lat":  47.857888,
                      "lon":  15.975144
                  },
                  {
                      "dist":  0.027,
                      "ele":  574,
                      "lat":  47.857955,
                      "lon":  15.975064
                  },
                  {
                      "dist":  0.053,
                      "ele":  572,
                      "lat":  47.858075,
                      "lon":  15.974768
                  },
                  {
                      "dist":  0.069,
                      "ele":  572,
                      "lat":  47.858124,
                      "lon":  15.97457
                  },
                  {
                      "dist":  0.102,
                      "ele":  570,
                      "lat":  47.85822,
                      "lon":  15.974139
                  },
                  {
                      "dist":  0.115,
                      "ele":  570,
                      "lat":  47.858286,
                      "lon":  15.974004
                  },
                  {
                      "dist":  0.127,
                      "ele":  570,
                      "lat":  47.858383,
                      "lon":  15.973932
                  },
                  {
                      "dist":  0.146,
                      "ele":  571,
                      "lat":  47.858552,
                      "lon":  15.973986
                  },
                  {
                      "dist":  0.208,
                      "ele":  574,
                      "lat":  47.859082,
                      "lon":  15.974255
                  },
                  {
                      "dist":  0.232,
                      "ele":  576,
                      "lat":  47.859256,
                      "lon":  15.974444
                  },
                  {
                      "dist":  0.261,
                      "ele":  575,
                      "lat":  47.859395,
                      "lon":  15.974768
                  },
                  {
                      "dist":  0.294,
                      "ele":  578,
                      "lat":  47.859643,
                      "lon":  15.97502
                  },
                  {
                      "dist":  0.327,
                      "ele":  579,
                      "lat":  47.859925,
                      "lon":  15.975136
                  },
                  {
                      "dist":  0.367,
                      "ele":  583,
                      "lat":  47.859835,
                      "lon":  15.974615
                  },
                  {
                      "dist":  0.39,
                      "ele":  586,
                      "lat":  47.859799,
                      "lon":  15.974309
                  },
                  {
                      "dist":  0.391,
                      "ele":  586,
                      "lat":  47.859793,
                      "lon":  15.974301
                  },
                  {
                      "dist":  0.435,
                      "ele":  590,
                      "lat":  47.859534,
                      "lon":  15.973861
                  },
                  {
                      "dist":  0.457,
                      "ele":  592,
                      "lat":  47.859395,
                      "lon":  15.973654
                  },
                  {
                      "dist":  0.504,
                      "ele":  598,
                      "lat":  47.8591,
                      "lon":  15.973196
                  },
                  {
                      "dist":  0.534,
                      "ele":  603,
                      "lat":  47.858955,
                      "lon":  15.972863
                  },
                  {
                      "dist":  0.589,
                      "ele":  611,
                      "lat":  47.85875,
                      "lon":  15.97219
                  },
                  {
                      "dist":  0.702,
                      "ele":  622,
                      "lat":  47.858292,
                      "lon":  15.970842
                  },
                  {
                      "dist":  0.756,
                      "ele":  627,
                      "lat":  47.858081,
                      "lon":  15.970186
                  },
                  {
                      "dist":  0.824,
                      "ele":  634,
                      "lat":  47.857816,
                      "lon":  15.96936
                  },
                  {
                      "dist":  0.854,
                      "ele":  638,
                      "lat":  47.857719,
                      "lon":  15.968982
                  },
                  {
                      "dist":  0.875,
                      "ele":  640,
                      "lat":  47.857611,
                      "lon":  15.968749
                  },
                  {
                      "dist":  0.894,
                      "ele":  642,
                      "lat":  47.857587,
                      "lon":  15.968506
                  },
                  {
                      "dist":  0.91,
                      "ele":  644,
                      "lat":  47.857587,
                      "lon":  15.968291
                  },
                  {
                      "dist":  0.931,
                      "ele":  647,
                      "lat":  47.857563,
                      "lon":  15.968003
                  },
                  {
                      "dist":  0.964,
                      "ele":  651,
                      "lat":  47.857509,
                      "lon":  15.967581
                  },
                  {
                      "dist":  0.978,
                      "ele":  653,
                      "lat":  47.857448,
                      "lon":  15.96741
                  },
                  {
                      "dist":  1.001,
                      "ele":  656,
                      "lat":  47.857304,
                      "lon":  15.967194
                  },
                  {
                      "dist":  1.021,
                      "ele":  658,
                      "lat":  47.857165,
                      "lon":  15.967024
                  },
                  {
                      "dist":  1.043,
                      "ele":  660,
                      "lat":  47.856978,
                      "lon":  15.966917
                  },
                  {
                      "dist":  1.067,
                      "ele":  661,
                      "lat":  47.856761,
                      "lon":  15.966917
                  },
                  {
                      "dist":  1.077,
                      "ele":  662,
                      "lat":  47.856677,
                      "lon":  15.966863
                  },
                  {
                      "dist":  1.098,
                      "ele":  664,
                      "lat":  47.856496,
                      "lon":  15.966817
                  },
                  {
                      "dist":  1.111,
                      "ele":  666,
                      "lat":  47.856376,
                      "lon":  15.966808
                  },
                  {
                      "dist":  1.124,
                      "ele":  668,
                      "lat":  47.856261,
                      "lon":  15.966791
                  },
                  {
                      "dist":  1.145,
                      "ele":  669,
                      "lat":  47.856092,
                      "lon":  15.966674
                  },
                  {
                      "dist":  1.163,
                      "ele":  673,
                      "lat":  47.855966,
                      "lon":  15.966521
                  },
                  {
                      "dist":  1.185,
                      "ele":  676,
                      "lat":  47.855767,
                      "lon":  15.966458
                  },
                  {
                      "dist":  1.188,
                      "ele":  676,
                      "lat":  47.855743,
                      "lon":  15.966458
                  },
                  {
                      "dist":  1.188,
                      "ele":  676,
                      "lat":  47.855743,
                      "lon":  15.966458
                  },
                  {
                      "dist":  1.2,
                      "ele":  678,
                      "lat":  47.855634,
                      "lon":  15.966458
                  },
                  {
                      "dist":  1.234,
                      "ele":  682,
                      "lat":  47.855369,
                      "lon":  15.966674
                  },
                  {
                      "dist":  1.278,
                      "ele":  686,
                      "lat":  47.854977,
                      "lon":  15.966746
                  },
                  {
                      "dist":  1.343,
                      "ele":  691,
                      "lat":  47.854404,
                      "lon":  15.96697
                  },
                  {
                      "dist":  1.377,
                      "ele":  689,
                      "lat":  47.854127,
                      "lon":  15.967159
                  },
                  {
                      "dist":  1.434,
                      "ele":  693,
                      "lat":  47.853633,
                      "lon":  15.96732
                  },
                  {
                      "dist":  1.501,
                      "ele":  694,
                      "lat":  47.85306,
                      "lon":  15.967626
                  },
                  {
                      "dist":  1.522,
                      "ele":  695,
                      "lat":  47.852879,
                      "lon":  15.967716
                  },
                  {
                      "dist":  1.537,
                      "ele":  698,
                      "lat":  47.852747,
                      "lon":  15.967743
                  },
                  {
                      "dist":  1.557,
                      "ele":  701,
                      "lat":  47.852566,
                      "lon":  15.967725
                  },
                  {
                      "dist":  1.582,
                      "ele":  704,
                      "lat":  47.852355,
                      "lon":  15.967806
                  },
                  {
                      "dist":  1.606,
                      "ele":  704,
                      "lat":  47.852144,
                      "lon":  15.967877
                  },
                  {
                      "dist":  1.622,
                      "ele":  701,
                      "lat":  47.852023,
                      "lon":  15.96776
                  },
                  {
                      "dist":  1.635,
                      "ele":  699,
                      "lat":  47.851933,
                      "lon":  15.967644
                  },
                  {
                      "dist":  1.677,
                      "ele":  697,
                      "lat":  47.851613,
                      "lon":  15.967357
                  },
                  {
                      "dist":  1.711,
                      "ele":  699,
                      "lat":  47.851306,
                      "lon":  15.96742
                  },
                  {
                      "dist":  1.754,
                      "ele":  711,
                      "lat":  47.851149,
                      "lon":  15.96689
                  },
                  {
                      "dist":  1.823,
                      "ele":  732,
                      "lat":  47.850788,
                      "lon":  15.966135
                  },
                  {
                      "dist":  1.874,
                      "ele":  743,
                      "lat":  47.85051,
                      "lon":  15.965596
                  },
                  {
                      "dist":  1.928,
                      "ele":  750,
                      "lat":  47.850196,
                      "lon":  15.965049
                  },
                  {
                      "dist":  1.982,
                      "ele":  759,
                      "lat":  47.84998,
                      "lon":  15.964393
                  },
                  {
                      "dist":  2.034,
                      "ele":  762,
                      "lat":  47.849672,
                      "lon":  15.96388
                  },
                  {
                      "dist":  2.068,
                      "ele":  764,
                      "lat":  47.84951,
                      "lon":  15.963494
                  },
                  {
                      "dist":  2.081,
                      "ele":  764,
                      "lat":  47.849431,
                      "lon":  15.963359
                  },
                  {
                      "dist":  2.081,
                      "ele":  764,
                      "lat":  47.849431,
                      "lon":  15.963359
                  },
                  {
                      "dist":  2.131,
                      "ele":  763,
                      "lat":  47.84913,
                      "lon":  15.962865
                  },
                  {
                      "dist":  2.148,
                      "ele":  763,
                      "lat":  47.849033,
                      "lon":  15.962695
                  },
                  {
                      "dist":  2.169,
                      "ele":  768,
                      "lat":  47.849033,
                      "lon":  15.962407
                  },
                  {
                      "dist":  2.192,
                      "ele":  774,
                      "lat":  47.848937,
                      "lon":  15.962129
                  },
                  {
                      "dist":  2.217,
                      "ele":  780,
                      "lat":  47.848859,
                      "lon":  15.961814
                  },
                  {
                      "dist":  2.248,
                      "ele":  785,
                      "lat":  47.848792,
                      "lon":  15.96141
                  },
                  {
                      "dist":  2.317,
                      "ele":  797,
                      "lat":  47.848629,
                      "lon":  15.960529
                  },
                  {
                      "dist":  2.356,
                      "ele":  800,
                      "lat":  47.848406,
                      "lon":  15.960116
                  },
                  {
                      "dist":  2.422,
                      "ele":  811,
                      "lat":  47.848135,
                      "lon":  15.959334
                  },
                  {
                      "dist":  2.467,
                      "ele":  814,
                      "lat":  47.847912,
                      "lon":  15.958831
                  },
                  {
                      "dist":  2.501,
                      "ele":  814,
                      "lat":  47.847761,
                      "lon":  15.958437
                  },
                  {
                      "dist":  2.523,
                      "ele":  816,
                      "lat":  47.847749,
                      "lon":  15.95814
                  },
                  {
                      "dist":  2.544,
                      "ele":  819,
                      "lat":  47.847791,
                      "lon":  15.957862
                  },
                  {
                      "dist":  2.592,
                      "ele":  825,
                      "lat":  47.847972,
                      "lon":  15.957286
                  },
                  {
                      "dist":  2.626,
                      "ele":  824,
                      "lat":  47.848075,
                      "lon":  15.956856
                  },
                  {
                      "dist":  2.648,
                      "ele":  820,
                      "lat":  47.84793,
                      "lon":  15.956649
                  },
                  {
                      "dist":  2.66,
                      "ele":  819,
                      "lat":  47.847882,
                      "lon":  15.956504
                  },
                  {
                      "dist":  2.695,
                      "ele":  823,
                      "lat":  47.847581,
                      "lon":  15.95638
                  },
                  {
                      "dist":  2.748,
                      "ele":  839,
                      "lat":  47.847249,
                      "lon":  15.955867
                  },
                  {
                      "dist":  2.762,
                      "ele":  842,
                      "lat":  47.847158,
                      "lon":  15.955993
                  },
                  {
                      "dist":  2.84,
                      "ele":  855,
                      "lat":  47.84667,
                      "lon":  15.955238
                  },
                  {
                      "dist":  2.909,
                      "ele":  855,
                      "lat":  47.84617,
                      "lon":  15.954699
                  },
                  {
                      "dist":  2.96,
                      "ele":  854,
                      "lat":  47.845796,
                      "lon":  15.954286
                  },
                  {
                      "dist":  2.977,
                      "ele":  854,
                      "lat":  47.845651,
                      "lon":  15.954223
                  },
                  {
                      "dist":  3.028,
                      "ele":  866,
                      "lat":  47.845326,
                      "lon":  15.953738
                  },
                  {
                      "dist":  3.076,
                      "ele":  885,
                      "lat":  47.845049,
                      "lon":  15.953254
                  },
                  {
                      "dist":  3.118,
                      "ele":  898,
                      "lat":  47.844771,
                      "lon":  15.952867
                  },
                  {
                      "dist":  3.155,
                      "ele":  909,
                      "lat":  47.844439,
                      "lon":  15.952812
                  },
                  {
                      "dist":  3.191,
                      "ele":  925,
                      "lat":  47.844198,
                      "lon":  15.952489
                  },
                  {
                      "dist":  3.218,
                      "ele":  933,
                      "lat":  47.844017,
                      "lon":  15.952265
                  },
                  {
                      "dist":  3.218,
                      "ele":  933,
                      "lat":  47.844017,
                      "lon":  15.952265
                  },
                  {
                      "dist":  3.223,
                      "ele":  935,
                      "lat":  47.843981,
                      "lon":  15.95222
                  },
                  {
                      "dist":  3.302,
                      "ele":  965,
                      "lat":  47.843577,
                      "lon":  15.951349
                  },
                  {
                      "dist":  3.326,
                      "ele":  971,
                      "lat":  47.843541,
                      "lon":  15.951025
                  },
                  {
                      "dist":  3.344,
                      "ele":  976,
                      "lat":  47.843421,
                      "lon":  15.950873
                  },
                  {
                      "dist":  3.353,
                      "ele":  978,
                      "lat":  47.843354,
                      "lon":  15.95081
                  },
                  {
                      "dist":  3.386,
                      "ele":  986,
                      "lat":  47.843064,
                      "lon":  15.950693
                  },
                  {
                      "dist":  3.408,
                      "ele":  994,
                      "lat":  47.843052,
                      "lon":  15.950405
                  },
                  {
                      "dist":  3.411,
                      "ele":  995,
                      "lat":  47.84304,
                      "lon":  15.950369
                  },
                  {
                      "dist":  3.416,
                      "ele":  997,
                      "lat":  47.843052,
                      "lon":  15.950298
                  },
                  {
                      "dist":  3.423,
                      "ele":  999,
                      "lat":  47.843023,
                      "lon":  15.950217
                  },
                  {
                      "dist":  3.428,
                      "ele":  1001,
                      "lat":  47.843023,
                      "lon":  15.950154
                  },
                  {
                      "dist":  3.438,
                      "ele":  1005,
                      "lat":  47.843058,
                      "lon":  15.950028
                  },
                  {
                      "dist":  3.444,
                      "ele":  1002,
                      "lat":  47.843101,
                      "lon":  15.949965
                  },
                  {
                      "dist":  3.467,
                      "ele":  1011,
                      "lat":  47.843011,
                      "lon":  15.949696
                  },
                  {
                      "dist":  3.495,
                      "ele":  1017,
                      "lat":  47.842866,
                      "lon":  15.949382
                  },
                  {
                      "dist":  3.522,
                      "ele":  1019,
                      "lat":  47.842721,
                      "lon":  15.949103
                  },
                  {
                      "dist":  3.563,
                      "ele":  1023,
                      "lat":  47.842498,
                      "lon":  15.948663
                  },
                  {
                      "dist":  3.603,
                      "ele":  1025,
                      "lat":  47.842293,
                      "lon":  15.948223
                  },
                  {
                      "dist":  3.632,
                      "ele":  1027,
                      "lat":  47.842215,
                      "lon":  15.947854
                  },
                  {
                      "dist":  3.666,
                      "ele":  1033,
                      "lat":  47.842161,
                      "lon":  15.947396
                  },
                  {
                      "dist":  3.674,
                      "ele":  1034,
                      "lat":  47.842173,
                      "lon":  15.947298
                  },
                  {
                      "dist":  3.689,
                      "ele":  1037,
                      "lat":  47.842155,
                      "lon":  15.947099
                  },
                  {
                      "dist":  3.698,
                      "ele":  1037,
                      "lat":  47.842118,
                      "lon":  15.946992
                  },
                  {
                      "dist":  3.706,
                      "ele":  1039,
                      "lat":  47.84207,
                      "lon":  15.946902
                  },
                  {
                      "dist":  3.727,
                      "ele":  1039,
                      "lat":  47.841919,
                      "lon":  15.946749
                  },
                  {
                      "dist":  3.737,
                      "ele":  1043,
                      "lat":  47.841901,
                      "lon":  15.946615
                  },
                  {
                      "dist":  3.744,
                      "ele":  1044,
                      "lat":  47.841877,
                      "lon":  15.946533
                  },
                  {
                      "dist":  3.749,
                      "ele":  1046,
                      "lat":  47.841877,
                      "lon":  15.946453
                  },
                  {
                      "dist":  3.751,
                      "ele":  1047,
                      "lat":  47.841883,
                      "lon":  15.946435
                  },
                  {
                      "dist":  3.754,
                      "ele":  1047,
                      "lat":  47.841901,
                      "lon":  15.946399
                  },
                  {
                      "dist":  3.759,
                      "ele":  1048,
                      "lat":  47.841883,
                      "lon":  15.946345
                  },
                  {
                      "dist":  3.764,
                      "ele":  1049,
                      "lat":  47.841877,
                      "lon":  15.946273
                  },
                  {
                      "dist":  3.776,
                      "ele":  1053,
                      "lat":  47.841859,
                      "lon":  15.946111
                  },
                  {
                      "dist":  3.793,
                      "ele":  1059,
                      "lat":  47.841841,
                      "lon":  15.945887
                  },
                  {
                      "dist":  3.814,
                      "ele":  1067,
                      "lat":  47.841895,
                      "lon":  15.945617
                  },
                  {
                      "dist":  3.832,
                      "ele":  1074,
                      "lat":  47.841943,
                      "lon":  15.945393
                  },
                  {
                      "dist":  3.853,
                      "ele":  1082,
                      "lat":  47.841986,
                      "lon":  15.945124
                  },
                  {
                      "dist":  3.859,
                      "ele":  1084,
                      "lat":  47.841986,
                      "lon":  15.945034
                  },
                  {
                      "dist":  3.87,
                      "ele":  1089,
                      "lat":  47.84201,
                      "lon":  15.944889
                  },
                  {
                      "dist":  3.883,
                      "ele":  1094,
                      "lat":  47.842016,
                      "lon":  15.944719
                  },
                  {
                      "dist":  3.896,
                      "ele":  1096,
                      "lat":  47.841967,
                      "lon":  15.944566
                  },
                  {
                      "dist":  3.928,
                      "ele":  1103,
                      "lat":  47.841895,
                      "lon":  15.944145
                  },
                  {
                      "dist":  3.944,
                      "ele":  1107,
                      "lat":  47.841829,
                      "lon":  15.943956
                  },
                  {
                      "dist":  3.964,
                      "ele":  1112,
                      "lat":  47.84178,
                      "lon":  15.943704
                  },
                  {
                      "dist":  3.982,
                      "ele":  1115,
                      "lat":  47.84172,
                      "lon":  15.94347
                  },
                  {
                      "dist":  4.005,
                      "ele":  1111,
                      "lat":  47.84166,
                      "lon":  15.943183
                  },
                  {
                      "dist":  4.025,
                      "ele":  1116,
                      "lat":  47.841564,
                      "lon":  15.942958
                  },
                  {
                      "dist":  4.039,
                      "ele":  1119,
                      "lat":  47.841491,
                      "lon":  15.942797
                  },
                  {
                      "dist":  4.052,
                      "ele":  1119,
                      "lat":  47.841431,
                      "lon":  15.942644
                  },
                  {
                      "dist":  4.147,
                      "ele":  1129,
                      "lat":  47.841159,
                      "lon":  15.94144
                  },
                  {
                      "dist":  4.222,
                      "ele":  1129,
                      "lat":  47.840889,
                      "lon":  15.940524
                  },
                  {
                      "dist":  4.222,
                      "ele":  1129,
                      "lat":  47.840889,
                      "lon":  15.940524
                  },
                  {
                      "dist":  4.223,
                      "ele":  1129,
                      "lat":  47.840882,
                      "lon":  15.940506
                  },
                  {
                      "dist":  4.26,
                      "ele":  1134,
                      "lat":  47.840828,
                      "lon":  15.940021
                  },
                  {
                      "dist":  4.291,
                      "ele":  1141,
                      "lat":  47.84078,
                      "lon":  15.939617
                  },
                  {
                      "dist":  4.303,
                      "ele":  1145,
                      "lat":  47.84081,
                      "lon":  15.939455
                  },
                  {
                      "dist":  4.315,
                      "ele":  1148,
                      "lat":  47.840816,
                      "lon":  15.939293
                  },
                  {
                      "dist":  4.327,
                      "ele":  1146,
                      "lat":  47.840726,
                      "lon":  15.939222
                  },
                  {
                      "dist":  4.338,
                      "ele":  1144,
                      "lat":  47.840659,
                      "lon":  15.939105
                  },
                  {
                      "dist":  4.347,
                      "ele":  1143,
                      "lat":  47.840611,
                      "lon":  15.939015
                  },
                  {
                      "dist":  4.352,
                      "ele":  1142,
                      "lat":  47.840575,
                      "lon":  15.938961
                  },
                  {
                      "dist":  4.363,
                      "ele":  1140,
                      "lat":  47.84049,
                      "lon":  15.938889
                  },
                  {
                      "dist":  4.38,
                      "ele":  1137,
                      "lat":  47.840351,
                      "lon":  15.938826
                  },
                  {
                      "dist":  4.403,
                      "ele":  1133,
                      "lat":  47.840159,
                      "lon":  15.938709
                  },
                  {
                      "dist":  4.423,
                      "ele":  1130,
                      "lat":  47.840002,
                      "lon":  15.938556
                  },
                  {
                      "dist":  4.439,
                      "ele":  1130,
                      "lat":  47.839893,
                      "lon":  15.93843
                  },
                  {
                      "dist":  4.467,
                      "ele":  1128,
                      "lat":  47.83973,
                      "lon":  15.938134
                  },
                  {
                      "dist":  4.495,
                      "ele":  1125,
                      "lat":  47.839549,
                      "lon":  15.937883
                  },
                  {
                      "dist":  4.519,
                      "ele":  1121,
                      "lat":  47.839357,
                      "lon":  15.937721
                  },
                  {
                      "dist":  4.536,
                      "ele":  1117,
                      "lat":  47.839248,
                      "lon":  15.937577
                  },
                  {
                      "dist":  4.563,
                      "ele":  1113,
                      "lat":  47.839049,
                      "lon":  15.937371
                  },
                  {
                      "dist":  4.592,
                      "ele":  1110,
                      "lat":  47.838832,
                      "lon":  15.937155
                  },
                  {
                      "dist":  4.602,
                      "ele":  1109,
                      "lat":  47.838741,
                      "lon":  15.937101
                  },
                  {
                      "dist":  4.62,
                      "ele":  1105,
                      "lat":  47.838585,
                      "lon":  15.937074
                  },
                  {
                      "dist":  4.644,
                      "ele":  1102,
                      "lat":  47.838386,
                      "lon":  15.936958
                  },
                  {
                      "dist":  4.66,
                      "ele":  1099,
                      "lat":  47.838247,
                      "lon":  15.936895
                  },
                  {
                      "dist":  4.67,
                      "ele":  1098,
                      "lat":  47.838157,
                      "lon":  15.936849
                  },
                  {
                      "dist":  4.691,
                      "ele":  1092,
                      "lat":  47.837976,
                      "lon":  15.936859
                  },
                  {
                      "dist":  4.707,
                      "ele":  1088,
                      "lat":  47.837825,
                      "lon":  15.936832
                  },
                  {
                      "dist":  4.726,
                      "ele":  1083,
                      "lat":  47.837656,
                      "lon":  15.936805
                  },
                  {
                      "dist":  4.729,
                      "ele":  1083,
                      "lat":  47.837632,
                      "lon":  15.936787
                  },
                  {
                      "dist":  4.729,
                      "ele":  1083,
                      "lat":  47.837632,
                      "lon":  15.936787
                  },
                  {
                      "dist":  4.746,
                      "ele":  1080,
                      "lat":  47.837493,
                      "lon":  15.936706
                  },
                  {
                      "dist":  4.774,
                      "ele":  1077,
                      "lat":  47.837288,
                      "lon":  15.936491
                  },
                  {
                      "dist":  4.799,
                      "ele":  1076,
                      "lat":  47.837131,
                      "lon":  15.936248
                  },
                  {
                      "dist":  4.859,
                      "ele":  1064,
                      "lat":  47.837234,
                      "lon":  15.937038
                  },
                  {
                      "dist":  4.966,
                      "ele":  1037,
                      "lat":  47.8375,
                      "lon":  15.938413
                  },
                  {
                      "dist":  5.046,
                      "ele":  1021,
                      "lat":  47.837825,
                      "lon":  15.939374
                  },
                  {
                      "dist":  5.074,
                      "ele":  1016,
                      "lat":  47.837951,
                      "lon":  15.939698
                  },
                  {
                      "dist":  5.079,
                      "ele":  1014,
                      "lat":  47.837951,
                      "lon":  15.939769
                  },
                  {
                      "dist":  5.086,
                      "ele":  1014,
                      "lat":  47.837903,
                      "lon":  15.939715
                  },
                  {
                      "dist":  5.17,
                      "ele":  996,
                      "lat":  47.838223,
                      "lon":  15.94074
                  },
                  {
                      "dist":  5.239,
                      "ele":  980,
                      "lat":  47.838326,
                      "lon":  15.941646
                  },
                  {
                      "dist":  5.266,
                      "ele":  973,
                      "lat":  47.838332,
                      "lon":  15.942006
                  },
                  {
                      "dist":  5.266,
                      "ele":  973,
                      "lat":  47.838332,
                      "lon":  15.942006
                  },
                  {
                      "dist":  5.278,
                      "ele":  970,
                      "lat":  47.838338,
                      "lon":  15.942168
                  },
                  {
                      "dist":  5.3,
                      "ele":  962,
                      "lat":  47.838302,
                      "lon":  15.942464
                  },
                  {
                      "dist":  5.333,
                      "ele":  955,
                      "lat":  47.838326,
                      "lon":  15.942895
                  },
                  {
                      "dist":  5.389,
                      "ele":  940,
                      "lat":  47.838247,
                      "lon":  15.94364
                  },
                  {
                      "dist":  5.42,
                      "ele":  931,
                      "lat":  47.838223,
                      "lon":  15.944055
                  },
                  {
                      "dist":  5.448,
                      "ele":  924,
                      "lat":  47.838211,
                      "lon":  15.944432
                  },
                  {
                      "dist":  5.478,
                      "ele":  916,
                      "lat":  47.838187,
                      "lon":  15.944827
                  },
                  {
                      "dist":  5.54,
                      "ele":  904,
                      "lat":  47.838265,
                      "lon":  15.945653
                  },
                  {
                      "dist":  5.553,
                      "ele":  903,
                      "lat":  47.83832,
                      "lon":  15.945806
                  },
                  {
                      "dist":  5.575,
                      "ele":  900,
                      "lat":  47.838404,
                      "lon":  15.946067
                  },
                  {
                      "dist":  5.609,
                      "ele":  892,
                      "lat":  47.838513,
                      "lon":  15.946497
                  },
                  {
                      "dist":  5.628,
                      "ele":  889,
                      "lat":  47.838579,
                      "lon":  15.946732
                  },
                  {
                      "dist":  5.698,
                      "ele":  873,
                      "lat":  47.838832,
                      "lon":  15.947585
                  },
                  {
                      "dist":  5.766,
                      "ele":  857,
                      "lat":  47.839097,
                      "lon":  15.948411
                  },
                  {
                      "dist":  5.812,
                      "ele":  848,
                      "lat":  47.839206,
                      "lon":  15.949004
                  },
                  {
                      "dist":  5.845,
                      "ele":  843,
                      "lat":  47.839369,
                      "lon":  15.949382
                  },
                  {
                      "dist":  5.858,
                      "ele":  842,
                      "lat":  47.839423,
                      "lon":  15.949525
                  },
                  {
                      "dist":  5.891,
                      "ele":  839,
                      "lat":  47.839507,
                      "lon":  15.949956
                  },
                  {
                      "dist":  5.927,
                      "ele":  835,
                      "lat":  47.839628,
                      "lon":  15.950397
                  },
                  {
                      "dist":  5.943,
                      "ele":  834,
                      "lat":  47.839664,
                      "lon":  15.950612
                  },
                  {
                      "dist":  5.977,
                      "ele":  832,
                      "lat":  47.839803,
                      "lon":  15.951017
                  },
                  {
                      "dist":  6.048,
                      "ele":  827,
                      "lat":  47.840135,
                      "lon":  15.951825
                  },
                  {
                      "dist":  6.111,
                      "ele":  824,
                      "lat":  47.840514,
                      "lon":  15.952453
                  },
                  {
                      "dist":  6.182,
                      "ele":  823,
                      "lat":  47.840942,
                      "lon":  15.953164
                  },
                  {
                      "dist":  6.208,
                      "ele":  823,
                      "lat":  47.841105,
                      "lon":  15.953414
                  },
                  {
                      "dist":  6.237,
                      "ele":  825,
                      "lat":  47.841316,
                      "lon":  15.95363
                  },
                  {
                      "dist":  6.261,
                      "ele":  827,
                      "lat":  47.841509,
                      "lon":  15.953774
                  },
                  {
                      "dist":  6.277,
                      "ele":  827,
                      "lat":  47.841635,
                      "lon":  15.953891
                  },
                  {
                      "dist":  6.293,
                      "ele":  827,
                      "lat":  47.841738,
                      "lon":  15.954043
                  },
                  {
                      "dist":  6.325,
                      "ele":  826,
                      "lat":  47.841889,
                      "lon":  15.954403
                  },
                  {
                      "dist":  6.347,
                      "ele":  825,
                      "lat":  47.842016,
                      "lon":  15.954627
                  },
                  {
                      "dist":  6.36,
                      "ele":  825,
                      "lat":  47.8421,
                      "lon":  15.954745
                  },
                  {
                      "dist":  6.371,
                      "ele":  824,
                      "lat":  47.842148,
                      "lon":  15.954879
                  },
                  {
                      "dist":  6.385,
                      "ele":  822,
                      "lat":  47.842148,
                      "lon":  15.955059
                  },
                  {
                      "dist":  6.397,
                      "ele":  820,
                      "lat":  47.842124,
                      "lon":  15.955229
                  },
                  {
                      "dist":  6.416,
                      "ele":  818,
                      "lat":  47.84204,
                      "lon":  15.955445
                  },
                  {
                      "dist":  6.441,
                      "ele":  816,
                      "lat":  47.841901,
                      "lon":  15.955714
                  },
                  {
                      "dist":  6.456,
                      "ele":  814,
                      "lat":  47.841804,
                      "lon":  15.955849
                  },
                  {
                      "dist":  6.474,
                      "ele":  812,
                      "lat":  47.841678,
                      "lon":  15.956001
                  },
                  {
                      "dist":  6.488,
                      "ele":  811,
                      "lat":  47.841588,
                      "lon":  15.956137
                  },
                  {
                      "dist":  6.503,
                      "ele":  809,
                      "lat":  47.841522,
                      "lon":  15.956307
                  },
                  {
                      "dist":  6.534,
                      "ele":  807,
                      "lat":  47.841678,
                      "lon":  15.956649
                  },
                  {
                      "dist":  6.547,
                      "ele":  804,
                      "lat":  47.84178,
                      "lon":  15.95672
                  },
                  {
                      "dist":  6.579,
                      "ele":  800,
                      "lat":  47.842052,
                      "lon":  15.956873
                  },
                  {
                      "dist":  6.594,
                      "ele":  799,
                      "lat":  47.842185,
                      "lon":  15.956919
                  },
                  {
                      "dist":  6.624,
                      "ele":  797,
                      "lat":  47.842456,
                      "lon":  15.956883
                  },
                  {
                      "dist":  6.657,
                      "ele":  794,
                      "lat":  47.842745,
                      "lon":  15.956774
                  },
                  {
                      "dist":  6.672,
                      "ele":  793,
                      "lat":  47.842872,
                      "lon":  15.956747
                  },
                  {
                      "dist":  6.696,
                      "ele":  790,
                      "lat":  47.843083,
                      "lon":  15.95682
                  },
                  {
                      "dist":  6.719,
                      "ele":  789,
                      "lat":  47.843282,
                      "lon":  15.956891
                  },
                  {
                      "dist":  6.739,
                      "ele":  788,
                      "lat":  47.843463,
                      "lon":  15.956963
                  },
                  {
                      "dist":  6.766,
                      "ele":  785,
                      "lat":  47.843704,
                      "lon":  15.957009
                  },
                  {
                      "dist":  6.797,
                      "ele":  781,
                      "lat":  47.843957,
                      "lon":  15.95716
                  },
                  {
                      "dist":  6.841,
                      "ele":  777,
                      "lat":  47.844307,
                      "lon":  15.957448
                  },
                  {
                      "dist":  6.908,
                      "ele":  772,
                      "lat":  47.844819,
                      "lon":  15.957915
                  },
                  {
                      "dist":  6.952,
                      "ele":  768,
                      "lat":  47.845169,
                      "lon":  15.958202
                  },
                  {
                      "dist":  6.98,
                      "ele":  764,
                      "lat":  47.845374,
                      "lon":  15.958418
                  },
                  {
                      "dist":  7.021,
                      "ele":  759,
                      "lat":  47.845639,
                      "lon":  15.958795
                  },
                  {
                      "dist":  7.042,
                      "ele":  757,
                      "lat":  47.845814,
                      "lon":  15.958913
                  },
                  {
                      "dist":  7.073,
                      "ele":  754,
                      "lat":  47.846007,
                      "lon":  15.959209
                  },
                  {
                      "dist":  7.093,
                      "ele":  752,
                      "lat":  47.846134,
                      "lon":  15.959389
                  },
                  {
                      "dist":  7.105,
                      "ele":  751,
                      "lat":  47.846218,
                      "lon":  15.959506
                  },
                  {
                      "dist":  7.12,
                      "ele":  751,
                      "lat":  47.846254,
                      "lon":  15.959693
                  },
                  {
                      "dist":  7.128,
                      "ele":  752,
                      "lat":  47.846242,
                      "lon":  15.959802
                  },
                  {
                      "dist":  7.146,
                      "ele":  752,
                      "lat":  47.846182,
                      "lon":  15.960026
                  },
                  {
                      "dist":  7.158,
                      "ele":  751,
                      "lat":  47.846164,
                      "lon":  15.960188
                  },
                  {
                      "dist":  7.158,
                      "ele":  751,
                      "lat":  47.846164,
                      "lon":  15.960188
                  },
                  {
                      "dist":  7.163,
                      "ele":  751,
                      "lat":  47.846158,
                      "lon":  15.960242
                  },
                  {
                      "dist":  7.179,
                      "ele":  750,
                      "lat":  47.846182,
                      "lon":  15.960466
                  },
                  {
                      "dist":  7.2,
                      "ele":  751,
                      "lat":  47.846242,
                      "lon":  15.960727
                  },
                  {
                      "dist":  7.224,
                      "ele":  753,
                      "lat":  47.846345,
                      "lon":  15.961014
                  },
                  {
                      "dist":  7.254,
                      "ele":  754,
                      "lat":  47.846489,
                      "lon":  15.961347
                  },
                  {
                      "dist":  7.278,
                      "ele":  752,
                      "lat":  47.846622,
                      "lon":  15.961598
                  },
                  {
                      "dist":  7.309,
                      "ele":  747,
                      "lat":  47.846791,
                      "lon":  15.96194
                  },
                  {
                      "dist":  7.335,
                      "ele":  742,
                      "lat":  47.846893,
                      "lon":  15.962254
                  },
                  {
                      "dist":  7.352,
                      "ele":  739,
                      "lat":  47.846984,
                      "lon":  15.962433
                  },
                  {
                      "dist":  7.373,
                      "ele":  735,
                      "lat":  47.847104,
                      "lon":  15.96264
                  },
                  {
                      "dist":  7.383,
                      "ele":  734,
                      "lat":  47.84717,
                      "lon":  15.96273
                  },
                  {
                      "dist":  7.398,
                      "ele":  731,
                      "lat":  47.847243,
                      "lon":  15.962901
                  },
                  {
                      "dist":  7.407,
                      "ele":  730,
                      "lat":  47.847279,
                      "lon":  15.963018
                  },
                  {
                      "dist":  7.432,
                      "ele":  727,
                      "lat":  47.847249,
                      "lon":  15.963341
                  },
                  {
                      "dist":  7.442,
                      "ele":  725,
                      "lat":  47.847261,
                      "lon":  15.963485
                  },
                  {
                      "dist":  7.467,
                      "ele":  723,
                      "lat":  47.847315,
                      "lon":  15.963799
                  },
                  {
                      "dist":  7.497,
                      "ele":  720,
                      "lat":  47.847387,
                      "lon":  15.964194
                  },
                  {
                      "dist":  7.545,
                      "ele":  714,
                      "lat":  47.847538,
                      "lon":  15.964796
                  },
                  {
                      "dist":  7.554,
                      "ele":  713,
                      "lat":  47.847593,
                      "lon":  15.964877
                  },
                  {
                      "dist":  7.559,
                      "ele":  713,
                      "lat":  47.847635,
                      "lon":  15.964913
                  },
                  {
                      "dist":  7.576,
                      "ele":  712,
                      "lat":  47.847785,
                      "lon":  15.964949
                  },
                  {
                      "dist":  7.662,
                      "ele":  709,
                      "lat":  47.848503,
                      "lon":  15.96538
                  },
                  {
                      "dist":  7.693,
                      "ele":  705,
                      "lat":  47.848708,
                      "lon":  15.965659
                  },
                  {
                      "dist":  7.77,
                      "ele":  696,
                      "lat":  47.84919,
                      "lon":  15.966395
                  },
                  {
                      "dist":  7.817,
                      "ele":  690,
                      "lat":  47.849419,
                      "lon":  15.966934
                  },
                  {
                      "dist":  7.829,
                      "ele":  686,
                      "lat":  47.849353,
                      "lon":  15.967051
                  },
                  {
                      "dist":  7.876,
                      "ele":  674,
                      "lat":  47.849534,
                      "lon":  15.967617
                  },
                  {
                      "dist":  7.912,
                      "ele":  665,
                      "lat":  47.849763,
                      "lon":  15.967967
                  },
                  {
                      "dist":  7.941,
                      "ele":  661,
                      "lat":  47.849968,
                      "lon":  15.96821
                  },
                  {
                      "dist":  7.98,
                      "ele":  655,
                      "lat":  47.850119,
                      "lon":  15.968686
                  },
                  {
                      "dist":  8.074,
                      "ele":  642,
                      "lat":  47.850546,
                      "lon":  15.969773
                  },
                  {
                      "dist":  8.141,
                      "ele":  627,
                      "lat":  47.85095,
                      "lon":  15.970438
                  },
                  {
                      "dist":  8.208,
                      "ele":  609,
                      "lat":  47.85145,
                      "lon":  15.970923
                  },
                  {
                      "dist":  8.236,
                      "ele":  603,
                      "lat":  47.851674,
                      "lon":  15.971112
                  },
                  {
                      "dist":  8.266,
                      "ele":  598,
                      "lat":  47.851867,
                      "lon":  15.971381
                  },
                  {
                      "dist":  8.32,
                      "ele":  590,
                      "lat":  47.85224,
                      "lon":  15.971857
                  },
                  {
                      "dist":  8.372,
                      "ele":  590,
                      "lat":  47.85265,
                      "lon":  15.972181
                  },
                  {
                      "dist":  8.372,
                      "ele":  590,
                      "lat":  47.85265,
                      "lon":  15.972181
                  },
                  {
                      "dist":  8.372,
                      "ele":  581,
                      "lat":  47.85265,
                      "lon":  15.972181
                  },
                  {
                      "dist":  8.446,
                      "ele":  566,
                      "lat":  47.853283,
                      "lon":  15.972504
                  },
                  {
                      "dist":  8.484,
                      "ele":  556,
                      "lat":  47.853603,
                      "lon":  15.972666
                  },
                  {
                      "dist":  8.497,
                      "ele":  552,
                      "lat":  47.853675,
                      "lon":  15.9728
                  },
                  {
                      "dist":  8.522,
                      "ele":  549,
                      "lat":  47.853657,
                      "lon":  15.973133
                  },
                  {
                      "dist":  8.59,
                      "ele":  539,
                      "lat":  47.853856,
                      "lon":  15.974004
                  },
                  {
                      "dist":  8.611,
                      "ele":  536,
                      "lat":  47.854037,
                      "lon":  15.973941
                  },
                  {
                      "dist":  8.629,
                      "ele":  535,
                      "lat":  47.854182,
                      "lon":  15.973833
                  },
                  {
                      "dist":  8.66,
                      "ele":  533,
                      "lat":  47.854446,
                      "lon":  15.973708
                  },
                  {
                      "dist":  8.715,
                      "ele":  533,
                      "lat":  47.854898,
                      "lon":  15.973385
                  },
                  {
                      "dist":  8.727,
                      "ele":  534,
                      "lat":  47.855001,
                      "lon":  15.973412
                  },
                  {
                      "dist":  8.736,
                      "ele":  535,
                      "lat":  47.855079,
                      "lon":  15.973447
                  },
                  {
                      "dist":  8.75,
                      "ele":  535,
                      "lat":  47.85517,
                      "lon":  15.973582
                  },
                  {
                      "dist":  8.761,
                      "ele":  537,
                      "lat":  47.855242,
                      "lon":  15.973492
                  },
                  {
                      "dist":  8.813,
                      "ele":  542,
                      "lat":  47.855658,
                      "lon":  15.973825
                  },
                  {
                      "dist":  8.907,
                      "ele":  557,
                      "lat":  47.856424,
                      "lon":  15.974337
                  },
                  {
                      "dist":  8.972,
                      "ele":  568,
                      "lat":  47.856984,
                      "lon":  15.974588
                  },
                  {
                      "dist":  8.994,
                      "ele":  571,
                      "lat":  47.857171,
                      "lon":  15.974696
                  },
                  {
                      "dist":  9.054,
                      "ele":  577,
                      "lat":  47.857623,
                      "lon":  15.975144
                  },
                  {
                      "dist":  9.069,
                      "ele":  577,
                      "lat":  47.85775,
                      "lon":  15.975154
                  }
              ]
}
;

