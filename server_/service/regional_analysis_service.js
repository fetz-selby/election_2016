exports.computeRegionalAnalysis = function(res, sql, regionId, type, year){
    if(regionId && type && year){
     sql.execute({
                query:'select id,votes,party_id,type from regional_analysis where region_id = @regionId and type = @type and year = @year and status = @status',
                    params:{
                        regionId:{
                            type: sql.INT,
                            val : regionId
                        },
                        type:{
                            type: sql.CHAR,
                            val: type
                        },
                        year:{
                            type: sql.INT,
                            val: year
                        },
                        status:{
                            type: sql.CHAR,
                            val: 'A'
                        }
                    }
                    }).then(function(results){
                        computePercentages(res, sql, results);
                    }, function(err){
                        console.log(err);
                    }); 
    }
}

var localComputeRegionalAnalysis = function(res, sql, regionId, type, year){
    if(regionId && type && year){
     sql.execute({
                query:'select id,votes,party_id,type from regional_analysis where region_id = @regionId and type = @type and year = @year and status = @status',
                    params:{
                        regionId:{
                            type: sql.INT,
                            val : regionId
                        },
                        type:{
                            type: sql.CHAR,
                            val: type
                        },
                        year:{
                            type: sql.INT,
                            val: year
                        },
                        status:{
                            type: sql.CHAR,
                            val: 'A'
                        }
                    }
                    }).then(function(results){
                        localComputePercentages(res, sql, results);
                    }, function(err){
                        console.log(err);
                    }); 
    }
}

var computePercentages = function(res, sql, results){
    if(results){
        var total = 0,
            percentage_thres = 100,
            angle_thres = 360,
            bar_thres = 400;
        
            computedResults = [];
        
        results.forEach(function(element, index, arr){
            total += parseInt(element.votes);
        });
        
        if(total){
            results.forEach(function(element, index, arr){
                var percentage = (element.votes/total)*percentage_thres,
                    angle = (element.votes/total)*angle_thres,
                    bar = (element.votes/total)*bar_thres;
                
                var newResult = {id: element.id, percentage: percentage, angle: angle, bar: bar};
                
                computedResults.push(newResult);
            });
            
            
            if(computedResults){
                computedResults.forEach(function(element, index, arr){
                    updateRegionalAnalysis(sql, element);
                });
                
                res.status(200).send('success');
            }
        }
    }
}

var localComputePercentages = function(res, sql, results){
    if(results){
        var total = 0,
            percentage_thres = 100,
            angle_thres = 360,
            bar_thres = 400;
        
            computedResults = [];
        
        results.forEach(function(element, index, arr){
            total += parseInt(element.votes);
        });
        
        if(total){
            results.forEach(function(element, index, arr){
                var percentage = (element.votes/total)*percentage_thres,
                    angle = (element.votes/total)*angle_thres,
                    bar = (element.votes/total)*bar_thres;
                
                var newResult = {id: element.id, percentage: percentage, angle: angle, bar: bar};
                
                computedResults.push(newResult);
            });
            
            
            if(computedResults){
                computedResults.forEach(function(element, index, arr){
                    updateRegionalAnalysis(sql, element);
                });
            }
        }
    }
}

var updateRegionalAnalysis = function(sql, row){
    sql.execute({
                query:'update regional_analysis set percentage = @percentage, angle = @angle, bar_ratio = @bar where id = @id',
                    params:{
                        percentage:{
                            type: sql.FLOAT,
                            val : row.percentage
                        },
                        angle:{
                            type: sql.FLOAT,
                            val: row.angle
                        },
                        bar:{
                            type: sql.FLOAT,
                            val: row.bar
                        },
                        id:{
                            type: sql.INT,
                            val: row.id
                        }
                    }
                    }).then(function(results){
                        
                    }, function(err){
                            console.log(err);
                    }); 
}

exports.autoComputeRegionalAnalysis = function(res, sql){
    var years = ['1996','2000','2004','2008','2012','2016'];
    
    sql.execute({
        query:'select id,name from parties',
        params:{}
    }).then(function(results){
        doGrabCandidates(res, sql, results, years);
    }, function(err){
        console.log(err);
    }); 
}

var doGrabCandidates = function(res, sql, parties, years){
    if(parties.length){
        var types = ['M', 'P'];
        years.forEach(function(year, i, arr_y){
            parties.forEach(function(party, j, arr_p){
                types.forEach(function(type, k, arr_t){
                    sql.execute({
                        query:'select can.id,can.votes,r.id as region_id,can.year from candidates can join constituencies cons on cons.id = can.constituency_id join parent_constituencies pc on pc.id = cons.parent_id join regions r on r.id = pc.region_id where can.party_id = @partyId and can.year = @year and can.group_type = @type',
                    params:{
                        partyId:{
                            type: sql.INT,
                            val : party.id
                        },
                        year:{
                            type: sql.INT,
                            val: year
                        },
                        type:{
                            type: sql.CHAR,
                            val: type
                        }
                    }
                    }).then(function(results){
                        doRegionalCandidateArthemetic(sql, results, year, party.id, type);
                        doNationalCandidateArthemetic(sql, results, year, party.id, type);
                    }, function(err){
                        console.log(err);
                    }); 
                })
            })
            
        });
        
        setTimeout(function(){
            doRegionalPercentageCal(res, sql, years, types);
        }, 5000);
        
         setTimeout(function(){
            doNationalPercentageCal(sql, years);
        }, 5000);
        
    }else{
        res.status(400).send('Internal Server Error');
    }
}

