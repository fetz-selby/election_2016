angular.module('app')
.directive('rejectWidget', ['approveFactory','yearFactory','regionFactory','Pusher', function(approveFactory,yearFactory,regionFactory,Pusher){
    return {
        restrict : 'E',
        replace : true,
        scope : {
            
        },
        templateUrl : 'views/approve/rejected-widget.html',
        controller : function($scope, $element, $attrs, $location){
            $scope.regions = [];
            $scope.region = {};
            $scope.years = [];
            $scope.year = {};
            $scope.listsLoaded = false;
            
            var loadYears = function(){
                yearFactory.getYears().then(function(data){
                    $scope.years = data;
                });
            }
            
            var loadRegions = function(){
                regionFactory.getRegions().then(function(data){
                    $scope.regions = data;
                })
            }
            
            Pusher.subscribe('approve_rejected', 'add', function(rejectedItem){
                var currentYear = parseInt($scope.year.value),
                    itemYear = parseInt(rejectedItem.year);
                                
                if(currentYear === itemYear && (parseInt(rejectedItem.region_id) == $scope.region.id)){
                    $scope.list.push(rejectedItem);
                    showMessage('New Rejected Item Added', 'info');
                }
            });
            
            $scope.initPage = function(){
                loadYears();
                loadRegions();
            }
            
            $scope.getAllRejectedList = function(){
                console.log('year => '+$scope.year.value+', region => '+$scope.region.id);
                approveFactory.getAllRejectedList($scope.region.id, $scope.year.value).then(function(data){
                    
                    //Change all M to Parliamentary and P to Presidential
                    for(var i = 0; i < data.length; i++){
                        var element = data[i];
                        if(element.type === 'M'){
                            element.type = 'Parliamentary';
                        }else if(element.type === 'P'){
                            element.type = 'Presidential';
                        }
                    }
                    
                    $scope.lists = data;
                    $scope.listsLoaded = true;
                })
            }
        }
    }
}])