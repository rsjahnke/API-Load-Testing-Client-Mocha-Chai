var assert = require('assert')
var chai = require('chai');
var chaiHttp = require('chai-http');
var config = require('config');

var customerConfig = config.get("Div29");

var should = chai.should(), expect = chai.expect;
chai.use(chaiHttp);

var newRowID;

describe('/POST Table Row as Child of Catalog Item', () => {
    it('should create a table row', (done) => {
        chai.request('test.rightsline.com')
            .post('/table')
            .set('Authorization', customerConfig.basicAuthHeader)
            .send({
                "parentRelationship": [
                         {
                           "parentURL": "test.rightsline.com" // note - ID must be in catalog 
                         }
                    ],
              "title": "Usage 00099",
                    "template": {
                       "templateId": 13,
                       "templateName": "Sample Table"
                    },
                    "status": {
                       "statusId": 1,
                       "statusName": "Usage Created"
                    },
                    "characteristics": {
                       "reporting_group": "United States",
                       "currency": "USD"
                    }
               })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('number');
            newRowID = res.body;
            done();
          });
    });
});

describe('/PUT Table Row', () => {
    it('should update a table row', (done) => {
        chai.request('test.rightsline.com')
            .put('/table/' + newRowID)
            .set('Authorization', customerConfig.basicAuthHeader)
            .send({
                "title": "Usage 00099",
                "template": {
                  "templateId": 13,
                  "templateName": "Sample Table"
                },
                "characteristics": {
                  "currency": "EUR"
                }
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });
});

describe('/POST Catalog Item to Table Row', () => {
    it('should associate a catalog item to a table row', (done) => {
        chai.request('test.rightsline.com')
            .post('/relationship')
            .set('Authorization', customerConfig.basicAuthHeader)
            .send({
                "parentURL": "test.rightsline.com",
                "childURL":"test.rightsline.com"
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('number');
                done();
            });
    });
});

describe('/DELETE Delete a Table Row', () => {
    it('should delete a table row', (done) => {
        chai.request('test.rightsline.com')
            .delete('/table/' + newRowID)
            .set('Authorization', customerConfig.basicAuthHeader)
            .send({
              //empty
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('boolean');
                done();
            });
    });
});


