function prototypeGag(message){
    let inDescription = false;
    let inOOC = 0;
    let lastSpace = true;
    let gaggedMessage = '';
    for (let i = 0; i < message.length; i++){
        if (message[i] === '*' || message[i] === '_'){
            inDescription = !inDescription;
            gaggedMessage += '*';
            continue;
        }
        if (message[i] === '('){
            inOOC++;
            gaggedMessage += '(';
            continue;
        }
        if (message[i] === ')'){
            inOOC--;
            gaggedMessage += ')';
            continue;
        }
        if(message[i] === ' '){
            gaggedMessage += ' ';
            lastSpace = true;
            continue;
        }
        let inGag = !inDescription && inOOC === 0;
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
