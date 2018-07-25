
//Create a file in the tesseract configs folder called 'dutch', and paste this in: 
//tessedit_char_whitelist ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/,.:éë€’”-?!&àêäöü

const screenshot = require('desktop-screenshot');
const gm = require('gm');
const nodecr = require('nodecr');
const request = require('request');
const cheerio = require('cheerio');
const {google} = require('googleapis');
const fs = require('fs-extra');
const colors = require('colors');
const readline = require('readline');

const config = require('./config.json'); //Create this file yourself, with an API_KEY property and a CX property
const customSearch = google.customsearch({
    version: 'v1',
    auth: config.API_KEY //NOTE: If you haven't paid for the google APIs, you'll only be allowed to commit 100 requests a day,
                         //since this bot requires 5 requests per question, it'll be enough for only 1 round + 7 questions.
});

var question = '';
var answers = [];
var pointsA0 = 0;
var pointsA1 = 0;
var results = 0;
var completedResults = 0;
var negative = false;
var running = false;

nodecr.log = () => {};
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

console.clear();
console.log('Welkom bij deze bot voor de quiz LUCKY13 van Talpa Network!');
console.log('Gemaakt door: ' + 'Max Liebe '.green + '(https://github.com/ImAmalox) '.yellow);
console.log('ALLEEN VOOR EDUCATIEF GEBRUIK!'.bgRed);
console.log("Druk op 's' om een vraag te scannen, of druk op 'e' om de bot te verlaten.");

const screenshotDesktop = () => {
    return new Promise((resolve, reject) => {
        console.log('-------------------------------------------');
        screenshot("desktop.png", {width: 1366}, (err, complete) => {
            if(err) {
                reject(err);
            }
            console.log('Screenshot genomen');
            resolve();
        });
    });
};

const cropQuestion = () => {
    return new Promise((resolve, reject) => {
        gm("desktop.png")
        .crop('340', '165', '1024', '95')
        .sepia() //I find that a sepia generally increases OCR accuracy
        .write("question.png", err => {
            if(err) {
                reject(err);
            }
            console.log('Vraag bijgesneden');
            resolve();
        });
    });
};

const cropAnswers = () => {
    return new Promise((resolve, reject) => {
        gm("desktop.png")
        .crop('300', '126', '1042', '312')
        .sepia()
        .write("answer0.png", err => {
            if(err) {
                reject(err);
            }
            console.log('Antwoord 1 bijgesneden');
            
            gm("desktop.png")
            .crop('300', '126', '1042', '450')
            .sepia()
            .write("answer1.png", err => {
                if(err) {
                    reject(err);
                }
                console.log('Antwoord 2 bijgesneden');
                resolve();
            });
        });
    });
};

const processQuestion = () => {
    return new Promise((resolve, reject) => {
        nodecr.process('question.png', (err, text) => {
            if(err) {
                reject(err);
            }
            if(!text) {
                reject('Kon vraag niet lezen');
            }
            question = text.replace(/\n/g, " ");
            question = filterText(question);
            checkForNegative(question);
            //Uncomment if you want to test a custom question
            //question = 'Hoe hoog is Mount Everest?';
            console.log('-------------------------------------------');
            console.log('Vraag:', question);
            resolve();
        }, 'nld', 6, 'dutch');
    });
};

const processAnswers = () => {
    return new Promise((resolve, reject) => {
        nodecr.process('answer0.png', (err, text) => {
            if(err) {
                reject(err);
            }
            if(!text) {
                reject('Kon antwoord 1 niet lezen');
            }
            text = text.replace(/^\s*$[\n\r]{1,}/gm, '');
            text = text.replace(/\n/g, '');
            text = filterText(text);
            answers.push(text);
            nodecr.process('answer1.png', (err, text) => {
                if(err) {
                    reject(err);
                }
                if(!text) {
                    reject('Kon antwoord 2 niet lezen');
                }
                text = text.replace(/^\s*$[\n\r]{1,}/gm, '');
                text = text.replace(/\n/g, '');
                text = filterText(text);
                answers.push(text);
                // Uncomment if you want custom answers
                //answers = ['8.848 meter', '8.932 meter'];
                console.log('Antwoorden:');
                for(var i = 0; i < answers.length; i++) {
                    console.log((i + 1) + ': ', answers[i]);
                }
                resolve();
            }, 'nld', 7, 'dutch');
        }, 'nld', 7, 'dutch');
    });
};

