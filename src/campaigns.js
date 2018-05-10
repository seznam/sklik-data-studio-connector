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
 * If the user wants data from campaign, this class do all rutins (createReport, readReport) 
 * and transforme data from readReport response to GDS format 
 * @param {Root} rRoot 
 */
var CampaignsClass = function (rRoot) {
  /**
   * @param {Root}
   */
  this.Root = rRoot;

  /**
   * Prepare report at API specialized for granuality
   * @param {Int[]} campaignsId
   * @param {int} limit - limit for readReport (maximal show records)
   * @param {string} period - type of granuality of data
   * @return {Object} - return report from API readReport
   */
  this.campaignsPeriodCreateReport = function (campaignsId, limit, period) {
    var restrictionFilter = {
      'dateFrom': this.Root.startDate,
      'dateTo': this.Root.endDate
    };

    if (campaignsId.length > 0) {
      restrictionFilter.ids = campaignsId;
    }
    restrictionFilter.statisticsConditions = [{"columnName":"quality","operator":"GTE","intValue":0}];
    

    var reponseCreate = this.Root.sklikApi('campaigns.createReport', [{ 'session': this.Root.session, 'userId': this.Root.userId },
                                                                      restrictionFilter, { 'statGranularity': period }, {'source': "GDSv100"}]

    );
    return this.campaignsReadReport(reponseCreate, limit);
  }

  /**
   * Prepare report at API
   * @return {Object} - return report from API readReport
   */
  this.campaignsCreateReport = function (campaignsId) {
    var restrictionFilter = {
      'dateFrom': this.Root.startDate,
      'dateTo': this.Root.endDate
    };

    if (campaignsId.length > 0) {
      restrictionFilter.ids = campaignsId;
    }    
    restrictionFilter.statisticsConditions = [{"columnName":"quality","operator":"GTE","intValue":0}];
    
    var reponseCreate = this.Root.sklikApi('campaigns.createReport', [{ 'session': this.Root.session, 'userId': this.Root.userId },
    restrictionFilter,{'source': "GDSv100"}]
    );
    return this.campaignsReadReport(reponseCreate, 5000);
  }

  /**
   * Read data from API
   * @return {Object} - return report from API readReport
   */
  this.campaignsReadReport = function (response, limit) {
    this.Root.Log.addRecord('Zobraz sloupecky' + this.Root.displayColumns.campaigns.join(), true, 'campaignsReadReport');
    return this.Root.sklikApi(
      'campaigns.readReport',
      [{ 'session': this.Root.session, 'userId': this.Root.userId },
      response.reportId,
      {
        'offset': 0,
        'limit': limit,
        'allowEmptyStatistics': true,
        'displayColumns': this.Root.displayColumns.campaigns
      }]
    );
  }

  /**
   * Need data overturn from API response to GDS format
   * Specialized for show granuality. 
   * GDS need every days even are they empty but API have no empty columns in reponse, 
   * so we need insert it manualy
   * @see api.sklik.cz/drak/campaigns.readReport.html
   * @param {Object} response - Response from campaigns.readReport
   * @return {Boolean}
   */
  this.returnCampaignsPeriodDataPackage = function (response) {

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

    this.Root.Log.addRecord('\n Mám načtené z reportu' + JSON.stringify(response.report), true, 'campaignsDataReport');
    this.Root.Log.addRecord('\n Zobraz sloupecky' + JSON.stringify(this.Root.rDataSchema), true, 'campaignsDataReport');

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
            if (field.name.substring(4) == 'campaignsIds') {
              values.push(id);
            } else if (stats[i][field.name.substring(4)] != undefined && (field.group.indexOf('campaigns') != -1)) {
              if (actualDayIsEmpty) {
                values.push(0);
              } else {
                values.push(stats[i][field.name.substring(4)]);
              }
            } else if (field.name.substring(4) == 'days' && (field.group == 'campaignsDaily' || field.group == 'campaignsWeekly' || field.group == 'campaignsMonthly' || field.group == 'campaignsQuarterly' || field.group == 'campaignsYearly')) {
              if (stats[i].date == undefined || actualDayIsEmpty) {
                var d = actualDay.toString();
                if(field.group == 'campaignsWeekly') {
                  d = this.toYearWeekFormat(d);
                }                
              } else {
                var d = stats[i].date.toString();
                if(field.group == 'campaignsWeekly') {
                  d = this.toYearWeekFormat(d);
                }
              }
              values.push(d);
            } else if (response.report[c][field.name.substring(4)] != undefined && field.group == 'campaigns') {
              values.push(response.report[c][field.name.substring(4)]);
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
    return true;
  }

  /**
   * Need data overturn from API response to GDS format
   * @see api.sklik.cz/drak/campaigns.readReport.html
   * @param {Object} response - Response from campaigns.readReport
   * @return {Boolean}
   */
  this.returnCampaignsDataPackage = function (response) {
    this.Root.Log.addRecord('\n Mám načtené z reportu' + JSON.stringify(response.report), true, 'campaignsDataReport');
    this.Root.Log.addRecord('\n Zobraz sloupecky' + JSON.stringify(this.Root.rDataSchema), true, 'campaignsDataReport');
    response.report.forEach(function (campaign) {
      var values = [];
      this.Root.rDataSchema.forEach(function (field) {
        if (campaign.stats != undefined && campaign.stats[0][field.name.substring(4)] != undefined && field.group == 'campaigns') {
          values.push(campaign.stats[0][field.name.substring(4)]);
        } else if (field.name.substring(4) == 'name' && field.group == 'campaigns') {
          values.push(campaign.name);
        } else if (campaign[field.name.substring(4)] != undefined && field.group == 'campaigns') {
          values.push(campaign[field.name.substring(4)]);
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