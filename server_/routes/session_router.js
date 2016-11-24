var express = require('express'),
    event = require('events').EventEmitter;

var routes = function(sql){
    var sessionRoute = express.Router(),
        EventEmitter = new event();

    sessionRoute.route('/')
                .get(function(req, res){
                    if(req.query.email && req.query.password){
                        sql.execute({
                            query:'select id,name,email,level,msisdn from users where email=@email and password=@password',
                            params:{
                                email:{
                                    type: sql.VARCHAR,
                                    val: req.query.email
                                },
                                password:{
                                    type: sql.VARCHAR,
                                    val: require('../service/utils').getHash(req.query.email+req.query.password)
                                }
                            }
                        }).then(function(results){
                            res.status(200).json(results);
                        }, function(err){
                            console.log(err);
                        });
                    }else{
                        res.status(400).json([]);
                    }
                })
                .post(function(req, res){
                    res.status(200).json([]);
                });
               
    sessionRoute.route('/register')
                .get(function(req, res){
                    console.log('password '+require('../service/utils').getHash(req.query.email+req.query.password));
                    if(req.query.email && req.query.password){
                        sql.execute({
                            query:'select id,name,email,level,msisdn,password from users where email=@email and password=@password',
                            params:{
                                email:{
                                    type: sql.VARCHAR,
                                    val: req.query.email
                                },
                                password:{
                                    type: sql.VARCHAR,
                                    val: require('../service/utils').getHash(req.query.email+req.query.password)
                                }
                            }
                        }).then(function(results){
                             //Edit password
                            if(results.length){
                                results[0].password = req.query.password;
                            }
                            
                            res.status(200).json(results);
                        }, function(err){
                            console.log(err);
                        });
                    }else{
                        res.status(400).json([]);
                    }
                    })
                .post(function(req, res){
                    if(req.query.email && req.query.password ){
                        sql.execute({
                            query:'select id,name,email,level,msisdn,password from users where email=@email and password=@password',
                            params:{
                                email:{
                                    type: sql.VARCHAR,
                                    val: req.query.email
                                },
                                password:{
                                    type: sql.VARCHAR,
                                    val: require('../service/utils').getHash(req.query.email+req.query.password)
                                }
                            }
                        }).then(function(results){
                            //Edit password
                            if(results.length){
                                results[0].password = req.query.password;
                            }
                            
                            res.status(200).json(results);
                        }, function(err){
                            console.log(err);
                        });
                    }else{
                        res.status(400).json([]);
                    }  
                });   
    
    return {router: sessionRoute, event: EventEmitter};
};

module.exports = routes;