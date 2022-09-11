const { 
    SlashCommandBuilder,
    EmbedBuilder
 } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giverole')
        .setDescription("Give/Remove job roles to a user")
        .addUserOption(
            option =>
            option.setName('user')
            .setDescription('The user you want to give or remove role')
            .setRequired(true)
        ),
    async execute(interaction, client) {

        const user = interaction.options.getUser('user');

        //Err
       const errTag = client.config.ERR_LOG.ERR_TAG;
       const err_chanid = client.config.ERR_LOG.CHAN_ID
       const err_logchan = client.channels.cache.get(err_chanid);     
           
       //log
       const commandName = "GIVEROLE";
       const logEmbed = new EmbedBuilder()
       .setColor("Green")
       .addFields(
           { name: "Command", value: `${commandName}`},
           { name: "User", value: `<@!${interaction.user.id}>`},
           { name: "Channel", value: `<#${interaction.channel.id}>`},
           { name: "To User", value: `<#${user.id}>`}
       )
       err_logchan.send({ embeds: [logEmbed]}); 

        const Mention = client.guilds.cache.get(interaction.guild.id).members.cache.get(user.id);

        const ECPD_ROLE = client.config.JOBS.ECPD.ID;
        const ECPD_HEAD = client.config.JOBS.ECPD.HROLE_ID;

        const ECMS_ROLE = client.config.JOBS.ECMS.ID;
        const ECMS_HEAD = client.config.JOBS.ECMS.HROLE_ID;

        const RTO_ROLE = client.config.JOBS.RTO.ID;
        const RTO_HEAD = client.config.JOBS.RTO.HROLE_ID;

        const LAWYER_ROLE = client.config.JOBS.LAWYER.ID;
        const LAWYER_HEAD = client.config.JOBS.LAWYER.HROLE_ID;

        const NEWS_ROLE = client.config.JOBS.NEWS.ID;
        const NEWS_HEAD = client.config.JOBS.NEWS.HROLE_ID;

        try{
            const commandUser = interaction.member;

            if ( commandUser.roles.cache?.has(`${ECPD_HEAD}`)) {
                ECPD();
            } else if ( commandUser.roles.cache?.has(`${ECMS_HEAD}`)) {
                ECMS();
            } else if ( commandUser.roles.cache?.has(`${RTO_HEAD}`)) {
                RTO();
            } else if ( commandUser.roles.cache?.has(`${LAWYER_HEAD}`)) {
                LAWYER();
            } else if ( commandUser.roles.cache?.has(`${NEWS_HEAD}`)) {
                NEWS();
            } else {
                const ReplyEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("You do not have the required permission")

                return interaction.reply({
                    embeds: [ReplyEmbed],
                    ephemeral: true
                });
            }

            //ECPD
            function ECPD() {
                if ( Mention.roles.cache?.has(`${ECPD_ROLE}`)) {
                    let role = interaction.guild.roles.cache.get(`${ECPD_ROLE}`);
                    Mention.roles.remove(role).catch(err => {
                        const commandName = "giverole.js";
                        const errTag = client.config.ERR_LOG.ERR_TAG;
                        const errEmbed = new EmbedBuilder()
                        .setTitle("ERROR")
                        .setColor("Red")
                        .setDescription(`${err}`)
                        .addFields(
                            { name: "File", value: `${commandName}`},
                            { name: "User", value: `<@!${interaction.user.id}>`},
                            { name: "Channel", value: `<#${interaction.channel.id}>`},
                            { name: "Line", value: "Unable to Remove Role!"}
                        )
                        client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
                    });
                    const mainPage = new EmbedBuilder()
                        .setTitle("ECPD")
                        .setDescription("ROLE REMOVED")
                        .setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}`})
                        .setColor('Blue')
                        .addFields(
                            {
                                name: `To`,
                                value: `<@${Mention.id}>`,
                                inline: true,
                            },
                            {
                                name: `By`,
                                value: `<@${interaction.user.id}>`,
                                inline: true,
                            }
                        )
        
                    
                    const ReplyEmbed = new EmbedBuilder()
                    .setColor("Green")
                    .setDescription(`**ECPD** Role Removed From <@${Mention.id}>`)
        
                    interaction.reply({
                        embeds: [ReplyEmbed],
                        ephemeral: true
                    });
                    return client.channels.cache.get(client.config.JOBS.LOGS.CHAN_ID).send({embeds: [mainPage] });
    
                } else {
                    let role = interaction.guild.roles.cache.get(`${ECPD_ROLE}`);
                    Mention.roles.add(role).catch(err => {
                        const commandName = "giverole.js";
                        const errTag = client.config.ERR_LOG.ERR_TAG;
                        const errEmbed = new EmbedBuilder()
                        .setTitle("ERROR")
                        .setColor("Red")
                        .setDescription(`${err}`)
                        .addFields(
                            { name: "File", value: `${commandName}`},
                            { name: "User", value: `<@!${interaction.user.id}>`},
                            { name: "Channel", value: `<#${interaction.channel.id}>`},
                            { name: "Line", value: "Unable to Add Role!"}
                        )
                        client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
                    });
                    const mainPage = new EmbedBuilder()
                        .setTitle("ECPD")
                        .setDescription("ROLE ADDED")
                        .setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}`})
                        .setColor('Blue')
                        .addFields(
                            {
                                name: `To`,
                                value: `<@${Mention.id}>`,
                                inline: true,
                            },
                            {
                                name: `By`,
                                value: `<@${interaction.user.id}>`,
                                inline: true,
                            }
                        )
        
                    const ReplyEmbed = new EmbedBuilder()
                    .setColor("Green")
                    .setDescription(`**ECPD** Role Given To <@${Mention.id}>`)
            
                    interaction.reply({
                        embeds: [ReplyEmbed],
                        ephemeral: true
                    });
                    return client.channels.cache.get(client.config.JOBS.LOGS.CHAN_ID).send({embeds: [mainPage] });
                }
            }

            //ECMS
            function ECMS() {
                if ( Mention.roles.cache?.has(`${ECMS_ROLE}`)) {
                    let role = interaction.guild.roles.cache.get(`${ECMS_ROLE}`);
                    Mention.roles.remove(role).catch(err => {
                        const commandName = "giverole.js";
                        const errTag = client.config.ERR_LOG.ERR_TAG;
                        const errEmbed = new EmbedBuilder()
                        .setTitle("ERROR")
                        .setColor("Red")
                        .setDescription(`${err}`)
                        .addFields(
                            { name: "File", value: `${commandName}`},
                            { name: "User", value: `<@!${interaction.user.id}>`},
                            { name: "Channel", value: `<#${interaction.channel.id}>`},
                            { name: "Line", value: "Unable to Remove Role!"}
                        )
                        client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
                    });
                    const mainPage = new EmbedBuilder()
                        .setTitle("ECMS")
                        .setDescription("ROLE REMOVED")
                        .setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}`})
                        .setColor('Blue')
                        .addFields(
                            {
                                name: `To`,
                                value: `<@${Mention.id}>`,
                                inline: true,
                            },
                            {
                                name: `By`,
                                value: `<@${interaction.user.id}>`,
                                inline: true,
                            }
                        )
        
                    const ReplyEmbed = new EmbedBuilder()
                    .setColor("Green")
                    .setDescription( `**ECMS** Role Removed From <@${Mention.id}>`)
                
                    interaction.reply({
                        embeds: [ReplyEmbed],
                        ephemeral: true
                    });
                    return client.channels.cache.get(client.config.JOBS.LOGS.CHAN_ID).send({embeds: [mainPage] });
    
                } else {
                    let role = interaction.guild.roles.cache.get(`${ECMS_ROLE}`);
                    Mention.roles.add(role).catch(err => {
                        const commandName = "giverole.js";
                        const errTag = client.config.ERR_LOG.ERR_TAG;
                        const errEmbed = new EmbedBuilder()
                        .setTitle("ERROR")
                        .setColor("Red")
                        .setDescription(`${err}`)
                        .addFields(
                            { name: "File", value: `${commandName}`},
                            { name: "User", value: `<@!${interaction.user.id}>`},
                            { name: "Channel", value: `<#${interaction.channel.id}>`},
                            { name: "Line", value: "Unable to Add Role!"}
                        )
                        client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
                    });
                    const mainPage = new EmbedBuilder()
                        .setTitle("ECMS")
                        .setDescription("ROLE ADDED")
                        .setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}`})
                        .setColor('Blue')
                        .addFields(
                            {
                                name: `To`,
                                value: `<@${Mention.id}>`,
                                inline: true,
                            },
                            {
                                name: `By`,
                                value: `<@${interaction.user.id}>`,
                                inline: true,
                            }
                        )
        
                    const ReplyEmbed = new EmbedBuilder()
                    .setColor("Green")
                    .setDescription(`**ECMS** Role Given To <@${Mention.id}>`)
                    
                    interaction.reply({
                        embeds: [ReplyEmbed],
                        ephemeral: true
                    });
                    return client.channels.cache.get(client.config.JOBS.LOGS.CHAN_ID).send({embeds: [mainPage] });
                }
            }

            //RTO
            function RTO() {
                if ( Mention.roles.cache?.has(`${RTO_ROLE}`)) {
                    let role = interaction.guild.roles.cache.get(`${RTO_ROLE}`);
                    Mention.roles.remove(role).catch(err => {
                        const commandName = "giverole.js";
                        const errTag = client.config.ERR_LOG.ERR_TAG;
                        const errEmbed = new EmbedBuilder()
                        .setTitle("ERROR")
                        .setColor("Red")
                        .setDescription(`${err}`)
                        .addFields(
                            { name: "File", value: `${commandName}`},
                            { name: "User", value: `<@!${interaction.user.id}>`},
                            { name: "Channel", value: `<#${interaction.channel.id}>`},
                            { name: "Line", value: "Unable to Remove Role!"}
                        )
                        client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
                    });
                    const mainPage = new EmbedBuilder()
                        .setTitle("RTO")
                        .setDescription("ROLE REMOVED")
                        .setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}`})
                        .setColor('Blue')
                        .addFields(
                            {
                                name: `To`,
                                value: `<@${Mention.id}>`,
                                inline: true,
                            },
                            {
                                name: `By`,
                                value: `<@${interaction.user.id}>`,
                                inline: true,
                            }
                        )
        
                    const ReplyEmbed = new EmbedBuilder()
                    .setColor("Green")
                    .setDescription(`**RTO** Role Removed From <@${Mention.id}>`)
                        
                    interaction.reply({
                        embeds: [ReplyEmbed],
                        ephemeral: true
                    });
                    return client.channels.cache.get(client.config.JOBS.LOGS.CHAN_ID).send({embeds: [mainPage] });
    
                } else {
                    let role = interaction.guild.roles.cache.get(`${RTO_ROLE}`);
                    Mention.roles.add(role).catch(err => {
                        const commandName = "giverole.js";
                        const errTag = client.config.ERR_LOG.ERR_TAG;
                        const errEmbed = new EmbedBuilder()
                        .setTitle("ERROR")
                        .setColor("Red")
                        .setDescription(`${err}`)
                        .addFields(
                            { name: "File", value: `${commandName}`},
                            { name: "User", value: `<@!${interaction.user.id}>`},
                            { name: "Channel", value: `<#${interaction.channel.id}>`},
                            { name: "Line", value: "Unable to Add Role!"}
                        )
                        client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
                    });
                    const mainPage = new EmbedBuilder()
                        .setTitle("RTO")
                        .setDescription("ROLE ADDED")
                        .setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}`})
                        .setColor('Blue')
                        .addFields(
                            {
                                name: `To`,
                                value: `<@${Mention.id}>`,
                                inline: true,
                            },
                            {
                                name: `By`,
                                value: `<@${interaction.user.id}>`,
                                inline: true,
                            }
                        )
        
                    const ReplyEmbed = new EmbedBuilder()
                    .setColor("Green")
                    .setDescription(`**RTO** Role Given To <@${Mention.id}>`)
                            
                    interaction.reply({
                        embeds: [ReplyEmbed],
                        ephemeral: true
                    });
                    return client.channels.cache.get(client.config.JOBS.LOGS.CHAN_ID).send({embeds: [mainPage] });
                }
            }

            //LAWYER
            function LAWYER() {
                if ( Mention.roles.cache?.has(`${LAWYER_ROLE}`)) {
                    let role = interaction.guild.roles.cache.get(`${LAWYER_ROLE}`);
                    Mention.roles.remove(role).catch(err => {
                        const commandName = "giverole.js";
                        const errTag = client.config.ERR_LOG.ERR_TAG;
                        const errEmbed = new EmbedBuilder()
                        .setTitle("ERROR")
                        .setColor("Red")
                        .setDescription(`${err}`)
                        .addFields(
                            { name: "File", value: `${commandName}`},
                            { name: "User", value: `<@!${interaction.user.id}>`},
                            { name: "Channel", value: `<#${interaction.channel.id}>`},
                            { name: "Line", value: "Unable to Remove Role!"}
                        )
                        client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
                    });
                    const mainPage = new EmbedBuilder()
                        .setTitle("LAWYER")
                        .setDescription("ROLE REMOVED")
                        .setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}`})
                        .setColor('Blue')
                        .addFields(
                            {
                                name: `To`,
                                value: `<@${Mention.id}>`,
                                inline: true,
                            },
                            {
                                name: `By`,
                                value: `<@${interaction.user.id}>`,
                                inline: true,
                            }
                        )
        
                    const ReplyEmbed = new EmbedBuilder()
                    .setColor("Green")
                    .setDescription( `**LAWYER** Role Removed From <@${Mention.id}>`)
                            
                    interaction.reply({
                        embeds: [ReplyEmbed],
                        ephemeral: true
                    });
                    return client.channels.cache.get(client.config.JOBS.LOGS.CHAN_ID).send({embeds: [mainPage] });
    
                } else {
                    let role = interaction.guild.roles.cache.get(`${LAWYER_ROLE}`);
                    Mention.roles.add(role).catch(err => {
                        const commandName = "giverole.js";
                        const errTag = client.config.ERR_LOG.ERR_TAG;
                        const errEmbed = new EmbedBuilder()
                        .setTitle("ERROR")
                        .setColor("Red")
                        .setDescription(`${err}`)
                        .addFields(
                            { name: "File", value: `${commandName}`},
                            { name: "User", value: `<@!${interaction.user.id}>`},
                            { name: "Channel", value: `<#${interaction.channel.id}>`},
                            { name: "Line", value: "Unable to Add Role!"}
                        )
                        client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
                    });
                    const mainPage = new EmbedBuilder()
                        .setTitle("LAWYER")
                        .setDescription("ROLE ADDED")
                        .setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}`})
                        .setColor('Blue')
                        .addFields(
                            {
                                name: `To`,
                                value: `<@${Mention.id}>`,
                                inline: true,
                            },
                            {
                                name: `By`,
                                value: `<@${interaction.user.id}>`,
                                inline: true,
                            }
                        )
        
                    const ReplyEmbed = new EmbedBuilder()
                    .setColor("Green")
                    .setDescription( `**LAWYER** Role Given To <@${Mention.id}>`)
                            
                    interaction.reply({
                        embeds: [ReplyEmbed],
                        ephemeral: true
                    });
                    return client.channels.cache.get(client.config.JOBS.LOGS.CHAN_ID).send({embeds: [mainPage] });
                }
            }

            //NEWS
            function NEWS() {
                if ( Mention.roles.cache?.has(`${NEWS_ROLE}`)) {
                    let role = interaction.guild.roles.cache.get(`${NEWS_ROLE}`);
                    Mention.roles.remove(role).catch(err => {
                        const commandName = "giverole.js";
                        const errTag = client.config.ERR_LOG.ERR_TAG;
                        const errEmbed = new EmbedBuilder()
                        .setTitle("ERROR")
                        .setColor("Red")
                        .setDescription(`${err}`)
                        .addFields(
                            { name: "File", value: `${commandName}`},
                            { name: "User", value: `<@!${interaction.user.id}>`},
                            { name: "Channel", value: `<#${interaction.channel.id}>`},
                            { name: "Line", value: "Unable to Remove Role!"}
                        )
                        client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
                    });
                    const mainPage = new EmbedBuilder()
                        .setTitle("NEWS")
                        .setDescription("ROLE REMOVED")
                        .setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}`})
                        .setColor('Blue')
                        .addFields(
                            {
                                name: `To`,
                                value: `<@${Mention.id}>`,
                                inline: true,
                            },
                            {
                                name: `By`,
                                value: `<@${interaction.user.id}>`,
                                inline: true,
                            }
                        )
        
                    const ReplyEmbed = new EmbedBuilder()
                    .setColor("Green")
                    .setDescription( `**NEWS** Role Removed From <@${Mention.id}>`)
                            
                    interaction.reply({
                        embeds: [ReplyEmbed],
                        ephemeral: true
                    });
                    return client.channels.cache.get(client.config.JOBS.LOGS.CHAN_ID).send({embeds: [mainPage] });
    
                } else {
                    let role = interaction.guild.roles.cache.get(`${NEWS_ROLE}`);
                    Mention.roles.add(role).catch(err => {
                        const commandName = "giverole.js";
                        const errTag = client.config.ERR_LOG.ERR_TAG;
                        const errEmbed = new EmbedBuilder()
                        .setTitle("ERROR")
                        .setColor("Red")
                        .setDescription(`${err}`)
                        .addFields(
                            { name: "File", value: `${commandName}`},
                            { name: "User", value: `<@!${interaction.user.id}>`},
                            { name: "Channel", value: `<#${interaction.channel.id}>`},
                            { name: "Line", value: "Unable to Add Role!"}
                        )
                        client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
                    });
                    const mainPage = new EmbedBuilder()
                        .setTitle("NEWS")
                        .setDescription("ROLE ADDED")
                        .setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}`})
                        .setColor('Blue')
                        .addFields(
                            {
                                name: `To`,
                                value: `<@${Mention.id}>`,
                                inline: true,
                            },
                            {
                                name: `By`,
                                value: `<@${interaction.user.id}>`,
                                inline: true,
                            }
                        )

                    const ReplyEmbed = new EmbedBuilder()
                    .setColor("Green")
                    .setDescription( `**NEWS** Role Given To <@${Mention.id}>`)
                            
                    interaction.reply({
                        embeds: [ReplyEmbed],
                        ephemeral: true
                    });
                    return client.channels.cache.get(client.config.JOBS.LOGS.CHAN_ID).send({embeds: [mainPage] });
                }
            }
     
        } catch(err) {
            const errEmbed = new EmbedBuilder()
            .setTitle("ERROR")
            .setColor("Red")
            .setDescription(`${err}`)
            .addFields(
                { name: "Command", value: `${commandName}`},
                { name: "User", value: `<@!${interaction.user.id}>`},
                { name: "Channel", value: `<#${interaction.channel.id}>`}
            )
            err_logchan.send({ content: `${errTag}`, embeds: [errEmbed] });
        }
    }
};