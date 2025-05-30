//test

/****************************************************
 Dependencies
 ****************************************************/

let httpReference = dependencies.http;

let httpDependency = {
    get: httpReference.get,
    post: httpReference.post,
    put: httpReference.put,
    delete: httpReference.delete
};

let httpService = {};
let userRecord = {};
let oauthAccountId = "";

function _initConfig() {
    userRecord = sys.context.getCurrentUserRecord();
    oauthAccountId = config.get('oauthAccountId') || ('installationInfo-Zoho-User-'+ (userRecord ? userRecord.id() : 'unknownUser'))
}

/**
 * Handles a request with retry from the platform side.
 */
function handleRequestWithRetry(requestFn, options, callbackData, callbacks) {
    try {

        if(Object.keys(userRecord).length == 0 || !oauthAccountId) {
            _initConfig();
        }

        return requestFn(options, callbackData, callbacks);
    } catch (error) {
        if (error.additionalInfo.status === 401) {
            sys.logs.info("[zoho] Handling request...: "+ JSON.stringify(error));
            const actualRefreshToken = sys.storage.get(oauthAccountId + ' - refresh_token', {decrypt:true});
            const url = config.get("ZOHO_OAUTH_API_BASE_URL")+"/oauth/v2/token?refresh_token=" + actualRefreshToken + "&client_id=" + config.get("clientId") + "&client_secret=" + config.get("clientSecret") + "&redirect_uri=" + config.get("oauthCallback") + "&grant_type=refresh_token";
            const accessTokenResponse = httpService.post({url: url});
            if (!!accessTokenResponse && !!accessTokenResponse.access_token) {
                sys.storage.put(oauthAccountId + ' - access_token', accessTokenResponse.access_token, {encrypt: true});
            }
            return requestFn(setAuthorization(options), callbackData, callbacks);
        } else {
            throw error;
        }
    }
}

function createWrapperFunction(requestFn) {
    return function(options, callbackData, callbacks) {
        return handleRequestWithRetry(requestFn, options, callbackData, callbacks);
    };
}

for (let key in httpDependency) {
    if (typeof httpDependency[key] === 'function') httpService[key] = createWrapperFunction(httpDependency[key]);
}

/**
 * Retrieves the access token.
 *
 * @return {void} The access token refreshed on the storage.
 */
exports.getAccessToken = function () {
    sys.logs.info("[zoho] Getting access token from oauth");
    return dependencies.oauth.functions.connectUser('zoho:userConnected');
}

/**
 * Removes the access token from the oauth.
 *
 * @return {void} The access token removed on the storage.
 */
exports.removeAccessToken = function () {

    if(Object.keys(userRecord).length == 0 || !oauthAccountId) {
        _initConfig();
    }

    sys.logs.info("[zoho] Removing access token from oauth");
    httpService.get({url: config.get("ZOHO_OAUTH_API_BASE_URL")+"/oauth/v2/token/revoke?token=" + sys.storage.get(oauthAccountId + ' - refresh_token', {decrypt:true})});
    return dependencies.oauth.functions.disconnectUser('zoho:disconnectUser');
}

/****************************************************
 Public API - Generic Functions
 ****************************************************/

/**
 * Sends an HTTP GET request to the specified URL with the provided HTTP options.
 *
 * @param {string} path         - The path to send the GET request to.
 * @param {object} httpOptions  - The options to be included in the GET request check http-service documentation.
 * @param {object} callbackData - Additional data to be passed to the callback functions. [optional]
 * @param {object} callbacks    - The callback functions to be called upon completion of the GET request. [optional]
 * @return {object}             - The response of the GET request.
 */
exports.get = function(path, httpOptions, callbackData, callbacks) {
    let options = checkHttpOptions(path, httpOptions);
    return httpService.get(Zoho(options), callbackData, callbacks);
};

