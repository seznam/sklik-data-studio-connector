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
 * Manage GDS request, parse require columns and give control to specific classes 
 * @author Roman Stejskal  
 * @version 1.0.0.
 * @param {Object} rConfigParams 
 * @param {Object} sklikDataSchema 
 * @param {Object} rFields 
 * @param {Object} rDateRange 
 */
var Root = function (rConfigParams, sklikDataSchema, rFields, rDateRange) {
  /**
   * All parametrs what user insert for create connection like Token, UsersIds etc...
   * @param {Object}
   */
  this.config = rConfigParams;

  /**
   * @param {Int}
   */
  this.userId = parseInt(this.config.userId);
  /**
   * All possible columns of this connector
   * @param {Object}
   */
  this.sklikDataSchema = sklikDataSchema;

  /**
   * Only require data schema (require columns). 
   * Reachable from call of getData.
   * Contains only 'names'
   * @param {Object}
   */
  this.fields = rFields;
  /**
   * Full object (all attributes) of require data schema. 
   * From 'this.sklikDataSchema' select schema by 'this.fields' with all params
   * @param {Object}
   */
  this.rDataSchema = [];

  /**
   * Requested data range
   * Contains endDate,startDadte params
   * @param {Object} 
   */
  this.date = rDateRange;

  /**
   * Same date as this.date.endDate
   * @param {Date}
   */
  this.eDate;
  /**
   * Same date as this.date.startDate
   * @param {Date}
   */
  this.sDate;

  /**
   * Internal format of end date
   * @param {string}
   */
  this.endDate;

  /**
   * Internal format of start date
   * @param {string}
   */
  this.startDate;

  /**
   * Because API not return in cycle report (daily, monthly etc...) 
   * null items we must build all date range (every day, or every month from start to end date) 
   * and insert null values for missing items. 
   * @see setupDaysCycle
   * @param {String[]}
   */
  this.timeline = [];

  /**
   * Session of logged user
   * @param {String}
   */
  this.session;

  /**
   * Enable logging into file
   * @param {GetDataLog}
   */
  this.Log;

  /**
   * Final dataset return into Google Data Studio
   * Structura must corresponded with requested columns (same count). 
   * Object struct {'values':arrary()}
   * @param {Object[]}
   */
  this.data = [];

  /**
   * Requested campaignsId from config
   * @param {int[]}
   */
  this.campaignsId = [];

  /**
   * Requested groupsId from config
   * @param {int[]}
   */
  this.groupsId = [];

  /**
   * When missing groupsId, system will load all groups from requested campaignsId list
   * @param {Boolean}
   */
  this.loadGroupsFromCampaigns = false;

  /**
   * When have groupsIds, system will load all groups from requested this list
   * @param {Boolean}
   */
  this.loadFromGroups = false;

  /**
   * GroupsId loaded from requested campaigns
   * @see this.loadGroupsFromCampaigns
   * @param {int[]}
   */
  this.groupsFromCampaignsIds = [];

  /**
   * Loaded from requested groups
   * @see this.loadFromGroups
   * @param {int[]}
   */
  this.loadFromGroupsIds = [];

  /**
   * We don't know which report will be requested until getData request. 
   * When we analyze request, select report which we use for load data
   * @param {Object}
   */
  this.reportsList = {};

  /**
   * From request select columns of report what to be read
   * @param {Object}
   */
  this.displayColumns = {
    'campaigns': [],
    'groups': [],
    'ads': [],
    'banners': []
  }

  /*
  * Avaliable periods
  */
  this.periods = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];

  /**
  * When parse required columns and dimension, need setup which report will be used. 
  * This set up all available reports 
  */
  this.setupReportList = function () {
    var types = ['campaigns', 'groups', 'ads', 'banners'];
    for (var t = 0; t < types.length; t++) {
      this.reportsList[types[t]] = false;
      for (var p = 0; p < this.periods.length; p++) {
        this.reportsList[types[t] + this.periods[p]] = false;
      }
    }
  }


  /**
   * First method of class.
   * Setup Log class and setup type ids for campaigns and groups
   */
  this.setup = function () {
    this.Log = new GetDataLog(this.config.logmode, this.config.debugmode);
    this.Log.setup();
    this.Log.addRecord('Spuštění testu [' + new Date().toLocaleString() + ']');
    this.Log.addValue('Vstupni data\nConfig:' + JSON.stringify(this.config), true, 'setup');
    this.Log.addValue('Pozadovane pole' + JSON.stringify(this.fields), true, 'setup');
    this.Log.addValue('Datum' + JSON.stringify(this.date), true, 'setup');
    
    this.setupReportList();
    //Pokud jsou nastavené campaignsId, tak se jede podle toho 
    //(řídí campaigns, ale groups a ads pouze pokud není groupsId)
    if (this.config.campaignsId != undefined && this.config.campaignsId != '') {
      var stringCampaignsId = this.config.campaignsId.split(',');
      //From {String[]} -> {Int[]}
      for (var i = 0; i < stringCampaignsId.length; i++) {
        this.campaignsId.push(parseInt(stringCampaignsId[i]));
      }
    }
    //Pokud jsou nastavené i groupsId tak jsou řídící pro groups a ads
    if (this.config.groupsId != undefined && this.config.groupsId != '') {
      var stringGroupsId = this.config.groupsId.split(',');
      //From {String[]} -> {Int[]}
      for (var i = 0; i < stringGroupsId.length; i++) {
        this.groupsId.push(parseInt(stringGroupsId[i]));
      }
      this.loadFromGroups = true;
    } else {
      this.loadGroupsFromCampaigns = true;
    }
  }

  /**
   * Keep guideline to load data (it control loading data)
   * workflow - logIn -> parseDataRequest -> loadData -> createReport[] -> readReport[] -> returnDataPackage 
   */
  this.load = function () {
    if (this.logIn()) {
      this.Log.addRecord('Uživatel se přihlásil');
      if (this.parseDataRequest()) {
        this.setupDate();
        return this.loadData();
      }
    }
  }

  /**
   * Log user to API (make session)
   */
  this.logIn = function () {
    return this.sklikApi('client.loginByToken', this.config.token);
  }

  /**
   * Analyze types of request and set up all need parts for correct loading (choice report type, columns)
   */
  this.parseDataRequest = function () {
    //Jedna se o vytrideni dat, ktere jsou v pozadavku na zobrazeni z celkoveho baliku dat
    //this.rDataSchema obsahuje "name" vsech sloupcu, ktere se maji zobrazit
    this.fields.forEach(function (field) {
      for (var i = 0; i < this.sklikDataSchema.length; i++) {
        if (this.sklikDataSchema[i].name === field.name) {
          this.rDataSchema.push(this.sklikDataSchema[i]);
          if (this.sklikDataSchema[i].semantics && this.sklikDataSchema[i].semantics.conceptType == 'DIMENSION' && this.reportsList[this.sklikDataSchema[i].group] != undefined) {
            this.reportsList[this.sklikDataSchema[i].group] = true;
            //Pokud mam granularitu, v jednom parametru mam i ID pro které gampaignId se to ma udit 
            if (this.loadGroupsFromCampaigns) {
              if (this.sklikDataSchema[i].group.indexOf('groups') != -1) {
                var s = this.sklikDataSchema[i].name.split('_');
                this.Log.addRecord(JSON.stringify(s), true, 'parseDataRequest');
                if (s.length == 3) {
                  this.groupsFromCampaignsIds.push(parseInt(s[2]));
                }
              }
            //Pokud mam granularitu, v jednom parametru mam i ID pro které groupId se to ma udit 
            } else if (this.loadFromGroups) {
              var s = this.sklikDataSchema[i].name.split('_');
              this.Log.addRecord(JSON.stringify(s), true, 'parseDataRequest');
              if (s.length == 3) {
                this.loadFromGroupsIds.push(parseInt(s[2]));
              }
            }
          }
          //
          switch (this.sklikDataSchema[i].name.substring(0, 3)) {
            //Display columns for campaigns
            case 'cgc':
              this.displayColumns.campaigns.push(this.sklikDataSchema[i].name.substring(4));
              break;
            //Display columns for groups  
            case 'goc':
              this.displayColumns.groups.push(this.sklikDataSchema[i].name.substring(4));
              break;
            //Display columns for ads
            case 'adc':
              this.displayColumns.ads.push(this.sklikDataSchema[i].name.substring(4));
              break;
            //Display columns for banners
            case 'bnc':
              this.displayColumns.banners.push(this.sklikDataSchema[i].name.substring(4));
              break;
          }
          break;
        }
      }
    }, this);
    return true;
  }

  /**
   * Translate date from request to internal schema
   */
  this.setupDate = function () {

    //Posune mesic o jednu nahoru a dodat nulu pred
    var monthIncrease = function (original) {
      var inc = parseInt(original) + 1;
      if (inc < 10) {
        return '0' + inc;
      }
      return inc;
    };

    //Jenom zajisti u dnů nulu pred
    var day2d = function (original) {
      if (original < 10) {
        return '0' + original;
      }
      return original;
    };

    if (this.date && this.date.endDate) {
      var parts = this.date.endDate.split('-');
      this.eDate = new Date(parts[0], parts[1] - 1, parts[2]);
    } else {
      this.eDate = new Date();
      this.eDate.setUTCDate(eDate.getUTCDate() - 1);
    }
    this.endDate = this.eDate.getFullYear() + '-' + monthIncrease(this.eDate.getMonth()) + '-' + day2d(this.eDate.getDate());

    if (this.date && this.date.startDate) {
      var parts = this.date.startDate.split('-');
      this.sDate = new Date(parts[0], parts[1] - 1, parts[2]);
    } else {
      this.sDate = new Date();
      this.sDate.setUTCDate(this.sDate.getUTCDate() - 7);
    }
    this.startDate = this.sDate.getFullYear() + '-' + monthIncrease(this.sDate.getMonth()) + '-' + day2d(this.sDate.getDate());
  }

  /**
   * Load data from API
   */
  this.loadData = function () {

    //Je třeba dodržet sestupné pořadí (pokud chci reklamu a sloupečky z groups, 
    //tak by to mohlo prvně chytit groups reporty (proto ads podmínky před groups a 
    //groups před campaigns
    if (this.reportsList.adsDaily || this.reportsList.adsWeekly || this.reportsList.adsMonthly || this.reportsList.adsQuarterly || this.reportsList.adsYearly) {
      this.displayColumns.ads.push('headline1');
      var Ads = new AdsClass(this);
      if (this.reportsList.adsDaily) {
        var period = 'daily';
      } else if (this.reportsList.adsWeekly) {
        var period = 'weekly';
      } else if (this.reportsList.adsMonthly) {
        var period = 'monthly';
      } else if (this.reportsList.adsQuarterly) {
        var period = 'quarterly';
      } else if (this.reportsList.adsYearly) {
        var period = 'yearly';
      }
      var days = this.setupDaysCycle(period);
      var response = Ads.adsPeriodCreateReport(Math.floor(5000 / days), period);
      if (response) {
        return Ads.returnAdsPeriodDataPackage(response);
      }
    } else if (this.reportsList.ads) {
      this.displayColumns.ads.push('headline1');
      var Ads = new AdsClass(this);
      var response = Ads.adsCreateReport();
      if (response) {
        return Ads.returnAdsDataPackage(response);
      }
    }
    if (this.reportsList.bannersDaily || this.reportsList.bannersWeekly || this.reportsList.bannersMonthly || this.reportsList.bannersQuarterly || this.reportsList.bannersYearly) {
      this.displayColumns.banners.push('bannerName');
      var Banners = new BannersClass(this);
      if (this.reportsList.bannersDaily) {
        var period = 'daily';
      } else if (this.reportsList.bannersWeekly) {
        var period = 'weekly';
      } else if (this.reportsList.bannersMonthly) {
        var period = 'monthly';
      } else if (this.reportsList.bannersQuarterly) {
        var period = 'quarterly';
      } else if (this.reportsList.bannersYearly) {
        var period = 'yearly';
      }
      var days = this.setupDaysCycle(period);
      var response = Banners.bannersPeriodCreateReport(Math.floor(5000 / days), period);
      if (response) {
        return Banners.returnBannersPeriodDataPackage(response);
      }
    } else if (this.reportsList.banners) {
      this.displayColumns.banners.push('bannerName');
      var Banners = new BannersClass(this);
      var response = Banners.bannersCreateReport();
      if (response) {
        return Banners.returnBannersDataPackage(response);
      }
    }

    if (this.reportsList.groupsDaily || this.reportsList.groupsWeekly || this.reportsList.groupsMonthly || this.reportsList.groupsQuarterly || this.reportsList.groupsYearly) {
      this.displayColumns.groups.push('name');
      var Groups = new GroupsClass(this);
      if (this.reportsList.groupsDaily) {
        var period = 'daily';
      } else if (this.reportsList.groupsWeekly) {
        var period = 'weekly';
      } else if (this.reportsList.groupsMonthly) {
        var period = 'monthly';
      } else if (this.reportsList.groupsQuarterly) {
        var period = 'quarterly';
      } else if (this.reportsList.groupsYearly) {
        var period = 'yearly';
      }
      var days = this.setupDaysCycle(period);
      var response = Groups.groupsPeriodCreateReport(Math.floor(5000 / days), period);
      if (response) {
        return Groups.returnGroupsPeriodDataPackage(response);
      }
    } else if (this.reportsList.groups) {
      this.displayColumns.groups.push('name');
      var Groups = new GroupsClass(this);
      var response = Groups.groupsCreateReport();
      if (response) {
        return Groups.returnGroupsDataPackage(response);
      }
    }

    if (this.reportsList.campaignsDaily || this.reportsList.campaignsWeekly || this.reportsList.campaignsMonthly || this.reportsList.campaignsQuarterly || this.reportsList.campaignsYearly) {
      this.displayColumns.campaigns.push('name');
      var Campaigns = new CampaignsClass(this);
      if (this.reportsList.campaignsDaily) {
        var period = 'daily';
      } else if (this.reportsList.campaignsWeekly) {
        var period = 'weekly';
      } else if (this.reportsList.campaignsMonthly) {
        var period = 'monthly';
      } else if (this.reportsList.campaignsQuarterly) {
        var period = 'quarterly';
      } else if (this.reportsList.campaignsYearly) {
        var period = 'yearly';
      }
      var days = this.setupDaysCycle(period);
      var response = Campaigns.campaignsPeriodCreateReport(this.campaignsId, Math.floor(5000 / days), period);
      if (response) {
        return Campaigns.returnCampaignsPeriodDataPackage(response);
      }
    } else if (this.reportsList.campaigns) {
      this.displayColumns.campaigns.push('name');
      var Campaigns = new CampaignsClass(this);
      var response = Campaigns.campaignsCreateReport(this.campaignsId);
      if (response) {
        return Campaigns.returnCampaignsDataPackage(response);
      }
    }

    //Pokud nezobrazuji zadnou dimenzi, tak jenom cista data (scorecard)
    return this.singleCreateReport();
  }

  /**
  * For scorecard will not load any dimensions. 
  * Its assumption, that get only one columns (so make report from it and return only this number)
  */
  this.singleCreateReport = function () {

    //Pokud existuje alespoň jeden sloupeček v ads (načtu z něj)
    if (this.displayColumns.ads.length > 0) {
      var Ads = new AdsClass(this);
      var response = Ads.adsCreateReport();
      if (response) {
        return Ads.returnAdsDataPackage(response);
      }      
    //Pokud existuje alespoň jeden sloupeček v banners (načtu z něj)
    } else if (this.displayColumns.banners.length > 0) {
      var Banners = new BannersClass(this);
      var response = Banners.bannersCreateReport();
      if (response) {
        return Banners.returnBannersDataPackage(response);
      }
    //Pokud existuje alespoň jeden sloupeček v groups (načtu z něj)
    } else if (this.displayColumns.groups.length > 0) {
      var Groups = new GroupsClass(this);
      var response = Groups.groupsCreateReport();
      if (response) {
        return Groups.returnGroupsDataPackage(response);
      }
      //Pokud neexistuje sloupeček v groups, ale v campaigns, načítám z něj
    } else if (this.displayColumns.campaigns.length > 0) {
      var Campaigns = new CampaignsClass(this);
      var response = Campaigns.campaignsCreateReport(this.campaignsId);
      if (response) {
        return Campaigns.returnCampaignsDataPackage(response);
      }
    }
  }

  /**
  * On setup granularity of API, get response only records with non empty. 
  * So we must do iteration for missing records and add zero value manualy. 
  * This method prepare correct package of dates,which response of data we get from API, 
  * needed for compare what actualy have records and what missing
  * @return {int}
  */
  this.setupDaysCycle = function (period) {
    //Pocitadlo dne
    var dayCounter = this.sDate;
    //Prevod dne na porovnavatelny string
    var dayInString = '';
    var startLoop = true;

    while (dayCounter.getTime() <= this.eDate.getTime()) {
      var correctMonth = dayCounter.getMonth() + 1;
      if (correctMonth < 10) {
        correctMonth = '0' + correctMonth;
      }
      if (period == 'weekly' && startLoop) {
        startLoop = false;
        dayCounter = new Date(dayCounter.setDate(dayCounter.getDate() - dayCounter.getDay() + 1));
      }
      var correctDay = dayCounter.getDate();
      if (correctDay < 10) {
        correctDay = '0' + correctDay;
      }
      if (period == 'daily') {
        dayInString = dayCounter.getFullYear() + '' + correctMonth + '' + correctDay;
        dayCounter = new Date(dayCounter.setUTCDate(dayCounter.getUTCDate() + 1));
      }
      if (period == 'weekly') {
        dayInString = dayCounter.getFullYear() + '' + correctMonth + '' + correctDay;
        dayCounter = new Date(dayCounter.setDate(dayCounter.getDate() + (7 - dayCounter.getDay()) + 1));
      }
      if (period == 'monthly') {
        dayInString = dayCounter.getFullYear() + '' + correctMonth;
        dayCounter = new Date(dayCounter.setUTCMonth(dayCounter.getUTCMonth() + 1));
      }
      if (period == 'quarterly') {
        dayInString = '';
        var increase = 1;
        if (dayCounter.getMonth() >= 9) {
          dayInString = dayCounter.getFullYear() + '04';
          increase = 12 - dayCounter.getMonth();
        } else if (dayCounter.getMonth() >= 6) {
          dayInString = dayCounter.getFullYear() + '03';
          increase = 9 - dayCounter.getMonth();
        } else if (dayCounter.getMonth() >= 3) {
          dayInString = dayCounter.getFullYear() + '02';
          increase = 6 - dayCounter.getMonth();
        } else if (dayCounter.getMonth() >= 0) {
          dayInString = dayCounter.getFullYear() + '01';
          increase = 3 - dayCounter.getMonth();
        }
        dayCounter = new Date(dayCounter.setUTCMonth(dayCounter.getUTCMonth() + increase));
      }
      if (period == 'yearly') {
        dayInString = dayCounter.getFullYear().toString();
        dayCounter = new Date(dayCounter.setUTCFullYear(dayCounter.getUTCFullYear() + 1));
      }
      this.timeline.push(dayInString);
    }
    this.Log.addValue('\n' + this.timeline.join('|'), true, 'setupDaysCycle()');
    return this.timeline.length;
  }

  /**
   * Schema of data
   * @return {Object}
   */
  this.getDataSchema = function () {
    return this.rDataSchema;
  }

  /**
   * Loaded data
   * @return {Object[]}
   */
  this.getData = function () {
    this.Log.addRecord('Načítání dat');
    this.Log.addValue(JSON.stringify(this.data), true, 'getData()');
    return this.data;
  }

  /**
   * Call Sklik API
   * @param {String} method
   * @param {Object[]} parameters
   */
  this.sklikApi = function (method, parameters) {
    this.Log.addValue('\n' + JSON.stringify(parameters), true, 'sklikApi()');
    var stat = UrlFetchApp.fetch('https://api.sklik.cz/jsonApi/drak/' + method, {
      'method': 'post',
      'contentType': 'application/json',
      'muteHttpExceptions': true,
      'payload': JSON.stringify(parameters)
    }
    );
    var response = JSON.parse(stat);
    this.Log.addRecord('\n API[' + method + '] ' + JSON.stringify(response), true, 'sklikApi');
    if (stat.getResponseCode() == 200) {
      if (response.session) {
        this.session = response.session;
        return response;

        //Logout do not return session (just status and statusMessage)
      } else if (method == 'client.logout') {
        return response;
      } else {
        this.Log.addRecord('\n Metoda [' + method + '] nevraci session');
        return false;
      }
    } else {
      this.Log.addRecord('\n Metoda [' + method + '] vrací špatný návratový status: ' + response.status);
      return false;
    }
  }

/**
* For weekly granularity needs number of week
* @param {Date} date
* @return {Int} - week number
*/
 this.getWeek = function (date) {  
  // ISO week date weeks start on Monday, so correct the day number
  var nDay = (date.getDay() + 6) % 7;
  
  // ISO 8601 states that week 1 is the week with the first Thursday of that year
  // Set the target date to the Thursday in the target week
  date.setDate(date.getDate() - nDay + 3);
  
  // Store the millisecond value of the target date
  var n1stThursday = date.valueOf();
  
  // Set the target to the first Thursday of the year
  // First, set the target to January 1st
  date.setMonth(0, 1);
  
  // Not a Thursday? Correct the date to the next Thursday
  if (date.getDay() !== 4) {
    date.setMonth(0, 1 + ((4 - date.getDay()) + 7) % 7);
  }
  
  // The week number is the number of weeks between the first Thursday of the year
  // and the Thursday in the target week (604800000 = 7 * 24 * 3600 * 1000)
  return 1 + Math.ceil((n1stThursday - date) / 604800000);
}
}