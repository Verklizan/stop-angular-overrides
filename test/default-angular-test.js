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

QUnit.test('last directive overrides by default', function () {
  var angular = benv.require('../bower_components/angular/angular.js', 'angular');

  var module = angular.module('A', []);

  // initial definition
  module.directive('someDirective', function () { });

  // first override
  module.directive('someDirective', function () {
    return {
      restrict: 'E',
      replace: true,
      template: '<div>Some Directive</div>'
    };
  });

  var $compile = angular.injector(['ng', 'A']).get('$compile');
  var $rootScope = angular.injector(['ng', 'A']).get('$rootScope');
  var $element = $compile('<some-directive></some-directive>')($rootScope);

  QUnit.equal($element[0].tagName, 'DIV');
});

QUnit.test('last service overrides by default', function () {
  var angular = benv.require('../bower_components/angular/angular.js', 'angular');

  var module = angular.module('A', []);
  var ServiceA = function () {
    this.name = 'ServiceA';
  };
  var ServiceB = function () {
    this.name = 'ServiceB';
  };

  // initial definition
  module.service('someService', ServiceA);

  // first override
  module.service('someService', ServiceB);

  var someService = angular.injector(['ng', 'A']).get('someService');
  QUnit.equal(someService.name, 'ServiceB', 'someService -> second service');

  // undefined override
  module.service('someService');

  QUnit.throws(function() {
    angular.injector(['ng', 'A']).get('someService');
  }, 'Error');

  // value override
  module.value('someService', new ServiceA());
  someService = angular.injector(['ng', 'A']).get('someService');
  QUnit.equal(someService.name, 'ServiceA', 'someService -> third service');

  // factory override
  module.factory('someService', function () {
    return new ServiceB();
  });
  someService = angular.injector(['ng', 'A']).get('someService');
  QUnit.equal(someService.name, 'ServiceB', 'someService -> fourth service');

  // provider override
  module.provider('someService', function () {
    this.$get = function () {
      return new ServiceA();
    };
  });
  someService = angular.injector(['ng', 'A']).get('someService');
  QUnit.equal(someService.name, 'ServiceA', 'someService -> fifth service');
});

QUnit.test('last module overrides by default', function () {
  var angular = benv.require('../bower_components/angular/angular.js', 'angular');
  var first = angular.module('AModule', []);
  QUnit.equal(angular.module('AModule'), first, 'AModule -> first module');

  var second = angular.module('AModule', []);
  QUnit.equal(angular.module('AModule'), second, 'AModule -> second module');
});

QUnit.test('last controller overrides by default', function () {
  var angular = benv.require('../bower_components/angular/angular.js', 'angular');

  var module = angular.module('A', []);
  var First = function () {};
  var Second = function () {
    this.name = 'second';
  };

  module.controller('aController', First);
  module.controller('aController', Second);

  var $controller = angular.injector(['ng', 'A']).get('$controller');
  var pseudoScope = $controller('aController', {$scope: {}});
  QUnit.equal(pseudoScope.name, 'second', 'aController -> second controller');

  module.controller('aController');
  $controller = angular.injector(['ng', 'A']).get('$controller');

  QUnit.throws(function() {
    $controller('aController', {$scope: {}});
  }, 'Argument \'aController\' is not a function, got undefined');
});

QUnit.test('last filter overrides by default', function () {
 	var angular = benv.require('../bower_components/angular/angular.js', 'angular');

 	var module = angular.module('A', []);
	var firstFilter = function() {};
	var secondFilter = function () {};

	module.filter('aFilter', function () { return firstFilter; });
	module.filter('aFilter', function () { return secondFilter; });

	var $filter = angular.injector(['ng', 'A']).get('$filter');
	var loadedFilter = $filter('aFilter');
	QUnit.equal(loadedFilter, secondFilter, 'aFilter -> secondFilter');
});
