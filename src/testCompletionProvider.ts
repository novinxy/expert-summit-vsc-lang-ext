import * as vscode from "vscode";
import * as fs from 'fs';
import { CancellationToken, CompletionContext, CompletionItem, CompletionItemProvider, CompletionList, Position, ProviderResult, TextDocument } from "vscode";
import { XMLParser } from "fast-xml-parser";


function getModulesRecurse(object: any, result: Array<any>) {
    if (object.hasOwnProperty('path')) {
        if (!object.name.includes('Job_')) {
            result.push(object);
        }
    }

    for (var i = 0; i < Object.keys(object).length; i++) {
        if (typeof object[Object.keys(object)[i]] === "object") {
            getModulesRecurse(object[Object.keys(object)[i]], result);
        }
    }
}

function getAllModules(projectFile: string) {
    var fileBuffer = fs.readFileSync(projectFile, 'utf8');
    const options = {
        ignoreAttributes: false,
        attributeNamePrefix: "",
    };
    const parser = new XMLParser(options);
    var jsonObj = parser.parse(fileBuffer);

    var modules: Array<any> = [];
    getModulesRecurse(jsonObj, modules);
    return modules;
}

export function getWorkspacePath(): string {
    return vscode.workspace.workspaceFolders![0].uri?.fsPath;
}

export function getAppName(document: TextDocument): string | undefined {
    var appNameRegex = /(?<appName>AppDesktop|AppMobile)/;
    return document.fileName.match(appNameRegex)?.groups?.appName;
}

export function getProjFile(appName: string): string {
    var workspace = getWorkspacePath();
    var projFile = `${workspace}/${appName}/Script/Script.tcScript`;
    return projFile;
}

export class TestExtCompletionProvider implements CompletionItemProvider {
    provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext): ProviderResult<CompletionItem[] | CompletionList<CompletionItem>> {
        var line = document.lineAt(position.line);

        if (line.text.startsWith("//")) {
            return;
        }

        var appName = getAppName(document);
        var projFile = getProjFile(appName);

        if (!fs.existsSync(projFile)) {
            return;
        }

        var modules = getAllModules(projFile);

        var moduleRegex = /(?<module>\w+)\s+.*/;
        var match = line.text.match(moduleRegex);

        if (!match) {
            return modules.map(m => new CompletionItem(m.name, vscode.CompletionItemKind.Module));
        }

        for (var module of modules) {
            if (match.groups!.module === module.name) {
                return completeFunctions(appName ?? "", module);
            }
        }
    }
}

function completeFunctions(brand: string, module: any) {
    var workspace = getWorkspacePath();
    var moduleAbsolutePath = `${workspace}/${brand}/Script/${module.path}`;
    var text: string = fs.readFileSync(moduleAbsolutePath, 'utf8');
    var regex = /^\s*function\s*(?<functionName>\w+)\s*()/gm;

    return Array.from(text.matchAll(regex), f => f!.groups!.functionName)
                .map(m => new CompletionItem(m, vscode.CompletionItemKind.Function));
}