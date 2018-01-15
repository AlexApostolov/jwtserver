const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// DEFINE MODEL
const userSchema = new Schema({
  // Before mongoose saves a user's email to the database, make sure it's unique, & save as lowercase so case doesn't play a role
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// On save hook, encrypt password
// NOTE: am arrow function wouldn't work here because the callback is invoked with a context of the model,
// not the context of the model file
userSchema.pre('save', function(next) {
  // Get access to the user model for a specific instance
  const user = this;

  // Check that the user is new, i.e. the first save, and then skip the encryption if not
  if (!user.isNew) {
    next();
  }

  // Generate a salt, pass a callback to wait for it to complete
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }

    // Hash, i.e. encrypt, the password using the salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return next(err);
      }

      // Overwrite plain text password with encrypted password
      user.password = hash;
      next();
    });
  });
});

// Create instance method called comparePassword to use bcrypt to compare a login with the password saved
userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return callback(err);
    }

    callback(null, isMatch);
  });
};

// CREATE MODEL CLASS
const ModelClass = mongoose.model('User', userSchema);

// EXPORT MODEL
module.exports = ModelClass;
