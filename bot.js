const Discord = require('discord.js');
const logger = require('winston');
const auth = require('./auth.json');
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
    if(userIsGagged(user.username, gaggedList)){
        gagMessage(user.username, msg, message, channel);
    }
});

function gagSomeone(gaggedList, channel, args){
    let gaggedUser = args[0];
    if(userIsGagged(gaggedUser, gaggedList)){
        channel.send(`User ${gaggedUser} is already gagged!`);
        return;
    }
    gaggedList.push(gaggedUser);
    channel.send(`User gagged: ${gaggedUser} !`);
}

function ungagSomeone(gaggedList, channel, args){
    let ungaggedUser = args[0];
    if(!userIsGagged(ungaggedUser, gaggedList)){
        channel.send(`User ${ungaggedUser} is not currently gagged!`);
        return;
    }
    gaggedList.splice(gaggedList.indexOf(ungaggedUser), 1 );
    channel.send(`User ungagged: ${ungaggedUser} !`);
}

function listGaggedUsers(gaggedList, channel){
    channel.send(`List of gagged users: ${gaggedList} !`);
}

function userIsGagged(gaggedUser, gaggedList){
    let index = gaggedList.indexOf(gaggedUser);
    return index !== -1;
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

function convertToGagType(message, _user){
    return prototypeGag(message);
}
