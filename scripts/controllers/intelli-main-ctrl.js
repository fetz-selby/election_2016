angular.module('app')
.controller('intelliMainController',['$scope', function($scope){
    $scope.moduleType = 'ca';
    
    $scope.changeToRegionalAnalysis = function(){
        $scope.moduleType = 'ra';
    }
    
    $scope.changeToNationalAnalysis = function(){
        $scope.moduleType = 'na';
    }
    
    $scope.changeToConstituencyAnalysis = function(){
        $scope.moduleType = 'ca';
    }
    
}]);