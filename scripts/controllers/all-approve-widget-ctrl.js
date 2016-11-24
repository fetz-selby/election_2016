angular.module('app')
.directive('allApproveWidget', ['approveFactory','yearFactory','regionFactory','Pusher', function(approveFactory, yearFactory, regionFactory, Pusher){
    return {
        restrict : 'E',
        replace : true,
        scope : {
            
        },
        templateUrl : 'views/approve/all-approve-widget.html',
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
            
            var removeItem = function(index){
                $scope.list.splice(index, 1);
            }
            
            var showMessage = function(message, color){
                 $.notify(message, {
                    className: color,
                    globalPosition: 'top right',
                    autoHideDelay: 10000,
                });
            }
            
            Pusher.subscribe('approve_list', 'add', function(approveListItem){
                var currentYear = parseInt($scope.year.value),
                    itemYear = parseInt(approveListItem.year);
                                
                if(currentYear === itemYear && (parseInt(approveListItem.region_id) == $scope.region.id)){
                    $scope.list.push(approveListItem);
                    showMessage('New Approve Item Added', 'info');
                }
            });
            
            Pusher.subscribe('approve_change', 'add', function(id){
               for(var i = 0; i < $scope.list.length; i++){
                   var element = $scope.list[i];
                   if(element.id == id){
                       removeItem(i);
                       showMessage('Approve List Updated', 'success');
                   }
               }
            });
            
            $scope.initPage = function(){
                loadYears();
                loadRegions();
            }
            
            $scope.getAllPendingList = function(){
                console.log('year => '+$scope.year.value+', region => '+$scope.region.id);
                approveFactory.getAllPendingList($scope.region.id, $scope.year.value).then(function(data){
                    
                    //Change all M to Parliamentary and P to Presidential
                    for(var i = 0; i < data.length; i++){
                        var element = data[i];
                        if(element.type === 'M'){
                            element.type = 'Parliamentary';
                        }else if(element.type === 'P'){
                            element.type = 'Presidential';
                        }
                    }
                    
                    $scope.list = data;
                    $scope.listsLoaded = true;
                })
            }
        }
    }
}])