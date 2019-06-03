module.exports = function (token,language,intent) {
    const expressionsConfig = JSON.parse(process.env.expressionsConfig);
    const standardExpressions = JSON.parse(process.env.standardExpressions);
    let messages = {};
    if(!token||!language){
        return messages;
    }
    let expressions = expressionsConfig[token][language];
    let standards = standardExpressions[language];

    
    const stUtEntries = Object.entries(standards.utterances);
    const exUtEntries = Object.entries(expressions.utterances);
    for (const [key, value] of stUtEntries) {
        if (exUtEntries.filter(s => { return s[0] === key }).length > 0) {
            messages[key] = exUtEntries.filter(s => { return s[0] === key })[0][1];
        }
        else {
            messages[key] = value;
        }
    }

    if (intent) {
        let iStandards = standards.answers[intent];
        let iExpressions = expressions.answers[intent].messages;
        if (iStandards && iExpressions) {
            const stEntries = Object.entries(iStandards);
            const exEntries = Object.entries(iExpressions);
            for (const [key, value] of stEntries) {
                if (exEntries.filter(s => { return s[0] === key }).length > 0) {
                    messages[key] = exEntries.filter(s => { return s[0] === key })[0][1];
                }
                else {
                    messages[key] = value;
                }
            }
        }
        else {
            if (iStandards) {
                const stEntries = Object.entries(iStandards);
                for (const [key, value] of stEntries) {
                    messages[key] = value;
                }
            }
        }
    }


    return messages;
}

