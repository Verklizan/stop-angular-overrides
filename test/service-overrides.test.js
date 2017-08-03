/* global window, document, require, QUnit */
var benv = require('benv');
var Q = require('q');

QUnit.module('angular service overrides', {
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

QUnit.test('stop angular service override', function () {
  var angular = benv.require('../bower_components/angular/angular.js', 'angular');
  benv.require('../stop-angular-overrides.js');

  angular.module('serviceoverridetest1module1', []).service('someServiceTest1', function () {});

  QUnit.throws(function () {
    angular.module('serviceoverridetest1module2', []).service('someServiceTest1', function () {});
  }, 'Error');
});

QUnit.test('stop angular service (value) override', function () {
  var angular = benv.require('../bower_components/angular/angular.js', 'angular');
  benv.require('../stop-angular-overrides.js');

  angular.module('serviceoverridetest2module1', []).service('someServiceTest2', function () {});

  QUnit.throws(function () {
    angular.module('serviceoverridetest2module2', []).value('someServiceTest2', {});
  }, 'Error');
});

QUnit.test('stop angular service (factory) override', function () {
  var angular = benv.require('../bower_components/angular/angular.js', 'angular');
  benv.require('../stop-angular-overrides.js');

  angular.module('serviceoverridetest3module1', []).service('someServiceTest3', function () {});

  QUnit.throws(function () {
    angular.module('serviceoverridetest2module2', []).factory('someServiceTest3', function () {});
  }, 'Error');
});

QUnit.test('stop angular service (provider) override', function () {
  var angular = benv.require('../bower_components/angular/angular.js', 'angular');
  benv.require('../stop-angular-overrides.js');

  angular.module('serviceoverridetest4module1', []).service('someServiceTest4', function () {});

  QUnit.throws(function () {
    angular.module('serviceoverridetest4module2', []).provider('someServiceTest4', function () {});
  }, 'Error');
});


QUnit.test('stops service overrides with undefined', function () {
  var angular = benv.require('../bower_components/angular/angular.js', 'angular');
  benv.require('../stop-angular-overrides.js');

  var module = angular.module('serviceoverridetest5module', []);

  module.service('someServiceTest5', function () {});

  QUnit.throws(function() {
    module.service('someServiceTest5');
  }, 'Error');
});


QUnit.test('default behaviour is not changed for initial service definition', function () {
  var angular = benv.require('../bower_components/angular/angular.js', 'angular');
  benv.require('../stop-angular-overrides.js');

  var module = angular.module('serviceoverridetest6module', []);

  function SomeService () {
    this.name = 'someServiceTest6';
  }

  // service behavior
  module.service('someServiceTest6', SomeService);
  var someService = angular.injector(['ng', 'serviceoverridetest6module']).get('someServiceTest6');
  QUnit.equal(someService.name, 'someServiceTest6');

  // factory behavior
  module.factory('someFactoryServiceTest6', function () {
    return new SomeService();
  });
  var someFactoryService = angular.injector(['ng', 'serviceoverridetest6module']).get('someFactoryServiceTest6');
  QUnit.equal(someFactoryService.name, 'someServiceTest6');

  // value behavior
  module.value('someValueServiceTest6', new SomeService());
  var someValueService = angular.injector(['ng', 'serviceoverridetest6module']).get('someValueServiceTest6');
  QUnit.equal(someValueService.name, 'someServiceTest6');

  // provider behavior
  module.provider('someProviderServiceTest6', function () {
    this.$get = function () {
      return new SomeService();
    };
  });
  var someProviderService = angular.injector(['ng', 'serviceoverridetest6module']).get('someProviderServiceTest6');
  QUnit.equal(someProviderService.name, 'someServiceTest6');
});
