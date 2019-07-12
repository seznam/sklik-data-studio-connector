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
 * If the user wants data from ads, this class do all rutins (createReport, readReport) 
 * and transforme data from readReport response to GDS format
 * @param {Root} rRoot 
 */
var AdsClass = function (rRoot) {
  /**
  * @param {Root}
  */
  this.Root = rRoot;
  this.dataCore = new DataCore(rRoot);

  /**
   * Prepare report at API specialized for granuality
   * @param {int} limit - limit for readReport (maximal show records)
   * @param {string} period - type of granuality of data
   * @return {Object} - return report from API readReport
   */
  this.adsPeriodCreateReport = function (limit, period) {
    var restrictionFilter = {
      'dateFrom': this.Root.startDate,
      'dateTo': this.Root.endDate
    };
    if (this.Root.loadFromGroupsIds.length > 0) {
      restrictionFilter.group = { 'ids': this.Root.loadFromGroupsIds };
    } else if (this.Root.groupsId.length > 0) {
      restrictionFilter.group = { 'ids': this.Root.groupsId };
    } else if (this.Root.groupsFromCampaignsIds.length > 0) {
      restrictionFilter.campaign = { 'ids': this.Root.groupsFromCampaignsIds };
    } else if (this.Root.campaignsId.length > 0) {
      restrictionFilter.campaign = { 'ids': this.Root.campaignsId };
    }

    var reponseCreate = this.Root.sklikApi('ads.createReport', [{ 'session': this.Root.session, 'userId': this.Root.userId },
      restrictionFilter, { 'statGranularity': period }]
    );
    return this.adsReadReport(reponseCreate, limit);
  }

  /**
   * Prepare report at API
   * @return {Object} - return report from API readReport
   */
  this.adsCreateReport = function () {
    var restrictionFilter = {
      'dateFrom': this.Root.startDate,
      'dateTo': this.Root.endDate
    };
    if (this.Root.loadFromGroupsIds.length > 0) {
      restrictionFilter.group = { 'ids': this.Root.loadFromGroupsIds };
    } else if (this.Root.groupsId.length > 0) {
      restrictionFilter.group = { 'ids': this.Root.groupsId };
    } else if (this.Root.groupsFromCampaignsIds.length > 0) {
      restrictionFilter.campaign = { 'ids': this.Root.groupsFromCampaignsIds };
    } else if (this.Root.campaignsId.length > 0) {
      restrictionFilter.campaign = { 'ids': this.Root.campaignsId };
    }
    
    var reponseCreate = this.Root.sklikApi('ads.createReport', [{ 'session': this.Root.session, 'userId': this.Root.userId },
      restrictionFilter
    ]);
    return this.adsReadReport(reponseCreate, 5000);
  }

  /**
   * Read data from API
   * @return {Object} - return report from API readReport
   */
  this.adsReadReport = function (response, limit) {
    for (var i = 0; i < this.Root.displayColumns.campaigns.length; i++) {
      this.Root.displayColumns.ads.push('campaign.' + this.Root.displayColumns.campaigns[i]);
    }
    for (var i = 0; i < this.Root.displayColumns.groups.length; i++) {
      this.Root.displayColumns.ads.push('group.' + this.Root.displayColumns.groups[i]);
    }
    this.Root.Log.addRecord('Zobraz sloupecky' + this.Root.displayColumns.ads.join(), true, 'adsReadReport');
    return this.Root.sklikApi(
      'ads.readReport',
      [{ 'session': this.Root.session, 'userId': this.Root.userId },
      response.reportId,
      {
        'offset': 0,
        'limit': limit,
        'allowEmptyStatistics': this.Root.allowEmptyStatistics,
        'displayColumns': this.Root.displayColumns.ads
      }]
    );
  }

  /**
   * Need data overturn from API response to GDS format
   * @see api.sklik.cz/drak/groups.readReport.html
   * @param {Object} response - Response from campaigns.readReport
   * @return {Boolean}
   */
  this.returnAdsDataPackage = function (response) {
    this.Root.Log.addRecord('\n Mám načtené z reportu' + JSON.stringify(response), true, 'adsDataReport');
    this.Root.Log.addRecord('\n Zobraz sloupecky' + JSON.stringify(this.Root.rDataSchema), true, 'adsDataReport');
    response.report.forEach(function (ads) {
      var values = [];
      this.Root.rDataSchema.forEach(function (field) {
        var fieldName = field.name.split('_');
        if (ads.stats != undefined && (ads.stats[0][fieldName[1]] != undefined || ads.stats[0][fieldName[1]] === null) && field.group == 'ads') {
          values.push(this.dataCore.dataPostEdit(ads.stats[0][fieldName[1]],fieldName[1]));
        } else if (field.group == 'campaigns' && ads.campaign != undefined && (ads.campaign[fieldName[1]] != undefined ||ads.campaign[fieldName[1]] === null)) {
          values.push(this.dataCore.dataPostEdit(ads.campaign[fieldName[1]],fieldName[1]));
        } else if (field.group == 'groups' && ads.group != undefined && (ads.group[fieldName[1]] != undefined || ads.group[fieldName[1]] === null)) {
          values.push(this.dataCore.dataPostEdit(ads.group[fieldName[1]],fieldName[1]));
        } else if ((ads[fieldName[1]] != undefined || ads[fieldName[1]] != undefined == null) && field.group == 'ads') {
          values.push(this.dataCore.dataPostEdit(ads[fieldName[1]],fieldName[1]));
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
  this.returnAdsPeriodDataPackage = function (response) {
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
            if (fieldName == 'adsIds') {
              values.push(id);
            } else if ((stats[i][fieldName] != undefined || stats[i][fieldName] === null) && (field.group.indexOf('ads') != -1)) {
              if (actualDayIsEmpty) {
                values.push(0);
              } else {
                values.push(this.dataCore.dataPostEdit(stats[i][fieldName],fieldName));
              }
            } else if (fieldName == 'days' && (field.group == 'adsDaily' || field.group == 'adsWeekly' || field.group == 'adsMonthly' || field.group == 'adsQuarterly' || field.group == 'adsYearly')) {
              if (stats[i].date == undefined || actualDayIsEmpty) {
                var d = actualDay.toString();
                if(field.group == 'adsWeekly') {
                  d = this.toYearWeekFormat(d);
                }                
              } else {
                var d = stats[i].date.toString();
                if(field.group == 'adsWeekly') {
                  d = this.toYearWeekFormat(d, field.group);
                }
              }
              values.push(this.dataCore.dataPostEdit(d,field.group));
            } else if (field.group == 'ads' && response.report[c] != undefined && (response.report[c][fieldName] != undefined || response.report[c][fieldName] === null)) {
              values.push(this.dataCore.dataPostEdit(response.report[c][fieldName],fieldName));
            } else if (field.group == 'groups' && response.report[c].group != undefined && (response.report[c].group[fieldName] != undefined || response.report[c].group[fieldName] === null)) {
              values.push(this.dataCore.dataPostEdit(response.report[c].group[fieldName],fieldName));
            } else if (field.group == 'campaigns' && response.report[c].campaign != undefined && (response.report[c].campaign[fieldName] != undefined || response.report[c].campaign[fieldName] === null)) {
              values.push(this.dataCore.dataPostEdit(response.report[c].campaign[fieldName],fieldName));
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
    var d = new Date(full.substr(0, 4),(parseInt(full.substr(4,2),10)-1), full.substr(6,2));
    var w = this.Root.getWeek(d);
    if(w < 10) {
      return full.substr(0,4)+'0'+w;
    } else {
      return full.substr(0,4)+w;
    }    
  }  
}