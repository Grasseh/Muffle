function prototypeGag(message){
    let inGag = false;
    let lastSpace = false;
    let gaggedMessage = '';
    for (let i = 0; i < message.length; i++){
        if (message[i] === '{'){
            inGag = true;
            lastSpace = true;
            continue;
        }
        if (message[i] === '}'){
            inGag = false;
            continue;
        }
        if(message[i] === ' '){
            gaggedMessage += ' ';
            lastSpace = true;
            continue;
        }
        if(lastSpace){
            gaggedMessage += message[i];
            lastSpace = false;
            continue;
        }
        if (inGag){
            gaggedMessage += 'f';
            continue;
        }
        gaggedMessage += message[i];
    }
    return gaggedMessage;
}

module.exports = prototypeGag;