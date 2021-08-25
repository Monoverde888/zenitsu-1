import mongoose from 'mongoose';

async function connect(url: string) {
    await mongoose.connect(url);
    return console.log('[MONGOOSE] Connected');
}

export default connect;
