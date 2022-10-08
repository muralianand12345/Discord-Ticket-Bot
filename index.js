const { ShardingManager } = require('discord.js');
require("dotenv").config();
const Token = process.env.TOKEN;

const manager = new ShardingManager('./bot.js', { token: Token });

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn()
    .then(shards => {
        shards.forEach(shard => {
            shard.on('message', message => {
                console.log(`Shard[${shard.id}] : ${message._eval} : ${message._result}`);
            });
        });
    })
    .catch(console.error);