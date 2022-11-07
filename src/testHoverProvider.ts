import * as vscode from 'vscode';


export class TestExtHoverProvider implements vscode.HoverProvider {
    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
        var line = document.lineAt(position.line);
        var word = document.getText(document.getWordRangeAtPosition(position));

        if (line.text.includes('[Settings]')) {
            return new vscode.Hover('Section containing test conditions');
        }

        if (line.text.includes('[Test]')) {
            return new vscode.Hover('Section containing test procedure');
        }

        var tcRegExp = line.text.match(new RegExp(/(?<=-\s)\w+(=?:)/gm));
        
        if (tcRegExp) {
            return new vscode.Hover('Variable defining Test Condition');
        }

        var moduleMatch = line.text.match(/^(?<module>\w+)(=?\s+)/);
        if (moduleMatch?.groups?.module && moduleMatch?.groups?.module.trim() === word) {
            return new vscode.Hover('Module');
        }

        var funcMatch = line.text.match(/(?<func>\w+)\s*$/);
        if (funcMatch?.groups?.func && funcMatch?.groups?.func.trim() === word) {
            return new vscode.Hover('Function');
        }
    }
}
