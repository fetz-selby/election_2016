angular.module('app')
.directive('candidateList',['candidateFactory','userDetailService', function(candidateFactory, userDetailService){
    return{
        restrict: 'E',
        replace : true,
        scope : {
            candidates : '=',
            search : '='
        },
        templateUrl : 'views/widgets/candidate-list.html',
        controller : function($scope, $element, $attrs, $location){
            //$scope.data = {};
            $scope.showPopup = function(id, index){
                swal({
                        title: '',
                        text: 'Are you sure you want to remove the candidate?',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, remove it!',
                        closeOnConfirm: false
                    }, function() {
                        candidateFactory.remove(id).then(function(data){
                            removeItem(index);
                            swal('Deleted!', 'Candidate has been removed.', 'success');
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
                $scope.candidates.splice(index, 1);
            }
        }
    }
}])