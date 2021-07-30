import detritus from 'detritus-client';

export interface Fixed extends detritus.Structures.Interaction {
  data: detritus.Structures.InteractionDataComponent
}

type CollectorFilter<T, R, Y = any> = (param: T, param2?: Y) => R;
interface listenerType {
  filter: CollectorFilter<Fixed, boolean>;
  channelID: string;
  guildID: string;
  messageID: string;
  options: { idle: number, time: number, max: number };
  _timeTimeout: NodeJS.Timeout;
  _idleTimeout: NodeJS.Timeout;
  usages: number;
  listen: {
    onCollect: CollectorFilter<Fixed, any>;
    onStop: CollectorFilter<string, any, listenerType>;
  };
  running: boolean;
};


class ButtonCollector {
  _listeners: listenerType[]

  constructor() {
    this._listeners = [];
  }

  add(listen: {
    onCollect: CollectorFilter<Fixed, any>;
    onStop: CollectorFilter<string, any, listenerType>;
  }, filter: CollectorFilter<Fixed, boolean>, options: { idle: number, time: number, max: number }, data: { channelID: string; guildID: string; messageID: string; }) {
    this._listeners.push({
      running: true,
      filter,
      channelID: data.channelID,
      guildID: data.guildID,
      messageID: data.messageID,
      options,
      _timeTimeout: options.time ? setTimeout(() => this.stop('time', this.listeners.find(item => item.messageID == data.messageID)), options.time) : null,
      _idleTimeout: options.idle ? setTimeout(() => this.stop('idle', this.listeners.find(item => item.messageID == data.messageID)), options.idle) : null,
      usages: 0,
      listen
    })

  }

  handleInteractionCreate(interaction: Fixed) {

    for (const data of this.listeners) {

      if (data.messageID != interaction.message.id) continue;

      const resFilter = data.filter(interaction);

      if (!resFilter) continue;

      if (++data.usages == data.options.max) {

        data.listen.onCollect(interaction, data);
        data.listen.onStop('max', data);

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

        data.listen.onCollect(interaction, data);

      }

    }

  }

  handleMessageDelete(message: detritus.GatewayClientEvents.MessageDelete) {

    for (const data of this.listeners) {

      if (message.messageId == data.messageID)
        this.stop('messageDelete', data);

    }

  }

  handleMessageDeleteBulk(message: detritus.GatewayClientEvents.MessageDeleteBulk) {

    for (const data of this.listeners) {

      if (message.messages.find(item => item && item.id == data.messageID))
        this.stop('messageDelete', data)

    }

  }

  handleGuildDelete(guild: detritus.GatewayClientEvents.GuildDelete) {

    for (const data of this.listeners) {

      if (guild.guildId == data.guildID)
        this.stop('guildDelete', data);

    }

  }

  handleChannelDelete(channel: detritus.GatewayClientEvents.ChannelDelete) {

    for (const data of this.listeners) {

      if (channel.channel.id == data.channelID)
        this.stop('channelDelete', data);

    }

  }

  handleThreadDelete(thread: detritus.GatewayClientEvents.ThreadDelete) {

    for (const data of this.listeners) {

      if (thread.thread.id == data.channelID)
        this.stop('threadDelete', data);

    }

  }

  stop(reason: string, listener: listenerType) {
    if (!listener.running) return null;
    listener.running = false;
    listener.listen.onStop(reason, listener);
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

export default new ButtonCollector();
