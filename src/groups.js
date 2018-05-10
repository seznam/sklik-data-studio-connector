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
 * If the user wants data from groups, this class do all rutins (createReport, readReport) 
 * and transforme data from readReport response to GDS format
 * @param {Root} rRoot 
 */
var GroupsClass = function (rRoot) {
  /**
  * @param {Root}
  */
  this.Root = rRoot;

  /**
   * Prepare report at API specialized for granuality
   * @param {int} limit - limit for readReport (maximal show records)
   * @param {string} period - type of granuality of data
   * @return {Object} - return report from API readReport
   */
  this.groupsPeriodCreateReport = function (limit, period) {
    var restrictionFilter = {
      'dateFrom': this.Root.startDate,
      'dateTo': this.Root.endDate
    };
    if (this.Root.groupsId.length > 0) {
      restrictionFilter.ids = this.Root.groupsId;
    } else if (this.Root.groupsFromCampaignsIds.length > 0) {
      restrictionFilter.campaign = { 'ids': this.Root.groupsFromCampaignsIds };
    } else if (this.Root.campaignsId.length > 0) {
      restrictionFilter.campaign = { 'ids': this.Root.campaignsId };
    }
    restrictionFilter.statisticsConditions = [{"columnName":"quality","operator":"GTE","intValue":0}];

    var reponseCreate = this.Root.sklikApi('groups.createReport', [{ 'session': this.Root.session, 'userId': this.Root.userId },
      restrictionFilter, { 'statGranularity': period }, { 'source': "GDSv100" }]
    );
    return this.groupsReadReport(reponseCreate, limit);
  }

  /**
   * Prepare report at API
   * @return {Object} - return report from API readReport
   */
  this.groupsCreateReport = function () {
    var restrictionFilter = {
      'dateFrom': this.Root.startDate,
      'dateTo': this.Root.endDate
    };
    if (this.Root.groupsId.length > 0) {
      restrictionFilter.ids = this.Root.groupsId;
    } else if (this.Root.groupsFromCampaignsIds.length > 0) {
      restrictionFilter.campaign = { 'ids': this.Root.groupsFromCampaignsIds };
    } else if (this.Root.campaignsId.length > 0) {
      restrictionFilter.campaign = { 'ids': this.Root.campaignsId };
    }
    restrictionFilter.statisticsConditions = [{"columnName":"quality","operator":"GTE","intValue":0}];
    
    var reponseCreate = this.Root.sklikApi('groups.createReport', [{ 'session': this.Root.session, 'userId': this.Root.userId },
      restrictionFilter, { 'source': "GDSv100" }
    ]);
    return this.groupsReadReport(reponseCreate, 5000);
  }

  /**
   * Read data from API
   * @return {Object} - return report from API readReport
   */
  this.groupsReadReport = function (response, limit) {
    for (var i = 0; i < this.Root.displayColumns.campaigns.length; i++) {
      this.Root.displayColumns.groups.push('campaign.' + this.Root.displayColumns.campaigns[i]);
    }
    this.Root.Log.addRecord('Zobraz sloupecky' + this.Root.displayColumns.groups.join(), true, 'groupsReadReport');
    return this.Root.sklikApi(
      'groups.readReport',
      [{ 'session': this.Root.session, 'userId': this.Root.userId },
      response.reportId,
      {
        'offset': 0,
        'limit': limit,
        'allowEmptyStatistics': true,
        'displayColumns': this.Root.displayColumns.groups
      }]
    );
  }

  /**
   * Need data overturn from API response to GDS format
   * @see api.sklik.cz/drak/groups.readReport.html
   * @param {Object} response - Response from campaigns.readReport
   * @return {Boolean}
   */
  this.returnGroupsDataPackage = function (response) {
    this.Root.Log.addRecord('\n Mám načtené z reportu' + JSON.stringify(response), true, 'campaignsDataReport');
    this.Root.Log.addRecord('\n Zobraz sloupecky' + JSON.stringify(this.Root.rDataSchema), true, 'campaignsDataReport');
    response.report.forEach(function (groups) {
      var values = [];
      this.Root.rDataSchema.forEach(function (field) {
        var fieldName = field.name.split('_');
        if (groups.stats != undefined && groups.stats[0][fieldName[1]] != undefined && field.group == 'groups') {
          values.push(groups.stats[0][fieldName[1]]);
        } else if (fieldName[1] == 'name' && field.group == 'groups') {
          values.push(groups.name);
        } else if (field.group == 'campaigns' && groups.campaign != undefined && groups.campaign[fieldName[1]] != undefined) {
          values.push(groups.campaign[fieldName[1]]);
        } else if (groups[fieldName[1]] != undefined && field.group == 'groups') {
          values.push(groups[fieldName[1]]);
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
 * Specialized for show granuality. 
 * GDS need every days even are they empty but API have no empty columns in reponse, 
 * so we need insert it manualy
 * @see api.sklik.cz/drak/groups.readReport.html
 * @param {Object} response - Response from campaigns.readReport
 * @return {Boolean}
 */
  this.returnGroupsPeriodDataPackage = function (response) {

    //Hlavni entita seznam vsech hodnot
    var values = [];
    //Aktulani den na ktery se ptam
    var actualDay;
    //Pokud dany den nejsou metriky (nahazet nuly)
    var actualDayIsEmpty = true;
    //Statistiky jednoho zaznamu (po datumech)
    var stats;
    //Id zaznamu
    var id;
    //Vsechny dny nad kteryma chci iterovat
    var daysArr;
    //Aktualni den v iteraci
    var actualDate;

    //Iterace nad jednou entitou reportu
    for (var c = 0; c < response.report.length; c++) {
      id = response.report[c].id;
      stats = response.report[c].stats;
      daysArr = this.Root.timeline.slice();
      //Protoze pokud je dany den prazdny, tak to nehledam v datech a dam tam nuly
      actualDayIsEmpty = true;
      //Zřejmě se zobrazují políčka, které se nemění v čase (chybí proto pole report.stats
      if (stats == undefined) {
        this.Root.Log.addValue('Zřejmě požadujete data, které jsou konstantní v čase, není možné používat granularitu.');
        break;
      }  
      //Iterace podle dnu v zaznamech !!Nemusi tam byt vsechny dny - viz actualDayIsEmpty
      for (var i = 0; i < stats.length; i++) {
        do {
          var values = [];
          actualDay = daysArr.shift();
          if (!actualDay) {
            actualDayIsEmpty = true;
            break;
          }
          if (stats[i] && stats[i].date && stats[i].date.toString() == actualDay) {
            actualDayIsEmpty = false;
            //Za prepodkladu, ze z nejakeho duvodu mam nacteny starsi datum (nizsi cislo) ke kteremu nemuzu zakonite doiterovat            
          } else if (stats[i] && stats[i].date && stats[i].date.toString() < actualDay) {
            actualDayIsEmpty = false;
          }
          this.Root.rDataSchema.forEach(function (field) {
            var fieldName = field.name.split('_')[1];
            if (fieldName == 'groupsIds') {
              values.push(id);
            } else if (stats[i][fieldName] != undefined && (field.group.indexOf('groups') != -1)) {
              if (actualDayIsEmpty) {
                values.push(0);
              } else {
                values.push(stats[i][fieldName]);
              }
            } else if (response.report[c][fieldName] != undefined && (field.group.indexOf('groups') != -1)) {
              if (actualDayIsEmpty) {
                values.push('');
              } else {
                values.push(response.report[c][fieldName]);
              }
            } else if (fieldName == 'days' && (field.group == 'groupsDaily' || field.group == 'groupsWeekly' || field.group == 'groupsMonthly' || field.group == 'groupsQuarterly' || field.group == 'groupsYearly')) {
              if (stats[i].date == undefined || actualDayIsEmpty) {
                var d = actualDay.toString();
                if(field.group == 'groupsWeekly') {
                  d = this.toYearWeekFormat(d);
                }                
              } else {
                var d = stats[i].date.toString();
                if(field.group == 'groupsWeekly') {
                  d = this.toYearWeekFormat(d);
                }
              }
              values.push(d);
            } else if (field.group == 'campaigns' && response.report[c].campaign != undefined && response.report[c].campaign[fieldName] != undefined) {
              values.push(response.report[c].campaign[fieldName]);
            } else {
              values.push('');
            }

          }, this);
          this.Root.data.push({
            values: values
          });
        } while (actualDayIsEmpty);
      }
    }
    this.Root.Log.addValue('data:' + JSON.stringify(this.Root.data), true);
    return true;
  }
  /**
  * For weekly granularity need date format in year-week. 
  * @param {Date} full
  * @return {Int}
  */
  this.toYearWeekFormat = function(full) {
    var d = new Date(full.substr(0, 4),(parseInt(full.substr(4,2))-1), full.substr(6,2));
    var w = this.Root.getWeek(d);
    if(w < 10) {
      return full.substr(0,4)+'0'+w;
    } else {
      return full.substr(0,4)+w;
    }    
  } 
}