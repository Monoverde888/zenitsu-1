import detritus from 'detritus-client';
import events from 'events';

export interface CollectorOptions<T = any> {
    max?: number;
    timeIdle?: number;
    timeLimit?: number;
    filter: (thing: T) => boolean | Promise<boolean>
}

class BaseCollector extends events.EventEmitter {
    message: detritus.Structures.Message;
    shardClient: detritus.ShardClient;
    options: CollectorOptions;
    running: boolean;
    usages: number;
    _idleTimeout: NodeJS.Timeout;
    _timeTimeout: NodeJS.Timeout;

    constructor(message: detritus.Structures.Message, options: CollectorOptions, shardClient: detritus.ShardClient) {
        super();
        this.message = message;
        this.shardClient = shardClient;
        this.options = options;
        this.running = true;
        this.incrementMaxListeners();
        this.usages = 0;
        if (options.timeLimit) this._timeTimeout = setTimeout(() => {
            this.stop('time'); 
        }, options.timeLimit);
        if (options.timeIdle) this._timeTimeout = setTimeout(() => {
            this.stop('idle'); 
        }, options.timeIdle);
        const subscriptions = {
            messageDelete: shardClient.subscribe('messageDelete', this.handleMessageDelete),
            messageDeleteBulk: shardClient.subscribe('messageDeleteBulk', this.handleMessageDeleteBulk),
            guildDelete: shardClient.subscribe('guildDelete', this.handleGuildDelete),
            channelDelete: shardClient.subscribe('channelDelete', this.handleChannelDelete),
            threadDelete: shardClient.subscribe('threadDelete', this.handleThreadDelete),
        };

        this.once('end', () => {

            if (this.options.timeIdle)
                clearTimeout(this._idleTimeout);
            if (this.options.timeLimit)
                clearTimeout(this._timeTimeout);

            this.removeAllListeners();
            for (const sub of Object.values(subscriptions)) {
                sub.remove();
            }
            this.decrementMaxListeners();
        });
    }

    handleMessageDelete(message: detritus.GatewayClientEvents.MessageDelete) {

        if (message.messageId == this.message.id)
            this.stop('messageDelete');

    }

    handleMessageDeleteBulk({ messages }: detritus.GatewayClientEvents.MessageDeleteBulk) {

        if (messages.some(item => item && item.id == this.message.id))
            this.stop('messageDelete');

    }

    handleGuildDelete({ guild }: detritus.GatewayClientEvents.GuildDelete) {

        if (guild.id == this.message.guildId)
            this.stop('guildDelete');

    }

    handleChannelDelete({ channel }: detritus.GatewayClientEvents.ChannelDelete) {

        if (channel.id == this.message.channelId)
            this.stop('channelDelete');

    }

    handleThreadDelete({ thread }: detritus.GatewayClientEvents.ThreadDelete) {

        if (thread.id == this.message.channelId)
            this.stop('threadDelete');

    }

    stop(reason: string) {
        if (!this.running) return;
        this.emit('end', reason);
        this.running = false;
    }

    incrementMaxListeners() {
        const maxListeners = this.shardClient.getMaxListeners();
        if (maxListeners !== 0) {
            this.shardClient.setMaxListeners(maxListeners + 1);
        }
    }

    decrementMaxListeners() {
        const maxListeners = this.shardClient.getMaxListeners();
        if (maxListeners !== 0) {
            this.shardClient.setMaxListeners(maxListeners - 1);
        }
    }


}

export default BaseCollector;