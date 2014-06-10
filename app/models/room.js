var Mongo = require('mongodb');

class Room{
  constructor(obj){
    this.name = obj.name;
    this.begin = {x:obj.beginX*1, y:obj.beginY*1};
    this.end = {x:obj.endX*1, y:obj.endY*1};
    this.floorId = Mongo.ObjectID(obj.floorId);
  }

  area(){
    var x = this.end.x - this.begin.x;
    var y = this.end.y - this.begin.y;
    return x * y;
  }
}

module.exports = Room;
