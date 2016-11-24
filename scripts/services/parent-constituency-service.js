angular.module('app')
.factory('parentConstituencyFactory',['$http','$templateCache','config', function($http, $templateCache, config){
    var election = {};
    
    election.getParentConstituencies = function(region){
        
         var http,
            params = {},
            url = '';
        
        if(typeof region !== 'undefined'){
            params = {email: userDetailService.getEmail(), password: userDetailService.getPassword()};
            url = config.apiUrl+'parent_constituencies/region/'+region;
        }else{
            params = {email: userDetailService.getEmail(), password: userDetailService.getPassword()};
            url = config.apiUrl+'parent_constituencies';
        }
        
        http = $http({method:'GET', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    election.getParentConstituency = function(id){
         var http = $http({method:'GET', url:config.apiUrl+'parent_constituencies/'+id, params: {email: userDetailService.getEmail(), password: userDetailService.getPassword()}})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    
    return election;
}])