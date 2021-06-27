import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
mongoose.set('useFindAndModify', false);

import prefix from './models/prefix.js';
import lang from './models/lang.js';
import logs from './models/logs.js';
import settings from './models/settings.js';
import model from './models/guild.js';
import c4top from './models/c4top.js';
import c4maps from './models/c4maps.js';
import profile from './models/profile.js';
import modelUser from './models/user.js';

function connect(url: string) {
  return mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(async () => {

    // Ejecutar cuando esté en la vps

    for (const i of await prefix.find()) {

      const dataLang = await lang.findOne({ id: i.id }).lean() || await lang.create({ id: i.id })
      const dataLogs = await logs.findOne({ id: i.id }).lean() || await logs.create({ id: i.id, logs: [] });
      const dataSettings = await settings.findOne({ id: i.id }).lean() || await settings.create({ id: i.id });

      const data = { ...dataLang, ...dataLogs, ...dataSettings };

      try {

        const datazo = await model.create(data);
        console.log(datazo);

      }

      catch (e) {

        console.error(e);

      }

    }


    const allFindData = await c4top.find();
    const allFindDataMaps = await c4maps.find();
    const ctm = new Set();
    while (allFindData[0]) {

      const temp = allFindData.shift();

      if (ctm.has(temp.id)) continue;

      ctm.add(temp.id);

      const datoArr = allFindData.filter(item => item.id == temp.id);
      const masDatoArr = allFindDataMaps.filter(item => item.users && item.users.includes(temp.id));
      const dataProfile = await profile.findOne({ id: temp.id }).lean() || await profile.create({ id: temp.id });

      const data: { [x: string]: any } = { ...dataProfile, c4Maps: masDatoArr };

      for (const y of ['easy', 'medium', 'hard']) {
        const datito = datoArr.find(item => item.difficulty == y)
        if (datito) {
          data['c4' + y] = { perdidas: datito.perdidas, ganadas: datito.ganadas, empates: datito.empates };
        }
      }

      try {

        const datazo = await modelUser.create(data);
        console.log(datazo);

      }

      catch (e) {

        console.error(e);

      }

    }

    return console.log('[MONGOOSE] Connected');
  });
}
export default connect;
