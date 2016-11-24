var express = require('express'),
    event = require('events').EventEmitter;

var routes = function(sql){
    var pollingstationRouter = express.Router(),
        EventEmitter = new event();

    pollingstationRouter.route('/')
                .get(function(req, res){
        
                    if(req.query.year){
                        var year = req.query.year;
                        
                         sql.execute({
                                query:'select p.id, p.name, c.name as constituency, p.year from polls p join constituencies c on c.id = p.cons_id where c.year = @year and p.status = @status',
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
                    //Post response for pollstation
                    if(req.query.level === 'A' || req.query.level === 'S'){
                        if(req.query.year && req.query.cons_id && req.query.name){
                            var year = req.query.year,
                                name = req.query.name,
                                consId = req.query.cons_id;
                        
                            sql.execute({
                                query:'insert into polls (name,cons_id,year,status) values (@name,@consId,@year,@status)',
                                params:{
                                    name:{
                                        type: sql.VARCHAR,
                                        val: name
                                    },
                                    consId:{
                                        type: sql.INT,
                                        val: consId
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
                                EventEmitter.emit('add');
                            }, function(err){
                                console.log(err);
                            });
                        }else{
                            res.status(400).send('Missing Parameters');
                        }
                    }else{
                        res.status(400).send('Restricted Access');
                    }
                });
    
    pollingstationRouter.route('/counts')
                .get(function(req, res){
                        sql.execute({
                                query:'select count(id) as counts from polls where status = @status and year = @year',
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
               
     pollingstationRouter.route('/constituency/:id')
                .get(function(req, res){
                    var id = req.params.id;
                    if(id){
                     sql.execute({
                                query:'select p.id, p.name, c.name as constituency, p.year from polls p join constituencies c on c.id = p.cons_id where c.id = @id and p.status = @status',
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
                }); 
    
     pollingstationRouter.route('/region/:id')
                .get(function(req, res){
                    var id = req.params.id;
                    if(id){
                        sql.execute({
                                query:'select p.id, p.name, c.name as constituency, p.year from polls p join constituencies c on c.id = p.cons_id join parent_constituencies pc on pc.id = c.parent_id join regions r on r.id = pc.region_id where r.id = @id and p.status = @status',
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
                }); 
    
    pollingstationRouter.route('/:id')
                .get(function(req, res){
                    var id = req.params.id;
                    if(id){
                        sql.execute({
                                query:'select p.id, p.name, c.name as constituency, p.year from polls p join constituencies c on c.id = p.cons_id where p.id = @id and p.status = @status',
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
                .put(function(req, res){
                    var id = req.params.id;
                })
                .delete(function(req, res){
                    if(req.params.id && (req.query.level === 'A' || req.query.level === 'S')){
                        var id = req.params.id;
                        sql.execute({
                                query:'delete from polls where id = @id',
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
    
    return {router: pollingstationRouter, event: EventEmitter};
};

module.exports = routes;