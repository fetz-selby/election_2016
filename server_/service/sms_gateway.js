var request = require('request'),
    checker = 0;

exports.listAllMessages = function(sql){
    
    var devices = require('../sms_gateway_config')().devices;
   
    
    devices.forEach(function(device, i, arr){
        var url = 'http://smsgateway.me/api/v3/messages?email='+device.email+'&password='+device.password;
        
        request({
            uri: url,
            method: 'GET',
            json: true,
            
        }, function(error, response, body){
            //console.log('httpMessages => '+body.result);
            
            if(typeof body !== 'undefined'){
                loadFromDB(sql, body.result);
            }else{
                console.log('Poor internet connection');
            }
            
        });
    });
    
}
    
exports.sendMessage = function(res,msisdn, message){
        var options = require('../sms_gateway_config')().defaultConfig;
        var url = 'http://smsgateway.me/api/v3/messages/send?email='+options.email+'&password='+options.password+'&device='+options.device+'&number='+msisdn+'&message='+message;
        
         request({
            uri: url,
            method: 'POST',
            json: true,
            
        }, function(error, response, body){
             res.status(200).json(response);
        });
}

var localSendMessage = function(msisdn, message){
        var options = require('../sms_gateway_config')().defaultConfig;
        var url = 'http://smsgateway.me/api/v3/messages/send?email='+options.email+'&password='+options.password+'&device='+options.device+'&number='+msisdn+'&message='+message;
        
         request({
            uri: url,
            method: 'POST',
            json: true,
            
        }, function(error, response, body){
             //res.status(200).json(response);
             console.log('Reply sent !');
        });
}

var loadFromDB = function(sql, httpResults){
    if(httpResults !== null && Array.isArray(httpResults) && httpResults.length){

        if(checker == httpResults.length){
            console.log('No Message Change');
            return;
        }


        checker = httpResults.length;

        sql.execute({
                query:'select message_id from sms_gateway_messages where status = @status',
                    params:{
                        status:{
                            type: sql.CHAR,
                            val: 'A'
                        }
                    }
                }).then(function(results){
                    console.log('DB results size '+results.length);
                    var unsavedMessages = getUnsavedResults(httpResults, results);
                    if(unsavedMessages !== null){
                        loadToDB(sql, unsavedMessages);
                    }else{
                        console.log('Non Message Update');
                    }
                }, function(err){
                        console.log(err);
        }); 

    }else{
        console.log('HttpResults came empty');
    }
}

var getUnsavedResults = function(httpResults, dbResults){
    if(httpResults !== null && Array.isArray(httpResults)){
        var nonExist = [];

        httpResults.forEach(function(element, index, arr){
            var httpElement = element;
            var found = false;
            
            dbResults.forEach(function(dbElement, dbIndex, dbArr){
                if(parseInt(httpElement.id) === parseInt(dbElement.message_id)){
                    found = true;
                    return;
                }
            });
            
//            for(var i = 0; i < dbResults.length; i++){
//                var dbElement = dbResults[i];
//                
//                 if(parseInt(httpElement.id) === parseInt(dbElement.message_id)){
//                    found = true;
//                    break;
//                }
//            }
            
            if(!found){
                console.log('Pushed!!!');
                nonExist.push(httpElement);
            }
        });
        
        console.log('New Messages => '+nonExist.length);
        return nonExist;
    }else{
        return null;
    }
}

