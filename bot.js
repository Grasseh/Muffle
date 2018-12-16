const Discord = require('discord.js');
const auth = require('./auth.json');
const User = require('./user');
const setupLogger = require('./logger');
const prototypeGag = require('./gags/prototypeGag');
//const ballGag = require('./gags/ballGag');
const logger = setupLogger(auth.dev);
// Initialize Discord Bot
const bot = new Discord.Client();

bot.login(auth.token);
bot.on('ready', function (_evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.user.tag);
});
let gaggedList = [];
let gagList = {
    'proto' : prototypeGag,
    //    'ballgag' : ballGag,
    //    'ball' : ballGag,
    'default' : prototypeGag
};
bot.on('message', msg => {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    let message = msg.content;
    let user = msg.author;
    let channel = msg.channel;
    let guild = msg.guild;
    logger.info(message);
    logger.info(user.username);
    logger.info(user.id);
    logger.info(channel.id);
    logger.info(guild.id);
    if (isCommand(message)) {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd.toLowerCase()) {
        case 'gag':
            gagSomeone(gaggedList, channel, args);
            break;
        case 'ungag':
            ungagSomeone(gaggedList, channel, args);
            break;
        case 'gaglist':
            listGaggedUsers(gaggedList, channel);
            break;
        case 'gaghelp':
            help(channel);
            break;
        }
        return;
    }
    if(isAlwaysCommand(message))return;
    if(userIsGagged(`<@${user.id}>`, gaggedList, channel.id)){
        gagMessage(`<@${user.id}>`, msg, message, channel, user.id);
    }
});

function gagSomeone(gaggedList, channel, args){
    let gagType = 'default';
    let userName = args[0];
    if(args.length >= 2){
        gagType = args[1];
    }
    userName = userName.replace('!','');
    let gaggedUser = new User(userName, gagType, channel.id);

    if(userIsGagged(userName, gaggedList, channel.id)){
        channel.send(`User ${gaggedUser.name} is already gagged!`);
        return;
    }
    gaggedList.push(gaggedUser);
    let embed = new Discord.RichEmbed()
        .setAuthor('Muffle Gag!', bot.user.displayAvatarURL)
        .setColor(0xffffff)
        .setDescription(`User gagged: ${gaggedUser.name} !`);
    channel.send(embed);
}

function ungagSomeone(list, channel, args){
    let ungaggedUser = args.join(' ');
    ungaggedUser = ungaggedUser.replace('!','');
    if(!userIsGagged(ungaggedUser, list, channel.id)){
        channel.send(`User ${ungaggedUser} is not currently gagged!`);
        return;
    }
    gaggedList = removeFromList(ungaggedUser, list, channel.id);
    let embed = new Discord.RichEmbed()
        .setAuthor('Muffle Ungag!', bot.user.displayAvatarURL)
        .setColor(0xffffff)
        .setDescription(`User ungagged: ${ungaggedUser} !`);
    channel.send(embed);
}

function listGaggedUsers(gaggedList, channel){
    let channelGaggedList = gaggedList.filter(x => x.channel === channel.id).map(x => `${x.name} - ${x.gag}`);
    channelGaggedList.push('\u200B');
    let embed = new Discord.RichEmbed()
        .setAuthor('Muffle Gag List!', bot.user.displayAvatarURL)
        .setColor(0xffffff)
        .addField('Gagged Users in this channel', channelGaggedList.join('\n'));
    channel.send(embed);
}

function userIsGagged(gaggedUser, gaggedList, channel){
    let count = gaggedList.filter(x => x.name === gaggedUser && x.channel === channel).length;
    return count !== 0;
}

async function gagMessage(user, msg, message, channel, userId){
    msg.delete().catch(_err => {
        logger.info(`${msg.guild.name} ${msg.guild.id} GAGGED`);
    });
    let gaggedMessage = convertToGagType(message, user, channel.id);
    let embed = await buildGagEmbed(user, gaggedMessage, userId);
    channel.send(embed);
}

async function buildGagEmbed(user, gaggedMessage, userId){
    let discord_user = await bot.fetchUser(userId.replace('!', ''));
    return new Discord.RichEmbed()
        .setAuthor(discord_user.tag, discord_user.displayAvatarURL)
        .setColor(0x8af7bd)
        .setDescription(gaggedMessage);
}

function removeFromList(user, list, channel){
    return list.filter(x => !(x.name === user && x.channel === channel));
}

function convertToGagType(message, user, channel){
    let userObject = gaggedList.filter(x => x.name === user && x.channel === channel)[0];
    let gagKey = Object.keys(gagList).filter(x => x === userObject.gag.toLowerCase());
    if(gagKey.length === 0){
        gagKey = 'default';
    }
    else{
        gagKey = gagKey[0];
    }
    return gagList[gagKey](message);
}

function isCommand(message){
    let prefix = message.substring(0, 1);
    if(auth.dev){
        return prefix === '$';
    }
    return prefix === '!';

}

function isAlwaysCommand(message){
    let prefix = message.substring(0, 1);
    return prefix === '$'|| prefix === '!';
}

function help(channel){
    let embed = new Discord.RichEmbed()
        .setAuthor('Muffle Help!', bot.user.displayAvatarURL)
        .setColor(0xffffff)
        .setDescription('List of avalaible commands')
        .addField('`!gag <@DiscordUserName> [gagType]`', `Gags the user in the current channel with the provided gagType. \n List of available gagType : ${Object.keys(gagList)}`)
        .addField('`!ungag <@DiscordUserName>`', 'Ungags the user in the current channel.')
        .addField('`!gaghelp`', 'Display this message.')
        .addField('`!gaglist`', 'Obtain a list of currently gagged users in this channel.')
        .addField('Additional Information:', `
When someone is gagged all of the messages they post in the channel are intercepted by this bot.
Only their commands(messages starting by \`!\`) are not intercepted.
Descriptions (in italics, between \`* *\`) do not get muffled.

For commands, parameters between \`<>\` are mandatory, while those between \`[]\` are optional.
`);
    channel.send(embed);
}
