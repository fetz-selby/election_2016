angular.module('app')
.directive('constituencyList', ['userDetailService', 'constituencyFactory', function(userDetailService, constituencyFactory){
    return{
        restrict: 'E',
        replace : true,
        scope : {
            constituencies : '=',
            search : '='
        },
        templateUrl : 'views/widgets/constituency-list.html',
        controller : function($scope, $element, $attrs, $location){
            //$scope.data = {};
           $scope.showConfirmation = function(id, state){
               swal({
                        title: '',
                        text: 'Are you sure you want to update the constituency state?',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, update it!',
                        closeOnConfirm: true
                    }, function() {
                        
                        if(state == true){
                            state = 'T';
                        }else{
                            state = 'F';
                        }
                        constituencyFactory.updateAutoCompute(id, state).then(function(data){
                            swal('Updated!', 'Constituency has been updated.', 'success'); 
                        })
                    });
            }
           
           $scope.initPage = function(){
               $scope.showUpdateButton = false;
               
               if(userDetailService.getLevel() === 'A' || userDetailService.getLevel() === 'S'){
                   $scope.showAutoCompute = true;
                   $scope.showUpdateButton = true;
               }else{
                   $scope.showAutoCompute = false;
               }
           }
           
           $scope.updateConstituencyAnalysis = function(){
               constituencyFactory.updateConstituencyAnalysis().then(function(data){
                   //Show message
               })
           }
           
        }
    }
}])