/**
 * 
 *  app.js
 *  Back-end server
 * 
 *  Created: 2024-01-03
 *  Last modified: -
 * 
 */

// DEBUG PARAMETER
const DEBUG = true;


// Import required modules
const express = require('express');
const { sql, poolPromise } = require('./config/server');

// Server and Port settings
const app = express();
const PORT = 8080;

let connPool;
 
// Enable CORS for all routes
app.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Run server
app.listen(PORT, async () => {
    connPool = await poolPromise;
    console.log('Connected to TastyNav database.');
    console.log(`Listening to port ${PORT}...`);
})

// Main page
app.get('/', async (_, res) => {
    res.send(`<h1>TastyNav API</h1>
              <br>
              <h2>How to use</h2>
              <ul>
                <li>/test : test connection</li>
                <li>/getall : get all data from DB</li>
                <li>/restaurant/{name} : get info about restaurant</li>
                <li>/search/{name} : search result for restaurant</li>
                <li>/category/{name} : get list about category</li>
                <li>/allowone : get list that allow one person</li>
                <li>/allowmulti : get list that allow more than 4</li>
              </ul><br>
              <h2>Warning</h2>
              USE <b>ONLY <mark>GET</mark> METHOD</b> HERE!!!`);
})

// Test page
app.get('/test', (_, res) => { res.send('Success!'); });

// Get all restaurant list
app.get('/getall', async (_, res) => {
    const result = await connPool.request().query("SELECT * FROM Restaurants;");
    res.send(result.recordset);
});

// If received a restaurant name
app.get('/restaurant/:name', async (req, res) => {
    try {
        let { name } = req.params;
        const result = await connPool.request()
            .input('name', sql.NVarChar, name)
            .query('SELECT * FROM Restaurants WHERE name = @name;'); // prevent SQL injection
        res.send(result.recordset);
    } 
    catch (err) {
        res.status(404).send('Not found.');
    }
});

// If requested search
app.get('/search/:query', async (req, res) => {
    try {
        let { query } = req.params;
        const result = await connPool.request()
            .input('query', sql.NVarChar, `%${query}%`)
            .query('SELECT * FROM Restaurants WHERE name LIKE @query');
        res.send(result.recordset);
    } 
    catch (err) {
        res.status(404).send('No results found.');
    }
});


// If requested with category
app.get('/category/:name', async (req, res) => {
    try {
        let { name } = req.params;
        const result = await connPool.request()
            .input('name', sql.NVarChar, name)
            .query('SELECT * FROM Restaurants WHERE category = @name;'); // prevent SQL injection
        res.send(result.recordset);
    } 
    catch (err) {
        res.status(404).send('Not found.');
    }
});

app.get('/allowone', async (req, res) => {
    try {
        let { name } = req.params;
        const result = await connPool.request()
            .input('name', sql.NVarChar, name)
            .query('SELECT * FROM Restaurants WHERE allowOne = 1;');
        res.send(result.recordset);
    } 
    catch (err) {
        res.status(404).send('Not found.');
    }
});

app.get('/allowmulti', async (req, res) => {
    try {
        let { name } = req.params;
        const result = await connPool.request()
            .input('name', sql.NVarChar, name)
            .query('SELECT * FROM Restaurants WHERE allowMulti = 1;');
        res.send(result.recordset);
    } 
    catch (err) {
        res.status(404).send('Not found.');
    }
});