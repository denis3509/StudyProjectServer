const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;
const crypto = require('crypto');
// create a schema
const userSchema = new Schema({
  login: {type: String, required: true, unique: true},
  userName: {type: String, required: true},
  hashedPassword: {type: String, required: true},
  email: {type: String, required: true},
  salt: {type: String, required: true},
  created_at: Date,
  profileData: {
    about: String,
    phone: String,
    contactEmail: String,
  },
  dashboardList: [{
    dashboard_id: ObjectId,
    dashboardName: String,
    description: String,
  }]
});


userSchema.statics.signUp = function (user, callback) {
  const newUser = new User(user);

  newUser.setPassword(user.password);
  newUser.save(callback);
};
userSchema.statics.login = function (login, password, callback) {
  if (login && password) {
    this.findOne({ login}, (error, foundUser) => {
      if (error) {
        callback(new Error('no user found'), null);
      } else if (foundUser){
        const validate = foundUser.validatePassword(password.toString());
        if (validate) {
          callback(null, foundUser);
        } else {
          callback(new Error("wrong password or login"), null)
        }
      } else {
        callback(new Error('wrong password or login'), null);
      }
    });
  } else {
    callback(new Error('no login and password'), null)
  }


};

userSchema.methods.joinDashboard = function (dashboard, callback) {
  const {
    _id,
    dashboardName,
    description
  } = dashboard;
  this.dashboardList.push(
    {
      dashboard_id: _id,
      dashboardName,
      description,
    });
  this.save(callback);

};
userSchema.methods.leaveDashboard = function (_id, callback) {
  const newDashboardList = [...this.dashboardList];
  let deleted = newDashboardList.splice(index, 1);
  const dash = this.dashboardList.id(_id);
  if (dash) {
    dash.remove();
    this.save(callback);
  } else {
    callback(new Error('dashboard not found in list'));
  }

};

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hashedPassword = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

userSchema.methods.validatePassword = function (password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hashedPassword === hash;
};

const User = mongoose.model('User', userSchema);

module.exports = User;