angular.module('app')
.controller('candidateMainController', ['$scope','userDetailService',function($scope, userDetailService){
    $scope.moduleType = 'list';
    $scope.changeToShowCandidate = function(){
        $scope.moduleType = 'list';
    }
    
    $scope.changeToAddCandidate = function(){
        $scope.moduleType = 'add';
    }
    
    $scope.changeToEditCandidate = function(){
        $scope.moduleType = 'edit';
    }
    
    $scope.initPage = function(){
        if(userDetailService.getLevel() === 'A' || userDetailService.getLevel() === 'S'){
            $scope.showAdd = true;
            $scope.showEdit = true;
        }else{
            $scope.showAdd = false;
            $scope.showEdit = false;
        }
    }
}])