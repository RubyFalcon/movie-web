const express = require("express");
const knex = require('knex');
const cors = require("cors");
const helmet = require("helmet");
const logger = require("morgan");
const path = require("path");
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
app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "client/build")));

//  API routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
});
app.use('/api/v1', api);

//  Error handling
app.all("*", (req, res, next) => {
    const err = new Error(`Path ${req.path} was not found!`);
    err.statusCode = 404;
    next(err);
});
app.use(errorHandler);

//  Starts express
app.listen(app.get('port'), (err) => {

    if (err) {
        console.error(err);
    } else {
        console.log('%s App is running at %s:%d in %s mode', chalk.green('✓'), app.get("host"), app.get('port'), app.get('env'));
        console.log("  Press CTRL-C to stop\n");
    }

});

module.exports = app;