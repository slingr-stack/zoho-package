/****************************************************
 Configuration builder

 The configuration object should be built to configure the package dependencies

 ****************************************************/

let configurationBuilder = function (config) {
    const userRecord = sys.context.getCurrentUserRecord();
    config.oauth = {
        id: config.oauthAccountId || 'installationInfo-Zoho-User-'+ (userRecord ? userRecord.id() : 'unknownUser'),
        authUrl: config.ZOHO_OAUTH_API_BASE_URL + "/oauth/v2/auth",
        accessTokenUrl: config.ZOHO_OAUTH_API_BASE_URL + "/oauth/v2/token",
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        scope: "ZohoBooks.fullaccess.all",
        oauthCallback: config.oauthCallback
    }
    return config;
}
