const express = require("express");
const knex = require('knex');
const chalk = require('chalk');
const api = require("./api");

//  Loads environment variables from .env file
if (process.env.NODE_ENV !== 'production') {
    require("dotenv").config({
        path: `.env.development`
    })
}

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
        database : process.env.PGDATABASEq
    },
    acquireConnectionTimeout: 10000
});

//  Express configuration
app.set("host", process.env.APP_ADDRESS || "0.0.0.0");
app.set("port", process.env.APP_PORT || 5000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

//  API routes
app.use("api/v1", api);
app.get("/", (req, res) => res.send("Hello friend!"));

//  Starts exoress
app.listen(app.get('port'), () => {
    console.log('%s App is running at %s:%d in %s mode\n  Press CTRL-C to stop\n', chalk.green('✓'), app.get("host"), app.get('port'), app.get('env'));
});

module.exports = app;