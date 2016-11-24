angular.module('app')
.factory('messageFactory',['$http','$templateCache', 'userDetailService','config',function($http, $templateCache, userDetailService, config){
    var election = {};
    
    election.getInbox = function(from, to){
        var http,
            params = {from: from, to: to, email: userDetailService.getEmail(), password: userDetailService.getPassword()},
            url = '';
        
        url = config.apiUrl+'inbox'
        
        http = $http({method:'GET', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    election.getOutbox = function(from, to){
         var http,
            params = {from: from, to: to, email: userDetailService.getEmail(), password: userDetailService.getPassword()},
            url = '';
        
        url = config.apiUrl+'outbox'
        
        http = $http({method:'GET', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    }
    
    election.sendMessage = function(userId, mobile, message){
         var http = $http({method:'POST', url:config.apiUrl+'outbox/', params: {mobile: mobile, message: message, email: userDetailService.getEmail(), password: userDetailService.getPassword()}})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    
    return election;
}])