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
  * clc - column u client (cl - client + c - column)
  * kwc - column u keywords (kw - keyword + c - column)
  * cgc - column u kampaně (cg - campaigns + c - column)
  * pic - column u productsets (pi - productset + c - column)
  * adc - column u ads (ad - ads + c - column)
  * bnc - column u bannerů (bn - banners + c - column)
  */
  this.SklikDataSchema = [
     
    /*
    * ######################################################
    * ############### SCHEMA FOR GRANULARITY ###############
    * ######################################################
    */    
    {
      name: 'daily',
      label: 'Po dnech',
      dataType: 'STRING',
      group: 'granularity',
      semantics: {
        conceptType: 'DIMENSION',
        semanticType: 'YEAR_MONTH_DAY',
        semanticGroup: 'DATETIME'
      }
    },

    {
      name: 'weekly',
      label: 'Po týdnech',
      dataType: 'STRING',
      group: 'granularity',
      semantics: {
        conceptType: 'DIMENSION',
        semanticType: 'YEAR_WEEK',
        semanticGroup: 'DATETIME'
      }
    },

    {
      name: 'monthly',
      label: 'Po měsících',
      dataType: 'STRING',
      group: 'granularity',
      semantics: {
        conceptType: 'DIMENSION',
        semanticType: 'YEAR_MONTH',
        semanticGroup: 'DATETIME'
      }
    },
    {
      name: 'quarterly',
      label: 'Po čtvrtletích',
      dataType: 'STRING',
      group: 'granularity',
      semantics: {
        conceptType: 'DIMENSION',
        semanticType: 'YEAR_QUARTER',
        semanticGroup: 'DATETIME'
      }
    },
    {
      name: 'yearly',
      label: 'Po rocích',
      dataType: 'STRING',
      group: 'granularity',
      semantics: {
        conceptType: 'DIMENSION',
        semanticType: 'YEAR',
        semanticGroup: 'DATETIME'
      }
    },
/*
    * #######################################################
    * ############### SCHEMA FOR PRODUCT SETS ###############
    * #######################################################
    */

{
  name: 'pic_avgCpc',
  label: 'Produktové skupiny: CPC Ø',
  dataType: 'NUMBER',
  group: 'productsets',
  semantics: {
    conceptType: 'METRIC'
  }
},
{
  name: 'pic_avgPos',
  label: 'Produktové skupiny: Pozice Ø',
  dataType: 'NUMBER',
  group: 'productsets',
  semantics: {
    conceptType: 'METRIC'
  }
},
{
  name: 'pic_clickMoney',
  label: 'Produktové skupiny: Cena za prokliky',
  dataType: 'NUMBER',
  group: 'productsets',
  semantics: {
    conceptType: 'METRIC'
  }
},
{
  name: 'pic_clickMoney_kc',
  label: 'Produktové skupiny: (Kč) Cena za prokliky',
  dataType: 'NUMBER',
  group: 'productsets',
  formula: 'pic_clickMoney*0.01',
    semantics: {
      conceptType: 'METRIC',          
      semanticType: 'CURRENCY_CZK',
      semanticGroup: 'CURRENCY'
    }
},
{
  name: 'pic_clicks',
  label: 'Produktové skupiny: Prokliky',
  dataType: 'NUMBER',
  group: 'productsets',
  semantics: {
    conceptType: 'METRIC'
  }
},
{
  name: 'pic_conversions',
  label: 'Produktové skupiny: Konverze',
  dataType: 'NUMBER',
  group: 'productsets',
  semantics: {
    conceptType: 'METRIC'
  }
},
{
  name: 'pic_conversionValue',
  label: 'Produktové skupiny: Hodnota konverze',
  dataType: 'NUMBER',
  group: 'productsets',
  semantics: {
    conceptType: 'METRIC'
  }
},
{
  name: 'pic_conversionValue_kc',
  label: 'Produktové skupiny: (Kč) Hodnota konverze',
  dataType: 'NUMBER',
  group: 'productsets',
  formula: 'pic_conversionValue*0.01',
    semantics: {
      conceptType: 'METRIC',          
      semanticType: 'CURRENCY_CZK',
      semanticGroup: 'CURRENCY'
    }
},
{
  name: 'pic_id',
  label: 'Produktové skupiny: ID Produktové skupiny',
  dataType: 'NUMBER',
  group: 'productsets',
  semantics: {
    conceptType: 'METRIC'
  }
},
{
  name: 'pic_impressions',
  label: 'Produktové skupiny: Zobrazení',
  dataType: 'NUMBER',
  group: 'productsets',
  semantics: {
    conceptType: 'METRIC'
  }
},
{
  name: 'pic_impressionMoney',
  label: 'Produktové skupiny: Cena za zobrazení',
  dataType: 'NUMBER',
  group: 'productsets',
  semantics: {
    conceptType: 'METRIC'
  }
},
{
  name: 'pic_impressionMoney_kc',
  label: 'Produktové skupiny: (Kč) Cena za zobrazení',
  dataType: 'NUMBER',
  group: 'productsets',
  formula: 'pic_impressionMoney*0.01',
  semantics: {
    conceptType: 'METRIC',          
    semanticType: 'CURRENCY_CZK',
    semanticGroup: 'CURRENCY'
  }
},{
  name: 'pic_totalMoney',
  label: 'Produktové skupiny: Cena celkem',
  dataType: 'NUMBER',
  group: 'productsets',
  semantics: {
    conceptType: 'METRIC'
  }
}, {
  name: 'pic_totalMoney_kc',
  label: 'Produktové skupiny: (Kč) Cena celkem',
  dataType: 'NUMBER',
  group: 'productsets',
  formula: 'pic_totalMoney*0.01',
  semantics: {
    conceptType: 'METRIC',          
    semanticType: 'CURRENCY_CZK',
    semanticGroup: 'CURRENCY'
  }
}, {
  name: 'pic_transactions',
  label: 'Produktové skupiny: Transakce',
  dataType: 'NUMBER',
  group: 'productsets',
  semantics: {
    conceptType: 'METRIC'
  }
},

    /*
    * #######################################################
    * ################# SCHEMA FOR KEYWORDS #################
    * #######################################################
    */

  {
    name: 'kwc_createDate',
    label: 'Klíčové slova: Datum vytvoření',
    dataType: 'STRING',
    group: 'keywords',
    semantics: {
      conceptType: 'DIMENSION'
    }
  },
  {
    name: 'kwc_deleteDate',
    label: 'Klíčové slova: Datum smazání',
    dataType: 'STRING',
    group: 'keywords',
    semantics: {
      conceptType: 'DIMENSION'
    }
  },
  {
    name: 'kwc_deleted',
    label: 'Klíčové slova: Smazané',
    dataType: 'STRING',
    group: 'keywords',
    semantics: {
      conceptType: 'DIMENSION'
    }
  },
  {
    name: 'kwc_disabled',
    label: 'Klíčové slova: Zakázané',
    dataType: 'STRING',
    group: 'keywords',
    semantics: {
      conceptType: 'DIMENSION'
    }
  },
  {
    name: 'kwc_status',
    label: 'Klíčové slova: Stav',
    dataType: 'STRING',
    group: 'keywords',
    semantics: {
      conceptType: 'DIMENSION'
    }
  },
  {
    name: 'kwc_url',
    label: 'Klíčové slova: Cílová URL klíčového slova',
    dataType: 'STRING',
    group: 'keywords',
    semantics: {
      conceptType: 'DIMENSION'
    }
  },
  {
    name: 'kwc_isRegisteredBrand',
    label: 'Klíčové slova: Registrovaná značka',
    dataType: 'STRING',
    group: 'keywords',
    semantics: {
      conceptType: 'DIMENSION'
    }
  },
  {
    name: 'kwc_isUnsuitable',
    label: 'Klíčové slova: Vhodnost klíčového slova',
    dataType: 'STRING',
    group: 'keywords',
    semantics: {
      conceptType: 'DIMENSION'
    }
  },
  {
    name: 'kwc_isTooGeneric',
    label: 'Klíčové slova: Obecné klíčové slovo',
    dataType: 'STRING',
    group: 'keywords',
    semantics: {
      conceptType: 'DIMENSION'
    }
  },
  {
    name: 'kwc_isGloballyDisabled',
    label: 'Klíčové slova: Globálně zakázané klíčové slovo',
    dataType: 'STRING',
    group: 'keywords',
    semantics: {
      conceptType: 'DIMENSION'
    }
  },
  {
    name: 'kwc_isTrademark',
    label: 'Klíčové slova: Ochranná známka',
    dataType: 'STRING',
    group: 'keywords',
    semantics: {
      conceptType: 'DIMENSION'
    }
  },
  {
    name: 'kwc_isSuspicious',
    label: 'Klíčové slova: Podezřelé klíčové slovo',
    dataType: 'STRING',
    group: 'keywords',
    semantics: {
      conceptType: 'DIMENSION'
    }
  },
  {
    name: 'kwc_statusId',
    label: 'Klíčové slova: ID stavu',
    dataType: 'NUMBER',
    group: 'keywords',
    semantics: {
      conceptType: 'METRIC'
    }
  },
  {
    name: 'kwc_cpc',
    label: 'Klíčové slova: CPC',
    dataType: 'NUMBER',
    group: 'keywords',
    semantics: {
      conceptType: 'METRIC'
    }
  },

  {
    name: 'kwc_avgCpc',
    label: 'Klíčové slova: CPC Ø',
    dataType: 'NUMBER',
    group: 'keywords',
    semantics: {
      conceptType: 'METRIC'
    }
  },

  {
    name: 'kwc_avgPos',
    label: 'Klíčové slova: Pozice Ø',
    dataType: 'NUMBER',
    group: 'keywords',
    semantics: {
      conceptType: 'METRIC'
    }
  },
  
  {
    name: 'kwc_clickMoney',
    label: 'Klíčové slova: Cena za prokliky',
    dataType: 'NUMBER',
    group: 'keywords',
    semantics: {
      conceptType: 'METRIC'
    }
  },
  {
    name: 'kwc_clickMoney_kc',
    label: 'Klíčové slova: (Kč) Cena za prokliky',
    dataType: 'NUMBER',
    group: 'keywords',
    formula: 'kwc_clickMoney*0.01',
      semantics: {
        conceptType: 'METRIC',          
        semanticType: 'CURRENCY_CZK',
        semanticGroup: 'CURRENCY'
      }
  },

  {
    name: 'kwc_clicks',
    label: 'Klíčové slova: Prokliky',
    dataType: 'NUMBER',
    group: 'keywords',
    semantics: {
      conceptType: 'METRIC'
    }
  },

  {
    name: 'kwc_conversions',
    label: 'Klíčové slova: Konverze',
    dataType: 'NUMBER',
    group: 'client',
    semantics: {
      conceptType: 'METRIC'
    }
  },

  {
    name: 'kwc_conversionValue',
    label: 'Klíčové slova: Hodnota konverze',
    dataType: 'NUMBER',
    group: 'keywords',
    semantics: {
      conceptType: 'METRIC'
    }
  },
  {
    name: 'kwc_conversionValue_kc',
    label: 'Klíčové slova: (Kč) Hodnota konverze',
    dataType: 'NUMBER',
    group: 'keywords',
    formula: 'kwc_conversionValue*0.01',
      semantics: {
        conceptType: 'METRIC',          
        semanticType: 'CURRENCY_CZK',
        semanticGroup: 'CURRENCY'
      }
  },

  {
    name: 'kwc_impressionMoney',
    label: 'Klíčové slova: Cena za zobrazení',
    dataType: 'NUMBER',
    group: 'keywords',
    semantics: {
      conceptType: 'METRIC'
    }
  },
  {
    name: 'kwc_impressionMoney_kc',
    label: 'Klíčové slova: (Kč) Cena za zobrazení',
    dataType: 'NUMBER',
    group: 'keywords',
    formula: 'kwc_impressionMoney*0.01',
    semantics: {
      conceptType: 'METRIC',          
      semanticType: 'CURRENCY_CZK',
      semanticGroup: 'CURRENCY'
    }
  },
  {
    name: 'kwc_totalMoney',
    label: 'Klíčové slova: Cena',
    dataType: 'NUMBER',
    group: 'keywords',
    semantics: {
      conceptType: 'METRIC'
    }
  },
  {
    name: 'kwc_totalMoney_kc',
    label: 'Klíčové slova: (Kč) Cena',
    dataType: 'NUMBER',
    group: 'keywords',
    formula: 'kwc_totalMoney*0.01',
    semantics: {
      conceptType: 'METRIC',          
      semanticType: 'CURRENCY_CZK',
      semanticGroup: 'CURRENCY'
    }
  },
  {
    name: 'kwc_transactions',
    label: 'Klíčové slova: Transakce',
    dataType: 'NUMBER',
    group: 'keywords',
    semantics: {
      conceptType: 'METRIC'
    }
  },
  {
    name: 'kwc_transactions_kc',
    label: 'Klíčové slova: (Kč) Transakce',
    dataType: 'NUMBER',
    group: 'keywords',
    formula: 'kwc_transactions*0.01',
    semantics: {
      conceptType: 'METRIC',          
      semanticType: 'CURRENCY_CZK',
      semanticGroup: 'CURRENCY'
    }
  },
  {
    name: 'kwc_missImpressions',
    label: 'Klíčové slova: Ztracená zobrazení',
    dataType: 'NUMBER',
    group: 'keywords',
    semantics: {
      conceptType: 'METRIC'
    }
  },
  {
    name: 'kwc_underLowerThreshold',
    label: 'Klíčové slova: Ztracená zobrazení -  nízké cpc',
    dataType: 'NUMBER',
    group: 'keywords',
    semantics: {
      conceptType: 'METRIC'
    }
  },
  {
    name: 'kwc_exhaustedBudget',
    label: 'Klíčové slova: Ztracená zobrazení - rozpočet',
    dataType: 'NUMBER',
    group: 'keywords',
    semantics: {
      conceptType: 'METRIC'
    }
  },
  {
    name: 'kwc_stoppedBySchedule',
    label: 'Klíčové slova: Ztracená zobrazení - časové plánování',
    dataType: 'NUMBER',
    group: 'keywords',
    semantics: {
      conceptType: 'METRIC'
    }
  },
  {
    name: 'kwc_underForestThreshold',
    label: 'Klíčové slova: Ztracená zobrazení - nízký rank',
    dataType: 'NUMBER',
    group: 'keywords',
    semantics: {
      conceptType: 'METRIC'
    }
  },
  {
    name: 'kwc_exhaustedBudgetShare',
    label: 'Klíčové slova: Ztracená zobrazení - sdílený rozpočet',
    dataType: 'NUMBER',
    group: 'keywords',
    semantics: {
      conceptType: 'METRIC'
    }
  },
  {
    name: 'kwc_ctr',
    label: 'Klíčové slova: CTR',
    dataType: 'NUMBER',
    group: 'keywords',
    semantics: {
      conceptType: 'METRIC'
    }
  },
  {
    name: 'kwc_pno',
    label: 'Klíčové slova: PNO',
    dataType: 'NUMBER',
    group: 'keywords',
    semantics: {
      conceptType: 'METRIC'
    }
  },
  {
    name: 'kwc_ish',
    label: 'Klíčové slova: Podíl ztracených zobrazení - vyhledávací síť',
    dataType: 'NUMBER',
    group: 'keywords',
    semantics: {
      conceptType: 'METRIC'
    }
  },
  {
    name: 'kwc_ishContext',
    label: 'Klíčové slova: Podíl ztracených zobrazení - obsahová síť',
    dataType: 'NUMBER',
    group: 'keywords',
    semantics: {
      conceptType: 'METRIC'
    }
  },
  {
    name: 'kwc_ishSum',
    label: 'Klíčové slova: Podíl ztracených zobrazení',
    dataType: 'NUMBER',
    group: 'keywords',
    semantics: {
      conceptType: 'METRIC'
    }
  },
    {
      name: 'kwc_name',
      label: 'Klíčové slova: Klíčové slovo',
      dataType: 'STRING',
      group: 'keywords',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'kwc_impressions',
      label: 'Klíčové slova: Zobrazení',
      dataType: 'NUMBER',
      group: 'keywords',
      semantics: {
        conceptType: 'METRIC'
      }
    },


    /*
    * #######################################################
    * ################## SCHEMA FOR CLIENT ##################
    * #######################################################
    */
    {
      name: 'cgc_type',
      label: 'Kampaň: Typ kampaně',
      dataType: 'STRING',
      group: 'campaigns',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'cgc_avgConValue',
      label: 'Kampaň: Průměrná hodnota objednávky',
      dataType: 'NUMBER',
      group: 'campaigns',
      formula: 'cgc_conversionValue/cgc_conversions',
      semantics: {
        conceptType: 'METRIC',          
        semanticType: 'CURRENCY_CZK',
        semanticGroup: 'CURRENCY'
      }
    },
    {
      name: 'cgc_conValue',
      label: 'Kampaň: Cena konverze',
      dataType: 'NUMBER',
      group: 'campaigns',
      formula: 'goc_totalMoney_kc/cgc_conversions',
      semantics: {
        conceptType: 'METRIC',          
        semanticType: 'CURRENCY_CZK',
        semanticGroup: 'CURRENCY'
      }
    },
    {
      name: 'clc_impressions',
      label: 'Účet: Zobrazení',
      dataType: 'NUMBER',
      group: 'client',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'clc_clicks',
      label: 'Účet: Prokliky',
      dataType: 'NUMBER',
      group: 'client',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'clc_ctr',
      label: 'Účet: CTR',
      dataType: 'NUMBER',
      group: 'client',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'clc_cpc',
      label: 'Účet: CPC',
      dataType: 'NUMBER',
      group: 'client',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'clc_price',
      label: 'Účet: Celkové náklady',
      dataType: 'NUMBER',
      group: 'client',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'clc_price_kc',
      label: 'Účet: (Kč) Celkové náklady',
      dataType: 'NUMBER',
      group: 'client',
      formula: 'clc_price*0.01',
      semantics: {
        conceptType: 'METRIC',          
        semanticType: 'CURRENCY_CZK',
        semanticGroup: 'CURRENCY'
      }
    },
    {
      name: 'clc_avgPosition',
      label: 'Účet: Průměrná pozice',
      dataType: 'NUMBER',
      group: 'client',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'clc_conversions',
      label: 'Účet: Konverze',
      dataType: 'NUMBER',
      group: 'client',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'clc_conversionRatio',
      label: 'Účet: Konverzní poměr',
      dataType: 'NUMBER',
      group: 'client',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'clc_conversionAvgPrice',
      label: 'Účet: Cena konverze',
      dataType: 'NUMBER',
      group: 'client',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'clc_conversionAvgPrice_kc',
      label: 'Účet: (Kč) Cena konverze',
      dataType: 'NUMBER',
      group: 'client',
      formula: 'clc_conversionAvgPrice*0.01',
      semantics: {
        conceptType: 'METRIC',          
        semanticType: 'CURRENCY_CZK',
        semanticGroup: 'CURRENCY'
      }
    },
    {
      name: 'clc_conversionValue',
      label: 'Účet: Hodnota konverze',
      dataType: 'NUMBER',
      group: 'client',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'clc_conversionValue_kc',
      label: 'Účet: (Kč) Hodnota konverze',
      dataType: 'NUMBER',
      group: 'client',
      formula: 'clc_conversionValue*0.01',
      semantics: {
        conceptType: 'METRIC',          
        semanticType: 'CURRENCY_CZK',
        semanticGroup: 'CURRENCY'
      }
    },
    {
      name: 'clc_conversionAvgValue',
      label: 'Účet: Hodnota konverze Ø',
      dataType: 'NUMBER',
      group: 'client',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'clc_conversionAvgValue_kc',
      label: 'Účet: (Kč) Hodnota konverze Ø',
      dataType: 'NUMBER',
      group: 'client',
      formula: 'clc_conversionAvgValue*0.01',
      semantics: {
        conceptType: 'METRIC',          
        semanticType: 'CURRENCY_CZK',
        semanticGroup: 'CURRENCY'
      }
    },
    {
      name: 'clc_transactionAvgPrice',
      label: 'Účet: Cena transakce Ø',
      dataType: 'NUMBER',
      group: 'client',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'clc_transactionAvgPrice_kc',
      label: 'Účet: (Kč) Cena transakce Ø',
      dataType: 'NUMBER',
      group: 'client',
      formula: 'clc_transactionAvgPrice*0.01',
      semantics: {
        conceptType: 'METRIC',          
        semanticType: 'CURRENCY_CZK',
        semanticGroup: 'CURRENCY'
      }
    },
    {
      name: 'clc_transactionAvgValue',
      label: 'Účet: Hodnota transakce Ø',
      dataType: 'NUMBER',
      group: 'client',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'clc_transactionAvgValue_kc',
      label: 'Účet: (Kč) Hodnota transakce Ø',
      dataType: 'NUMBER',
      group: 'client',
      formula: 'clc_transactionAvgValue*0.01',
      semantics: {
        conceptType: 'METRIC',          
        semanticType: 'CURRENCY_CZK',
        semanticGroup: 'CURRENCY'
      }
    },
    {
      name: 'clc_transactionAvgCount',
      label: 'Účet: Počet transakcí na konverzi Ø',
      dataType: 'NUMBER',
      group: 'client',
      semantics: {
        conceptType: 'METRIC'
      }
    },

    /*
    * ########################################################
    * ################# SCHEMA FOR CAMPAIGNS #################
    * ########################################################
    */
    {
      name: 'cgc_actualClicks',
      label: 'Kampaň: Aktuální prokliky',
      dataType: 'NUMBER',
      group: 'campaigns',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'cgc_automaticLocation',
      label: 'Kampaň: Zapnutí automatické lokace',
      dataType: 'STRING',
      group: 'campaigns',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'cgc_adSelection',
      label: 'Kampaň: Způsob střídání inzerátů',
      dataType: 'STRING',
      group: 'campaigns',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'cgc_context',
      label: 'Kampaň: Obsahová kampaň',
      dataType: 'STRING',
      group: 'campaigns',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'cgc_contextNetwork',
      label: 'Kampaň: Obsahová síť',
      dataType: 'STRING',
      group: 'campaigns',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'cgc_createDate',
      label: 'Kampaň: Datum vytvoření',
      dataType: 'STRING',
      group: 'campaigns',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'cgc_deleted',
      label: 'Kampaň: Smazaná',
      dataType: 'STRING',
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
      name: 'cgc_devicesPriceRatio_desktop',
      label: 'Kampaň: Cílení na desktopy',
      dataType: 'NUMBER',
      group: 'campaigns',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'cgc_devicesPriceRatio_tablet',
      label: 'Kampaň: Cílení na tablety',
      dataType: 'NUMBER',
      group: 'campaigns',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'cgc_devicesPriceRatio_mobile',
      label: 'Kampaň: Cílení na mobily',
      dataType: 'NUMBER',
      group: 'campaigns',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'cgc_devicesPriceRatio_other',
      label: 'Kampaň: Cílení na ostatní multimediální zařízení',
      dataType: 'NUMBER',
      group: 'campaigns',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'cgc_endDate',
      label: 'Kampaň: Konec kampaně',
      dataType: 'STRING',
      group: 'campaigns',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'cgc_exhaustedTotalBudget',
      label: 'Kampaň: Vyčerpaný rozpočet',
      dataType: 'NUMBER',
      group: 'campaigns',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'cgc_exhaustedTotalBudget_kc',
      label: 'Kampaň: (Kč) Vyčerpaný rozpočet',
      dataType: 'NUMBER',
      group: 'campaigns',
      formula: 'cgc_exhaustedTotalBudget*0.01',
      semantics: {
        conceptType: 'METRIC',          
        semanticType: 'CURRENCY_CZK',
        semanticGroup: 'CURRENCY'
      }
    },
    {
      name: 'cgc_fulltext',
      label: 'Kampaň: Vyhledávací kampaň',
      dataType: 'STRING',
      group: 'campaigns',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      isDefault: true,
      name: 'cgc_name',
      label: 'Kampaň: Název',
      dataType: 'STRING',
      semantics: {
        conceptType: 'DIMENSION',
        semanticType: 'TEXT'
      },
      group: 'campaigns'
    },
    {
      name: 'cgc_paymentMethod',
      label: 'Kampaň: Způsob zpoplatnění',
      dataType: 'STRING',
      group: 'campaigns',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'cgc_startDate',
      label: 'Kampaň: Začátek kampaně',
      dataType: 'STRING',
      group: 'campaigns',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'cgc_status',
      label: 'Kampaň: Stav',
      dataType: 'STRING',
      group: 'campaigns',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'cgc_totalClicks',
      label: 'Kampaň: Celkový počet prokliků od měřeného data',
      dataType: 'NUMBER',
      group: 'campaigns',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'cgc_totalClicksFrom',
      label: 'Kampaň: Datum začátku měření celkového počtu prokliků',
      dataType: 'STRING',
      group: 'campaigns',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'cgc_totalBudget',
      label: 'Kampaň: Rozpočet',
      dataType: 'NUMBER',
      group: 'campaigns',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'cgc_totalBudget_kc',
      label: 'Kampaň: (Kč) Rozpočet',
      dataType: 'NUMBER',
      group: 'campaigns',
      formula: 'cgc_totalBudget*0.01',
      semantics: {
        conceptType: 'METRIC',          
        semanticType: 'CURRENCY_CZK',
        semanticGroup: 'CURRENCY'
      }
    },
    {
      name: 'cgc_avgCpc',
      label: 'Kampaň: CPC Ø',
      dataType: 'NUMBER',
      group: 'campaigns',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'cgc_avgCpc_kc',
      label: 'Kampaň: (Kč) CPC Ø',
      dataType: 'NUMBER',
      group: 'campaigns',
      formula: 'cgc_avgCpc*0.01',
      semantics: {
        conceptType: 'METRIC',          
        semanticType: 'CURRENCY_CZK',
        semanticGroup: 'CURRENCY',
        defaultAggregationType: 'AVG'
      }
    },
    {
      name: 'cgc_avgPos',
      label: 'Kampaň: Pozice Ø',
      dataType: 'NUMBER',
      group: 'campaigns',
      semantics: {
        conceptType: 'METRIC',
        defaultAggregationType: 'AVG'
      }
    },
    {
      name: 'cgc_clickMoney',
      label: 'Kampaň: Cena za prokliky',
      dataType: 'NUMBER',
      group: 'campaigns',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'cgc_clickMoney_kc',
      label: 'Kampaň: (Kč) Cena za prokliky',
      dataType: 'NUMBER',
      formula: "cgc_clickMoney*0.01",
      group: 'campaigns',
      semantics: {
        conceptType: 'METRIC',          
        semanticType: 'CURRENCY_CZK',
        semanticGroup: 'CURRENCY'
      }
    },
    {
      name: 'cgc_clicks',
      label: 'Kampaň: Prokliky',
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
      label: 'Kampaň: Cena za zobrazení',
      dataType: 'NUMBER',
      group: 'campaigns',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'cgc_impressionMoney_kc',
      label: 'Kampaň: (Kč) Cena za zobrazení',
      dataType: 'NUMBER',
      group: 'campaigns',
      formula: 'cgc_impressionMoney*0.01',
      semantics: {
        conceptType: 'METRIC',          
        semanticType: 'CURRENCY_CZK',
        semanticGroup: 'CURRENCY'
      }
    },
    {
      isDefault: true,
      name: 'cgc_impressions',
      label: 'Kampaň: Zobrazení',
      dataType: 'NUMBER',
      group: 'campaigns',            
      semantics: {
        conceptType: 'METRIC',
         semanticType: 'NUMBER'
      }
      
    },
    {
      name: 'cgc_totalMoney',
      label: 'Kampaň: Cena',
      dataType: 'NUMBER',
      group: 'campaigns',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'cgc_totalMoney_kc',
      label: 'Kampaň: (Kč) Cena',
      dataType: 'NUMBER',
      group: 'campaigns',
      formula: 'cgc_totalMoney*0.01',
      semantics: {
        conceptType: 'METRIC',          
        semanticType: 'CURRENCY_CZK',
        semanticGroup: 'CURRENCY'
      }
    },
    {
      name: 'cgc_transactions',
      label: 'Kampaň: Transakce',
      dataType: 'NUMBER',
      group: 'campaigns',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'cgc_missImpressions',
      label: 'Kampaň: Ztracená zobrazení',
      dataType: 'NUMBER',
      group: 'campaigns',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'cgc_underLowerThreshold',
      label: 'Kampaň: Ztracená zobrazení - nízké cpc',
      dataType: 'NUMBER',
      group: 'campaigns',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'cgc_exhaustedBudget',
      label: 'Kampaň: Ztracená zobrazení - rozpočet',
      dataType: 'NUMBER',
      group: 'campaigns',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'cgc_stoppedBySchedule',
      label: 'Kampaň: Ztracená zobrazení - časové plánování',
      dataType: 'NUMBER',
      group: 'campaigns',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'cgc_underForestThreshold',
      label: 'Kampaň: Ztracená zobrazení - nízký rank',
      dataType: 'NUMBER',
      group: 'campaigns',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'cgc_exhaustedBudgetShare',
      label: 'Kampaň: Ztracená zobrazení - sdílený rozpočet',
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
        conceptType: 'METRIC',
        defaultAggregationType: 'AVG'
      }
    },
    {
      name: 'cgc_pno',
      label: 'Kampaň: PNO',
      dataType: 'NUMBER',
      group: 'campaigns',
      semantics: {
        conceptType: 'METRIC',
        defaultAggregationType: 'AVG'
      }
    },
    {
      name: 'cgc_ish',
      label: 'Kampaň: Podíl ztracených zobrazení - vyhledávací síť',
      dataType: 'NUMBER',
      group: 'campaigns',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'cgc_ishContext',
      label: 'Kampaň: Podíl ztracených zobrazení - obsahová síť',
      dataType: 'NUMBER',
      group: 'campaigns',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'cgc_ishSum',
      label: 'Kampaň: Podíl ztracených zobrazení',
      dataType: 'NUMBER',
      group: 'campaigns',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'cgc_id',
      label: 'Kampaň: ID kampaně',
      dataType: 'NUMBER',
      group: 'campaigns',
      semantics: {
        conceptType: 'METRIC'
      }
    },


    //####################################### Groups columns 
    {
      name: 'goc_createDate',
      label: 'Sestava: Datum vytvoření',
      dataType: 'STRING',
      group: 'groups',
      semantics: {
        conceptType: 'DIMENSION'
      }
    }, {
      name: 'goc_deleted',
      label: 'Sestava: Smazaná',
      dataType: 'STRING',
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
      label: 'Sestava: ID',
      dataType: 'NUMBER',
      group: 'groups',
      semantics: {
        conceptType: 'METRIC'
      }
    }, {
      name: 'goc_maxCpc',
      label: 'Sestava: Max. CPC',
      dataType: 'NUMBER',
      group: 'groups',
      semantics: {
        conceptType: 'METRIC'
      }
    },  {
      name: 'goc_maxUserDailyImpressions',
      label: 'Sestava: Zobrazení jednomu uživateli za den',
      dataType: 'NUMBER',
      group: 'groups',
      semantics: {
        conceptType: 'METRIC'
      }
    }, {
      name: 'goc_maxCpt',
      label: 'Sestava: Max. CPT',
      dataType: 'NUMBER',
      group: 'groups',
      semantics: {
        conceptType: 'METRIC',          
        semanticType: 'CURRENCY_CZK',
        semanticGroup: 'CURRENCY'
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
      label: 'Sestava: Erotická reklama',
      dataType: 'STRING',
      group: 'groups',
      semantics: {
        conceptType: 'DIMENSION'
      }
    }, {
      name: 'goc_status',
      label: 'Sestava: Stav',
      dataType: 'STRING',
      group: 'groups',
      semantics: {
        conceptType: 'DIMENSION'
      }
    }, {
      name: 'goc_statusId',
      label: 'Sestava: ID stavu',
      dataType: 'NUMBER',
      group: 'groups',
      semantics: {
        conceptType: 'METRIC'
      }
    }, {
      name: 'goc_avgCpc',
      label: 'Sestava: CPC Ø',
      dataType: 'NUMBER',
      group: 'groups',
      semantics: {
        conceptType: 'METRIC',          
        semanticType: 'CURRENCY_CZK',
        semanticGroup: 'CURRENCY',
        defaultAggregationType: 'AVG'
      }
    }, {
      name: 'goc_avgPos',
      label: 'Sestava: Pozice Ø',
      dataType: 'NUMBER',
      group: 'groups',
      semantics: {
        conceptType: 'METRIC',          
        defaultAggregationType: 'AVG'
      }
    }, {
      name: 'goc_clickMoney',
      label: 'Sestava: Cena za prokliky',
      dataType: 'NUMBER',
      group: 'groups',
      semantics: {
        conceptType: 'METRIC'
      }
    }, {
      name: 'goc_clickMoney_kc',
      label: 'Sestava: (Kč) Cena za prokliky',
      dataType: 'NUMBER',
      group: 'groups',
      formula: 'goc_clickMoney*0.01',
      semantics: {
        conceptType: 'METRIC',          
        semanticType: 'CURRENCY_CZK',
        semanticGroup: 'CURRENCY'
      }
    },

    {
      name: 'goc_clicks',
      label: 'Sestava: Prokliky',
      dataType: 'NUMBER',
      group: 'groups',
      semantics: {
        conceptType: 'METRIC'
      }
    }, {
      name: 'goc_conversions',
      label: 'Sestava: Konverze',
      dataType: 'NUMBER',
      group: 'groups',
      semantics: {
        conceptType: 'METRIC'
      }
    }, {
      name: 'goc_conversionValue',
      label: 'Sestava: Hodnota Cena konverze',
      dataType: 'NUMBER',
      group: 'groups',
      semantics: {
        conceptType: 'METRIC'
      }
    }, {
      name: 'goc_conversionValue_kc',
      label: 'Sestava: (Kč) Hodnota Cena konverze',
      dataType: 'NUMBER',
      group: 'groups',
      formula: 'goc_conversionValue*0.01',
      semantics: {
        conceptType: 'METRIC',          
        semanticType: 'CURRENCY_CZK',
        semanticGroup: 'CURRENCY'
      }
    },
    {
      name: 'goc_impressionMoney',
      label: 'Sestava: Cena za zobrazení',
      dataType: 'NUMBER',
      group: 'groups',
      semantics: {
        conceptType: 'METRIC'
      }
    }, {
      name: 'goc_impressionMoney_kc',
      label: 'Sestava: (Kč) Cena za zobrazení',
      dataType: 'NUMBER',
      group: 'groups',
      formula: 'goc_impressionMoney*0.01',
      semantics: {
        conceptType: 'METRIC',          
        semanticType: 'CURRENCY_CZK',
        semanticGroup: 'CURRENCY',
        defaultAggregationType: 'AVG'
      }
    },
    {
      name: 'goc_impressions',
      label: 'Sestava: Zobrazení',
      dataType: 'NUMBER',
      group: 'groups',
      semantics: {
        conceptType: 'METRIC'
      }
    }, {
      name: 'goc_totalMoney',
      label: 'Sestava: Cena celkem',
      dataType: 'NUMBER',
      group: 'groups',
      semantics: {
        conceptType: 'METRIC'
      }
    }, {
      name: 'goc_totalMoney_kc',
      label: 'Sestava: (Kč) Cena celkem',
      dataType: 'NUMBER',
      group: 'groups',
      formula: 'goc_totalMoney*0.01',
      semantics: {
        conceptType: 'METRIC',          
        semanticType: 'CURRENCY_CZK',
        semanticGroup: 'CURRENCY'
      }
    },
    {
      name: 'goc_transactions',
      label: 'Sestava: Transakce',
      dataType: 'NUMBER',
      group: 'groups',
      semantics: {
        conceptType: 'METRIC'
      }
    }, {
      name: 'goc_missImpressions',
      label: 'Sestava: Ztracená zobrazení',
      dataType: 'NUMBER',
      group: 'groups',
      semantics: {
        conceptType: 'METRIC'
      }
    }, {
      name: 'goc_underLowerThreshold',
      label: 'Sestava: Ztracená zobrazení - nízké cpc',
      dataType: 'NUMBER',
      group: 'groups',
      semantics: {
        conceptType: 'METRIC'
      }
    }, {
      name: 'goc_exhaustedBudget',
      label: 'Sestava: Ztracená zobrazení - rozpočet',
      dataType: 'NUMBER',
      group: 'groups',
      semantics: {
        conceptType: 'METRIC'
      }
    }, {
      name: 'goc_stoppedBySchedule',
      label: 'Sestava: Ztracená zobrazení - časové plánování',
      dataType: 'NUMBER',
      group: 'groups',
      semantics: {
        conceptType: 'METRIC'
      }
    }, {
      name: 'goc_underForestThreshold',
      label: 'Sestava: Ztracená zobrazení - nízký rank',
      dataType: 'NUMBER',
      group: 'groups',
      semantics: {
        conceptType: 'METRIC'
      }
    }, {
      name: 'goc_exhaustedBudgetShare',
      label: 'Sestavy: Ztracená zobrazení - sdílený rozpočet',
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
        conceptType: 'METRIC',
        defaultAggregationType: 'AVG'
      }
    }, {
      name: 'goc_pno',
      label: 'Sestava: PNO',
      dataType: 'NUMBER',
      group: 'groups',
      semantics: {
        conceptType: 'METRIC',
        defaultAggregationType: 'AVG'
      }
    }, {
      name: 'goc_ish',
      label: 'Sestava: Podíl ztracených zobrazení - vyhledávací síť',
      dataType: 'NUMBER',
      group: 'groups',
      semantics: {
        conceptType: 'METRIC'
      }
    }, {
      name: 'goc_ishContext',
      label: 'Sestava: Podíl ztracených zobrazení - obsahová síť',
      dataType: 'NUMBER',
      group: 'groups',
      semantics: {
        conceptType: 'METRIC'
      }
    }, {
      name: 'goc_ishSum',
      label: 'Sestava: Podíl ztracených zobrazení',
      dataType: 'NUMBER',
      group: 'groups',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    //####################################### Ads columns 
    {
      name: 'adc_viewershipRate_firstQuartile',
      label: 'Inzerát: Video - 25%',
      dataType: 'NUMBER',
      group: 'ads',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'adc_viewershipRate_midpoint',
      label: 'Inzerát: Video - 50%',
      dataType: 'NUMBER',
      group: 'ads',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'adc_viewershipRate_thirdQuartile',
      label: 'Inzerát: Video - 75%',
      dataType: 'NUMBER',
      group: 'ads',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'adc_viewershipRate_complete',
      label: 'Inzerát: Video - 100%',
      dataType: 'NUMBER',
      group: 'ads',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'adc_adStatus',
      label: 'Inzerát: Stav',
      dataType: 'STRING',
      group: 'ads',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'adc_adType',
      label: 'Inzerát: Typ',
      dataType: 'STRING',
      group: 'ads',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'adc_clickthruText',
      label: 'Inzerát: Viditelná URL',
      dataType: 'STRING',
      group: 'ads',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'adc_clickthruUrl',
      label: 'Inzerát: Cílová URL',
      dataType: 'STRING',
      group: 'ads',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'adc_createDate',
      label: 'Inzerát: Datum vytvoření',
      dataType: 'STRING',
      group: 'ads',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'adc_creative1',
      label: 'Inzerát: STA text 1',
      dataType: 'STRING',
      group: 'ads',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'adc_creative2',
      label: 'Inzerát: STA text 2',
      dataType: 'STRING',
      group: 'ads',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'adc_creative3',
      label: 'Inzerát: STA text 3',
      dataType: 'STRING',
      group: 'ads',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'adc_deleted',
      label: 'Inzerát: Smazaný',
      dataType: 'STRING',
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
      label: 'Inzerát: ETA - Popisek',
      dataType: 'STRING',
      group: 'ads',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'adc_finalUrl',
      label: 'Inzerát: ETA - cílová URL',
      dataType: 'STRING',
      group: 'ads',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'adc_headline1',
      label: 'Inzerát: ETA - Titulek 1',
      dataType: 'STRING',
      group: 'ads',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'adc_headline2',
      label: 'Inzerát: ETA - Titulek 2',
      dataType: 'STRING',
      group: 'ads',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'adc_id',
      label: 'Inzerát: ID',
      dataType: 'NUMBER',
      group: 'ads',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'adc_path1',
      label: 'Inzerát: ETA - Cesta 1',
      dataType: 'STRING',
      group: 'ads',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'adc_path2',
      label: 'Inzerát: ETA - Cesta 2',
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
      label: 'Inzerát: Kombinovaná - ID obdélníkového obrázku',
      dataType: 'NUMBER',
      group: 'ads',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'adc_image.url',
      label: 'Inzerát: Kombinovaná - URL obdélníkového obrázku',
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
      label: 'Inzerát: Kombinovaná - URL na logo',
      dataType: 'STRING',
      group: 'ads',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'adc_imageSquare.id',
      label: 'Inzerát: Kombinovaná - ID čtvercového obrázku',
      dataType: 'NUMBER',
      group: 'ads',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'adc_imageSquare.url',
      label: 'Inzerát: Kombinovaná - URL čtvercového obrázku',
      dataType: 'STRING',
      group: 'ads',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'adc_imageLandscapeLogo.id',
      label: 'Inzerát: Kombinovaná - ID obdélníkového loga',
      dataType: 'NUMBER',
      group: 'ads',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'adc_imageLandscapeLogo.url',
      label: 'Inzerát: Kombinovaná - URL obdélníkového loga',
      dataType: 'STRING',
      group: 'ads',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'adc_premiseId',
      label: 'Inzerát: ID provozovny',
      dataType: 'NUMBER',
      group: 'ads',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'adc_premiseModeId',
      label: 'Inzerát: ID typu zobrazování pobočky',
      dataType: 'NUMBER',
      group: 'ads',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'adc_premiseMode',
      label: 'Inzerát: Typ zobrazování pobočky',
      dataType: 'STRING',
      group: 'ads',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'adc_sensitivity',
      label: 'Inzerát: Erotická reklama',
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
      label: 'Inzerát: Měřicí šablona',
      dataType: 'STRING',
      group: 'ads',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'adc_avgCpc',
      label: 'Inzerát: CPC Ø',
      dataType: 'NUMBER',
      group: 'ads',
      semantics: {
        conceptType: 'METRIC',          
        semanticType: 'CURRENCY_CZK',
        semanticGroup: 'CURRENCY',
        defaultAggregationType: 'AVG'
      }
    },
    {
      name: 'adc_avgPos',
      label: 'Inzerát:  Pozice Ø',
      dataType: 'NUMBER',
      group: 'ads',
      semantics: {
        conceptType: 'METRIC',
        semanticType: 'NUMBER',
        semanticGroup: 'NUMERIC',
        defaultAggregationType: 'AVG'
      }
    },
    {
      name: 'adc_clickMoney',
      label: 'Inzerát: Cena za prokliky',
      dataType: 'NUMBER',
      group: 'ads',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'adc_clickMoney_kc',
      label: 'Inzerát: (Kč) Cena za prokliky',
      dataType: 'NUMBER',
      group: 'ads',
      formula: 'adc_clickMoney*0.01',
      semantics: {
        conceptType: 'METRIC',          
        semanticType: 'CURRENCY_CZK',
        semanticGroup: 'CURRENCY',
        defaultAggregationType: 'AVG'
      }
    },
    {
      name: 'adc_clicks',
      label: 'Inzerát: Prokliky',
      dataType: 'NUMBER',
      group: 'ads',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'adc_conversions',
      label: 'Inzerát: Konverze',
      dataType: 'NUMBER',
      group: 'ads',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'adc_conversionValue',
      label: 'Inzerát: Hodnota konverze',
      dataType: 'NUMBER',
      group: 'ads',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'adc_conversionValue_kc',
      label: 'Inzerát: (Kč) Hodnota konverze',
      dataType: 'NUMBER',
      group: 'ads',
      formula: 'adc_conversionValue*0.01',
      semantics: {
        conceptType: 'METRIC',          
        semanticType: 'CURRENCY_CZK',
        semanticGroup: 'CURRENCY'
      }
    },
    {
      name: 'adc_impressionMoney',
      label: 'Inzerát: Cena za zobrazení',
      dataType: 'NUMBER',
      group: 'ads',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'adc_impressionMoney_kc',
      label: 'Inzerát: (Kč) Cena za zobrazení',
      dataType: 'NUMBER',
      group: 'ads',
      formula: 'adc_impressionMoney*0.01',
      semantics: {
        conceptType: 'METRIC',          
        semanticType: 'CURRENCY_CZK',
        semanticGroup: 'CURRENCY',
        defaultAggregationType: 'AVG'
      }
    },
    {
      name: 'adc_impressions',
      label: 'Inzerát: Zobrazení',
      dataType: 'NUMBER',
      group: 'ads',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'adc_totalMoney',
      label: 'Inzerát: Cena',
      dataType: 'NUMBER',
      group: 'ads',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'adc_totalMoney_kc',
      label: 'Inzerát: (Kč) Cena',
      dataType: 'NUMBER',
      group: 'ads',
      formula: 'adc_totalMoney*0.01',
      semantics: {
        conceptType: 'METRIC',          
        semanticType: 'CURRENCY_CZK',
        semanticGroup: 'CURRENCY'
      }
    },
    {
      name: 'adc_transactions',
      label: 'Inzerát: Transakce',
      dataType: 'NUMBER',
      group: 'ads',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'adc_missImpressions',
      label: 'Inzerát: Ztracená zobrazení',
      dataType: 'NUMBER',
      group: 'ads',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'adc_underLowerThreshold',
      label: 'Inzerát: Ztracená zobrazení -  nízké cpc',
      dataType: 'NUMBER',
      group: 'ads',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'adc_exhaustedBudget',
      label: 'Inzerát: Ztracená zobrazení - rozpočet',
      dataType: 'NUMBER',
      group: 'ads',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'adc_stoppedBySchedule',
      label: 'Inzerát: Ztracená zobrazení - časové plánování',
      dataType: 'NUMBER',
      group: 'ads',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'adc_underForestThreshold',
      label: 'Inzerát: Ztracená zobrazení - nízký rank',
      dataType: 'NUMBER',
      group: 'ads',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'adc_exhaustedBudgetShare',
      label: 'Inzerát: Ztracená zobrazení - sdílený rozpočet',
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
        conceptType: 'METRIC',
        defaultAggregationType: 'AVG'
      }
    },
    {
      name: 'adc_pno',
      label: 'Inzerát: PNO',
      dataType: 'NUMBER',
      group: 'ads',
      semantics: {
        conceptType: 'METRIC',
        defaultAggregationType: 'AVG'
      }
    },
    {
      name: 'adc_ish',
      label: 'Inzerát: Podíl ztracených zobrazení - vyhledávací síť',
      dataType: 'NUMBER',
      group: 'ads',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'adc_ishContext',
      label: 'Inzerát: Podíl ztracených zobrazení - obsahová síť',
      dataType: 'NUMBER',
      group: 'ads',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'adc_ishSum',
      label: 'Inzerát: Podíl ztracených zobrazení',
      dataType: 'NUMBER',
      group: 'ads',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'adc_views',
      label: 'Inzerát: Počet zhlédnutí',
      dataType: 'NUMBER',
      group: 'ads',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'adc_viewRate',
      label: 'Inzerát: Míra zhlédnutí',
      dataType: 'NUMBER',
      group: 'ads',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'adc_skipRate',
      label: 'Inzerát: Míra přeskočení',
      dataType: 'NUMBER',
      group: 'ads',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'adc_avgCostPerView',
      label: 'Inzerát: Cena za zhlédnutí Ø',
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
      label: 'Banner: Název',
      dataType: 'STRING',
      group: 'banners',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'bnc_clickthruUrl',
      label: 'Banner: URL',
      dataType: 'STRING',
      group: 'banners',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'bnc_createDate',
      label: 'Banner: Datum vytvoření sestavy',
      dataType: 'STRING',
      group: 'banners',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'bnc_deleted',
      label: 'Banner: Smazáno',
      dataType: 'STRING',
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
      label: 'Banner: ETA - Popisek',
      dataType: 'STRING',
      group: 'banners',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'bnc_mobileFinalUrl',
      label: 'Banner: Cílová URL pro mobil',
      dataType: 'STRING',
      group: 'banners',
      semantics: {
        conceptType: 'DIMENSION'
      }
    },
    {
      name: 'bnc_image.height',
      label: 'Banner: Výška',
      dataType: 'NUMBER',
      group: 'banners',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'bnc_id',
      label: 'Banner: ID',
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
      name: 'bnc_image.width',
      label: 'Banner: Šířka',
      dataType: 'NUMBER',
      group: 'banners',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'bnc_premiseId',
      label: 'Banner: ID provozovny',
      dataType: 'NUMBER',
      group: 'banners',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'bnc_premiseModeId',
      label: 'Banner: ID typu zobrazování provozovny',
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
      label: 'Banner: Erotická reklamat',
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
      label: 'Banner: CPC Ø',
      dataType: 'NUMBER',
      group: 'banners',
      semantics: {
        conceptType: 'METRIC',          
        semanticType: 'CURRENCY_CZK',
        semanticGroup: 'CURRENCY',
        defaultAggregationType: 'AVG'
      }
    },
    {
      name: 'bnc_avgPos',
      label: 'Banner: Pozice Ø',
      dataType: 'NUMBER',
      group: 'banners',
      semantics: {
        conceptType: 'METRIC',
        defaultAggregationType: 'AVG'
      }
    },
    {
      name: 'bnc_clickMoney',
      label: 'Banner: Cena za prokliky',
      dataType: 'NUMBER',
      group: 'banners',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'bnc_clickMoney_kc',
      label: 'Banner: (Kč) Cena za prokliky',
      dataType: 'NUMBER',
      group: 'banners',
      formula: 'bnc_clickMoney*0.01',
      semantics: {
        conceptType: 'METRIC',          
        semanticType: 'CURRENCY_CZK',
        semanticGroup: 'CURRENCY',
        defaultAggregationType: 'AVG'
      }
    },
    {
      name: 'bnc_clicks',
      label: 'Banner: Prokliky',
      dataType: 'NUMBER',
      group: 'banners',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'bnc_conversions',
      label: 'Banner: Konverze',
      dataType: 'NUMBER',
      group: 'banners',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'bnc_conversionValue',
      label: 'Banner: Hodnota konverze',
      dataType: 'NUMBER',
      group: 'banners',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'bnc_conversionValue_kc',
      label: 'Banner: (Kč) Hodnota konverze',
      dataType: 'NUMBER',
      group: 'banners',
      formula: 'bnc_conversionValue*0.01',
      semantics: {
        conceptType: 'METRIC',          
        semanticType: 'CURRENCY_CZK',
        semanticGroup: 'CURRENCY'
      }
    },
    {
      name: 'bnc_impressionMoney',
      label: 'Banner: Cena za zobrazení',
      dataType: 'NUMBER',
      group: 'banners',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'bnc_impressionMoney_kc',
      label: 'Banner: (Kč) Cena za zobrazení',
      dataType: 'NUMBER',
      group: 'banners',
      formula: 'bnc_impressionMoney*0.01',
      semantics: {
        conceptType: 'METRIC',          
        semanticType: 'CURRENCY_CZK',
        semanticGroup: 'CURRENCY',
        defaultAggregationType: 'AVG'
      }
    },
    {
      name: 'bnc_impressions',
      label: 'Banner: Zobrazení',
      dataType: 'NUMBER',
      group: 'banners',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'bnc_totalMoney',
      label: 'Banner: Cena',
      dataType: 'NUMBER',
      group: 'banners',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'bnc_totalMoney_kc',
      label: 'Banner: (Kč) Cena',
      dataType: 'NUMBER',
      group: 'banners',
      formula: 'bnc_totalMoney*0.01',
      semantics: {
        conceptType: 'METRIC',          
        semanticType: 'CURRENCY_CZK',
        semanticGroup: 'CURRENCY',
        defaultAggregationType: 'AVG'
      }
    },
    {
      name: 'bnc_transactions',
      label: 'Banner: Transakce',
      dataType: 'NUMBER',
      group: 'banners',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'bnc_missImpressions',
      label: 'Banner: Ztracená zobrazení',
      dataType: 'NUMBER',
      group: 'banners',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'bnc_underLowerThreshold',
      label: 'Banner: Ztracená zobrazení - nízké cpc',
      dataType: 'NUMBER',
      group: 'banners',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'bnc_exhaustedBudget',
      label: 'Banner: Ztracená zobrazení pro - rozpočet',
      dataType: 'NUMBER',
      group: 'banners',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'bnc_stoppedBySchedule',
      label: 'Banner: Ztracená zobrazení - časové plánování',
      dataType: 'NUMBER',
      group: 'banners',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'bnc_underForestThreshold',
      label: 'Banner: Ztracená zobrazení - relevance',
      dataType: 'NUMBER',
      group: 'banners',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'bnc_exhaustedBudgetShare',
      label: 'Banner: Ztracená zobrazení - sdílený rozpočet',
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
        conceptType: 'METRIC',
        defaultAggregationType: 'AVG'
      } 
    },
    {
      name: 'bnc_pno',
      label: 'Banner: PNO',
      dataType: 'NUMBER',
      group: 'banners',
      semantics: {
        conceptType: 'METRIC',
        defaultAggregationType: 'AVG'
      }
    },
    {
      name: 'bnc_ish',
      label: 'Banner: Podíl ztracených zobrazení - vyhledávací síť',
      dataType: 'NUMBER',
      group: 'banners',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'bnc_ishContext',
      label: 'Banner: Podíl ztracených zobrazení - obsahová síť',
      dataType: 'NUMBER',
      group: 'banners',
      semantics: {
        conceptType: 'METRIC'
      }
    },
    {
      name: 'bnc_ishSum',
      label: 'Banner: Podíl ztracených zobrazení',
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
      var gSchema = this.bannersSchemaByGroup(schema, this.config.groupsId);
      return this.adSchemaByGroup(gSchema, this.config.groupsId);
    } else {
      //Pokud nemame v configu nani GroupId ani CampaignsId pak delam celkovy rozpad
      if (this.config.campaignsId == undefined || this.config.campaignsId.length == 0 || this.config.groupsId == ',') {
        return schema;
        //Pokud mame id v Campaigns pak rozpad dle nich
      } else {
        var gSchema = this.extendGroupsSchema(schema, this.config.campaignsId);
        gSchema = this.bannersSchemaByCampaign(gSchema, this.config.campaignsId);
        return this.adSchemaByCampaign(gSchema, this.config.campaignsId);
      }
    }
    return schema;
  }



  this.bannersSchemaByGroup = function (schema, ids) {
    var idsArr = ids.split(',');
    var id;
    var banner;
    while (idsArr.length > 0) {
      id = idsArr.pop();
      banner = [
        {
          name: 'bnc_id_' + id,
          label: 'Banner ID pro sestavu ' + id,
          dataType: 'NUMBER',
          group: 'groups',
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
          name: 'bnc_id_' + id,
          label: 'Banner Id pro kampaň ' + id,
          dataType: 'NUMBER',
          group: 'campaigns',
          semantics: {
            conceptType: 'DIMENSION'
          }
        }     

      ];
      schema = schema.concat(banner);
    }
    return schema;
  }

  this.adSchemaByGroup = function (schema, ids) {
    var idsArr = ids.split(',');
    var id;
    var ad;
    while (idsArr.length > 0) {
      id = idsArr.pop();
      ad = [        
        {
          name: 'adc_id_' + id,
          label: 'ID reklamy pro sestavu ' + id,
          dataType: 'NUMBER',
          group: 'groups',
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
          name: 'adc_id_' + id,
          label: 'ID reklamy pro kampaň ' + id,
          dataType: 'NUMBER',
          group: 'campaigns',
          semantics: {
            conceptType: 'DIMENSION'
          }
        }
      ];
      schema = schema.concat(ad);
    }
    return schema;

  }  

  this.extendGroupsSchema = function (schema, ids) {
    var idsArr = ids.split(',');
    var id;
    var groups;
    while (idsArr.length > 0) {
      id = idsArr.pop();
      groups = [        
        {
          name: 'goc_id_' + id,
          label: 'Groups ID pro kampaň ' + id,
          dataType: 'NUMBER',
          group: 'groups',
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
