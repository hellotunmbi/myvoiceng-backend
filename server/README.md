Node.js starterkit
==================

Backend Starter Kit written in node.js with the following features:

* ES6/ES7 ready: async/await, classes, arrow function, template strings etc ...
* REST API and Websocket
* Authentication
* Authorization
* Scalable by using a micro services based architecture
* Relational database.
* Logging with timestamp and filename.

#Prerequisites

##External Services
[Postgres](https://www.postgresql.org/download/linux/debian/) relational database
[PostGIS](http://postgis.net/docs/postgis_installation.html#install_short_version) for spatial queries
[RabbitMQ](https://www.rabbitmq.com/download.html) for async message passing

##External API's
AWS S3 used for file uploads
AWS SNS used for push notifications
Facebook graph api used for facebook authentication
Mailgun used for transactional email

These all have values that need to be set in `.env` and exported.

#Workflow

To install all the dependencies:

    # npm install

## Backend

To start the backend locally:

    # gulp

The first time this runs, sequelize will build you schema under the beavr public database.  As you make changes to schema you may have to manually change the schema or write a schema migration script.

Refer to the api docs on all available endpoints.

This command also statically analyze the code with eslint and generate a code coverage in text and html format.

# Development

[sequelize-cli](https://github.com/sequelize/cli) helps to manage the database migration and rollback.

## Connect to Postgrss on Heroku

  * Make sure heroku cli is installed
  * run `heroku login`
  * Install postgres locally (need psql client)
  * run `heroku pg:psql`


