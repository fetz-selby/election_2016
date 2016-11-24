angular.module('app')
.directive('addUserWidget', ['userFactory',function(userFactory){
    return {
        restrict : 'E',
        replace : true,
        scope : {
            
        },
        templateUrl : 'views/user/add-user-widget.html',
        controller: function($scope, $element, $attrs, $location){
            var user = {};
            
            var showMessage = function(){
                 $.notify("User Saved Successfully", {
                    className: 'success',
                    globalPosition: 'top right',
                    autoHideDelay: 10000,
                });
            }
            
            var reset = function(){
                $scope.fname = '';
                $scope.lname = '';
                $scope.email = '';
                $scope.password = '';
                $scope.mobile = '';
                $scope.level = '';
                $scope.repassword = '';
            }
            
            $scope.save = function(){
                user = {name : $scope.fname +' '+$scope.lname, email: $scope.email, password: $scope.password, level: $scope.level, mobile: $scope.mobile};
                userFactory.save(user).then(function(data){
                    reset();
                    showMessage();
                })
            }
        }
    }
}])