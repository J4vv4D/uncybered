const DOM_NODE_TYPE_TEXT = 3;
const debugToConsole = true;

/**
 * Contains a map of uncybered word lists to a single cybered word
 */
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
    [['gartner', 'idc', 'forrester', '451 research'], 'generic analyst firm'],
    [['bitcoin', 'ethereum', 'litecoin'], 'magic internet money'],
    [['APT', 'Advanced Persistent Threat'], 'unicorn attack'],
];

/**
 * Contains an array of regexes which help to replace cybered words.
 */
let sourceRegexToTargetWords;

function makeRegex(sourceWords) {
    return new RegExp('\\b' + sourceWords.join('\\b|\\b') + '\\b', 'gi');
}

function identity(string) {
    return string;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function toUpperCase(string) {
    return string.toUpperCase();
}

function makeRegexToTargetWords(sourceWordsToTargetWords, modifyWords) {
    return sourceWordsToTargetWords.map(sourceAndTarget => {
        let [source, target] = sourceAndTarget;
        source = source.map(modifyWords);
        target = modifyWords(target);
        return [makeRegex(source), target];
    });
}

function replaceTextWithRegexes(text) {
    for (let k = 0; k < sourceRegexToTargetWords.length; k++) {
        let [regex, targetWord] = sourceRegexToTargetWords[k];
        text = text.replace(regex, targetWord)
    }
    return text;
}

/**
 * Prints text to the console when a debugging flag is true.
 * @param {string} textToLog - the text that should be logged to the console
 *
 * @return {void}
 */
function debuglog(textToLog) {
    if (debugToConsole) {
        console.log(textToLog);
    }
}

/**
 * replace the given element's nonsensical text with a more understandable text from the mapping
 * @param {node} element - the element which contains text that will potentially be replaced
 * @param {Document} aDocument - aDocument is used to create a DOM text node. This parameter is solely used for unit
 *         test purposes in order to remove the dependency to a browser
 *
 * @return {void}
 */
export function uncyberElementIfNecessary(element, aDocument) {
    for (let j = 0; j < element.childNodes.length; j++) {
        const node = element.childNodes[j];

        if (node.nodeType === DOM_NODE_TYPE_TEXT) {
            const text = node.nodeValue;
            let replacedText = replaceTextWithRegexes(text);

            if (replacedText !== text) {
                element.replaceChild(aDocument.createTextNode(replacedText), node);
            }
        }
    }
}

/**
 * Initializes the array which holds the regex to replace cybered target words. This should be done upfront because of
 * performance implications of regexp compilation.
 *
 * Side effect: the global variable <tt>sourceRegexToTargetWords</tt> is set.
 */
export function initializeRegexToTargetWords() {
    sourceRegexToTargetWords = makeRegexToTargetWords(sourceWordsToTargetWords, identity)
        .concat(makeRegexToTargetWords(sourceWordsToTargetWords, capitalizeFirstLetter))
        .concat(makeRegexToTargetWords(sourceWordsToTargetWords, toUpperCase));
}

/**
 * This is the main routine which starts the uncybering, that is replacing nonsensical target words with sane ones. It
 * iterates through all elements in the DOM tree searches and replaces them with appropriate mappings.
 *
 * @return {void}
 */
function runUncybered() {
    // avoid errors in tests
    const document = document || null;
    if (!document) {
        return;
    }

    let elements = document.getElementsByTagName('*');
    elements = Array.prototype.slice.call(elements);
    elements.forEach(element => {
        uncyberElementIfNecessary(element, document);
    });
}

initializeRegexToTargetWords();
runUncybered();
