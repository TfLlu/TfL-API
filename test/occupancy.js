//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../dist/index').listen();
chai.should();
let geojsonValidation = require('geojson-validation');

chai.use(chaiHttp);

describe('Occupancy', () => {
    describe('GET /Occupancy/CarPark', () => {
        it('should get all the carparks as geojson', (done) => {
            chai.request(server)
                .get('/Occupancy/CarPark')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    geojsonValidation.isFeatureCollection(res.body).should.be.equal(true);
                    for(var i = 0; i < res.body.features.length; i++) {
                        var props = res.body.features[i].properties;
                        props.id.should.be.a('String');
                        props.name.should.be.a('String');
                        props.total.should.be.a('Number');
                        if (props.free !== null) {
                            props.free.should.be.a('Number');
                        }
                        if (props.trend !== null) {
                            props.trend.should.be.a('String');
                        }
                        props.meta.should.be.a('object');
                    }
                    done();
                });
        });
    });
    describe('GET /Occupancy/CarPark/vdl:22', () => {
        it('should get carpark 22 from vdl as geojson', (done) => {
            chai.request(server)
                .get('/Occupancy/CarPark/vdl:22')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    geojsonValidation.isFeature(res.body).should.be.equal(true);
                    var props = res.body.properties;
                    props.id.should.be.equal('vdl:22');
                    props.name.should.be.equal('Glacis');
                    props.total.should.be.a('Number');
                    props.free.should.be.a('Number');
                    props.trend.should.be.a('String');
                    props.meta.should.be.a('object');
                    done();
                });
        });
    });
});
