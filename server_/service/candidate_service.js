

var service = function(sql){
    var service = {};
    
    service.calculateRatios = function(results, res){
        if(results.length > 0){
            var total = 0,
                threshold_100 = 100,
                threshold_360 = 360,
                threshold_400 = 400;
        
            var candidates = [];
        
            //Get total votes
            console.log(results);
            results.forEach(function(element, index, array){
                var candidate = element;
                
                if(candidate.votes){
                    total = parseInt(candidate.votes) + total;
                }
            });
            
            console.log('Total => '+total);

        
            //Calculat all ratios
            results.forEach(function(element, index, array){
                var candidate = element,
                    candidateThres_100 = (parseInt(candidate.votes)/total)*threshold_100,
                    candidateThres_360 = (parseInt(candidate.votes)/total)*threshold_360,
                    candidateThres_400 = (parseInt(candidate.votes)/total)*threshold_400;
            
                
                console.log('Percentage => '+candidateThres_100);
                console.log('Angle => '+candidateThres_360);
                console.log('Bar Ratio => '+candidateThres_400);
                
                candidate.percentage = candidateThres_100;
                candidate.angle = candidateThres_360;
                candidate.bar = candidateThres_400;
            
                candidates.push(candidate);
            });
            
            updateCandidate(res, sql, candidates);
        
        }
    };
    
    service.calculateRatiosWithConstituencyId = function(res, consId, type){
        if(consId){
            sql.execute({
                query:'select id,votes,group_type from candidates where constituency_id = @consId and group_type = @type',
                    params:{
                        consId:{
                            type: sql.INT,
                            val : consId
                        },
                        type:{
                            type: sql.CHAR,
                            val: type
                        }
                    }
            }).then(function(results){
                service.calculateRatios(results, res);
            }, function(err){
                console.log(err);
            }); 
        }
    }
    
    return service;
}

var updateCandidate = function(res, sql, candidates){
     if(candidates.length > 0){
            var counter = 0;
            candidates.forEach(function(element, index, array){
                var candidate = element;
                sql.execute({
                            query:'update candidates set percentage = @percentage, angle = @angle, bar_ratio = @ratio where id = @id',
                                params:{
                                    id:{
                                        type: sql.INT,
                                        val : candidate.id
                                    },
                                    percentage:{
                                        type: sql.FLOAT,
                                        val: candidate.percentage
                                    },
                                    angle:{
                                        type: sql.FLOAT,
                                        val: candidate.angle
                                    },
                                    ratio:{
                                        type: sql.FLOAT,
                                        val: candidate.bar
                                    }
                                }
                            }).then(function(results){
                                counter ++;
                                if(counter == array.length){
                                    res.status(200).send('success');
                                }
                                
                            }, function(err){
                                console.log(err);
                            }); 
            });
            //res.status(200).send('Done');
        }
}

module.exports = service;