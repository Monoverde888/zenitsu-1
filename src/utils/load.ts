import fs from 'fs/promises';
import path from 'path';
import commons from './functions/commons.js';
import detritus from 'detritus-client';
import CommandClient from './classes/commandclient.js';
import connect from '../database/connect.js';

export default async function Load({ token, mongo }: { token: string, mongo: string }) {

  await connect(mongo);

  const shardClient = new detritus.ShardClient(token, {
    cache: {
      messages: { expire: 60 * 60 * 1000 },
      emojis: false,
      applications: false,
      connectedAccounts: false,
      interactions: false,
      members: false,
      notes: false,
      presences: false,
      relationships: false,
      roles: true,
      sessions: false,
      stageInstances: false,
      typings: false,
      users: false,
      voiceCalls: false,
      voiceConnections: false,
      voiceStates: false
    },
  });

  const commandClient = new CommandClient(shardClient, {
    ratelimits: [
      { duration: 120000, limit: 40, type: 'guild' },
      { duration: 10000, limit: 5, type: 'channel' },
    ],
    mentionsEnabled: true,
    activateOnEdits: false
  });

  await commandClient.run();
  console.log(`[DETRITUS] ${shardClient.user.username} dice hola al mundo :):):):)`);

  await loadCommands(commandClient);
  await loadEvents(shardClient, commandClient);

  return { commandClient, shardClient };

}

async function loadEvents(client: detritus.ShardClient, commandClient: CommandClient) {

  const { __dirname } = commons(import.meta.url);

  const ruta = (...str: string[]) => path.join(__dirname, '..', ...str)
  const load = async (file: string, listener: detritus.ShardClient | CommandClient) => {

    const { default: RES } = await import("file:///" + ruta('events', listener.constructor.name, file));

    listener.on(RES.name, RES.bind(null, client).bind(null, commandClient));

  }

  const eventos = await fs.readdir(ruta('events', 'shardClient'));

  for (const i of eventos)
    await load(i, client);


  const eventosC = await fs.readdir(ruta('events', 'commandClient'));

  for (const i of eventosC)
    await load(i, commandClient);


}

async function loadCommands(commandClient: CommandClient) {

  const { __dirname } = commons(import.meta.url);

  const ruta = (...str: string[]) => path.join(__dirname, '..', ...str)
  const load = async (dirs: string) => {
    const commands = (await fs.readdir(ruta('commands', dirs))).filter(d => {
      return d.endsWith('.ts') || d.endsWith('.js');
    });
    for (const file of commands) {
      try {
        const { default: archivo } = await import(`file:///` + ruta('commands', dirs, file));
        commandClient.add(archivo);
      } catch (e) {
        console.log(e, file);
        break;
      }
    }
  }

  const categorys = await fs.readdir(ruta('commands'));

  for (const i of categorys) {
    await load(i);
  }

}
