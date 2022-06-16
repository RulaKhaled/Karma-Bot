const { updateKarma, getKarmaPoints } = require('./firebase/firebase.utils');
require('dotenv').config();
//this is fform the test1
//this is from test2
//last third test 
const { Client } = require('discord.js');
const client = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const KARMA_PREFIX = '!karma'
const BOT_ID = '858477015066083348'
const karmaEmojis = new Map([
    ["⭐", 1],
    ["🌟", 5],
    ["🤩", 15],
    ["🏆", 25]
]);

client.on("ready", () => {
    console.log(`Welcome ${client.user.tag}`)
});

client.on('message', msg => {
    if (msg.content.startsWith(KARMA_PREFIX)) {
        getKarmaPoints(msg.author.id).then(res => {
            let encourage;
            if (res < 100) {
                encourage = "can't wait for the first 💯 "
            } else if (res >= 100 && res < 500) {
                encourage = "nice! I'm waiting for the 500 👏 "
            } else {
                encourage = " AMAZING 😎 "
            }
            msg.reply(`**You have ${res} karma points**, _${encourage}_`)
        }).catch(err => {
            console.error("error getting karma points", err)
        })
    }

    const reaction = msg.content.split(" ")[0];
    if (karmaEmojis.has(reaction)) {
        if (msg.content.split(" for ").length !== 2) return;
        const member = msg.member;
        const postAuthor = msg.mentions.members.first();
        if (postAuthor && BOT_ID !== postAuthor.id && (postAuthor.id !== member.id)) {
            let flag = checkMods(member);
            if (flag || reaction == "⭐") {
                points = karmaEmojis.get(reaction);
                updateKarma(postAuthor.user, points).then(res => {
                    console.log(res);
                }).catch(err => {
                    console.error(err);
                })
            }
        }
    }
});

const checkMods = (member) => {
    const allowedRoles = ["Guards [Mods]", "The NPCs (dev team)"];
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

const handleReactionMessage = (reaction, user) => {
    const reactionName = reaction.emoji.name;
    const member = reaction.message.guild.members.cache.get(user.id);
    let flag = checkMods(member);
    return { reactionName, flag };
}

client.on('messageReactionAdd', async (reaction, user) => {
    const reactionMsg = await reaction.fetch();
    const author = reactionMsg.message.author;
    if (user.id === author.id || author.bot) return;
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
    if (user.id === author.id || author.bot) return;
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
