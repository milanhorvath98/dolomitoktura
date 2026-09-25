# 🏔️ LordTúra – Projekt Összefoglaló és Üzemeltetési Útmutató

Ez a dokumentum részletesen összefoglalja a **LordTúra** hegyi és alpesi expedíciós portált, a feldolgozott túra- és geodéziai adatokat (Dolomitok 4 napos kalandterv és további hegyi útvonalak), a beépített **valós geodéziai szintrajzokat**, a **teljes körű mobilbarát felületet (oldalsó menü, alsó navigáció, SOS hívók)**, valamint a **Raspberry Pi** alapú éles kiszolgáló és a **Tailscale Funnel** architektúráját.

---

## 📌 1. Projekt Áttekintés & Portál Architektúra (Többtúrás Rendszer)

A **LordTúra** egy moduláris, több hegyi expedíciót és túratervet kiszolgáló webes portálrendszerré bővült:

1. **LordTúra Kezdőlap (Hub / Portál - `index.html`):**
   * **Központi választófelület:** Látványos, modern kezdőlap drónvideós háttérrel, statisztikai mutatókkal és túrakártyákkal.
   * **Aktív expedíciók:**
     * 🏔️ **Dolomitok Expedíció – 4 Napos Kalandterv** (`dolomitok.html`) &bull; *Élő, 10 fős csapat, 12 valós túra, GPX, szintrajzok, hütte kalauz, parkolók.*
     * 🌲 **Dürre Wand &amp; Plattenstein (1154 m)** (`durrewand/index.html`) &bull; *Élő, 1 napos alsó-ausztriai alpesi körtúra, Miesenbach, Gauermannhütte (1154 m), Schneeberg panoráma, 9.1 km, +656 m szint, 322 pontos GPS profil.*
   * **Tervezés alatt álló túratervek:**
     * ⛰️ **Magas-Tátra:** Gerinctúrák, tengerszemek &amp; láncos utak (Rysy, Kriván).
     * 🌲 **Júliai-Alpok:** Triglav csúcshódítás (2 864 m) a Vrata-völgyből.
     * ➕ **Új túra tervezése:** Felvételi lehetőség egyedi túrákhoz és csoportokhoz.
   * **Expedíciós eszköztár áttekintése:** GPS nyomvonalak, szintrajzok, élő időjárás, Waze parkolók, kalkulátor, csekklista.

2. **Dolomitok Expedíció Részletes Rendszer (`dolomitok.html`):**
   * A teljes körű, 4 napos alpesi expedíció interaktív felülete (10 fős csapat: 4 via ferrata mászó &amp; 6 panorámatúrázó/fotós).
   * Beépített **„← Kezdőlap”** és **„🌲 Plattenstein”** gombok az asztali navigációban és a mobil oldalsó menüben a zökkenőmentes átjárhatósághoz.

3. **Dürre Wand &amp; Plattenstein Rendszer (`durrewand/`):**
   * 1 napos alpesi túra a Bécsi-Alpokban (Gutensteini-Alpok) 25 nagyfelbontású fotóval, Gauermannhütte kalauzzal és SOS 140 hegyimentő hívóval.
   * Kétirányú átjárhatóság: felső sávban közvetlen ugrás a **LordTúra Kezdőlapra** és a **Dolomitok 4D** túrára.

---

## 📱 2. Mobilbarát Képességek & Terepi Használhatóság (ÚJ FUNKCIÓK)

A túrázók és mászók a hegyen gyakran okostelefonról nyitják meg az oldalt, ezért a felület prémium mobil-élménnyel lett felvértezve:

1. **Oldalsó Menü (Slide-out Off-canvas Drawer):**
   * Elegáns sötét üveg oldalsó menü hamburger ikonnal (`fa-bars`) és háttér-elhomályosítással.
   * Teljes szakasznavigáció (Térkép, Időrend, Költségvetés, Felszereléslista, GPX Központ, Logisztika).
   * **Gyors napi ugrás:** Külön gombok az 1., 2., 3., 4. napra, amelyek azonnal odagörgetnek és beállítják a térképszűrőt.
   * **Alpesi SOS Gombok:** Közvetlen egyérintéses hívógombok:
     * 🚨 **118** – Olasz Hegyi Mentők (*Soccorso Alpino Dolomiti*)
     * 📞 **112** – Általános európai segélyhívó
