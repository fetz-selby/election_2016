var express = require('express'),
    event = require('events').EventEmitter;

var routes = function(sql){
    var inboxRouter = express.Router(),
        EventEmitter = new event();

    inboxRouter.route('/')
                .get(function(req, res){
                
                 var from = req.query.from,
                     to = req.query.to;
        
                    if(from && to){
                        
                        sql.execute({
                                query:'select sgm.id,sgm.message_id,sgm.message,sgm.from_msisdn as sender,a.name,sgm.posted_ts from sms_gateway_messages sgm left join agents a on a.msisdn = sgm.from_msisdn where sgm.status = @status and CAST(sgm.posted_ts as DATE) BETWEEN @from AND @to',
                                params:{
                                    from:{
                                        type: sql.DATE,
                                        val: from
                                    },
                                    to:{ 
                                        type: sql.DATE,
                                        val: to
                                    },
                                    status:{
                                        type: sql.CHAR,
                                        val: 'A'
                                    }
                                }
                            }).then(function(results){
                                var utils = require('../service/utils');

                                //Bug: Filter for duplicates
                                results = utils.getNonDuplicates(results);
                            
                                if(results.length > 0){
                                    results.forEach(function(element, index, arr){
                                        if(element.name === null){
                                            element.name = 'Unknown';
                                        }
                                    });
                                    res.status(200).json(results);
                                }else{
                                    res.status(200).json([]);
                                }
                            
                            }, function(err){
                                console.log(err);
                            });
                    }else{
                        res.status(400).send('Please provide [from] and [to] parameter');
                    }                 
                })
   
    inboxRouter.route('/agent/:id')
                .get(function(req, res){
                
                 var from = req.query.from,
                     to = req.query.to;
        
                    if(from && to){
                        
                        sql.execute({
                                query:'select sgm.id,sgm.message_id,sgm.message,sgm.from_msisdn as sender,a.name,sgm.posted_ts from sms_gateway_messages sgm join agents a on a.msisdn = sgm.from_msisdn where sgm.status = @status and CAST(sgm.posted_ts as DATE) BETWEEN @from AND @to',
                                params:{
                                    from:{
                                        type: sql.DATE,
                                        val: from
                                    },
                                    to:{ 
                                        type: sql.DATE,
                                        val: to
                                    },
                                    status:{
                                        type: sql.CHAR,
                                        val: 'A'
                                    }
                                }
                            }).then(function(results){
                                res.status(200).json(results);
                            }, function(err){
                                console.log(err);
                            });
                    }else{
                        res.status(400).send('Please provide [from] and [to] parameter');
                    }       
                })
    
    inboxRouter.route('/mobile/:id')
                .get(function(req, res){
                    var id = req.params.id;
        
                    if(id){
                        
                        sql.execute({
                                query:'select sgm.id,sgm.message_id,sgm.message,sgm.from_msisdn as sender,a.name,sgm.posted_ts from sms_gateway_messages sgm join agents a on a.msisdn = sgm.from_msisdn where sgm.from_msisdn = @msisdn and sgm.status = @status',
                                params:{
                                    msisdn:{
                                        type: sql.VARCHAR,
                                        val: id
                                    },
                                    status:{
                                        type: sql.CHAR,
                                        val: 'A'
                                    }
                                }
                            }).then(function(results){
                                res.status(200).json(results);
                            }, function(err){
                                console.log(err);
                            });
                    }else{
                        res.status(400).send('Please mobile number should be valid');
                    }
                    
                })
   
    inboxRouter.route('/:id')
                .get(function(req, res){
                    var id = req.params.id;
                    if(id){
                        
                        sql.execute({
                                query:'select sgm.id,sgm.message_id,sgm.message,sgm.from_msisdn as sender,a.name,sgm.posted_ts from sms_gateway_messages sgm left join agents a on a.msisdn = sgm.from_msisdn where sgm.id = @id and sgm.status = @status',
                                params:{
                                    id:{
                                        type: sql.INT,
                                        val: id
                                    },
                                    status:{
                                        type: sql.CHAR,
                                        val: 'A'
                                    }
                                }
                            }).then(function(results){
                                res.status(200).json(results);
                            }, function(err){
                                console.log(err);
                            });
                    }else{
                        res.status(400).send('Please mobile number should be valid');
                    }
                    
                })
    
    return {router: inboxRouter, event: EventEmitter};
};

module.exports = routes;