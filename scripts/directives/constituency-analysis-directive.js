angular.module('app')
.directive('constituencyAnalysisWidget',['regionFactory', 'yearFactory','constituencyFactory','userDetailService',function(regionFactory, yearFactory, constituencyFactory, userDetailService){
    return{
        restrict: 'E',
        replace : true,
        scope : {
            
        },
        templateUrl : 'views/intelli_wasp/constituency-analysis-widget.html',
        controller : function($scope, $element, $attrs, $location){
            $scope.year = {};
            $scope.years = [];
            $scope.showUpdater = false;
            
            $scope.region = {};
            $scope.regions = [];
            
            $scope.showRegions = false;
            $scope.isDataLoaded = false;
            
            $scope.type = 'Parliamentary';
            
            var loadYears = function(){
                yearFactory.getYears().then(function(data){
                    $scope.years = data;
                })
            }
            
            var loadRegions = function(){
                regionFactory.getRegions().then(function(data){
                    $scope.regions = data;
                    $scope.showRegions = true;
                })
            }
            
            var showMessage = function(){
                 $.notify("Constituency Seats Updated Successfully", {
                    className: 'success',
                    globalPosition: 'top right',
                    autoHideDelay: 10000,
                });
            }
            
            $scope.updateSeat = function(){
                constituencyFactory.updateConstituencyAnalysis().then(function(data){
                    showMessage();
                });
            }
            
            $scope.initPage = function(){
                loadYears();
                loadRegions();
                
                if(userDetailService.getLevel() === 'A' || userDetailService.getLevel() === 'S'){
                    $scope.showUpdater = true;
                }else{
                    $scope.showUpdater = false;
                }
            }
            
            $scope.getConstituencyAnalysis = function(){
                console.log('region => '+$scope.region.id+', year => '+$scope.year.value);
                constituencyFactory.getConstituencyAnalysis($scope.year.value, $scope.region.id).then(function(data){
                    $scope.constituenciesData = data;
                    $scope.isDataLoaded = true;
                });
            }
        }
    }
}])