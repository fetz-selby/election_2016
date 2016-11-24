var express = require('express'),
    event = require('events').EventEmitter;

var routes = function(sql){
    var userRouter = express.Router(),
        EventEmitter = new event();
    
    
    userRouter.route('/')
                .get(function(req, res){
                sql.execute({
                            query:'select id,name,msisdn,email,level from users',
                            params:{}
                        }).then(function(results){
                            res.status(200).json(results);
                        }, function(err){
                            console.log(err);
                        }); 
                })
                .post(function(req, res){
                    if(req.query.level === 'S'){
                        if(req.query.mobile && req.query.user_password && req.query.user_email && req.query.name && req.query.user_level){
                            var name = req.query.name,
                                mobile = req.query.mobile,
                                password = req.query.user_password,
                                email = req.query.user_email,
                                level = req.query.user_level;
                        
                            sql.execute({
                                query:'insert into users (name,email,password,msisdn,level) values (@name, @email, @password, @mobile, @level)',
                                params:{
                                    name:{
                                        type: sql.VARCHAR,
                                        val: name
                                    },
                                    email:{
                                        type: sql.VARCHAR,
                                        val: email
                                    },
                                    password:{
                                        type: sql.VARCHAR,
                                        val: require('../service/utils').getHash(email+password)
                                    },
                                    mobile:{
                                        type: sql.VARCHAR,
                                        val: mobile
                                    },
                                    level:{
                                        type: sql.CHAR,
                                        val: level.toUpperCase()
                                    }
                                }
                            }).then(function(results){
                                res.status(200).json(results);
                                EventEmitter.emit('add');
                                
                                var levelStr = '';
                                if(level.toUpperCase() === 'U'){
                                    levelStr = 'a User';
                                }else if(level.toUpperCase() === 'A'){
                                    levelStr = 'an Administrator';
                                }else{
                                    levelStr = 'a User';
                                }
                                
                                sendMessage(mobile, email, levelStr, name, password);
                            }, function(err){
                                console.log(err);
                            });
                        }else{
                            res.status(400).send('required details not satisfied');
                        }   
                    }else{
                        res.status(400).send('Authorization required');
                    }
                })
    userRouter.route('/edit')
                .put(function(req, res){
        
                    if((req.query.level === 'A' || req.query.level === 'S') && (req.query.password == req.query.oldPassword)){
                        var id = req.query.userId,
                            email = req.query.email,
                            password = req.query.newPassword;
                        
                        sql.execute({
                            query:'update users set password = @password where id=@id',
                            params:{
                                password:{
                                    type: sql.VARCHAR,
                                    val: require('../service/utils').getHash(email+password)
                                },
                                id:{
                                    type: sql.INT,
                                    val: id
                                }
                            }
                        }).then(function(results){
                            res.status(200).send('success');
                            EventEmitter.emit('update', id);
                        }, function(err){
                            console.log(err);
                        });
                    }else{
                        res.status(400).send('Authorization required');
                    }
        
    })
    
    userRouter.route('/:id')
                .get(function(req, res){
                    var id = req.params.id;
                    if(req.query.level === 'S'){
                        sql.execute({
                            query:'select id,name,msisdn,email,level from users where id = @id',
                            params:{
                                id:{
                                    type:sql.INT,
                                    val:id
                                }
                            }
                        }).then(function(results){
                            res.status(200).json(results);
                        }, function(err){
                            console.log(err);
                        }); 
                    }else{
                        sql.execute({
                            query:'select id,name,msisdn,email,level from users where id = @id',
                            params:{
                                id:{
                                    type:sql.INT,
                                    val:req.session.user.id
                                }
                            }
                        }).then(function(results){
                            res.status(200).json(results);
                        }, function(err){
                            console.log(err);
                        });   
                    }
                })
                .delete(function(req, res){
                    if(req.query.level === 'S'){
                        var id = req.params.id;
                        sql.execute({
                            query:'delete from users where id = @id',
                            params:{
                                id:{
                                    type:sql.INT,
                                    val:req.session.user.id
                                }
                            }
                        }).then(function(results){
                            res.status(200).json(results);
                            EventEmitter.emit('delete');
                        }, function(err){
                            console.log(err);
                        }); 
                    }
                });
    
    return {router: userRouter, event: EventEmitter};
};

var sendMessage = function(msisdn, email, level, name, password){
    var smsDispatcher = require('../service/push_message')(),

        message = 'Welcome to Horus, '+name+'. You have been profiled as '+level+' and your username is '+email+', and your password is '+password+'. Thank you. Time '+new Date();
    
    smsDispatcher.event.on('success', function(){
        console.log('Message sent successfully.');
    });
    
    smsDispatcher.push(msisdn, message);
}

module.exports = routes;