angular.module('app')
.directive('listPollstationWidget', ['pollFactory','regionFactory', 'yearFactory', function(pollFactory, regionFactory, yearFactory){
    return {
        restrict : 'E',
        replace : true,
        scope : {
            
        },
        templateUrl : 'views/polling_station/list-pollstation-widget.html',
        controller : function($scope, $element, $attrs, $location){
            $scope.query = '';
            $scope.pollstations = [];
            $scope.pollstationsLoaded = false;
            $scope.regions = [];
            $scope.region = {};
            $scope.years = [];
            $scope.showRegions = false;
            
            $scope.initPage = function(){
                loadYears();
                loadRegions();
            }
            
            var loadRegions = function(){
                regionFactory.getRegions().then(function(data){
                    $scope.regions = data;
                    $scope.showRegions = true;
                })
            }
            
            var loadYears = function(){
                yearFactory.getYears().then(function(data){
                    $scope.years = data;
                })
            }
            
            $scope.getPollingStations = function(){
                console.log('region id => '+$scope.region.id+', and year => '+$scope.year.value);
                pollFactory.getPollingStationsFromRegion($scope.year.value, $scope.region.id).then(function(data){
                    $scope.pollstations = data;
                    $scope.pollstationsLoaded = true;
                    
                    return data;
                })
            }
        }
    }
}])