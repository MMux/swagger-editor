'use strict';

PhonicsApp.controller('UrlImportCtrl', function FileImportCtrl($scope, $modalInstance, FileLoader, $localStorage, Storage, Editor, FoldManager) {
  var results;

  $scope.url = null;

  $scope.fetch = function (url) {
    if (typeof url === 'string' && url.indexOf('http') > -1) {
      FileLoader.loadFromUrl(url).then(function (data) {
        results = data;
        $scope.canImport = true;
      }, function (error) {
        $scope.error = error;
        $scope.canImport = false;
      });
    }
  };

  $scope.ok = function () {
    if (typeof results === 'object') {
      Editor.setValue(results);
      Storage.save('specs', results);
      FoldManager.reset();
    }
    $modalInstance.close();
  };

  $scope.cancel = $modalInstance.close;
});
