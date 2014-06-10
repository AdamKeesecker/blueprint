/* global describe, before, beforeEach, afterEach, it */
/* jshint expr:true */

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
          done();
        });
      });
    });
  });

  afterEach(function(done){
    cp.execFile(__dirname + '/../../fixtures/after.sh', {cwd:__dirname + '/../../fixtures'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('GET /login', function(){
    it('should get the login page', function(done){
      request(app)
      .get('/login')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

  describe('POST /users', function(){
    it('should create a new user', function(done){
      request(app)
      .post('/users')
      .send('email=bob@bob.com')
      .send('password=bob')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/');
        expect(res.headers['set-cookie']).to.be.ok;
        done();
      });
    });

    it('should NOT create a new user', function(done){
      request(app)
      .post('/users')
      .send('email=sue@aol.com')
      .send('password=lawlz')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/login');
        expect(res.headers['set-cookie']).to.not.be.ok;
        done();
      });
    });
  });

  describe('POST /login', function(){
    it('should login a user', function(done){
      request(app)
      .post('/login')
      .send('email=bill@aol.com')
      .send('password=1234')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/');
        expect(res.headers['set-cookie']).to.be.ok;
        done();
      });
    });

    it('should NOT login a user - Bad Email', function(done){
      request(app)
      .post('/login')
      .send('email=sueee@aol.com')
      .send('password=5678')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/login');
        expect(res.headers['set-cookie']).to.not.be.ok;
        done();
      });
    });

    it('should NOT login a user - Bad Password', function(done){
      request(app)
      .post('/login')
      .send('email=sue@aol.com')
      .send('password=578')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/login');
        expect(res.headers['set-cookie']).to.not.be.ok;
        done();
      });
    });
  });

  describe('POST /logout', function(){
    it('should logout a user DUH', function(done){
      request(app)
      .post('/logout')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/');
        expect(res.headers['set-cookie']).to.be.ok;
        console.log(res.headers);
        done();
      });
    });
  });
});
