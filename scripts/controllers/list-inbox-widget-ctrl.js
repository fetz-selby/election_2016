angular.module('app')
.directive('listInboxWidget', ['messageFactory','$filter','Pusher', function(messageFactory, $filter, Pusher){
    return {
        restrict : 'E',
        replace : true,
        scope : {
            
        },
        templateUrl : 'views/message/list-inbox-widget.html',
        controller : function($scope, $element, $attrs, $location){
            $scope.query = '';
            $scope.inboxs = [];
            $scope.inboxLoaded = false;
            
            Pusher.subscribe('inbox', 'updated', function(message){
                var currentDate = new Date($filter('date')(message.posted_ts, 'yyyy-MM-dd'));
                var appEndDate = new Date($filter('date')($scope.to, 'yyyy-MM-dd'));
                
                console.log('currentDate => '+currentDate+', appEndDate => '+appEndDate);
                
                if(appEndDate >= currentDate){
                    $scope.inboxs.push(message);
                }
            });
            
            $scope.getInbox = function(){
                //Format date correctly 'yyyy-MM-dd'
                //For testing purpose
//                var from = '1970-01-01';
//                var to = '2016-12-01';
                
               var from = $filter('date')($scope.from, 'yyyy-MM-dd');
               var to = $filter('date')($scope.to, 'yyyy-MM-dd');
                
                
                console.log('From => '+from+', to => '+to);
                messageFactory.getInbox(from, to).then(function(data){
                    
                    $scope.inboxs = data;
                    $scope.inboxLoaded = true;
                    
                    return data;
                })
            }
            
            $scope.initPage = function(){
                
            }
        }
    }
}])