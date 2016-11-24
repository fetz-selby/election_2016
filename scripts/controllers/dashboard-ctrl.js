angular.module('app')
.controller('dashboardCtrl', ['$scope','dashboardFactory',function($scope, dashboardFactory){
    $scope.totalConstituencies = 0;
    $scope.totalPollingStations = 0;
    $scope.totalApproved = 0;
    $scope.totalPending = 0;
    $scope.totalRejected = 0;
    $scope.totalCandidates = 0;
    $scope.totalAgents = 0;
    
    $scope.totalSMSRemaining = 50000;
    $scope.totalAutoComputeConstituencies = 0;
    
    var getTotalConstituencies = function(){
        dashboardFactory.getTotalConstituencies().then(function(data){
            $scope.totalConstituencies = data[0].counts;
        })
    }
    
    var getTotalPollingStations = function(){
        dashboardFactory.getTotalPollingStations().then(function(data){
            $scope.totalPollingStations = data[0].counts;
        })
    }
    
    var getTotalApproved = function(){
        dashboardFactory.getTotalApproved().then(function(data){
            $scope.totalApproved = data[0].counts;
        })
    }
    
    var getTotalPending = function(){
        dashboardFactory.getTotalPendingApprove().then(function(data){
            $scope.totalPending = data[0].counts;
        })
    }
    
    var getTotalRejected = function(){
        dashboardFactory.getTotalRejectedApprove().then(function(data){
            $scope.totalRejected = data[0].counts;
        })
    }
    
    var getTotalCandidates = function(){
        dashboardFactory.getTotalCandidates().then(function(data){
            $scope.totalCandidates = data[0].counts;
        })
    }
    
    var getTotalAgents = function(){
        dashboardFactory.getTotalAgents().then(function(data){
            $scope.totalAgents = data[0].counts;
        })
    }
    
    var getTotalAutoComputedConstituencies = function(){
        dashboardFactory.getTotalAutoComputeConstituencies().then(function(data){
            $scope.totalAutoComputeConstituencies = data[0].counts;
        })
    }
    
    $scope.initPage = function(){
        getTotalConstituencies();
        getTotalPollingStations();
        getTotalApproved();
        getTotalPending();
        getTotalRejected();
        getTotalCandidates();
        getTotalAgents();
        getTotalAutoComputedConstituencies();
    }
}])