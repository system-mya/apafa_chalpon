let mysql = require('mysql');
class Connection {
    constructor(pool) {
        this.pool = pool;
    }
    init() {
        this.pool = mysql.createPool({
            host: 'db4free.net',
            user: 'jjulcav',
            password: '03071593',
            database: 'bdapafa',
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