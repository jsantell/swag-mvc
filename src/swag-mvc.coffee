fs         = require 'fs'
inflection = require 'inflection'
app = undefined
routes = {}
models = {}

### DATABASE ###

initModels = ( _models, initFn, args ) ->
  createModel = ( name ) ->
    mName = inflection.capitalize name
    schema = require( "#{__dirname}/models/#{name}" )( args )
    models[ mName ] = initFn mName, schema

  createModel model for model in _models

### ROUTES ###

initRoutes = ( controllers, args ) ->
  initRoute = ( controller ) ->
    mName  = inflection.capitalize( inflection.singularize controller )
    controllerParams = [ app ]
    cPath  = "#{__dirname}/controllers/#{controller}"

    if models[ mName ]
      model = models[ mName ]
      controllerParams.push model

    controllerParams.push args
    require( cPath )( controllerParams... )

  initRoute controller for controller in controllers

module.exports = ( _app ) ->
  app = _app
  {
    initRoutes  : initRoutes
    initModels  : initModels
  }
