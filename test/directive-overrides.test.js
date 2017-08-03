/* global window, document, require, QUnit */
var benv = require('benv');
var Q = require('q');

QUnit.module('angular directive overrides', {
  setup: function () {
    var defer = Q.defer();
    benv.setup(function () {
      defer.resolve();
    });
    return defer.promise;
  },
  teardown: function () {
    benv.teardown();
  }
});

QUnit.test('environment sanity check', function () {
  QUnit.object(window, 'window object exists');
  QUnit.object(document, 'document object exists');
});

QUnit.test('stop angular directive override', function () {
  var angular = benv.require('../bower_components/angular/angular.js', 'angular');
  benv.require('../stop-angular-overrides.js');

  angular.module('A1', []).directive('someDirective', function () {});

  QUnit.throws(function () {
    angular.module('A2', []).directive('someDirective', function () {});
  }, 'Error');
});

QUnit.test('default behavior is not changed for initial directive definition', function () {
  var angular = benv.require('../bower_components/angular/angular.js', 'angular');
  benv.require('../stop-angular-overrides.js');

  var module = angular.module('A', []);

  // initial definition
  module.directive('anotherDirective', function () {
    return {
      restrict: 'E',
      replace: true,
      template: '<div>Some Directive</div>'
    };
  });

  var $compile = angular.injector(['ng', 'A']).get('$compile');
  var $rootScope = angular.injector(['ng', 'A']).get('$rootScope');
  var $element = $compile('<another-directive></another-directive>')($rootScope);

  QUnit.equal($element[0].tagName, 'DIV');
});
