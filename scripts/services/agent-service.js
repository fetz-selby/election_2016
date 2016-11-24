angular.module('app')
.factory('agentFactory',['$http','$templateCache','userDetailService','config', function($http, $templateCache, userDetailService, config){
    var election = {};
    
    election.getAgents = function(year){
         var http,
             params = {year : year, email: userDetailService.getEmail(), password: userDetailService.getPassword()},
             url = '';
        
//        if(userDetailService.getLevel() === 'A'){
//            url = 'http://localhost:8000/api/elections/agents/';
//        }else{
//            url = 'http://localhost:8000/api/elections/agents/'+userDetailService.getId();
//        }
        
        url = config.apiUrl+'agents';

        
        http = $http({method:'GET', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
        
    };
    
    election.getAgent = function(id){
        var url = '';
        
        if(userDetailService.getLevel() === 'A' || userDetailService.getLevel() === 'S'){
            url = config.apiUrl+'agents/'+id;
        }else{
            url = config.apiUrl+'agents/'+userDetailService.getId();
        }
        
        var http = $http({method:'GET', url:url, email: userDetailService.getEmail(), password: userDetailService.getPassword()})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
     election.save = function(agent){
        var http,
            params = {name: agent.name, msisdn: agent.mobile, pin: agent.agent_password, cons_id: agent.constituencyId, poll_id: agent.pollId, year: agent.year, email: userDetailService.getEmail(), password: userDetailService.getPassword()},
            url = '';
        
        url = config.apiUrl+'agents';

        http = $http({method:'POST', url:url, params:params})
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
        
        url = config.apiUrl+'agents/'+id;

        http = $http({method:'DELETE', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
        
    };
    
    
    return election;
}])