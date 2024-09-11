
# Overview

Repo: [https://github.com/slingr-stack/zoho-package](https://github.com/slingr-stack/zoho-package)

This [package](https://platform-docs.slingr.io/dev-reference/data-model-and-logic/packages/) allows you to connect to the Zoho service REST API. It has the following features:

- Authentication through API key
- Direct access to the API
- Helpers to make it easier to use Zoho integration from your app

## Configuration

Official documentation: [https://www.zoho.com/books/api/v3/oauth/#overview](https://www.zoho.com/books/api/v3/oauth/#overview)

### Registering New Client

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

```javascript
pkg.zoho.api.getAccessToken();
```

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
