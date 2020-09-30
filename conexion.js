let mysql = require('mysql');
class Connection {
    constructor(pool) {
        this.pool = pool;
    }
    init() {
        this.pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: '03071593',
            database: 'bd_apafa',
            debug: false,
            connectionLimit: 100,
            waitForConnections : false

        });
    }; 

    acquire(callback) {
        this.pool.getConnection((err, connection) => {
            callback(err, connection);
        });
    };

    
}

module.exports = new Connection();