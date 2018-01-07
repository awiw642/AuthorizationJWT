const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect('mongodb://localhost/jwt', { useMongoClient: true })
  .then(() => {
    console.log('Connected to JWT database');
  })
  .catch(() => {
    console.error('Failed to connect to JWT database');
  });


const userSchema = new mongoose.Schema({ 
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
  },
});

module.exports.User = mongoose.model('User', userSchema);