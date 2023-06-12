//Updated version with log system and bug fix

const {
    EmbedBuilder,
    Events,
    ChannelType
} = require("discord.js");

const vcCreateModel = require('../../events/models/vcCreate.js');
const vcCreateCount = require('../../events/models/vcCreateGuild.js');

const mutex = {
    _locked: false,
    lock: () => {
        return new Promise((resolve) => {
            const tryLock = () => {
                if (!mutex._locked) {
                    mutex._locked = true;
                    resolve();
                } else {
                    setTimeout(tryLock, 10);
                }
            };
            tryLock();
        });
    },
    unlock: () => {
        mutex._locked = false;
    },
};

const cooldowns = new Set();

module.exports = {
    name: Events.VoiceStateUpdate,
    execute: async (oldState, newState, client) => {

        async function EmbedLog(Color, Process, UserID, logChan) {
            var logembed = new EmbedBuilder()
                .setColor(Color)
                .setAuthor({ name: `${Process}` })
                .setDescription(`User: <@${UserID}>`);

            if (logChan) {
                await logChan.send({ embeds: [logembed] });
            } else {
                console.error("logChan is undefined");
            }
        }

        let User = client.users.cache.get(newState.id);

        const vcCreateCounts = await vcCreateCount
            .findOne({
                guildID: newState.guild.id,
            })
            .catch((err) => console.error(err));

        var vcCheckold = await vcCreateModel
            .findOne({
                guildID: oldState.guild.id,
            })
            .catch((err) => console.error(err));

        var targetChannelId;
        if (vcCheckold) {
            targetChannelId = vcCheckold.vcID;
        }

        if (targetChannelId && oldState.channel?.id === targetChannelId) {
            const channelToUpdate = oldState.guild.channels.cache.get(targetChannelId);
            if (vcCreateCounts && vcCreateCounts.logID) {
                var logChan = client.channels.cache.get(vcCreateCounts.logID);

                if (channelToUpdate) {
                    await mutex.lock();

                    try {
                        const cooldownKey = `${oldState.guild.id}-${oldState.id}`;
                        if (cooldowns.has(cooldownKey) || channelToUpdate.members.size === 0) {
                            await vcCreateModel.findOneAndRemove({
                                guildID: oldState.guild.id,
                                vcID: targetChannelId,
                            });

                            await EmbedLog('Red', 'Channel deleted', oldState.id, logChan);

                            await channelToUpdate.delete().catch((err) => {
                                console.error(`Error deleting channel: ${err}`);
                            });

                            await vcCreateModel.findOneAndRemove({
                                guildID: oldState.guild.id,
                                userID: oldState.id,
                            });
                            cooldowns.add(cooldownKey);
                            setTimeout(() => {
                                cooldowns.delete(cooldownKey);
                            }, 5000);
                        } else {
                            //console.log(`Skipping channel deletion: ${channelToUpdate.name} (${channelToUpdate.id}) due to active members`);
                        }
                    } catch (err) {
                        console.error(err);
                    } finally {
                        mutex.unlock();
                    }
                }
            }
        }

        if (vcCreateCounts && vcCreateCounts.logID) {
            if (newState.channel?.id === vcCreateCounts.vcID) {
                var vcChecknew = await vcCreateModel.findOne({
                    guildID: newState.guild.id,
                    userID: newState.id
                }).catch(err => console.error(err));

                const newChannel = await newState.guild.channels.create({
                    name: `${vcCreateCounts.name}${User.username}`,
                    parent: vcCreateCounts.parentID,
                    userLimit: 10,
                    bitrate: 64000,
                    type: ChannelType.GuildVoice
                });

                if (newChannel) {
                    try {
                        var logChan = client.channels.cache.get(vcCreateCounts.logID);
                        await mutex.lock();

                        await newState.setChannel(newChannel);

                        await EmbedLog('Green', 'Channel Created', newState.id, logChan);

                        if (vcChecknew) {
                            await vcCreateModel.findOneAndRemove({
                                guildID: newState.guild.id,
                                userID: newState.id
                            });

                            var vcAdd = new vcCreateModel({
                                guildID: newState.guild.id,
                                vcID: newState.channel.id,
                                userID: newState.id
                            });
                            await vcAdd.save();
                        } else {
                            var vcAdd = new vcCreateModel({
                                guildID: newState.guild.id,
                                vcID: newState.channel.id,
                                userID: newState.id
                            });
                            await vcAdd.save();
                        }
                    } catch (err) {
                        console.error(err);
                        await newChannel.delete();
                    } finally {
                        mutex.unlock();
                    }
                }
            }
        }
    }
};
