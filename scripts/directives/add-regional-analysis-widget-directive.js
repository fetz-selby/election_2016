angular.module('app')
.directive('addRegionalAnalysis', ['partyFactory','yearFactory','regionalAnalysisFactory', function(partyFactory, yearFactory, regionalAnalysisFactory){
    return{
        restrict: 'E',
        replace : true,
        scope : {
            regionId : '=',
            saveDone : '='
        },
        templateUrl : 'views/intelli_wasp/add-regional-analysis-widget.html',
        controller : function($scope, $element, $attrs, $location){
            $scope.parties = [];
            $scope.party = {};
            $scope.years = [];
            $scope.year = {};
            $scope.votes = 0;
            $scope.type = 'P';
            $scope.saveDone = false;
            
            var data = {};
            
            $scope.getParties = function(){
                partyFactory.getParties().then(function(data){
                    $scope.parties = data;
                });
            }
            
            $scope.getYears = function(){
                yearFactory.getYears().then(function(data){
                   $scope.years = data; 
                });
            }
            
            var reset = function(){
                $scope.votes = 0;
                $scope.party = {};
                $scope.year = {};
            }
            
            $scope.saveRegionalAnalysis = function(){
                data = {regionId: $scope.regionId, partyId:$scope.party.id, year:$scope.year.value, votes: $scope.votes, type: $scope.type};
                console.log('regionId = '+data.regionId+', partyId = '+data.partyId+', yearVal = '+data.year+', votes = '+data.votes);
                if(isValid(data)){
                    regionalAnalysisFactory.save(data).then(function(data){
                        $scope.saveDone = true;
                        reset();
                        showMessage();
                    });
                }
                
            }
            
            var showMessage = function(){
                 $.notify("Regional Analysis added Successfully", {
                    className: 'success',
                    globalPosition: 'top right',
                    autoHideDelay: 10000,
                });
            }
            
            var isValid = function(data){
                if(data.regionId > 0 && data.partyId > 0 && data.year && data.votes > -1){
                    return true;
                }
            }
            
            $scope.initPage = function(){
                $scope.getYears();
                $scope.getParties();
                
                $scope.parties = [];
                $scope.party = {};
                $scope.years = [];
                $scope.year = {};
                $scope.votes = 0;
                $scope.saveDone = false;
                data = {};
            }
        }
    }
}])