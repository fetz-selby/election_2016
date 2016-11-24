angular.module('app')
.directive('rejectList',['approveFactory', function(agentFactory){
    return{
        restrict: 'E',
        replace : true,
        scope : {
            lists : '=',
            search : '='
        },
        templateUrl : 'views/widgets/reject-list.html',
        controller : function($scope, $element, $attrs, $location){         
            
            $scope.initPage = function(){
                
            }
            
           
        }
    }
}])