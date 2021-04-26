import dotenv from 'dotenv';
const { config } = dotenv;
config();
import light from 'discord.js-light';
const { ShardingManager } = light
const sharder = new ShardingManager('./dist/index.js', {
    token: process.env.DISCORD_TOKEN,
    totalShards: "auto",
    execArgv: ['--expose-gc', '--optimize_for_size', '--max_old_space_size=150']
});

sharder
    .on("shardCreate", shardd => {
        console.log(`La shard ${shardd.id} fue creada.`)
        shardd.on('shardDisconnect', shard => console.log(`La shard ${shard.id} se desconecto.`))
            .on('shardResume', shard => console.log(`Shard ${shard.id} resumida.`))
            .on('shardReady', shard => console.log(`La shard ${shard.id} esta lista.`))
    });

sharder.spawn();