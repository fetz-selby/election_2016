angular.module('app')
.directive('editUserWidget', ['userFactory','userDetailService',function(userFactory,userDetailService){
    return {
        restrict : 'E',
        replace : true,
        scope : {
            
        },
        templateUrl : 'views/user/edit-user-widget.html',
        controller: function($scope, $element, $attrs, $location){
            var user = {};
            $scope.name = userDetailService.getUsername();
            $scope.email = userDetailService.getEmail();
            $scope.mobile = userDetailService.getMobile();
            
            var showMessage = function(message, info){
                 $.notify(message, {
                    className: info,
                    globalPosition: 'top right',
                    autoHideDelay: 10000,
                });
            }
            
            var reset = function(){
                $scope.oldPassword = '';
                $scope.password = '';
                $scope.repassword = '';
            }
            
            $scope.save = function(){
                user = {oldPassword: $scope.oldPassword, newPassword: $scope.password};
                userFactory.update(user).then(function(data){
                    if(data == 'success'){
                        showMessage('User Updated Successfully', 'success');
                        reset();
                    }else{
                        showMessage('Failed to Update', 'danger');
                    }
                })
            }
        }
    }
}])