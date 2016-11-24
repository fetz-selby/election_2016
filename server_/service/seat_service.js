exports.computeForSeats = function(sql, res){
    var years = ['2000','2004','2008','2012','2016'];
    
         sql.execute({
            query:'select id, region_id from parent_constituencies',
            params:{}
        }).then(function(results){
            doConstituencies(sql, results, years, res);
         }, function(err){
            console.log(err);
        });       
}

var doConstituencies = function(sql, parentConstituencies, years, res){
    if(years.length && parentConstituencies.length){
        var counter = 0;
        years.forEach(function(year, i, arr){
            
          parentConstituencies.forEach(function(parent_cons, i, cons_arr){
              
              sql.execute({
                    query:'select id from constituencies where parent_id = @parentId and year = @year',
                    params:{
                        parentId:{
                            type: sql.INT,
                            val: parent_cons.id
                        },
                        year:{
                            type: sql.VARCHAR,
                            val: year
                        }
                    }
            }).then(function(results){
                  if(results.length){
                    doCandidates(sql, results[0].id, parent_cons.region_id);
                  }
            }, function(err){
                console.log(err);
            });
              
            
          })      
            
        })
        
        setTimeout(function(){
            res.status(200).send('success');
        }, 4000);
    }
}

var doCandidates = function(sql, constituencyId, regionId){
    if(constituencyId){
         sql.execute({
                    query:'select id,name,votes,party_id,constituency_id,year from candidates where constituency_id = @consId and group_type = @type',
                    params:{
                        consId:{
                            type: sql.INT,
                            val: constituencyId
                        },
                        type:{
                            type: sql.CHAR,
                            val: 'M'
                        }
                    }
            }).then(function(results){
                if(results.length){
                    doVotesComparision(sql, results, constituencyId, regionId);
                }
            }, function(err){
                console.log(err);
            });
    }
}

var doVotesComparision = function(sql, candidates, constituencyId, regionId){
    var greaterVotes = 0,
        partyId = 0,
        candidateId = 0,
        sum = 0,
        percentage = 0,
        year = 0;
    
    candidates.forEach(function(candidate, i, arr){
        sum += parseInt(candidate.votes);
        
        if(parseInt(candidate.votes) > greaterVotes){
            greaterVotes = parseInt(candidate.votes);
            partyId = candidate.party_id;
            candidateId = candidate.id;
            year = candidate.year;
        }
    });
    
    percentage = (greaterVotes/sum)*100;
    saveToConstituencySeat(sql, candidateId,greaterVotes,partyId,constituencyId,regionId,percentage,year);
}

var saveToConstituencySeat = function(sql, candidateId, votes, partyId, consId, regionId, percentage, year){
    sql.execute({
        query:'insert into constituency_seat (candidate_id,cons_id,party_id,region_id,votes,percentage,year) values (@candidateId,@consId,@partyId,@regionId,@votes,@percentage,@year)',
        params:{
            candidateId:{
                type: sql.INT,
                val: candidateId
            },
            consId:{
                type: sql.INT,
                val: consId
            },
            partyId:{
                type: sql.INT,
                val: partyId
            },
            regionId:{
                type: sql.INT,
                val: regionId
            },
            votes:{
                type: sql.INT,
                val: votes
            },
            percentage:{
                type: sql.FLOAT,
                val: percentage
            },
            year:{
                type: sql.VARCHAR,
                val: year
            }
        }
    }).then(function(results){
        console.log('One Added!!!');
    }, function(err){
        console.log(err);
    });
}