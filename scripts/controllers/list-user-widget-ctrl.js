angular.module('app')
.directive('listUserWidget', ['userFactory', function(userFactory){
    return {
        restrict : 'E',
        replace : true,
        scope : {
            
        },
        templateUrl : 'views/user/list-user-widget.html',
        controller : function($scope, $element, $attrs, $location){
            $scope.query = '';
            $scope.users = [];
            $scope.usersLoaded = false;
            
            $scope.getUsers = function(){
                userFactory.getUsers().then(function(data){
                    $scope.users = data;
                    $scope.usersLoaded = true;
                    
                    return data;
                })
            }
        }
    }
}])