angular.module('app')
.controller('constituencyMainController', ['$scope','userDetailService', function($scope, userDetailService){
    $scope.moduleType = 'list';
    $scope.changeToShowConstituency = function(){
        $scope.moduleType = 'list';
    }
    
    $scope.changeToAddConstituency = function(){
        $scope.moduleType = 'add';
    }
    
    $scope.initPage = function(){
        if(userDetailService.getLevel() === 'A' || userDetailService.getLevel() === 'S'){
            $scope.showAdd = true;
        }else{
            $scope.showAdd = false;
        }
    }
}])