angular.module('app')
.controller('pollstationMainController', ['$scope', 'userDetailService', function($scope, userDetailService){
    $scope.moduleType = 'list';
    $scope.changeToShowPollstation = function(){
        $scope.moduleType = 'list';
    }
    
    $scope.changeToAddPollstation= function(){
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