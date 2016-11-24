var express = require('express'),
    event = require('events').EventEmitter;

var routes = function(sql){
    var partyRouter = express.Router(),
        EventEmitter = new event();

    partyRouter.route('/')
                .get(function(req, res){
                        
                        sql.execute({
                                query:'select id,name,logo_path from parties',
                                params:{}
                            }).then(function(results){
                                res.status(200).json(massageFilename(results));
                            }, function(err){
                                console.log(err);
                            });
                   
                })
                .post(function(req, res){
                    //Post response for parties
                    if(req.query.level === 'A' || req.query.level === 'S'){
                        if(req.query.name && req.query.logo_path){
                            var name = req.query.name,
                                logoPath = req.query.logo_path;
                        
                            sql.execute({
                                query:'insert into parties (name,color,logo_path) values (@name,@color,@logoPath)',
                                params:{
                                    name:{
                                        type: sql.VARCHAR,
                                        val: name
                                    },
                                    color:{
                                        type: sql.VARCHAR,
                                        val: '#ffffff'
                                    },
                                    logoPath:{
                                        type: sql.VARCHAR,
                                        val: 'X:\\Wasp3d\\Textures\\TV3\\party_logos\\'+logoPath
                                    }
                                }
                            }).then(function(results){
                                res.status(200).json(results);
                                EventEmitter.emit('add');
                            }, function(err){
                                console.log(err);
                            });
                        }else{
                            res.status(400).send('Missing Parameters')
                        }
                    }else{
                        res.status(400).send('Restricted Access');
                    }
                });
    
    partyRouter.route('/:id')
                .get(function(req, res){
                    var id = req.params.id;
                    if(id){
                          sql.execute({
                                query:'select id,name,logo_path from parties where parties.id = @id',
                                params:{
                                    id:{
                                        type:sql.INT,
                                        val: id
                                    }
                                }
                            }).then(function(results){
                                res.status(200).json(massageFilename(results));
                            }, function(err){
                                console.log(err);
                            });
                    }else{
                            res.status(400).send('Please provide a valid ID');
                    }
        
                })
    
    var massageFilename = function(results){
        if(results.length){
            results.forEach(function(ele, i, arr){
                var party = ele;
                var path = 'X:\\Wasp3d\\Textures\\TV3\\party_logos\\';
                
                if(party.logo_path.trim().length > 1){
                    party.logo_path = party.logo_path.replace(path, '');
                }else{
                    party.logo_path = 'Unknown';
                }
            })
            
            return results;
        }
    }
    
    return {router: partyRouter, event: EventEmitter};
};

module.exports = routes;