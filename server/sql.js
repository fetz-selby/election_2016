
var config = function(){
    var sql = require('seriate');
    
    var config = {
        server : '172.16.32.130',
        user : 'root',
        password : 'root',
        database : 'election2_new'
    };
    
    sql.setDefaultConfig(config);
    
    return sql;
};

module.exports = config;