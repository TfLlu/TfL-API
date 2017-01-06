//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../dist/index').listen();
let should = chai.should();
let geojsonValidation = require('geojson-validation');

chai.use(chaiHttp);

var invalidFeature =  {
    'type': 'feature',
    'geometry': {
        'type': 'LineString',
        'coordinates': [
            [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
        ]
    },
    'properties': {
        'prop0': 'value0',
        'prop1': 0.0
    }
};

describe('StopPoints', () => {
    describe('GET /Stoppoint', () => {
        it('should get all the stoppoints as object', (done) => {
            chai.request(server)
                .get('/stoppoint')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
        it('should get all the stoppoints as geojson', (done) => {
            chai.request(server)
                .get('/stoppoint')
                .end((err, res) => {
                    geojsonValidation.isFeatureCollection(res.body).should.be.equal(true);
                    done();
                });
        });
    });
});
