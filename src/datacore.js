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
      this.Root.Log.addRecord('\nNačtené data z API (odpověď API server)', true, 'dataCore.returnDataPackage()');
      this.Root.Log.addValue(response.report, true, 'dataCore.returnDataPackage()');
      
      if(response.report.length == 0) {
         this.Root.Log.addRecord('Api vrátilo prázdnou množinu - entity v daných podmínkách jsou nulové a v konfiguraci je nastaveno tyto položky nezobrazovat'); 
         return false;
      }
      
      response.report.forEach(function (record) {
        var values = [];
        this.Root.rDataSchema.forEach(function (field) {
          var columnName = field.name.substring(4);
          if (record.stats != undefined && (record.stats[0][columnName] != undefined || record.stats[0][columnName] === null)) {
            if (field.group == entity) {
               values.push(this.dataPostEdit(record.stats[0][columnName], columnName));
            }
          } else if ((record[columnName] != undefined || record[columnName] === null) && field.group == entity) {  
            values.push(this.dataPostEdit(record[columnName], columnName));
          } else if (record[field.group.slice(0,-1)] != undefined && (record[field.group.slice(0,-1)][columnName] != undefined || record[field.group.slice(0,-1)][columnName] === null)) {  
            values.push(this.dataPostEdit(record[field.group.slice(0,-1)][columnName], columnName));            
          } else if(field.dataType == 'NUMBER') {
            values.push(0);
          } else {
            values.push('');
          }
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
      this.Root.Log.addRecord('Načtené data z API (odpověď API server)', true, 'dataCore.returnDataPackageInGranularity()');
      
      if (response != undefined && response.report != undefined) {
        this.Root.Log.addValue(response.report, true, 'dataCore.returnDataPackageInGranularity()');
      } else {
        this.Root.Log.addRecord('!!! Chyba odpoveď neobsahuje požadovanou datovou strukturu');
        this.Root.Log.addValue(response, true, 'dataCore.returnDataPackageInGranularity()');
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

      
      for (var r = 0; r < reports.length; r++) {
        var report = reports[r];
        var stats = reports[r]['stats'];
      for (var d = 0; d < dayRange.length; d++) {
        var values = [];
        this.actualDay = dayRange[d];
        this.Root.rDataSchema.forEach(function (field) {
          var columnName = field.name.substring(4);
          if (stats[this.actualDay] != undefined && (stats[this.actualDay][columnName] != undefined || stats[this.actualDay][columnName] === null)) {
            values.push(this.dataPostEdit(stats[this.actualDay][columnName],columnName));                        
          } else if (field.group == 'granularity') {
            if (report[this.actualDay] != undefined && field.name == 'weekly') {
              dateF = this.toYearWeekFormat(d);
            } else {
              dateF = this.actualDay;
            }          
            values.push(this.dataPostEdit(dateF,field.name));
          } else if ((report[columnName] != undefined || report[columnName] === null) && field.group == entity) {            
               values.push(this.dataPostEdit(report[columnName], columnName));
          } else if (report[columnName] != undefined && (report[field.group.slice(0,-1)][columnName] != undefined || report[field.group.slice(0,-1)][columnName] === null)) {       
               values.push(this.dataPostEdit(report[field.group.slice(0,-1)][columnName], columnName));
          //If expected field is number ()
          } else if(field.dataType == 'NUMBER') {
            values.push(0);
          } else {
            values.push('');
          }
        }, this);      
        this.Root.data.push({
          values: values
        });    
      }            
      }
      this.Root.Log.addRecord('Data jsou uloženy ve výstupním formátu pro GDS');
      return true;
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