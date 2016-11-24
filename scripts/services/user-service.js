angular.module('app')
.factory('userFactory',['$http','$templateCache','userDetailService','config', function($http, $templateCache, userDetailService, config){
    var election = {};
    
    election.getUsers = function(){
         var http,
             params = {email: userDetailService.getEmail(), password: userDetailService.getPassword()},
             url = '';
        
        url = config.apiUrl+'users';

        
        http = $http({method:'GET', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
        
    };
    
    election.save = function(user){
         var http,
             params = {name: user.name, user_password: user.password, user_level: user.level, user_email: user.email, mobile: user.mobile, email: userDetailService.getEmail(), password: userDetailService.getPassword()},
             url = '';
        
        url = config.apiUrl+'users';

        
        http = $http({method:'POST', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
        
    };
    
    election.update = function(user){
         var http,
             params = {oldPassword: user.oldPassword, newPassword: user.newPassword, email: userDetailService.getEmail(), password: userDetailService.getPassword()},
             url = '';
        
        url = config.apiUrl+'users/edit';

        
        http = $http({method:'PUT', url:url, params:params})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
        
    };
    
    election.getUser = function(id){
        var url = '';
        
        if(userDetailService.getLevel() === 'A' || userDetailService.getLevel() === 'S'){
            url = config.apiUrl+'users/'+id;
        }else{
            url = config.apiUrl+'users/'+userDetailService.getId();
        }
        
        var http = $http({method:'GET', url:url, params:{email: userDetailService.getEmail(), password: userDetailService.getPassword()}})
        .then(function(response){
            return response.data;
        }, function(error){
            
        });
        
        return http;
    };
    
    
    return election;
}])