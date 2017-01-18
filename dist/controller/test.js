'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
const index = exports.index = ({ params, emit, disconnect }) => {
    emit(params);
    disconnect(() => console.log('disconnect'));
};