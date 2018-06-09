var express = require('express'),
    event = require('events').EventEmitter;

var routes = function(sql){
    var candidatesRoute = express.Router(),
        EventEmitter = new event();
    
    var candidateService = require('../service/candidate_service')(sql);
    //var candidateService = require('../service/candidate_service_2');

    
    candidatesRoute.route('/')
                .get(function(req, res){
        
                    if(req.query.year){
                          var year = req.query.year;                        
                          sql.execute({
                                query:'select c.id,c.name,p.name as party,cons.name as constituency,c.votes,c.group_type,c.year,c.percentage,c.angle,c.bar_ratio,c.avatar_path from candidates c join parties p on p.id = c.party_id join constituencies cons on cons.id = c.constituency_id where c.year = @year',
                                params:{
                                    year:{
                                        type: sql.VARCHAR,
                                        val: year
                                    }
                                }
                            }).then(function(results){
                                res.status(200).json(massageFilename(results));
                            }, function(err){
                                console.log(err);
                            });
                        
                    }else{
                        res.status(400).send('Please provide [year] and [type] parameter');
                    }
                    //Check for year and type query string
                   
        
                })
                .post(function(req, res){
                    //Post response for candidates
                    if(req.query.level === 'A' || req.query.level === 'S'){
                        if(req.query.year && req.query.name && req.query.cons_id && req.query.votes && req.query.type && req.query.party_id && req.query.avatar_path){
                          var year = req.query.year,
                              name = req.query.name,
                              consId = req.query.cons_id,
                              votes = req.query.votes,
                              type = req.query.type,
                              partyId = req.query.party_id,
                              filename = req.query.avatar_path;                        
                          sql.execute({
                                query:'insert into candidates (year,name,constituency_id,votes,group_type,party_id,avatar_path,percentage,angle,bar_ratio) values (@year,@name,@consId,@votes,@type,@partyId,@avatar,@percentage,@angle,@bar_ratio)',
                                params:{
                                    year:{
                                        type: sql.INT,
                                        val: year
                                    },
                                    name:{
                                        type: sql.VARCHAR,
                                        val: name
                                    },
                                    consId:{
                                        type: sql.INT,
                                        val: consId
                                    },
                                    votes:{
                                        type: sql.INT,
                                        val: votes
                                    },
                                    type:{
                                        type: sql.CHAR,
                                        val: type
                                    },
                                    partyId:{
                                        type: sql.INT,
                                        val: partyId
                                    },
                                    avatar:{
                                        type: sql.VARCHAR,
                                        val: 'X:\\Wasp3d\\Textures\\TV3\\candidates\\'+filename
                                    },
                                    percentage:{
                                        type: sql.INT,
                                        val: 0
                                    },
                                    angle:{
                                        type: sql.INT,
                                        val: 0
                                    },
                                    bar_ratio:{
                                        type: sql.INT,
                                        val: 0
                                    }
                                }
                            }).then(function(results){
                                //res.status(200).json(results);
                                fetchCandidates(sql, res, consId, type, year);
                                EventEmitter.emit('add');
                            }, function(err){
                                console.log(err);
                            });
                        
                    }else{
                        res.status(400).send('Params condition not satisfied');
                    }
                }else{
                    res.status(400).send('Restricted Access');
                }
                })
    candidatesRoute.route('/counts')
                .get(function(req, res){
                        sql.execute({
                                query:'select count(id) as counts from candidates where year = @year and group_type = @type',
                                params:{
                                    year:{
                                        type: sql.INT,
                                        val: 2016
                                    },
                                    type:{
                                        type: sql.CHAR,
                                        val: 'M'
                                    }
                                }
                            }).then(function(results){
                                res.status(200).json(results);
                            }, function(err){
                                console.log(err);
                            });           
                });

    candidatesRoute.route('/download/presidential')
        .get(function(req, res){
                
                    if(req.query.year){
                          var year = req.query.year;                        
                          sql.execute({
                                query:'select c.name,p.name as party,c.votes,c.percentage,cons.name as constituency from candidates c join parties p on p.id = c.party_id join constituencies cons on cons.id = c.constituency_id where c.year = @year and c.group_type=@group order by constituency asc',
                                params:{
                                    year:{
                                        type: sql.VARCHAR,
                                        val: year
                                    },
                                    group:{
                                        type: sql.VARCHAR,
                                        val: 'P'
                                    }

                                }
                            }).then(function(results){
                                res.xls('presidential_data.xls',results);
                            }, function(err){
                                console.log(err);
                            });
                        
                    }else{
                        res.status(400).send('Please provide [year] parameter');
                    }          
    });

    candidatesRoute.route('/download/parliamentary')
        .get(function(req, res){
                
                    if(req.query.year){
                          var year = req.query.year;                        
                          sql.execute({
                                query:'select c.name,p.name as party,c.votes,c.percentage,cons.name as constituency from candidates c join parties p on p.id = c.party_id join constituencies cons on cons.id = c.constituency_id where c.year = @year and c.group_type=@group order by constituency asc',
                                params:{
                                    year:{
                                        type: sql.VARCHAR,
                                        val: year
                                    },
                                    group:{
                                        type: sql.VARCHAR,
                                        val: 'M'
                                    }

                                }
                            }).then(function(results){
                                res.xls('parliamentary_data.xls',results);
                            }, function(err){
                                console.log(err);
                            });
                        
                    }else{
                        res.status(400).send('Please provide [year] parameter');
                    }          
    });
    
     candidatesRoute.route('/all')
                .get(function(req, res){           
                        
                          sql.execute({
                                query:'select c.id,c.name,p.name as party,cons.name as constituency,c.votes,c.group_type,c.year,c.percentage,c.angle,c.bar_ratio,c.avatar_path from candidates c join parties p on p.id = c.party_id join constituencies cons on cons.id = c.constituency_id',
                                params:{
                                }
                            }).then(function(results){
                                res.status(200).json(results);
                            }, function(err){
                                console.log(err);
                            });
                        
                   
                    //Check for year and type query string
                   
        
                })
                .post(function(req, res){
                    //Post response for candidates
                })
     
     candidatesRoute.route('/work')
                .get(function(req, res){                              
                    doWork(sql, res, req);
                })
    
      candidatesRoute.route('/constituency/:id')
                .get(function(req, res){
                    var constituency_id = req.params.id;
                    if(req.query.year && req.query.type && constituency_id){
                          var year = req.query.year,
                              type = req.query.type;
                        
                            sql.execute({
                                query:'select c.id,c.name,p.name as party,cons.name as constituency,c.votes,c.group_type,c.year,c.percentage,c.angle,c.bar_ratio, c.avatar_path from candidates c join parties p on p.id = c.party_id join constituencies cons on cons.id = c.constituency_id where c.year = @year and c.group_type = @group_type and cons.id = @cons_id',
                                params:{
                                    year:{
                                        type: sql.VARCHAR,
                                        val: year
                                    },
                                    group_type:{
                                        type: sql.VARCHAR,
                                        val: type
                                    },
                                    cons_id:{
                                        type:sql.INT,
                                        val:constituency_id
                                    }
                                }
                            }).then(function(results){
                                res.status(200).json(massageFilename(results));
                            }, function(err){
                                console.log(err);
                            });   
                    }else{
                        res.status(400).send('Please provide [year] and [type] parameter and/or a valid constituency ID');
                    }
                })
                .put(function(req, res){
                    var id = req.params.id;
                })
                .delete(function(req, res){
                    var id = req.params.id;
                });
    
     candidatesRoute.route('/party/:id')
                .get(function(req, res){
                    var party_id = req.params.id;
                    if(req.query.year){
                          var year = req.query.year;                        
                        
                         sql.execute({
                                query:'select c.id,c.name,p.name as party,cons.name as constituency,c.votes,c.group_type,c.year,c.percentage,c.angle,c.bar_ratio, c.avatar_path from candidates c join parties p on p.id = c.party_id join constituencies cons on cons.id = c.constituency_id where c.year = @year and p.id = @party_id',
                                params:{
                                    year:{
                                        type: sql.VARCHAR,
                                        val: year
                                    },
                                    party_id:{
                                        type: sql.INT,
                                        val: party_id
                                    }
                                }
                            }).then(function(results){
                                res.status(200).json(massageFilename(results));
                            }, function(err){
                                console.log(err);
                            });  
                        
                    }else{
                        res.status(400).send('Please provide [year] and [type] parameter');
                    }
                })
                .put(function(req, res){
                    var id = req.params.id;
                })
                .delete(function(req, res){
                    var id = req.params.id;
                });
    
    
    candidatesRoute.route('/:id')
                .get(function(req, res){
                    var id = req.params.id;
                    if(id){
                         sql.execute({
                                query:'select c.id,c.name,p.name as party,cons.name as constituency,c.votes,c.group_type,c.year,c.percentage,c.angle,c.bar_ratio,c.avatar_path from candidates c join parties p on p.id = c.party_id join constituencies cons on cons.id = c.constituency_id where c.id = @id',
                                params:{
                                    id:{
                                        type:sql.INT,
                                        val:id
                                    }
                                }
                            }).then(function(results){
                                res.status(200).json(massageFilename(results));
                            }, function(err){
                                console.log(err);
                            });  
                    }else{
                        res.status(400).send('Please ID should be greater than zero(0)');
                    }
                })
                .put(function(req, res){
                    if(req.query.level === 'A' || req.query.level === 'S'){
                    var id = req.params.id,
                        votes = req.query.votes,
                        path = req.query.filename;
        
                    sql.execute({
                        query:'update candidates set votes = @votes, avatar_path = @filename where id = @id',
                            params:{
                                id:{
                                    type: sql.INT,
                                    val: id
                                },
                                votes:{
                                    type: sql.INT,
                                    val: votes
                                },
                                filename:{
                                    type: sql.VARCHAR,
                                    val: 'X:\\Wasp3d\\Textures\\TV3\\candidates\\'+path
                                }
                            }
                        }).then(function(results){
                                //res.status(200).json(results);
                                fetchUpdateDetails(id,sql,res);
                                EventEmitter.emit('update', id);
                        }, function(err){
                                console.log(err);
                        }); 
                    }else{
                        res.status(400).send('Restricted Access');
                    }

                })
                .delete(function(req, res){
                    if(req.params.id && (req.query.level === 'A' || req.query.level === 'S')){
                        var id = req.params.id;
                        sql.execute({
                            query:'delete from candidates where id = @id',
                            params:{
                                id:{
                                    type: sql.INT,
                                    val: id
                                }
                            }
                        }).then(function(results){
                            res.status(200).json(results);
                            EventEmitter.emit('delete');
                        }, function(err){
                            console.log(err);
                        }); 
                    }else{
                        res.status(400).send('Restricted Access');
                    }
                });
    
    var fetchUpdateDetails = function(candidateId, sql, res){
        sql.execute({
                query:'select constituency_id,group_type,year from candidates where id = @id',
                    params:{
                        id:{
                            type: sql.INT,
                            val: candidateId
                        }
                    }
                    }).then(function(results){
                            //res.status(200).json(results);
                            var candidate = results[0];
                            fetchCandidates(sql, res, candidate.constituency_id, candidate.group_type, candidate.year);
                    }, function(err){
                            console.log(err);
                    }); 
    }
    
    var fetchCandidates = function(sql, res, consId, type, year){
            sql.execute({
                        query:'select id,votes from candidates where constituency_id = @consId and group_type = @type and year = @year',
                        params:{
                            consId:{
                                type: sql.INT,
                                val : consId
                            },
                            type:{
                                type: sql.VARCHAR,
                                val: type
                            },
                            year:{
                                type: sql.INT,
                                val: year
                            }
                                }
                            }).then(function(results){
                                //res.status(200).json(results);
                                candidateService.calculateRatios(results, res);
                            }, function(err){
                                console.log(err);
            });
    }
    
    var massageFilename = function(results){
        if(results.length){
            results.forEach(function(ele, i, arr){
                var candidate = ele;
                var path = 'X:\\Wasp3d\\Textures\\TV3\\candidates\\';
                
                if(candidate.avatar_path !== null){
                
                    if(candidate.avatar_path.trim().length > 1){
                        candidate.avatar_path = candidate.avatar_path.replace(path, '');
                    }else{
                        candidate.avatar_path = 'Unknown';
                    }
                }else{
                    candidate.avatar_path = 'Unknown';
                }
            })
            
            return results;
        }
    }
    
    var doWork = function(sql, res, req){
        
        if(req.query.year && req.query.type){
            var years = [],
                type = req.query.type;
            
            years.push(req.query.year);
            
            years.forEach(function(element, index, arr){
            
            var year = element;
             sql.execute({
                    query:'select id from constituencies where year = @year',
                    params:{
                        year:{
                            type: sql.INT,
                            val: year
                        }
                    }
            }).then(function(results){
                    grabAllCandidates(sql, res, results, type, year);
            }, function(err){
                    console.log(err);
            });
        });
        
        res.status(200).send('Finieto');
        }
    }
    
    var grabAllCandidates = function(sql, res, results, type, year){
        
        results.forEach(function(element, index, arr){
            var constituencyId = element.id;
            fetchCandidates(sql, res, constituencyId, type, year);
        });
    }
    
    return {router: candidatesRoute, event: EventEmitter};
};

module.exports = routes;