import * as vscode from 'vscode';
import { Uri } from 'vscode';


export async function addTestFile(args: any) {

    if (args === undefined) {
        vscode.window.showWarningMessage("Option available only from File Explorer sidebar");
        return;
    }

    var testName = await vscode.window.showInputBox({
        title: "Insert test name",
        prompt: "tdf-language"
    });
    
    if (testName === undefined) {
        return;
    }
    
    let testExtFileName = Uri.file(`${args.path}\\${testName}.test`);

    let edit = new vscode.WorkspaceEdit();
    edit.createFile(testExtFileName);
    
    var result = await vscode.workspace.applyEdit(edit);

    if (result) {
        var tdfDocument = await vscode.workspace.openTextDocument(testExtFileName);
        await vscode.window.showTextDocument(tdfDocument);
    }
    else {
        vscode.window.showErrorMessage(`Couldn't create ${testExtFileName}`);
    }
}
