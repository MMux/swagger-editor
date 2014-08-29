'use strict';

function load(fileContent) {

  // Figure out file type
  var json = null;
  var yaml = null;
  try {
    json = JSON.parse(fileContent);
  } catch (jsonError) {}
  if (!json) {
    try {
      yaml = jsyaml.load(fileContent);
    } catch (yamlError) {}
  }

  if (json) {
    return json;
  }
  if (typeof yaml === 'object') {
    return yaml;
  }
  return null;
}

PhonicsApp.service('FileLoader', function FileLoader($http) {

  // Load from URL
  this.loadFromUrl = function (url) {
    return $http.get(url).then(function (resp) {
      return load(resp.data);
    });
  };

  // Load from Local file content (string)
  this.load = load;
});
