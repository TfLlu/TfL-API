import { luxairportArrivalsAndDepartures } from '../../requests';
import moment                   from 'moment';

export const load = async () => {
    var raw = await luxairportArrivalsAndDepartures();
    return {
        departures: filterOutPast(raw['arrivals'  ].map(compilePlaneInfo)),
        arrivals:   filterOutPast(raw['departures'].map(compilePlaneInfo))
    };
};

const compilePlaneInfo = plane => {
    var scheduled = moment(plane.scheduledTime, 'HH:mm').unix();
    var estimated = moment(plane.estimatedTime, 'HH:mm').unix();

    return {
        id:          parseInt(plane.flight_id),
        airline:     plane.airlineName,
        flight:      plane.flightNumber,
        destination: plane.airportName,
        via:         handleVia(plane.airportStepover),
        scheduled:   scheduled,
        real:        estimated,
        status:      handleStatus(plane.remarks)
    };
};

const handleVia = via => {
    if (via == '') {
        return null;
    }
    return via;
};

const handleStatus = status => {
    if (status == '') {
        return null;
    }
    return status;
};

const filterOutPast = planes => {
    planes = planes.filter(plane => {
        if (plane.real) {
            return plane.real > moment().unix();
        }
        return plane.scheduled > moment().unix();
    });
    planes.sort((a,b) => a.estimated - b.estimated);
    return planes;
};
