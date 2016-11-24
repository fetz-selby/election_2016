angular.module('app')
.directive('newMessageWidget', ['messageFactory', 'userDetailService','dashboardFactory', function(messageFactory, userDetailService, dashboardFactory){
    return{
        restrict: 'E',
        replace : true,
        scope : {
            
        },
        templateUrl : 'views/widgets/new-message.html',
        controller : function($scope, $element, $attrs, $location){
            //$scope.data = {};
            $scope.isBroadcast = false;
            $scope.agentCount = 0;
            $scope.mobile = '';
            
            $scope.showBroadcastView = function(){
                $scope.isBroadcast = true;
            }
            
            $scope.initPage = function(){
                dashboardFactory.getTotalAgents().then(function(data){
                    $scope.agentCount = data[0].counts;
                })
            }
            
            var showMessage = function(){
                 $.notify("Message Sent Successfully", {
                    className: 'success',
                    globalPosition: 'top right',
                    autoHideDelay: 10000,
                });
            }
            
            var reset = function(){
                $scope.mobile = '';
                $scope.message = '';
            }
            
            $scope.showSingleView = function(){
                $scope.isBroadcast = false;
            }
            
            $scope.sendMessage = function(){
                if(!$scope.isBroadcast){
                    console.log('UserId '+userDetailService.getId()+', Mobile '+$scope.mobile+', Message '+$scope.message);
                    messageFactory.sendMessage(userDetailService.getId(),$scope.mobile, $scope.message).then(function(data){
                        showMessage();
                        reset();
                    })
                }else{
                    
                }
            }
        }
    }
}])