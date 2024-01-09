/**
 * 
 *  app.js
 *  Back-end server
 * 
 *  Created: 2024-01-03
 *  Last modified: -
 * 
 */


// Import required modules
const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const { sql, poolPromise } = require('./config/server');
const { pool } = require('mssql');

// Server and Port settings
const app = express();
const HTTPS_PORT = 8443;

let connPool;
 
app.use(cors({ origin: ['http://tastynav.kro.kr', 'https://tastynav.kro.kr'] }));
// Enable CORS for all routes
app.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Run server
const httpsOptions = { pfx: fs.readFileSync('../certificate.pfx') };
const server = https.createServer(httpsOptions, app);
server.listen(HTTPS_PORT, async () => {
    connPool = await poolPromise;
    console.log('Connected to TastyNav database.');
    console.log(`Listening to port ${HTTPS_PORT} via HTTPS...`);
});


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
                <li>/menu/{restaurant} : TODO</li>
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
        if (result.recordset.length === 0)
            res.status(404).send('No results found.');
        else
            res.send(result.recordset);
    } 
    catch (err) {
        res.status(500).send('DB Error');
    }
});

// If requested search
app.get('/search/:query', async (req, res) => {
    try {
        let { query } = req.params;
        const result = await connPool.request()
            .input('query', sql.NVarChar, `%${query}%`)
            .query('SELECT * FROM Restaurants WHERE name LIKE @query');
        if (result.recordset.length === 0)
            res.status(404).send('No results found.');
        else
            res.send(result.recordset);
    } 
    catch (err) {
        res.status(500).send('DB Error');
    }
});


// If requested with category
app.get('/category/:name', async (req, res) => {
    try {
        let { name } = req.params;
        const result = await connPool.request()
            .input('name', sql.NVarChar, name)
            .query('SELECT * FROM Restaurants WHERE category = @name;'); // prevent SQL injection
        if (result.recordset.length === 0)
            res.status(404).send('No results found.');
        else
            res.send(result.recordset);
    } 
    catch (err) {
        res.status(500).send('DB Error');
    }
});

app.get('/allowone', async (req, res) => {
    try {
        let { name } = req.params;
        const result = await connPool.request()
            .input('name', sql.NVarChar, name)
            .query('SELECT * FROM Restaurants WHERE allowOne = 1;');
        if (result.recordset.length === 0)
            res.status(404).send('No results found.');
        else
            res.send(result.recordset);
    } 
    catch (err) {
        res.status(500).send('DB Error');
    }
});

app.get('/allowmulti', async (req, res) => {
    try {
        let { name } = req.params;
        const result = await connPool.request()
            .input('name', sql.NVarChar, name)
            .query('SELECT * FROM Restaurants WHERE allowMulti = 1;');
        if (result.recordset.length === 0)
            res.status(404).send('No results found.');
        else
            res.send(result.recordset);
    } 
    catch (err) {
        res.status(500).send('DB Error');
    }
});


// If requested with restaurant name to get menu
app.get('/menu/:restaurant', async (req, res) => {
    try {
        let { restaurant } = req.params;
        const result = await connPool.request()
            .input('restaurant', sql.NVarChar, restaurant)
            .query('SELECT menu, price FROM Menus WHERE restaurant = @restaurant;');
        if (result.recordset.length === 0)
            res.status(404).send('No menu found for the following restaurant.');
        else {
            res.send(result.recordset);
        }
    } 
    catch (err) {
        console.error(err);
        res.status(500).send('DB Error');
    }
});

// distance calculation
app.get('/closeGate/:name', async (req, res) => {
    try {
        const { name } = req.params;

        const restaurantInfo = await connPool.request()
            .input('name', sql.NVarChar, name)
            .query('SELECT latitude, longitude FROM Restaurants WHERE name = @name;');

        if (!restaurantInfo.recordset.length) {
            res.status(404).send('Restaurant not found.');
            return;
        }

        const restaurantLocation = {
            latitude: restaurantInfo.recordset.latitude,
            longitude: restaurantInfo.recordset.longitude
        };

        const mainGate = { latitude: 37.5068276, longitude: 126.9584776 };
        const backGate = { latitude: 37.5047735, longitude: 126.9537650 };

        const distanceToMainGate = geolib.getDistance(restaurantLocation, mainGate);
        const distanceToBackGate = geolib.getDistance(restaurantLocation, backGate);

        let closeLocation;
        if (distanceToMainGate < distanceToBackGate) {
            const result = await connPool.request()
                .input('m_latitude', sql.Float, mainGate.latitude)
                .input('m_longitude', sql.Float, mainGate.longitude)
                .input('b_latitude', sql.Float, backGate.latitude)
                .input('b_longitude', sql.Float, backGate.longitude)
                .query('SELECT name FROM Restaurants WHERE ' +
                    'geolib.getDistance({ latitude: m_latitude, longitude: m_longitude }, ' +
                    '{ latitude: @latitude, longitude: @longitude }) < ' +
                    'geolib.getDistance({ latitude: g_latitude, longitude: g_longitude }, ' +
                    '{ latitude: @latitude, longitude: @longitude })');

        closeRestaurants.push(...result.recordset.map(record => record.name));

        } 
        else {
            const result = await connPool.request()
                .input('m_latitude', sql.Float, mainGate.latitude)
                .input('m_longitude', sql.Float, mainGate.longitude)
                .input('b_latitude', sql.Float, backGate.latitude)
                .input('b_longitude', sql.Float, backGate.longitude)
                .query('SELECT name FROM Restaurants WHERE ' +
                    'geolib.getDistance({ latitude: g__latitude, longitude: g__longitude }, ' +
                    '{ latitude: @latitude, longitude: @longitude }) < ' +
                    'geolib.getDistance({ latitude: m_latitude, longitude: m_longitude }, ' +
                    '{ latitude: @latitude, longitude: @longitude })');


        closeRestaurants.push(...result.recordset.map(record => record.name));
    }

        res.send(closeRestaurants);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error');
    }
});
