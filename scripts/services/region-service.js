angular.module('app')
.factory('regionFactory',['$http','$templateCache','userDetailService','config', function($http, $templateCache, userDetailService, config){
    var election = {};
    
    election.getRegions = function(){
        var http,
            params = {email: userDetailService.getEmail(), password: userDetailService.getPassword()},
            url = config.apiUrl+'regions/';
        
        http = $http({method:'GET', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    election.getRegion = function(id){
         var http = $http({method:'GET', url:config.apiUrl+'regions/'+id, params: {email: userDetailService.getEmail(), password: userDetailService.getPassword()}})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    
    return election;
}])