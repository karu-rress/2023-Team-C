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
const { poolPromise } = require('./config/server');

// Server and Port settings
const app = express();
const PORT = 80;

let connPool;

// Run server
app.listen(PORT, async () => {
    connPool = await poolPromise;
    console.log('Connected to COMP DB.');
    console.log(`Opened in port ${PORT}`);
})

app.get('/', async (_, res) => {
    res.send('Usage:\n'
    + '/api/test/test : test connection\n'
    + '/api/test/getall : get all data from DB\n');
})

// Test
app.get('/api/test/test', async (req, res) => { res.send('Success!'); });
app.get('/api/test/getall', async (req, res) => {
    const result = await connPool.request().query("SELECT * FROM Restaurants");
    res.send(result.recordset);
})

// If received primary key?
app.get('/api/restaurants/:name', async (req, res) => {
    let { name } = req.params;

    if (DEBUG) {
        try {
            const result = await connPool.request().query(`SELECT * FROM Restaurants WHERE name = '${name}'`);
            res.send(result.recordset);
        } 
        catch {
            res.send('error');
        }
        finally {

        }
    }
    else {
        throw "Under construction";
    }
})


// Import required modules
//





//connPool;

/*


*/


