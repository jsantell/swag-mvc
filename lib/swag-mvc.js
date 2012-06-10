(function() {
  var app, formatPath, fs, inflection, initModels, initRoutes, models, routes;

  fs = require('fs');

  inflection = require('inflection');

  app = void 0;

  routes = {};

  models = {};

  /* DATABASE
  */

  initModels = function(_models, path, initFn, args) {
    var createModel, model, _i, _len, _results;
    createModel = function(name) {
      var mName, schema;
      mName = inflection.capitalize(name);
      schema = require("" + (formatPath(path)) + name)(args);
      return models[mName] = initFn(mName, schema);
    };
    _results = [];
    for (_i = 0, _len = _models.length; _i < _len; _i++) {
      model = _models[_i];
      _results.push(createModel(model));
    }
    return _results;
  };

  /* ROUTES
  */

  initRoutes = function(controllers, path, args) {
    var controller, initRoute, _i, _len, _results;
    initRoute = function(controller) {
      var cPath, controllerParams, mName, model;
      mName = inflection.capitalize(inflection.singularize(controller));
      controllerParams = [app];
      cPath = "" + (formatPath(path)) + controller;
      if (models[mName]) {
        model = models[mName];
        controllerParams.push(model);
      }
      controllerParams.push(args);
      return require(cPath).apply(null, controllerParams);
    };
    _results = [];
    for (_i = 0, _len = controllers.length; _i < _len; _i++) {
      controller = controllers[_i];
      _results.push(initRoute(controller));
    }
    return _results;
  };

  formatPath = function(path) {
    if (path.charAt(path.length - 1) === '/') {
      return path;
    } else {
      return path + '/';
    }
  };

  module.exports = function(_app) {
    app = _app;
    return {
      initRoutes: initRoutes,
      initModels: initModels
    };
  };

}).call(this);
