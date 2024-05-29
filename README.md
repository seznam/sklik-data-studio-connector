# Sklik data studio connector
This connector imports Sklik reports, through Sklik API DRAK JSON, into Google Looker Studio, a graphical display platform. 

# Version
Actual version: 4.1.0

# Changelog
28.05.2024 (4.0.1 -> 4.1.0) 

* [ADD] RPřidání JOK kampaně do výběru v configu
* [FIX] Rozpad na kvartální statistiky
* [FIX] Oprava načítání klíčových slov s omezením na kampaně
* [FIX] Opravení defaultního načítání metrik a dimenzí (načítá se název kampaně a počet zobrazení)
* [CAHNGE] Defaultní název logovacího souboru na Sklik_Looker_Connector_Log
* [CAHNGE] Předělání logování. Strukturovaný log a lepší práce s JSON strukturami

04.03.2024 (4.0.0 -> 4.0.1) 

*[ADD] Přidání typu kampaně do výpisu

07.02.2022 (3.1.0 -> 4.0.0)

* [ADD] Přidání statistiky pro produktové skupiny
* [ADD] Přidání video statistik
* [ADD] Přidání možnosti přepisu proměnných z configu
* [CHANGE] Přechod u ads, banners, groups, campaigns na jednotné metody -> změna hlavně u granularit
* [FIX] Schování tokenu v logu, oprava některých nefunkčních metrik 

09.07.2021 (3.0.0 -> 3.1.0)

* [ADD] Přidání filtru na typ kampaní
* [ADD] Možnost přepisování konfigurací [viz Wiki:Přepis nastavení u tabulek]
* [ADD] Přidání možnosti změny logovacího souboru
* [FIX] Oprava logovacího souboru (ignorování smazaných)

10.12.2019 (2.1.0 -> 3.0.0)
* [REMOVE] Odstranění maxCpcContext ze schématu nabízených metrik
* [FIX] Oprava nenačítání grafů u sestav, které mají více jak jednu dimenzi

30.9.2019 (2.0.1 -> 2.1.0)
* [ADD] Přidání přepočet z heléřu na Kč v metrikách pro Keywords a Client 

09.8.2019 (2.0.0 -> 2.0.1)
* [FIX] Duplicita sloupců (Kampaň: Prokliky).

12.7.2019 (1.1.0 -> 2.0.0)
* [ADD] Přidání metriky pro klíčové slova a celého účtu
* [ADD] Rozšíření logování do logovacího souboru
* [FIX] Úprava API volání na stabilnější verzi
* [CHANGE] Úprava zobrazování boolenovských, null a některých datumových hodnot
* [CHANGE] Oprava názvů u sloupečků

14.6.2018 (1.0.1 -> 1.1.0)
* [CHANGE] Změna defaultního nastavení některých metrik: 
Kampaně: PNO (Cost Of Sale(COS)),(Kč) Peníze utracené za prokliky, (Kč) Průměrná cena za klik (Avg CPC), (Kč) Nastaveni budgetu, Celkem utracené peníze, (Kč) Celkvý budget, (Kč) Penize za zobrazení, CTR, Průměrná pozice 
Inzerát: Průměrné CPC, PNO (Cost Of Sale(COS)), (Kč) Celkem utracené peníze, (Kč) Cena prokliků, (Kč) Cena za zobrazeni, (Kč) Cena konverzí, CTR, Průměrná pozice
Sestava: Průměrné CPC, PNO (Cost Of Sale(COS)), Celkem utracené peníze, (Kč) Cena za zobrazeni, (Kč) Cena konverzí, (Kč) Cena prokliků, CTR, Maximální CPT, Průměrná pozice
Bannery: Průměrné CPC, PNO (Cost Of Sale(COS)), (Kč) Cena za zobrazeni, (Kč) Cena prokliků, (Kč) Celkem utracené peníze, (Kč) Cena konverzí, CTR, Průměrná pozice
* [FIX] Opravena chyba při výpadu časových řad (data pro určité období se zobrazovli jako nulové)


10.5.2018 (1.0.0 -> 1.0.1)
* [REMOVE] Odstranění sloupečku plaType z kampaní
* [REMOVE] Odstranění kontrolních dumpů v logu pro periodické zobrazení (testamentAA, testament)
* [FIX] Oprava bugu v periodickém zobrazení, který při nastavení rozsahu datumu i do budoucna (this year apod.) ukazoval chybná data poslední nenulové položky.

# Setup own looker studio connector
This connector is based on Google Apps Script. 
Tutorial how get your own connector: https://developers.google.com/datastudio/connector/get-started

