var express = require('express'),
    event = require('events').EventEmitter;

var routes = function(sql){
    var regionAnalysisRoute = express.Router(),
        EventEmitter = new event();
    
    regionAnalysisRoute.route('/')
                .get(function(req, res){
        
                    if(req.query.year && req.query.regionId && req.query.type){
                          var year = req.query.year,
                              regionId = req.query.regionId,
                              type = req.query.type;             
                        
                          sql.execute({
                                query:'select ra.id,p.name as party,ra.votes,ra.percentage,ra.angle,ra.bar_ratio,ra.type,ra.year from regional_analysis ra join parties p on p.id = ra.party_id join regions r on r.id = ra.region_id where ra.year = @year and ra.region_id = @regionId and ra.status = @status and ra.type = @type',
                                params:{
                                    year:{
                                        type: sql.VARCHAR,
                                        val: year
                                    },
                                    regionId:{
                                        type: sql.INT,
                                        val: regionId
                                    },
                                    status:{
                                        type: sql.VARCHAR,
                                        val: 'A'
                                    },
                                    type:{
                                        type: sql.VARCHAR,
                                        val: type
                                    }
                                }
                            }).then(function(results){
                                res.status(200).json(results);
                            }, function(err){
                                console.log(err);
                            });
                        
                    }else{
                        res.status(400).send('Please provide [year] and [type] parameter');
                    }
                    //Check for year and type query string
                   
        
                })
                .post(function(req, res){
                    if(req.query.level === 'A' || req.query.level === 'S'){
                        if(req.query.year && req.query.regionId && req.query.votes && req.query.partyId){
                            var year = req.query.year,
                                regionId = req.query.regionId,
                                type = req.query.type,
                                partyId = req.query.partyId,
                                votes = req.query.votes;             
                        
                            sql.execute({
                                query:'insert into regional_analysis (region_id,party_id,votes,type,percentage,year,status,angle,bar_ratio)values(@regionId,@partyId,@votes,@type,@percentage,@year,@status,@angle,@bar)',
                                params:{
                                    regionId:{
                                        type: sql.INT,
                                        val: regionId
                                    },
                                    partyId:{
                                        type: sql.INT,
                                        val: partyId
                                    },
                                    votes:{
                                        type: sql.INT,
                                        val: votes
                                    },
                                    status:{
                                        type: sql.VARCHAR,
                                        val: 'A'
                                    },
                                    type:{
                                        type: sql.VARCHAR,
                                        val: type
                                    },
                                    year:{
                                        type: sql.INT,
                                        val: year
                                    },
                                    percentage:{
                                        type: sql.FLOAT,
                                        val: 0
                                    },
                                    angle:{
                                        type: sql.FLOAT,
                                        val: 0
                                    },
                                    bar:{
                                        type: sql.FLOAT,
                                        val: 0
                                    }
                                }
                            }).then(function(results){
                                var compute = require('../service/regional_analysis_service');
                                compute.computeRegionalAnalysis(res, sql, regionId, type, year);
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
    
    regionAnalysisRoute.route('/:id')
                .get(function(req, res){
                    var id = req.params.id;
                    if(id){
                         sql.execute({
                                query:'select ra.id,p.name as party,ra.votes,ra.percentage,ra.angle,ra.bar_ratio,ra.type,ra.year from regional_analysis ra join parties p on p.id = ra.party_id join regions r on r.id = ra.region_id where ra.id = @id and ra.status = @status',
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
                .delete(function(req, res){
                    if(req.query.level === 'A' || req.query.level === 'S'){
                        var id = req.params.id;
                        if(id){
                            updateRegionalAnalysis(res, id); 
                        }else{
                            res.status(400).send('Please provide a valid ID');
                        }
                    }else{
                        res.status(400).send('Restricted Access');
                    }
                    
                });
    
    
    var updateRegionalAnalysis = function(res, id){
        sql.execute({
                    query:'select region_id,type,year from regional_analysis where id = @id',
                    params:{
                        id:{
                            type: sql.INT,
                            val : id
                            }
                        }
                    }).then(function(results){
                        if(results.length === 1){
                            console.log('region id => '+results[0].region_id+', type => '+results[0].type+', year => '+results[0].year);
                            deleteRegionalAnalysis(res, id, results);
                        }
                    }, function(err){
                            console.log(err);
        });
    }
    
    var deleteRegionalAnalysis = function(res, id, detailResults){
        sql.execute({
                    query:'delete from regional_analysis where id = @id',
                        params:{
                            id:{
                                type: sql.INT,
                                val : id
                            }
                        }
                    }).then(function(results){
                            //res.status(200).json(results);
                        var compute = require('../service/regional_analysis_service');
                        compute.computeRegionalAnalysis(res, sql, detailResults[0].region_id, detailResults[0].type, detailResults[0].year);
                    }, function(err){
                        console.log(err);
                    });
    }
    
    return {router: regionAnalysisRoute, event: EventEmitter};
};

module.exports = routes;