2. **Alsó Gyorssáv (Mobile Bottom Navigation Bar):**
   * Hüvelykujjal kényelmesen elérhető alsó menüsáv az 5 legfontosabb funkcióval:
     * 🗺️ **Térkép** | 🕒 **Időrend** | 📊 **Szintrajz** (közvetlen görgetés a magasságprofilhoz) | 🎒 **Csomagolás** | ☰ **Menü**
   * iOS és Android `safe-area-inset-bottom` támogatás (nem takarja ki a rendszersávokat).
3. **Vízszintesen Lapozható Szűrősáv:**
   * A napok és csapatok szerinti szűrőgombok mobilon elegáns, érintéssel görgethető szalaggá válnak (`touch scroll`).
4. **Lebegő Vissza a Térképhez Gomb (Scroll-to-top FAB):**
   * Ha a felhasználó lejjebb görget a részletes programokhoz, automatikusan megjelenik a jobb alsó sarokban egy lebegő gomb, amely visszaviszi az interaktív térképhez.
5. **Érintésérzékeny Szintrajz-kezelés:**
   * Ujjhúzással finoman léptethető a magasságprofil, miközben a térképen valós időben fut a pulzáló pozíciójelölő.
6. **Asztali Menüszalag & Intelligens Dokkolás (Desktop Navigation UX):**
   * A menüszalag konténere 1400px szélességre bővítve, a feliratok és térközök optimalizálva: **mind a 6 funkció (Túrák & Térkép, Napi Időrend, Költségvetés, Felszerelés, GPX Letöltések, Logisztika & Tippek) kényelmesen, csonkítás nélkül elfér egyetlen sorban** minden asztali és laptop kijelzőn.
   * **Intelligens automatikus görgetés (Auto-scroll to Dock):** Bármely fülre kattintva a weboldal azonnal és simán a képernyő tetejére dokkolja a navigációs sávot, így a kiválasztott szekció tartalma rögtön teljes egészében láthatóvá válik.
   * **Márkalogó visszaugrás:** A "Dolomiti 4D" logóra kattintva az oldal visszagördül a legfelső borítóképhez.
   * **Egérgörgős lapozás:** Kisebb monitorokon az egérgörgő a fülek felett finom vízszintes lapozást biztosít.

---

## 📊 3. Valós Geodéziai Szintrajzok & Magasságprofilok

Mind a 12 túrához valós digitális domborzatmodellből (DEM) és GPS magassági adatokból számított **interaktív szintrajz** tartozik:

1. **Vektorgrafikus (SVG) Megjelenítés:**
   * Színkódolt dinamikus gradiens kitöltés:
     * 🧗 **Mászó Ferraták:** Piros/Korall (`#ef4444`)
     * 🥾 **Túrázó Utak:** Smaragdzöld (`#10b981`)
     * 🌅 **Közös Programok:** Borostyánsárga (`#f59e0b`)
   * Magassági skála vízszintes segédvonalakkal (minimum, felező, csúcsmagasság méterben).
   * Távolsági tengely (0 km, felezőpont, végpont).
   * Kiemelt csúcspont-jelölő a legmagasabb magasságon.
2. **Interaktív Kurzor- és Érintéskövetés (Scrubbing):**
   * Lebegő információs panel (`tooltip`): pontos távolság és magasság (pl. `📍 4.2 km • ⛰️ 2 240 m`).
   * Élő térkép-szinkronizáció pulzáló markerrel a Leaflet rétegen.

---

## 🗺️ 4. Részletes Napi Programok & GPX Nyomvonalak

Minden túrához hivatalos, valós koordinátákból és magassági pontokból álló `.gpx` fájl tartozik a `gpx/` mappában:

