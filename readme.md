# Serverless Example - Bookshelf

A complete CRUD Serverless example using ExpressJS, based on the [tutorial](https://serverless.com/blog/serverless-express-rest-api/).

You can run this with

> sls offline start

# Rest API

The REST API is split into:

* Controller
* Repository
* Service

The `database.js` contains the DB connection, the "IS_OFFLINE" is set to true if the application is started offline.

# Application

The default "/" route contains the `index.html` with the small CRUD application.