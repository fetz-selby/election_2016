

var service = function(){
    var request = require('request'),
        event = require('events').EventEmitter,
        EventEmitter = new event(),
        smsGatewayConfig = require('../sms_gateway_config')(),
        service = {},
        options = smsGatewayConfig.defaultConfig;
    
    var push = function(msisdn, message){
        var url = 'http://smsgateway.me/api/v3/messages/send?email='+options.email+'&password='+options.password+'&device='+options.device+'&number='+msisdn+'&message='+message;
        
         request({
            uri: url,
            method: 'POST',
            json: true,
            
        }, function(error, response, body){
             EventEmitter.emit('success');
        });
    }
    
    return {push: push, event: EventEmitter};
}

module.exports = service;