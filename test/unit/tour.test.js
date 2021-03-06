const { assert } = require('chai');
const { getErrors } = require('./helpers');
const Tour = require('../../lib/models/tour');

describe('Tour model', () => {
    it('validates good model', () => {
        const data = {
            title: 'Cirque du Soleil',
            activities: ['contortion', 'trapeze'],
            lunchDate: new Date(),
            stops: [{
                location: {
                    city: 'Portland',
                    state: 'Oregon',
                    zip: '97209'
                },
                weather: {
                    temperature: '75',
                    condition: 'Partially cloudy'
                },
                attendance: 1
            }]
        };
        const tour = new Tour(data);

        const json = tour.toJSON();
        json.stops.forEach(s => delete s._id);
        delete json._id;
        assert.deepEqual(json, data);
        assert.isUndefined(tour.validateSync());
    });

    it('tests required fields', () => {
        const tour = new Tour({});
        const errors = getErrors(tour.validateSync(), 1);
        assert.equal(errors.title.kind, 'required');
    });

    it('tests min attendance of 1', () => {
        const tour = new Tour({
            title: 'Circus Circus',
            stops: [{
                attendance: 0
            }]
        });
        const errors = getErrors(tour.validateSync(), 1);
        assert.equal(errors['stops.0.attendance'].kind, 'min');
    });
    
});