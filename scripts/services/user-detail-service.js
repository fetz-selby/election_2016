angular.module('app')
.factory('userDetailService', function(){
    var userDetailService = {};
    var username = '',
        password = '',
        level = '',
        email = '',
        id = 0,
        mobile = '';
    
    userDetailService.getUsername = function(){
        return username;
    }
    
    userDetailService.getPassword = function(){
        return password;
    }
    
    userDetailService.getLevel = function(){
        return level;
    }
    
    userDetailService.getEmail = function(){
        return email;
    } 
    
    userDetailService.getId = function(){
        return id;
    }
    
     userDetailService.getMobile = function(){
        return mobile;
    }
    
    userDetailService.setUsername = function(tmpUsername){
        username = tmpUsername;
    }
    
    userDetailService.setPassword = function(tmpPassword){
        password = tmpPassword;
    }
    
    userDetailService.setLevel = function(tmpLevel){
        level = tmpLevel;
    }
    
    userDetailService.setEmail = function(tmpEmail){
        email = tmpEmail;
    }
    
    userDetailService.setMobile = function(tmpMobile){
        mobile = tmpMobile;
    }
     
    userDetailService.setId = function(tmpId){
        id = tmpId;
    }
    
    return userDetailService;
})