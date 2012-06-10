fs         = require 'fs'
inflection = require 'inflection'
app = undefined
routes = {}
models = {}

### DATABASE ###

initModels = ( _models, path, initFn, args ) ->
  createModel = ( name ) ->
    mName = inflection.capitalize name
    schema = require( "#{formatPath(path)}#{name}" )( args )
    models[ mName ] = initFn mName, schema

  createModel model for model in _models

### ROUTES ###

initRoutes = ( controllers, path, args ) ->
  initRoute = ( controller ) ->
    mName  = inflection.capitalize( inflection.singularize controller )
    controllerParams = [ app ]
    cPath  = "#{formatPath(path)}#{controller}"

    if models[ mName ]
      model = models[ mName ]
      controllerParams.push model

    controllerParams.push args
    require( cPath )( controllerParams... )

  initRoute controller for controller in controllers

formatPath = ( path ) ->
  if path.charAt( path.length - 1 ) is '/' then path else path + '/'

module.exports = ( _app ) ->
  app = _app
  {
    initRoutes  : initRoutes
    initModels  : initModels
  }
