const redis = require('redis');
const client = redis.createClient(); // mặc định là localhost:6379

client.on('connect', () => {
    console.log('Redis connected');
    client.set('myKey', 'hello', redis.print);
    client.get('myKey', (err, value) => {
        if (err) throw err;
        console.log('Value:', value);
        client.quit();
    });
});

client.on('error', err => {
    console.error('Redis error:', err);
});


//docker exec -it my-redis redis-cli
