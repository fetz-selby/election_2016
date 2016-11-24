
 var request = require('request'),
        event = require('events').EventEmitter,
        EventEmitter = new event();


var service = function(){
   

    var push = function(msisdn, message){
        if(msisdn.indexOf('+') != 0){
            msisdn = '+'+msisdn;
        }

        var options = require('../sms_gateway_config')().defaultConfig;
        var url = 'http://smsgateway.me/api/v3/messages/send?email='+options.email+'&password='+options.password+'&device='+options.device+'&number='+msisdn+'&message='+message;
        
         request({
            uri: url,
            method: 'POST',
            json: true,
            
        }, function(error, response, body){
            console.log('MSISDN => '+msisdn+', MESSAGE => '+message);
            EventEmitter.emit('success');
        });

    }
    
    return {push: push, event: EventEmitter};
}

module.exports = service;