const lookupQuestion = () => {
    return new Promise((resolve, reject) => {
        let maxPages = 5; //10 results each

        for(let i = 0; i < maxPages; i++) {
            let params = {
                q: question,
                cx: config.CX,
                start: 1 + i * 10
            };
            customSearch.cse.list(params)
            .then(res => {
                if(!res.data.items) {
                    reject('Geen resultaten gevonden');
                }
                if(res.data.searchInformation.totalResults <= 10 + i * 10) {
                    maxPages = i + 1;
                }
                if(res.data.searchInformation.totalResults > 50) {
                    results = 50;
                }else{
                    results = res.data.searchInformation.totalResults;
                }
                res.data.items.forEach((item, index) => {
                    checkForWiki(item.link)
                    .then(() => {
                        checkIfAnswerInContext(item.title);
                        checkIfAnswerInContext(item.snippet);
                        completedResults++;
                        if(results === completedResults) {
                            resolve();
                        }
                    })
                    .catch(err => reject(err));
                });
            })
            .catch(err => reject(err));
        }
    });
};

const showResults = () => {
    let temp0 = `Antwoord '${answers[0]}' kreeg ${pointsA0} punt(en).`;
    let temp1 = `Antwoord '${answers[1]}' kreeg ${pointsA1} punt(en).`
    if(pointsA0 > pointsA1) {
        console.log(temp0.green);
        console.log(temp1.red);
        if(negative) {
            console.log('KIJK UIT! HET WOORD \'NIET\' of \'GEEN\' KWAM VOOR IN DE VRAAG, HET ANTWOORD IS DUS WAARSCHIJNLIJK ANDERSOM!'.bgRed);
        }
    }else if (pointsA0 < pointsA1) {
        console.log(temp0.red);
        console.log(temp1.green);
        if(negative) {
            console.log('KIJK UIT! HET WOORD \'NIET\' of \'GEEN\' KWAM VOOR IN DE VRAAG, HET ANTWOORD IS DUS WAARSCHIJNLIJK ANDERSOM!'.bgRed);
        }
    }else{
        console.log(temp0.yellow);
        console.log(temp1.yellow);
    }
};

const checkForWiki = link => {
    return new Promise((resolve, reject) => {
        if(link.indexOf('wikipedia') !== -1) {
            //It's a wiki/q&a forum link
            request(link, (err, response, body) => {
                if(err) {
                    reject(err);
                }
                if(!body) {
                    resolve();
                }
                checkIfAnswerInBody(body);
                resolve();
            });
        }else{
            //Not a wiki/q&a forum link. resolve
            resolve();
        }
    });
};

const checkIfAnswerInBody = body => {
    let $ = cheerio.load(body);
    answers.forEach((answer, index) => {
        if($('body').text().toLowerCase().indexOf(answer.toLowerCase()) !== -1) {
            switch(index) {
                case 0: 
                    pointsA0++; 
                    break;
                case 1: 
                    pointsA1++; 
                    break;
            }
        }
    });
};

const checkIfAnswerInContext = context => {
    answers.forEach((answer, index) => {
        if(context.toLowerCase().indexOf(answer.toLowerCase()) !== -1) {
            switch(index) {
                case 0: pointsA0++; break;
                case 1: pointsA1++; break;
            }
        }
    });
};

const checkForNegative = text => {
    if(text.indexOf('NIET') !== -1 || text.indexOf('GEEN') !== -1 ) {
        negative = true;
    }
};

const filterText = text => {
    var newText = text.replace('fl', 'fi'); //This is a common mistake the OCR will make, thanks to the lucky13 font. fi is more present in the Dutch language than fl.
    newText = newText.replace('NedeHand', 'Nederland'); //It just made this mistake
    newText = newText.replace("'", '');
    newText = newText.replace('"', '');
    newText = newText.replace('`', '');
    newText = newText.replace('’', ''); //Google doesn't like quotation marks :)
    return newText;
};

const resetValues = () => {
    console.log("Druk op 's' om een vraag te scannen, of druk op 'e' om de bot te verlaten.");
    question = '';
    answers = [];
    pointsA0 = 0;
    pointsA1 = 0;
    results = 0;
    completedResults = 0;
    negative = false;
    running = false;
};

process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
        process.exit();
    } else {
        if(!running) {
            if(str === 's') {
                running = true;
                screenshotDesktop()
                .then(() => cropQuestion())
                .then(() => cropAnswers())
                .then(() => processQuestion())
                .then(() => processAnswers())
                .then(() => lookupQuestion())
                .then(() => showResults())
                .then(() => {fs.copy('./desktop.png', `./saved/${new Date().getTime()}.png`); resetValues()})
                .catch(err => {console.error('Er ging iets fout:'.red, err); process.exit()});
            }else if(str === 'e') {
                process.exit();
            }
        }
    }
});

