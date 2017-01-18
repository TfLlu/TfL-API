export const index = ({ params, emit, disconnect }) => {
    emit(params);
    disconnect(() => console.log('disconnect'));
};
