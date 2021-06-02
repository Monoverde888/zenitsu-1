import events from 'events';
const { EventEmitter } = events;
import * as eris from '@lil_marcrock22/eris-light';

interface listeners {
    filter: (aver: eris.ButtonInteraction) => boolean;
    code: string;
    max: number;
    times?: number;
    createdAt?: number;
    idle: number;
    lastIdle?: number;
    messageID: string;
    timeLimit: number;
    running?: boolean;
    onStop: (aver: listeners, reason: string) => void;
    onCollect: (message: eris.ButtonInteraction, aver: listeners) => void
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

        }, 15000);

    }

    add(all: listeners): void {

        const { max, code, filter, idle, onStop, onCollect, messageID, timeLimit } = all;

        this.listenersXD.push({
            max,
            code,
            filter,
            times: 0,
            createdAt: Date.now(),
            idle,
            lastIdle: Date.now(),
            onStop,
            onCollect,
            messageID,
            timeLimit,
            running: true
        })

    }

    listen(button: eris.ButtonInteraction): eris.ButtonInteraction[] {

        const listeners = this.listenersXD
        const poto: eris.ButtonInteraction[] = [];

        for (const listener of listeners.filter(item => item.running)) {
            const res = listener.filter(button);
            if (res && (listener.messageID == button.message.id)) {
                if (listener.max && listener.max === listener.times) {
                    this.stop(listener, 'max');
                }
                else {
                    listener.onCollect(button, listener);
                    listener.lastIdle = Date.now();
                    listener.times += 1;
                    poto.push(button);
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