angular.module('app')
.directive('addConstituencyWidget', ['yearFactory','parentConstituencyFactory','constituencyFactory', function(yearFactory, parentConstituencyFactory, constituencyFactory){
    return {
        restrict : 'E',
        replace : true,
        scope : {
            
        },
        templateUrl : 'views/constituency/add-constituency-widget.html',
        controller : function($scope, $element, $attrs, $location){
            $scope.constituencies = [];
            $scope.constituency = {};
            $scope.year = {};
            $scope.years = [];
            
            var constituency = {};
            var reset = function(){
                $scope.cons = '';
            } 
            
            var showMessage = function(){
                 $.notify("Constituency Saved Successfully", {
                    className: 'success',
                    globalPosition: 'top right',
                    autoHideDelay: 10000,
                });
            }
            
            $scope.cons = '';
            
            $scope.showConstituency = false;
            $scope.showYears = false;
            
            $scope.loadConstituencies = function(year, regionId){
                parentConstituencyFactory.getParentConstituencies().then(function(data){
                    $scope.constituencies = data;
                    $scope.showConstituency = true;
                });
            }
            
            $scope.loadYears = function(){
                yearFactory.getYears().then(function(data){
                    $scope.years = data;
                    $scope.showYears = true;
                });
            }
    
            $scope.setConstituency = function(constituency){
                $scope.constituency = constituency;
                $scope.cons = $scope.constituency.name;
            };
    
            $scope.setYear = function(year){
                $scope.year = year;
                $scope.loadConstituencies();
            }
            
            $scope.initPage = function(){
                $scope.loadYears();
            }
            
            $scope.save = function(){
                constituency = {name: $scope.constituency.name, parentId: $scope.constituency.id, year: $scope.year.value};
                constituencyFactory.save(constituency).then(function(data){
                    reset();
                    showMessage();
                    console.log('Done saving!');
                });
            }
        }
    }
}])