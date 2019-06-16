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
            password: '03071593SS',
            database: 'apafa_chalpon',
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