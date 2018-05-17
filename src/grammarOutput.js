const vscode = require('vscode');
const tracery = require('tracery-grammar');
const config = require('./config');

let grammar;

const loadGrammar = () => {

    if (grammar) return Promise.resolve();

    const traceryPath = config.traceryPath();
    let uri;

    try {
        uri = vscode.Uri.parse('file:///' + traceryPath);
    } catch (err) {
        console.error(err);
    }

    const p = vscode.workspace.openTextDocument(uri);

    return p.then(doc => {
        const raw = doc.getText();
        const grammarObject = JSON.parse(raw);
        grammar = tracery.createGrammar(grammarObject);
    }, reason => {
        console.error("error opening tracery file");
        console.error(reason);
    });
}

exports.makeGrammar = () => {
    return loadGrammar().then(() => {
        return grammar.flatten('#origin#');
    });
};