angular.module('app')
.directive('editCandidateWidget', ['candidateFactory',function(candidateFactory){
    return {
        restrict : 'E',
        replace : true,
        scope : {
            
        },
        templateUrl : 'views/candidate/edit-candidate-widget.html',
        controller: function($scope, $element, $attrs, $location){
            $scope.candidate = {};
            $scope.candidatesLoaded = false;
            
            $scope.getCandidate = function(){
                candidateFactory.getCandidate($scope.id).then(function(data){
                    if(data.length){
                        $scope.candidate = data[0];
                        $scope.candidatesLoaded = true;
                    }
                })
            }
        }
    }
}])