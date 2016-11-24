angular.module('app')
.factory('moduleFactory', function(){
    var app = {};
    
    var moduleTitle = 'Dashboard',
        userTitle = '';
    
    app.setModuleTitle = function(title){
        moduleTitle = title;
    }
    
    app.setUserTitle = function(username){
        userTitle = username;
    }
    
    app.getModuleTitle = function(){
        return moduleTitle;
    }
    
    app.getUserTitle = function(){
        return userTitle;
    }
    
    return app;
    
});