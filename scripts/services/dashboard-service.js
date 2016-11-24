angular.module('app')
.factory('dashboardFactory',['$http','$templateCache','userDetailService','config', function($http, $templateCache, userDetailService, config){
    var election = {};
    
    election.getTotalConstituencies = function(){
        var http,
            params = {email: userDetailService.getEmail(), password: userDetailService.getPassword()},
            url = config.apiUrl+'constituencies/counts';
        
        http = $http({method:'GET', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    election.getTotalAgents = function(){
        var http,
            params = {email: userDetailService.getEmail(), password: userDetailService.getPassword()},
            url = config.apiUrl+'agents/counts';
        
        http = $http({method:'GET', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    election.getTotalPendingApprove = function(){
        var http,
            params = {email: userDetailService.getEmail(), password: userDetailService.getPassword()},
            url = config.apiUrl+'approve/pending/counts';
        
        http = $http({method:'GET', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    election.getTotalRejectedApprove = function(){
        var http,
            params = {email: userDetailService.getEmail(), password: userDetailService.getPassword()},
            url = config.apiUrl+'approve/rejected/counts';
        
        http = $http({method:'GET', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    election.getTotalApproved = function(){
        var http,
            params = {email: userDetailService.getEmail(), password: userDetailService.getPassword()},
            url = config.apiUrl+'approve/approved/counts';
        
        http = $http({method:'GET', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
     election.getTotalPollingStations = function(){
        var http,
            params = {email: userDetailService.getEmail(), password: userDetailService.getPassword()},
            url = config.apiUrl+'pollingstations/counts';
        
        http = $http({method:'GET', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    election.getTotalAutoComputeConstituencies = function(){
        var http,
            params = {email: userDetailService.getEmail(), password: userDetailService.getPassword()},
            url = config.apiUrl+'constituencies/auto_compute/counts';
        
        http = $http({method:'GET', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    election.getTotalCandidates = function(){
        var http,
            params = {email: userDetailService.getEmail(), password: userDetailService.getPassword()},
            url = config.apiUrl+'candidates/counts';
        
        http = $http({method:'GET', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    
    return election;
}])