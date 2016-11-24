angular.module('app')
.directive('addPartyWidget', ['partyFactory', function(partyFactory){
    return {
        restrict : 'E',
        replace : true,
        scope : {
            
        },
        templateUrl : 'views/party/add-party-widget.html',
        controller : function($scope, $element, $attrs, $location){
            $scope.party = {};
            $scope.logoPath = '';
            
            var reset = function(){
                $scope.party.name = '';
                $scope.party.path = '';
            }
            
             var showMessage = function(){
                 $.notify("Party Saved Successfully", {
                    className: 'success',
                    globalPosition: 'top right',
                    autoHideDelay: 10000,
                });
            }
            
            $scope.save = function(){
                console.log('name '+$scope.party.name+', path '+$scope.party.path);
                partyFactory.save($scope.party).then(function(data){
                    reset();
                    showMessage();
                });
            }
        }
    }
}])