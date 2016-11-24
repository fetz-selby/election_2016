var express = require('express'),
    event = require('events').EventEmitter;

var routes = function(sql){
    var regionRouter = express.Router(),
        EventEmitter = new event();

    regionRouter.route('/')
                .get(function(req, res){
                 sql.execute({
                                query:'select id,name from regions',
                                params:{}
                            }).then(function(results){
                                res.status(200).json(results);
                            }, function(err){
                                console.log(err);
                            });
                });
    
    regionRouter.route('/:id')
                .get(function(req, res){
                    var id = req.params.id;
                    if(id){
                         sql.execute({
                                query:'select id,name from regions where id = @id',
                                params:{
                                    id:{
                                        type: sql.INT,
                                        val : id
                                    }
                                }
                            }).then(function(results){
                                res.status(200).json(results);
                            }, function(err){
                                console.log(err);
                            });
                    }else{
                            res.status(400).send('Please provide a valid ID');
                    }
                })
            
    return {router: regionRouter, event: EventEmitter};
};

module.exports = routes;