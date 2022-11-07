import * as vscode from 'vscode';
import * as testCreation from './testCreator';
import { TestExtHoverProvider } from './testHoverProvider';
import { TestExtCompletionProvider as TestExtCompletionProvider } from './testCompletionProvider';


export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(
		vscode.commands.registerCommand('lang-extension.newTestExtFile', async args => testCreation.addTestFile(args)),
		vscode.languages.registerHoverProvider('testExt', new TestExtHoverProvider()),
		vscode.languages.registerCompletionItemProvider('testExt', new TestExtCompletionProvider(), ' ', '[a-zA-Z]'),
	);
}

export function deactivate() { }
