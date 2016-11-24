angular.module('login')
.controller('loginController', ['$scope','$location','$window','loginFactory', function($scope, $location, $window, loginFactory){
    $scope.submitForm = function(){
        console.log($scope.email+' '+$scope.password);
        //$location.path = 'admin.html';
        
        loginFactory.getUser($scope.email, $scope.password).then(function(data){
            if(data.length){
                $window.location.href = 'admin.html';
            }else{
                showMessage();
            }
        })
        //$window.location.href = 'admin.html';
    }
    
    var showMessage = function(){
        $.notify("Bad Username or Password", {
                    className: 'danger',
                    globalPosition: 'top right',
                    autoHideDelay: 10000,
        });
    }
    
    $scope.initPage = function(){
        
    }
}]);