angular.module('app')
.controller('menuController', ['moduleName', '$scope', function(moduleName, $scope){
    
    $scope.initPage = function(){
        $scope.moduleName = 'Monkey';
    }
}]);