// Všetky údaje o receptoch na jednom mieste.
// Polia FOTO, MINS a HAS sú viazané na poradie v RECIPES — keď pridávaš recept,
// pridaj mu záznam do všetkých troch.

const RECIPES = [
  {
    name:"Omeleta so slaninou a špenátom",
    time:"10 min", tags:["Vaječné"],
    kcal:400, p:25, f:31, c:3,
    ing:[["Vajcia","3 ks"],["Slanina, nakrájaná","30 g"],["Čerstvý špenát","hrsť (50 g)"],["Maslo","5 g"],["Soľ, čierne korenie",""]],
    steps:["Slaninu opeč na suchej panvici do chrumkava, vyber ju.","Na vypustenom tuku zavädni špenát, 30 sekúnd.","Prilej rozšľahané vajcia, stiahni plameň na stredný.","Keď spodok stuhne, vráť slaninu, prelož napoly a dopeč."],
    tip:"<b>Nepreháňaj to s teplotou.</b> Omeleta na miernom ohni ostane vláčna; na prudkom vyschne a je z nej guma."
  },
  {
    name:"Šakšuka bez chleba",
    time:"15 min", tags:["Vaječné"],
    kcal:450, p:25, f:33, c:9,
    ing:[["Vajcia","3 ks"],["Pasírované paradajky","150 g"],["Feta alebo balkánsky syr","30 g"],["Olivový olej","1 lyžica"],["Cesnak","1 strúčik"],["Mletá paprika, rasca",""]],
    steps:["Na oleji orestuj cesnak s paprikou a rascou, 30 sekúnd.","Prilej paradajky, osoľ, nechaj 5 minút prebublávať a zhustnúť.","Urob tri jamky, do každej rozklepni vajce.","Prikry pokrievkou a duste 5–6 minút, kým bielok stuhne a žĺtok ostane tekutý. Posyp fetou."],
    tip:"<b>Toto je horná hranica sacharidov v zásobníku.</b> Paradajky sú za väčšinu z tých 9 g — preto sa nedopĺňa chlebom ani pečivom."
  },
  {
    name:"Miešané vajcia s údeným lososom",
    time:"8 min", tags:["Vaječné"],
    kcal:470, p:29, f:36, c:3,
    ing:[["Vajcia","3 ks"],["Údený losos","50 g"],["Avokádo","pol (70 g)"],["Maslo","5 g"],["Kôpor, citrón",""]],
    steps:["Vajcia rozšľahaj so štipkou soli.","Na masle ich miešaj na miernom ohni, ťahaj stierkou od kraja do stredu.","Stiahni z ohňa ešte mierne tekuté — dohotovia sa zvyškovým teplom.","Na tanier pridaj plátky lososa, avokádo, kvapku citróna a kôpor."],
    tip:"<b>Losos sa nevarí.</b> Pridáva sa až na tanier — teplom by stuhol a stratil chuť."
  },
  {
    name:"Vaječné muffiny na celý týždeň",
    time:"25 min pečenie · 1 min ráno", tags:["Vaječné","Meal prep","Do 5 minút"],
    kcal:330, p:31, f:20, c:2,
    ing:[["Vajcia","8 ks"],["Kvalitná šunka, kocky","100 g"],["Eidam, nastrúhaný","80 g"],["Špenát alebo paprika","100 g"],["Soľ, korenie",""]],
    steps:["Rúru na 180 °C. Vajcia rozšľahaj, osoľ.","Vmiešaj šunku, syr a nasekanú zeleninu.","Rozlej do 12 vymastených formičiek na muffiny.","Peč 20–22 minút. Vydržia v chladničke 4 dni."],
    tip:"<b>Porcia sú 4 kusy.</b> Ráno ich stačí 30 sekúnd zohriať alebo zjesť studené cestou z domu."
  },
  {
    name:"Mleté hovädzie s hubami a vajcom",
    time:"12 min", tags:["Vaječné"],
    kcal:390, p:33, f:25, c:2,
    ing:[["Mleté hovädzie (10 % tuku)","100 g"],["Vajcia","2 ks"],["Šampiňóny","80 g"],["Maslo","5 g"],["Soľ, korenie, majoránka",""]],
    steps:["Mäso opeč na panvici dohneda, rozobrať vidličkou, 5 minút.","Pridaj nakrájané huby, restuj kým sa neodparí voda.","Odsuň na okraj panvice, na voľné miesto rozklepni vajcia.","Dopeč podľa chuti — na volské oko alebo zamiešaj do mäsa."],
    tip:"<b>Zvyšok z večere funguje ešte lepšie.</b> Ostalo mleté mäso alebo kúsok steaku? Ráno stačí ohriať a pridať vajce."
  },
  {
    name:"Tvaroh s vlašskými orechmi a škoricou",
    time:"3 min", tags:["Bez varenia","Do 5 minút","Vysoký proteín"],
    kcal:405, p:35, f:24, c:9,
    ing:[["Polotučný tvaroh","200 g"],["Vlašské orechy","30 g"],["Maliny (aj mrazené)","40 g"],["Mletá škorica",""]],
    steps:["Tvaroh daj do misky a rozmiešaj vidličkou, aby zvláčnel.","Posyp nasekanými orechmi a škoricou.","Pridaj maliny. Mrazené stačí nechať 10 minút pustiť šťavu."],
    tip:"<b>35 g bielkovín bez zapnutia sporáka.</b> Najsilnejší pomer proteínu k času z celého zoznamu."
  },
  {
    name:"Grécky jogurt s chia a mandľami",
    time:"3 min", tags:["Bez varenia","Do 5 minút"],
    kcal:335, p:25, f:20, c:9,
    ing:[["Grécky jogurt (2 % tuku)","200 g"],["Chia semienka","20 g"],["Mandle, nasekané","20 g"],["Vanilka alebo škorica",""]],
    steps:["Do jogurtu vmiešaj chia semienka.","Nechaj stáť 5 minút, kým napučia a zhustnú.","Posyp mandľami."],
    tip:"<b>Kontroluj etiketu.</b> „Grécky typ“ býva riedený a má polovicu bielkovín — hľadaj aspoň 8–10 g na 100 g."
  },
  {
    name:"Chia-proteínová kaša bez ovsa",
    time:"5 min večer", tags:["Bez varenia","Meal prep","Do 5 minút"],
    kcal:350, p:26, f:19, c:4,
    ing:[["Chia semienka","25 g"],["Nesladené mandľové mlieko","200 ml"],["Srvátkový proteín","25 g"],["Strúhaný kokos","15 g"]],
    steps:["Večer zmiešaj v pohári chia, mlieko a proteín.","Zamiešaj ešte raz po piatich minútach, nech sa nezhlukne.","Nechaj cez noc v chladničke.","Ráno posyp kokosom."],
    tip:"<b>Náhrada za ovsenú kašu.</b> Rovnaká konzistencia aj rituál, ale namiesto 50 g sacharidov sú tu 4."
  },
  {
    name:"Kuracie prsia s vajcom a avokádom",
    time:"10 min", tags:["Vysoký proteín"],
    kcal:465, p:51, f:25, c:2,
    ing:[["Kuracie prsia, predvarené","120 g"],["Vajcia","2 ks"],["Avokádo","pol (70 g)"],["Olivový olej","1 lyžička"],["Limetka, soľ, čili",""]],
    steps:["Kura nakrájaj na plátky a krátko ogriluj na panvici, len na zohriatie.","Vedľa usmaž dve volské oká.","Avokádo pokrájaj, pokvapkaj limetkou, osoľ."],
    tip:"<b>Kura sa pripravuje s večerou.</b> Uvar alebo opeč o jedno prso viac a ráno je z toho 51 g bielkovín za desať minút."
  },
  {
    name:"Tuniakový šalát s vajcom",
    time:"10 min", tags:["Bez varenia","Vysoký proteín"],
    kcal:450, p:39, f:32, c:4,
    ing:[["Tuniak vo vlastnej šťave","1 konzerva (100 g)"],["Vajcia natvrdo","2 ks"],["Uhorka","50 g"],["Cherry paradajky","50 g"],["Olivový olej","1 lyžica"],["Majonéza","1 lyžička"]],
    steps:["Tuniaka dobre odkvapkaj.","Vajcia nakrájaj na štvrtky, zeleninu na kocky.","Všetko zmiešaj s olejom a majonézou, osoľ, okorením."],
    tip:"<b>Vajcia uvar dopredu.</b> Šesť kusov natvrdo v nedeľu pokryje polovicu týždňa a skráti túto raňajku na tri minúty."
  },
  {
    name:"Bryndzová nátierka na uhorke",
    time:"8 min", tags:["Bez varenia"],
    kcal:350, p:24, f:25, c:4,
    ing:[["Bryndza","60 g"],["Vajcia natvrdo","2 ks"],["Kyslá smotana","20 g"],["Jarná cibuľka",""],["Uhorka, na plátky","pol"]],
    steps:["Vajcia postrúhaj alebo pomliaž vidličkou.","Zmiešaj s bryndzou a smotanou do hladkej nátierky.","Vmiešaj nasekanú cibuľku.","Namaž na hrubšie plátky uhorky namiesto chleba."],
    tip:"<b>Uhorka nahradí chlieb aj funkčne.</b> Nakrájaj ju nahrubo, tenké plátky sa pod nátierkou zlomia."
  },
  {
    name:"Caprese s prosciuttom",
    time:"5 min", tags:["Bez varenia","Do 5 minút"],
    kcal:490, p:34, f:38, c:3,
    ing:[["Mozzarella","80 g"],["Prosciutto alebo šunka od kosti","60 g"],["Paradajky","80 g"],["Olivový olej","1 lyžica"],["Bazalka, hrubá soľ",""]],
    steps:["Mozzarellu a paradajky nakrájaj na plátky, poukladaj striedavo.","Navrch voľne poskladaj prosciutto.","Pokvapkaj olejom, posyp soľou a bazalkou."],
    tip:"<b>Nula varenia, nula riadu.</b> Ideálne na ráno, keď treba vyraziť z domu do desiatich minút."
  },
  {
    name:"Avokádovo-proteínové smoothie",
    time:"3 min", tags:["Bez varenia","Do 5 minút"],
    kcal:350, p:30, f:21, c:5,
    ing:[["Srvátkový proteín","30 g"],["Avokádo","pol (70 g)"],["Nesladené mandľové mlieko","200 ml"],["Arašidové maslo (100 %)","15 g"],["Ľad, štipka soli",""]],
    steps:["Všetko hoď do mixéra.","Mixuj 30 sekúnd do hladka.","Ak je príliš hustý, dolej trochu vody."],
    tip:"<b>Jediná tekutá raňajka tu — a aj tá zasýti len vďaka tuku.</b> Ovocné smoothie by na jej mieste bolo 40 g cukru."
  },
  {
    name:"Vajcia natvrdo so syrom",
    time:"10 min · alebo 1 min z chladničky", tags:["3 suroviny","Vaječné","Meal prep"],
    kcal:346, p:30, f:23, c:2,
    ing:[["Vajcia","3 ks"],["Eidam alebo gouda","40 g"],["Soľ, čierne korenie",""]],
    steps:["Vajcia vlož do vriacej vody a var 8 minút.","Prelej studenou vodou, olúp.","Nakrájaj na polovice, pridaj kocky syra, osoľ."],
    tip:"<b>Uvar rovno šesť kusov.</b> V chladničke vydržia týždeň a ráno je z toho raňajka za minútu."
  },
  {
    name:"Praženica so syrom",
    time:"5 min", tags:["3 suroviny","Vaječné","Do 5 minút"],
    kcal:383, p:30, f:27, c:2,
    ing:[["Vajcia","3 ks"],["Strúhaný syr","40 g"],["Maslo","5 g"]],
    steps:["Vajcia rozšľahaj vidličkou priamo v miske, osoľ.","Na rozohriatom masle ich miešaj na miernom ohni.","Keď sú takmer hotové, vsyp syr a ešte raz premiešaj."],
    tip:"<b>Syr až na záver.</b> Pridaný na začiatku sa pripáli na panvici namiesto toho, aby sa roztiahol vo vajciach."
  },
  {
    name:"Skyr s vlašskými orechmi",
    time:"1 min", tags:["3 suroviny","Bez varenia","Do 5 minút"],
    kcal:289, p:26, f:16, c:8,
    ing:[["Skyr, nesladený","200 g"],["Vlašské orechy","25 g"],["Škorica",""]],
    steps:["Skyr vyklop do misky.","Nadrob orechy, posyp škoricou."],
    tip:"<b>Najnižšie kalórie v zozname pri 26 g bielkovín.</b> Dobrá voľba v deň, keď bude obed aj večera výdatnejšia."
  },
  {
    name:"Šunkovo-syrové rolky",
    time:"3 min", tags:["3 suroviny","Bez varenia","Do 5 minút"],
    kcal:330, p:32, f:21, c:2,
    ing:[["Kvalitná šunka, plátky","80 g"],["Eidam, plátky","60 g"],["Maslo","10 g"]],
    steps:["Plátok šunky natri tenkou vrstvou masla.","Polož naň plátok syra a zroluj.","Zopakuj, kým máš suroviny."],
    tip:"<b>Zvládneš to postojačky pri chladničke.</b> Pozri však zloženie šunky — chceš aspoň 90 % mäsa, lacné majú škrob a cukor."
  },
  {
    name:"Volské oká s avokádom",
    time:"6 min", tags:["3 suroviny","Vaječné","Do 5 minút"],
    kcal:383, p:20, f:31, c:2,
    ing:[["Vajcia","3 ks"],["Avokádo","pol (70 g)"],["Maslo","5 g"],["Hrubá soľ",""]],
    steps:["Na masle usmaž tri volské oká na miernom ohni, 4 minúty.","Avokádo vyber lyžicou a nakrájaj na plátky.","Posyp hrubou soľou."],
    tip:"<b>Prikry pokrievkou.</b> Bielok stuhne aj navrchu a nemusíš vajcia obracať — žĺtok ostane tekutý."
  },
  {
    name:"Tuniak rovno z konzervy",
    time:"2 min", tags:["3 suroviny","Bez varenia","Do 5 minút"],
    kcal:216, p:26, f:12, c:0,
    ing:[["Tuniak vo vlastnej šťave","1 konzerva (100 g)"],["Majonéza","1 lyžica"],["Citrón, čierne korenie",""]],
    steps:["Tuniaka odkvapkaj a vyklop do misky.","Vmiešaj majonézu, pokvapkaj citrónom, okorením."],
    tip:"<b>Najlenivejšia raňajka tu.</b> Ak má zasýtiť do obeda, pridaj dve vajcia natvrdo — vyskočí to na 430 kcal a 39 g bielkovín."
  },
  {
    name:"Cottage s paradajkami",
    time:"2 min", tags:["3 suroviny","Bez varenia","Do 5 minút"],
    kcal:304, p:24, f:18, c:9,
    ing:[["Cottage cheese","200 g"],["Cherry paradajky","100 g"],["Olivový olej","1 lyžica"],["Soľ, bazalka",""]],
    steps:["Cottage daj do misky.","Paradajky prekroj na polovice a pridaj.","Pokvapkaj olejom, osoľ, posyp bazalkou."],
    tip:"<b>Olej tu nie je ozdoba.</b> Bez neho je to jedlo takmer bez tuku a hlad príde o hodinu skôr."
  },
  {
    name:"Zapekané vajíčka so špenátom a fetou",
    time:"10 min práce · 15 min v rúre", tags:["Vaječné","Meal prep"],
    kcal:293, p:21, f:20, c:7,
    ing:[["Vajcia","4 ks"],["Baby špenát","100 g"],["Feta syr","50 g"],["Cream cheese light","30 g"],["Mlieko","50 ml"],["Cibuľa, cesnak","1 malá + 1 strúčik"],["Olivový olej","1 lyžička"]],
    steps:["Na oleji orestuj nakrájanú cibuľu, potom pridaj cesnak a špenát.","Miešaj, kým sa neodparí voda z listov.","Vmiešaj fetu, cream cheese, mlieko a rozšľahané vajcia.","Rozdeľ do dvoch zapekacích misiek a peč 15 minút pri 180 °C."],
    tip:"<b>Recept je na dve porcie — druhú si nechaj na zajtra.</b> Z chladničky ju ráno stačí zohriať a máš raňajku za dve minúty.",
    src:{name:"fitrecepty.sk", url:"https://www.fitrecepty.sk/recept/zapekane-vajicka-so-spenatom-a-feta-syrom"}
  },
  {
    name:"Čokoládový puding z jogurtu",
    time:"3 min", tags:["Bez varenia","Do 5 minút","Vysoký proteín"],
    kcal:330, p:42, f:14, c:10,
    ing:[["Grécky jogurt (2 % tuku)","200 g"],["Srvátkový proteín","25 g"],["Kakao, nesladené","2 čl (6 g)"],["Mandľové alebo arašidové maslo","15 g"],["Štipka soli",""]],
    steps:["Všetko daj do misky alebo mixéra.","Miešaj, kým sa kakao úplne rozpustí a nezostanú hrudky.","Ak je príliš hustý, dolej lyžicu vody."],
    tip:"<b>Toto je odpoveď na rannú chuť na sladké.</b> Oproti pôvodnému receptu je tu viac proteínu a orechové maslo namiesto ovocia — inak by to bolo 170 kcal a o hodinu hlad.",
    src:{name:"fitrecepty.sk", url:"https://www.fitrecepty.sk/recept/rychly-coko-puding-z-jogurtu"}
  },
  {
    name:"Tvarohovo-cesnaková nátierka",
    time:"8 min", tags:["Bez varenia"],
    kcal:365, p:27, f:23, c:10,
    ing:[["Polotučný tvaroh","150 g"],["Vlašské orechy, pomleté","25 g"],["Kyslá smotana","20 g"],["Cesnak","2 strúčiky"],["Pažítka, soľ, korenie",""],["Uhorka alebo paprika","80 g"]],
    steps:["Tvaroh rozmiešaj so smotanou do hladka.","Vmiešaj pomleté orechy a prelisovaný cesnak.","Osoľ, okorením, posyp pažítkou.","Natri na hrubšie plátky uhorky alebo prúžky papriky."],
    tip:"<b>Pôvodný recept ju podáva s celozrnným pečivom — to je práve to, čo tu vynechávame.</b> Na uhorke má rovnakú chuť a o 25 g sacharidov menej.",
    src:{name:"fitrecepty.sk", url:"https://www.fitrecepty.sk/recept/fit-tvarohovo-cesnakova-natierka"}
  },
  {
    name:"Tuniakový chlebík (sendvič bez múky)",
    time:"20 min · vydrží 3 dni", tags:["Meal prep","Vysoký proteín"],
    kcal:430, p:44, f:26, c:4,
    ing:[["Tuniak vo vlastnej šťave","120 g"],["Vajce","1 ks"],["Mandľová múka","20 g"],["Cream cheese na natretie","30 g"],["Uhorka","50 g"],["Cesnakové korenie, paprika, soľ",""]],
    steps:["Tuniaka odkvapkaj a rozmiešaj s vajcom, mandľovou múkou a koreninami.","Zmes rozotri na papier na pečenie do obdĺžnika hrubého asi pol centimetra.","Peč 12–15 minút pri 180 °C dozlatista, nechaj vychladnúť.","Rozkroj na polovice, natri cream cheese, vlož plátky uhorky a zlož ako sendvič."],
    tip:"<b>Celozrnnú múku z pôvodného receptu som nahradil mandľovou.</b> Chlebík sa správa rovnako, ale zo 16 g sacharidov ostali 4 — a bielkoviny vyskočili na 44 g.",
    src:{name:"fitrecepty.sk", url:"https://www.fitrecepty.sk/recept/sendvic-z-tuniaka"}
  }
];