| Nap & Csapat | Túra Neve | Táv (km) | Magasság Sáv | Szintkülönbség (+D / -D) | GPX Fájl |
|---|---|---|---|---|---|
| **1. Nap Mászó** | Via Ferrata Michielli-Strobel (Punta Fiames) | 7.22 km | 1 293 m – 2 235 m | +969 m / -982 m | `day1_maszo_ferrata_strobel.gpx` |
| **1. Nap Túrázó** | Tofana Panoráma & Rifugio Pomedes | 5.22 km | 1 803 m – 2 282 m | +568 m / -609 m | `day1_turazo_tofana_pomedes.gpx` |
| **1. Nap Közös** | Misurina-tó Part menti Körséta | 2.12 km | 1 751 m – 1 757 m | Sík tóparti séta | `day1_kozos_misurina_to.gpx` |
| **2. Nap Mászó** | VF DeLuca - Innerkofler (Monte Paterno) | 8.88 km | 2 306 m – 2 589 m | +359 m / -364 m | `day2_maszo_ferrata_de_luca_innerkofler.gpx` |
| **2. Nap Túrázó** | Cadini di Misurina Viewpoint (Sentiero 117) | 3.37 km | 2 262 m – 2 336 m | +128 m / -125 m | `day2_turazo_cadini_di_misurina.gpx` |
| **2. Nap Bónusz** | Tre Cime di Lavaredo Panoráma Körtúra | 10.49 km | 2 185 m – 2 441 m | +429 m / -423 m | `day2_tre_cime_kor.gpx` |
| **2. Nap Közös** | Rifugio Auronzo Panorámaterasz találkozó | 1.20 km | 2 320 m – 2 345 m | Helyben | Beépített bázis |
| **3. Nap Mászó** | VF Pisciadù (Brigata Tridentina & Függőhíd) | 4.23 km | 1 961 m – 2 616 m | +692 m / -693 m | `day3_maszo_ferrata_pisciadu.gpx` |
| **3. Nap Túrázó** | Passo Sella & Città dei Sassi (Kőváros) | 8.01 km | 2 029 m – 2 348 m | +427 m / -423 m | `day3_turazo_sella_sassolungo.gpx` |
| **3. Nap Közös** | Lago di Braies (Pragser Wildsee) Körséta | 3.32 km | 1 481 m – 1 552 m | +131 m / -142 m | `day3_kozos_lago_di_braies.gpx` |
| **4. Nap Mászó** | Via Ferrata Piccolo Cir (Cir V) | 2.21 km | 2 122 m – 2 473 m | +351 m / -349 m | `day4_maszo_ferrata_piccolo_cir.gpx` |
| **4. Nap Túrázó** | Val di Funes & Santa Maddalena Panoráma | 5.92 km | 1 241 m – 1 385 m | +306 m / -237 m | `day4_turazo_val_di_funes.gpx` |
| **4. Nap Közös** | Seceda Fűrészgerinc & Csúcskereszt | 9.75 km | 2 040 m – 2 494 m | +727 m / -816 m | `day4_kozos_seceda_gerinc.gpx` |

---

## 💶 5. Költségvetés Számoló & Napi Élő EUR/HUF Árfolyam

A weboldal pénzügyi kalkulátora valós idejű, bankközi devizaárfolyammal számol:

1. **Non-blocking Aszinkron Háttérbetöltés:**
   * Az oldal betöltődésekor nem blokkolja a felület megjelenítését, az árfolyam azonnal az aktuális napi referenciaértékről indul (`362.4 Ft/EUR`), és a háttérben automatikusan szinkronizál a hivatalos bankközi adatokkal.
   * A felhasználói felület letisztult, nem jelenít meg belső fejlesztői szövegeket, kizárólag a hivatalos árfolyamot, a szolgáltatót és a pontos frissítési időbélyeget.
2. **Háromszintű API Fallback Architektúra:**
   * **1. Elsődleges szolgáltató:** jsDelivr Currency CDN (`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json`) – villámgyors globális edge cache, azonnali CORS válasz.
   * **2. Másodlagos szolgáltató:** Frankfurter.dev (`https://api.frankfurter.dev/v1/latest?from=EUR&to=HUF`), hivatalos Európai Központi Bank (EKB) referenciaadatokkal.
   * **3. Harmadlagos szolgáltató:** Open Exchange Rates (`https://open.er-api.com/v6/latest/EUR`).
   * **Offline védelem:** Hálózati kimaradás esetén a legfrissebb napi árfolyam marad érvényben, nincs összeomlás.
3. **SessionStorage Gyorsítótár:**
   * A lekérdezett napi árfolyam 30 perces érvényességi idővel (`TTL = 30 perc`) tárolódik a böngésző memóriájában, a manuális frissítés gombbal (`#refresh-rate-btn`) pedig azonnal kényszeríthető az újraszámolás.
