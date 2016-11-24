angular.module('app')
.factory('partyFactory',['$http','$templateCache','userDetailService','config', function($http, $templateCache, userDetailService, config){
    var election = {};
    
    election.getParties = function(){
        var http,
            params = {email: userDetailService.getEmail(), password: userDetailService.getPassword()},
            url = '';
        
        url = config.apiUrl+'parties'
        
        http = $http({method:'GET', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    election.save = function(party){
         var http,
            params = {name: party.name, logo_path: party.path, email: userDetailService.getEmail(), password: userDetailService.getPassword()},
            url = '';
        
        url = config.apiUrl+'parties'
        
        http = $http({method:'POST', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    }
    
    election.getParty = function(id){
         var http = $http({method:'GET', url:config.apiUrl+'parties/'+id, params:{email: userDetailService.getEmail(), password: userDetailService.getPassword()}})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    
    return election;
}])