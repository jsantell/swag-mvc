swag-mvc
======

hands off mvc for node.js

### Creating

* `require('mvc')( app )` Pass in `express.createServer()`

### Models

* `mvc.initModels( models, dir, setupFunction, args )` sets up models in `dir` defined in the array of strings `models`. `setupFunction` has two arguments, one is the capitalized name of the model and the other is the return value of the model file in `dir/ModelName` to hook it into your database of choice. `args` are arguments passed into the model file.

### Routes

* `mvc.initRoutes( routes, args )` sets up the routes in `dir`, defined with an array of strings `routes`, passing in `app`, corresponding model if applicable, followed by additional `args`.

Example
---
`app.js`
```javascript
  mvc = require('mvc')( app );
  db  = mongoose.connect( url );

  mvc.initModels( [ 'User' ], __dirname + '/models/', function ( name, schema ) {
    db.model( name, schema );
    return db.model( name );
  }, {
    mongoose: mongoose
  });

  mvc.initRoutes( [ 'users', 'pages', 'sesions' ], __dirname + '/controllers/', {
    auth: function ( req, res, next ) {
      req.isAuthenticated() ? next() : res.redirect( '/login' );
    });
  });
```

`ROOT/controllers/users.js`
```javascript
  // Passing in arguments app, the model, and arguments object passed in
  // during initRoutes
  module.exports = function ( app, User, args ) {
    app.get( '/users', function ( req, res, next ) {
      User.find( {}, ( err, users ) {
        if ( !err ) { res.render( 'users/idnex', { users: users } }
      });
    });

    app.get( '/register', function ( req, res, next ) {
      res.render( '/users/new' );
    });
  };
```

`ROOT/models/User.js`
```javascript
  module.exports = function ( args ) {
    mongoose = args.mongoose;
    ObjectId = mongoose.SchemaTypes.ObjectId;

    UserSchema = new mongooose.Schema({});

    // this is the schema passed into the
    // setupFunction in initModels
    return UserSchema;
  };
```
