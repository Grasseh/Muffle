function muzzleGag(message){
    let inDescription = false;
    let inOOC = 0;
    let lastSpace = true;
    let gaggedMessage = '';
    let i = 0;
    while(i < message.length){
        if (message[i] === '*' || message[i] === '_'){
            inDescription = !inDescription;
            gaggedMessage += '*';
            i += 1;
            continue;
        }
        if (message[i] === '('){
            inOOC++;
            gaggedMessage += '(';
            i += 1;
            continue;
        }
        if (message[i] === ')'){
            inOOC--;
            gaggedMessage += ')';
            i += 1;
            continue;
        }
        if(message[i] === ' '){
            gaggedMessage += ' ';
            lastSpace = true;
            i += 1;
            continue;
        }
        let inGag = !inDescription && inOOC === 0;
        nextTwo = 'nope';
        if (i < message.length - 1){
            nextTwo = message[i] + message [i + 1];
        }
        if (inGag && dictTwoKeys.includes(nextTwo)){
            gaggedMessage += twoDictionary[nextTwo];
            i += twoDictionary[nextTwo].length;
            continue;
        }
        if (inGag && dictOneKeys.includes(message[i])){
            gaggedMessage += oneDictionary[message[i]];
            i += oneDictionary[message[i]].length;
            continue;
        }
        i += 1;
        gaggedMessage += message[i];
    }
    return gaggedMessage;
}

let oneDictionary = {
    B : 'w',
    C : 'kr',
    D : 'r',
    E : 'o',
    I : 'a',
    J : 'r',
    L : 'r',
    M : 'r',
    N : 'r',
    P : 'w',
    Q : 'k',
    R : 'rrr',
    S : 'fff',
    T : 'w',
    U : 'uuu',
    V : 'w',
    X : 'r',
    Z : 'r',
};

let twoDictionary = {
    ce : 'fff',
    ch : 'wr',
    wr : 'rrr',
    st : 'ffrrru',
    sh : 'rrr',
    kn : 'r',
}
let dictOneKeys = Object.keys(oneDictionary);
let dictTwoKeys = Object.keys(twoDictionary);
module.exports = muzzleGag;