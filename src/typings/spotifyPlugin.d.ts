declare module '@distube/spotify' {

    import distube from 'distube'
    import light from 'discord.js-light';

    class SpotifyPlugin extends distube.CustomPlugin {
        constructor(options: { parallel: boolean })
        play(voiceChannel: light.VoiceChannel | light.StageChannel, url: string, member: light.GuildMember, textChannel: light.TextChannel | light.TextChannel | light.NewsChannel, skip: boolean): Promise<void>
        search(url: string): Promise<void>

    }

    export default SpotifyPlugin

}