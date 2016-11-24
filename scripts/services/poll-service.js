angular.module('app')
.factory('pollFactory',['$http','$templateCache','userDetailService','config', function($http, $templateCache, userDetailService, config){
    var election = {};
    
    election.getPollingStationsFromRegion = function(year, region){
        var http,
            params = {},
            url = '';
          
            params = {year : year, email: userDetailService.getEmail(), password: userDetailService.getPassword()};
            url = config.apiUrl+'pollingstations/region/'+region+'/';
        
        http = $http({method:'GET', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    election.remove = function(id){
        var http,
            params = {},
            url = '';
          
            params = {email: userDetailService.getEmail(), password: userDetailService.getPassword()};
            url = config.apiUrl+'pollingstations/'+id;
        
        http = $http({method:'DELETE', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    election.getPollingStationsFromConstituency = function(year, constituencyId){
        var http,
            params = {},
            url = '';
        
            params = {year : year, email: userDetailService.getEmail(), password: userDetailService.getPassword()};
            url = config.apiUrl+'pollingstations/constituency/'+constituencyId+'/';
        
        http = $http({method:'GET', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    election.save = function(poll){
         var http,
            params = {name: poll.name, cons_id: poll.consId, year: poll.year, email: userDetailService.getEmail(), password: userDetailService.getPassword()},
            url = '';
        
        url = config.apiUrl+'pollingstations/'
        
        
        http = $http({method:'POST', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    election.getConstituency = function(id){
         var http = $http({method:'GET', url:config.apiUrl+'pollingstations/'+id, params: {email: userDetailService.getEmail(), password: userDetailService.getPassword()}})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    
    return election;
}])