// ---------- údaje viazané na poradie receptov vyššie ----------
// názvy súborov s fotkami (img/<nazov>.jpg)
const FOTO = [
  "omeleta-slanina","saksuka","losos-vajcia","vajecne-muffiny","hovadzie-huby",
  "tvaroh-orechy","jogurt-chia","chia-kasa","kura-avokado","tuniakovy-salat",
  "bryndzova-natierka","caprese","smoothie","vajcia-natvrdo-syr","prazenica-syr",
  "skyr-orechy","sunkove-rolky","volske-oka-avokado","tuniak-konzerva","cottage-paradajky",
  "zapekane-vajcia-feta","coko-puding","tvarohova-natierka","tuniakovy-chlebik"
];

// čas prípravy v minútach — používa sa na zoradenie
const MINS = [10,15,8,25,12,3,3,5,10,10,8,5,3,10,5,1,3,6,2,2,25,3,8,20];

// hlavné suroviny — soľ, korenie, olej a maslo sa predpokladajú doma
const HAS = [
  ["vajcia","maso","zelenina"],
  ["vajcia","zelenina","syr"],
  ["vajcia","ryby","avokado"],
  ["vajcia","maso","syr","zelenina"],
  ["vajcia","maso","zelenina"],
  ["mliecne","orechy"],
  ["mliecne","orechy"],
  ["orechy","protein"],
  ["maso","vajcia","avokado"],
  ["ryby","vajcia","zelenina"],
  ["mliecne","vajcia","zelenina"],
  ["syr","maso","zelenina"],
  ["protein","avokado","orechy"],
  ["vajcia","syr"],
  ["vajcia","syr"],
  ["mliecne","orechy"],
  ["maso","syr"],
  ["vajcia","avokado"],
  ["ryby"],
  ["mliecne","zelenina"],
  ["vajcia","syr","mliecne","zelenina"],
  ["mliecne","protein","orechy"],
  ["mliecne","orechy","zelenina"],
  ["ryby","vajcia","orechy","syr","zelenina"]
];

const ING = [
  ["vajcia","Vajcia"],["mliecne","Tvaroh a jogurt"],["syr","Syr"],["maso","Mäso a šunka"],
  ["ryby","Tuniak a losos"],["zelenina","Zelenina"],["orechy","Orechy a semienka"],
  ["avokado","Avokádo"],["protein","Proteín"]
];
const TAGS = ["Všetko","3 suroviny","Do 5 minút","Vaječné","Bez varenia","Meal prep","Vysoký proteín"];
const MESIACE = ["Január","Február","Marec","Apríl","Máj","Jún","Júl","August","September","Október","November","December"];
const DNI = ["Po","Ut","St","Št","Pi","So","Ne"];