/**
 * Sends an HTTP POST request to the specified URL with the provided HTTP options.
 *
 * @param {string} path         - The path to send the POST request to.
 * @param {object} httpOptions  - The options to be included in the POST request check http-service documentation.
 * @param {object} callbackData - Additional data to be passed to the callback functions. [optional]
 * @param {object} callbacks    - The callback functions to be called upon completion of the POST request. [optional]
 * @return {object}             - The response of the POST request.
 */
exports.post = function(path, httpOptions, callbackData, callbacks) {
    let options = checkHttpOptions(path, httpOptions);
    return httpService.post(Zoho(options), callbackData, callbacks);
};

/**
 * Sends an HTTP PUT request to the specified URL with the provided HTTP options.
 *
 * @param {string} path         - The path to send the PUT request to.
 * @param {object} httpOptions  - The options to be included in the PUT request check http-service documentation.
 * @param {object} callbackData - Additional data to be passed to the callback functions. [optional]
 * @param {object} callbacks    - The callback functions to be called upon completion of the POST request. [optional]
 * @return {object}             - The response of the PUT request.
 */
exports.put = function(path, httpOptions, callbackData, callbacks) {
    let options = checkHttpOptions(path, httpOptions);
    return httpService.put(Zoho(options), callbackData, callbacks);
};

/**
 * Sends an HTTP DELETE request to the specified URL with the provided HTTP options.
 *
 * @param {string} path         - The path to send the DELETE request to.
 * @param {object} httpOptions  - The options to be included in the DELETE request check http-service documentation.
 * @param {object} callbackData - Additional data to be passed to the callback functions. [optional]
 * @param {object} callbacks    - The callback functions to be called upon completion of the DELETE request. [optional]
 * @return {object}             - The response of the DELETE request.
 */
exports.delete = function(path, httpOptions, callbackData, callbacks) {
    let options = checkHttpOptions(path, httpOptions);
    return httpService.delete(Zoho(options), callbackData, callbacks);
};

/****************************************************
 Private helpers
 ****************************************************/

function checkHttpOptions (path, options) {
    options = options || {};
    if (!!path) {
        if (isObject(path)) {
            // take the 'path' parameter as the options
            options = path || {};
        } else {
            if (!!options.path || !!options.params || !!options.body) {
                // options contain the http package format
                options.path = path;
            } else {
                // create html package
                options = {
                    path: path,
                    body: options
                }
            }
        }
    }
    return options;
}

function isObject (obj) {
    return !!obj && stringType(obj) === '[object Object]'
}

let stringType = Function.prototype.call.bind(Object.prototype.toString)

/****************************************************
 Configurator
 ****************************************************/

let Zoho = function (options) {
    options = options || {};
    options= setApiUri(options);
    options= setAuthorization(options);
    options= setRequestHeaders(options);
    return options;
}

/****************************************************
 Private API
 ****************************************************/

function setApiUri(options) {
    let url = options.path || "";
    const API_URL = "https://www.zohoapis.com/books/v3";
    options.url = API_URL + url;
    sys.logs.debug('[zoho] Set url: ' + options.path + "->" + options.url);
    return options;
}

function setRequestHeaders(options) {
    let headers = options.headers || {};
    headers = mergeJSON(headers, {"Content-Type": "application/json"});
    options.headers = headers;

    options.params = options.params || {};
    options.params = mergeJSON(options.params, {"organization_id": config.get("organizationId")});

    return options;
}

function setAuthorization(options) {

    if(Object.keys(userRecord).length == 0 || !oauthAccountId) {
        _initConfig();
    }

    sys.logs.debug('[zoho] Setting header token oauth');
    let authorization = options.authorization || {};
    authorization = mergeJSON(authorization, {
        type: "oauth2",
        accessToken: sys.storage.get(oauthAccountId + ' - access_token', {decrypt:true}),
        headerPrefix: "Zoho-oauthtoken"
    });
    options.authorization = authorization;
    return options;
}

function mergeJSON (json1, json2) {
    const result = {};
    let key;
    for (key in json1) {
        if(json1.hasOwnProperty(key)) result[key] = json1[key];
    }
    for (key in json2) {
        if(json2.hasOwnProperty(key)) result[key] = json2[key];
    }
    return result;
}
