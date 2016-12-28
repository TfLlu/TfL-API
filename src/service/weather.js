import * as meteolux from '../source/weather/meteolux';

export const current = async () => {
    const current = await meteolux.current();
    return current;
};
