angular.module('app')
.factory('constituencyFactory',['$http','$templateCache','userDetailService','config', function($http, $templateCache, userDetailService, config){
    var election = {};
    
    election.getConstituencies = function(year, region){
        
         var http,
            params = {email: userDetailService.getEmail(), password: userDetailService.getPassword()},
            url = '';
        
        if(typeof year !== 'undefined' && typeof region !== 'undefined'){
            params = {year : year, email: userDetailService.getEmail(), password: userDetailService.getPassword()};
            url = config.apiUrl+'constituencies/region/'+region;
        }else if(typeof year !== 'undefined'){
            params = {year : year, email: userDetailService.getEmail(), password: userDetailService.getPassword()};
            url = config.apiUrl+'constituencies';
        }
        
        http = $http({method:'GET', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    election.save = function(constituency){
        
         var http,
            params = {name: constituency.name, parentId: constituency.parentId, year: constituency.year, email: userDetailService.getEmail(), password: userDetailService.getPassword()},
            url = '';
                
        url = config.apiUrl+'constituencies';
        
        http = $http({method:'POST', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    election.updateAutoCompute = function(id, state){
        
         var http,
            params = {state: state, email: userDetailService.getEmail(), password: userDetailService.getPassword()},
            url = '';
                
        url = config.apiUrl+'constituencies/'+id;
        
        http = $http({method:'PUT', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    election.getConstituency = function(id){
         var http = $http({method:'GET', url:config.apiUrl+'constituencies/'+id, params:{email: userDetailService.getEmail(), password: userDetailService.getPassword()}})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    election.getConstituencyAnalysis = function(year, regionId){
        
         var http = $http({method:'GET', url:config.apiUrl+'constituencies/analysis', params:{year: year, regionId: regionId, email: userDetailService.getEmail(), password: userDetailService.getPassword()}})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    election.updateConstituencyAnalysis = function(){
        
         var http = $http({method:'GET', url:config.apiUrl+'misc/seatsetter', params:{email: userDetailService.getEmail(), password: userDetailService.getPassword()}})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    
    return election;
}])