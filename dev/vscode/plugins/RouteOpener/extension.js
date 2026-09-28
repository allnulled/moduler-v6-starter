const vscode = require("vscode");
const path = require("path");
const fs = require("fs");

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("routeOpener.openRoute", async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      const text = editor.document.getText(editor.selection);
      const directory = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "/mal"; // || path.dirname(editor.document.uri.fsPath);
      let file = text;
      if (file.startsWith("@/")) {
        file = path.resolve(directory, file.substr(2));
      }
      const document = await vscode.workspace.openTextDocument(file);
      await vscode.window.showTextDocument(document);
    })
  );
}

function deactivate() { }

module.exports = { activate, deactivate };