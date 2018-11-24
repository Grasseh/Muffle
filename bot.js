var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});
bot.on('ready', function (_evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
let gaggedList = [];
bot.on('message', function (user, userID, channelID, message, _evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    logger.info(message);
    logger.info(userID);
    logger.info(channelID);
    logger.info(message);
    logger.info(_evt);
    if (message.substring(0, 1) === '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
        // !ping
        case 'gag':
            gagSomeone(cmd, gaggedList, bot, message, channelID);
            break;
        case 'ungag':
            ungagSomeone(cmd, gaggedList, bot, message, channelID);
            break;
        case 'gaglist':
            listGaggedUsers(gaggedList, bot, channelID);
            break;
        // Just add any case commands if you want to..
        }
        return;
    }
    if(userIsGagged(user, gaggedList)){
        gagMessage(user, message, bot, channelID);
    }
});

function gagSomeone(cmd, gaggedList, bot, message, channelID){
    let gaggedUser = message.substring(5);
    if(userIsGagged(gaggedUser, gaggedList)){
        bot.sendMessage({
            to: channelID,
            message: `User ${gaggedUser} is already gagged!`
        });
        return;
    }
    gaggedList.push(gaggedUser);
    bot.sendMessage({
        to: channelID,
        message: `User gagged: ${gaggedUser} !`
    });
}

function ungagSomeone(cmd, gaggedList, bot, message, channelID){
    let ungaggedUser = message.substring(7);
    if(!userIsGagged(ungaggedUser, gaggedList)){
        bot.sendMessage({
            to: channelID,
            message: `User ${ungaggedUser} is not currently gagged!`
        });
        return;
    }
    gaggedList.splice(gaggedList.indexOf(ungaggedUser), 1 );
    bot.sendMessage({
        to: channelID,
        message: `User ungagged: ${ungaggedUser} !`
    });
}

function listGaggedUsers(gaggedList, bot, channelID){
    bot.sendMessage({
        to: channelID,
        message: `List of gagged users: ${gaggedList} !`
    });
}

function userIsGagged(gaggedUser, gaggedList){
    let index = gaggedList.indexOf(gaggedUser);
    return index !== -1;
}

function gagMessage(user, message, bot, channelID){
    //message.delete().catch(_err => {
    //console.log(`${message.guild.name} ${message.guild.id} Missing perms`);
    //});
    let gaggedMessage = convertToGagSpeak(message);
    bot.sendMessage({
        to: channelID,
        message: `Message from ${user}: ${gaggedMessage}.`
    });
}

function convertToGagSpeak(_message){
    return 'HMPFF';
}
