function prototypeGag(message){
    let inGag = true;
    let lastSpace = false;
    let gaggedMessage = '';
    for (let i = 0; i < message.length; i++){
        if (message[i] === '*'){
            inGag = !inGag;
            gaggedMessage += '*';
            continue;
        }
        if(message[i] === ' '){
            gaggedMessage += ' ';
            lastSpace = true;
            continue;
        }
        if(lastSpace){
            if(inGag && message[i] === 'i'){
                gaggedMessage += 'hm';
                continue;
            }
            if(inGag && message[i] === 'I'){
                gaggedMessage += 'Hm';
                continue;
            }
            lastSpace = false;
        }
        if (inGag && dictKeys.includes(message[i])){
            gaggedMessage += dictionary[message[i]];
            continue;
        }
        gaggedMessage += message[i];
    }
    return gaggedMessage;
}

//Replace A, O and U with H
//Replace C and K with G
//Replace E with M
//Replace I with Hm if it starts a word, with N if it does not
//Replace S with F
//Replace Y with N
let dictionary = {
    a : 'h',
    o : 'h',
    u : 'h',
    c : 'g',
    k : 'g',
    e : 'm',
    i : 'n',
    s : 'f',
    y : 'n',
    A : 'H',
    O : 'H',
    U : 'H',
    C : 'G',
    K : 'G',
    E : 'M',
    I : 'N',
    S : 'F',
    Y : 'N',
};

let dictKeys = Object.keys(dictionary);

module.exports = prototypeGag;
