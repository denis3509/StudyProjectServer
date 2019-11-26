const index = {
  secret: 'verySecret',
  key: 'sid',
  cookie: {
    path: '/',
    httpOnly: false,
    maxAge: 24 * 60 * 60 * 1000,
    secure: true,
    domain: 'https://study-nodejs-app.herokuapp.com',
  },
  reactHostName : 'https://study-react-app.herokuapp.com',
  mongodbConnectionURI :'mongodb://admin:adminN9*@ds061797.mlab.com:61797/study-project-mongodb',

};

// const getConfig = () => {
//   if (ENV === 'production')
// }
module.exports = index;