4. **Valós idejű UI Visszajelzés:**
   * Pulzáló zöld állapotjelző fény (`rate-status-dot.live`) jelzi az élő státuszt.
   * A kalkulátor minden tétele (szállás, utazás, felvonók, étkezés, parkolás), valamint a személyenkénti és csapatszintű összköltség azonnal, valós időben átszámolódik EUR és HUF között.

---

## 🌤️ 6. Élő Hegyi Időjárás & 360°-os Panoráma Webkamerák (ÚJ)

A magashegyekben a gyorsan kialakuló délutáni viharok és villámlások jelentik a legnagyobb veszélyt:
* **Valós idejű Open-Meteo API integráció:**
  * Magassági pontok szerint lekérdezett élő meteorológiai adatok:
    1. **Tre Cime & Auronzo (2 333 m)** – magashegyi sziklakarszt
    2. **Seceda & Odle gerinc (2 519 m)** – kitett fűrészgerinc
    3. **Cortina d'Ampezzo (1 224 m)** – völgyi szállásbázis
    4. **Passo Sella & Pisciadù (2 240 m)** – hágók és sziklatömbök
  * Hőmérséklet (°C), érzett hőmérséklet, szélsebesség és széllökések (km/h), csapadékvalószínűség (%), páratartalom.
  * **⚡ Alpesi Viharfigyelmeztető:** Kiemelt riasztási sáv a 13:00 utáni hegyi zivatarkockázatra és a ferratán (fém drótkötélen) való tartózkodás villámveszélyére („13:00-ra fejezd be a gerinctúrát!”).
