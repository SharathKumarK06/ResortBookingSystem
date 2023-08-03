const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    let user;
    try {
      user = await getUserByEmail(email);
    } catch (err) {
      console.log('[getUserByEmail]' + err);
    }
    if(user === null) {
      return done(null, false, { message: "No user exist with the email!" });
    }

    try {
      if(await bcrypt.compare(password, user.hashedPassword)) {
        return done(null, user);
      }
      else {
        return done(null, false, { message: 'Password Incorrect' });
      }
    } catch (err) {
      console.log('[authenticateUser] ' + err);
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id));
  });
}

module.exports = initialize;
