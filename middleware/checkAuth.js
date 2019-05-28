const checkAuth = (req,res,next)=>{
  if (req.session.user) {
    next();
  } else {
    next(new Error('not authorized'));
  }
};

exports.checkAuth = checkAuth;