var express = require('express'),
    event = require('events').EventEmitter;

var routes = function(sql){
    var constituencyRouter = express.Router(),
        EventEmitter = new event();

    constituencyRouter.route('/')
                .get(function(req, res){
                    //Get response for parent_constituencies
        
                    
                    sql.execute({
                            query:'select c.id, r.name as region, c.name from parent_constituencies c join regions r on c.region_id = r.id',
                            params:{}
                        }).then(function(results){
                            res.status(200).json(results);
                        }, function(err){
                            console.log(err);
                        });
                   
                    })
                    .post(function(req, res){
                        //Post response for parent_constituencies
        
                    })
    
     constituencyRouter.route('/region/:id')
                .get(function(req, res){
                    var id = req.params.id;
                        
                    sql.execute({
                            query:'select c.id, r.name as region, c.name from parent_constituencies c join regions r on c.region_id = r.id where r.id = @region_id',
                            params:{
                                region_id:{ 
                                    type: sql.INT,
                                    val: id
                                }
                            }
                        }).then(function(results){
                            res.status(200).json(results);
                        }, function(err){
                            console.log(err);
                        });
                             
                }); 
    
    constituencyRouter.route('/:id')
                .get(function(req, res){
                    var id = req.params.id;
                    if(id){
                       sql.execute({
                                query:'select c.id,c.name,r.name as region from parent_constituencies c join regions r on c.region_id = r.id where c.id = @id',
                                params:{
                                    id:{
                                        type: sql.INT,
                                        val: id
                                    }
                                }
                            }).then(function(results){
                                res.status(200).json(results);
                            }, function(err){
                                console.log(err);
                            }); 
                    }else{
                        res.status(400).send('Please ID should be greater than zero(0)');
                    }               
                })
    
    return {router: constituencyRouter, event: EventEmitter};
};

module.exports = routes;