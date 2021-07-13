import detritus from 'detritus-client';

type CollectorFilter<T, R> = (param: T) => R;
interface listenerType {
  filter: CollectorFilter<detritus.GatewayClientEvents.MessageCreate, boolean>;
  channelID: string;
  guildID: string;
  options: { idle: number, time: number, max: number };
  _timeTimeout?: NodeJS.Timeout;
  _idleTimeout?: NodeJS.Timeout;
  usages: number;
  listen: {
    onCollect: CollectorFilter<detritus.GatewayClientEvents.MessageCreate, any>;
    onStop: CollectorFilter<string, any>;
  };
  running: boolean;
  CODE: string;
};


class MessageCollector {
  _listeners: listenerType[]

  constructor() {
    this._listeners = [];
  }

  add(listen: {
    onCollect: CollectorFilter<detritus.GatewayClientEvents.MessageCreate, any>;
    onStop: CollectorFilter<string, any>;
  }, filter: CollectorFilter<detritus.GatewayClientEvents.MessageCreate, boolean>, options: { idle: number, time: number, max: number; CODE: string }, data: { channelID: string; guildID: string; }) {

    const datazo: listenerType = {
      running: true,
      filter,
      channelID: data.channelID,
      guildID: data.guildID,
      options,
      usages: 0,
      listen,
      CODE: options.CODE,
    }

    this._listeners.push(datazo);

    datazo._idleTimeout = options.idle ? setTimeout(() => this.stop('time', datazo), options.time) : null;
    datazo._idleTimeout = options.idle ? setTimeout(() => this.stop('idle', datazo), options.idle) : null;

  }

  handleMessageCreate(interaction: detritus.GatewayClientEvents.MessageCreate) {

    for (const data of this.listeners) {

      if (data.channelID != interaction.message.channelId) continue;

      if (!data.filter(interaction)) return false;

      if (++data.usages == data.options.max) {

        data.listen.onCollect(interaction);
        data.listen.onStop('max');

      }

      else {

        if (data.options.idle) {
          clearTimeout(data._idleTimeout);
          data._idleTimeout = setTimeout(() => this.stop('idle', data), data.options.idle);
        }
        if (data.options.time) {
          clearTimeout(data._timeTimeout);
          data._timeTimeout = setTimeout(() => this.stop('time', data), data.options.time);
        }

        data.listen.onCollect(interaction);

      }

    }

  }

  handleGuildDelete(guild: detritus.GatewayClientEvents.GuildDelete) {

    for (const data of this.listeners) {

      if (guild.guildId == data.guildID)
        return this.stop('guildDelete', data);
      return false;

    }

  }

  handleChannelDelete(channel: detritus.GatewayClientEvents.ChannelDelete) {

    for (const data of this.listeners) {

      if (channel.channel.id == data.channelID)
        return this.stop('channelDelete', data);
      return false;

    }

  }

  stop(reason: string, listener: listenerType) {

    listener.running = false;
    listener.listen.onStop(reason);
    if (listener.options.idle) {
      clearTimeout(listener._idleTimeout);
      listener._idleTimeout = null;
    }
    if (listener.options.time) {
      clearTimeout(listener._timeTimeout);
      listener._timeTimeout = null;
    }
    return this;

  }

  get listeners() {
    return this._listeners.filter(x => x.running);
  }

}

export default new MessageCollector();
