import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if(!MONGODB_URI){
    throw new Error('MONGO_URI is not defind');
}

let cached = global.mongoose as {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null;
};

if(!cached){
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase(){
    if(cached.conn) return cached.conn;

if(!cached.promise){
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
}

cached.conn = await cached.promise;
console.log(cached.conn);
return cached.conn;

}


