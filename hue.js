const http = require('http');

const HOST = process.env.HUE_BRIDGE;
const USER = process.env.HUE_USER;

async function setAllToColor(colorTemp) {
    const allLights = await getAllLights();

    setLightsToColor(allLights, colorTemp);
}

async function getAllLights() {
    const options = {
        host: HOST,
        port: 80,
        path: `/api/${USER}/lights`,
        method: 'GET'
    };

    const res = await httpRequest(options);
    const lights = JSON.parse(res);

    const lightIds = [];

    for (const lightId in lights) {
        lightIds.push(lightId);
    }

    return lightIds;
}

async function setLightsToColor(lights, ct) {
    for (const light of lights) {
        await setColor(light, ct);
    }
}

async function setColor(id, ct) {
    const state = await getLightState(id);
    const lightWasOn = state.on;
    let update = { ct };

    if (!lightWasOn) {
        update = {
            ...update,
            on: true,
            transitiontime: 0,
            bri: 1
        };
    }

    await updateState(id, update);

    if (!lightWasOn) {
        await updateState(id, {
            bri: state.bri,
            transitiontime: 65534
        });

        await updateState(id, {
            on: false
        });
    }
}

async function getLightState(id) {
    const options = {
        host: HOST,
        port: 80,
        path: `/api/${USER}/lights/${id}`,
        method: 'GET'
    };

    const res = await httpRequest(options);
    const state = JSON.parse(res).state;

    return state;
}

async function updateState(id, state) {
    const options = {
        host: HOST,
        port: 80,
        path: `/api/${USER}/lights/${id}/state`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(state) + '\n'
    };

    return await httpRequest(options);
}

async function httpRequest(options) {
    return new Promise(resolve => {
        const body = options.body;
        delete options.body;

        let responseData = '';

        const req = http.request(options, res => {
            res.setEncoding('utf8');

            res.on('data', chunk => {
                responseData += chunk;
            });

            res.on('end', () => {
                resolve(responseData);
            });
        });

        req.on('error', e => {
            console.error('There was a problem with the request: ', e);
        });

        if (body) {
            req.write(body);
        }

        req.end();
    });
}

module.exports = {
    setAllToColor,
    getAllLights,
    setColor,
    setLightsToColor,
    getLightState,
    updateState
};
