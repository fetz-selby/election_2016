angular.module('app')
.directive('addPollstationWidget', ['constituencyFactory', 'yearFactory', 'pollFactory',function(constituencyFactory, yearFactory, pollFactory){
    return {
        restrict : 'E',
        replace : true,
        scope : {
            
        },
        templateUrl : 'views/polling_station/add-pollstation-widget.html',
        controller : function($scope, $element, $attrs, $location){
            $scope.year = {};
            $scope.years = [];
            $scope.constituency = {};
            $scope.constituencies = [];
            
            $scope.showConstituency = false;
            $scope.showYears = false;
            $scope.disablePollField = true;
            
            var poll = {};
            
            var reset = function(){
                $scope.pollname = '';
            }
            
             var showMessage = function(){
                 $.notify("Polling Station Saved Successfully", {
                    className: 'success',
                    globalPosition: 'top right',
                    autoHideDelay: 10000,
                });
            }
                        
            $scope.loadYears = function(){
                yearFactory.getYears().then(function(data){
                    $scope.years = data;
                    $scope.showYears = true;
                })
            }
            
            $scope.updateConstituencies = function(year){
                $scope.year = year;
                constituencyFactory.getConstituencies($scope.year.value).then(function(data){
                    $scope.constituencies = data;
                    $scope.showConstituency = true;
                });
            }
    
            $scope.setConstituency = function(constituency){
                $scope.constituency = constituency;
                $scope.disablePollField = false;
            }
            
            $scope.save = function(){
                console.log('name '+$scope.pollname+', cons_id '+$scope.constituency.id+', year '+$scope.year.value);
                poll = {name: $scope.pollname, consId: $scope.constituency.id, year: $scope.year.value};
                
                pollFactory.save(poll).then(function(){
                    reset();
                    showMessage();
                    console.log('Done saving!');
                })
            }
        }
    }
}])