angular.module('app')
.directive('approveList',['approveFactory', function(agentFactory){
    return{
        restrict: 'E',
        replace : true,
        scope : {
            lists : '=',
            search : '='
        },
        templateUrl : 'views/widgets/approve-list.html',
        controller : function($scope, $element, $attrs, $location){         
           
            
            $scope.initPage = function(){
                
            }
            
           
        }
    }
}])