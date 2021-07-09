/* 
Sklik connector for Google Data Studio
Copyright (C) 2018 Seznam.cz, a.s.

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.
This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public
License along with this library; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA

Seznam.cz, a.s.
Radlická 3294/10, Praha 5, 15000, Czech Republic
http://www.seznam.cz, or contact: https://napoveda.sklik.cz/casto-kladene-dotazy/kontaktni-formular/
*/

/**
 * Returns the user configurable options for the connector.
 * @param {Object} request A JavaScript object containing the config request parameters.
 * @link https://developers.google.com/datastudio/connector/reference#getconfig
 */
function getConfig(request) {
  var config = {
    configParams: [
       
      {
        type: "TEXTINPUT",
        name: "token",
        displayName: 'Token',
        text: "Vyplňte prosím váš token(API klíč)",
        helpText: "Token lze získat v nazstavaní Skliku (Vpravo nahoře kliknout na váš email -> Nastavení -> Získat přístup k API)",
        placeholder: ""
      },
      {
        type: "TEXTINPUT",
        name: "userId",
        displayName: "UserId",
        text: "Vyplňte prosím ID účtu, který chcete sledovat: Svoje id zjistíš zde: https://bit.ly/2uMuKgL",
        helpText: "Každý účet má svoje userId, tohle id lze zjistit pomocí malé utilitky: https://bit.ly/2uMuKgL",
        placeholder: ""
      },
      {
        type: "CHECKBOX",
        name: "allowEmptyStatistics",
        displayName: "Zahrnout entity bez statistik",
        text: "V přehledech zobrazovat i entity (kampaně, sestavy, ...) které nemají žádné zobrazení a další statistiky",
      },
      {
        type: "SELECT_MULTIPLE",
        name: "campaignsTypes",
        displayName: "Výběr typů kampaní",
        helpText: "Statistiky pro entinty - kampaň, sestava, reklama, klíčové slova budou brané jenom z kampění spadající do vybraných typů.",
        options: [
          {
            label: "Kombinovaná",
            value: "combined"
          },
          {
            label: "Videokampaň",
            value: "video"
          },
          {
            label: "Obsahová",
            value: "context"
          },
          {
            label: "Vyhledávací",
            value: "fulltext"
          },
          {
            label: "Produktová",
            value: "product"
          },
          {
            label: "Zboží.cz",
            value: "zbozi"
          }
        ]
      },
      {
        type: "INFO",
        name: "info_campaigns",
        text: "Je možné sledovat více kampaní. Ale metriky jsou omeze limitem 5000 záznamů. Nezle tedy zobrazit například více jak [počet kampaní * počet dní > 5000] a podobně"
      },
      {
        type: "TEXTINPUT",
        name: "campaignsId",
        displayName: "ID kampaní",
        text: "Vyplňte ID všech kampaní, které chcete sledovat",
        helpText: "Načtou se data pouze pro tyto kampaně. Oddělujte prosím čárkou",
        placeholder: ","
      },
      {
        type: "INFO",
        name: "info_groups",
        text: "Je možné sledovat konkrétní sestavy. Pokud nebudou vyplněny, načte systém ke sledování sestav,reklam, bannerů dle uvedených id kampaní nebo celého účtu, pokud nebude vyplněno žádné ID kampaně. Ale metriky jsou omeze limitem 5000 záznamů. Nezle tedy zobrazit například více jak [počet sestav * počet dní > 5000] a podobně"
      },
      {
        type: "TEXTINPUT",
        name: "groupsId",
        displayName: "ID sestav",
        text: "Vyplňte ID všech sestav, které chcete sledovat",
        helpText: "Zobrazí se souhrn všech sestav. Oddělujte prosím čárkou",
        placeholder: ","
      },
      {
        type: "INFO",
        name: "info_keywords",
        text: "Konektor omezuje počet klíčových slov na 15 000 a protože mohou existovat účty, který tuto hranici překračují, je třeba specifikovat konkrétní kampaně na které to bude redukované. Tato redukce může být udělaná i pro lepší přehlednost - pokud chcete sledovat jenom uričté kampaně."
      },
      {
        type: "TEXTINPUT",
        name: "campaignsIdsForKeywords",
        displayName: "ID kampaní pro výběr klíčových slov",
        text: "Seznam kampaní, ze kterých se budou načítat přehledy klíčových slov",
        helpText: "Oddělujte prosím čárkou",
        placeholder: ","
      },
      {
        type: "CHECKBOX",
        name: "logmode",
        displayName: "Zapnout logování",
        text: "Při každém načtení dat loguje akce konektoru (případě místo chyby konektoru)",
      },
      {
        type: "TEXTINPUT",
        name: "logFileName",
        displayName: "Název logovacího souboru",
        text: "Na vašem Google Drive disku se vytvoří soubor, do kterého se budou logovat mezistavy konektoru.",
        helpText: "Soubor bude umístěn v root složce disku",
        placeholder: "Sklik_DataStudio_Log"
      },
      {
        type: "TEXTINPUT",
        name: "logFolderId",
        displayName: "ID složky pro logovací soubory",
        text: "Logovací soubor se vytváří do výchozí složky na Google Drive. Pokud tuto pozici chcete změnit, zadejte prosím ID složky",
        helpText: "ID složky najdete v URL - https://drive.google.com/drive/folders/1kMOLdsdfsdfsd tedy řetězec za folders/"
      },
      {
        type: "CHECKBOX",
        name: "debugmode",
        displayName: "Zapnout rozšířené logování",
        text: "Ukazuje podrobné stavy konektoru (dotazy a odpovědi z API, požadované sloupce atd...)"
      }
    ],
    "dateRangeRequired": true
  };
  return config;
}