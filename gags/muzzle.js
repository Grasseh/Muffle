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
        if (inGag && dictTwoKeys.includes(nextTwo.toLowerCase())){
            gaggedMessage += twoDictionary[nextTwo.toLowerCase()];
            i += 2;
            continue;
        }
        if (inGag && dictOneKeys.includes(message[i].toLowerCase())){
            gaggedMessage += oneDictionary[message[i].toLowerCase()];
            i += 1;
            continue;
        }
        gaggedMessage += message[i];
        i += 1;
    }
    return gaggedMessage;
}

let oneDictionary = {
    b : 'w',
    c : 'r',
    d : 'r',
    e : 'o',
    i : 'a',
    j : 'r',
    l : 'r',
    m : 'r',
    n : 'r',
    p : 'w',
    q : 'k',
    r : 'rrr',
    s : 'fff',
    t : 'w',
    u : 'uuu',
    v : 'w',
    x : 'r',
    z : 'r',
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