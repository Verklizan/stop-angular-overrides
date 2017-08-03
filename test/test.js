/* global window, document, require, QUnit */
var benv = require('benv');
var Q = require('q');

QUnit.module('angular overrides', {
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

QUnit.test('loading angular', function () {
  var angular = benv.require('../bower_components/angular/angular.js', 'angular');
  QUnit.equal(typeof angular, 'object', 'loaded angular');
  QUnit.func(angular.module, 'angular.module is an object');
});

QUnit.test('angular.bind', function () {
  var angular = benv.require('../bower_components/angular/angular.js', 'angular');
  QUnit.func(angular.bind, 'angular.bind is a function');
  var foo = {
    name: 'foo',
    getName: function () {
      return this.name;
    }
  };
  var name = angular.bind(foo, foo.getName);
  QUnit.equal(name(), foo.name);
});

QUnit.test('stop angular override', function () {
  var angular = benv.require('../bower_components/angular/angular.js', 'angular');
  benv.require('../stop-angular-overrides.js');

  var first = angular.module('AngularOverrideTest', []);
  QUnit.equal(angular.module('AngularOverrideTest'), first, 'AngularOverrideTest -> first module');

  QUnit.throws(function () {
    angular.module('AngularOverrideTest', []);
  }, 'Error');
});

QUnit.test('stop angular controller override', function () {
  var angular = benv.require('../bower_components/angular/angular.js', 'angular');
  benv.require('../stop-angular-overrides.js');

  angular.module('AngularOverrideControllerTest', []).controller('controller', function () {});

  QUnit.throws(function () {
    angular.module('AngularOverrideControllerTest', []).controller('controller', function () {});
  }, 'Error');
});

QUnit.test('stop angular filter override', function () {
  var angular = benv.require('../bower_components/angular/angular.js', 'angular');
  benv.require('../stop-angular-overrides.js');

  angular.module('AngularOverrideFilterTest', []).filter('f', function () {});

  QUnit.throws(function () {
    angular.module('AngularOverrideFilterTest', []).filter('f', function () {});
  }, 'Error');
});

QUnit.test('stops controller overrides with undefined', function () {
  var angular = benv.require('../bower_components/angular/angular.js', 'angular');
  benv.require('../stop-angular-overrides.js');

  var module = angular.module('AngularOverrideControllerUndefinedTest', []);

  module.controller('aController', function () {});

  QUnit.throws(function() {
    module.controller('aController');
  }, 'Error');
});

QUnit.test('stops filter overrides with undefined', function () {
  var angular = benv.require('../bower_components/angular/angular.js', 'angular');
  benv.require('../stop-angular-overrides.js');

  var module = angular.module('AngularOverrideFilterUndefinedTest', []);
  module.filter('aFilter', function () { });

  QUnit.throws(function() {
    module.filter('aFilter');
  }, 'Error');
});

QUnit.test('default behavior is not changed for initial filter definition', function () {
  var angular = benv.require('../bower_components/angular/angular.js', 'angular');
  benv.require('../stop-angular-overrides.js');

  var module = angular.module('AngularOverrideInitialFilterTest', []);

  function someFilter() { }

  module.filter('someFilter', function() {
    return someFilter;
  });
  var $filter = angular.injector(['ng', 'AngularOverrideInitialFilterTest']).get('$filter');
  var someFilterLoaded = $filter('someFilter');
  QUnit.equal(someFilterLoaded, someFilter);

});

QUnit.test('default behavior is not changed for initial controller definition', function () {
  var angular = benv.require('../bower_components/angular/angular.js', 'angular');
  benv.require('../stop-angular-overrides.js');

  var module = angular.module('AngularOverrideInitialControllerTest', []);

  module.controller('someController', function() {
    this.name = 'someController';
  });

  var $controller = angular.injector(['ng', 'AngularOverrideInitialControllerTest']).get('$controller');
  var someControllerInstance = $controller('someController', {$scope: {}});
  QUnit.equal(someControllerInstance.name, 'someController');
});
