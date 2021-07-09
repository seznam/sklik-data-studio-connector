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
 * @param {String} folderId - ID of folder where the logger file is
 * @param {String} logFileName - Name of logger file
 * @param {String} fileId - ID of the looger file
 */
var GetDataLog = function (logMode, debugMode, folderId, logFileName, fileId) {
    /**
     * Name of logger file
     */
    const FILE_NAME = 'Sklik_DataStudio_Log';

    /**
     * In code is special record messages dedicated only for debug (step by step)
     * If this const is true, will be recorded into log file
     */
    const ERROR_DEBUG = true;  

    /**
     * ID of folder where the logger file is
     * @var {String}
     */
    this.folderId = folderId;
  
    /**
     * ID of the logger file
     * @var {String}
     */
    this.fileId = fileId;

    /**
     * Get email of active user. Use to check if I write log info to my own files
     * @var {String}
     */
    //this.ownerEmail = Session.getActiveUser().getEmail();
    //Need extended in appsscript.json - "https://www.googleapis.com/auth/userinfo.email"

    /**
     * Name of logger file. If null or empty, then use const FILE_NAME
     * @var {String}
     */
    this.logFileName = logFileName;
    if(this.logFileName == '') {
      this.logFileName = FILE_NAME;
    }

  
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
     * Called at start of loading data
     */
    this.setup = function () {
      if (this.logMode || this.debugMode) {
        this.openFolder();
        var doc = this.openFile();
        if (doc) {
          var d = new Date();
          this.docRecord = doc.getBody().appendParagraph('############# Start scriptu ##############');
          this.addInfo('##########################################');
          this.addInfo('Čas spuštění scriptu: '+ d.toString());

          this.addInfo('##### Nastavení logování #####');
          if (this.logMode) {
            this.addInfo('Log mode: zapnutý');
          }
          if (this.debugMode) {
            this.addInfo('Debug mode: zapnutý');
          }
        }
      }
    }
  
    /**
     * Open folder with logger file
     */
    this.openFolder = function () {
      if (this.folderId != '' && this.folderId) {
        var fFolder = DriveApp.getFolderById(this.folderId);
        if (fFolder) {
          this.folder = fFolder;
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
      } else {
        //If I have folderId, looking for a file here
        if (this.folder) {
          //If file exists, use them
          var files = this.folder.getFilesByName(this.logFileName);
          while (files.hasNext()) {
            file = files.next();
            //file is deleted or Im not owner -> this file will not use
            //if(file.isTrashed() || file.getOwner().getEmail() != this.ownerEmail) {
            if(file.isTrashed()) {
              continue;
            }
            var doc = DocumentApp.openById(file.getId());
            doc.getBody().clear();
            return doc;
          }
          //If file do not exists, will create new one
          var docHelp = DocumentApp.create(this.logFileName);
          ins = DriveApp.getFileById(docHelp.getId());
          var file = ins.makeCopy(this.logFileName, this.folder);
          DriveApp.removeFile(ins);
          return DocumentApp.openById(file.getId());
          //Pokud nenastavil slozku, ukladam do rootu (ale nejdrive prohledam disk a hledam dle nazvu)
          //Kdyz nekde najdu, tak ukladam do nej (at je kde chce)
        } else {
          var files = DriveApp.getFilesByName(this.logFileName);
          while (files.hasNext()) {
            file = files.next();
            //file is deleted or Im not owner -> this file will not use
            //if(file.isTrashed() || file.getOwner().getEmail() != this.ownerEmail) {
            if(file.isTrashed()) {
              continue;
            }
            var doc = DocumentApp.openById(file.getId());
            doc.getBody().clear();
            return doc;
          }
          return DocumentApp.create(this.logFileName);  
        }
      }
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
        if (location) {
          var e = this.docRecord.appendText('\n\n' + text + '[' + location + ']');
        } else {
          var e = this.docRecord.appendText('\n\n' + text);
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
        if (location) {
          var e = this.docRecord.appendText('\n' + value + '[' + location + ']');
        } else {
          var e = this.docRecord.appendText('\n' + value);
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
      if (ERROR_DEBUG) {
        if(text.length > 2000) {
          text = text.substr(0, 2000);
          text += ' #### Record was shorted ### ';
        }
        var e = this.docRecord.appendText('\n' + text + '[' + location + ']');
        if(params != undefined) {
          if (typeof params == "object") {
            var params = JSON.stringify(params);
          } 
          if(params.length > 2000) {
            params = params.substr(0, 2000);
            params += ' #### Record was shorted ### ';
          }
          var e = this.docRecord.appendText('\n' + params);
        }
      }
    }
  
    /**
     * Check if this message can be added
     * @param {Boolean} - debug mode is enabled
     * @return {Boolean} - True (text is add to output)
     */
    this.canAddMessage = function (debug) {
      return (this.logMode && (debug == undefined || this.debugMode === debug) && this.docRecord);
    }



    /**
     * Add new logger message
     * @param {String} - message to logger
     */
    this.addInfo = function (text) {
      var e = this.docRecord.appendText('\n' + text);
    }
  }