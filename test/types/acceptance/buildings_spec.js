/* global describe, before, beforeEach, it */

'use strict';

process.env.DBNAME = 'blueprint-test';

var cp = require('child_process');
var expect = require('chai').expect;
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
var factory = traceur.require(__dirname + '/../../helpers/factory.js');
var app = require('../../../app/app');
var request = require('supertest');

var User;
var cookie;


describe('users', function(){

  before(function(done){
    db(function(){
      User = traceur.require(__dirname + '/../../../app/models/user.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('users').drop(function(){
      cp.execFile(__dirname + '/../../fixtures/before.sh', {cwd:__dirname + '/../../fixtures'}, function(err, stdout, stderr){
        factory('user', function(users){
          factory('building', function(buildings){
            factory('location', function(locations){
              done();
            });
          });
        });
      });
    });
  });


  describe('Authentication', function(){
    beforeEach(function(done){
      request(app)
      .post('/login')
      .send('email=bill@aol.com')
      .send('password=1234')
      .end(function(err, res){
        cookie = res.headers['set-cookie'][0].split(';')[0];
        cookie += '; ' + res.headers['set-cookie'][1].split(';')[0];
        console.log('cookie');
        console.log(cookie);
        done();
      });
    });

    describe('GET /buildings/new', function(){
      it('should load the new buildings page', function(done){
        request(app)
        .get('/buildings/new')
        .set('cookie', cookie)
        .end(function(err, res){
          expect(res.status).to.equal(200);
          expect(res.text).to.include('bill@aol.com');
          done();
        });
      });

      it('should NOT load the new buildings page - not logged (redirect)', function(done){
        request(app)
        .get('/buildings/new')
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.headers.location).to.equal('/');
          done();
        });
      });
    });

    describe('POST /buildings', function(){
      it('should create a new building', function(done){
        request(app)
        .post('/buildings')
        .set('cookie', cookie)
        .send('_id=0123456789abcdef01234568')
        .send('name=Volcano Lair')
        .send('x=80')
        .send('y=100')
        .send('location=a123456789abcdef01234567')
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.headers.location).to.equal('/buildings/0123456789abcdef01234568');
          done();
        });
      });
    });

    describe('GET /buildings/c123456789abcdef0123456a', function(){
      it('should go get that page bro! You know... the building show page', function(done){
        request(app)
        .get('/buildings/c123456789abcdef0123456a')
        .set('cookie', cookie)
        .end(function(err, res){
          expect(res.status).to.equal(200);
          expect(res.text).to.contain('mc-mansion');
          expect(res.text).to.contain('$3840');
          done();
        });
      });
    });

  });

});
