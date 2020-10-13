function lilsGag(message){
    messages = [
       "I'm innocent! Please step on me!",
       "Head empty. No thoughts. Only bimbo.",
       "I wanna get something from <Insert Lewd Artist Here>",
       "Punish me. :3",
       "I am secretely a succubus, and with my puns I will steal your soles!",
       "Please make me an insole!"
    ];
    return messages[Math.floor(Math.random()*messages.length)];
}

module.exports = lilsGag;