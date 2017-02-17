import dotenv from 'dotenv';
dotenv.config();

export default (key, required) => {
    if (key in process.env) {
        return process.env[key];
    }
    if (required) {
        throw `Missing "${key}" config`;
    }
    return null;
};
