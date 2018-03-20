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
 * Returns the schema for the given request. This provides the information about how the connector's data is organized.
 * For each field it includes details such as identifiers, names, data types, etc.
 * @param {Object} config - user config
 */
var Schema = function (config) {
  
    /**
     * @var {Object}
     */
    this.config = config;
  
    /**
    * Význam zkratek
    * cgc - column u kampaně (cg - campaigns + c - column)
    * cpg - jedna se o soucas prehledu kampani
    * cpd - jedna se o soucas dennich prehledu kampani
    * cpw, cpm, cpq, cpy - týdení, mesicni, kvartální a rocni
    * goc - column u groups
    * gos - groups
    * god - daily of groups
    * adc - column u ads (ad - ads + c - column)
    * bnc - column u bannerů (bn - banners + c - column)
    */
    this.SklikDataSchema = [
      //####################################### Campaigns
      {
        name: 'cpg_name',
        label: 'Název kampaně',
        dataType: 'STRING',
        group: 'campaigns',
        isDefault: true,
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'cgc_actualClicks',
        label: 'Kampaň: Aktulní kliky',
        dataType: 'NUMBER',
        group: 'campaigns',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'cgc_automaticLocation',
        label: 'Kampaň: Zapnutí automatické lokace',
        dataType: 'BOOLEAN',
        group: 'campaigns',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'cgc_adSelection',
        label: 'Kampaň: Reklamní metody',
        dataType: 'STRING',
        group: 'campaigns',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'cgc_context',
        label: 'Kampaň: Jedná se o kontextovou kampaň',
        dataType: 'BOOLEAN',
        group: 'campaigns',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'cgc_contextNetwork',
        label: 'Kampaň: zaměření na kontextové sítě',
        dataType: 'BOOLEAN',
        group: 'campaigns',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'cgc_createDate',
        label: 'Kampaň: Datum vytvoření kampaně',
        dataType: 'STRING',
        group: 'campaigns',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'cgc_deleted',
        label: 'Kampaň: Samzaná',
        dataType: 'BOOLEAN',
        group: 'campaigns',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'cgc_deleteDate',
        label: 'Kampaň: Datum smazání',
        dataType: 'STRING',
        group: 'campaigns',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'cgc_defaultBudgetId',
        label: 'Kampaň: ID budgetu',
        dataType: 'NUMBER',
        group: 'campaigns',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'cgc_deviceDesktop',
        label: 'Kampaň: Cílení na desktopy',
        dataType: 'BOOLEAN',
        group: 'campaigns',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'cgc_deviceTablet',
        label: 'Kampaň: Cílení na tablety',
        dataType: 'BOOLEAN',
        group: 'campaigns',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'cgc_deviceMobil',
        label: 'Kampaň: Cílení na mobily',
        dataType: 'BOOLEAN',
        group: 'campaigns',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'cgc_deviceOther',
        label: 'Kampaň: Cílení na ostatní platformy',
        dataType: 'BOOLEAN',
        group: 'campaigns',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'cgc_endDate',
        label: 'Kampaň: Datum ukončení',
        dataType: 'STRING',
        group: 'campaigns',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'cgc_exhaustedTotalBudget',
        label: 'Kampaň: Nastaveni budgetu',
        dataType: 'NUMBER',
        group: 'campaigns',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'cgc_exhaustedTotalBudget_kc',
        label: 'Kampaň: (Kč) Nastaveni budgetu',
        dataType: 'NUMBER',
        group: 'campaigns',
        formula: 'cgc_exhaustedTotalBudget*0.01',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'cgc_fulltext',
        label: 'Kampaň: Fulltextova kampan',
        dataType: 'BOOLEAN',
        group: 'campaigns',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'cgc_name',
        label: 'Kampaň: Název kampaně',
        dataType: 'STRING',
        group: 'campaigns',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'cgc_paymentMethod',
        label: 'Kampaň: Způsob platby',
        dataType: 'STRING',
        group: 'campaigns',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'cgc_plaType',
        label: 'Kampaň: Typ PLA',
        dataType: 'STRING',
        group: 'campaigns',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'cgc_startDate',
        label: 'Kampaň: Spuštění kampaně',
        dataType: 'STRING',
        group: 'campaigns',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'cgc_status',
        label: 'Kampaň: Status',
        dataType: 'STRING',
        group: 'campaigns',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'cgc_totalCliks',
        label: 'Kampaň: Všechny kliky',
        dataType: 'NUMBER',
        group: 'campaigns',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'cgc_totalClicksFrom',
        label: 'Kampaň: Datum měření všech kliků',
        dataType: 'STRING',
        group: 'campaigns',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'cgc_contextNetworkId',
        label: 'Kampaň: ID kontextové sítě',
        dataType: 'NUMBER',
        group: 'campaigns',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'cgc_totalBudget',
        label: 'Kampaň: Celkvý budget',
        dataType: 'NUMBER',
        group: 'campaigns',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'cgc_totalBudget_kc',
        label: 'Kampaň: (Kč) Celkvý budget',
        dataType: 'NUMBER',
        group: 'campaigns',
        formula: 'cgc_totalBudget*0.01',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'cgc_avgCpc',
        label: 'Kampaň: Průměrná cena za klik (Avg CPC)',
        dataType: 'NUMBER',
        group: 'campaigns',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'cgc_avgCpc_kc',
        label: 'Kampaň: (Kč) Průměrná cena za klik (Avg CPC)',
        dataType: 'NUMBER',
        group: 'campaigns',
        formula: 'cgc_avgCpc*0.01',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'cgc_avgPos',
        label: 'Kampaň: Průměrná pozice ',
        dataType: 'NUMBER',
        group: 'campaigns',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'cgc_clickMoney',
        label: 'Kampaň: Peníze utracené za prokliky',
        dataType: 'NUMBER',
        group: 'campaigns',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'cgc_clickMoney_kc',
        label: 'Kampaň: (Kč) Peníze utracené za prokliky',
        dataType: 'NUMBER',
        formula: "cgc_clickMoney*0.01",
        group: 'campaigns',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'cgc_clicks',
        label: 'Kampaň: Počet prokliků',
        dataType: 'NUMBER',
        group: 'campaigns',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'cgc_conversions',
        label: 'Kampaň: Konverze',
        dataType: 'NUMBER',
        group: 'campaigns',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'cgc_conversionValue',
        label: 'Kampaň: Hodnota konverze',
        dataType: 'NUMBER',
        group: 'campaigns',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'cgc_impressionMoney',
        label: 'Kampaň: Penize za zobrazení',
        dataType: 'NUMBER',
        group: 'campaigns',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'cgc_impressionMoney_kc',
        label: 'Kampaň: (Kč) Penize za zobrazení',
        dataType: 'NUMBER',
        group: 'campaigns',
        formula: 'cgc_impressionMoney*0.01',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'cgc_impressions',
        label: 'Kampaň: Počet zobrazení',
        dataType: 'NUMBER',
        group: 'campaigns',
        isDefault: true,
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'cgc_totalMoney',
        label: 'Kampaň: Celkem utracené peníze',
        dataType: 'NUMBER',
        group: 'campaigns',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'cgc_totalMoney_kc',
        label: 'Kampaň: (Kč) Celkem utracené peníze',
        dataType: 'NUMBER',
        group: 'campaigns',
        formula: 'cgc_totalMoney*0.01',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'cgc_transactions',
        label: 'Kampaň: Počet transakcí',
        dataType: 'NUMBER',
        group: 'campaigns',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'cgc_missImpressions',
        label: 'Kampaň: Prošvihnuté zobrazení',
        dataType: 'NUMBER',
        group: 'campaigns',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'cgc_underLowerThreshold',
        label: 'Kampaň: Prošvihnuté zobrazení pro nízké cpc',
        dataType: 'NUMBER',
        group: 'campaigns',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'cgc_exhaustedBudget',
        label: 'Kampaň: Prošvihnuté zobrazní pro nízký budget',
        dataType: 'NUMBER',
        group: 'campaigns',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'cgc_stoppedBySchedule',
        label: 'Kampaň: Prošvihnuté zobrazní pro plánované zobrazení',
        dataType: 'NUMBER',
        group: 'campaigns',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'cgc_underForestThreshold',
        label: 'Kampaň: Prošvihnuté zobrazní pro nízkou relevanci',
        dataType: 'NUMBER',
        group: 'campaigns',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'cgc_exhaustedBudgetShare',
        label: 'Kampaň: Prošvihnuté zobrazní vyčerpání sdíleného rozpočtu',
        dataType: 'NUMBER',
        group: 'campaigns',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'cgc_ctr',
        label: 'Kampaň: CTR',
        dataType: 'NUMBER',
        group: 'campaigns',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'cgc_pno',
        label: 'Kampaň: PNO (Cost Of Sale(COS))',
        dataType: 'NUMBER',
        group: 'campaigns',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'cgc_ish',
        label: 'Kampaň: Procentuální prošvihnuté zobrazení ve vyhleávání',
        dataType: 'NUMBER',
        group: 'campaigns',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'cgc_ishContext',
        label: 'Kampaň: Procentuální prošvihnuté zobrazení v kontextu',
        dataType: 'NUMBER',
        group: 'campaigns',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'cgc_ishSum',
        label: 'Kampaň: Procentuální prošvihnuté zobrazení v obou',
        dataType: 'NUMBER',
        group: 'campaigns',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'cgc_id',
        label: 'Kampaň: Id kampaně',
        dataType: 'NUMBER',
        group: 'campaigns',
        semantics: {
          conceptType: 'METRIC'
        }
      },
  
  
      //####################################### Campaigns Daily 
      {
        name: 'cpd_days',
        label: 'Statistiky kampaně (denní)',
        dataType: 'STRING',
        group: 'campaignsDaily',
        semantics: {
          conceptType: 'DIMENSION',
          semanticType: 'YEAR_MONTH_DAY',
          semanticGroup: 'DATETIME'
        }
      },
      {
        name: 'cpd_campaignsIds',
        label: 'Campaigns Id',
        dataType: 'NUMBER',
        group: 'campaignsDaily',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      //####################################### Campaigns Weekly 
      {
        name: 'cpw_days',
        label: 'Statistiky kampaně (týdenní)',
        dataType: 'STRING',
        group: 'campaignsWeekly',
        semantics: {
          conceptType: 'DIMENSION',
          semanticType: 'YEAR_WEEK',
          semanticGroup: 'DATETIME'
        }
      },
      {
        name: 'cpw_campaignsIds',
        label: 'Campaigns Id',
        dataType: 'NUMBER',
        group: 'campaignsWeekly',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      //####################################### Campaigns Monthly 
      {
        name: 'cpm_days',
        label: 'Statistiky kampaně (měsíční)',
        dataType: 'STRING',
        group: 'campaignsMonthly',
        semantics: {
          conceptType: 'DIMENSION',
          semanticType: 'YEAR_MONTH_DAY',
          semanticGroup: 'DATETIME'
        }
      },
      {
        name: 'cpm_campaignsIds',
        label: 'Campaigns Id',
        dataType: 'NUMBER',
        group: 'campaignsMonthly',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      //####################################### Campaigns Quarterly 
      {
        name: 'cpq_days',
        label: 'Statistiky kampaně (kvartální)',
        dataType: 'STRING',
        group: 'campaignsQuarterly',
        semantics: {
          conceptType: 'DIMENSION',
          semanticType: 'YEAR_MONTH_DAY',
          semanticGroup: 'DATETIME'
        }
      },
      {
        name: 'cpq_campaignsIds',
        label: 'Campaigns Id',
        dataType: 'NUMBER',
        group: 'campaignsQuarterly',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      //####################################### Campaigns Yearly 
      {
        name: 'cpy_days',
        label: 'Statistiky kampaně (roční)',
        dataType: 'STRING',
        group: 'campaignsYearly',
        semantics: {
          conceptType: 'DIMENSION',
          semanticType: 'YEAR',
          semanticGroup: 'DATETIME'
        }
      },
      {
        name: 'cpy_campaignsIds',
        label: 'Campaigns Id',
        dataType: 'NUMBER',
        group: 'campaignsYearly',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      //####################################### Groups columns 
      {
        name: 'goc_createDate',
        label: 'Sestava: Datum vzniku sestavy',
        dataType: 'STRING',
        group: 'groups',
        semantics: {
          conceptType: 'DIMENSION'
        }
      }, {
        name: 'goc_deleted',
        label: 'Sestava: Je smazaná',
        dataType: 'BOOLEAN',
        group: 'groups',
        semantics: {
          conceptType: 'DIMENSION'
        }
      }, {
        name: 'goc_deleteDate',
        label: 'Sestava: Datum smazání',
        dataType: 'STRING',
        group: 'groups',
        semantics: {
          conceptType: 'DIMENSION'
        }
      }, {
        name: 'goc_id',
        label: 'Sestava: Id',
        dataType: 'NUMBER',
        group: 'groups',
        semantics: {
          conceptType: 'METRIC'
        }
      }, {
        name: 'goc_maxCpc',
        label: 'Sestava: Maximální CPC',
        dataType: 'NUMBER',
        group: 'groups',
        semantics: {
          conceptType: 'METRIC'
        }
      }, {
        name: 'goc_maxCpcContext',
        label: 'Sestava: Maximální CPC pro Context',
        dataType: 'NUMBER',
        group: 'groups',
        semantics: {
          conceptType: 'METRIC'
        }
      }, {
        name: 'goc_maxUserDailyImpressions',
        label: 'Sestava: Zobrazení jednomu uživateli za den',
        dataType: 'NUMBER',
        group: 'groups',
        semantics: {
          conceptType: 'METRIC'
        }
      }, {
        name: 'goc_maxCpt',
        label: 'Sestava: Maximální CPT',
        dataType: 'NUMBER',
        group: 'groups',
        semantics: {
          conceptType: 'METRIC'
        }
      }, {
        name: 'goc_name',
        label: 'Sestava: Název',
        dataType: 'STRING',
        group: 'groups',
        semantics: {
          conceptType: 'DIMENSION'
        }
      }, {
        name: 'goc_sensitivity',
        label: 'Sestava: Jedna se o erotickou reklamu',
        dataType: 'BOOLEAN',
        group: 'groups',
        semantics: {
          conceptType: 'DIMENSION'
        }
      }, {
        name: 'goc_status',
        label: 'Sestava: Status',
        dataType: 'STRING',
        group: 'groups',
        semantics: {
          conceptType: 'DIMENSION'
        }
      }, {
        name: 'goc_statusId',
        label: 'Sestava: Id statusu',
        dataType: 'NUMBER',
        group: 'groups',
        semantics: {
          conceptType: 'METRIC'
        }
      }, {
        name: 'goc_avgCpc',
        label: 'Sestava: Průměrné CPC',
        dataType: 'NUMBER',
        group: 'groups',
        semantics: {
          conceptType: 'METRIC'
        }
      }, {
        name: 'goc_avgPos',
        label: 'Sestava: Průměrná pozice',
        dataType: 'NUMBER',
        group: 'groups',
        semantics: {
          conceptType: 'METRIC'
        }
      }, {
        name: 'goc_clickMoney',
        label: 'Sestava: Cena prokliků',
        dataType: 'NUMBER',
        group: 'groups',
        semantics: {
          conceptType: 'METRIC'
        }
      }, {
        name: 'goc_clickMoney_kc',
        label: 'Sestava: (Kč) Cena prokliků',
        dataType: 'NUMBER',
        group: 'groups',
        formula: 'goc_clickMoney*0.01',
        semantics: {
          conceptType: 'METRIC'
        }
      },
  
      {
        name: 'goc_clicks',
        label: 'Sestava: Počet prokliků',
        dataType: 'NUMBER',
        group: 'groups',
        semantics: {
          conceptType: 'METRIC'
        }
      }, {
        name: 'goc_conversions',
        label: 'Sestava: Počet konverzí',
        dataType: 'NUMBER',
        group: 'groups',
        semantics: {
          conceptType: 'METRIC'
        }
      }, {
        name: 'goc_conversionValue',
        label: 'Sestava: Cena konverzí',
        dataType: 'NUMBER',
        group: 'groups',
        semantics: {
          conceptType: 'METRIC'
        }
      }, {
        name: 'goc_conversionValue_kc',
        label: 'Sestava: (Kč) Cena konverzí',
        dataType: 'NUMBER',
        group: 'groups',
        formula: 'goc_conversionValue*0.01',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'goc_impressionMoney',
        label: 'Sestava: Cena za zobrazeni',
        dataType: 'NUMBER',
        group: 'groups',
        semantics: {
          conceptType: 'METRIC'
        }
      }, {
        name: 'goc_impressionMoney_kc',
        label: 'Sestava: (Kč) Cena za zobrazeni',
        dataType: 'NUMBER',
        group: 'groups',
        formula: 'goc_impressionMoney*0.01',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'goc_impressions',
        label: 'Sestava: Počet zobrazení',
        dataType: 'NUMBER',
        group: 'groups',
        semantics: {
          conceptType: 'METRIC'
        }
      }, {
        name: 'goc_totalMoney',
        label: 'Sestava: Celkem utracené peníze',
        dataType: 'NUMBER',
        group: 'groups',
        semantics: {
          conceptType: 'METRIC'
        }
      }, {
        name: 'goc_totalMoney_kc',
        label: 'Sestava: Celkem utracené peníze',
        dataType: 'NUMBER',
        group: 'groups',
        formula: 'goc_totalMoney*0.01',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'goc_transactions',
        label: 'Sestava: number of transactions',
        dataType: 'NUMBER',
        group: 'groups',
        semantics: {
          conceptType: 'METRIC'
        }
      }, {
        name: 'goc_missImpressions',
        label: 'Sestava: Nevyužité zobrazení',
        dataType: 'NUMBER',
        group: 'groups',
        semantics: {
          conceptType: 'METRIC'
        }
      }, {
        name: 'goc_underLowerThreshold',
        label: 'Sestava: Prošvihnuté zobrazení pro nízké cpc',
        dataType: 'NUMBER',
        group: 'groups',
        semantics: {
          conceptType: 'METRIC'
        }
      }, {
        name: 'goc_exhaustedBudget',
        label: 'Sestava: Prošvihnuté zobrazní pro nízký budget',
        dataType: 'NUMBER',
        group: 'groups',
        semantics: {
          conceptType: 'METRIC'
        }
      }, {
        name: 'goc_stoppedBySchedule',
        label: 'Sestava: Prošvihnuté zobrazní pro plánované zobrazení',
        dataType: 'NUMBER',
        group: 'groups',
        semantics: {
          conceptType: 'METRIC'
        }
      }, {
        name: 'goc_underForestThreshold',
        label: 'Sestava: Prošvihnuté zobrazní pro nízkou relevanci',
        dataType: 'NUMBER',
        group: 'groups',
        semantics: {
          conceptType: 'METRIC'
        }
      }, {
        name: 'goc_exhaustedBudgetShare',
        label: 'Sestavy: Prošvihnuté zobrazní vyčerpání sdíleného rozpočtu',
        dataType: 'NUMBER',
        group: 'groups',
        semantics: {
          conceptType: 'METRIC'
        }
      }, {
        name: 'goc_ctr',
        label: 'Sestava: CTR',
        dataType: 'NUMBER',
        group: 'groups',
        semantics: {
          conceptType: 'METRIC'
        }
      }, {
        name: 'goc_pno',
        label: 'Sestava: PNO (Cost Of Sale(COS))',
        dataType: 'NUMBER',
        group: 'groups',
        semantics: {
          conceptType: 'METRIC'
        }
      }, {
        name: 'goc_ish',
        label: 'Sestava: Procentuální prošvihnuté zobrazení ve vyhleávání',
        dataType: 'NUMBER',
        group: 'groups',
        semantics: {
          conceptType: 'METRIC'
        }
      }, {
        name: 'goc_ishContext',
        label: 'Sestava: Procentuální prošvihnuté zobrazení v kontextu',
        dataType: 'NUMBER',
        group: 'groups',
        semantics: {
          conceptType: 'METRIC'
        }
      }, {
        name: 'goc_ishSum',
        label: 'Sestava: Procentuální prošvihnuté zobrazení v obou',
        dataType: 'NUMBER',
        group: 'groups',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      //####################################### Ads columns 
      {
        name: 'adc_adStatus',
        label: 'Inzerát: Stav inzerátu nastavený systémem',
        dataType: 'STRING',
        group: 'ads',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'adc_adType',
        label: 'Inzerát: Typ inzerátu',
        dataType: 'STRING',
        group: 'ads',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'adc_clickthruText',
        label: 'Inzerát: Text - zobrazený link',
        dataType: 'STRING',
        group: 'ads',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'adc_clickthruUrl',
        label: 'Inzerát: Text - url',
        dataType: 'STRING',
        group: 'ads',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'adc_createDate',
        label: 'Inzerát: Datum vzniku sestavy',
        dataType: 'STRING',
        group: 'ads',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'adc_creative1',
        label: 'Inzerát: Text - text 1',
        dataType: 'STRING',
        group: 'ads',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'adc_creative2',
        label: 'Inzerát: Text - text 2',
        dataType: 'STRING',
        group: 'ads',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'adc_creative3',
        label: 'Inzerát: Text - text 3 ',
        dataType: 'STRING',
        group: 'ads',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'adc_deleted',
        label: 'Inzerát: Je smazaná',
        dataType: 'BOOLEAN',
        group: 'ads',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'adc_deleteDate',
        label: 'Inzerát: Datum smazání',
        dataType: 'STRING',
        group: 'ads',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'adc_description',
        label: 'Inzerát: Eta - Popis',
        dataType: 'STRING',
        group: 'ads',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'adc_finalUrl',
        label: 'Inzerát: Eta - url',
        dataType: 'STRING',
        group: 'ads',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'adc_headline1',
        label: 'Inzerát: Eta - popis 1',
        dataType: 'STRING',
        group: 'ads',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'adc_headline2',
        label: 'Inzerát: Eta - popis 2',
        dataType: 'STRING',
        group: 'ads',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'adc_id',
        label: 'Inzerát: Id',
        dataType: 'NUMBER',
        group: 'ads',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'adc_path1',
        label: 'Inzerát: Eta - cesta u url 1',
        dataType: 'STRING',
        group: 'ads',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'adc_path2',
        label: 'Inzerát: Eta - cesta u url 2',
        dataType: 'STRING',
        group: 'ads',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'adc_longLine',
        label: 'Inzerát: Kombinovaná - Dlouhý titulek',
        dataType: 'STRING',
        group: 'ads',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'adc_shortLine',
        label: 'Inzerát: Kombinovaná - Krátký titulek',
        dataType: 'STRING',
        group: 'ads',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
  
      {
        name: 'adc_companyName',
        label: 'Inzerát: Kombinovaná - Název firmy',
        dataType: 'STRING',
        group: 'ads',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'adc_image.id',
        label: 'Inzerát: Kombinovaná - ID obdélníku',
        dataType: 'NUMBER',
        group: 'ads',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'adc_image.url',
        label: 'Inzerát: Kombinovaná - Url na obdélník',
        dataType: 'STRING',
        group: 'ads',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'adc_imageLogo.id',
        label: 'Inzerát: Kombinovaná - ID loga',
        dataType: 'NUMBER',
        group: 'ads',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'adc_imageLogo.url',
        label: 'Inzerát: Kombinovaná - Url na logo',
        dataType: 'STRING',
        group: 'ads',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'adc_imageSquare.id',
        label: 'Inzerát: Kombinovaná - ID čtverce',
        dataType: 'NUMBER',
        group: 'ads',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'adc_imageSquare.url',
        label: 'Inzerát: Kombinovaná - Url na čtverec',
        dataType: 'STRING',
        group: 'ads',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'adc_imageLandscapeLogo.id',
        label: 'Inzerát: Kombinovaná - ID obdelníkového loga',
        dataType: 'NUMBER',
        group: 'ads',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'adc_imageLandscapeLogo.url',
        label: 'Inzerát: Kombinovaná - Url na obdelníkové logo',
        dataType: 'STRING',
        group: 'ads',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'adc_premiseId',
        label: 'Inzerát: Id provozovny',
        dataType: 'NUMBER',
        group: 'ads',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'adc_premiseModeId',
        label: 'Inzerát: Typ zobrazování provozovny',
        dataType: 'NUMBER',
        group: 'ads',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'adc_premiseMode',
        label: 'Inzerát: Typ zobrazování provozovny',
        dataType: 'STRING',
        group: 'ads',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'adc_sensitivity',
        label: 'Inzerát: Citlivost',
        dataType: 'NUMBER',
        group: 'ads',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'adc_status',
        label: 'Inzerát: Stav nastavený uživatelem',
        dataType: 'STRING',
        group: 'ads',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'adc_trackingTemplate',
        label: 'Inzerát: Traking template',
        dataType: 'STRING',
        group: 'ads',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'adc_avgCpc',
        label: 'Inzerát: Průměrné CPC',
        dataType: 'NUMBER',
        group: 'ads',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'adc_avgPos',
        label: 'Inzerát: Průměrná pozice',
        dataType: 'NUMBER',
        group: 'ads',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'adc_clickMoney',
        label: 'Inzerát: Cena prokliků',
        dataType: 'NUMBER',
        group: 'ads',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'adc_clickMoney_kc',
        label: 'Inzerát: (Kč) Cena prokliků',
        dataType: 'NUMBER',
        group: 'ads',
        formula: 'adc_clickMoney*0.01',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'adc_clicks',
        label: 'Inzerát: Počet prokliků',
        dataType: 'NUMBER',
        group: 'ads',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'adc_conversions',
        label: 'Inzerát: Počet konverzí',
        dataType: 'NUMBER',
        group: 'ads',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'adc_conversionValue',
        label: 'Inzerát: Cena konverzí',
        dataType: 'NUMBER',
        group: 'ads',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'adc_conversionValue_kc',
        label: 'Inzerát: (Kč) Cena konverzí',
        dataType: 'NUMBER',
        group: 'ads',
        formula: 'adc_conversionValue*0.01',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'adc_impressionMoney',
        label: 'Inzerát: Cena za zobrazeni',
        dataType: 'NUMBER',
        group: 'ads',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'adc_impressionMoney_kc',
        label: 'Inzerát: (Kč) Cena za zobrazeni',
        dataType: 'NUMBER',
        group: 'ads',
        formula: 'adc_impressionMoney*0.01',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'adc_impressions',
        label: 'Inzerát: Počet zobrazení',
        dataType: 'NUMBER',
        group: 'ads',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'adc_totalMoney',
        label: 'Inzerát: Celkem utracené peníze',
        dataType: 'NUMBER',
        group: 'ads',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'adc_totalMoney_kc',
        label: 'Inzerát: (Kč) Celkem utracené peníze',
        dataType: 'NUMBER',
        group: 'ads',
        formula: 'adc_totalMoney*0.01',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'adc_transactions',
        label: 'Inzerát: number of transactions',
        dataType: 'NUMBER',
        group: 'ads',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'adc_missImpressions',
        label: 'Inzerát: Nevyužité zobrazení',
        dataType: 'NUMBER',
        group: 'ads',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'adc_underLowerThreshold',
        label: 'Inzerát: Prošvihnuté zobrazení pro nízké cpc',
        dataType: 'NUMBER',
        group: 'ads',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'adc_exhaustedBudget',
        label: 'Inzerát: Prošvihnuté zobrazní pro nízký budget',
        dataType: 'NUMBER',
        group: 'ads',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'adc_stoppedBySchedule',
        label: 'Inzerát: Prošvihnuté zobrazní pro plánované zobrazení',
        dataType: 'NUMBER',
        group: 'ads',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'adc_underForestThreshold',
        label: 'Inzerát: Prošvihnuté zobrazní pro nízkou relevanci',
        dataType: 'NUMBER',
        group: 'ads',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'adc_exhaustedBudgetShare',
        label: 'Inzerát: Prošvihnuté zobrazní vyčerpání sdíleného rozpočtu',
        dataType: 'NUMBER',
        group: 'ads',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'adc_ctr',
        label: 'Inzerát: CTR',
        dataType: 'NUMBER',
        group: 'ads',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'adc_pno',
        label: 'Inzerát: PNO (Cost Of Sale(COS))',
        dataType: 'NUMBER',
        group: 'ads',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'adc_ish',
        label: 'Inzerát: Procentuální prošvihnuté zobrazení ve vyhleávání',
        dataType: 'NUMBER',
        group: 'ads',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'adc_ishContext',
        label: 'Inzerát: Procentuální prošvihnuté zobrazení v kontextu',
        dataType: 'NUMBER',
        group: 'ads',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'adc_ishSum',
        label: 'Inzerát: Procentuální prošvihnuté zobrazení v obou',
        dataType: 'NUMBER',
        group: 'ads',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      //####################################### Banners columns 
      {
        name: 'bnc_adStatus',
        label: 'Banner: Stav inzerátu nastavený systémem',
        dataType: 'STRING',
        group: 'banners',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'bnc_adType',
        label: 'Banner: Typ inzerátu',
        dataType: 'STRING',
        group: 'banners',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'bnc_bannerName',
        label: 'Banner: Název banneru',
        dataType: 'STRING',
        group: 'banners',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'bnc_clickthruUrl',
        label: 'Banner: Url',
        dataType: 'STRING',
        group: 'banners',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'bnc_createDate',
        label: 'Banner: Datum vzniku sestavy',
        dataType: 'STRING',
        group: 'banners',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'bnc_creative1',
        label: 'Banner: Text - text 1',
        dataType: 'STRING',
        group: 'banners',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'bnc_deleted',
        label: 'Banner: Je smazaná',
        dataType: 'BOOLEAN',
        group: 'banners',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'bnc_deleteDate',
        label: 'Banner: Datum smazání',
        dataType: 'STRING',
        group: 'banners',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'bnc_description',
        label: 'Banner: Eta - Popis',
        dataType: 'STRING',
        group: 'banners',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'bnc_mobileFinalUrl',
        label: 'Banner: Mobile final url',
        dataType: 'STRING',
        group: 'banners',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'bnc_height',
        label: 'Banner: Výška',
        dataType: 'NUMBER',
        group: 'banners',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'bnc_id',
        label: 'Banner: Id',
        dataType: 'NUMBER',
        group: 'banners',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'bnc_imageType',
        label: 'Banner: Typ obrázku',
        dataType: 'STRING',
        group: 'banners',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'bnc_imageUrl',
        label: 'Banner: Dočasná url data obrázku',
        dataType: 'STRING',
        group: 'banners',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'bnc_width',
        label: 'Banner: Šířka',
        dataType: 'NUMBER',
        group: 'banners',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'bnc_premiseId',
        label: 'Banner: Id provozovny',
        dataType: 'NUMBER',
        group: 'banners',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'bnc_premiseModeId',
        label: 'Banner: Typ zobrazování provozovny',
        dataType: 'NUMBER',
        group: 'banners',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'bnc_premiseMode',
        label: 'Banner: Typ zobrazování provozovny',
        dataType: 'STRING',
        group: 'banners',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'bnc_sensitivity',
        label: 'Banner: Citlivost',
        dataType: 'NUMBER',
        group: 'banners',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'bnc_status',
        label: 'Banner: Stav nastavený uživatelem',
        dataType: 'STRING',
        group: 'banners',
        semantics: {
          conceptType: 'DIMENSION'
        }
      },
      {
        name: 'bnc_avgCpc',
        label: 'Banner: Průměrné CPC',
        dataType: 'NUMBER',
        group: 'banners',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'bnc_avgPos',
        label: 'Banner: Průměrná pozice',
        dataType: 'NUMBER',
        group: 'banners',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'bnc_clickMoney',
        label: 'Banner: Cena prokliků',
        dataType: 'NUMBER',
        group: 'banners',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'bnc_clickMoney_kc',
        label: 'Banner: (Kč) Cena prokliků',
        dataType: 'NUMBER',
        group: 'banners',
        formula: 'bnc_clickMoney*0.01',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'bnc_clicks',
        label: 'Banner: Počet prokliků',
        dataType: 'NUMBER',
        group: 'banners',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'bnc_conversions',
        label: 'Banner: Počet konverzí',
        dataType: 'NUMBER',
        group: 'banners',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'bnc_conversionValue',
        label: 'Banner: Cena konverzí',
        dataType: 'NUMBER',
        group: 'banners',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'bnc_conversionValue_kc',
        label: 'Banner: (Kč) Cena konverzí',
        dataType: 'NUMBER',
        group: 'banners',
        formula: 'bnc_conversionValue*0.01',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'bnc_impressionMoney',
        label: 'Banner: Cena za zobrazeni',
        dataType: 'NUMBER',
        group: 'banners',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'bnc_impressionMoney_kc',
        label: 'Banner: (Kč) Cena za zobrazeni',
        dataType: 'NUMBER',
        group: 'banners',
        formula: 'bnc_impressionMoney*0.01',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'bnc_impressions',
        label: 'Banner: Počet zobrazení',
        dataType: 'NUMBER',
        group: 'banners',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'bnc_totalMoney',
        label: 'Banner: Celkem utracené peníze',
        dataType: 'NUMBER',
        group: 'banners',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'bnc_totalMoney_kc',
        label: 'Banner: (Kč) Celkem utracené peníze',
        dataType: 'NUMBER',
        group: 'banners',
        formula: 'bnc_totalMoney*0.01',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'bnc_transactions',
        label: 'Banner: number of transactions',
        dataType: 'NUMBER',
        group: 'banners',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'bnc_missImpressions',
        label: 'Banner: Nevyužité zobrazení',
        dataType: 'NUMBER',
        group: 'banners',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'bnc_underLowerThreshold',
        label: 'Banner: Prošvihnuté zobrazení pro nízké cpc',
        dataType: 'NUMBER',
        group: 'banners',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'bnc_exhaustedBudget',
        label: 'Banner: Prošvihnuté zobrazní pro nízký budget',
        dataType: 'NUMBER',
        group: 'banners',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'bnc_stoppedBySchedule',
        label: 'Banner: Prošvihnuté zobrazní pro plánované zobrazení',
        dataType: 'NUMBER',
        group: 'banners',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'bnc_underForestThreshold',
        label: 'Banner: Prošvihnuté zobrazní pro nízkou relevanci',
        dataType: 'NUMBER',
        group: 'banners',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'bnc_exhaustedBudgetShare',
        label: 'Banner: Prošvihnuté zobrazní vyčerpání sdíleného rozpočtu',
        dataType: 'NUMBER',
        group: 'banners',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'bnc_ctr',
        label: 'Banner: CTR',
        dataType: 'NUMBER',
        group: 'banners',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'bnc_pno',
        label: 'Banner: PNO (Cost Of Sale(COS))',
        dataType: 'NUMBER',
        group: 'banners',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'bnc_ish',
        label: 'Banner: Procentuální prošvihnuté zobrazení ve vyhleávání',
        dataType: 'NUMBER',
        group: 'banners',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'bnc_ishContext',
        label: 'Banner: Procentuální prošvihnuté zobrazení v kontextu',
        dataType: 'NUMBER',
        group: 'banners',
        semantics: {
          conceptType: 'METRIC'
        }
      },
      {
        name: 'bnc_ishSum',
        label: 'Banner: Procentuální prošvihnuté zobrazení v obou',
        dataType: 'NUMBER',
        group: 'banners',
        semantics: {
          conceptType: 'METRIC'
        }
      }
    ];
  
    this.getSchema = function () {
      var schema = this.SklikDataSchema;
      //Pokud mame v configu vyplnene GroupId pak delam rozpad podle toho
      if ((this.config.groupsId != undefined && this.config.groupsId != ',' && this.config.groupsId.length > 0)) {
        var gSchema = this.standardGroupsSchema(schema);
        gSchema = this.bannersSchemaByGroup(gSchema, this.config.groupsId);
        return this.adSchemaByGroup(gSchema, this.config.groupsId);
      } else {
        //Pokud nemame v configu nani GroupId ani CampaignsId pak delam celkovy rozpad
        if (this.config.campaignsId == undefined || this.config.campaignsId.length == 0) {
          var gSchema = this.standardGroupsSchema(schema);
          gSchema = this.bannersSchemaDefault(gSchema);
          return this.adSchemaDefault(gSchema);
          //Pokud mame id v Campaigns pak rozpad dle nich
        } else {
          var gSchema = this.extendGroupsSchema(schema, this.config.campaignsId);
          gSchema = this.bannersSchemaByCampaign(gSchema, this.config.campaignsId);
          return this.adSchemaByCampaign(gSchema, this.config.campaignsId);
        }
      }
      return schema;
    }
  
  
    this.bannersSchemaDefault = function (schema) {
      var banner = [
        {
          name: 'bns_bannerName',
          label: 'Název inzerátu',
          dataType: 'STRING',
          group: 'banners',
          semantics: {
            conceptType: 'DIMENSION'
          }
        },
        {
          name: 'bnd_days',
          label: 'Statistiky bannerů (denní)',
          dataType: 'STRING',
          group: 'bannersDaily',
          semantics: {
            conceptType: 'DIMENSION',
            semanticType: 'YEAR_MONTH_DAY',
            semanticGroup: 'DATETIME'
          }
        },
        {
          name: 'bnd_bannersIds',
          label: 'Banner Id',
          dataType: 'NUMBER',
          group: 'bannersDaily',
          semantics: {
            conceptType: 'DIMENSION'
          }
        },
        {
          name: 'bnw_days',
          label: 'Statistiky bannerů (týdenní)',
          dataType: 'STRING',
          group: 'bannersWeekly',
          semantics: {
            conceptType: 'DIMENSION',
            semanticType: 'YEAR_WEEK',
            semanticGroup: 'DATETIME'
          }
        },
        {
          name: 'bnw_bannersIds',
          label: 'Banner Id',
          dataType: 'NUMBER',
          group: 'bannersWeekly',
          semantics: {
            conceptType: 'DIMENSION'
          }
        },
        {
          name: 'bnm_days',
          label: 'Statistiky bannerů (měsíční)',
          dataType: 'STRING',
          group: 'bannersMonthly',
          semantics: {
            conceptType: 'DIMENSION',
            semanticType: 'YEAR_MONTH',
            semanticGroup: 'DATETIME'
          }
        },
        {
          name: 'bnm_bannersIds',
          label: 'Banner Id',
          dataType: 'NUMBER',
          group: 'bannersMonthly',
          semantics: {
            conceptType: 'DIMENSION'
          }
        }, {
          name: 'bnq_days',
          label: 'Statistiky bannerů (kvartální)',
          dataType: 'STRING',
          group: 'bannersQuarterly',
          semantics: {
            conceptType: 'DIMENSION',
            semanticType: 'YEAR_QUARTER',
            semanticGroup: 'DATETIME'
          }
        },
        {
          name: 'bnq_bannersIds',
          label: 'Banner Id',
          dataType: 'NUMBER',
          group: 'bannersQuarterly',
          semantics: {
            conceptType: 'DIMENSION'
          }
        },
        {
          name: 'bny_days',
          label: 'Statistiky bannerů (roční)',
          dataType: 'STRING',
          group: 'bannersYearly',
          semantics: {
            conceptType: 'DIMENSION',
            semanticType: 'YEAR',
            semanticGroup: 'DATETIME'
          }
        },
        {
          name: 'bny_bannersIds',
          label: 'Banner Id',
          dataType: 'NUMBER',
          group: 'bannersYearly',
          semantics: {
            conceptType: 'DIMENSION'
          }
        }
  
      ];
      return schema.concat(banner);
    }
  
  
  
    this.bannersSchemaByGroup = function (schema, ids) {
      var idsArr = ids.split(',');
      var id;
      var banner;
      while (idsArr.length > 0) {
        id = idsArr.pop();
        banner = [
          {
            name: 'bns_bannerName_' + id,
            label: 'Název bannerů pro sestavu ' + id,
            dataType: 'STRING',
            group: 'banners',
            semantics: {
              conceptType: 'DIMENSION'
            }
          },
          {
            name: 'bnd_days_' + id,
            label: 'Statistiky bannerů (denní) pro sestavu ' + id,
            dataType: 'STRING',
            group: 'bannersDaily',
            semantics: {
              conceptType: 'DIMENSION',
              semanticType: 'YEAR_MONTH_DAY',
              semanticGroup: 'DATETIME'
            }
          },
          {
            name: 'bnd_bannersIds_' + id,
            label: 'Banner Id pro sestavu ' + id,
            dataType: 'NUMBER',
            group: 'bannersDaily',
            semantics: {
              conceptType: 'DIMENSION'
            }
          },
          {
            name: 'bnw_days_' + id,
            label: 'Statistiky bannerů (týdenní) pro sestavu ' + id,
            dataType: 'STRING',
            group: 'bannersWeekly',
            semantics: {
              conceptType: 'DIMENSION',
              semanticType: 'YEAR_WEEK',
              semanticGroup: 'DATETIME'
            }
          },
          {
            name: 'bnw_bannersIds_' + id,
            label: 'Banner Id pro sestavu ' + id,
            dataType: 'NUMBER',
            group: 'bannersWeekly',
            semantics: {
              conceptType: 'DIMENSION'
            }
          },
          {
            name: 'bnm_days_' + id,
            label: 'Statistiky bannerů (měsíční) pro sestavu ' + id,
            dataType: 'STRING',
            group: 'bannersMonthly',
            semantics: {
              conceptType: 'DIMENSION',
              semanticType: 'YEAR_MONTH',
              semanticGroup: 'DATETIME'
            }
          },
          {
            name: 'bnm_bannersIds_' + id,
            label: 'Banner Id pro sestavu ' + id,
            dataType: 'NUMBER',
            group: 'bannersMonthly',
            semantics: {
              conceptType: 'DIMENSION'
            }
          }, {
            name: 'bnq_days_' + id,
            label: 'Statistiky bannerů (kvartální) pro sestavu ' + id,
            dataType: 'STRING',
            group: 'bannersQuarterly',
            semantics: {
              conceptType: 'DIMENSION',
              semanticType: 'YEAR_QUARTER',
              semanticGroup: 'DATETIME'
            }
          },
          {
            name: 'bnq_bannersIds_' + id,
            label: 'Banner Id pro sestavu ' + id,
            dataType: 'NUMBER',
            group: 'bannersQuarterly',
            semantics: {
              conceptType: 'DIMENSION'
            }
          },
          {
            name: 'bny_days_' + id,
            label: 'Statistiky bannerů (roční) pro sestavu ' + id,
            dataType: 'STRING',
            group: 'bannersYearly',
            semantics: {
              conceptType: 'DIMENSION',
              semanticType: 'YEAR',
              semanticGroup: 'DATETIME'
            }
          },
          {
            name: 'bny_bannersIds_' + id,
            label: 'Banner Id pro sestavu ' + id,
            dataType: 'NUMBER',
            group: 'bannersYearly',
            semantics: {
              conceptType: 'DIMENSION'
            }
          }
  
        ];
        schema = schema.concat(banner);
      }
      return schema;
  
    }
  
    this.bannersSchemaByCampaign = function (schema, ids) {
      var idsArr = ids.split(',');
      var id;
      var banner;
      while (idsArr.length > 0) {
        id = idsArr.pop();
        banner = [
          {
            name: 'bns_bannerName_' + id,
            label: 'Název bannerů pro kampan ' + id,
            dataType: 'STRING',
            group: 'banners',
            semantics: {
              conceptType: 'DIMENSION'
            }
          },
          {
            name: 'bnd_days_' + id,
            label: 'Statistiky bannerů (denní) pro kampan ' + id,
            dataType: 'STRING',
            group: 'bannersDaily',
            semantics: {
              conceptType: 'DIMENSION',
              semanticType: 'YEAR_MONTH_DAY',
              semanticGroup: 'DATETIME'
            }
          },
          {
            name: 'bnd_bannersIds_' + id,
            label: 'Banner Id pro kampan ' + id,
            dataType: 'NUMBER',
            group: 'bannersDaily',
            semantics: {
              conceptType: 'DIMENSION'
            }
          },
          {
            name: 'bnw_days_' + id,
            label: 'Statistiky bannerů (týdenní) pro kampan ' + id,
            dataType: 'STRING',
            group: 'bannersWeekly',
            semantics: {
              conceptType: 'DIMENSION',
              semanticType: 'YEAR_WEEK',
              semanticGroup: 'DATETIME'
            }
          },
          {
            name: 'bnw_bannersIds_' + id,
            label: 'Banner Id pro kampan ' + id,
            dataType: 'NUMBER',
            group: 'bannersWeekly',
            semantics: {
              conceptType: 'DIMENSION'
            }
          },
          {
            name: 'bnm_days_' + id,
            label: 'Statistiky bannerů (měsíční) pro kampan ' + id,
            dataType: 'STRING',
            group: 'bannersMonthly',
            semantics: {
              conceptType: 'DIMENSION',
              semanticType: 'YEAR_MONTH',
              semanticGroup: 'DATETIME'
            }
          },
          {
            name: 'bnm_bannersIds_' + id,
            label: 'Banner Id pro kampan ' + id,
            dataType: 'NUMBER',
            group: 'bannersMonthly',
            semantics: {
              conceptType: 'DIMENSION'
            }
          }, {
            name: 'bnq_days_' + id,
            label: 'Statistiky bannerů (kvartální) pro kampan ' + id,
            dataType: 'STRING',
            group: 'bannersQuarterly',
            semantics: {
              conceptType: 'DIMENSION',
              semanticType: 'YEAR_QUARTER',
              semanticGroup: 'DATETIME'
            }
          },
          {
            name: 'bnq_bannersIds_' + id,
            label: 'Banner Id pro kampan ' + id,
            dataType: 'NUMBER',
            group: 'bannersQuarterly',
            semantics: {
              conceptType: 'DIMENSION'
            }
          },
          {
            name: 'bny_days_' + id,
            label: 'Statistiky bannerů (roční) pro kampan ' + id,
            dataType: 'STRING',
            group: 'bannersYearly',
            semantics: {
              conceptType: 'DIMENSION',
              semanticType: 'YEAR',
              semanticGroup: 'DATETIME'
            }
          },
          {
            name: 'bny_bannersIds_' + id,
            label: 'Banner Id pro kampan ' + id,
            dataType: 'NUMBER',
            group: 'bannersYearly',
            semantics: {
              conceptType: 'DIMENSION'
            }
          }
  
        ];
        schema = schema.concat(banner);
      }
      return schema;
  
    }
  
  
    this.adSchemaDefault = function (schema) {
      var ad = [
        {
          name: 'ads_headline1',
          label: 'Název inzerátu',
          dataType: 'STRING',
          group: 'ads',
          semantics: {
            conceptType: 'DIMENSION'
          }
        },
        {
          name: 'add_days',
          label: 'Statistiky inzerátů (denní)',
          dataType: 'STRING',
          group: 'adsDaily',
          semantics: {
            conceptType: 'DIMENSION',
            semanticType: 'YEAR_MONTH_DAY',
            semanticGroup: 'DATETIME'
          }
        },
        {
          name: 'add_adsIds',
          label: 'Ads Id',
          dataType: 'NUMBER',
          group: 'adsDaily',
          semantics: {
            conceptType: 'DIMENSION'
          }
        },
        {
          name: 'adw_days',
          label: 'Statistiky inzerátů (týdenní)',
          dataType: 'STRING',
          group: 'adsWeekly',
          semantics: {
            conceptType: 'DIMENSION',
            semanticType: 'YEAR_WEEK',
            semanticGroup: 'DATETIME'
          }
        },
        {
          name: 'adw_adsIds',
          label: 'Ads Id',
          dataType: 'NUMBER',
          group: 'adsWeekly',
          semantics: {
            conceptType: 'DIMENSION'
          }
        },
        {
          name: 'adm_days',
          label: 'Statistiky inzerátů (měsíční)',
          dataType: 'STRING',
          group: 'adsMonthly',
          semantics: {
            conceptType: 'DIMENSION',
            semanticType: 'YEAR_MONTH',
            semanticGroup: 'DATETIME'
          }
        },
        {
          name: 'adm_adsIds',
          label: 'Ads Id',
          dataType: 'NUMBER',
          group: 'adsMonthly',
          semantics: {
            conceptType: 'DIMENSION'
          }
        }, {
          name: 'adq_days',
          label: 'Statistiky inzerátů (kvartální)',
          dataType: 'STRING',
          group: 'adsQuarterly',
          semantics: {
            conceptType: 'DIMENSION',
            semanticType: 'YEAR_QUARTER',
            semanticGroup: 'DATETIME'
          }
        },
        {
          name: 'adq_adsIds',
          label: 'Ads Id',
          dataType: 'NUMBER',
          group: 'adsQuarterly',
          semantics: {
            conceptType: 'DIMENSION'
          }
        },
        {
          name: 'ady_days',
          label: 'Statistiky inzerátů (roční)',
          dataType: 'STRING',
          group: 'adsYearly',
          semantics: {
            conceptType: 'DIMENSION',
            semanticType: 'YEAR',
            semanticGroup: 'DATETIME'
          }
        },
        {
          name: 'ady_adsIds',
          label: 'Ads Id',
          dataType: 'NUMBER',
          group: 'adsYearly',
          semantics: {
            conceptType: 'DIMENSION'
          }
        }
  
      ];
      return schema.concat(ad);
    }
  
  
  
    this.adSchemaByGroup = function (schema, ids) {
      var idsArr = ids.split(',');
      var id;
      var ad;
      while (idsArr.length > 0) {
        id = idsArr.pop();
        ad = [
          {
            name: 'ads_headline1_' + id,
            label: 'Název inzerátů pro sestavu ' + id,
            dataType: 'STRING',
            group: 'ads',
            semantics: {
              conceptType: 'DIMENSION'
            }
          },
          {
            name: 'add_days_' + id,
            label: 'Statistiky inzerátů (denní) pro sestavu ' + id,
            dataType: 'STRING',
            group: 'adsDaily',
            semantics: {
              conceptType: 'DIMENSION',
              semanticType: 'YEAR_MONTH_DAY',
              semanticGroup: 'DATETIME'
            }
          },
          {
            name: 'add_adsIds_' + id,
            label: 'Ads Id pro sestavu ' + id,
            dataType: 'NUMBER',
            group: 'adsDaily',
            semantics: {
              conceptType: 'DIMENSION'
            }
          },
          {
            name: 'adw_days_' + id,
            label: 'Statistiky inzerátů (týdenní) pro sestavu ' + id,
            dataType: 'STRING',
            group: 'adsWeekly',
            semantics: {
              conceptType: 'DIMENSION',
              semanticType: 'YEAR_WEEK',
              semanticGroup: 'DATETIME'
            }
          },
          {
            name: 'adw_adsIds_' + id,
            label: 'Ads Id pro sestavu ' + id,
            dataType: 'NUMBER',
            group: 'adsWeekly',
            semantics: {
              conceptType: 'DIMENSION'
            }
          },
          {
            name: 'adm_days_' + id,
            label: 'Statistiky inzerátů (měsíční) pro sestavu ' + id,
            dataType: 'STRING',
            group: 'adsMonthly',
            semantics: {
              conceptType: 'DIMENSION',
              semanticType: 'YEAR_MONTH',
              semanticGroup: 'DATETIME'
            }
          },
          {
            name: 'adm_adsIds_' + id,
            label: 'Ads Id pro sestavu ' + id,
            dataType: 'NUMBER',
            group: 'adsMonthly',
            semantics: {
              conceptType: 'DIMENSION'
            }
          }, {
            name: 'adq_days_' + id,
            label: 'Statistiky inzerátů (kvartální) pro sestavu ' + id,
            dataType: 'STRING',
            group: 'adsQuarterly',
            semantics: {
              conceptType: 'DIMENSION',
              semanticType: 'YEAR_QUARTER',
              semanticGroup: 'DATETIME'
            }
          },
          {
            name: 'adq_adsIds_' + id,
            label: 'Ads Id pro sestavu ' + id,
            dataType: 'NUMBER',
            group: 'adsQuarterly',
            semantics: {
              conceptType: 'DIMENSION'
            }
          },
          {
            name: 'ady_days_' + id,
            label: 'Statistiky inzerátů (roční) pro sestavu ' + id,
            dataType: 'STRING',
            group: 'adsYearly',
            semantics: {
              conceptType: 'DIMENSION',
              semanticType: 'YEAR',
              semanticGroup: 'DATETIME'
            }
          },
          {
            name: 'ady_adsIds_' + id,
            label: 'Ads Id pro sestavu ' + id,
            dataType: 'NUMBER',
            group: 'adsYearly',
            semantics: {
              conceptType: 'DIMENSION'
            }
          }
  
        ];
        schema = schema.concat(ad);
      }
      return schema;
    }
  
    this.adSchemaByCampaign = function (schema, ids) {
      var idsArr = ids.split(',');
      var id;
      var ad;
      while (idsArr.length > 0) {
        id = idsArr.pop();
        ad = [
          {
            name: 'ads_headline1_' + id,
            label: 'Název inzerátů pro kampan ' + id,
            dataType: 'STRING',
            group: 'ads',
            semantics: {
              conceptType: 'DIMENSION'
            }
          },
          {
            name: 'add_days_' + id,
            label: 'Statistiky inzerátů (denní) pro kampan ' + id,
            dataType: 'STRING',
            group: 'adsDaily',
            semantics: {
              conceptType: 'DIMENSION',
              semanticType: 'YEAR_MONTH_DAY',
              semanticGroup: 'DATETIME'
            }
          },
          {
            name: 'add_adsIds_' + id,
            label: 'Ads Id pro kampan ' + id,
            dataType: 'NUMBER',
            group: 'adsDaily',
            semantics: {
              conceptType: 'DIMENSION'
            }
          },
          {
            name: 'adw_days_' + id,
            label: 'Statistiky inzerátů (týdenní) pro kampan ' + id,
            dataType: 'STRING',
            group: 'adsWeekly',
            semantics: {
              conceptType: 'DIMENSION',
              semanticType: 'YEAR_WEEK',
              semanticGroup: 'DATETIME'
            }
          },
          {
            name: 'adw_adsIds_' + id,
            label: 'Ads Id pro kampan ' + id,
            dataType: 'NUMBER',
            group: 'adsWeekly',
            semantics: {
              conceptType: 'DIMENSION'
            }
          },
          {
            name: 'adm_days_' + id,
            label: 'Statistiky inzerátů (měsíční) pro kampan ' + id,
            dataType: 'STRING',
            group: 'adsMonthly',
            semantics: {
              conceptType: 'DIMENSION',
              semanticType: 'YEAR_MONTH',
              semanticGroup: 'DATETIME'
            }
          },
          {
            name: 'adm_adsIds_' + id,
            label: 'Ads Id pro kampan ' + id,
            dataType: 'NUMBER',
            group: 'adsMonthly',
            semantics: {
              conceptType: 'DIMENSION'
            }
          }, {
            name: 'adq_days_' + id,
            label: 'Statistiky inzerátů (kvartální) pro kampan ' + id,
            dataType: 'STRING',
            group: 'adsQuarterly',
            semantics: {
              conceptType: 'DIMENSION',
              semanticType: 'YEAR_QUARTER',
              semanticGroup: 'DATETIME'
            }
          },
          {
            name: 'adq_adsIds_' + id,
            label: 'Ads Id pro kampan ' + id,
            dataType: 'NUMBER',
            group: 'adsQuarterly',
            semantics: {
              conceptType: 'DIMENSION'
            }
          },
          {
            name: 'ady_days_' + id,
            label: 'Statistiky inzerátů (roční) pro kampan ' + id,
            dataType: 'STRING',
            group: 'adsYearly',
            semantics: {
              conceptType: 'DIMENSION',
              semanticType: 'YEAR',
              semanticGroup: 'DATETIME'
            }
          },
          {
            name: 'ady_adsIds_' + id,
            label: 'Ads Id pro kampan ' + id,
            dataType: 'NUMBER',
            group: 'adsYearly',
            semantics: {
              conceptType: 'DIMENSION'
            }
          }
  
        ];
        schema = schema.concat(ad);
      }
      return schema;
  
    }
  
    this.standardGroupsSchema = function (schema) {
      var groups = [
        {
          name: 'gos_name',
          label: 'Název skupiny',
          dataType: 'STRING',
          group: 'groups',
          semantics: {
            conceptType: 'DIMENSION'
          }
        },
        {
          name: 'god_days',
          label: 'Statistiky skupin (denní)',
          dataType: 'STRING',
          group: 'groupsDaily',
          semantics: {
            conceptType: 'DIMENSION',
            semanticType: 'YEAR_MONTH_DAY',
            semanticGroup: 'DATETIME'
          }
        },
        {
          name: 'god_groupsIds',
          label: 'Groups Id',
          dataType: 'NUMBER',
          group: 'groupsDaily',
          semantics: {
            conceptType: 'DIMENSION'
          }
        },
        {
          name: 'gow_days',
          label: 'Statistiky skupin (týdenní)',
          dataType: 'STRING',
          group: 'groupsWeekly',
          semantics: {
            conceptType: 'DIMENSION',
            semanticType: 'YEAR_WEEK',
            semanticGroup: 'DATETIME'
          }
        },
        {
          name: 'gow_groupsIds',
          label: 'Groups Id',
          dataType: 'NUMBER',
          group: 'groupsWeekly',
          semantics: {
            conceptType: 'DIMENSION'
          }
        },
        {
          name: 'gom_days',
          label: 'Statistiky skupin (měsíční)',
          dataType: 'STRING',
          group: 'groupsMonthly',
          semantics: {
            conceptType: 'DIMENSION',
            semanticType: 'YEAR_MONTH',
            semanticGroup: 'DATETIME'
          }
        },
        {
          name: 'gom_groupsIds',
          label: 'Groups Id',
          dataType: 'NUMBER',
          group: 'groupsMonthly',
          semantics: {
            conceptType: 'DIMENSION'
          }
        },
        {
          name: 'goq_days',
          label: 'Statistiky skupin (kvartální)',
          dataType: 'STRING',
          group: 'groupsQuarterly',
          semantics: {
            conceptType: 'DIMENSION',
            semanticType: 'YEAR_QUARTER',
            semanticGroup: 'DATETIME'
          }
        },
        {
          name: 'goq_groupsIds',
          label: 'Groups Id',
          dataType: 'NUMBER',
          group: 'groupsQuarterly',
          semantics: {
            conceptType: 'DIMENSION'
          }
        },
        {
          name: 'goy_days',
          label: 'Statistiky skupin (roční)',
          dataType: 'STRING',
          group: 'groupsYearly',
          semantics: {
            conceptType: 'DIMENSION',
            semanticType: 'YEAR',
            semanticGroup: 'DATETIME'
          }
        },
        {
          name: 'goy_groupsIds',
          label: 'Groups Id',
          dataType: 'NUMBER',
          group: 'groupsYearly',
          semantics: {
            conceptType: 'DIMENSION'
          }
        }
  
      ];
      return schema.concat(groups);
    }
  
  
    this.extendGroupsSchema = function (schema, ids) {
      var idsArr = ids.split(',');
      var id;
      var groups;
      while (idsArr.length > 0) {
        id = idsArr.pop();
        groups = [
          {
            name: 'gos_name_' + id,
            label: 'Název skupin pro kampan ' + id,
            dataType: 'STRING',
            group: 'groups',
            semantics: {
              conceptType: 'DIMENSION'
            }
          },
          {
            name: 'god_days_' + id,
            label: 'Statistiky skupin (denní) pro kampan ' + id,
            dataType: 'STRING',
            group: 'groupsDaily',
            semantics: {
              conceptType: 'DIMENSION',
              semanticType: 'YEAR_MONTH_DAY',
              semanticGroup: 'DATETIME'
            }
          },
          {
            name: 'god_groupsIds_' + id,
            label: 'Groups Id pro kampan ' + id,
            dataType: 'NUMBER',
            group: 'groupsDaily',
            semantics: {
              conceptType: 'DIMENSION'
            }
          },
          {
            name: 'gow_days_' + id,
            label: 'Statistiky skupin (týdenní) pro kampan ' + id,
            dataType: 'STRING',
            group: 'groupsWeekly',
            semantics: {
              conceptType: 'DIMENSION',
              semanticType: 'YEAR_WEEK',
              semanticGroup: 'DATETIME'
            }
          },
          {
            name: 'gow_groupsIds_' + id,
            label: 'Groups Id pro kampan ' + id,
            dataType: 'NUMBER',
            group: 'groupsWeekly',
            semantics: {
              conceptType: 'DIMENSION'
            }
          },
          {
            name: 'gom_days_' + id,
            label: 'Statistiky skupin (měsíční) pro kampan ' + id,
            dataType: 'STRING',
            group: 'groupsMonthly',
            semantics: {
              conceptType: 'DIMENSION',
              semanticType: 'YEAR_MONTH',
              semanticGroup: 'DATETIME'
            }
          },
          {
            name: 'gom_groupsIds_' + id,
            label: 'Groups Id pro kampan ' + id,
            dataType: 'NUMBER',
            group: 'groupsMonthly',
            semantics: {
              conceptType: 'DIMENSION'
            }
          },
          {
            name: 'goq_days_' + id,
            label: 'Statistiky skupin (kvartální) pro kampan ' + id,
            dataType: 'STRING',
            group: 'groupsQuarterly',
            semantics: {
              conceptType: 'DIMENSION',
              semanticType: 'YEAR_QUARTER',
              semanticGroup: 'DATETIME'
            }
          },
          {
            name: 'goq_groupsIds_' + id,
            label: 'Groups Id pro kampan ' + id,
            dataType: 'NUMBER',
            group: 'groupsQuarterly',
            semantics: {
              conceptType: 'DIMENSION'
            }
          },
          {
            name: 'goy_days_' + id,
            label: 'Statistiky skupin (roční) pro kampan ' + id,
            dataType: 'STRING',
            group: 'groupsYearly',
            semantics: {
              conceptType: 'DIMENSION',
              semanticType: 'YEAR',
              semanticGroup: 'DATETIME'
            }
          },
          {
            name: 'goy_groupsIds_' + id,
            label: 'Groups Id pro kampan ' + id,
            dataType: 'NUMBER',
            group: 'groupsYearly',
            semantics: {
              conceptType: 'DIMENSION'
            }
          }
  
        ];
        schema = schema.concat(groups);
      }
      return schema;
    }
  }