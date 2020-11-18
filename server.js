const express = require("express");
const knex = require('knex');
const chalk = require('chalk');
const dotenv = require("dotenv");
const api = require("./api");
const { errorHandler } = require("./middleware/error");

//  Loads environment variables from .env file
if (process.env.NODE_ENV !== 'production') {
    dotenv.config({
        path: `config/.env.${process.env.NODE_ENV}`
    });
} else {
    dotenv.config({
        path: "config/.env.production"
    });
};



//  Creates express server
const app = express();

// DB configuration
knex({
    client: 'pg',
    version: '13.1',
    connection: {
        host : process.env.PGHOST,
        port : process.env.PGPORT,
        user : process.env.PGUSER,
        password : process.env.PGPASSWORD,
        database : process.env.PGDATABASE
    },
    acquireConnectionTimeout: 10000
});

//  Express configuration
app.set("host", process.env.APP_ADDRESS || "0.0.0.0");
app.set("port", process.env.APP_PORT || 5000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  API routes
app.get("/", (req, res) => res.send("Hello friend!"));
app.use('/api/v1', api);

//  Error handling
app.all("*", (req, res, next) => {
    const err = new Error(`Path ${req.path} was not found!`);
    err.statusCode = 404;
    next(err);
});
app.use(errorHandler);

//  Starts exoress
app.listen(app.get('port'), () => {
    console.log('%s App is running at %s:%d in %s mode', chalk.green('✓'), app.get("host"), app.get('port'), app.get('env'));
    console.log("  Press CTRL-C to stop\n");
});

module.exports = app;