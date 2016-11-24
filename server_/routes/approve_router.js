var express = require('express'),
    event = require('events').EventEmitter,
    EventEmitter = new event();

var routes = function(sql){
    var approveRouter = express.Router();

    approveRouter.route('/pending')
                .get(function(req, res){
                    //Get response for agents
                    if(req.query.regionId && req.query.year){
                        var regionId = req.query.regionId,
                            year = req.query.year;
                        
                        sql.execute({
                                query:'select a.id, ag.name as agent, r.name as region, c.name as constituency, p.name as poll, a.type, a.message, a.msisdn as mobile from approve_list a join constituencies c on c.id = a.cons_id join regions r on r.id = a.region_id join polls p on p.id = a.poll_id join agents ag on ag.id = a.agent_id where a.region_id = @regionId and a.year = @year and a.status = @status',
                                params:{
                                    year:{
                                        type: sql.VARCHAR,
                                        val: year
                                    },
                                    regionId:{
                                        type: sql.CHAR,
                                        val: regionId
                                    },
                                    status:{
                                        type: sql.CHAR,
                                        val: 'P'
                                    }
                                }
                            }).then(function(results){
                                res.status(200).json(results);
                            }, function(err){
                                console.log(err);
                            });
                    }else{
                            res.status(400).send('Please provide a [year] and [regionId] parameter');
                    }
                            
                })
    approveRouter.route('/pending/counts')
                .get(function(req, res){
                        sql.execute({
                                query:'select count(id) as counts from approve_list where status = @status and year = @year',
                                params:{
                                    status:{
                                        type: sql.CHAR,
                                        val: 'P'
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
    
    approveRouter.route('/approved/counts')
                .get(function(req, res){
                        sql.execute({
                                query:'select count(id) as counts from approve_list where status = @status and year = @year',
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
    
    approveRouter.route('/rejected/counts')
                .get(function(req, res){
                        sql.execute({
                                query:'select count(id) as counts from approve_list where status = @status and year = @year',
                                params:{
                                     status:{
                                        type: sql.CHAR,
                                        val: 'R'
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
    
    approveRouter.route('/approved')
                .get(function(req, res){
                    //Get response for agents
                    if(req.query.regionId && req.query.year){
                        var regionId = req.query.regionId,
                            year = req.query.year;
                        
                        sql.execute({
                                query:'select a.id, ag.name as agent, r.name as region, c.name as constituency, p.name as poll, a.type, a.message, a.msisdn as mobile from approve_list a join constituencies c on c.id = a.cons_id join regions r on r.id = a.region_id join polls p on p.id = a.poll_id join agents ag on ag.id = a.agent_id where a.region_id = @regionId and a.year = @year and a.status = @status',
                                params:{
                                    year:{
                                        type: sql.VARCHAR,
                                        val: year
                                    },
                                    regionId:{
                                        type: sql.CHAR,
                                        val: regionId
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
                            res.status(400).send('Please provide a [year] and [regionId] parameter');
                    }
                            
                })
    
    approveRouter.route('/approved/:id')
                .put(function(req, res){
                    if(req.params.id && (req.query.level === 'A' || req.query.level === 'S')){
                        var id = req.params.id;
                        
                        // sql.execute({
                        //         query:'update approve_list set status = @status where id = @id',
                        //         params:{
                        //             status:{
                        //                 type: sql.CHAR,
                        //                 val: 'A'
                        //             },
                        //             id:{
                        //                 type: sql.INT,
                        //                 val: id
                        //             }
                        //         }
                        //     }).then(function(results){
                        //         broadcastPushApproveChange(sql, id, EventEmitter);
                        //         broadcastPushApproved(sql, id, EventEmitter);
                        //         res.status(200).json(results);
                        //     }, function(err){
                        //         console.log(err);
                        // });

                        getApproveDetails(res, sql, id);

                    }else{
                        res.status(400).send('Restricted Access');
                    }
                })
    
    approveRouter.route('/rejected')
                .get(function(req, res){
                    //Get response for agents
                    if(req.query.regionId && req.query.year){
                        var regionId = req.query.regionId,
                            year = req.query.year;
                        
                        sql.execute({
                                query:'select a.id, ag.name as agent, r.name as region, c.name as constituency, p.name as poll, a.type, a.message, a.msisdn as mobile from approve_list a join constituencies c on c.id = a.cons_id join regions r on r.id = a.region_id join polls p on p.id = a.poll_id join agents ag on ag.id = a.agent_id where a.region_id = @regionId and a.year = @year and a.status = @status',
                                params:{
                                    year:{
                                        type: sql.VARCHAR,
                                        val: year
                                    },
                                    regionId:{
                                        type: sql.CHAR,
                                        val: regionId
                                    },
                                    status:{
                                        type: sql.CHAR,
                                        val: 'R'
                                    }
                                }
                            }).then(function(results){
                                res.status(200).json(results);
                            }, function(err){
                                console.log(err);
                            });
                    }else{
                            res.status(400).send('Please provide a [year] and [regionId] parameter');
                    }
                            
                })
    
    approveRouter.route('/rejected/:id')
                .put(function(req, res){
                    if(req.params.id && (req.query.level === 'A' || req.query.level === 'S')){
                        var id = req.params.id;
                        
                        sql.execute({
                                query:'update approve_list set status = @status where id = @id',
                                params:{
                                    status:{
                                        type: sql.CHAR,
                                        val: 'R'
                                    },
                                    id:{
                                        type: sql.INT,
                                        val: id
                                    }
                                }
                            }).then(function(results){
                                broadcastPushApproveChange(sql, id, EventEmitter);
                                broadcastPushRejected(sql, id, EventEmitter);
                                res.status(200).json(results);
                            }, function(err){
                                console.log(err);
                        });
                    }else{
                        res.status(400).send('Restricted Access');
                    }
                })
    
    return {router: approveRouter, event: EventEmitter};
};

//Result value obtain from here
var getApproveDetails = function(res, sql, id){
        sql.execute({
            query:'select id, cons_id, poll_id, type from approve_list where id = @id and status = @status',
                params:{
                    status:{
                        type: sql.CHAR,
                        val: 'P'
                    },
                    id:{
                        type: sql.INT,
                        val: id
                    }
                }
            }).then(function(results){
                if(results.length){
                    deleteAnyMatchedApprove(res, sql, results[0]);
                }
            }, function(err){
                console.log(err);
            });
}

var deleteAnyMatchedApprove = function(res, sql, result){
     sql.execute({
            query:'delete from approve_list where type = @type and poll_id = @pollId and status = @status',
                params:{
                    status:{
                        type: sql.CHAR,
                        val: 'A'
                    },
                    type:{
                        type: sql.CHAR,
                        val: result.type
                    },
                    pollId:{
                        type: sql.CHAR,
                        val: result.poll_id
                    }
                }
            }).then(function(results){
                updateApproveDetail(res, sql, result);
            }, function(err){
                console.log(err);
            });
}

var updateApproveDetail = function(res, sql, result){
    sql.execute({
            query:'update approve_list set status = @status where id = @id',
                params:{
                    status:{
                        type: sql.CHAR,
                        val: 'A'
                    },
                    id:{
                        type: sql.INT,
                        val: result.id
                    }
                }
            }).then(function(results){
                doConstituencyAutoUpdate(res, sql, result);
            }, function(err){
                console.log(err);
            });
}

var doConstituencyAutoUpdate = function(res, sql, result){
    sql.execute({
            query:'select auto_compute from constituencies where id = @id',
                params:{
                    id:{
                        type: sql.INT,
                        val: result.cons_id
                    }
                }
            }).then(function(results){
                //check if constituency is auto update-able
                if(results.length && results[0].auto_compute === 'T'){
                    getAllParties(res, sql, result);
                }else{
                    res.status(200).send('success');
                }

                broadcastPushApproveChange(sql, result.id, EventEmitter);
                broadcastPushApproved(sql, result.id, EventEmitter);
            }, function(err){
                console.log(err);
            });
}

var getAllParties = function(res, sql, result){
    //Grab parties
    sql.execute({
            query:'select id,name from parties',
                params:{}
            }).then(function(results){
                if(results.length){
                    getAllConstituencyApprovedResults(res, sql, result, results);
                }
            }, function(err){
                console.log(err);
            });
}

var getAllConstituencyApprovedResults = function(res, sql, result, parties){
     sql.execute({
            query:'select message from approve_list where status = @status and type = @type and cons_id = @consId',
                params:{
                    status:{
                        type: sql.CHAR,
                        val: 'A'
                    },
                    consId:{
                        type: sql.INT,
                        val: result.cons_id
                    },
                    type:{
                        type: sql.CHAR,
                        val: result.type
                    }
                }
            }).then(function(results){
                if(results.length){
                   doComputing(res, sql, result, parties, results); 
                }
            }, function(err){
                console.log(err);
            });
}

var doComputing = function(res, sql, result, parties, messages){
    //[{id:1, name: npp}, {id:2, name: ndc}, {id:3, name: cpp}]
    //[{message: 'NPP:210000 NDC:4000 CPP:300'}, {message: 'NPP:4990 NDC:23 PNC:234'}, {message:'NDC:2333 NPP:34400 CPP:450'}]
    
    var computedResults = [];
    
    parties.forEach(function(party, i, iArr){
        var id = party.id,
            partyName = party.name.toLowerCase(),
            totalVotes = 0;
        
        messages.forEach(function(messageItem, j, jArr){
            var messageTokens = messageItem.message.split(/[\s*]/);
            
            //['NPP:210000', 'NDC:4000 CPP:300']
            messageTokens.forEach(function(mToken, k, kArr){
                var kParty = mToken.split(/[:]/)[0].toLowerCase(),
                    kVotes = parseInt(mToken.split(/[:]/)[1]);
                
                if(kParty == partyName){
                    totalVotes += parseInt(kVotes);
                }
            });
        });
        
        computedResults.push({id: id, total: totalVotes});
    });

    doAutoComputeInsertion(res, sql, result, computedResults);
}

var doAutoComputeInsertion = function(res, sql, result, computedResults){
    var counter = 0;
    computedResults.forEach(function(element, i, arr){
        var partyId = element.id,
            votes = element.total;
        
        sql.execute({
            query:'update candidates set votes = @votes where constituency_id=@consId and party_id=@partyId and group_type=@type',
                params:{
                    consId:{
                        type: sql.INT,
                        val: result.cons_id
                    },
                    partyId:{
                        type: sql.INT,
                        val: partyId
                    },
                    votes:{
                        type: sql.INT,
                        val: votes
                    },
                    type:{
                        type: sql.CHAR,
                        val: result.type
                    }
                }
            }).then(function(results){
                counter ++;
                if(counter === arr.length){
                    //Do percentage calculations
                    require('../service/candidate_service')(sql).calculateRatiosWithConstituencyId(res, result.cons_id, result.type);
                }
                
            }, function(err){
                console.log(err);
            });
    })
}

var broadcastPushApproved = function(sql, id, EventEmitter){
     sql.execute({
        query:'select a.id, ag.name as agent, r.name as region, c.name as constituency, p.name as poll, a.type, a.message, a.msisdn as mobile from approve_list a join constituencies c on c.id = a.cons_id join regions r on r.id = a.region_id join polls p on p.id = a.poll_id join agents ag on ag.id = a.agent_id where a.id = @id',
        params:{
            id:{
                type: sql.INT,
                val: id
            }
        }
    }).then(function(results){
        EventEmitter.emit('approved_add', results[0]);
       
    }, function(err){
        console.log(err);
    });
}

var broadcastPushRejected = function(sql, id, EventEmitter){
     sql.execute({
        query:'select a.id, ag.name as agent, r.name as region, c.name as constituency, p.name as poll, a.type, a.message, a.msisdn as mobile from approve_list a join constituencies c on c.id = a.cons_id join regions r on r.id = a.region_id join polls p on p.id = a.poll_id join agents ag on ag.id = a.agent_id where a.id = @id',
        params:{
            id:{
                type: sql.INT,
                val: id
            }
        }
    }).then(function(results){
        EventEmitter.emit('rejected_add', results[0]);
       
    }, function(err){
        console.log(err);
    });
}

var broadcastPushApproveChange = function(sql, id, EventEmitter){
        EventEmitter.emit('change_update', id);
        
}

module.exports = routes;