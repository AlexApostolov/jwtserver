const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
// Another Passport strategy--local strategy--using user's email & password to get the token
const LocalStrategy = require('passport-local');

// Tell local strategy exactly where to look in the request to get access to email, though by default it looks for a username
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(
  email,
  password,
  done
) {
  // Verify this email & password, then call done with the user if it is the correct email & password,
  // otherwise, call done with false.
  User.findOne({ email: email }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false);
    }

    // Compare passwords--is password passed above equal to user.password?
    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        return done(err);
      }

      if (!isMatch) {
        return done(null, false);
      }

      // Use Passports done() to assign user to req.user
      return done(null, user);
    });
  });
});

// Set up options for JWT Strategy
const jwtOptions = {
  // Tell JWT where to look on request to find the key, in this case in the request header called "authorization"
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(
  // Pass decoded JWT: sub & iat properties
  payload,
  // Callback function called depending on whether we're able to successfully authenticate the user
  done
) {
  // See if user ID in the payload exists in our DB, if so, call "done" without a user object,
  // otherwise call done without a user object.
  User.findById(payload.sub, function(err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      // If user is found call done without an error & that user
      done(null, user);
    } else {
      // Otherwise call done without an error but no user to return
      done(null, false);
    }
  });
});

// Tell Passport to use these 2 strategies
passport.use(jwtLogin);
passport.use(localLogin);