# Nastavení konektoru
Sklik Looker studio connector
Automatické spojení statistických reportů z reklamního systému Sklik do grafické platformy Google Looker studio, které je určeno k vizualizaci dat pro lepší přehled a orientaci.

Aktuální verze
Sklik Looker Studio Connector v4.0.0 ID
AKfycbwYho46coR8ajdpHm76Q5J_x66fEZxG9q8ZgVpQsyb-HOFBmDVhHfBn6WQOQM87k-O8Dg

**Připojení konektoru**

V LS (Google Looker studio) se přepnete na Zdroje dat a v pravém spodním rohu dáte přidat další konektor. 
![](https://github.com/ChocoTUx/readmetester/blob/master/doc/01.JPG)

Budete přesměrování na stránku se seznamem veřejných konektorů. Jelikož náš konektor ještě není plně přístupný, musíte přístup k němu zadat pomoci ID. V levém sloupci dole se přepnete na Vývojáři, vyplníte Deployment ID (ID najdete v předchozí části návodu) a dáte Ověřit. 
Následně se vám načte konektor (načte se nový banner s názvem konektoru, popisem). Konektor přidáte pomocí tlačítka Přidat konektor.
![](https://github.com/ChocoTUx/readmetester/blob/master/doc/02.JPG)

Pokud přidáváte konektor poprvé, musíte si projít sérií bezpečnostních schvalován (jelikož se jedná o konektor, který není oficiálně schválený Googlem – jejich vývojáři nezkontrolovali bezpečnost kódu). 
Ve vyskakovacím okně (pokud se nezobrazí, zkuste kontrolovat, že nemáte zablokované vyskakovací okna v prohlížeči nebo není okno zobrazené na pozadí) a kliknete na Autorizovat. Následně vybere účet pro který chcete konektor povolit. V dalším kroku kliknete na Advanced, pod kterým vyskočí další informační hláška pod kterou kliknete na Go to Sklik LS (unsafe). Poslední informační okno rekapituluje všechny práva vůči vašemu účtu, který konektor vyžaduje.
1. Přístup na Google Drive + Zobrazování a práci s dokumenty: Toto je nutné pro zapnutí Logování (logování zapisuje do Google dokumentu stav posledního spojení. Pomocí jeho chybových hlášek můžete snadněji detekovat zdroj chyby). 
2. Přístup k externí service: Napojení na samotný Sklik API.
![](https://github.com/ChocoTUx/readmetester/blob/master/doc/03.JPG)
*Zdrojové kódy našeho konektoru jsou zveřejněny na GitHubu. Můžete si tedy vytvořit vlastní konektor a mít díky tomu práci těchto scriptů plně pod kontrolou.*

Posledním krokem je nastavení configu. Zde se zadávají všechny individuální nastavení potřebná pro fungování konektoru. Jakmile budou všechny informace vyplněny, stačí vpravo nahoře konektor Připojit.
![](https://github.com/ChocoTUx/readmetester/blob/master/doc/04.JPG)

**Nastavení configu**

Token: Konektor se na Sklik napojuje pomocí Sklik API. K autentizaci uživatele slouží Sklik Token (je možné ho získat v rozhraní Sklik v záložce nastavení)

UserId: Dalším povinným prvkem je id uživatele. Pokud svoje id neznáš, můžeš ho zjistit pomocí malé utilitky: https://bit.ly/2uMuKgL

ID kampaní: Aby se nenačítaly všechny data z celého účtu, je možné omezit přímo na některé kampaně. Je to také dáno proto, že je možné v jednom přehledu mít pouze 5000 záznamů, což u velkých účtů pro dlouhé denní statistiky může být problém.

ID sestav: Podobné omezení lze mít i pro sestavy. Pro přehledy sestav, reklam a bannerů systém vybírá jenom ty, které patří do daných sestav (pokud nejsou sestavy vyplněné, bere jenom ty, které patří do vybraných kampaní a pokud i ty nejsou nastavené, tak v rámci celého účtu).

Následují dvě nastavení, která jsou spojená s logování konektoru. Na vašem Drivu vznikne nový soubor s názvem: Sklik_DataStudio_Log. V něm se zachovává poslední načtený graf a pokud při načítání vznikne chyba, je možné z logu vyčíst proč k chybně došlo. 
Logování: Loguje pouze informativní hlášky. 
Vývojářský mód: Zobrazuje konkrétní API dotazy a odpovědi, požadované sloupce od LS a další užitečné informace k přesnému detekování chyb.
 
