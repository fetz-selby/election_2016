angular.module('app')
.directive('outboxList',  function(){
    return{
        restrict: 'E',
        replace : true,
        scope : {
            outboxs : '=',
            search : '='
        },
        templateUrl : 'views/widgets/outbox-list.html',
        controller : function($scope, $element, $attrs, $location){
            //$scope.data = {};
            $scope.showPopup = function(id){
                swal({
                        title: '',
                        text: 'Are you sure you want to remove the message?',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, remove it!',
                        closeOnConfirm: false
                    }, function() {
                        swal('Deleted!', 'Party has been removed.', 'success');
                    });
            }
              
            $scope.initPage = function(){
                
            }
        }
    }
})