angular.module('app')
.controller('partyMainController', ['$scope','userDetailService', function($scope, userDetailService){
    $scope.moduleType = 'list';
    $scope.changeToShowParty = function(){
        $scope.moduleType = 'list';
    }
    
    $scope.changeToAddParty = function(){
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