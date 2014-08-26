'use strict';

PhonicsApp.controller('HeaderCtrl', [
  '$scope',
  'Editor',
  'Storage',
  'Splitter',
  'Builder',
  '$modal',
  '$stateParams',
  'defaults',
  HeaderCtrl
]);

function HeaderCtrl($scope, Editor, Storage, Splitter, Builder, $modal, $stateParams, defaults) {

  if ($stateParams.path) {
    $scope.breadcrumbs  = [{ active: true, name: $stateParams.path }];
  } else {
    $scope.breadcrumbs  = [];
  }

  $scope.showFileMenu = function () {
    return !defaults.disableFileMenu;
  };

  $scope.newProject = function () {
    Editor.setValue('');
    Storage.reset();
  };

  $scope.assignDownloadHrefs = function () {
    assignDownloadHrefs($scope, Storage);
  };

  $scope.generateZip = function (type, kind) {
    var urlTemplate = _.template(defaults.apiGenUrl);
    var url = urlTemplate({type: type, kind: kind});
    var specs = jsyaml.load(Editor.getValue());

    getZipFile(url, specs);
  };

  $scope.togglePane = function (side) {
    Splitter.toggle(side);
  };

  $scope.isPaneVisible = function (side) {
    return Splitter.isVisible(side);
  };

  $scope.openImportFile = function () {
    $modal.open({
      templateUrl: 'templates/file-import.html',
      controller: 'FileImportCtrl',
      size: 'large'
    });
  };

  $scope.openImportUrl = function () {
    $modal.open({
      templateUrl: 'templates/url-import.html',
      controller: 'UrlImportCtrl',
      size: 'large'
    });
  };

  $scope.openAboutEditor = function () {
    $modal.open({
      templateUrl: 'templates/editor-about.html',
      controller: 'UrlImportCtrl',
      size: 'large'
    });
  };

  $scope.openExamples = function () {
    $modal.open({
      templateUrl: 'templates/open-examples.html',
      controller: 'OpenExamplesCtrl',
      size: 'large'
    });
  };

  function assignDownloadHrefs($scope, Storage) {
    var MIME_TYPE = 'text/plain';

    Storage.load('specs').then(function (specs) {
      // JSON
      var json = angular.toJson(specs, true);
      var jsonBlob = new Blob([json], {type: MIME_TYPE});
      $scope.jsonDownloadHref = window.URL.createObjectURL(jsonBlob);
      $scope.jsonDownloadUrl = [MIME_TYPE, 'spec.json', $scope.jsonDownloadHref].join(':');

      // YAML
      var yamlBlob = new Blob([jsyaml.dump(specs)], {type: MIME_TYPE});
      $scope.yamlDownloadHref = window.URL.createObjectURL(yamlBlob);
      $scope.yamlDownloadUrl = [MIME_TYPE, 'spec.yaml', $scope.yamlDownloadHref].join(':');
    });

  }

  function getZipFile(url, json) {
    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      url: url,
      data: angular.toJson(json),
      processData: false
    }).then(function (data) {
      if (data instanceof Object && data.code) {
        window.location = defaults.downloadZipUrl + data.code;
      }
    });
  }
}
