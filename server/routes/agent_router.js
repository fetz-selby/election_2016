var express = require('express'),
    event = require('events').EventEmitter,
     EventEmitter = new event();

var routes = function(sql){
    
    var agentRouter = express.Router();

    agentRouter.route('/')
                .get(function(req, res){
                    //Get response for agents
                    if(req.query.year){
                        var year = req.query.year;
                        
                        sql.execute({
                                query:'select a.id, a.name, a.msisdn, a.year, c.name as constituency, p.name as polling_station from agents a join constituencies c on c.id = a.cons_id join polls p on p.id = a.poll_id where a.year = @year and a.status = @status',
                                params:{
                                    year:{
                                        type: sql.VARCHAR,
                                        val: year
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
                            res.status(400).send('Please provide a [year] parameter');
                    }
                            
                })
                .post(function(req, res){
                    //Post response for agents
                    if((req.query.level === 'A' || req.query.level === 'S')){
                        if(req.query.year && req.query.cons_id && req.query.poll_id && req.query.name && req.query.pin && req.query.msisdn){
                            checkIfExist(req, res, sql);
                        }else{
                            res.status(400).send('Missing Parameters');
                        }
                    }else{
                        res.status(400).send('Restricted Access');
                    }
                })
                .put(function(req, res){
                    //Post response for candidates
                });
               
    
    agentRouter.route('/constituency/:id')
                .get(function(req, res){
                    var id = req.params.id;
                    if(req.query.year){
                        
                        var year = req.query.year;
                        
                        sql.execute({
                                query:'select a.id, a.name, a.msisdn, a.year, c.name as constituency, p.name as polling_station from agents a join constituencies c on c.id = a.cons_id join polls p on p.id = a.poll_id where a.year = @year and c.id = @cons_id and a.status = @status',
                                params:{
                                    year:{
                                        type: sql.VARCHAR,
                                        val: year
                                    },
                                    cons_id:{
                                        type: sql.INT,
                                        val:id
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
                        res.status(400).send('Please provide a [year] parameter');
                    }            
        
                });
    
     agentRouter.route('/counts')
                .get(function(req, res){
                        sql.execute({
                                query:'select count(id) as counts from agents where status = @status and year = @year',
                                params:{
                                    status:{
                                        type: sql.CHAR,
                                        val: 'A'
                                    },
                                    year:{
                                        type: sql.VARCHAR,
                                        val: '2016'
                                    }
                                }
                            }).then(function(results){
                                res.status(200).json(results);
                            }, function(err){
                                console.log(err);
                            });           
                });
    
    agentRouter.route('/pollingstation/:id')
                .get(function(req, res){
                    var id = req.params.id;
                    if(req.query.year){
                        
                        var year = req.query.year;
                        
                        sql.execute({
                                query:'select a.id, a.name, a.msisdn, a.year, c.name as constituency, p.name as polling_station from agents a join constituencies c on c.id = a.cons_id join polls p on p.id = a.poll_id where a.year = @year and p.id = @poll_id and a.status = @status',
                                params:{
                                    year:{
                                        type: sql.VARCHAR,
                                        val: year
                                    },
                                    poll_id:{
                                        type: sql.INT,
                                        val:id
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
                           res.status(400).send('Please provide a [year] parameter');
                    }            
        
                });  
    
     agentRouter.route('/mobile/:id')
                .get(function(req, res){
                    var id = req.params.id;
                     if(req.query.year){
                        
                        var year = req.query.year;
                        
                        sql.execute({
                                query:'select a.id, a.name, a.msisdn, a.year, c.name as constituency, p.name as polling_station from agents a join constituencies c on c.id = a.cons_id join polls p on p.id = a.poll_id where a.year = @year and a.msisdn = @msisdn and a.status = @status',
                                params:{
                                    year:{
                                        type: sql.VARCHAR,
                                        val: year
                                    },
                                    msisdn:{
                                        type: sql.VARCHAR,
                                        val:id
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
                           res.status(400).send('Please provide a [year] parameter');
                    } 
            
        
                }); 
     
    agentRouter.route('/:id')
                .get(function(req, res){
                    var id = req.params.id;
                    if(id){
                                                
                        sql.execute({
                                query:'select a.id, a.name, a.msisdn, a.year, c.name as constituency, p.name as polling_station from agents a join constituencies c on c.id = a.cons_id join polls p on p.id = a.poll_id where a.id = @id and a.status = @status',
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
                           res.status(400).send('Please ID should be greater than zero(0)');
                    } 
                })
                .delete(function(req, res){
                    if(req.params.id && (req.query.level === 'A' || req.query.level === 'S')){
                    var id = req.params.id;
        
                    sql.execute({
                                query:'delete from agents where id = @id',
                                params:{
                                    id:{
                                        type: sql.INT,
                                        val: id
                                    }
                                }
                            }).then(function(results){
                                EventEmitter.emit('delete');
                                res.status(200).json(results);
                            }, function(err){
                                console.log(err);
                            });
                    }else{
                        res.status(400).send('Restricted Access');
                    }
                });
            
    
    return {router: agentRouter, event: EventEmitter};
};

var checkIfExist = function(req, res, sql){
    var msisdn = req.query.msisdn;

    //Validate msisdn
    if(typeof msisdn === 'undefined' || msisdn.indexOf('+') === -1 || msisdn.trim().indexOf('+') != 0){
        res.status(400).send('Bad msisdn');
        return;
    }


    sql.execute({
            query:'select id from agents where msisdn = @msisdn',
            params:{
                msisdn:{
                    type: sql.VARCHAR,
                    val: msisdn
                }
            }
        }).then(function(results){
            if(!results.length){
                console.log('Came in here!');
                addNewAgent(req, res, sql);
            }else{
                res.status(400).json('User already exists');
            }
        }, function(err){
            console.log(err);
        });
}

var addNewAgent = function(req, res, sql){
    var year = req.query.year,
        cons_id = req.query.cons_id,
        poll_id = req.query.poll_id,
        pin = req.query.pin,
        msisdn = req.query.msisdn,
        name = req.query.name;
    
    sql.execute({
            query:'insert into agents (name,cons_id,poll_id,pin,msisdn,year,status) values (@name, @consId, @pollId, @pin, @msisdn, @year, @status)',
            params:{
                name:{
                    type: sql.VARCHAR,
                    val: name
                },
                consId:{
                    type: sql.INT,
                    val: cons_id
                },
                pollId:{
                    type: sql.INT,
                    val: poll_id
                },
                pin:{
                    type: sql.VARCHAR,
                    val: pin
                },
                msisdn:{
                    type: sql.VARCHAR,
                    val: msisdn
                },
                year:{
                    type: sql.VARCHAR,
                    val: year
                },
                status:{
                    type: sql.CHAR,
                    val: 'A'
                }
            }
        }).then(function(results){
            res.status(200).json(results);
            formatAndSendMessage(sql, name, poll_id, cons_id, msisdn, pin);
        }, function(err){
            console.log(err);
        });
}

var formatAndSendMessage = function(sql, name, pollId, consId, msisdn, pin){
     sql.execute({
            query:'select name from polls where id = @id',
            params:{
                id:{
                    type: sql.INT,
                    val: pollId
                }
            }
        }).then(function(results){
            if(results.length){
                fetchForConstituency(sql, name, consId, results[0].name, msisdn, pin);
            }
        }, function(err){
            console.log(err);
        });
}

var fetchForConstituency = function(sql, name, consId, pollname, msisdn, pin){
    sql.execute({
            query:'select name from constituencies where id = @id',
            params:{
                id:{
                    type: sql.INT,
                    val: consId
                }
            }
        }).then(function(results){
            if(results.length){
                sendMessage(name, results[0].name, pollname, msisdn, pin);
            }
        }, function(err){
            console.log(err);
        });
}

var sendMessage = function(name, consName, pollName, msisdn, pin){
    var messageDispatcher = require('../service/push_message')();
    
    var message = 'Hello '+name+'. Your PIN is '+pin+', and you have been stationed at '+pollName+' under the '+consName+' constituency. Thank you. Time '+new Date();
    
    messageDispatcher.event.on('success', function(){
        EventEmitter.emit('add');
    })

    messageDispatcher.push(msisdn, message);

}

module.exports = routes;