import events from 'events';
const { EventEmitter } = events;
import eris from 'eris-pluris';

interface listeners {
    filter: (aver: eris.Message<eris.TextableChannel>) => boolean;
    messages?: eris.Message<eris.TextableChannel>[];
    code: string;
    max: number;
    times?: number;
    createdAt?: number;
    idle: number;
    lastIdle?: number;
    channelID: string;
    timeLimit: number;
    running?: boolean;
    onStop: (aver: listeners, reason: string) => void;
    onCollect: (message: eris.Message<eris.TextableChannel>, aver: listeners) => void
}

class Listener extends EventEmitter {

    listenersXD: listeners[];

    constructor() {
        super();
        this.listenersXD = [];

        setInterval(() => {

            for (const data of this.listenersXD.filter(item => item.running)) {

                if (Date.now() > (data.lastIdle + data.idle)) {
                    this.stop(data, 'idle');
                }

                else if (Date.now() > (data.timeLimit + data.createdAt)) {
                    this.stop(data, 'time');
                }
                continue;
            }

        }, 5000);

    }

    add(all: listeners): void {

        const { max, code, filter, idle, onStop, onCollect, channelID, timeLimit } = all;

        this.listenersXD.push({
            max,
            code,
            filter,
            messages: [],
            times: 0,
            createdAt: Date.now(),
            idle,
            lastIdle: Date.now(),
            onStop,
            onCollect,
            channelID,
            timeLimit,
            running: true
        })

    }

    listen(message: eris.Message): eris.Message[] {

        const listeners = this.listenersXD
        const poto: eris.Message[] = [];
        for (const listener of listeners.filter(item => item.running)) {
            const res = listener.filter(message);
            if (res && (listener.channelID == message.channel?.id)) {
                if (listener.max && listener.max === listener.times) {

                    this.stop(listener, 'max');

                }
                else {

                    listener.onCollect(message, listener);
                    listener.lastIdle = Date.now();
                    listener.messages.push(message);
                    listener.times += 1;
                    poto.push(message);

                }
                continue;
            }
            else continue;
        }
        return poto;
    }

    stop(listener: listeners | string, reason: string): void {

        if (typeof listener == 'string') {
            const xd = this.listenersXD.find(item => item.code == listener);
            xd.running = false;
            xd.onStop(xd, reason);

        }
        else {
            listener.running = false;
            listener.onStop(listener, reason);
        }
    }

}

export default Listener;