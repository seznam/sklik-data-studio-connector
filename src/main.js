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
 * Returns the schema for the given request. 
 * This provides the information about how the connector's data is organized. 
 * For each field it includes details such as identifiers, names, data types, etc.
 * @param {Object} request A JavaScript object containing the schema request parameters.
 * @return {object} A JavaScript object representing the schema for the given request.
 * @link https://developers.google.com/datastudio/connector/reference#getschema
 */
function getSchema(request) {
  var Sch = new Schema(request.configParams);
  return { schema: Sch.getSchema() };
}

/**
 * Returns the tabular data for the given request.
 * @param {Object} request A JavaScript object containing the data request parameters.
 * @link https://developers.google.com/datastudio/connector/reference#getdata
 */
function getData(request) {
  //Register request -> testing in debugging 
  //console.error({'request': request});
  //return false;

  try {
    var Sch = new Schema(request.configParams);
    var Ro = new Root(request.configParams, Sch.getSchema(), request.fields, request.dateRange);
    Ro.setup();
    if (Ro.load()) {
      return {
        schema: Ro.getDataSchema(),
        rows: Ro.getData()
      };
    }
  } catch (exp) {
    console.error({'location': 'getData', 'err': exp });
    Ro.Log.addRecord('Ve scriptu nastal neidentifikovaný problém');
    Ro.Log.addValue(exp, true);
  }
}

/**
 * Returns the authentication method required by the connector to authorize the 3rd-party service.
 * @return {object} A JavaScript object that contains the AuthType indicating the authentication method used by the connector.
 * @link https://developers.google.com/datastudio/connector/reference#getauthtype 
 */
function getAuthType() {
  var response = {
    "type": "NONE"
  };
  return response;
}

/**
 * This is an optional function.
 * This checks whether the current user is an admin user of the connector. 
 * In Data Studio this function is used to enable/disable debug features. 
 * See how you can debug your code using this function.
 * @return {boolean} Returns true if the current authenticated user at the time of function execution 
 * is an admin user of the connector. 
 * If the function is omitted or if it returns false, 
 * then the current user will not be considered an admin user of the connector.
 * @link https://developers.google.com/datastudio/connector/reference#isadminuser
 */
function isAdminUser() {
  return true;
}

