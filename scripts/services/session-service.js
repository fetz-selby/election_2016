angular.module('app')
.factory('registerFactory', ['$http','userDetailService','config', function($http, userDetailService, config){
    var register = {};
    
    register.register = function(username, password){
        var http = $http({method: 'GET', url:config.baseUrl+'sessions/register', 
                          params:{email: username, password: password}})
        .then(function(response){
            console.log('Session successfully resgistered');
            if(response.data.length > 0){
                var user = response.data[0];
                userDetailService.setEmail(user.email);
                userDetailService.setPassword(password);
            }
        }, function(error){
            console.log('Error registering session');
        });
        
        return http;
    }
    
    register.logout = function(){
        var http = $http({method : 'GET',
                          url: config.baseUrl+'sessions/logout'})
        .then(function(response){
            console.log('Session ended successfully');
        }, function(error){
            console.log('Error ending session');
        });
        
        return http;
    }
    
    return register;
    
}]);