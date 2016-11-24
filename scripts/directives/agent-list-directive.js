angular.module('app')
.directive('agentList',['agentFactory','userDetailService', function(agentFactory, userDetailService){
    return{
        restrict: 'E',
        replace : true,
        scope : {
            agents : '=',
            search : '='
        },
        templateUrl : 'views/widgets/agent-list.html',
        controller : function($scope, $element, $attrs, $location){         
             
            $scope.showPopup = function(id, index){
                swal({
                        title: '',
                        text: 'Are you sure you want to remove the agent?',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, remove it!',
                        closeOnConfirm: true
                    }, function() {
                        agentFactory.remove(id).then(function(data){
                            removeItem(index);
                            swal('Deleted!', 'Agent has been removed.', 'success');
                        })
                    });
            }
            
            $scope.initPage = function(){
                if(userDetailService.getLevel() === 'A' || userDetailService.getLevel() === 'S'){
                    $scope.showRemove = true;
                }else{
                    $scope.showRemove = false;
                }
            }
            
            var removeItem = function(index){
                $scope.agents.splice(index, 1);
            }
           
        }
    }
}])