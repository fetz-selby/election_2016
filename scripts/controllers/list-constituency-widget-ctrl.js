angular.module('app')
.directive('listConstituencyWidget', ['constituencyFactory','yearFactory', function(constituencyFactory, yearFactory){
    return {
        restrict : 'E',
        replace : true,
        scope : {
            
        },
        templateUrl : 'views/constituency/list-constituency-widget.html',
        controller : function($scope, $element, $attrs, $location){
            $scope.query = '';
            $scope.year = {};
            $scope.years = [];
            $scope.constituencies = [];
            $scope.constituenciesLoaded = false;
            
            $scope.getConstituencies = function(){
                constituencyFactory.getConstituencies($scope.year.value).then(function(data){
                    $scope.constituencies = data;
                    $scope.constituenciesLoaded = true;
                    
                    return data;
                })
            }
            
            var loadYears = function(){
                yearFactory.getYears().then(function(data){
                    $scope.years = data;
                })
            }
            
            $scope.initPage = function(){
                loadYears();
            }
        }
    }
}])