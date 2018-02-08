const elements = document.getElementsByTagName('*');

const sourceWordsToTargetWords = [
    [['machine learning', 'ml'], 'magic'],
    [['artificial intelligence', 'ai'], 'witchcraft'],
    [['gdpr', 'general data protection regulation'], 'the MacGuffin'],
    [['advanced'], 'basic'],
    [['internet of things', 'IoT'], 'cheap connected garbage'],
    [['evangelist'], 'mouthpiece'],
    [['evangelists'], 'mouthpieces'],
    [['disruptive'], 'boring'],
    [['blockchain'], 'mythical tech'],
    [['cyber'], 'IT'],
    [['gartner'], 'generic analyst firm'],
    [['idc'], 'generic analyst firm'],
    [['forrester'], 'generic analyst firm'],
    [['451 research'], 'generic analyst firm'],
];

function makeRegex(sourceWords) {
    return new RegExp('\\b' + sourceWords.join('\\b|\\b') + '\\b', 'gi');
};

function identity(string) {
    return string;
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

function toUpperCase(string) {
    return string.toUpperCase();
};

function makeRegexToTargetWords(sourceWordsToTargetWords, modifyWords) {
    return sourceWordsToTargetWords.map(function (sourceAndTarget) {
        let [source, target] = sourceAndTarget;
        source = source.map(modifyWords);
        target = modifyWords(target);
        return [makeRegex(source), target];
    });
};

const sourceRegexToTargetWords = makeRegexToTargetWords(sourceWordsToTargetWords, identity)
    .concat(makeRegexToTargetWords(sourceWordsToTargetWords, capitalizeFirstLetter))
    .concat(makeRegexToTargetWords(sourceWordsToTargetWords, toUpperCase));

function replaceTextWithRegexes(text, sourceRegexToTargetWords) {
    for (let k = 0; k < sourceRegexToTargetWords.length; k++) {
        let [regex, targetWord] = sourceRegexToTargetWords[k];
        text = text.replace(regex, targetWord)
    }
    return text;
};

for (let i = 0; i < elements.length; i++) {
    const element = elements[i];

    for (let j = 0; j < element.childNodes.length; j++) {
        const node = element.childNodes[j];

        if (node.nodeType === 3) {
            const text = node.nodeValue;
            replacedText = replaceTextWithRegexes(text, sourceRegexToTargetWords);

            if (replacedText !== text) {
                console.log('replaced');
                element.replaceChild(document.createTextNode(replacedText), node);
            }
        }
    }
}
