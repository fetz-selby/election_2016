angular.module('app')
.directive('addCandidateWidget', ['partyFactory','yearFactory', 'constituencyFactory','candidateFactory',function(partyFactory, yearFactory, constituencyFactory, candidateFactory){
    return {
        restrict : 'E',
        replace : true,
        scope : {
            
        },
        templateUrl : 'views/candidate/add-candidate-widget.html',
        controller : function($scope, $element, $attrs, $location){
            $scope.showConstituency = false;
            $scope.constituency = {};
            $scope.constituencies = [];
            $scope.year = {};
            $scope.years = [];
            $scope.party = {};
            $scope.parties = [];
            $scope.groupType = 'M';
            $scope.votes = 0;
            $scope.filename = '';
            
            var candidate = {};
            
            $scope.updateConstituencies = function(){
                constituencyFactory.getConstituencies($scope.year.value).then(function(data){
                    $scope.constituencies = data;
                    $scope.showConstituency = true;
                });
            }
            
            $scope.setConstituency = function(constituency){
                $scope.constituency = constituency;
            }
            
            var loadParties = function(){
                partyFactory.getParties().then(function(data){
                    $scope.parties = data;
                })
            }
            
            var loadYears = function(){
                yearFactory.getYears().then(function(data){
                    $scope.years = data;
                    loadParties();
                })
            }
            
            var showMessage = function(){
                 $.notify("Candidate Saved Successfully", {
                    className: 'success',
                    globalPosition: 'top right',
                    autoHideDelay: 10000,
                });
            }
            
            $scope.initPage = function(){
                loadYears();
            }
            
            var reset = function(){
                $scope.fname = '';
                $scope.lname = '';
                $scope.filename = '';
                $scope.party = {};
                $scope.year = {};
                $scope.constituency = {};
                $scope.votes = 0;
                candidate = {};
            }
            
            $scope.save = function(){
                console.log('cons_id : '+$scope.constituency.id);
                candidate = {partyId: $scope.party.id, constituencyId: $scope.constituency.id, year: $scope.year.value, name: $scope.fname +' '+ $scope.lname, type: $scope.groupType, votes: $scope.votes, filename: $scope.filename};
                
                candidateFactory.save(candidate).then(function(data){
                    reset();
                    showMessage();
                    console.log('Done saving!'); 
                });
            }
        }
    }
}])