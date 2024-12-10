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
 * @param {Boolean} logMode - setup basic logger
 * @param {Boolean} debugMode - extended logger (include api calls dumps, columns detail etc.)
 * @param {String} fileId - ID of the looger file
 */
var GetDataLog = function (logMode, debugMode, fileId) {

  /**
   * In code is special record messages dedicated only for debug (step by step)
   * If this const is true, will be recorded into log file
   */
  const ERROR_DEBUG = true;  

  /**
   * ID of the logger file
   * @var {String}
   */
  this.fileId = fileId;

  //this.defaultFontSize = 12;

  /**
   * Get email of active user. Use to check if I write log info to my own files
   * @var {String}
   */
  //this.ownerEmail = Session.getActiveUser().getEmail();
  //Need extended in appsscript.json - "https://www.googleapis.com/auth/userinfo.email"

 
  if (logMode == undefined || logMode == 'True' || logMode == 'true' || logMode === true) {
    this.logMode = true;
  } else {
    this.logMode = false;
  }
  if (debugMode == 'True' || debugMode == 'true' || debugMode === true) {
    this.debugMode = true;
  } else {
    this.debugMode = false;
  }

  /**
  * @var {Paragraph}
  */
  this.docRecord;

   /**
  * @var {Body}
  */
  this.docBody;

  var styleH1 = {};
  styleH1[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] =
      DocumentApp.HorizontalAlignment.CENTER;
  styleH1[DocumentApp.Attribute.FONT_SIZE] = 18;
  styleH1[DocumentApp.Attribute.BOLD] = true;
  styleH1[DocumentApp.Attribute.FOREGROUND_COLOR] = '#000000';

  var styleDefault = {};
  styleDefault[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] =
      DocumentApp.HorizontalAlignment.LEFT;
  styleDefault[DocumentApp.Attribute.FONT_SIZE] = 12;
  styleDefault[DocumentApp.Attribute.BOLD] = false;
  styleDefault[DocumentApp.Attribute.FOREGROUND_COLOR] = '#000000';

  var styleDebug = {};
  styleDebug[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.LEFT;
      styleDebug[DocumentApp.Attribute.FONT_SIZE] = 10;
      styleDebug[DocumentApp.Attribute.BOLD] = false;
      styleDebug[DocumentApp.Attribute.FOREGROUND_COLOR] = '#808080';

  var styleCaption = {};
      styleCaption[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.CENTER;
      styleCaption[DocumentApp.Attribute.FONT_SIZE] = 12;
      styleCaption[DocumentApp.Attribute.BOLD] = true;
      styleCaption[DocumentApp.Attribute.FOREGROUND_COLOR] = '#000000';

  var styleLocation = {};
  styleLocation[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] =
      DocumentApp.HorizontalAlignment.RIGHT;
  styleLocation[DocumentApp.Attribute.FONT_SIZE] = 10;
  styleLocation[DocumentApp.Attribute.BOLD] = false;
  styleLocation[DocumentApp.Attribute.FOREGROUND_COLOR] = '#808080';

  var styleJson = {};
  styleJson[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] =
      DocumentApp.HorizontalAlignment.LEFT;
  styleJson[DocumentApp.Attribute.FONT_SIZE] = 11;
  styleJson[DocumentApp.Attribute.BOLD] = false;
  styleJson[DocumentApp.Attribute.FOREGROUND_COLOR] = '#000000';

  /**
   * Called at start of loading data
   */
  this.setup = function () {
    if (this.logMode || this.debugMode) {
      var doc = this.openFile();
      if (doc) {
        //this.defaultFontSize = getFontSize();
        var d = new Date();
        this.docBody = doc.getBody();
        this.addHeader('Začátek scriptu', 1);
        this.addInfo('Čas spuštění scriptu: '+ d.toString());
        this.addHeader('Nastavení', 1);        
        this.addNewLine();

        this.addHeader('Nastavení logování', 2);
        if (this.logMode) {
          this.addInfo('Log mode: zapnutý');
        } else {
          this.addInfo('Log mode: vypnutý');
        }
        if (this.debugMode) {
          this.addInfo('Debug mode: zapnutý');
        } else {
          this.addInfo('Debug mode: vypnutý');
        }
        this.addNewLine();
      }
    }
  }

  
  /**
   * Load logger file 
   * I. search in folder (if is setup)
   * II. search accross all disk
   * III. create new one
   */
  this.openFile = function () {
    //If I have fileId, open it (preferred way)
    if (this.fileId) {
      var doc = DocumentApp.openById(this.fileId);
      doc.getBody().clear();
      return doc;
    }
    return false;
  }

  /**
   * Add new logger message
   * @param {String} - message to logger
   * @param {Boolean} - will save only if is debug mode enabled
   * @param {Location} - source of logger message
   */
  this.addRecord = function (text, debug, location) {
    if (this.canAddMessage(debug)) {
      if(text.length > 2000) {
        text = text.substr(0, 2000);
        text += ' #### Record was shorted ### ';
      }
      var e = this.docBody.appendParagraph(text);
      e.setAttributes(styleDefault);
      if (location) {
        this.addLocation(location);
      }      
    }
  }

  /**
   * Dump one value 
   * @param {Mixed} value- message to logger
   * @param {Boolean} debug - will save only if is debug mode enabled
   * @param {String} location - source of logger message
   */
  this.addValue = function (value, debug, location) {
    if (this.canAddMessage(debug)) {
      if (typeof value == "object") {
        value = JSON.stringify(value);
      }

      if(value.length > 2000) {
        value = value.substr(0, 2000);
        value += ' #### Record was shorted ### ';
      }
      var e = this.docBody.appendParagraph(value);
      e.setAttributes(styleDefault);   
      if (location) {
        var e = this.docBody.appendParagraph(value + '[' + location + ']');
        e.setAttributes(styleDefault);
      } 
    }
  }

  /**
   * Special debug messages (for solving problems)
   * @param {String} text - message to logger
   * @param {String} location - source of logger message
   * @param {Mixed} params - 
   */
  this.addDebug = function (text, location, params) {
    if (ERROR_DEBUG && this.canAddMessage(true)) {
      if(text.length > 2000) {
        text = text.substr(0, 2000);
        text += ' #### Record was shorted ### ';
      }
      var e = this.docBody.appendParagraph(text);
      e.setAttributes(styleDebug);

      if(location != undefined) {
        this.addLocation(location);
      }

      if(params != undefined) {
        if (typeof params == "object") {
          var params = JSON.stringify(params);
        } 
        if(params.length > 2000) {
          params = params.substr(0, 2000);
          params += ' #### Record was shorted ### ';
        }
        var e = this.docBody.appendParagraph(params);
        e.setAttributes(styleDebug);
      }
    }
  }

  /**
   * Check if this message can be added
   * @param {Boolean} - debug mode is enabled
   * @return {Boolean} - True (text is add to output)
   */
  this.canAddMessage = function (debug) {
    return (this.logMode && (debug == undefined || this.debugMode === debug) && this.docBody);
  }

  this.addJson = function (text, debug) {
    if(!this.canAddMessage(debug)) {
      return;
    }
    json_parse = JSON.stringify(text, null, 2);
    var maxLength = 1000;
    var truncated_json_parse;
    if (json_parse.length > maxLength) {
      truncated_json_parse = json_parse.substring(0, maxLength) + "#### Record was shortened ####";
    } else {
      truncated_json_parse = json_parse;
    }

    // Zapsat do dokumentu
    var e = this.docBody.appendParagraph(truncated_json_parse);    
    e.setAttributes(styleJson);
  }

  this.addLocation = function(location) {
    if (this.canAddMessage()) {
      text = 'Technické info: Soubor [' + location.file + '], Funkce [' + location.func + ']' + ', Identifikátor ['+ location.line +']';
      var e = this.docBody.appendParagraph(text);
      var style = styleLocation;
      e.setAttributes(style);
    }
  } 

  this.addHeader = function(text, level, type, debug) {
    if (this.canAddMessage(debug)) {
      var e = this.docBody.appendParagraph(text);
      var style = styleH1;
      if(type === 'positive') {        
        style[DocumentApp.Attribute.FOREGROUND_COLOR] = '#46AF20';
      }
      if(type === 'negative') {
        style[DocumentApp.Attribute.FOREGROUND_COLOR] = '#F90707';
      }
      e.setHeading(DocumentApp.ParagraphHeading.HEADING1);
      if(level == 2) {
        e.setHeading(DocumentApp.ParagraphHeading.HEADING2);
      }      
      if(level == 3) {
        e.setHeading(DocumentApp.ParagraphHeading.HEADING3);
      }      
      e.setAttributes(style);
    }    
  }

  this.addCaption = function(text, debug, location) {
    if (this.canAddMessage(debug)) {
      var e = this.docBody.appendParagraph(text);
      e.setAttributes(styleCaption);
      if(location) {
        this.addLocation(location);
      }
    }
  }

  /**
   * Add new logger message
   * @param {String} - message to logger
   */
  this.addInfo = function (text) {
    if (this.canAddMessage()) {
      var e = this.docBody.appendParagraph(text);
      e.setAttributes(styleDefault);
    }
  }

  this.addNewLine = function() {
    if (this.canAddMessage()) {
      var e = this.docBody.appendParagraph('');
      e.setAttributes(styleDefault);
    }
  }
}
