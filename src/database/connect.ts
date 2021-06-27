import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
mongoose.set('useFindAndModify', false);

async function connect(url: string) {
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
  return console.log('[MONGOOSE] Connected');
}
export default connect;
