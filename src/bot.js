const { saveArt, userGetAll, deleteArt, updateKarma, getKarmaPoints } = require('./firebase/firebase.utils');
require('dotenv').config();

const { Client, MessageAttachment, MessageReaction } = require('discord.js');
const client = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const ALL_PREFIX = '[ALL]'
const DELETE_PREFIX = '[DELETE]'
const KARMA_PREFIX = '!karma'
const BOT_ID = '858477015066083348'

client.on("ready", () => {
    console.log(`Welcome ${client.user.tag}!`)
});

client.on('message', msg => {
    const authorId = msg.author.id;
    // if (msg.attachments.toJSON().length && !msg.author.bot) {
    //     msg.attachments.forEach(attachment => {
    //         const { name, id, url } = attachment;
    //         saveArt(authorId, { name, id, url }).then(res => {
    //             msg.member.send(`if you want to delete this art, make sure to write [DELETE] ${id} in the art channel`, attachment)
    //         }).catch(err => {
    //             console.error(err);
    //         })
    //     })
    //     msg.reply("your art was uploaded successfully");
    // }

    // if (msg.content.startsWith(ALL_PREFIX)) {
    //     msg.reply(`hey ${msg.author.tag}! here's your arts!`)
    //     userGetAll(authorId).then(res => {
    //         let docs = res.docs;
    //         docs.forEach(doc => {
    //             let { name, url, authorId, id } = doc.data();
    //             let attachment = new MessageAttachment(url);
    //             msg.reply(attachment)
    //         })
    //     }).catch(err => {
    //         console.error(err)
    //     })
    // }

    // if (msg.content.startsWith(DELETE_PREFIX)) {
    //     const authorID = msg.author.id;
    //     const artId = msg.content.split(" ")[1];
    //     deleteArt(authorID, artId).then(res => {
    //         msg.member.send(res);
    //     }).catch(err => {
    //         console.error(err, "problem deleting the art");
    //     })
    // }

    //HERE .1
    if (msg.content.startsWith(KARMA_PREFIX)) {
        getKarmaPoints(msg.author.id).then(res => {
            let encourage, winner;
            if (res.karmaPoints < 100) {
                encourage = "can't wait for the first 💯 "
            } else if (res.karmaPoints >= 100 && res.karmaPoints < 500) {
                encourage = "nice! I'm waiting for the 500 👏 "
            } else {
                encourage = " AMAZING 😎 "
            }
            if (res.rank === 1) {
                winner = ", I think we have a WINNER!"
            }
            msg.reply(`You have ${res.karmaPoints} karma points, ${encourage} \n\n Your current rank is: #${res.rank}${winner ? winner : ""} 💃`)
        }).catch(err => {
            console.error("error getting karma points", err)
        })
    }
    //.2
    const reaction = msg.content.split(" ")[0];
    if (karmaEmojis.has(reaction)) {
        if (msg.content.split(" for ").length !== 2) return;
        const member = msg.member;
        const forMember = msg.mentions.members.first();
        if (forMember && BOT_ID !== forMember.id && (forMember.id !== member.id)) {
            let flag = checkMods(member);
            if (flag || reaction == "⭐") {
                points = karmaEmojis.get(reaction);
                updateKarma(forMember.user, points).then(res => {
                    console.log(res);
                }).catch(err => {
                    console.error(err);
                })
            }
        }
    }
});

const checkMods = (member) => {
    const allowedRoles = ["Guards [Mods]", "The NPCs (dev team)", "guards"];
    const memberRoles = member.roles.cache.toJSON();
    let flag = false;
    memberRoles.forEach(role => {
        if (allowedRoles.includes(role.name)) {
            flag = true;
            return;
        }
    });
    return flag;
}


//HERE .3
const karmaEmojis = new Map([
    ["⭐", 1],
    ["🌟", 5],
    ["🤩", 15],
    ["🏆", 25]
]);

const handleReactionMessage = (reaction, user) => {
    const reactionName = reaction.emoji.name;
    const member = reaction.message.guild.members.cache.get(user.id);
    let flag = checkMods(member);
    return { reactionName, flag };
}

client.on('messageReactionAdd', async (reaction, user) => {
    const reactionMsg = await reaction.fetch();
    const author = reactionMsg.message.author;
    if (author.bot) return;
    if (user.id === author.id) return;
    const { reactionName, flag } = handleReactionMessage(reaction, user);

    let points;
    if ((karmaEmojis.has(reactionName) && flag) || reactionName === "⭐") {
        points = karmaEmojis.get(reactionName);
        updateKarma(author, points).then(res => {
            console.log(res);
        }).catch(err => {
            console.error(err);
        })
    }
})

client.on("messageReactionRemove", async (reaction, user) => {
    const reactionMsg = await reaction.fetch();
    const author = reactionMsg.message.author;
    if (author.bot) return;
    if (user.id === author.id) return;
    const { reactionName, flag } = handleReactionMessage(reaction, user);

    let points;
    if ((karmaEmojis.has(reactionName) && flag) || reactionName === "⭐") {
        points = karmaEmojis.get(reactionName);
        updateKarma(author, -points).then(res => {
            console.log(res);
        }).catch(err => {
            console.error(err);
        })
    }
});



client.login(process.env.SECRET_TOKEN);
