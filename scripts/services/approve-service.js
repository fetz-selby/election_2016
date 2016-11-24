angular.module('app')
.factory('approveFactory',['$http','userDetailService','config', function($http, userDetailService, config){
    var election = {};
    
    election.getAllPendingList = function(regionId, year){
        var http,
            params = {email: userDetailService.getEmail(), password: userDetailService.getPassword(), regionId: regionId, year: year},
            url = config.apiUrl+'approve/pending';
        
        http = $http({method:'GET', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    election.getAllApprovedList = function(regionId, year){
        var http,
            params = {email: userDetailService.getEmail(), password: userDetailService.getPassword(), regionId: regionId, year: year},
            url = config.apiUrl+'approve/approved';
        
        http = $http({method:'GET', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    election.getAllRejectedList = function(regionId, year){
        var http,
            params = {email: userDetailService.getEmail(), password: userDetailService.getPassword(), regionId: regionId, year: year},
            url = config.apiUrl+'approve/rejected';
        
        http = $http({method:'GET', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    election.reject = function(id){
        var http,
            params = {email: userDetailService.getEmail(), password: userDetailService.getPassword()},
            url = config.apiUrl+'approve/rejected/'+id;
        
        http = $http({method:'PUT', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    election.approve = function(id){
        var http,
            params = {email: userDetailService.getEmail(), password: userDetailService.getPassword()},
            url = config.apiUrl+'approve/approved/'+id;
        
        http = $http({method:'PUT', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    return election;
}])