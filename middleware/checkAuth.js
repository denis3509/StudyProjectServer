const checkAuth = (req,res,next)=>{
  console.log(req.session);
  if (req.session.user) {
    next();
  } else {
    next(new Error('not authorized'));
  }
};

exports.checkAuth = checkAuth;