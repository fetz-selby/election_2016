angular.module('app')
.directive('regionalAnalysisWidget',['regionFactory','regionalAnalysisFactory','computedRegionsFactory','userDetailService','yearFactory', function(regionFactory, regionalAnalysisFactory, computedRegionsFactory, userDetailService, yearFactory){
    return{
        restrict: 'E',
        replace : true,
        scope : {
            
        },
        templateUrl : 'views/intelli_wasp/regional-analysis-widget.html',
        controller : function($scope, $element, $attrs, $location){
            //$scope.data = {};
            $scope.regions = [];
            $scope.region = {};
            $scope.autoCompute = false;
            $scope.regionsData = [];
            $scope.isDataLoaded = false;
            $scope.addOneVisibility = 'add one';
            $scope.type = 'P';
            $scope.year = {};
            $scope.years = [];
            
            var loadYears = function(){
                yearFactory.getYears().then(function(data){
                    $scope.years = data;
                })
            }
            
            var showMessage = function(){
                 $.notify("Analysis Updated Successfully", {
                    className: 'success',
                    globalPosition: 'top right',
                    autoHideDelay: 10000,
                });
            }
            
            $scope.initPage = function(){
                $scope.getRegions();
                loadYears();
                if(userDetailService.getLevel() === 'A' || userDetailService.getLevel() === 'S'){
                    $scope.showRemove = true;
                }else{
                    $scope.showRemove = false;
                }
            }
            
            $scope.updateRegionalAnalysis = function(){
                regionalAnalysisFactory.updateRegionalAnalysis().then(function(){
                   showMessage(); 
                });
            }
            
            $scope.getRegions = function(){
                regionFactory.getRegions().then(function(data){
                    $scope.regions = data;
                });
            }
            
            $scope.showAutoComputePopup = function(){
                swal({
                        title: '',
                        text: 'Auto compute will replace ALL entries with system computed values. Do you still want to continue?',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, go ahead!',
                        closeOnConfirm: true
                    }, function() {
                        swal('Auto Compute Started!', 'Auto compute is initiated.', 'success');
                        //Send auto compute call
                    });
            }
            
            $scope.showRemovePopup = function(id){
                swal({
                        title: '',
                        text: 'Do you want to delete the regional analysis row?',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, go ahead!',
                        closeOnConfirm: true
                    }, function() {   
                        regionalAnalysisFactory.remove(id).then(function(data){
                            swal('Deleted!', 'Regional Analysis row deleted', 'success');
                        });
                        //Send auto compute call
                    });
            }
            
            $scope.loadRegionAnalysisData = function(){
                if($scope.region.id){
                    regionalAnalysisFactory.getRegionalAnalysis($scope.year.value, $scope.region.id, $scope.type).then(function(data){
                        $scope.regionsData = data;
                        $scope.isDataLoaded = true;
                    });
                }
            }
            
            $scope.updateComputedRegions = function(){
                computedRegionsFactory.getComputedRegions($scope.region.id).then(function(data){
                    if(data.size > 0 && data[0].is_computed === 'T'){
                        $scope.autoCompute = false;
                    }else{
                        $scope.autoCompute = true;
                    }
                })
            }
            
            $scope.toggle = function(){
                if($scope.addOneVisibility === 'add one'){
                    $scope.addOneVisibility = 'hide';
                }else{
                    $scope.addOneVisibility = 'add one';
                }
            }
        }
    }
}])