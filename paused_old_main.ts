import * as io from './io.js'; //Import io module
import * as api from './api.js'; //Import api module
import * as core from '@actions/core';

output

type ActionType = 'CONTENT' | 'MODIFICATION' | 'DELETION';
type ModificationType = 'SET' | 'REPLACE' | 'INSERT' | 'REMOVE';

async function main(): Promise<void> {
	console.log('Entering main ...');

	console.log('Retrieving action arguments ...');
	const secretToken: string = io.DynamicArguments.getParameter('secretToken');
	const itemOwner: string = io.DynamicArguments.getParameter('itemOwner');
	const itemRepository: string = io.DynamicArguments.getParameter('itemRepository');
	const itemPath: string = io.DynamicArguments.getParameter('itemPath');
	const actionType: ActionType = io.DynamicArguments.getParameter('actionType') as ActionType;
	const commitMessage: string = io.DynamicArguments.getParameter('commitMessage');
	console.log(`Action arguments retrieved !`);

	console.log('Creating Github API connection');
	const githubClient = new api.GithubAPI(secretToken);
	console.log('Github API connection created !');

	console.log('Processing action type ...');
	switch(actionType) {
		case 'CONTENT':
			console.log('Content action asked !');

			const itemContent: api.IGithubGetItemResponse = await githubClient.getItem(
				itemOwner,
				itemRepository,
				itemPath
			);

			io.DynamicArguments.setParameter('stepResult', itemContent.data.content);

			break;
		case 'MODIFICATION':
			console.log('Modification action asked !');

			console.log('Retrieving modification arguments ...');
			const modificationType: ModificationType = io.DynamicArguments.getParameter('modificationType') as ModificationType;
			const variableStartTag: string = io.DynamicArguments.getParameter('variableStartTag');
			const variableStopTag: string = io.DynamicArguments.getParameter('variableStopTag');
			const variableName: string = io.DynamicArguments.getParameter('variableName');
			let variableValue: string = null;

			if(modificationType !== 'REMOVE') {
				variableValue = io.DynamicArguments.getParameter('variableValue');
			}
			console.log(`Modification arguments retrieved !`);

			const item: api.IGithubGetItemResponse = await githubClient.getItem(
				itemOwner,
				itemRepository,
				itemPath
			);

			const dynamicContent = new io.DynamicContent(
				item.data.content,
				{
					begin: variableStartTag,
					end: variableStopTag
				}
			);

			console.log("VALUE: " + variableValue);
			console.log("START |" + variableStartTag + ": STOP |" + variableStopTag + "|");

			console.log("File content: " + dynamicContent.getContent());

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

			console.log("File content after: " + dynamicContent.getContent());

			await githubClient.updateItem(
				commitMessage,
				dynamicContent.getContent(),
				itemOwner,
				itemRepository,
				itemPath
			);

			io.DynamicArguments.setParameter("value", dynamicContent.getContent());

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