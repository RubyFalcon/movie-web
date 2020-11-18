const express = require("express");
const knex = require('knex');
const api = require("./api");
const config = require("./config/key")

const app = express();

//config db
knex({
    client: 'pg',
    version: '13.1',
    connection: {
        host : config.DB_HOST,
        user : config.DB_USER,
        password : config.DB_PASSWORD,
        database : config.DB_NAME
    },
    acquireConnectionTimeout: 10000
});

//config express
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// config api
app.use("api/v1", api);

app.get("/", (req, res) => res.send("Hello friend!"));


app.listen(config.PORT, () => console.log(`App listens on port ${config.PORT}`));