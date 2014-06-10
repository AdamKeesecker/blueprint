'use strict';

var traceur = require('traceur');
var Building = traceur.require(__dirname + '/../models/building.js');
var Location = traceur.require(__dirname + '/../models/location.js');
var Floor = traceur.require(__dirname + '/../models/floor.js');

exports.new = (req, res)=>{
  if(!req.session.userId){
    res.redirect('/');
  }else{
    Location.findAll(locations=>{
      res.render('buildings/new', {title: 'New Building', locations:locations});
    });
  }
};

exports.create = (req,res)=>{
  Building.create(req.body, building=>res.redirect('/buildings/' + building._id));
};

exports.show = (req,res)=>{
  Floor.findAll(floors=>{
    Building.findById(req.params.id, building=>{
      building.cost(cost=>{
        res.render('buildings/show', {building:building, cost:cost, floors:floors, title: 'Building Show'});
      });
    });
  });
};
