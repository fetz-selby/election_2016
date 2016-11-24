angular.module('app')
.directive('allApproveList',['approveFactory','userDetailService', function(approveFactory, userDetailService){
    return{
        restrict: 'E',
        replace : true,
        scope : {
            list : '=',
            search : '='
        },
        templateUrl : 'views/widgets/all-approve-list.html',
        controller : function($scope, $element, $attrs, $location){         
             
            $scope.showApprovePopup = function(id, index){
                swal({
                        title: '',
                        text: 'Are you sure you want to approve this result?',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, approve it!',
                        closeOnConfirm: true
                    }, function() {
                        approveFactory.approve(id).then(function(data){
                            showMessage();
                            //removeItem(index);
                            //swal('Approved!', 'Result has been approved.', 'success');
                        })
                    });
            }
            
            $scope.showRejectPopup = function(id, index){
                swal({
                        title: '',
                        text: 'Are you sure you want to reject this result?',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, reject it!',
                        closeOnConfirm: true
                    }, function() {
                        approveFactory.reject(id).then(function(data){
                            showMessage();
                            removeItem(index);
                            swal('Rejected!', 'Result has been rejected.', 'success');
                            
                        })
                    });
            }
            
            $scope.initPage = function(){
                if(userDetailService.getLevel() === 'A' || userDetailService.getLevel() === 'S'){
                    $scope.showAction = true;
                }else{
                    $scope.showAction = false;
                }
            }
            
             var removeItem = function(index){
                $scope.list.splice(index, 1);
            }
            
            var showMessage = function(){
                 $.notify("Results Updated Successfully", {
                    className: 'success',
                    globalPosition: 'top right',
                    autoHideDelay: 10000,
                });
            }
        }
    }
}])