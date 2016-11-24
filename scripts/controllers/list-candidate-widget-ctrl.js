angular.module('app')
.directive('listCandidateWidget', ['candidateFactory','yearFactory', function(candidateFactory, yearFactory){
    return {
        restrict : 'E',
        replace : true,
        scope : {
            
        },
        templateUrl : 'views/candidate/list-candidate-widget.html',
        controller : function($scope, $element, $attrs, $location){
            $scope.query = '';
            $scope.candidates = [];
            $scope.year = {};
            $scope.years = [];
            $scope.candidatesLoaded = false;
            
            $scope.getCandidates = function(){
                candidateFactory.getCandidates($scope.year.value).then(function(data){
                    $scope.candidates = data;
                    $scope.candidatesLoaded = true;
                    
                    return data;
                });
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