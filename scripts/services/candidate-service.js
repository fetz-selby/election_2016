angular.module('app')
.factory('candidateFactory',['$http','userDetailService','config', function($http, userDetailService, config){
    var election = {};
    
    election.getCandidates = function(year){
         var http,
             params = {year: year, email: userDetailService.getEmail(), password: userDetailService.getPassword()},
             url = '';
        
        url = config.apiUrl+'candidates';

        
        http = $http({method:'GET', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
        
    };
    
     election.save = function(candidate){
         var http,
             params = {name: candidate.name, cons_id: candidate.constituencyId, year: candidate.year, type: candidate.type, party_id: candidate.partyId, votes: candidate.votes, avatar_path: candidate.filename, email: userDetailService.getEmail(), password: userDetailService.getPassword()},
             url = '';
        
        url = config.apiUrl+'candidates';

        
        http = $http({method:'POST', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
        
    };
    
    election.update = function(candidate){
         var http,
             params = {filename: candidate.avatar_path, votes: candidate.votes, avatar_path: candidate.filename, email: userDetailService.getEmail(), password: userDetailService.getPassword()},
             url = '';
        
        url = config.apiUrl+'candidates/'+candidate.id;

        
        http = $http({method:'PUT', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
        
    };
    
    election.remove = function(id){
         var http,
             params = {email: userDetailService.getEmail(), password: userDetailService.getPassword()},
             url = '';
        
        url = config.apiUrl+'candidates/'+id;

        
        http = $http({method:'DELETE', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
        
    };
    
    election.getAllCandidates = function(){
         var http,
             params = {email: userDetailService.getEmail(), password: userDetailService.getPassword()},
             url = '';
        
        url = config.apiUrl+'candidates/all';

        
        http = $http({method:'GET', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
        
    };
    
    election.getCandidate = function(id){
        var url = '';
        
        url = config.apiUrl+'candidates/'+id;
        
        var http = $http({method:'GET', url:url, params:{email: userDetailService.getEmail(), password: userDetailService.getPassword()}})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    
    return election;
}])