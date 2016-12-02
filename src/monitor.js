export default async (ctx, next) => {
    const startTime = Date.now();
    await next();
    const endTime = Date.now();

    const responseTime = endTime - startTime;
    console.log(`Response Time: ${responseTime}ms`);
};
