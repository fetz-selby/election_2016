angular.module('app')
.controller('messageMainController', ['$scope', function($scope){
    $scope.moduleType = 'message';
    $scope.changeToNewMessage = function(){
        $scope.moduleType = 'message';
    }
    
    $scope.changeToInbox = function(){
        $scope.moduleType = 'inbox';
    }
    
    $scope.changeToOutbox = function(){
        $scope.moduleType = 'outbox';
    }
}])