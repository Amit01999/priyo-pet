import { MongoMemoryServer } from 'mongodb-memory-server';

const mongod = await MongoMemoryServer.create({
  instance: { port: 27117, dbName: 'priyopet_appointments' },
});

console.log('DEV_MONGO_URI=' + mongod.getUri('priyopet_appointments'));
console.log('Mongo in-memory instance running. Press Ctrl+C to stop.');

process.on('SIGINT', async () => {
  await mongod.stop();
  process.exit(0);
});
