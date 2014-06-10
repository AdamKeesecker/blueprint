var buildingCollection = global.nss.db.collection('buildings');
var traceur = require('traceur');
var Location = traceur.require(__dirname + '/location.js');
var Base = traceur.require(__dirname + '/base.js');
var Room = traceur.require(__dirname + '/room.js');
var Mongo = require('mongodb');
var _ = require('lodash');

class Building{
  static create(obj, fn){
    var building = new Building();
    building._id = Mongo.ObjectID(obj._id);
    building.name = obj.name;
    building.x = parseInt(obj.x);
    building.y = parseInt(obj.y);
    building.rooms = [];
    building.locationId = Mongo.ObjectID(obj.locationId);
    building.userId = Mongo.ObjectID(obj.userId);
    buildingCollection.save(building, ()=>fn(building));
  }

  static findAllByUserId(userId, fn){
    Base.findAllByUserId(userId, buildingCollection, Building, fn);
  }

  static findById(id, fn){
    Base.findById(id, buildingCollection, Building, fn);
  }

  addRoom(obj, fn){
    var room = new Room(obj);
    this.rooms.push(room);
    buildingCollection.update({_id:this._id}, {$push:{rooms:room}}, ()=>fn(this));
  }

  cost(fn){
    var sqFt = this.x * this.y;
    var locationCost;
    var flooringCost = 0;
    console.log(this.locationId);
    Location.findById(this.locationId, location=>{
      locationCost = sqFt * location.rate;
      if(this.rooms.length > 0){
        this.rooms = this.rooms.map(r=>_.create(Room.prototype, r));
        this.rooms.forEach(r=>{
          flooringCost += r.area() * sqFt;
        });
        fn(locationCost + flooringCost);
      }else{
        fn(locationCost);
      }
    });
  }
}

module.exports = Building;
