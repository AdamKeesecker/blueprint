'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');

exports.new = (req, res)=>{
  res.render('users/login', {title: 'Login'});
};

exports.create = (req,res)=>{
  User.create(req.body, user=>{
    if(user){
      req.session.userId = user._id;
      res.redirect('/');
    }else{
      res.redirect('/login');
    }
  });
};

exports.login = (req, res)=>{
  User.login(req.body, user=>{
    if(user){
      req.session.userId = user._id;
      res.redirect('/');
    }else{
      res.redirect('/login');
    }
  });
};

exports.logout = (req, res)=>{
  req.session = null;
  res.redirect('/');
};

exports.lookup = (req, res, next)=>{
  console.log('session.userid');
  console.log(req.session.userId);
  if(req.session.userId){
    User.findById(req.session.userId, user=>{
      if(user){
        res.locals.user = user;
        next();
      }else{
        next();
      }
    });
  }else{
    next();
  }
};
