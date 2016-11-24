angular.module('app')
.directive('nationalAnalysisWidget',['nationalAnalysisFactory','yearFactory', function(nationalAnalysisFactory, yearFactory){
    return{
        restrict: 'E',
        replace : true,
        scope : {
            
        },
        templateUrl : 'views/intelli_wasp/national-analysis-widget.html',
        controller : function($scope, $element, $attrs, $location){
            $scope.year = {};
            $scope.years = [];
            
            var loadYears = function(){
                yearFactory.getYears().then(function(data){
                    $scope.years = data;
                });
            }
            
            $scope.loadNationalAnalysis = function(){
                nationalAnalysisFactory.getNationalAnalysis($scope.year.value, $scope.type).then(function(data){
                    $scope.lists = data;
                    $scope.isDataLoaded = true;
                })
            }
            
            $scope.initPage = function(){
                loadYears();
            }
        }
    }
}])