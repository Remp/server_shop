const io = require('socket.io');
const mongodb = require('mongodb').MongoClient;
const connectionString = 'mongodb://localhost:27017';
const {fromJS} = require('immutable');

const server = new io();

server.on('connect', socket => {
    socket.on('products_request', data => {
        /*
        data: {
            collection: value,
            filter: value
        }
         */
        mongodb.connect(connectionString, (err, client) => {
            if (err){
                socket.emit('db_connection_failed');
                return;
            }
            const col = client.db('shop_v2').collection(data.collection);
            col.find(data.filter).toArray((err, res) => {
                if (err){
                    socket.emit('db_connection_failed');
                    client.close();
                    return;
                }
                socket.emit('get_products', fromJS({
                    products: res,
                    error: ''
                }));
                client.close();
            });
        });
    })
})

server.listen(7777);
console.log('server runs localhost:7777')