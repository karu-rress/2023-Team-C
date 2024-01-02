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
const { connPool } = require('./config/server');

// Server and Port settings
const app = express();
const PORT = 80;

_ = connPool;

// Run server
app.listen(PORT, () => {
    console.log(`Opened in port ${PORT}`);
})

// Test
app.get('/api/test/test', async (req, res) => { res.send('Success!'); });
app.get('/api/test/getall', async (req, res) => {
    connPool.request().query('SELECT * FROM Restaurants');
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


