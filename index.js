require('dotenv').config();
const ch = require('cheerio');
const Discord = require('discord.js');
const { request } = require('undici');

/**
 * Returns a parsed GET request
 * @param {*} body 
 * @returns JSON data
 */
async function getJSON(body) {
    let fullBody = '';

    for await (const data of body) {
        fullBody += data.toString(); 
    }

    return JSON.parse(fullBody);
}

const url = {
    root: 'https://earlym.org',
    transform: ((body) => {
        return ch.load(body);
    }),
};

const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES
    ]
});

/*********************************
 *             CLIENT            *
 *********************************/

client.on('ready', () => {
    console.log(`Logged as ${client.user.tag}!`);
});

// Command 'get'
client.on('message', async msg=> {
    if (msg.content === 'get') {
        const earlymanga = await request(url.root);   // GET request to earlymanga
        // const { file } = await getJSON(earlymanga.body)
        console.log(url.transform(earlymanga));
        msg.reply('got');
    }
});

// Command 'latest'
client.on('message', msg => {
    if (msg.content === '!latest') {
        msg.reply('nothing');
    }
});

// Adds role 'weebNewsletter'
client.on('message', msg => {
        if (msg.content === '!sub') {
            let weebNewsletter = msg.guild.roles.cache.get("987060544404078636");
            let member = msg.member;
            // checking if member has role
            if (member.roles.cache.has(weebNewsletter.id)) {
                msg.reply('You are already subbed to the Newsletter!');
                console.log(`${member.displayName} already has the role`);
            } else {
                msg.reply('Subbed to Weeb Newsletter, Welcome!');
                member.roles.add(['987060544404078636'])
                    .then(console.log)
                    .catch(console.error);
            }
        }
})

// Removes role 'weebNewsletter'
client.on('message', msg => {
    if (msg.content === '!unsub') {
        let weebNewsletter = msg.guild.roles.cache.get("987060544404078636");
        let member = msg.member;
        // checking if member has role
        if (!member.roles.cache.has(weebNewsletter.id)) {
            msg.reply('You are not subbed!')
            console.log(`${member.displayName} already has the role`)
        } else {
            msg.reply('Unsubbed to Weeb Newsletter, Why must you leave ;^; !')
            member.roles.remove(['987060544404078636'])
                .then(console.log)
                .catch(console.error)
        }
    }
})

// always last line
client.login(process.env.CLIENT_TOKEN);