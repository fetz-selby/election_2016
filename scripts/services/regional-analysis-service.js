angular.module('app')
.factory('regionalAnalysisFactory',['$http','$templateCache','userDetailService','config', function($http, $templateCache, userDetailService, config){
    var election = {};
    
    election.getRegionalAnalysis = function(year, regionId, lType){
        var http,
            params = {email: userDetailService.getEmail(), password: userDetailService.getPassword()},
            url = '';
            
        if(typeof year !== 'undefined' && typeof regionId !== 'undefined' && typeof lType !== 'undefined'){
            params = {year : year, regionId: regionId, type: lType, email: userDetailService.getEmail(), password: userDetailService.getPassword()};
            url = config.apiUrl+'regional_analysis';
        }        
        
        http = $http({method:'GET', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    election.getSingleRegionAnalysis = function(id){
         var http = $http({method:'GET', url:config.apiUrl+'regional_analysis/'+id, params: {email: userDetailService.getEmail(), password: userDetailService.getPassword()}})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    election.save = function(data){
         var http,
            params = data,
            url = config.apiUrl+'regional_analysis';  
        
        http = $http({method:'POST', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    }
    
    election.remove = function(id){
         var http,
            params = {email: userDetailService.getEmail(), password: userDetailService.getPassword()},
            url = config.apiUrl+'regional_analysis/'+id;
        
        http = $http({method:'DELETE', url:url, params: params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    }
    
    election.updateRegionalAnalysis = function(){
         var http,
            params = {email: userDetailService.getEmail(), password: userDetailService.getPassword()},
            url = config.apiUrl+'misc/auto_compute_regional';
        
        http = $http({method:'GET', url:url, params: params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    }
    
    return election;
}])