const index = {
  secret: 'verySecret',
  key: 'sid',
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: null,
  },
  reactHostName : 'https://study-react-app.herokuapp.com/',
  mongodbConnectionURI :'mongodb://admin:adminN9*@ds061797.mlab.com:61797/study-project-mongodb',
};
module.exports = index;