angular.module('login')
.factory('loginFactory',['$http','$templateCache','$cookies','config', function($http, $templateCache, $cookies, config){
    var election = {};
    
    election.getUser = function(email, password){
        console.log('details '+config.baseUrl);

        var http,
            params = {email: email, password: password},
            url = config.baseUrl+'sessions/register/';
        
        http = $http({method:'POST', url:url, params:params})
        .then(function(response){
            
            if(response.data.length === 1){
                $cookies.put('email', response.data[0].email);
                $cookies.put('password', response.data[0].password);
                $cookies.put('level', response.data[0].level);
                $cookies.put('name', response.data[0].name);
                $cookies.put('id', response.data[0].id);
                $cookies.put('mobile', response.data[0].msisdn);
            }
            
            return response.data;
            
        }, function(error){
            
        });
        
        return http;
    };
    
    
    return election;
}])