var loadToDB = function(sql, results){
    if(results !== null){
        var inboundMessages = [],
            infoRequests = [],
            formatRequests = [];
        
        results.forEach(function(element, index, arr){
            var messageId = element.id;
            var message = element.message;
            var postedTs = element.created_at;
            var fromMsisdn = element.contact.number;
            
            if(message.match(/[0-9a-zA-Z]{4,}[\s]+[(m|p)|(M|P)][\s]+([a-zA-Z]+[:][0-9]+[\s]*){2,}/)){
                inboundMessages.push(element);
                console.log('Passed regex => '+element.message);
            }else if(message.trim().toLowerCase() == 'info'){
                infoRequests.push(fromMsisdn);
            }else if(message.trim().toLowerCase() == 'help'){
                formatRequests.push(fromMsisdn);
            }
            
            sql.execute({
                query:'insert into sms_gateway_messages (message_id,message,from_msisdn,posted_ts,status) values (@messageId, @message, @fromMsisdn, @postedDate, @status)',
                    params:{
                        messageId:{
                            type: sql.INT,
                            val: messageId
                        },
                        message:{
                            type: sql.VARCHAR,
                            val: message
                        },
                        fromMsisdn:{
                            type: sql.VARCHAR,
                            val: fromMsisdn
                        },
                        postedDate:{
                            type: sql.DATE,
                            val: new Date()
                        },
                        status:{
                            type: sql.CHAR,
                            val: 'A'
                        }
                    }
                }).then(function(results){
                        prepareAndPushSMS(sql, messageId);
                }, function(err){
                        console.log(err);
                });
            });  
        
            //Parse if qualified for approve
            
            //[0-9a-zA-Z]{4,}[\s]+[(m|p)|(M|P)][\s]+([a-zA-Z]+[:][0-9]+[\s]*){2,}
        
            
            //Grep other details
            if(inboundMessages.length){
                //Declare container array
                var inboundArray = [],
                    counter = 0;
                
                //Loop over the regex passed inbound array
                
                inboundMessages.forEach(function(element, index, arr){
                    var msisdn = element.contact.number,
                        pin = element.message.split(/[\s*]/)[0].trim(),
                        type = element.message.split(/[\s*]/)[1].trim().toUpperCase(),
                        messageId = element.id;
                    
                    //Parse message
                    var messageTokens = element.message.split(/[\s*]/),
                        composedMessage = '';
                    
                    messageTokens.forEach(function(ele, index, arr){
                       if(!(index === 0 || index === 1)){
                           composedMessage += ele+' ';
                       } 
                    });
                    
                     sql.execute({
                        query:'select a.id as agent_id,a.cons_id,a.year,a.poll_id,r.id as region_id,a.msisdn from agents a join constituencies c on c.id = a.cons_id join parent_constituencies p on p.id = c.parent_id join regions r on r.id = p.region_id where a.status = @status and a.pin = @pin and a.msisdn like @msisdn',
                        params:{
                            msisdn:{
                                type: sql.VARCHAR,
                                val: '%'+msisdn+'%'
                            },
                            pin:{
                                type: sql.VARCHAR,
                                val: pin
                            },
                            status:{
                                type: sql.CHAR,
                                val: 'A'
                            }
                        }
                    }).then(function(results){
                        counter ++;
                         if(results.length){
                             var consId = results[0].cons_id,
                                 pollId = results[0].poll_id,
                                 regionId = results[0].region_id,
                                 agentId = results[0].agent_id,
                                 mobile = results[0].msisdn,
                                 year = results[0].year,
                                 inbound = {};
                             
                                console.log('consId => '+consId+', pollId => '+pollId+', regionId => '+regionId);
                             
                             inbound = {agentId : agentId, msisdn: mobile, regionId: regionId, pollId: pollId, consId: consId, message: composedMessage, year: year, type: type, messageId: messageId};
                             
                             inboundArray.push(inbound);
                             console.log('counter is '+counter+', arr is '+arr.length);
                             if(counter === arr.length){
                                counter = 0;
                                console.log('Started inserting ...');
                                doInboundInsert(sql, inboundArray);
                                console.log('Done inserting ...');
                             }
                             
                         }
                     }, function(err){
                        console.log(err);
                    });
                });
                
                //Do inserting of valid inbounds
                console.log('size of valid message => '+inboundArray.length);   
            }
        
            infoRequests.forEach(function(element, i, arr){
                sql.execute({
                query:'select name,poll_id,cons_id from agents where msisdn = @msisdn and status = @status',
                    params:{
                        msisdn:{
                            type: sql.VARCHAR,
                            val: element
                        },
                        status:{
                            type: sql.CHAR,
                            val: 'A'
                        }
                    }
                }).then(function(results){
                    if(results.length){
                        formatAndSendMessage(sql, results[0].name, results[0].poll_id, results[0].cons_id, element);
                    }
                }, function(err){
                        console.log(err);
                });
            })
            
            formatRequests.forEach(function(element, i, arr){
                var messageDispatcher = require('./push_message');
                messageDispatcher.push(element, 'Message format SHOULD follow: \n PIN M/P results \n Example: \n 0000 M AAPL:1200 GOOG:34435 YHOO:3223 DAX:32223 \n Time '+new Date());
            })
            
        console.log('Done inserting all '+results.length+' entries');
    }
}


