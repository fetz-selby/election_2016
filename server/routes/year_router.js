var express = require('express'),
    event = require('events').EventEmitter;

var routes = function(sql){
    var yearRouter = express.Router(),
        EventEmitter = new event();

    yearRouter.route('/')
                .get(function(req, res){
                 sql.execute({
                                query:'select id,value,alias from years',
                                params:{}
                            }).then(function(results){
                                res.status(200).json(results);
                            }, function(err){
                                console.log(err);
                            });
                });
            
    return {router: yearRouter, event: EventEmitter};
};

module.exports = routes;