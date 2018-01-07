const express = require('express');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const { Strategy: JwtStrategy, ExtractJwt } = passportJWT;
const { User } = require('./database');

require('dotenv').config();

const app = express();

//Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(passport.initialize());

// Passport JWT Authorization strategy
const jwtOptions = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
}
passport.use(new JwtStrategy(jwtOptions, (jwtPayload, done) => {
  const { email } = jwtPayload;
  User.find({ email })
    .then((user) => {
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    })
}));

// Helper Function - Set the expiry time of the token to a very long time
const generateToken = (user, secret) => jwt.sign(user, secret, { expiresIn: Math.floor(Date.now() / 1000) * 60 * 60 }); 

// Routes
app.post('/api/accessToken', (req, res) => {
  const { email } = req.body;
  const secret = process.env.JWT_SECRET;
  const token = generateToken({ email }, secret);

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        const newUser = new User({ email });
        newUser.save();
        res.status(201).json(token);
      }
      res.status(200).json(token);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

app.get('/api/hrr27/getStudents', passport.authenticate('jwt', { session: false }), (req, res) => {
  const names = ['Anton', 'Jon', 'Benji', 'Kate', 'Raymond', 'Anto', 'Chucky', 'Grace', 'David', 'Nic Orr', 'Alex', 'Luke', 'Mike', 'Dan', 'Krista', 'Yazhi', 'Brian L', 'Ben', 'Phill2020', 'Nic Chapman', 'Arthur', 'Jacob', 'Brian B', 'Lisha Deng', 'Cam Adelstein', 'Grant??'];
  res.json({ names });
});

app.set('port', process.env.PORT || 1234);
const port = app.get('port');

app.listen(port, () => {
  console.log('Server started');
});
