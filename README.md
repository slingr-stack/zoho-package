
# Overview

Repo: [https://github.com/slingr-stack/zoho-package](https://github.com/slingr-stack/zoho-package)

This package allows you to connect to the Zoho service REST API. It has the following features:

- Authentication through API key
- Direct access to the API
- Helpers to make it easier to use Zoho integration from your app

## Configuration

These are the configuration parameters:

### 

Name: apiKey

This is . For more information on how to get it, please look at its documentation here.

# Javascript API

## HTTP requests
You can make `GET`,`PUT`,`PATCH`,`DELETE` requests to the [Zoho API](https://www.zoho.com/books/api/v3/introduction/#organization-id) like this:
```javascript
var response = pkg.zoho.api.get('/organizations');
var response = pkg.zoho.api.get('/users/me');
var response = pkg.zoho.api.post('/settings/currencies', 
    { "currency_code": "AUD", "currency_symbol": "$", "price_precision": 2, "currency_format": "1,234,567.89" });
var response = pkg.zoho.api.put('/settings/currencies',
    { "currency_code": "AUD", "currency_symbol": "$", "price_precision": 2, "currency_format": "1,234,567.89" })
var response = pkg.zoho.api.delete('/settings/currencies/982000000004012');
```

Please take a look at the documentation of the [HTTP service](https://github.com/slingr-stack/http-service)
for more information about generic requests.

## Dependencies
* HTTP Service
* Oauth Package (v1.0.31)

## About SLINGR

SLINGR is a low-code rapid application development platform that speeds up development,
with robust architecture for integrations and executing custom workflows and automation.

[More info about SLINGR](https://slingr.io)

## License

This package is licensed under the Apache License 2.0. See the `LICENSE` file for more details.
