angular.module('app')
.directive('userList', function(){
    return{
        restrict: 'E',
        replace : true,
        scope : {
            users : '=',
            search : '='
        },
        templateUrl : 'views/widgets/user-list.html',
        controller : function($scope, $element, $attrs, $location){
            //$scope.data = {};
            $scope.showPopup = function(id){
                swal({
                        title: '',
                        text: 'Are you sure you want to remove the user?',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, remove it!',
                        closeOnConfirm: false
                    }, function() {
                        swal('Deleted!', 'User has been removed.', 'success');
                    });
            }
        }
    }
})