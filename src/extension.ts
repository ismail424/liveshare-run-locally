import * as vscode from 'vscode';
import * as vsls from 'vsls';

export function activate(context: vscode.ExtensionContext) {
	
	let disposable = vscode.commands.registerCommand('liveshare---run-locally.runLocallyLiveShare', () => {

		const liveShare = vscode.extensions.getExtension('ms-vsliveshare.vsliveshare');
		if (!liveShare) {
			vscode.window.showErrorMessage(`Live Share is not installed`);
			return;
		}

		if (!liveShare.isActive) {
			vscode.window.showErrorMessage(`Live Share is not active`);
			return;
		}

		const getApi = async () => {
			const api =  await vsls.getApi();
			if (!api) {
				throw new Error('Live Share API is not available');
			}
			return api;
		}
		getApi().then((api) => {
			const sessionRole = api.session.role;
			if (sessionRole === vsls.Role.None) {
				vscode.window.showErrorMessage(`You are not in a Live Share session`);
				return;
			}
			if (sessionRole === vsls.Role.Host) {
				vscode.window.showErrorMessage(`This extension is not available for the host`);
				return;
			}
			if (sessionRole === vsls.Role.Guest) {

				console.log(vscode.workspace.workspaceFile?.path);
				console.log(vscode.workspace.workspaceFolders?.[0].uri.path);

			}		
		});
		getApi().catch((err) => {
			vscode.window.showErrorMessage(err.message);
		});

	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
