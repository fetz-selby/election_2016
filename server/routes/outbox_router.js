var express = require('express'),
    event = require('events').EventEmitter;

var routes = function(sql){
    var outboxRouter = express.Router(),
        EventEmitter = new event();

    outboxRouter.route('/')
                .get(function(req, res){
                    //Get response for candidates
        
                    var from = req.query.from,
                        to = req.query.to;
        
                    if(from && to){
                        sql.execute({
                                query:'select u.name, o.recipient_msisdn, o.message from outbox o join users u on u.id = o.user_id where status = @status and CAST(o.posted_ts as DATE) BETWEEN @from AND @to',
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
                .post(function(req, res){
                    //Post response for outbox
                    if(req.query.userId && req.query.mobile && req.query.message){
                        var userId = req.query.userId,
                            mobile = req.query.mobile,
                            message = req.query.message;
                        
                        sql.execute({
                                query:'insert into outbox (recipient_msisdn, msg, user_id, status,posted_date) values (@mobile, @message, @userId, @status, @postedDate)',
                                params:{
                                    mobile:{
                                        type: sql.VARCHAR,
                                        val: mobile
                                    },
                                    message:{ 
                                        type: sql.VARCHAR,
                                        val: message
                                    },
                                    userId:{ 
                                        type: sql.INT,
                                        val: userId
                                    },
                                    status:{
                                        type: sql.CHAR,
                                        val: 'A'
                                    },
                                    postedDate:{
                                        type: sql.DATE,
                                        val: new Date()
                                    }
                                }
                            }).then(function(results){
                                var smsDispatcher = require('../service/sms_gateway');
                                smsDispatcher.sendMessage(res, mobile, message);
                                EventEmitter.emit('add');
                            
                                //res.status(200).json(results);
                            }, function(err){
                                console.log(err);
                            });
                    }else{
                        res.status(400).send('Some required fields missing');
                    }
                });
    
    outboxRouter.route('/mobile/:id')
                .get(function(req, res){
                    var id = req.params.id;
        
                    if(id){
                        sql.execute({
                                query:'select u.name, o.recipient_msisdn, o.message from outbox o join users u on u.id = o.user_id where status = @status and o.recipient_msisdn = @msisdn',
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
                        res.status(400).send('Please provide a valid mobile number');
                    }
                })
                .put(function(req, res){
                    var id = req.params.id;
                })
                .delete(function(req, res){
                    var id = req.params.id;
                });
    
    outboxRouter.route('/:id')
                .get(function(req, res){
                    var id = req.params.id;
                    if(id){
                        sql.execute({
                                query:'select u.name, o.recipient_msisdn, o.message from outbox o join users u on u.id = o.user_id where status = @status and o.id = @id',
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
                        res.status(400).send('Please provide a valid ID');
                    }
                })
                .put(function(req, res){
                    var id = req.params.id;
                })
                .delete(function(req, res){
                    var id = req.params.id;
                });
    
    return {router: outboxRouter, event: EventEmitter};
};

module.exports = routes;