var formatAndSendMessage = function(sql, name, pollId, consId, msisdn){
     sql.execute({
            query:'select name from polls where id = @id',
            params:{
                id:{
                    type: sql.INT,
                    val: pollId
                }
            }
        }).then(function(results){
            if(results.length){
                fetchForConstituency(sql, name, consId, results[0].name, msisdn);
            }
        }, function(err){
            console.log(err);
        });
}

var fetchForConstituency = function(sql, name, consId, pollname, msisdn){
    sql.execute({
            query:'select name from constituencies where id = @id',
            params:{
                id:{
                    type: sql.INT,
                    val: consId
                }
            }
        }).then(function(results){
            if(results.length){
                sendMessage(name, results[0].name, pollname, msisdn);
            }
        }, function(err){
            console.log(err);
        });
}

var sendMessage = function(name, consName, pollName, msisdn){
    var messageDispatcher = require('./push_message')();
    
    var message = 'Hello '+name+'. Your PIN is **** , and you have been stationed at '+pollName+' under the '+consName+' constituency. Thank you. Time '+new Date();
    
    messageDispatcher.push(msisdn, message);
}


var prepareAndPushSMS = function(sql, messageId){
    sql.execute({
        query:'select sgm.id,sgm.message_id,sgm.message,sgm.from_msisdn as sender,a.name,sgm.posted_ts from sms_gateway_messages sgm left join agents a on a.msisdn = sgm.from_msisdn where sgm.message_id = @messageId',
        params:{
            messageId:{
                type: sql.INT,
                val: messageId
            }
        }
    }).then(function(results){
        if(results.length){
            if(results[0].name === null){
                results[0].name = 'Unknown';
            }
                    
            var Pusher = require('../push_config');
            var pusher = Pusher.pusher();
            pusher.trigger('inbox', 'updated', results[0]);
            console.log('Pusher updated !!!');
        }
    }, function(err){
        console.log(err);
    });
}

var doInboundInsert = function(sql, results){
    results.forEach(function(element, index, arr){
                    sql.execute({
                        query:'insert into approve_list (msisdn,message,cons_id,poll_id,region_id,status,agent_id, posted_ts, type, year, message_id) values (@msisdn, @message, @consId, @pollId, @regionId, @status, @agentId, @postedTs, @type, @year, @messageId)',
                        params:{
                            msisdn:{
                                type: sql.VARCHAR,
                                val: element.msisdn
                            },
                            message:{
                                type: sql.VARCHAR,
                                val: element.message
                            },
                            consId:{
                                type: sql.INT,
                                val: element.consId
                            },
                            pollId:{
                                type: sql.INT,
                                val: element.pollId
                            },
                            regionId:{
                                type: sql.INT,
                                val: element.regionId
                            },
                            status:{
                                type: sql.CHAR,
                                val: 'P'
                            },
                            agentId:{
                                type: sql.INT,
                                val: element.agentId
                            },
                            postedTs:{
                                type: sql.DATE,
                                val: new Date()
                            },
                            type:{
                                type: sql.CHAR,
                                val: element.type
                            },
                            year:{
                                type: sql.VARCHAR,
                                val: element.year
                            },
                            messageId:{
                                type: sql.INT,
                                val: element.messageId
                            }
                        }
                    }).then(function(results){
                        console.log('One add ...');
                        prepareAndPushToApproveList(sql, element.messageId);
                        localSendMessage(element.msisdn, 'Your results has been received successfully and awaits for approval. Thank you!\n'+new Date());
                    }, function(err){
                        console.log(err);
                    });
    })
}

var prepareAndPushToApproveList = function(sql, messageId){
    sql.execute({
        query:'select a.id, r.id as region_id, ag.name as agent, r.name as region, c.name as constituency, p.name as poll, a.type, a.message, a.msisdn as mobile, a.year from approve_list a join constituencies c on c.id = a.cons_id join regions r on r.id = a.region_id join polls p on p.id = a.poll_id join agents ag on ag.id = a.agent_id where a.message_id = @messageId',
        params:{
            messageId:{
                type: sql.INT,
                val: messageId
            }
        }
    }).then(function(results){
        var Pusher = require('../push_config');
        var pusher = Pusher.pusher();
            pusher.trigger('approve_list', 'add', results[0]);
    }, function(err){
        console.log(err);
    });
}