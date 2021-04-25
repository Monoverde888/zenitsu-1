import Zenitsu from '../../Utils/Classes/client.js';
import pkg from 'discord.js-light'
import langjson from '../lang.js'

interface run {
    client?: Zenitsu;
    message?: pkg.Message;
    args?: string[];
    embedResponse?(descriptionhere: string, channel?: pkg.TextChannel): Promise<pkg.Message>;
    Hora?(date: number | Date, dia: boolean): string;
    lang?: 'es' | 'en';
    langjson?: typeof langjson
}

export default run;