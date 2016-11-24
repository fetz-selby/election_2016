angular.module('app')
.directive('approveWidget', ['approveFactory','yearFactory','regionFactory','Pusher', function(approveFactory,yearFactory,regionFactory, Pusher){
    return {
        restrict : 'E',
        replace : true,
        scope : {
            
        },
        templateUrl : 'views/approve/approved-widget.html',
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
            
            Pusher.subscribe('approve_approved', 'add', function(approveListItem){
                var currentYear = parseInt($scope.year.value),
                    itemYear = parseInt(approveListItem.year);
                                
                if(currentYear === itemYear && (parseInt(approveListItem.region_id) == $scope.region.id)){
                    $scope.list.push(approveListItem);
                    showMessage('New Approve Item Added', 'info');
                }
            });
            
            $scope.initPage = function(){
                loadYears();
                loadRegions();
            }
            
            $scope.getAllApprovedList = function(){
                console.log('year => '+$scope.year.value+', region => '+$scope.region.id);
                approveFactory.getAllApprovedList($scope.region.id, $scope.year.value).then(function(data){
                    
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