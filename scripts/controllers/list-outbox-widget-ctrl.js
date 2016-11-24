angular.module('app')
.directive('listOutboxWidget', ['messageFactory','$filter', function(messageFactory, $filter){
    return {
        restrict : 'E',
        replace : true,
        scope : {
            
        },
        templateUrl : 'views/message/list-outbox-widget.html',
        controller : function($scope, $element, $attrs, $location){
            $scope.query = '';
            $scope.outboxs = [];
            $scope.outboxLoaded = false;
            
            $scope.getOutbox = function(){
                var from = $filter('date')($scope.from, 'yyyy-MM-dd');
                var to = $filter('date')($scope.to, 'yyyy-MM-dd');
                
                messageFactory.getOutbox().then(function(data){
                    $scope.outboxs = data;
                    $scope.outboxLoaded = true;
                    
                    return data;
                })
            }
            
            $scope.initPage = function(){
                
            }
        }
    }
}])