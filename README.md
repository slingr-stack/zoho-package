
# Overview

Zoho Books is a cloud-based accounting software designed to help businesses manage their financial operations efficiently. 
It provides features for tracking sales and purchase transactions, reconciling bank accounts, 
and generating over 50 detailed reports that give insights into a company's financial health. 
The platform automates various accounting tasks, such as invoicing and payment reminders, 
allowing users to focus on their core business activities. With its user-friendly interface and mobile accessibility, 
Zoho Books is suitable for small to medium-sized enterprises looking to streamline their accounting processes while 
ensuring data security through robust privacy measures

Repo: [https://github.com/slingr-stack/zoho-package](https://github.com/slingr-stack/zoho-package)

This [package](https://platform-docs.slingr.io/dev-reference/data-model-and-logic/packages/) allows you to connect to the Zoho service REST API. 
It has the following features:

- Authentication through API key
- Direct access to the API
- Helpers to make it easier to use Zoho integration from your app

## Configuration

Official documentation: [https://www.zoho.com/books/api/v3/oauth/#overview](https://www.zoho.com/books/api/v3/oauth/#overview)

### Registering New Client

In order to use this package you must first configure the integration to authenticate with the zoho system that uses the OAuth2.0 standard.

You will have to first register your application with Zoho's Developer console in order get your Client ID and Client Secret.
To register your application, go to [https://accounts.zoho.com/developerconsole](https://accounts.zoho.com/developerconsole) and click on Server-based Applications. 
On successful registration, you will be provided with a set of OAuth 2.0 credentials such as a Client ID and Client Secret that,
are known to both Zoho and your application. Do not share this credentials anywhere.

#### Client ID

**Name**: clientId
**Type**: text
**Mandatory**: true

#### Client Secret

**Name**: clientSecret
**Type**: password (text)
**Mandatory**: true

#### Organization ID

**Name**: organizationId
**Type**: text
**Mandatory**: false

# Javascript API

## HTTP requests
You can make `GET`,`POST`,`PUT`,`DELETE` requests to the [Zoho API](https://www.zoho.com/books/api/v3/introduction/#organization-id) like this:

### Login

As explained previously, this package uses OAuth, and uses the dependency package to store the access tokens in the app storage.

In order to log in, the following script must be implemented in a runtime-ui action.

```javascript
pkg.zoho.api.getAccessToken();
```

This opens a pop-up that allows each user to log in with their credentials and link it to their User ID.
Each request made by that user will have an Authorization header with his token (the requests can be seen in the Logger of the app's Monitor).

### Use the API

This request allows you to obtain your organization ID.

```javascript
let response;
response = pkg.zoho.api.get('/organizations');
log(JSON.stringify(response));
```

```javascript
let response;
response = pkg.zoho.api.get('/users/me');
log(JSON.stringify(response));
```

```javascript
let response;
response = pkg.zoho.api.post('/settings/currencies',
    {body: { "effective_date": "2013-09-04", "rate": 1.23 }}); // use a valid JSON object here
log(JSON.stringify(response));
```

```javascript
let response;
response = pkg.zoho.api.delete('/settings/currencies/982000000004012'); // use a valid id here
log(JSON.stringify(response));
```

### Logout

In order to log out, the following script must be implemented. 
(Your tokens will be removed from the app Storage, and will be no longer valid in the API requests)

```javascript
pkg.zoho.api.removeAccessToken();
```

Please take a look at the documentation of the [HTTP service](https://github.com/slingr-stack/http-service)
for more information about generic requests.

## Dependencies
* HTTP Service
* Oauth Package

## About SLINGR

SLINGR is a low-code rapid application development platform that speeds up development,
with robust architecture for integrations and executing custom workflows and automation.

[More info about SLINGR](https://slingr.io)

## License

This package is licensed under the Apache License 2.0. See the `LICENSE` file for more details.
