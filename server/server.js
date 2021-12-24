import config from './../config/config';
import server from './express';
import mongoose from 'mongoose';
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);


mongoose.Promise = global.Promise 
const uri = "mongodb+srv://richard01:seun08167739200@cluster0-xsh4r.mongodb.net/eclass?retryWrites=false&w=majority";
mongoose.connect(uri)    
//mongoose.connect(config.mongoUri)
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${uri}`)
})
server.listen(config.port, () => console.log(` app listening at PORT: 4000`))
