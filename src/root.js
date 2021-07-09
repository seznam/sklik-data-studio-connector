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
   * Requested campaignsTypes from config
   * @param {String[]}
   */
   this.campaignsTypes = [];

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
   * GroupsId loaded from requested campaigns
   * @param {int[]}
   */
  this.campaignsIdsForKeywords = [];

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
   * @see variable granularity (this concept is replaced by this)
   */
  this.reportsList = {};

  /**
   * Save what kind of granularity will be used in report
   * Replace concept with reportsList
   * @param {String}
   */
  this.granularity = 'total';

  /**
   * Skip entities that have no statistics data
   * @param {Boolean}
   */
  this.allowEmptyStatistics = true;


  /**
   * From request select columns of report what to be read
   * This list require keep order @see loadData (part of 'New part of automatic select type of report')
   * @param {Object}
   */
  this.displayColumns = {
    'client': [],
    'ads': [],
    'banners': [],
    'keywords': [],
    'groups': [],
    'campaigns': []
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
    var types = ['campaigns', 'groups', 'ads', 'banners', 'client', 'keywords'];
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
    try {
      if(this.config.rw_log_file_name != undefined && this.config.rw_log_file_name != '') {
        var logFileName = this.config.rw_log_file_name;
      } else {        
        var logFileName = this.config.logFileName;
      } 

      if(this.config.rw_log_folder_id != undefined && this.config.rw_log_folder_id != '') {
        var logFolderId = this.config.rw_log_folder_id;
      } else if (this.config.logFolderId != undefined && this.config.logFolderId != '') {
        var logFolderId = this.config.logFolderId;
      } 

      this.Log = new GetDataLog(this.config.logmode, this.config.debugmode, logFolderId, logFileName);     
      this.Log.setup();
    } catch (exp) {
      console.error({ 'location': 'Root.setup', 'err': exp, 'note': 'create Log.setup' });
      return false;
    }
    this.Log.addRecord('##### Nastavení vstupních dat / Config #####', true, 'root.setup()');
    this.Log.addRecord('Načtené nastavení uživatele', true, 'root.setup()');
    this.Log.addValue(this.config, true, 'root.setup()');
    this.Log.addRecord('Očekávané sloupečky (Metriky a Dimenze - požadavek GDS)', true, 'root.setup()');
    this.Log.addValue(this.fields, true, 'root.setup()');
    this.Log.addRecord('Datum (požadavek GDS)', true, 'root.setup()');
    this.Log.addValue(this.date, true, 'root.setup()');
    try {
      this.setupReportList();
      
      //Restriction about campaigns types (avaliable for campaign, group, ad)
      //The same logic as else part condition but try to use param rw_campaigns_types (rw_* is custom param per single tables and I use it for rewrite global config params)
      if (this.config.rw_campaigns_types != undefined && this.config.rw_campaigns_types == 'ignore') {
        this.Log.addRecord('Pro tuto tabulku se ignoruje nastavení filtru podle typu kampaně');      
      } else if(this.config.rw_campaigns_types != undefined && this.config.rw_campaigns_types != '') {
        this.campaignsTypes = this.config.rw_campaigns_types.split(',');
        this.Log.addRecord('Budou se načítat informace jenom data z těchto typů kampaní: ' + this.config.rw_campaigns_id);
      } else if (this.config.campaignsTypes != undefined && this.config.campaignsTypes != '') {
        this.campaignsTypes = this.config.campaignsTypes.split(',');
        this.Log.addRecord('Budou se načítat informace jenom data z těchto typů kampaní: ' + this.config.campaignsTypes);
      }

      //Pokud jsou nastavené campaignsId, tak se jede podle toho 
      //(řídí campaigns, ale groups a ads pouze pokud není groupsId)   
      //The same logic as else part condition but try to use param rw_campaigns_id (rw_* is custom param per single tables and I use it for rewrite global config params)
      
      if (this.config.rw_campaigns_id != undefined && this.config.rw_campaigns_id != '') {
        var stringCampaignsId = this.config.rw_campaigns_id.split(',');
        this.Log.addRecord('Budou se načítat informace jenom pro tyto kampaně: ' + this.config.rw_campaigns_id);
        //From {String[]} -> {Int[]}
        for (var i = 0; i < stringCampaignsId.length; i++) {
          this.campaignsId.push(parseInt(stringCampaignsId[i]));
        }
      } else if (this.config.campaignsId != undefined && this.config.campaignsId != '') {
        var stringCampaignsId = this.config.campaignsId.split(',');
        this.Log.addRecord('Budou se načítat informace jenom pro tyto kampaně: ' + this.config.campaignsId);
        //From {String[]} -> {Int[]}
        for (var i = 0; i < stringCampaignsId.length; i++) {
          this.campaignsId.push(parseInt(stringCampaignsId[i]));
        }
      }

      //Pokud jsou nastavené i groupsId tak jsou řídící pro groups a ads
      //The same logic as else part condition but try to use param rw_group_id (rw_* is custom param per single tables and I use it for rewrite global config params)
      if (this.config.rw_group_id != undefined && this.config.rw_group_id != '') {
        var stringGroupsId = this.config.rw_group_id.split(',');
        this.Log.addRecord('Budou se načítat informace jenom pro tyto sestavy: ' + this.config.rw_group_id);
        //From {String[]} -> {Int[]}
        for (var i = 0; i < stringGroupsId.length; i++) {
          this.groupsId.push(parseInt(stringGroupsId[i]));
        }
        this.loadFromGroups = true;
      } else if (this.config.groupsId != undefined && this.config.groupsId != '') {
        var stringGroupsId = this.config.groupsId.split(',');
        this.Log.addRecord('Budou se načítat informace jenom pro tyto sestavy: ' + this.config.groupsId);
        //From {String[]} -> {Int[]}
        for (var i = 0; i < stringGroupsId.length; i++) {
          this.groupsId.push(parseInt(stringGroupsId[i]));
        }
        this.loadFromGroups = true;
      }
       else {
        this.loadGroupsFromCampaigns = true;
      }

      //Setup campaign restriction about keywords (from what campaign will be keywords loaded)
      if (this.config.allowEmptyStatistics == undefined || !this.config.allowEmptyStatistics) {
        this.allowEmptyStatistics = false;
      }
      if (this.config.campaignsIdsForKeywords != undefined && this.config.campaignsIdsForKeywords != '') {
        this.stringCampaignsIdsForKeywords = this.config.campaignsIdsForKeywords.split(',');
        this.Log.addRecord('Klíčová slova se budou načítat pouze z těchto kampaní: ' + this.config.campaignsIdsForKeywords);
        //From {String[]} -> {Int[]}
        for (var i = 0; i < stringGroupsId.length; i++) {
          this.campaignsIdsForKeywords.push(parseInt(stringCampaignsIdsForKeywords[i]));
        }
      }
    } catch (err) {
      //@todo make test of this throw problem
      console.error({ 'location': 'Root.setup', 'err': exp });
      this.Log.addRecord('Při načítání configu došlo k chybě :' + JSON.stringify(err));
      return false;
    }
  }

  /**
   * Keep guideline to load data (it control loading data)
   * workflow - logIn -> parseDataRequest -> loadData -> createReport[] -> readReport[] -> returnDataPackage 
   */
  this.load = function () {
    this.Log.addRecord('\n ###### Zahájení práce pro získání dat ######');
    if (this.logIn()) {
      console.info({ 'UserId': this.config.userId });
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
    this.Log.addRecord('Začátek přihlašování uživatele ...');
    var response = this.sklikApiCall('client.loginByToken', this.config.token, 1);
    if (response) {
      this.Log.addRecord('Uživatel se přihlásil \n');
      return true;
    } else {
      this.Log.addRecord('Nepodařilo se přihlásit uživatele');
      this.Log.addRecord('Důvod chyby u přihlašování: ' + response);
      return false;
    }
  }

  /**
   * Analyze types of request and set up all need parts for correct loading (choice report type, columns)
   */
  this.parseDataRequest = function () {
    //Jedna se o vytrideni dat, ktere jsou v pozadavku na zobrazeni z celkoveho baliku dat
    this.Log.addDebug('-//- Start iteration over schema fields and match with request', 'root.parseDataRequest[start]');
    this.fields.forEach(function (field) {
      for (var i = 0; i < this.sklikDataSchema.length; i++) {
        if (this.sklikDataSchema[i].name === field.name) {
          this.rDataSchema.push(this.sklikDataSchema[i]);

          //New concept developed on Client and Keywords (in future will replaced in other entities)  
          if (
            this.sklikDataSchema[i].semantics &&
            this.sklikDataSchema[i].semantics.conceptType == 'DIMENSION' &&
            this.sklikDataSchema[i].group != undefined &&
            this.sklikDataSchema[i].group == 'granularity'
          ) {
            this.granularity = this.sklikDataSchema[i].name;
          }
          //#End of new concept

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
            case 'clc':
              this.displayColumns.client.push(this.sklikDataSchema[i].name.substring(4));
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
            case 'kwc':
              this.displayColumns.keywords.push(this.sklikDataSchema[i].name.substring(4));
              break;
          }
          break;
        }
      }
    }, this);
    this.Log.addRecord('Ze schématu se vybraly tyto metriky: ', true, "root.parseDataRequest()");
    this.Log.addValue(this.displayColumns, true, "root.parseDataRequest()");
    return true;
  }

  /**
   * Translate date from request to internal schema
   * Take GDS date request and translate to API format 
   * If GDS have no date range (will take as endDate - yesterday and startDate - 7 day back)
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

    this.Log.addDebug('-//- Translate date format form GDS to API', 'root.setupDate[start]');
    try {
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
      this.Log.addRecord('Budou se stahovat data z časového rozmezí: Od[dateFrom] ' + this.startDate + ' Do[dateTo] ' + this.endDate);
    } catch (ext) {
      this.Log.addRecord('Nastal problém při úpravě převodu data z formátu GDS do formátu API');
      this.Log.addValue(ext);
    }
    this.Log.addDebug('-//- Translate date from GDS to API', 'root.setupDate[finall]');
    this.Log.addDebug('-//- GDS date', 'root.setupDate[finall]', JSON.stringify(this.date));
    this.Log.addDebug('-//- API format endDate ' + this.endDate + ' a startDate ' + this.startDate, 'root.setupDate[finall]');
  }

  /**
   * We need pick up what endpoint will be called. 
   * This method will do it. 
   * Need keep order (first level) in variable @displayColumns
   */
  this.selectEntity = function() {    
    try {
      for (entity in this.displayColumns) {
        if (this.displayColumns[entity].length > 0) {
          this.Log.addDebug('-//- Will be loaded report ' + entity, 'root.loadData');
          return entity;
        }
      }
    } catch (exp) {
      console.error({ 'location': 'Root.loadData', 'err': exp, 'note': 'select report type' });
      this.Log.addRecord('Nastal problém při výběru sprévného reportu (Nejde rozhodnout jaká metoda na API se má volat)');
      this.Log.addValue(exp);
      return false;
    }
  }


  /**
   * Load data from API
   */
  this.loadData = function () {
    this.Log.addDebug('-//- Select what kind of report will be called', 'root.loadData[start]');
    this.Log.addRecord('Začátek stahování dat z API');

    //What endpint (what entity) will be called
    var selectedEntity = this.selectEntity();

    if (selectedEntity != '' && selectedEntity != false && (selectedEntity == 'keywords' || selectedEntity == 'client')) {
      switch (selectedEntity) {
        case 'client':
          var instance = new ClientClass(this);
          break;
        case 'keywords':
          this.Log.addDebug('-//- CampaignsIDs restriction for Keywords', 'Root.loadData()', this.campaignsIdsForKeywords);
          var instance = new KeywordsClass(this, this.campaignsIdsForKeywords);
          break;
      }
      if (this.granularity == 'total') {
        this.Log.addDebug('-//- Was selected ' + selectedEntity + ' report in period total', 'root.loadData[final]');
        var response = instance.getDataFromApi(this.granularity, { 'limit': 5000 });
        if (response) {
          return instance.convertDataToGDS(response);
        } else {
          return false;
        }
      } else {
        this.Log.addDebug('-//- Was selected ' + selectedEntity + ' report in period ' + this.granularity, 'root.loadData');
        var days = this.setupDaysCycle(this.granularity);

        var response = instance.getDataFromApi(this.granularity, { 'limit': Math.floor(5000 / days) });
        if (response) {
          return instance.convertDataToGDSInGranularity(response);
        } else {
          return false;
        }
      }
    } else {
      return this.loadDataOld();
    }    
  }

  /**
   * Old way of loading data from API 
   * use for ads,banners,groups,campaigns
   */
  this.loadDataOld = function() {
    //Je třeba dodržet sestupné pořadí (pokud chci reklamu a sloupečky z groups, 
    //tak by to mohlo prvně chytit groups reporty (proto ads podmínky před groups a 
    //groups před campaigns
    //This part is DEPRECATED for new entities (and this entitis will be rebuild to new format)
    if (this.reportsList.adsDaily || this.reportsList.adsWeekly || this.reportsList.adsMonthly || this.reportsList.adsQuarterly || this.reportsList.adsYearly) {
      this.Log.addDebug('-//- Was selected ads report in period', 'root.loadData[final]');
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
      this.Log.addDebug('-//- Was selected ads report', 'root.loadData[final]');
      this.displayColumns.ads.push('headline1');
      var Ads = new AdsClass(this);
      var response = Ads.adsCreateReport();
      if (response) {
        return Ads.returnAdsDataPackage(response);
      }
    }
    if (this.reportsList.bannersDaily || this.reportsList.bannersWeekly || this.reportsList.bannersMonthly || this.reportsList.bannersQuarterly || this.reportsList.bannersYearly) {
      this.Log.addDebug('-//- Was selected banners report in period', 'root.loadData[final]');
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
      this.Log.addDebug('-//- Was selected banners report', 'root.loadData[final]');
      this.displayColumns.banners.push('bannerName');
      var Banners = new BannersClass(this);
      var response = Banners.bannersCreateReport();
      if (response) {
        return Banners.returnBannersDataPackage(response);
      }
    }

    if (this.reportsList.groupsDaily || this.reportsList.groupsWeekly || this.reportsList.groupsMonthly || this.reportsList.groupsQuarterly || this.reportsList.groupsYearly) {
      this.Log.addDebug('-//- Was selected groups report in period', 'root.loadData[final]');
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
      this.Log.addDebug('-//- Was selected groups report', 'root.loadData[final]');
      this.displayColumns.groups.push('name');
      var Groups = new GroupsClass(this);
      var response = Groups.groupsCreateReport();
      if (response) {
        return Groups.returnGroupsDataPackage(response);
      }
    }

    if (this.reportsList.campaignsDaily || this.reportsList.campaignsWeekly || this.reportsList.campaignsMonthly || this.reportsList.campaignsQuarterly || this.reportsList.campaignsYearly) {
      this.Log.addDebug('-//- Was selected campaigns report in period', 'root.loadData[final]');
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
      this.Log.addDebug('-//- Was selected campaigns report', 'root.loadData[final]');
      this.displayColumns.campaigns.push('name');
      var Campaigns = new CampaignsClass(this);
      var response = Campaigns.campaignsCreateReport(this.campaignsId);
      if (response) {
        return Campaigns.returnCampaignsDataPackage(response);
      }
    }


    this.Log.addDebug('-//- Have no dimensions -> go to single report', 'root.loadData[single]');
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
  * @param {String} period - type of periode (daily, weekly, monthly, quarterly, yearly)
  * @return {int}
  */
  this.setupDaysCycle = function (period) {
    //Pocitadlo dne
    var dayCounter = this.sDate;
    //Prevod dne na porovnavatelny string
    var dayInString = '';
    var startLoop = true;
    this.Log.addDebug('-//- Prepare complete data range from requested date period', 'root.setupDaysCycle[start]');
    this.Log.addDebug('-//- Actual period is' + period, 'root.setupDaysCycle[start]');
    try {
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
    } catch (exp) {
      this.Log.addRecord('Nastal problém při přípravě seznamu všech časových jednotek u časového rozpadu statistik');
      this.Log.addValue(exp);
    }
    this.Log.addRecord('Seznam všech časových jednotek pro periodu: ' + period, true, 'root.setupDaysCycle()');
    this.Log.addValue(this.timeline.join('|'), true, 'root.setupDaysCycle()');
    return this.timeline.length;
  }

  /**
   * Schema of data
   * @return {Object}
   */
  this.getDataSchema = function () {
    this.Log.addRecord('Script vrací GDS schéma vybraných metrik, ke kterým přiřadí data', true, 'root.getDataSchema()');
    this.Log.addValue(this.rDataSchema, true, 'root.getDataSchema()');
    return this.rDataSchema;
  }

  /**
   * Loaded data
   * @return {Object[]}
   */
  this.getData = function () {
    this.Log.addRecord('\n ###### Vložení dat ze scriptu do GDS ######');
    this.Log.addRecord('Data načtená scriptem', true, 'root.getData()');
    this.Log.addValue(this.data, true, 'root.getData()');
    if (this.data.length == 0) {
      this.Log.addRecord('Nebyly nalazeny žádné data');
    }
    return this.data;
  }

  /**
   * Call Sklik API
   * !!!!!! DEPRECATED !!!!!! 
   * USE @this.sklikApiCall
   * @param {String} method
   * @param {Object[]} parameters
   */
  this.sklikApi = function (method, parameters) {
    return this.sklikApiCall(method, parameters, 1);
  }

  /**
   * Method to call Sklik API
   * @param {String} method - Final API method
   * @param {Object[]} parameters - All parameters in JSON format
   * @return {Mixed} - Reponse of HTTP status of False
   */
  this.sklikApiCall = function (method, parameters, retry) {
    this.Log.addRecord('\n ############### Call method [' + method + '] ###############', true, 'root.sklikApiCall()');
    if(method == 'client.loginByToken') {
      var paramv = JSON.stringify(parameters);
      this.Log.addValue(paramv.substr(0, 15)+'..shorted', true, 'root.sklikApiCall()');
    } else {
      this.Log.addValue(JSON.stringify(parameters), true, 'root.sklikApiCall()');
    }
    

    if (retry == undefined) { retry = 1; }

    try {
      var stat = UrlFetchApp.fetch('https://api.sklik.cz/drak/json/' + method, {
        'method': 'post',
        'contentType': 'application/json',
        'muteHttpExceptions': true,
        'payload': JSON.stringify(parameters)
      });
      var response = JSON.parse(stat);
      if (stat.getResponseCode() == 200) {
        if (response.session) {
          this.Log.addRecord('Odpověď z API pro metodu ' + method, true, 'root.sklikApiCall()');
          this.Log.addValue(response, true, 'root.sklikApiCall()');
          this.session = response.session;
          return response;
          //Logout do not return session (just status and statusMessage)
        } else if (method == 'client.logout') {
          return response;
        } else {
          throw "Have no 200 respose in body, get [" + stat + "]";
        }
      } else {
        throw "Have no 200 respose in header, get [" + stat + "]";
      }
    } catch (exp) {
      this.Log.addRecord('!!!! ERROR !!!! \n Selhalo ' + retry + '. volání metody.', true, 'root.sklikApiCall()');
      this.Log.addValue(exp, true, 'root.sklikApiCall()');

      if (retry <= 3) {
        this.Log.addRecord('Volám nový pokus', true, 'root.sklikApiCall()');
        return this.sklikApiCall(method, parameters, retry + 1);
      } else {
        console.error({ 'location': 'sklikApiCall', 'err': exp });
        this.Log.addRecord('Ukončení pokusů o provolávání API', true, 'root.sklikApiCall()');
        this.Log.addRecord('API správně neodpovídá na dotazy a není tedy možné získat data do reportu');
        return false;
      }
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

