import Cliente from '../Classes/client';
import { Message, TextChannel } from 'discord.js-light';
import json from '../lang.json'

interface run {
    client?: Cliente;
    message?: Message;
    args?: string[];
    embedResponse?(descriptionhere: string, channel?: TextChannel): Promise<Message>;
    Hora?(date: number | Date, dia: boolean): string;
    lang?: 'es' | 'en';
    langjson?: typeof json
}

export default run;