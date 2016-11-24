angular.module('app')
.factory('nationalAnalysisFactory',['$http','$templateCache','userDetailService','config', function($http, $templateCache, userDetailService, config){
    var election = {};
    
    election.getNationalAnalysis = function(year, type){
         var http,
            params = {year: year, type: type, email: userDetailService.getEmail(), password: userDetailService.getPassword()},
            url = config.apiUrl+'national_analysis/';
        
        http = $http({method:'GET', url:url, params: params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    }
    
    return election;
}])