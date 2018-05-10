# Sklik data studio connector
This connector imports Sklik reports, through Sklik API DRAK JSON, into Google Data Studio, a graphical display platform. 

# Version
Actual version: 1.0.1 

# Changelog
10.5.2018 (1.0.0 -> 1.0.1)
* [REMOVE] Odstranění sloupečku plaType z kampaní
* [REMOVE] Odstranění kontrolních dumpů v logu pro periodické zobrazení (testamentAA, testament)
* [FIX] Oprava bugu v periodickém zobrazení, který při nastavení rozsahu datumu i do budoucna (this year apod.) ukazoval chybná data poslední nenulové položky.

# Setup own data studio connector
This connector is based on Google Apps Script. 
Tutorial how get your own connector: https://developers.google.com/datastudio/connector/get-started

# Nastavení konektoru
Sklik Data studio connector
Automatické spojení statistických reportů z reklamního systému Sklik do grafické platformy Google Data studio, které je určeno k vizualizaci dat pro lepší přehled a orientaci.

Aktuální verze
Sklik Data Studio Connector v1.0.1 ID
AKfycby4g6dLeh2W4x6J7q58As5-CNzCZckg6wX5woe7Pas

**Připojení konektoru**

V GDS (Google Data studio) se přepnete na Zdroje dat a v pravém spodním rohu dáte přidat další konektor. 
![](https://github.com/ChocoTUx/readmetester/blob/master/doc/01.JPG)

Budete přesměrování na stránku se seznamem veřejných konektorů. Jelikož náš konektor ještě není plně přístupný, musíte přístup k němu zadat pomoci ID. V levém sloupci dole se přepnete na Vývojáři, vyplníte Deployment ID (ID najdete v předchozí části návodu) a dáte Ověřit. 
Následně se vám načte konektor (načte se nový banner s názvem konektoru, popisem). Konektor přidáte pomocí tlačítka Přidat konektor.
![](https://github.com/ChocoTUx/readmetester/blob/master/doc/02.JPG)

Pokud přidáváte konektor poprvé, musíte si projít sérií bezpečnostních schvalován (jelikož se jedná o konektor, který není oficiálně schválený Googlem – jejich vývojáři nezkontrolovali bezpečnost kódu). 
Ve vyskakovacím okně (pokud se nezobrazí, zkuste kontrolovat, že nemáte zablokované vyskakovací okna v prohlížeči nebo není okno zobrazené na pozadí) a kliknete na Autorizovat. Následně vybere účet pro který chcete konektor povolit. V dalším kroku kliknete na Advanced, pod kterým vyskočí další informační hláška pod kterou kliknete na Go to Sklik GDS (unsafe). Poslední informační okno rekapituluje všechny práva vůči vašemu účtu, který konektor vyžaduje.
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
Vývojářský mód: Zobrazuje konkrétní API dotazy a odpovědi, požadované sloupce od GDS a další užitečné informace k přesnému detekování chyb.
 
