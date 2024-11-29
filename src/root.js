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
   * When have groupsIds, system will load all groups from requested this list
   * @param {Boolean}
   */
  this.loadFromGroups = false;

  /**
   * GroupsId loaded from requested campaigns
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
    'productsets': [],
    'groups': [],
    'campaigns': []
  }
  this.types = {'cgc': 'campaigns', 'clc': 'client', 'goc': 'groups', 'adc': 'ads', 'add': 'ads', 'bnc': 'banners', 'kwc': 'keywords', 'pic': 'productsets'};

  /*
  * Avaliable periods
  */
  this.periods = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];

  /**
  * When parse required columns and dimension, need setup which report will be used. 
  * This set up all available reports 
  */
  this.setupReportList = function () {
    var types = ['campaigns', 'groups', 'ads', 'banners', 'client', 'keywords', 'productsets'];
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
      if(this.config.rw_log_file_id != undefined && this.config.rw_log_file_id != '') {
        var logFileId = this.config.rw_log_file_id;
      } else {
        var logFileId = this.config.logFileId;
      }       

      this.Log = new GetDataLog(this.config.logmode, this.config.debugmode, logFileId);     
      this.Log.setup();
    } catch (exp) {
      console.error({ 'location': 'Root.setup', 'err': exp, 'note': 'create Log.setup' });
      return false;
    }
    this.Log.addHeader('Nastavení vstupních dat / Config', 2, '', true);
    this.Log.addCaption('Načtené nastavení uživatele', true, {'file': 'root', 'func': 'setup', 'line': 249});
    var cnf = JSON.parse(JSON.stringify(this.config)); 
    cnf.token = cnf.token.substr(0, 15)+'..shorted';
    this.Log.addJson(cnf, true, {'file': 'root', 'func': 'setup', 'line': 252});
    this.Log.addCaption('Očekávané sloupečky (Metriky a Dimenze - požadavek GDS)', true, {'file': 'root', 'func': 'setup', 'line': 253});
    this.Log.addJson(this.fields, true, {'file': 'root', 'func': 'setup', 'line': 254});
    this.Log.addCaption('Datum (požadavek GDS)', true, {'file': 'root', 'func': 'setup', 'line': 255});
    this.Log.addJson(this.date, true);
    try {
      this.setupReportList();
      
      //Restriction about campaigns types (avaliable for campaign, group, ad)
      //The same logic as else part condition but try to use param rw_campaigns_types (rw_* is custom param per single tables and I use it for rewrite global config params)
      if (this.config.rw_campaigns_types != undefined && this.config.rw_campaigns_types == 'ignore') {
        this.Log.addCaption('Pro tuto tabulku se ignoruje nastavení filtru podle typu kampaně');      
      } else if(this.config.rw_campaigns_types != undefined && this.config.rw_campaigns_types != '') {
        this.campaignsTypes = this.config.rw_campaigns_types.split(',');
        this.Log.addCaption('Budou se načítat informace jenom data z těchto typů kampaní');
        this.Log.addValue(this.config.rw_campaigns_id);
      } else if (this.config.campaignsTypes != undefined && this.config.campaignsTypes != '') {
        this.campaignsTypes = this.config.campaignsTypes.split(',');
        this.Log.addCaption('Budou se načítat informace jenom data z těchto typů kampaní');
        this.Log.addValue(this.config.campaignsTypes);
      }

      //Pokud jsou nastavené campaignsId, tak se jede podle toho 
      //(řídí campaigns, ale groups a ads pouze pokud není groupsId)   
      //The same logic as else part condition but try to use param rw_campaigns_id (rw_* is custom param per single tables and I use it for rewrite global config params)
      
      if (this.config.rw_campaigns_id != undefined && this.config.rw_campaigns_id == 'ignore') {
        this.Log.addCaption('Pro tuto tabulku se ignoruje nastavení filtru podle ID kampaní');
      } else if (this.config.rw_campaigns_id != undefined && this.config.rw_campaigns_id != '') {
        var stringCampaignsId = this.config.rw_campaigns_id.split(',');
        this.Log.addCaption('Budou se načítat informace jenom pro tyto kampaně');
        this.Log.addValue(this.config.rw_campaigns_id);
        //From {String[]} -> {Int[]}
        for (var i = 0; i < stringCampaignsId.length; i++) {
          this.campaignsId.push(parseInt(stringCampaignsId[i]));
        }
      } else if (this.config.campaignsId != undefined && this.config.campaignsId != '') {
        var stringCampaignsId = this.config.campaignsId.split(',');
        this.Log.addCaption('Budou se načítat informace jenom pro tyto kampaně');
        this.Log.addValue(this.config.campaignsId);
        //From {String[]} -> {Int[]}
        for (var i = 0; i < stringCampaignsId.length; i++) {
          this.campaignsId.push(parseInt(stringCampaignsId[i]));
        }
      }

      //Pokud jsou nastavené i groupsId tak jsou řídící pro groups a ads
      //The same logic as else part condition but try to use param rw_group_id (rw_* is custom param per single tables and I use it for rewrite global config params)
      if (this.config.rw_group_id != undefined && this.config.rw_group_id == 'ignore') {
        this.Log.addCaption('Pro tuto tabulku se ignoruje nastavení filtru podle ID sestav');
      } else if (this.config.rw_group_id != undefined && this.config.rw_group_id != '') {
        var stringGroupsId = this.config.rw_group_id.split(',');
        this.Log.addCaption('Budou se načítat informace jenom pro tyto sestavy');
        this.Log.addValue(this.config.rw_group_id);
        //From {String[]} -> {Int[]}
        for (var i = 0; i < stringGroupsId.length; i++) {
          this.groupsId.push(parseInt(stringGroupsId[i]));
        }
        this.loadFromGroups = true;
      } else if (this.config.groupsId != undefined && this.config.groupsId != '') {
        var stringGroupsId = this.config.groupsId.split(',');
        this.Log.addCaption('Budou se načítat informace jenom pro tyto sestavy');
        this.Log.addValue(this.config.groupsId);
        //From {String[]} -> {Int[]}
        for (var i = 0; i < stringGroupsId.length; i++) {
          this.groupsId.push(parseInt(stringGroupsId[i]));
        }
        this.loadFromGroups = true;
      }

      //Setup campaign restriction about keywords (from what campaign will be keywords loaded)
      if (this.config.allowEmptyStatistics == undefined || !this.config.allowEmptyStatistics) {
        this.allowEmptyStatistics = false;
      }
      if (this.config.campaignsIdsForKeywords != undefined && this.config.campaignsIdsForKeywords != '') {
        var stringCampaignsIdsForKeywords = this.config.campaignsIdsForKeywords.split(',');
        this.Log.addCaption('Klíčová slova se budou načítat pouze z těchto kampaní');
        this.Log.addValue(this.config.campaignsIdsForKeywords);
        //From {String[]} -> {Int[]}
        for (var i = 0; i < stringCampaignsIdsForKeywords.length; i++) {
          this.campaignsIdsForKeywords.push(parseInt(stringCampaignsIdsForKeywords[i]));
        }
      }
    } catch (err) {
      //@todo make test of this throw problem
      console.error({ 'location': 'Root.setup', 'err': err });
      this.Log.addHeader('Neočekávaná chyba', 2, 'negative');
      this.Log.addRecord('Při načítání configu došlo k chybě :' + JSON.stringify(err));
      return false;
    }
  }

  /**
   * Keep guideline to load data (it control loading data)
   * workflow - logIn -> parseDataRequest -> loadData -> createReport[] -> readReport[] -> returnDataPackage 
   */
  this.load = function () {
    this.Log.addHeader('Získávání dat', 1, 'positive');
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
    this.Log.addHeader('Přihlašování uživatele', 2, 'positive');
    var response = this.sklikApiCall('client.loginByToken', this.config.token, 1);
    if (response) {
      this.Log.addCaption('Uživatel se přihlásil do API');
      return true;
    } else {
      this.Log.addHeader('Nepodařilo se přihlásit uživatele', 2, 'negative');
      this.Log.addRecord('Důvod chyby u přihlašování: ' + response);
      return false;
    }
  }

  /**
   * Analyze types of request and set up all need parts for correct loading (choice report type, columns)
   */
  this.parseDataRequest = function () {
    //Jedna se o vytrideni dat, ktere jsou v pozadavku na zobrazeni z celkoveho baliku dat
    this.Log.addHeader('Výběr dat pro stahování', 2, 'positive', true);
    this.Log.addDebug('-//- Start iteration over schema fields and match with request', {'file': 'root', 'func': 'parseDataRequest', 'line': 381});
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
            //Pokud mam v jednom parametru mam i ID pro které gampaignId se to ma udit 
            var s = this.sklikDataSchema[i].name.split('_');
            if(s.length == 3) {
              var num = Number(s[2]);
              if (this.sklikDataSchema[i].group.indexOf('groups') != -1 && num != undefined) {
                this.Log.addDebug('Bude se filtrovat pouze pro tuto sestavu: ', {'file': 'root', 'func': 'parseDataRequest', 'line': 405}, s[2]);
                this.Log.addJson(s, true);
                this.loadFromGroupsIds.push(parseInt(s[2]));
              } else if (this.sklikDataSchema[i].group.indexOf('campaigns') != -1 && num != undefined) {
                this.Log.addDebug('Bude se filtrovat pouze pro tuto kampaň: ', {'file': 'root', 'func': 'parseDataRequest', 'line': 409}, s[2]);
                this.Log.addJson(s, true);
                this.groupsFromCampaignsIds.push(parseInt(s[2]));
              }              
            }
          }
          
          //Extract from schema columns to readReport and divide to entity list.
          var s = this.sklikDataSchema[i].name.split('_');          
          if(this.types[s[0]] != undefined) {
            this.displayColumns[this.types[s[0]]].push(s[1]);
          }          
        }
      }
    }, this);
    this.Log.addCaption('Ze schématu se vybrali tyto metriky: ', true, {'file': 'root', 'func': 'parseDataRequest', 'line': 424});
    this.Log.addJson(this.displayColumns, true);
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

    this.Log.addDebug('-//- Translate date format form GDS to API',  {'file': 'root', 'func': 'setupDate', 'line': 453});
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
      this.Log.addHeader('Neočekávaná chyba', 2, 'negative');
      this.Log.addRecord('Nastal problém při úpravě převodu data z formátu GDS do formátu API');
      this.Log.addValue(ext);
    }
    this.Log.addDebug('-//- Translate date from GDS to API',  {'file': 'root', 'func': 'setupDate', 'line': 477});
    this.Log.addDebug('-//- GDS date',  {'file': 'root', 'func': 'setupDate', 'line': 478}, JSON.stringify(this.date));
    this.Log.addDebug('-//- API format endDate ' + this.endDate + ' a startDate ' + this.startDate);
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
      this.Log.addHeader('Neočekávaná chyba', 2, 'negative');
      this.Log.addRecord('Nastal problém při výběru sprévného reportu (Nejde rozhodnout jaká metoda na API se má volat)');
      this.Log.addValue(exp);
      return false;
    }
  }


  /**
   * Load data from API
   */
  this.loadData = function () {
    this.Log.addDebug('-//- Select what kind of report will be called', {'file': 'root', 'func': 'loadData', 'line': 508});
    this.Log.addHeader('Začátek stahování dat z API', 2, 'positive', true);

    //What endpint (what entity) will be called
    var selectedEntity = this.selectEntity();
    
    switch (selectedEntity) {
      case 'ads':
        var instance = new AdsClass(this);
        break;
      case 'banners':
        var instance = new BannersClass(this);
        break;
      case 'client':
        var instance = new ClientClass(this);
        break;
      case 'keywords':
        this.Log.addDebug('-//- CampaignsIDs restriction for Keywords', {'file': 'root', 'func': 'loadData', 'line': 525}, this.campaignsIdsForKeywords);
        var instance = new KeywordsClass(this, this.campaignsIdsForKeywords);
        break;
      case 'productsets':
        var instance = new ProductsetsClass(this, this.campaignsId);
        break;
      case 'groups':
        var instance = new GroupsClass(this);
        break;
      case 'campaigns':
        var instance = new CampaignsClass(this);
        break;
      
    }
    if (this.granularity == 'total') {
      this.Log.addDebug('-//- Was selected ' + selectedEntity + ' report in period total', {'file': 'root', 'func': 'loadData', 'line': 540});
      var response = instance.getDataFromApi(this.granularity, { 'limit': 5000 });
      if (response) {
        return instance.convertDataToGDS(response);
      } else {
        return false;
      }
    } else {
      this.Log.addDebug('-//- Was selected ' + selectedEntity + ' report in period ' + this.granularity, {'file': 'root', 'func': 'loadData', 'line': 548});
      var days = this.setupDaysCycle(this.granularity);

      var response = instance.getDataFromApi(this.granularity, { 'limit': Math.floor(5000 / days) });
      if (response) {
        return instance.convertDataToGDSInGranularity(response);
      } else {
        return false;
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
    this.Log.addDebug('-//- Prepare complete data range from requested date period', {'file': 'root', 'func': 'setupDaysCycle', 'line': 575});
    this.Log.addDebug('-//- Actual period is' + period, {'file': 'root', 'func': 'setupDaysCycle', 'line': 576});
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
            dayInString = dayCounter.getFullYear() + '10';
            increase = 12 - dayCounter.getMonth();
          } else if (dayCounter.getMonth() >= 6) {
            dayInString = dayCounter.getFullYear() + '07';
            increase = 9 - dayCounter.getMonth();
          } else if (dayCounter.getMonth() >= 3) {
            dayInString = dayCounter.getFullYear() + '04';
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
      this.Log.addHeader('Neočekávaná chyba', 2, 'negative');
      this.Log.addRecord('Nastal problém při přípravě seznamu všech časových jednotek u časového rozpadu statistik');
      this.Log.addValue(exp);
    }
    this.Log.addRecord('Seznam všech časových jednotek pro periodu: ' + period, true, {'file': 'root', 'func': 'setupDaysCycle', 'line': 634});
    this.Log.addValue(this.timeline.join('|'), true, 'root.setupDaysCycle()');
    return this.timeline.length;
  }

  /**
   * Schema of data
   * @return {Object}
   */
  this.getDataSchema = function () {
    this.Log.addCaption('Script vrací GDS schéma vybraných metrik, ke kterým přiřadí data', true, {'file': 'root', 'func': 'getDataSchema', 'line': 644});
    this.Log.addJson(this.rDataSchema, true);
    return this.rDataSchema;
  }

  /**
   * Loaded data
   * @return {Object[]}
   */
  this.getData = function () {
    this.Log.addHeader('Vložení dat do tabulky', 1, 'positive', true);

    this.Log.addCaption('Data načtená scriptem', true, {'file': 'root', 'func': 'getData', 'line': 656});
    this.Log.addJson(this.data, true);
    if (this.data.length == 0) {
      this.Log.addHeader('Neočekávaná chyba', 2, 'negative');
      this.Log.addCaption('Nebyly nalazeny žádné data');
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
    this.Log.addHeader('Volání metody ' + method, 3, true);
    this.Log.addLocation({'file': 'root', 'func': 'sklikApiCall', 'line': 683});
    if(method == 'client.loginByToken') {
      var paramv = JSON.stringify(parameters);
      this.Log.addValue(paramv.substr(0, 15)+'..shorted', true);
    } else {
      this.Log.addJson(parameters, true);
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
          this.Log.addHeader('Odpověď z API Draka '+ method, 3, 'positive', true);
          this.Log.addCaption('Odpověď z API pro metodu ' + method, true, {'file': 'root', 'func': 'sklikApiCall', 'line': 705});
          this.Log.addJson(response, true);
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
      this.Log.addHeader('Neočekávaná chyba', 2, 'negative', true);
      this.Log.addRecord('Selhalo ' + retry + '. volání metody.', true, {'file': 'root', 'func': 'sklikApiCall', 'line': 720});
      this.Log.addValue(exp, true);

      if (retry <= 3) {
        this.Log.addCaption('Volám nový pokus', true);
        return this.sklikApiCall(method, parameters, retry + 1);
      } else {
        console.error({ 'location': 'sklikApiCall', 'err': exp });
        this.Log.addHeader('Ukončení pokusů o volání API Drak', 2, 'negative');
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

