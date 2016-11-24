angular.module('app')
.directive('pollstationList', ['pollFactory','userDetailService',function(pollFactory, userDetailService){
    return{
        restrict: 'E',
        replace : true,
        scope : {
            pollstations : '=',
            search : '='
        },
        templateUrl : 'views/widgets/pollstation-list.html',
        controller : function($scope, $element, $attrs, $location){
            //$scope.data = {};
            $scope.showPopup = function(id, index){
                swal({
                        title: '',
                        text: 'Are you sure you want to remove the polling station?',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, remove it!',
                        closeOnConfirm: false
                    }, function() {
                        pollFactory.remove(id).then(function(data){
                            swal('Deleted!', 'Polling Station has been removed.', 'success');
                            removeItem(index);
                            //$scope.items = $filter('filter')($scope.items, {name: '!ted'})
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
                $scope.pollstations.splice(index, 1);
            }
        }
    }
}])