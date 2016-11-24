var express = require('express'),
    event = require('events').EventEmitter;

var routes = function(sql){
    var sendMessage = express.Router(),
        EventEmitter = new event();
    
    var smsDispatcher = require('../service/sms_gateway');

    sendMessage.route('/')
                .get(function(req, res){
                    smsDispatcher.listAllMessages(res);
                })
                .post(function(req, res){
                    if(req.query.mobile && req.query.message){
                        var mobile = req.query.mobile,
                            message = req.query.message;
                        
                            
                            smsDispatcher.sendMessage(res,mobile, message); 
                    }
                })
    
    sendMessage.route('/:id')
                .get(function(req, res){
                    var id = req.params.id;
                    if(id){
                         sql.execute({
                                query:'select id,name from regions where id = @id',
                                params:{
                                    id:{
                                        type: sql.INT,
                                        val : id
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
            
    return {router: sendMessage, event: EventEmitter};
};

module.exports = routes;