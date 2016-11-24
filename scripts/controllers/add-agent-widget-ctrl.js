angular.module('app')
.directive('addAgentWidget', ['constituencyFactory', 'pollFactory','yearFactory','agentFactory', function(constituencyFactory, pollFactory, yearFactory, agentFactory){
    return {
        restrict : 'E',
        replace : true,
        scope : {
            
        },
        templateUrl : 'views/agent/add-agent-widget.html',
        controller : function($scope, $element, $attrs, $location){
            $scope.year = {};
            $scope.years = [];
            $scope.constituency = {};
            $scope.constituencies = [];
            $scope.pollStations = [];
            $scope.pollStation = {};
            
            var agent = {};
            
            $scope.showConstituencies = false;
            $scope.showPollStations = false;
            $scope.showYears = false;
            
            var loadConstituencies = function(){
                   constituencyFactory.getConstituencies($scope.year.value).then(function(data){
                        $scope.constituencies = data;
                        $scope.showConstituencies = true;
                    }); 
                
            }
            
            var loadPollingStations = function(){
                    pollFactory.getPollingStationsFromConstituency($scope.year.value, $scope.constituency.id).then(function(data){
                        $scope.pollStations = data;
                        if($scope.pollStations.length > 0){
                            $scope.showPollStations = true;
                        }
                    });
                
            }
            
            var reset = function(){
                $scope.fname = '';
                $scope.lname = '';
                $scope.mobile = '';
                $scope.password = '';
                $scope.repassword = '';
            
                agent = {};
            }
            
            $scope.updateConstituencies = function(year){
                hideAll();
                $scope.year = year;
                loadConstituencies();
            }
            
            $scope.updatePollStations = function(constituency){
                $scope.constituency = constituency;
                loadPollingStations();
            }
            
            $scope.setPollStation = function(pollStation){
                $scope.pollStation = pollStation;
            }
            
            var loadYears = function(){
                yearFactory.getYears().then(function(data){
                    $scope.years = data;
                    $scope.showYears = true;
                });
            }
            
            var hideAll = function(){
                $scope.showConstituencies = false;
                $scope.showPollStations = false;
                $scope.showPollStations = false;
            }
            
            var showMessage = function(){
                 $.notify("Agent Saved Successfully", {
                    className: 'success',
                    globalPosition: 'top right',
                    autoHideDelay: 10000,
                });
            }
            
            $scope.save = function(){
                agent = {name: $scope.fname +' '+ $scope.lname, mobile: $scope.mobile, agent_password: $scope.password, constituencyId: $scope.constituency.id, pollId: $scope.pollStation.id, year: $scope.year.value}
                
                agentFactory.save(agent).then(function(data){
                    reset();
                    showMessage();
                    console.log('Done saving!');
                });
            }
            
            $scope.initPage = function(){
                loadYears();
            }
        }
    }
}])