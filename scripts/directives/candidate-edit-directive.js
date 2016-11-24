angular.module('app')
.directive('candidateEdit', ['candidateFactory',function(candidateFactory){
    return{
        restrict: 'E',
        replace : true,
        scope : {
            candidate : '=',
            visibility : '='
        },
        templateUrl : 'views/widgets/candidate-edit.html',
        controller : function($scope, $element, $attrs, $location){
            $scope.filename = $scope.candidate.avatar_path;
            $scope.votes = $scope.candidate.votes;
            
            $scope.showPopup = function(){
                swal({
                        title: '',
                        text: 'Are you sure you want to update the candidate?',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, update it!',
                        closeOnConfirm: false
                    }, function() {
                        updateCandidate();
                        reset();
                        swal('Updated!', 'Candidate has been updated.', 'success');
                    });
            }
            
            var updateCandidate = function(){
                $scope.candidate.votes = $scope.votes;
                $scope.candidate.avatar_path = $scope.filename;
                
                candidateFactory.update($scope.candidate).then(function(data){
                    showMessage();
                })
            }
            
            var reset = function(){
                $scope.visibility = false;
                $scope.votes = 0;
                $scope.filename = '';
                //$scope.candidate = {};
            }
            
            var showMessage = function(){
                 $.notify("Candidate Updated Successfully", {
                    className: 'success',
                    globalPosition: 'top right',
                    autoHideDelay: 10000,
                });
            }
        }
    }
}])