var express = require('express'),
    event = require('events').EventEmitter;

var routes = function(sql){
    var constituencyRouter = express.Router(),
        EventEmitter = new event();

    constituencyRouter.route('/')
                .get(function(req, res){
                    //Get response for constituency
        
                    if(req.query.year){
                        var year = req.query.year;
                        
                         sql.execute({
                                query:'select c.id, r.name as region, c.name, c.year, c.auto_compute from constituencies c join parent_constituencies p on c.parent_id = p.id join regions r on p.region_id = r.id where c.year = @year',
                                params:{
                                    year:{
                                        type: sql.VARCHAR,
                                        val: year
                                    }
                                }
                            }).then(function(results){
                                res.status(200).json(getFormattedConstituencies(results));
                            }, function(err){
                                console.log(err);
                            });
                    }else{
                         res.status(400).send('Please provide a [year] parameter');

                    }
                })
                .post(function(req, res){
                    //Post response for constituency
                    if(req.query.level === 'A' || req.query.level === 'S'){
                        if(req.query.year && req.query.name && req.query.parentId){
                        var year = req.query.year,
                            name = req.query.name,
                            parentId = req.query.parentId;
                        
                         sql.execute({
                                query:'insert into constituencies (name,district_id,reg_votes,reject_votes,total_votes,casted_votes,is_declared,seat_won_id,parent_id,year,auto_compute) values (@name,0,0,0,0,0,@declared,0,@parentId,@year,@autoCompute)',
                                params:{
                                    name:{
                                        type: sql.VARCHAR,
                                        val: name
                                    },
                                    declared:{
                                        type: sql.CHAR,
                                        val: 'N'
                                    },
                                    parentId:{
                                        type: sql.VARCHAR,
                                        val: parentId
                                    },
                                    year:{
                                        type: sql.VARCHAR,
                                        val: year
                                    },
                                    autoCompute:{
                                        type: sql.CHAR,
                                        val: 'F'
                                    }
                                }
                            }).then(function(results){
                                res.status(200).json(getFormattedConstituencies(results));
                                EventEmitter.emit('add');
                            }, function(err){
                                console.log(err);
                            });
                    }else{
                         res.status(400).send('Please provide a [year] parameter');

                    }
                        }else{
                            res.status(400).send('Restricted Access');
                        }
                })
    constituencyRouter.route('/counts')
                .get(function(req, res){
                        sql.execute({
                                query:'select count(id) as counts from constituencies where year = @year',
                                params:{
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
    
    constituencyRouter.route('/auto_compute/counts')
                .get(function(req, res){
                        sql.execute({
                                query:'select count(id) as counts from constituencies where year = @year and auto_compute = @autoCompute',
                                params:{
                                    year:{
                                        type: sql.VARCHAR,
                                        val: '2016'
                                    },
                                    autoCompute:{
                                        type: sql.CHAR,
                                        val: 'T'
                                    }
                                }
                            }).then(function(results){
                                res.status(200).json(results);
                            }, function(err){
                                console.log(err);
                            });           
                });
    
    constituencyRouter.route('/analysis')
                .get(function(req, res){
                    if(req.query.year && req.query.regionId){
                        var year = req.query.year,
                            regionId = req.query.regionId;
                        
                        sql.execute({
                                query:'select ca.id, cons.name as constituency, par.name as party, can.name as candidate, ca.votes, ca.percentage from constituency_seat ca join constituencies cons on cons.id = ca.cons_id join parties par on par.id = ca.party_id join candidates can on can.id = ca.candidate_id where ca.year = @year and ca.region_id = @regionId',
                                params:{
                                    year:{
                                        type: sql.VARCHAR,
                                        val: year
                                    },
                                    regionId:{
                                        type: sql.INT,
                                        val: regionId
                                    }
                                }
                            }).then(function(results){
                                res.status(200).json(results);
                            }, function(err){
                                console.log(err);
                            });   
                        }
                    })

    constituencyRouter.route('/declared')
                .get(function(req, res){
                    if(req.query.year && req.query.regionId){
                        var year = req.query.year,
                            regionId = req.query.regionId;
                        
                        sql.execute({
                                query:'select count(ca.id) as count from constituency_seat ca join constituencies cons on cons.id = ca.cons_id join parties par on par.id = ca.party_id join candidates can on can.id = ca.candidate_id where ca.year = @year and ca.region_id = @regionId',
                                params:{
                                    year:{
                                        type: sql.VARCHAR,
                                        val: year
                                    },
                                    regionId:{
                                        type: sql.INT,
                                        val: regionId
                                    }
                                }
                            }).then(function(results){
                                res.status(200).json(results);
                            }, function(err){
                                console.log(err);
                            });   
                        }
                    })
    
     constituencyRouter.route('/region/:id')
                .get(function(req, res){
                    var id = req.params.id;
                    if(req.query.year){
                        var year = req.query.year;
                        
                        sql.execute({
                                query:'select c.id, r.name as region, c.name, c.year, c.auto_compute from constituencies c join parent_constituencies p on c.parent_id = p.id join regions r on p.region_id = r.id where c.year = @year and r.id = @region_id',
                                params:{
                                    year:{
                                        type: sql.VARCHAR,
                                        val: year
                                    },
                                    region_id:{ 
                                        type: sql.INT,
                                        val: id
                                    }
                                }
                            }).then(function(results){
                                res.status(200).json(getFormattedConstituencies(results));
                            }, function(err){
                                console.log(err);
                            });
                    }else{
                        res.status(400).send('Please provide a [year] parameter');

                    }            
                })
    
    constituencyRouter.route('/:id')
                .get(function(req, res){
                    var id = req.params.id;
                    if(id){
                       sql.execute({
                                query:'select c.id,c.name,r.name as region,c.year,c.auto_compute from constituencies c join parent_constituencies p on c.parent_id = p.id join regions r on p.region_id = r.id where c.id = @id',
                                params:{
                                    id:{
                                        type: sql.INT,
                                        val: id
                                    }
                                }
                            }).then(function(results){
                                res.status(200).json(getFormattedConstituencies(results));
                            }, function(err){
                                console.log(err);
                            }); 
                    }else{
                        res.status(400).send('Please ID should be greater than zero(0)');
                    }               
                })
                .put(function(req, res){
                    if(req.query.level === 'A' || req.query.level === 'S'){
                        if(req.params.id && req.query.state){
                            var id = req.params.id,
                                state = req.query.state;
                        
                            if(state === 'T' || state == true){
                                state = 'T';
                            }else{
                                state = 'F';
                            }
                        
                            sql.execute({
                                query:'update constituencies set auto_compute = @autoCompute where id = @id',
                                params:{
                                    id:{
                                        type: sql.INT,
                                        val: id
                                    },
                                    autoCompute:{
                                        type: sql.CHAR,
                                        val: state
                                    }
                                }
                            }).then(function(results){
                                res.status(200).json(results);
                                EventEmitter.emit('update', id);
                            }, function(err){
                                console.log(err);
                        }); 
                        }else{
                            res.status(400).send('Missing Parameters'); 
                        }
                    }else{
                        res.status(400).send('Restricted Access'); 
                    }
                })
    
    return {router: constituencyRouter, event: EventEmitter};
};

var getFormattedConstituencies = function(results){
    results.forEach(function(ele, i, arr){
        //Check if auto_compute is 'F' or 'T'
       if(ele.auto_compute === 'F'){
           ele.auto_compute = false;
       }else{
           ele.auto_compute = true;
       }
    });
    
    return results;
}

module.exports = routes;