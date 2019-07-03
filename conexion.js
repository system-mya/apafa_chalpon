let mysql = require('mysql');
class Connection {
    constructor(pool) {
        this.pool = pool;
    }
    init() {
        this.pool = mysql.createPool({
            connectionLimit: 10,
            host: 'localhost',
            user: 'root',
            password: '03071593',
            database: 'chalpon_apafa',
            debug: false,
        });
    }; 

    acquire(callback) {
        this.pool.getConnection((err, connection) => {
            callback(err, connection);
        });
    };

    
}

module.exports = new Connection();