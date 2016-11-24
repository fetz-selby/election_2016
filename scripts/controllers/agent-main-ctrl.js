angular.module('app')
.controller('agentMainController', ['$scope', 'moduleFactory', 'moduleName','userDetailService', function($scope, moduleFactory, moduleName, userDetailService){
    $scope.moduleType = 'list';
    
    $scope.changeToShowAgent = function(){
        $scope.moduleType = 'list';
    }
    
    $scope.changeToAddAgent = function(){
        $scope.moduleType = 'add';
    }
    
    $scope.initPage = function(){
        moduleFactory.setModuleTitle('Agent');
        if(userDetailService.getLevel() === 'A' || userDetailService.getLevel() === 'S'){
            $scope.showAdd = true;
        }else{
            $scope.showAdd = false;
        }
    }
}]);