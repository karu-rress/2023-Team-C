const sql = require('mssql');
const { config } = require('./config.js');

const connPool = new sql.ConnectionPool(config.dbconfig).connect()
  .then((pool) => { console.log('Connected to COMP DB.'); return pool; })
  .catch((err) => { console.log('DB connection error', err); })

module.exports = {
  sql,
  connPool
}


// connPool = Promise<void | XXX>
// 이거 await을 제대로 해야 함...