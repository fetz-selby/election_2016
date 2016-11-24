
// var config = function(){
//     var sql = require('seriate');
    
//     var config = {
//         server : '192.165.0.235',
//         user : 'sa',
//         password : 'BeeSys@123',
//         database : 'election2'
//     };
    
//     sql.setDefaultConfig(config);
    
//     return sql;
// };

// module.exports = config;


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