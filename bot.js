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
        var args = message.substring(1 + (auth.dev ? 1 : 0)).split(' ');
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
    channel.send(`User gagged: ${gaggedUser.name} !`);
}

function ungagSomeone(list, channel, args){
    let ungaggedUser = args.join(' ');
    ungaggedUser = ungaggedUser.replace('!','');
    if(!userIsGagged(ungaggedUser, list, channel.id)){
        channel.send(`User ${ungaggedUser} is not currently gagged!`);
        return;
    }
    gaggedList = removeFromList(ungaggedUser, list, channel.id);
    channel.send(`User ungagged: ${ungaggedUser} !`);
}

function listGaggedUsers(gaggedList, channel){
    let channelGaggedList = gaggedList.filter(x => x.channel === channel.id).map(x => `${x.name} - ${x.gag}`);
    channel.send(`List of gagged users: ${channelGaggedList} !`);
}

function userIsGagged(gaggedUser, gaggedList, channel){
    let count = gaggedList.filter(x => x.name === gaggedUser && x.channel === channel).length;
    return count !== 0;
}

async function gagMessage(user, msg, message, channel, userId){
    if(message.indexOf('{') === -1){
        return;
    }
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
    if(auth.dev){
        return message.substring(0, 2) === '!d';
    }
    return message.substring(0, 1) === '!';

}

function help(channel){
    channel.send(`List of available commands : \n
                    \`!gag @DiscordUserName nameofthegag\` -- gags that user in the current channel.\n
                    List of available gags : ${Object.keys(gagList)}\n
                    \`!ungag @DiscordUserName\` -- ungag that user in the current channel\n
                    \`!gaghelp\` -- Display this message\n
                    \`!gaglist\` -- List the users and their gags in the current channel\n

When someone is gagged all of the messages they post in the channel are intercepted by this bot.
Their text between {} becomes gagged.

Note : the nameofthegag parameter is optional 
                    `);
}
