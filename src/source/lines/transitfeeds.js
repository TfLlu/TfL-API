import { transitfeedsRoutes, transitfeedsTrips, transitfeedsStopTimes } from '../../requests';

var keys = [];

const CSVtoArray = text => {
    var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
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
    keys = lines[0].split(',');
    lines.splice(0, 1);
    return lines;
};

export const load = async () => {
    var routes = handleCSV(await transitfeedsRoutes());
    return routes.map(compileRoute);
    //var trips = handleCSV(await transitfeedsTrips());
    //return trips.map(compileTrips);
    //var stopTimes = handleCSV(await transitfeedsStopTimes());
    //return stopTimes.map(compileLines);
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
        type:      type,
        id:        values[0],
        name:      name,
        long_name: values[3],
    };
};

const compileLines = line => {
    var values = CSVtoArray(line);
    var res = {};
    for (let i = 0; i < keys.length; i++) {
        res[keys[i]] = values[i];
    }
    return res;
};
