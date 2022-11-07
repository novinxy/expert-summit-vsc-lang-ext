import * as vscode from "vscode";
import { CancellationToken, Definition, DefinitionProvider, LocationLink, Position, ProviderResult, TextDocument } from "vscode";
import { getAppName, getWorkspacePath } from "./testCompletionProvider";
import * as  fs from "fs";

export class TestExtDefinitionProvider implements DefinitionProvider {
    provideDefinition(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Definition | LocationLink[]> {
        var line = document.lineAt(position.line);

        if (line.text.includes('[Settings]') || line.text.includes('[Test]')) {
            return;
        }
        
        var appName = getAppName(document);
        
        var text = document.getText(document.getWordRangeAtPosition(position));


        var moduleRegex = /(?<module>\w+)\s+.*/;
        var match = line.text.match(moduleRegex);

        if (match?.groups?.module === text) {
            var workspace = getWorkspacePath();
            return new vscode.Location(vscode.Uri.file(`${workspace}/${appName}/Script/${text}.sj`), new Position(0,0));
        }

        var moduleAndFuncRegex = /(?<module>\w+)\s+(?<func>\w+)/;
        var match = line.text.match(moduleAndFuncRegex);

        if (match?.groups?.func === text) {
            var workspace = getWorkspacePath();
            var modulePath = `${workspace}/${appName}/Script/${match?.groups?.module}.sj`;

            var fileContent = fs.readFileSync(modulePath, "utf-8");
            var index = fileContent.indexOf(`function ${text}`);
            var sub = fileContent.substring(0, index);
            var lineNum = sub.split("\r\n").length - 1;

            return new vscode.Location(vscode.Uri.file(modulePath), new Position(lineNum,0));
        }

    }

}