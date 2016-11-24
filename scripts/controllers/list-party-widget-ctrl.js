angular.module('app')
.directive('listPartyWidget', ['partyFactory', function(partyFactory){
    return {
        restrict : 'E',
        replace : true,
        scope : {
            
        },
        templateUrl : 'views/party/list-party-widget.html',
        controller : function($scope, $element, $attrs, $location){
            $scope.query = '';
            $scope.parties = [];
            $scope.partiesLoaded = false;
            
            $scope.getParties = function(){
                partyFactory.getParties().then(function(data){
                    $scope.parties = data;
                    $scope.partiesLoaded = true;
                    
                    return data;
                })
            }
        }
    }
}])