* **360°-os Beágyazott Élő Panoráma Stream Hub (ÚJ):**
  * **Kiemelt interaktív élő lejátszó:** Közvetlenül a weboldalon forgatható 360 fokos HD élő stream, zoommal, time-lapse visszatekeréssel és csúcsválasztó gombokkal:
    1. 🌲 **Seceda 2 500 m & Odle** (Val Gardena, Panomax 360° HD)
    2. 🏔️ **Tre Cime di Lavaredo** (Drei-Zinnen-Blick Dobbiaco, Foto-Webcam HD)
    3. 🪨 **Cinque Torri & Rifugio Scoiattoli** (Cortina d'Ampezzo, Panomax 360° HD)
    4. 🚠 **Passo Pordoi 2 950 m – Sass Pordoi** (Terrazza delle Dolomiti, Panomax 360° HD)
    5. 🏘️ **Cortina d'Ampezzo & Tofana di Mezzo** (Cortina, Panomax 360° HD)
    6. ⛷️ **Passo Gardena & Dantercepies** (Cir & Sella, Panomax 360° HD)
    7. 💎 **Passo Sella & Sasso Levante / Sassolungo** (Kőváros, Panomax 360° HD)
    8. 🌲 **Col Raiser & Fermeda** (Odle csoport, Panomax 360° HD)
  * **Hiteles olasz dolomiti kamerák:** Minden kamera egyenként letesztelve és hitelesítve; 100%-ban valós olaszországi hegycsúcsokról közvetítenek, osztrák tesztkamera visszairányítás nélkül.
  * **Kártyánkénti élő beágyazás & valós idejű pillanatképek:** Minden kártyán a csúcs valós, élő képe látható, és egyetlen kattintással a kártyán belül is elindítható az interaktív élő stream.

---

## 🚗 7. 1-Kattintásos Parkoló & Útdíj Központ (ÚJ)

Minden túránál és a központi logisztikai felületen azonnali navigációs indítás áll rendelkezésre:
* **Waze & Google Maps integráció:**
  * Egyetlen érintéssel közvetlen GPS útvonaltervezés indítható mindkét népszerű appban a pontos hegyi koordinátákra.
* **8 kiemelt rajthelyszín és hágó adatbázisa:**
  1. *Rifugio Auronzo hegyi út (2 330 m)* – 30 € útdíj, szigorú 07:15 előtti érkezési időkorlát (8:30-ra megtelik a 700 hely).
  2. *Lago di Braies (P3/P4)* – 12-15 € parkolás, kötelező online behajtási engedély (prags.bz) 9:30–16:00 között.
  3. *Ortisei Seceda mélygarázs (Garage Central)* – fedett, közvetlen lift a felvonóhoz.
  4. *Passo Gardena & Pisciadù beszállás (2 121 m)* – 10-12 €/nap.
  5. *Passo Sella / Città dei Sassi (2 218 m)* – 10 €/nap.
  6. *Lago di Misurina tóparti parkoló (1 754 m)* – 2-3 €/óra.
  7. *Santa Maddalena / Ranui (Val di Funes)* – 8 €/nap.
  8. *Fiames Sport Center (1 300 m)* – ingyenes rajt a Punta Fiames ferratához.
* **Integráció a felületen:** A túrakártyákon gyorssáv, a részletes modális ablakban kiemelt infódoboz található.

---

## 🏡 8. Hütte Kalauz & Dél-Tiroli Gasztro Kisokos (ÚJ)

* **8 magashegyi menedékház adatlapja:**
  * *Rifugio Locatelli, Auronzo, Lavaredo, Fonda-Savio, Pisciadù, Baita Sofie, Puez, Pomedes*.
  * Fontos terepi jelölések: **Fizetés (CSAK KÉSZPÉNZ vs. Kártya)**, **Ivóvíz helyzet (Acqua non potabile)**, mosdódíj, térerő-lefedettség, ház specialitása, közvetlen telefonszám és 1-kattintásos térképi fókuszálás.
* **Dél-Tiroli Gasztro Kisokos & Átlagárak:**
  * 8 autentikus hegyi fogás bemutatása: *Canederli / Knödel (~10-14 €)*, *Kaiserschmarrn (~9-13 €)*, *Schlutzkrapfen (~12-16 €)*, *Polenta con Salsiccia (~14-18 €)*, *Strudel di Mele (~5-7 €)*, *Bombardino (~4-6 €)*, *Forst sör & Radler*, *Grappa di Cirmolo*.
  * Hegyimentő és túravezető pro-tippek a legjobb kóstolóhelyekkel.

---

## 🎬 9. Dinamikus Fejléc Diavetítés & Alpesi Drónvideó Háttér (ÚJ)

A weboldal fejlécének (Hero szekció) háttere korábban egyetlen statikus Cadini di Misurina fotó volt. A felület mostantól egy prémium, dinamikus, moziszerű vizuális élményt nyújt:

1. **8 Ikonikus Túrahelyszín Diavetítése (Ken Burns Finom Animációval):**
   * A 4 napos túraterv mind a 8 ikonikus hegyi helyszíne megjelenik nagy felbontású (1920x1080 / 1920x1280), optimális méretű tájképen:
     1. 🏔️ **Cadini di Misurina** – Sentiero Bonacossa kilátópont (2 336 m) &bull; *2. Nap Túrázó*
     2. ⛰️ **Tre Cime di Lavaredo** – Drei Zinnen felhőtenger & Rifugio Locatelli (2 441 m) &bull; *2. Nap Bónusz*
     3. 🌲 **Seceda & Odle gerinc** – Val Gardena híres fűrészgerince (2 519 m) &bull; *4. Nap Közös*
     4. 🛶 **Lago di Braies** – Pragser Wildsee smaragdzöld vize és kavicsfövenye (1 496 m) &bull; *3. Nap Közös*
     5. 🪨 **Passo Sella & Sassolungo** – Naplemente a Kőváros (Città dei Sassi) felett (2 240 m) &bull; *3. Nap Túrázó*
     6. ⛪ **Val di Funes & Santa Maddalena** – Ranui kápolna az Odle tűk lábánál (1 385 m) &bull; *4. Nap Túrázó*
     7. 🌅 **Lago di Misurina** – Tengerszem a Tre Cime tükröződésével (1 756 m) &bull; *1. Nap Közös*
     8. 🧗 **Tofana di Rozes & Cortina** – Vöröslő sziklabástyák és ferrata beszállások (2 240 m) &bull; *1. Nap Mászó*
   * **Finom áttűnések és Ken Burns hatás:** 1.4 másodperces lágy keresztúszás (`crossfade`) és folyamatos, lassú zoom-animáció (`transform: scale`).

2. **Interaktív Vezérlősáv & Túraugrás:**
   * **Előző / Következő léptetőgombok** (`<` / `>`) és billentyűzet-navigáció (balra/jobbra nyíl).
   * **Szünet / Indítás gomb** (`fa-pause` / `fa-play`) a vetítés kényelmes megállításához.
   * **Interaktív Helyszínjelölő Kapszula:** Valós időben mutatja az aktuális csúcs nevét, magasságát és a programot.
     * **1-kattintásos túraugrás:** A kapszulára kattintva a weboldal azonnal a túratérképhez gördül, bekapcsolja az adott nap szűrőjét és a kiválasztott napi kártyához fókuszál.
   * **Interaktív Pagináció Pontok:** Gyors ugrás bármely helyszínre az egérrel való föléhúzáskor megjelenő helyszínnévvel.
   * **Mobil érintésérzékeny gesztusok (Touch Swipe):** Mobilon ujjhúzással (jobbra/balra pöccintéssel) lapozható a háttérkép.
   * **Böngészőfül-kímélő:** Háttérbe küldve automatikusan szünetel a processzorterhelés és az akkumulátor kímélése érdekében.

3. **🎬 Beépített Alpesi Drónvideó Háttér (Sass Pordoi & Sella Csoport):**
   * Egyetlen kattintással elérhető **„Drónvideó”** váltógomb a fejlécben.
   * Valós, jogtiszta légi drónfelvétel aranyórai naplementében a Dolomitok szívében (Sass Pordoi 2 950 m, Sella falak és felhőátfolyások).
   * Rendkívül gyorsan betöltődő, optimalizált és némított videóhurok (`hero_dolomites_loop.mp4` – 1.49 MB és `hero_dolomites_loop.webm` – 2.47 MB).

---

## 🍓 10. Raspberry Pi Szerver & Tailscale Funnel Architektúra

A weboldal a helyi hálózaton futó Raspberry Pi 4-en üzemel, ahonnan a **Tailscale Funnel** segítségével publikusan és biztonságosan elérhető:

* **Helyi IP-cím:** `192.168.0.161`
* **SSH Host Alias:** `raspberry` (jelszó nélküli ED25519 kulcs)
* **Webkönyvtár a Pi-n:** `/home/milan/dolomitok-web`
* **Systemd Szolgáltatás:** `dolomitok-web.service` (Python 3 HTTP szerver a 8080-as porton)
* **Tailscale Funnel:** 443 -> 8080
* 🌐 **Nyilvános Éles URL:** **`https://lordtura.tail35f0de.ts.net/`**
* **Gépnév módosítása a Pi-n (ha még 'dolomitoktura' néven fut):**
  ```bash
  sudo tailscale set --hostname=lordtura
  sudo tailscale serve --bg 8080
  sudo tailscale funnel 443 on
  ```
* **Tanúsítvány:** Let's Encrypt TLS (automatikus HTTPS titkosítás)

---

## 🔧 11. Hasznos Parancsok a Projekt Folytatásához

### 1. SSH csatlakozás:
```powershell
ssh raspberry
```

### 2. A módosított fájlok és médiaanyagok szinkronizálása a Pi-re:
```powershell
scp index.html styles.css data.js app.js cadini_di_misurina.jpg hero_*.jpg hero_*.mp4 hero_*.webm PROJECT_SUMMARY.md elevation_profiles.json raspberry:/home/milan/dolomitok-web/
```

### 3. A webszerver újraindítása / ellenőrzése:
```bash
ssh raspberry "sudo systemctl restart dolomitok-web.service"
ssh raspberry "sudo systemctl status dolomitok-web.service"
```

---

## 🐙 12. GitHub Szinkronizáció & Verziókezelés

A projekt teljes forráskódja és adatállománya verziókezelve van a GitHubon az adatvesztés megelőzése érdekében:

* **GitHub Repository:** [`https://github.com/milanhorvath98/dolomitoktura.git`](https://github.com/milanhorvath98/dolomitoktura.git)
* **Branch:** `main`
* **Automatikus egygombos szinkronizáló szkript:** [`sync.ps1`](file:///C:/Users/horvi/Documents/Antigravity%20CLI/dolomitok%20tura/sync.ps1)
  * Elvégzi a git commitot és felküldi a GitHubra (`git push origin main`)
  * Automatikusan frissíti a Raspberry Pi webszervert is (`scp`)
  * Futtatása: `.\sync.ps1` vagy `.\sync.ps1 -Message "Egyedi leiras"`


