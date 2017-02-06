//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../dist/index').default;
chai.should();
let geojsonValidation = require('geojson-validation');

chai.use(chaiHttp);

function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
var randomLimit = random(25, 200);

describe('Departures', () => {
    describe('GET /StopPoint/Departures/200405035', () => {
        it('should get 10 departures from "Luxembourg, Gare Centrale"', (done) => {
            chai.request(server)
                .get('/StopPoint/Departures/200405035')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');
                    res.body.length.should.be.equal(10);
                    for(var i = 0; i < res.body.length; i++) {
                        var departure = res.body[i];
                        departure.type.should.be.a('String');
                        if (departure.trainId !== null) {
                            departure.trainId.should.be.a('String');
                        }
                        departure.line.should.be.a('String');
                        departure.number.should.be.a('Number');
                        departure.departure.should.be.a('Number');
                        departure.delay.should.be.a('Number');
                        departure.live.should.be.a('Boolean');
                        departure.destination.should.be.a('String');
                        if (departure.destinationId !== null) {
                            departure.destinationId.should.be.a('Number');
                        }
                    }
                    done();
                });
        });
    });
    describe('GET /StopPoint/Departures/200405035/'+randomLimit, () => {
        it('should get a random number ['+randomLimit+'] of departures from "Luxembourg, Gare Centrale"', (done) => {
            chai.request(server)
                .get('/StopPoint/Departures/200405035/'+randomLimit)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');
                    res.body.length.should.be.equal(randomLimit);
                    for(var i = 0; i < res.body.length; i++) {
                        var departure = res.body[i];
                        departure.type.should.be.a('String');
                        if (departure.trainId !== null) {
                            departure.trainId.should.be.a('String');
                        }
                        departure.line.should.be.a('String');
                        departure.number.should.be.a('Number');
                        departure.departure.should.be.a('Number');
                        departure.departureISO.should.be.a('String');
                        departure.delay.should.be.a('Number');
                        departure.live.should.be.a('Boolean');
                        departure.destination.should.be.a('String');
                        if (departure.destinationId !== null) {
                            departure.destinationId.should.be.a('Number');
                        }
                    }
                    done();
                });
        });
    });
});
