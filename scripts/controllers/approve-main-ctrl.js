angular.module('app')
.controller('approveMainController',['$scope', function($scope){
    $scope.module = 'all';
    
    $scope.initPage = function(){
        
    }
    
    $scope.changeToShowAll = function(){
        $scope.module = 'all';
    }
    
    $scope.changeToShowApproved = function(){
        $scope.module = 'approve';
    }
    
    $scope.changeToShowRejected = function(){
        $scope.module = 'reject';
    }
}])