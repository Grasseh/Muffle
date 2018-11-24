const Discord = require('discord.js');
const logger = require('winston');
const auth = require('./auth.json');
const User = require('./user');
const prototypeGag = require('./gags/prototypeGag');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
const bot = new Discord.Client();

bot.login(auth.token);
bot.on('ready', function (_evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.user.tag);
});
let gaggedList = [];
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
    if (message.substring(0, 1) === '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
        // !ping
        case 'gag':
            gagSomeone(gaggedList, channel, args);
            break;
        case 'ungag':
            ungagSomeone(gaggedList, channel, args);
            break;
        case 'gaglist':
            listGaggedUsers(gaggedList, channel);
            break;
        // Just add any case commands if you want to..
        }
        return;
    }
    if(userIsGagged(user.username, gaggedList, channel.id)){
        gagMessage(user.username, msg, message, channel);
    }
});

function gagSomeone(gaggedList, channel, args){
    let gaggedUser = new User(args[0], args[1], channel.id);

    if(userIsGagged(gaggedUser, gaggedList, channel.id)){
        channel.send(`User ${gaggedUser.name} is already gagged!`);
        return;
    }
    gaggedList.push(gaggedUser);
    channel.send(`User gagged: ${gaggedUser.name} !`);
}

function ungagSomeone(list, channel, args){
    let ungaggedUser = args[0];
    if(!userIsGagged(ungaggedUser, list, channel.id)){
        channel.send(`User ${ungaggedUser} is not currently gagged!`);
        return;
    }
    gaggedList = removeFromList(ungaggedUser, list, channel.id);
    channel.send(`User ungagged: ${ungaggedUser} !`);
}

function listGaggedUsers(gaggedList, channel){
    let channelGaggedList = gaggedList.filter(x => x.channel === channel.id).map(x => x.name);
    channel.send(`List of gagged users: ${channelGaggedList} !`);
}

function userIsGagged(gaggedUser, gaggedList, channel){
    let count = gaggedList.filter(x => x.name === gaggedUser && x.channel === channel).length;
    return count !== 0;
}

function gagMessage(user, msg, message, channel){
    msg.delete().catch(_err => {
        console.log(`${msg.guild.name} ${msg.guild.id} GAGGED`);
    });
    let gaggedMessage = convertToGagType(message, user);
    channel.send(`Message from ${user}:\n ${gaggedMessage}.`);
    //If Discord ever allows to edit a user's message
    //msg.edit('Message from ${user}: ${gaggedMessage}.`);
}

function removeFromList(user, list, channel){
    return list.filter(x => !(x.name === user && x.channel === channel));
}

function convertToGagType(message, _user){
    return prototypeGag(message);
}
