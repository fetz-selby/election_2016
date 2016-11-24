var express = require('express'),
    event = require('events').EventEmitter;

var routes = function(sql){
    var autoComputeRouter = express.Router(),
        EventEmitter = new event();

    autoComputeRouter.route('/')
                .get(function(req, res){
                 sql.execute({
                                query:'select a.id,a.is_computed,a.year,r.name as region from computed_regions a join regions r on r.id = a.region_id and a.status = @status',
                                params:{
                                    status:{
                                        type: sql.VARCHAR,
                                        val: 'A'
                                    }
                                }
                            }).then(function(results){
                                res.status(200).json(results);
                            }, function(err){
                                console.log(err);
                            });
                });
    
     autoComputeRouter.route('/region/:id')
                .get(function(req, res){
                    var id = req.params.id;
                    if(id){
                         sql.execute({
                                query:'select a.id,a.is_computed,a.year,r.name as region from computed_regions a join regions r on r.id = a.region_id and a.status = @status and r.id = @id',
                                params:{
                                    id:{
                                        type: sql.INT,
                                        val : id
                                    },
                                    status:{
                                        type: sql.VARCHAR,
                                        val: 'A'
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
    
    autoComputeRouter.route('/:id')
                .get(function(req, res){
                    var id = req.params.id;
                    if(id){
                         sql.execute({
                                query:'select a.id,a.is_computed,a.year,r.name as region from computed_regions a join regions r on r.id = a.region_id and a.status = @status and a.id = @id',
                                params:{
                                    id:{
                                        type: sql.INT,
                                        val : id
                                    },
                                    status:{
                                        type: sql.VARCHAR,
                                        val: 'A'
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
            
    return {router: autoComputeRouter, event: EventEmitter};
};

module.exports = routes;