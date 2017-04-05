import { luxairportArrivalsAndDepartures } from '../../requests';
import moment                   from 'moment';

export const load = async () => {
    var raw = await luxairportArrivalsAndDepartures();
    return {
        departures: filterOutTakenOff(raw['departures'].map(compilePlaneInfo)),
        arrivals:   filterOutArrived (raw['arrivals'  ].map(compilePlaneInfo))
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
        status:      handleStatus(plane.remarks),
        statusCode:  parseInt(plane.statusCode)
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

const filterOutTakenOff = planes => {
    planes = planes.filter(plane => {
        if (plane.statusCode == 10) {
            return false;
        }
        console.log('filterOutTakenOff', plane);
        return true;
    });
    return sortByExpectedTime(planes);
};

const filterOutArrived = planes => {
    planes = planes.filter(plane => {
        if (plane.statusCode == 13) {
            return false;
        }
        console.log('filterOutArrived', plane);
        return true;
    });
    return sortByExpectedTime(planes);
};

const sortByExpectedTime = planes => {
    planes.sort((a,b) => a.scheduled - b.scheduled);
    return planes;
};
