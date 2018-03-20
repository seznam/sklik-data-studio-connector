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
 * @param {String} fileId - ID of the looger file
 */
var GetDataLog = function (logMode, debugMode, folderId, fileId) {
    /**
     * Name of logger file
     */
    const FILE_NAME = 'Sklik_DataStudio_Log';
  
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
          this.docRecord = doc.getBody().appendParagraph('\n\nNačítání dat:' + d.toString());
          if (this.logMode) {
            this.addInfo('Log Mode je zapnutý');
          }
          if (this.debugMode) {
            this.addInfo('Debug Mode je zapnutý');
          }
        }
      }
    }
  
    /**
     * Open folder with logger file
     */
    this.openFolder = function () {
      if (this.folderId) {
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
      if (this.fileId) {
        var doc = DocumentApp.openById(this.fileId);
        doc.getBody().clear();
        return doc;
      } else {
        //Pokud nastavil slozku, ukladam tam
        if (this.folder) {
          //Pokud soubor extistuje ukladam do nej
          var file = this.folder.getFilesByName(FILE_NAME);
          if (file.hasNext()) {
            file = file.next();
            var doc = DocumentApp.openById(file.getId());
            doc.getBody().clear();
            return doc;
          }
          //Jinak vytvorim novy soubor
          var docHelp = DocumentApp.create(FILE_NAME);
          ins = DriveApp.getFileById(docHelp.getId());
          var file = ins.makeCopy(FILE_NAME, this.folder);
          DriveApp.removeFile(ins);
          return DocumentApp.openById(file.getId());
          //Pokud nenastavil slozku, ukladam do rootu (ale nejdrive prohledam disk a hledam dle nazvu)
          //Kdyz nekde najdu, tak ukladam do nej (at je kde chce)
        } else {
          var file = DriveApp.getFilesByName(FILE_NAME);
          if (file.hasNext()) {
            var fileS;
            do {
              fileS = file.next();
              if (!fileS.isTrashed()) {
                var doc = DocumentApp.openById(fileS.getId());
                doc.getBody().clear();
                return doc;
              }
            } while (file.hasNext());
          }
          return DocumentApp.create(FILE_NAME);
  
        }
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
      if (this.logMode && (debug == undefined || this.debugMode === debug) && this.docRecord) {
        if (location) {
          var e = this.docRecord.appendText('\n' + text + '[' + location + ']');
        } else {
          var e = this.docRecord.appendText('\n' + text);
        }
      }
    }
  
    /**
     * Add new logger message
     * @param {String} - message to logger
     * @param {Boolean} - will save only if is debug mode enabled
     * @param {Location} - source of logger message
     */
    this.addValue = function (text, debug, location) {
      if (this.logMode && (debug == undefined || this.debugMode === debug) && this.docRecord) {
        if (location) {
          var e = this.docRecord.appendText('\n' + text + '[' + location + ']');
        } else {
          var e = this.docRecord.appendText('\n' + text);
        }
      }
    }
  
    /**
     * Add new logger message
     * @param {String} - message to logger
     */
    this.addInfo = function (text) {
      var e = this.docRecord.appendText('\n' + text);
    }
  }
  
  /**
   * Logger test 
   */
  function testErrorLog() {
    var Log = new GetDataLog(true, true);
    Log.setup();
    Log.addRecord('test2', true);
  }