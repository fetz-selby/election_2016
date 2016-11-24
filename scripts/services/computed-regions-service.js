angular.module('app')
.factory('computedRegionsFactory',['$http','$templateCache','userDetailService','config', function($http, $templateCache, userDetailService, config){
    var election = {};
    
    election.getComputedRegions = function(regionId){
        var http,
            params = {email: userDetailService.getEmail(), password: userDetailService.getPassword()},
            url = '';
        
        if(typeof regionId !== 'undefined'){
            url = config.apiUrl+'computed_regions/region/'+regionId;
        }else{
            url = config.apiUrl+'computed_regions/';
        }
        
        
        http = $http({method:'GET', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    election.getComputedRegion = function(id){
         var http = $http({method:'GET', url:config.apiUrl+'computed_regions/'+id, params:{email: userDetailService.getEmail(), password: userDetailService.getPassword()}})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    
    return election;
}])