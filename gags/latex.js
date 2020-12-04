function latexGag(message){
    let gaggedMessage = '';
    let inDescription = false;
    let inOOC = 0;
    let latexIntensity = 20;
    let latexIncrease = 10;
    let latexWordLength = 4;
    let latexCap = 90;

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

        if (inOOC >= 2 || inDescription || word.length < latexWordLength || latexChance > latexIntensity){
            gaggedMessage += word;
            return;
        }

        if (latexIntensity < latexCap){
            latexIntensity += latexIncrease * (100 - latexIntensity) / 100;
        } else {
            if (latexChance > 50 && latexWordLength > 2) { //30 % Chance
                latexWordLength -= 1;
            }
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
        'latex',
        'squeak',
        'squeaky',
        'tight',
        'shining',
        'latex',
        'squeaking',
        'polished',
        'gleaming',
        'soft',
        'latex',
        'smooth',
        'shiny',
        'shiny',
        'latex'
    ]
    return latexWords[Math.floor(Math.random()*latexWords.length)];
};

module.exports = latexGag;
