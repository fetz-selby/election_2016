var express = require('express'),
    event = require('events').EventEmitter;

var routes = function(sql){
    var nationalRouter = express.Router(),
        EventEmitter = new event();

    nationalRouter.route('/')
                .get(function(req, res){
                    if(req.query.year && req.query.type){
                        var year = req.query.year,
                            type = req.query.type;
                        
                        sql.execute({
                            query:'select p.name as party,n.votes,n.percentage,n.id from national_analysis n join parties p on p.id = n.party_id where n.type = @type and n.year = @year',
                            params:{
                                year:{
                                    type: sql.VARCHAR,
                                    val: year
                                },
                                type:{
                                    type: sql.CHAR,
                                    val: type
                                }
                            }
                        }).then(function(results){
                            res.status(200).json(results);
                        }, function(err){
                            console.log(err);
                        });
                    }
                });
    
            
    return {router: nationalRouter, event: EventEmitter};
};

module.exports = routes;