var doRegionalCandidateArthemetic = function(sql, candidates, year, partyId, groupType){
    var regions = [1,2,3,4,5,6,7,8,9,10],
        container = [];
    
    regions.forEach(function(regionId, i, arr_i){
        var sum = 0;
        
        candidates.forEach(function(candidate, j, arr_j){
            var tmpRegionId = parseInt(candidate.region_id);
            if(tmpRegionId === parseInt(regionId)){
                sum += parseInt(candidate.votes);
            }
        });
        
        container.push({year: year, partyId: partyId, type: groupType, totalVotes: sum, regionId: regionId});
    });
    
    container.forEach(function(regionalData, i, arr){
        saveToRegionalAnalysis(sql, regionalData);
    });
    
}

var saveToRegionalAnalysis = function(sql, regionalData){
    sql.execute({
            query:'insert into regional_analysis (region_id,party_id,votes,type,year,status) values (@regionId,@partyId,@votes,@type,@year,@status)',
            params:{
                regionId:{
                    type: sql.INT,
                    val: regionalData.regionId
                },
                partyId:{
                    type: sql.INT,
                    val: regionalData.partyId
                },
                votes:{
                    type: sql.INT,
                    val: regionalData.totalVotes
                },
                year:{
                    type: sql.INT,
                    val: regionalData.year
                },
                type:{
                    type: sql.CHAR,
                    val: regionalData.type
                },
                status:{
                    type: sql.CHAR,
                    val: 'A'
                }
                    }
    }).then(function(results){
        console.log('Regional Analysis added !!!');
    }, function(err){
        console.log(err);
    }); 
}

var doRegionalPercentageCal = function(res, sql, years, types){
    var regions = [1,2,3,4,5,6,7,8,9,10];
    
    years.forEach(function(year, i, arr_i){
        regions.forEach(function(regionId, k, arr_k){
            types.forEach(function(type, j, arr_j){
                localComputeRegionalAnalysis(res, sql, regionId, type, year);  
            })
        })
    })
    
     setTimeout(function(){
        res.status(200).send('success');
     }, 5000);
}

var doNationalPercentageCal = function(sql, years){
    var types = ['M', 'P'];
    
    years.forEach(function(year, i, arr_i){
        
        types.forEach(function(type, j, arr_j){
            sql.execute({
                query:'select id,votes,party_id,type,year from national_analysis where year = @year and type=@type',
                params:{
                    year:{
                        type: sql.INT,
                        val: year
                    },
                    type:{
                        type: sql.CHAR,
                        val: type
                    }
                }
            }).then(function(results){
                doNationalSummation(sql, results);        
            }, function(err){
                console.log(err);
            }); 
        });   
    });
}

var doNationalSummation = function(sql, results){
    var sum = 0,
        container = [];
    results.forEach(function(nationalData, i, arr){
        sum += parseInt(nationalData.votes);
    });
    
    results.forEach(function(nationalData, i, arr){
        var percentage = (parseInt(nationalData.votes)/sum)*100;
        var angle = (parseInt(nationalData.votes)/sum)*360;
        var bar = (parseInt(nationalData.votes)/sum)*400;
        
        container.push({id: nationalData.id, percentage: percentage, angle: angle, bar: bar});
    });
    
    doUpdateNationalAnalysis(sql, container);
}

var doUpdateNationalAnalysis = function(sql, container){
    container.forEach(function(data, i, arr){
       sql.execute({
            query:'update national_analysis set percentage = @percentage, angle = @angle, bar = @bar where id = @id',
            params:{
                id:{
                    type: sql.INT,
                    val: data.id
                },
                percentage:{
                    type: sql.FLOAT,
                    val: data.percentage
                },
                angle:{
                    type: sql.FLOAT,
                    val: data.angle
                },
                bar:{
                    type: sql.FLOAT,
                    val: data.bar
                }
                    }
    }).then(function(results){
        console.log('National Analysis updated !!!');         
    }, function(err){
        console.log(err);
    });  
    });
}

var doNationalCandidateArthemetic = function(sql, candidates, year, partyId, groupType){
    if(candidates.length){
        var sum = 0,
            nationalData = {};
        candidates.forEach(function(candidate, i, arr){
            sum += parseInt(candidate.votes);
        });
        
        nationalData = {totalVotes: sum, partyId: partyId, year: year, type: groupType};
        saveToNationalAnalysis(sql, nationalData);
    }
}

var saveToNationalAnalysis = function(sql, nationalData){
    sql.execute({
            query:'insert into national_analysis (party_id,votes,type,year,percentage,angle,bar) values (@partyId,@votes,@type,@year,0,0,0)',
            params:{
               
                partyId:{
                    type: sql.INT,
                    val: nationalData.partyId
                },
                votes:{
                    type: sql.INT,
                    val: nationalData.totalVotes
                },
                year:{
                    type: sql.INT,
                    val: nationalData.year
                },
                type:{
                    type: sql.CHAR,
                    val: nationalData.type
                }
                    }
    }).then(function(results){
        console.log('National Analysis added !!!');         
    }, function(err){
        console.log(err);
    }); 
}