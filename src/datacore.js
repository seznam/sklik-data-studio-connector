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
 * This class is for work with dates. Sync same tasks for all entities -> 
 * remove redundancy of code and iteration to more safety access. 
 * Actual work with entity Client 
 * Change test
 * @todo Keywords
 * @param {Root} rRoot 
 */

var DataCore = function (rRoot) {
  /**
   * @param {Root}
   */
  this.Root = rRoot;
  
  /**
   * Indexing stats data - save info assoc array where key is date of stats
   * @param {Array} stats - field of statistics
   * @return {Array} - ['date':{Object}] or empty (in situation when have no data at all)
   */
  this.indexingArrayFieldsOfStats = function(stats){
    var indexedStats = {};
    var record = [];
    var date;
      if (stats[0]['date'] != undefined) {
      for(var i=0; i < stats.length; i++) {
        record = stats[i];
        if (record['date'].length > 8) {
          date = record['date'].slice(0,8); //From 20190102T00:00:00+0000 -> 20190102
        } else {
          date = record['date']; 
        }
        indexedStats[date] = record;
      }
      }  
    
    //this.Root.Log.addDebug('-//- indexed stats array', 'dataCore.indexingArrayFieldsOfStats()', indexedStats);
    return indexedStats;
  }

  /**
   * Because API Drak send on response only days with statistict (for granularitu it ignore allow empty statistic)
   * We need add missing days(or other granularity parts) with zeros. 
   * For better work with this stats field, we make it indexed (assoc array) where index is date. 
   * @param {Array} response - data from API
   * @return {Array} 
   */
  this.indexingStatsInReponse = function(response) {
    var reports = [];
    //Indexing reponse data @see indexingArrayFieldsOfStats. For better orientation in response
    //Two different system of data struct (this for response like client.stats - data have no static information, so response have no "stats" structure      
    try {
      if (response.report[0].stats == undefined) {
        reports.push({'stats':this.indexingArrayFieldsOfStats(response.report)});
      //This for response like *.readReport where we have static information (under report) and statistict information (under stats)
      } else {
        for (var i = 0; i < response.report.length; i++) {
          var helpReport = response.report[i];
          helpReport['stats'] = this.indexingArrayFieldsOfStats(response.report[i].stats);
          reports.push(helpReport);          
        }
      }
    } catch (exp) {
      console.error({'location': 'Datacore.indexingStatsInReponse', 'err': exp});  
      this.Root.addRecord('Nelze správě přeindexovat pole stats', true, 'datacore.indexingStatsInReponse()');
      this.Root.addValue(exp);      
    }
    return reports;
  }
  
  this.getColumns = function(actualEntity) {
    var list = [];
    for (var entity in this.Root.displayColumns) {
      if (entity == actualEntity) {
         list = list.concat(this.Root.displayColumns[entity]); 
      }else if(entity.length > 0) {
        for (var col in this.Root.displayColumns[entity]) {
         //Slice used because we work with names in plural (word end on s), bud in columns use singular
         //@todo - make it more systematic
         list.push(entity.slice(0,-1)+'.'+this.Root.displayColumns[entity][col]);            
        }                       
      }
    }
    return list;
  }
  

  /**
   * Need data overturn from API response to GDS format
   * @param {Object} response - Response from API (readReport, stats
   * @param {String} entity - Name of entity (client, campaign, groups....)
   * @return {Boolean}
   */
  this.returnDataPackage = function (response, entity) {
    this.Root.Log.addHeader('Načtené data z API', 1, '', true);

    if (response.report == undefined || response.report.length == undefined) {
      this.Root.Log.addHeader('Odpověď neobsahuje žádné data', 2, 'negative', true);
      this.Root.Log.addRecord('Api vrátilo prázdnou množinu - entity v daných podmínkách jsou nulové a v konfiguraci je nastaveno tyto položky nezobrazovat');
      this.Root.Log.addLocation({'file': 'datacore', 'func': 'returnDataPackage', 'line': 122});
      this.Root.Log.addJson(response, true);
      return false;
    } else {
      this.Root.Log.addJson(response.report, true);
    }

    if(response.report.length == 0) {
       this.Root.Log.addRecord('Api vrátilo prázdnou množinu - entity v daných podmínkách jsou nulové a v konfiguraci je nastaveno tyto položky nezobrazovat'); 
       return false;
    }
    
    response.report.forEach(function (report) {
      var values = [];
      this.Root.rDataSchema.forEach(function (field) {
        values.push(this.valuesPushToReponse(field, report));  
      }, this);
      this.Root.data.push({
        values: values
      });
    }, this);
    return true;
  }

  

  /**
   * Need data overturn from API response to GDS format
   * @param {Object} response - Response from API (readReport, stats)
   * @param {String} entity - Name of entity (client, campaign, groups....)
   * @return {Boolean}
   */
  this.returnDataPackageInGranularity = function (response, entity) {
    this.Root.Log.addHeader('Načtené data z API', 1, '', true);

    
    if (response != undefined && response.report != undefined) {
      this.Root.Log.addValue(response.report, true, 'dataCore.returnDataPackageInGranularity()');
    } else {
      this.Root.Log.addHeader('Odpověď neobsahuje žádné data', 2, 'negative', true);
      this.Root.Log.addRecord('Api vrátilo prázdnou množinu - entity v daných podmínkách jsou nulové a v konfiguraci je nastaveno tyto položky nezobrazovat');
      this.Root.Log.addLocation({'file': 'datacore', 'func': 'returnDataPackage', 'line': 122}); 
      this.Root.Log.addJson(response, true);
      return false;
    }

    if(response.report.length == 0) {
       this.Root.Log.addRecord('Api vrátilo prázdnou množinu - entity v daných podmínkách jsou nulové a v konfiguraci je nastaveno tyto položky nezobrazovat'); 
       return false;
    }
    
    var reports = this.indexingStatsInReponse(response);           

    //List of enitities (days, weeks ....) in date range by selected granularity
    var dayRange = this.Root.timeline.slice(); 
    //Hlavni entita seznam vsech hodnot
    var values = [];
    //Actual day in iteration
    var actualDay;
    this.Root.Log.addDebug('-//- Avaliable days',{'file': 'datacore', 'func': 'returnDataPackageInGranularity', 'line': 181},dayRange);
    
    for (var r = 0; r < reports.length; r++) {
      var report = reports[r];
      var stats = reports[r]['stats'];
    for (var d = 0; d < dayRange.length; d++) {
      var values = [];
      this.actualDay = dayRange[d];
      this.Root.rDataSchema.forEach(function (field) {
        values.push(this.valuesPushToReponse(field, report, stats));
      }, this);      
      this.Root.data.push({
        values: values
      });    
    }            
    }
    this.Root.Log.addCaption('Data jsou uloženy ve výstupním formátu pro GDS');
    return true;
  }


  this.valuesPushToReponse = function(field, report, stats) {
    var value;
    //Parser schema field name (extract name)
    var s = field.name.split('_');
    var columnName = s[1];
    if(s.length == 3) {
      var num = Number(s[2]);
    }  
    if(stats == undefined && report.stats != undefined && (report.stats[0][columnName] != undefined || report.stats[0][columnName] === null)) {
        if (s[2] != undefined && typeof report.stats[0][columnName] == 'object') {
          console.log('here');
          value = this.dataPostEdit(report.stats[0][columnName][s[2]], columnName);
        } else {
          value = this.dataPostEdit(report.stats[0][columnName], columnName);                       
        }
        //if (field.group == entity) {
          //  value = this.dataPostEdit(report.stats[0][columnName], columnName);
        //}
    } else if (this.actualDay != undefined && stats[this.actualDay] != undefined && (stats[this.actualDay][columnName] != undefined || stats[this.actualDay][columnName] === null)) {
      if (s[2] != undefined && typeof stats[this.actualDay][columnName] == 'object') { 
        value = this.dataPostEdit(stats[this.actualDay][columnName][s[2]], columnName);
      } else {
        value = this.dataPostEdit(stats[this.actualDay][columnName],columnName);                        
      }
    //Handle daily parser
    } else if (field.group == 'granularity') {
      if (report[this.actualDay] != undefined && field.name == 'weekly') {
        dateF = this.toYearWeekFormat(d);
      } else {
        dateF = this.actualDay;
      }          
      value = this.dataPostEdit(dateF,field.name);

    } else if ((report[columnName] != undefined || report[columnName] === null) && field.group == entity) {                            
        if (s[2] != undefined && typeof report[columnName] == 'object') {
          value = this.dataPostEdit(report[columnName][s[2]], columnName);
        } else {
          value = this.dataPostEdit(report[columnName], columnName);    
        }
    } else if (report[field.group.slice(0,-1)] != undefined && (report[field.group.slice(0,-1)][columnName] != undefined || report[field.group.slice(0,-1)][columnName] === null)) {
        if(s[2] != undefined && typeof report[columnName] == 'object') {
          value = this.dataPostEdit(report[field.group.slice(0,-1)][columnName][s[2]], columnName);  
        } else {
          value = this.dataPostEdit(report[field.group.slice(0,-1)][columnName], columnName);
        }

    //Special condition for fields like adc_id_123455
    } else if (num != undefined) {
        value = report[columnName];                
    //If expected field is number ()
    } else if(field.dataType == 'NUMBER') {
      value = 0;
    } else {
      value ='';
    }
    return value;
  }


  /**
  * For weekly granularity need date format in year-week. 
  * @param {Date} full
  * @return {Int}
  */
  this.toYearWeekFormat = function(full) {
    var d = new Date(full.substr(0, 4),(parseInt(full.substr(4,2),10)-1), full.substr(6,2));
    var w = this.Root.getWeek(d);
    if(w < 10) {
      return full.substr(0,4)+'0'+w;
    } else {
      return full.substr(0,4)+w;
    }    
  }
  
  
//Entities what are in Date format (transform to nice format)
this.dateEntities = ['date', 'create', 'createDate', 'deleteDate', 'endDate', 'startDate', 'totalBudgetFrom', 'totalClicksFrom'];

this.dataPostEdit = function (value, column){
    if (value === false) {
      return 'Ne';
    } else if (value === true) {
      return 'Ano';
    }      
    if (value === null ) {  
      return '-'; 
    }
    
    if (this.dateEntities.indexOf(column) != -1) {
      if(value.length >= 8) {
        return value.substring(0,4)+'.'+value.substring(4,6)+'.'+value.substring(6,8);
      } else {
        return value;
      }
    }
    return value;
  }
}