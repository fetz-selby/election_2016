angular.module('app')
.factory('yearFactory',['$http','$templateCache','userDetailService','config', function($http, $templateCache, userDetailService, config){
    var election = {};
    
    election.getYears = function(){
        var http,
            params = {email: userDetailService.getEmail(), password: userDetailService.getPassword()},
            url = config.apiUrl+'years/';
        
        http = $http({method:'GET', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    
    return election;
}])