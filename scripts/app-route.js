angular.module('app')
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
	$routeProvider.when('/dashboard',{
		templateUrl: 'views/dashboard/dashboard-main.html',
		controller: 'dashboardCtrl'
	}).when('/agents', {
		templateUrl: 'views/agent/agent-main.html',
		controller: 'agentMainController'
	}).when('/candidates', {
		templateUrl: 'views/candidate/candidate-main.html',
		controller: 'candidateMainController'
	}).when('/users', {
        templateUrl: 'views/user/user-main.html',
        controller: 'userMainController'
    }).when('/constituencies', {
        templateUrl: 'views/constituency/constituency-main.html',
        controller: 'constituencyMainController'
    }).when('/poll_stations', {
        templateUrl: 'views/polling_station/pollstation-main.html',
        controller: 'pollstationMainController'
    }).when('/parties', {
        templateUrl: 'views/party/party-main.html',
        controller: 'partyMainController'
    }).when('/intelli_wasp', {
        templateUrl: 'views/intelli_wasp/intelli-main.html',
        controller: 'intelliMainController'
    }).when('/messages', {
        templateUrl: 'views/message/message-main.html',
        controller: 'messageMainController'
    }).when('/approve', {
        templateUrl: 'views/approve/approve-main.html',
        controller: 'approveMainController'
    }).otherwise({redirectTo: '/dashboard'});
        $locationProvider.html5Mode(true);
    
}]);