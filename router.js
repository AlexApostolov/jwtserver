const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

// By default Passport wants to make a cookie based session for this request, since we are using a token strategy we need to disable it
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {
  app.get('/', requireAuth, function(req, res) {
    res.send({ hi: 'there' });
  });
  // Sign in is passed middleware to authenticate user before sending off to controller
  app.post('/signin', requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);
};
