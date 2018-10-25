'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../server');
const { TEST_MONGODB_URI } = require('../config');

const Folder = require('../models/folder');

const { folders } = require('../db/seed/data');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Folderful API - folders', function () {

    before(function () {
      return mongoose.connect(TEST_MONGODB_URI)
        .then(() => mongoose.connection.db.dropDatabase());
    });
  
    beforeEach(function () {
      return Folder.insertMany(folders);
    });
  
    afterEach(function () {
      return mongoose.connection.db.dropDatabase();
    });
  
    after(function () {
      return mongoose.disconnect();
    });
  
    describe('GET /api/folders', function () {
  
      it('should return the correct number of folders', function () {
        return Promise.all([
          Folder.find(),
          chai.request(app).get('/api/folders')
        ])
          .then(([data, res]) => {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('array');
            expect(res.body).to.have.length(data.length);
          });
      });
  
      it('should return a list with the correct right fields', function () {
        return Promise.all([
          Folder.find().sort({ name: 'desc' }),
          chai.request(app).get('/api/folders')
        ])
          .then(([data, res]) => {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('array');
            expect(res.body).to.have.length(data.length);
            res.body.forEach(function (item, i) {
              expect(item).to.be.a('object');
              expect(item).to.include.all.keys('id', 'name', 'createdAt', 'updatedAt');
              expect(item.id).to.equal(data[i].id);
              expect(item.name).to.equal(data[i].name);
              expect(new Date(item.createdAt)).to.eql(data[i].createdAt);
              expect(new Date(item.updatedAt)).to.eql(data[i].updatedAt);
            });
          });
      });
  
    });

    describe('GET /api/folders/:id', function () {

        it('should return correct folders', function () {
          let data;
          return Folder.findOne()
            .then(_data => {
              data = _data;
              return chai.request(app).get(`/api/folders/${data.id}`);
            })
            .then((res) => {
              expect(res).to.have.status(200);
              expect(res).to.be.json;
              expect(res.body).to.be.an('object');
              expect(res.body).to.have.all.keys('id', 'name', 'createdAt', 'updatedAt');
              expect(res.body.id).to.equal(data.id);
              expect(res.body.name).to.equal(data.name);
              expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
              expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
            });
        });
    
        it('should respond with status 400 and an error message when `id` is not valid', function () {
          return chai.request(app)
            .get('/api/folders/NOT-A-VALID-ID')
            .then(res => {
              expect(res).to.have.status(400);
              expect(res.body.message).to.eq('The `id` is not valid');
            });
        });

    
      });
    
    });