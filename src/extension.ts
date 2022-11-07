import * as vscode from 'vscode';
import { TestExtHoverProvider } from './testHoverProvider';
import { TestExtCompletionProvider as TestExtCompletionProvider } from './testCompletionProvider';


export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(
		vscode.languages.registerHoverProvider('testExt', new TestExtHoverProvider()),
		vscode.languages.registerCompletionItemProvider('testExt', new TestExtCompletionProvider(), ' ', '[a-zA-Z]'),
	);
}

export function deactivate() { }
