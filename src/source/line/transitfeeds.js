import { transitfeedsRoutes, transitfeedsTrips, transitfeedsStopTimes, transitfeedsAgencies } from '../../requests';

const CSVtoArray = text => {
    var re_valid = /^\s*(?:'[^\\]*(?:\\[\S\s][^\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,"\s\\]*(?:\s+[^,"\s\\]+)*)\s*(?:,\s*(?:'[^\\]*(?:\\[\S\s][^\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,"\s\\]*(?:\s+[^,"\s\\]+)*)\s*)*$/;
    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
    // Return NULL if input string is not well formed CSV string.
    if (!re_valid.test(text)) return null;
    var a = [];                     // Initialize array to receive values.
    text.replace(re_value, // "Walk" the string using replace with callback.
        function(m0, m1, m2, m3) {
            // Remove backslash from \' in single quoted values.
            if      (m1 !== undefined) a.push(m1.replace(/\\'/g, '\''));
            // Remove backslash from \" in double quoted values.
            else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '\''));
            else if (m3 !== undefined) a.push(m3);
            return ''; // Return empty string.
        });
    // Handle special case of empty last value.
    if (/,\s*$/.test(text)) a.push('');
    return a;
};

const handleCSV = csv => {
    var lines = csv.trim().split('\n');
    lines.splice(0, 1);
    return lines;
};

export const lines = async () => {
    var routes      = await getRoutes();

    return routes;
};

export const routes = async () => {
    var routes      = await getRoutes();
    var tripsByLine = await getTrips();
    var stopTimes   = await getStopTimes();

    var stopPoints = {};
    for (var line in tripsByLine) {
        var stopsByLine = [];
        for (var i = 0; i < tripsByLine[line].length; i++) {
            let trip = tripsByLine[line][i];
            if (stopTimes[trip]) {
                for(let j = 0;j < stopTimes[trip].length;j++) {
                    let stop = parseInt(stopTimes[trip][j]);
                    if (stopsByLine.indexOf(stop) == -1) {
                        stopsByLine.push(stop);
                    }
                }
            }
        }
        stopPoints[line] = stopsByLine;
    }

    for(let i=0;i<routes.length;i++) {
        let route = routes[i];
        routes[i].stopPoints = stopPoints[route.id];
    }

    return routes;
};

export const agencies = async () => {
    return await getAgencies();
};

const getRoutes = async () => {
    var routes = handleCSV(await transitfeedsRoutes());
    return routes.map(compileRoute);
};

const getTrips = async () => {
    var tripsRaw = handleCSV(await transitfeedsTrips());
    var trips = {};
    for (let i=0;i<tripsRaw.length;i++) {
        let trip = CSVtoArray(tripsRaw[i]);
        if (!trips[trip[0]]) {
            trips[trip[0]] = [];
        }
        trips[trip[0]].push(trip[2]);
    }
    return trips;
};

const getStopTimes = async () => {
    var stopTimesRaw = handleCSV(await transitfeedsStopTimes());
    var stopTimes = {};
    for (let i=0;i<stopTimesRaw.length;i++) {
        let stopTime = CSVtoArray(stopTimesRaw[i]);
        if (!stopTimes[stopTime[0]]) {
            stopTimes[stopTime[0]] = [];
        }
        stopTimes[stopTime[0]].push(stopTime[3]);
    }
    return stopTimes;
};

const getAgencies = async () => {
    var agenciesRaw = handleCSV(await transitfeedsAgencies());
    var agencies = {};
    for (let i=0;i<agenciesRaw.length;i++) {
        let agency = CSVtoArray(agenciesRaw[i]);
        if (!agencies[agency[1].substring(0,3)]) {
            agencies[agency[1].substring(0,3)] = agency[0];
        }
    }
    return agencies;

};

const compileRoute = route => {
    var values = CSVtoArray(route);
    var type = null;
    switch (values[5]) {
    case '0':
        type = 'tram';
        break;
    case '1':
        type = 'subway';
        break;
    case '2':
        type = 'train';
        break;
    case '3':
        type = 'bus';
        break;
    case '4':
        type = 'ferry';
        break;
    case '5':
        type = 'cable-car';
        break;
    case '6':
        type = 'gondola';
        break;
    case '7':
        type = 'funicular';
        break;
    }

    var name = values[0].substr(values[0].lastIndexOf(':') + 1);

    return {
        id:        values[0],
        type:      type,
        name:      name,
        long_name: values[3],
    };
};
