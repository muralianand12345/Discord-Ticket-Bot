const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'ready',
  async execute(client) {
    
    //Config Files
    const YTRoleId = client.config.STREAMER.ROLE.YOUTUBER;
    const GuildId = client.config.STREAMER.GUILD;
    const Interval = client.config.STREAMER.UPDATE_INTERVAL;
    const EliteXRP = client.config.STREAMER.ROLE.ELITEXPR;

    //Loggin Channel
    const ERROR_CHAN = client.config.STREAMER.CHAN_ID;
    const err_log = client.channels.cache.get(ERROR_CHAN);

    //auto check after 20 secs
    var GuildInfo, YTRole, Role_Total, PRRole, YT_Total, PR_Total, Role_Total;

    try {
      GuildInfo = await client.guilds.cache.get(GuildId);

      setInterval(async () => {
        YTRole = await GuildInfo.roles.cache.find(role => role.id == YTRoleId);
        PRRole = await GuildInfo.roles.cache.find(role => role.id == EliteXRP);
  
        YT_Total = await YTRole.members.map(m => m.user);
        PR_Total = await PRRole.members.map(m => m.user);
  
        return Role_Total = PR_Total.filter((element) => {
          return YT_Total.includes(element);
        });
      }, Interval); 
      
    } catch(err){ 
      console.error(err);
    }   

    //Gives Streamer role when STREAMING
    try {
      async function YTUsers(Role) {

        //per user
        for (var i = 0; i < Role.length; i++) {
          const Mention = await client.guilds.cache.get(GuildId).members.cache.get(Role[i].id);

          //no presence or offline user
          if (Mention.presence == null) {
            //err_log.send({ content: `Null Presence of Offline`});
          } else {

            //Functions                   
            async function AddRole() {
              const StreamRoleId = client.config.STREAMER.ROLE.STREAM;

              if (Mention.roles.cache?.has(StreamRoleId)) {
                return;
              } else {
                //give role
                let streamRole = await GuildInfo.roles.cache.get(StreamRoleId);
                await Mention.roles.add(streamRole).catch(err => {
                  console.log(`Add role Error ${err}`);
                });
                var embed_log = new EmbedBuilder()
                  .setDescription("**STREAMER ROLE ADDED**")
                  .setFields(
                    { name: "User Tag", value: `<@${Role[i].id}>` },
                    { name: "User Name", value: `\`${Role[i].username}\`` },
                    { name: "User ID", value: `\`${Role[i].id}\`` }
                  )
                err_log.send({ embeds: [embed_log] });
              }
            }

            async function RemoveRole() {
              const StreamRoleId = client.config.STREAMER.ROLE.STREAM;
              let streamRole = await GuildInfo.roles.cache.get(StreamRoleId);
              await Mention.roles.remove(streamRole).catch(err => {
                console.log(`Remove role Error ${err}`);
              });
            }

            //Boolean value
            //Checks the user for STREAMING type in presence
            var Bool = false;
            Mention.presence.activities.forEach(activity => {
              if (activity.type==1) {
                return Bool = true;
              }
            });

            //Add role or remove
            if (Bool == true) {
              await AddRole().catch(err => {
                err_log.send({ content: `**ERROR**\n${err}` });
              });

            } else if (Bool == false) {
              await RemoveRole().catch(err => {
                err_log.send({ content: `**ERROR**\n${err}` });
              });
            } else {
              err_log.send({ content: `**ERROR**\nReason: Bool is neither true nor false` });;
            }
          }
        }
        //--------------End of Per User Loop--------------
      }
      //--------------End of The Function--------------

      //Call function in a loop (every 20 seconds)
      setInterval(async () => {
        await YTUsers(Role_Total)
      }, Interval);

    } catch (err) {
      //Error catch
      console.log(err);
    }
  }
}
