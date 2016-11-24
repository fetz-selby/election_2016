angular.module('app')
.controller('registerCtrl', ['$scope','registerFactory','moduleFactory', 'userDetailService','$cookies', '$window', function($scope, registerFactory, moduleFactory, userDetailService, $cookies, $window){
    //Hard code credentials
    var username = 'fetz.selby@gmail.com',
        password = 'hello';
    
    $scope.initPage = function(){
         
        if($cookies.get('email') && $cookies.get('password')){
            userDetailService.setEmail($cookies.get('email'));
            userDetailService.setPassword($cookies.get('password'));
            userDetailService.setLevel($cookies.get('level'));
            userDetailService.setUsername($cookies.get('name'));
            userDetailService.setId($cookies.get('id'));
            userDetailService.setMobile($cookies.get('mobile'));
                        
            $scope.userName = userDetailService.getUsername();
        }
        
        
        if($cookies.get('level') === 'A' || $cookies.get('level') === 'S'){
            $scope.showUsersMenu = true;
        }else{
            $scope.showUsersMenu = false;
        }
    }
    
    $scope.logout = function(){
        $cookies.remove('email');
        $cookies.remove('password');
        $cookies.remove('level');
        $cookies.remove('name');
        
        $window.location.href = '/index.html';
    }
    
    //$scope.moduleName = moduleName;
    $scope.moduleName = moduleFactory.getModuleTitle();
    //$scope.moduleTitle = moduleName;
}])