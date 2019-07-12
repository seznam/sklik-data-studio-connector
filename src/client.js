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
var ClientClass = function (rRoot) {
  
  /**
   * @param {Root}
   */
  this.Root = rRoot;
  
  /**
   * @param {DataCore} 
   */
  this.DC = new DataCore(rRoot, 'client');

  /**
   * Prepare report at API
   * @return {Object} - return report from API readReport
   */
  this.getDataFromApi = function (granularity, params) {
    this.Root.Log.addRecord('Příprava metody clientStats', true, 'client.clientStats');
    var restrictionFilter = {
      'dateFrom': this.Root.startDate,
      'dateTo': this.Root.endDate,
      'granularity' : granularity
    };
    
    return this.Root.sklikApi(
      'client.stats', 
      [{ 'session': this.Root.session, 'userId': this.Root.userId },
        restrictionFilter
      ]
    );
  }


  /**
   * Need data overturn from API response to GDS format
   * @param {Object} response - Response from campaigns.readReport
   * @return {Boolean}
   */
  this.convertDataToGDS = function (response) {
    return this.DC.returnDataPackage(response, 'client');
  }

  /**
   * Need data overturn from API response to GDS format
   * @param {Object} response - Response from campaigns.readReport
   * @return {Boolean}
   */
  this.convertDataToGDSInGranularity = function (response) {
    return this.DC.returnDataPackageInGranularity(response, 'client');
  }
}