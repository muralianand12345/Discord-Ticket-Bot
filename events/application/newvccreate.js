const {
    EmbedBuilder,
    Events,
    ChannelType
} = require("discord.js");

const vcCreateModel = require('../../events/models/vcCreate.js');
const vcCreateCount = require('../../events/models/vcCreateGuild.js');

module.exports = {
    name: Events.VoiceStateUpdate,
    execute: async (oldState, newState, client) => {
        let User = client.users.cache.get(newState.id);

        const vcCreateCounts = await vcCreateCount.findOne({
            guildID: newState.guild.id
        }).catch(err => console.log(err));

        var vcChecknew = await vcCreateModel.findOne({
            guildID: newState.guild.id,
            userID: newState.id
        }).catch(err => console.log(err));

        if (vcCreateCounts) {

            if (newState.channel?.id === vcCreateCounts.vcID) {
                const newChannel = await newState.guild.channels.create({
                    name: `${vcCreateCounts.name}${User.username}`, //🎤┆
                    parent: vcCreateCounts.parentID,
                    userLimit: 10,
                    bitrate: 64000,
                    type: ChannelType.GuildVoice
                });

                await newState.setChannel(newChannel).then(async (a) => {

                    /*if (!vcCreateCounts) {
                        vcCreateCounts = new vcCreateCount({
                            guildID: newState.guild.id,
                            vcCreateCount: 0
                        });
                        await vcCreateCounts.save();
                    }

                    vcCreateCounts.vcCreateCount += 1;
                    await vcCreateCounts.save();*/


                    if (vcChecknew) {
                        await vcCreateModel.findOneAndRemove({
                            guildID: newState.guild.id,
                            userID: newState.id
                        });

                        var vcAdd = await new vcCreateModel({
                            guildID: newState.guild.id,
                            vcID: newState.channel.id,
                            userID: newState.id
                        });
                        await vcAdd.save();

                    } else if (!vcChecknew) {
                        var vcAdd = await new vcCreateModel({
                            guildID: newState.guild.id,
                            vcID: newState.channel.id,
                            userID: newState.id
                        });
                        await vcAdd.save();
                    }
                });
            }
        }

        var vcCheckold = await vcCreateModel.findOne({
            guildID: oldState.guild.id,
        }).catch(err => console.log(err));

        var targetChannelId;
        if (vcCheckold) {
            targetChannelId = vcCheckold.vcID;
        }

        if (targetChannelId && oldState.channel?.id === targetChannelId) {
            const channelToUpdate = oldState.guild.channels.cache.get(targetChannelId);
            if (channelToUpdate && channelToUpdate.members.size === 0) {
                await channelToUpdate.delete().then(async () => {
                    await vcCreateModel.findOneAndRemove({
                        guildID: oldState.guild.id,
                        userID: oldState.id
                    });
                });
            }
        }
    }
}