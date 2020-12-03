function latexGag(message){
    let gaggedMessage = '';
    let inDescription = false;
    let inOOC = 0;
    let latexIntensity = 20;
    let latexIncrease = 10;
    let latexCap = 80;

    let split = /(\W)/; 
    let words = message.split(split);

    words.forEach(word => {
        if(word == '*') {
            inDescription = !inDescription;
        } else if(word === '(') {
            inOOC += 1;
        } else if(word === ')') {
            inOOC -= 1;
        }

        let latexChance = Math.ceil(Math.random() * 100);

        if (inOOC >= 2 || inDescription || word.length < 4 || latexChance > latexIntensity){
            gaggedMessage += word;
            return;
        }

        if (latexIntensity < latexCap){
            latexIntensity += latexIncrease;
        }

        gaggedMessage += `***${getLatexWord()}***`;
    });

    return gaggedMessage;
}

function getLatexWord() {
    latexWords = [
        'latex',
        'shine',
        'shiny',
        'glossy',
        'gloss',
        'squeak',
        'squeaky',
        'tight',
        'shining',
        'latex',
        'squeaking',
        'latex'
    ]
    return latexWords[Math.floor(Math.random()*latexWords.length)];
};

module.exports = latexGag;