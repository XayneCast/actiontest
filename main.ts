import * as io from './io.js'; //Import io module
import * as api from './api.js'; //Import api module

type ActionType = 'CONTENT' | 'MODIFICATION' | 'DELETION';
type ModificationType = 'SET' | 'REPLACE' | 'INSERT' | 'REMOVE';

async function main(): Promise<void> {
	console.log('Entering main ...');

	console.log('Retrieving action arguments ...');
	const secret_token: string = io.DynamicArguments.getParameter('secretToken');
	const itemOwner: string = io.DynamicArguments.getParameter('itemOwner');
	const itemRepository: string = io.DynamicArguments.getParameter('itemOwner');
	const itemPath: string = io.DynamicArguments.getParameter('itemPath');
	const actionType: ActionType = io.DynamicArguments.getParameter('actionType') as ActionType;
	const commitMessage: string = io.DynamicArguments.getParameter('commitMessage');
	console.log(`Action arguments retrieved !`);

	console.log('Creating Github API connection');
	const githubClient = new api.GithubAPI(secret_token);
	console.log('Github API connection created !');

	console.log('Processing action type ...');
	switch(actionType) {
		case 'CONTENT':
			console.log('Content action asked !');

			await githubClient.getItem(
				itemOwner,
				itemRepository,
				itemPath
			);

			break;
		case 'MODIFICATION':
			console.log('Modification action asked !');

			console.log('Retrieving modification arguments ...');
			const modificationType: ModificationType = io.DynamicArguments.getParameter('modificationType') as ModificationType;
			const variableName: string = io.DynamicArguments.getParameter('variable');
			let variableValue: string = null;

			if(modificationType !== 'REMOVE') {
				variableValue = io.DynamicArguments.getParameter('value');
			}
			console.log(`Modification arguments retrieved !`);

			const dynamicContent = new io.DynamicContent(
				itemPath,
				{
					begin: '<!--{{ ',
					end: ' }}-->'
				}
			);

			switch(modificationType) {
				case 'SET':
					dynamicContent.setVariable(
						variableName,
						variableValue
					);

					break;
				case 'REPLACE':
					dynamicContent.replaceVariable(
						variableName,
						variableValue
					);

					break;
				case 'INSERT':
					dynamicContent.insertVariable(
						variableName,
						variableValue
					);

					break;
				case 'REMOVE':
					dynamicContent.removeVariable(variableName);

					break;
				default: //If get
			}

			await githubClient.updateItem(
				commitMessage,
				dynamicContent.getContent(),
				itemOwner,
				itemRepository,
				itemPath
			);

			break;
		case 'DELETION':
			console.log('Deletion action asked !');

			await githubClient.deleteItem(
				commitMessage,
				itemOwner,
				itemRepository,
				itemPath
			);

			break;
	}
	console.log('Action executed !');

	console.log('Exiting main !');
}

main();