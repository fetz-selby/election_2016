angular.module('app')
.controller('userMainController', ['$scope', 'userDetailService', function($scope, userDetailService){
    $scope.moduleType = 'list';
    $scope.changeToShowUsers = function(){
        $scope.moduleType = 'list';
    }
    
    $scope.changeToAddUser = function(){
        $scope.moduleType = 'add';
    }
    
    $scope.changeToUserEdit = function(){
        $scope.moduleType = 'edit';
    }
    
    $scope.initPage = function(){
        if(userDetailService.getLevel() === 'S'){
            $scope.showAdd = true;
        }else{
            $scope.showAdd = false;
        }
    }
}])