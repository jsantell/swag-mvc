(function() {
  var app, fs, inflection, initModels, initRoutes, models, routes;

  fs = require('fs');

  inflection = require('inflection');

  app = void 0;

  routes = {};

  models = {};

  /* DATABASE
  */

  initModels = function(_models, initFn, args) {
    var createModel, model, _i, _len, _results;
    createModel = function(name) {
      var mName, schema;
      mName = inflection.capitalize(name);
      schema = require("" + __dirname + "/models/" + name)(args);
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

  initRoutes = function(controllers, args) {
    var controller, initRoute, _i, _len, _results;
    initRoute = function(controller) {
      var cPath, controllerParams, mName, model;
      mName = inflection.capitalize(inflection.singularize(controller));
      controllerParams = [app];
      cPath = "" + __dirname + "/controllers/" + controller;
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

  module.exports = function(_app) {
    app = _app;
    return {
      initRoutes: initRoutes,
      initModels: initModels
    };
  };

}).call(this);
