/**
 * Sklik account-ID utility.
 *
 * Deploy this Apps Script as a web app (see utility/README.md).  The token is
 * used only for the request that lists the accessible Sklik accounts; it is
 * never stored or written to logs.
 */
var SKLIK_DRAK_ENDPOINT = 'https://api.sklik.cz/drak/json/v5/';

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Sklik – ID účtů')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Returns the account represented by the token plus all accessible managed
 * accounts. Intended for google.script.run from Index.html.
 */
function getSklikAccounts(token) {
  if (typeof token !== 'string' || !token.trim()) {
    throw new Error('Zadejte prosím Sklik API token.');
  }

  var login = callSklik_('client.loginByToken', token.trim());
  var accounts;
  try {
    // JSON Drak represents the method arguments as an array. Login is the
    // exception: it receives the token itself, while client.get receives one
    // `user` argument containing the session.
    var client = callSklik_('client.get', [{ session: login.session }]);
    accounts = [{
      userId: client.user.userId,
      username: client.user.username,
      access: 'vlastní účet',
      relationStatus: 'live'
    }].concat((client.foreignAccounts || []).map(function (account) {
      return {
        userId: account.userId,
        username: account.username,
        access: account.access || '',
        relationStatus: account.relationStatus || ''
      };
    }));
  } finally {
    // A failed logout must not hide the successfully fetched account list.
    try {
      callSklik_('client.logout', [{ session: login.session }]);
    } catch (ignore) {}
  }

  return accounts;
}

function callSklik_(method, payload) {
  var response = UrlFetchApp.fetch(SKLIK_DRAK_ENDPOINT + method, {
    method: 'post',
    contentType: 'application/json',
    muteHttpExceptions: true,
    payload: JSON.stringify(payload)
  });
  var httpStatus = response.getResponseCode();
  var body = response.getContentText();
  var data;

  try {
    data = JSON.parse(body);
  } catch (error) {
    throw new Error('Sklik API vrátilo neplatnou odpověď (HTTP ' + httpStatus + ').');
  }

  if (httpStatus < 200 || httpStatus >= 300) {
    throw new Error('Sklik API HTTP chyba ' + httpStatus + '.');
  }
  if (data.status !== 200 && data.status !== 206) {
    throw new Error('Sklik API chyba ' + data.status + ': ' + (data.statusMessage || 'neznámá chyba'));
  }
  return data;
}
