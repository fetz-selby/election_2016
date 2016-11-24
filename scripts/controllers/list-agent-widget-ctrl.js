angular.module('app')
.directive('listAgentWidget', ['agentFactory', 'yearFactory',function(agentFactory, yearFactory){
    return {
        restrict : 'E',
        replace : true,
        scope : {
            
        },
        templateUrl : 'views/agent/list-agent-widget.html',
        controller : function($scope, $element, $attrs, $location){
            $scope.query = '';
            $scope.agents = [];
            $scope.agentsLoaded = false;
            $scope.year = {};
            $scope.years = [];
            
            var loadYears = function(){
                yearFactory.getYears().then(function(data){
                    $scope.years = data;
                })
            }
            
            $scope.getAgents = function(){
                agentFactory.getAgents($scope.year.value).then(function(data){
                    $scope.agents = data;
                    $scope.agentsLoaded = true;
                    
                    return data;
                })
            }
            
            $scope.initPage = function(){
                loadYears();
            }            
        }
    }
}])