import * as io from './io.js'; //Import io module

async function main(): Promise<void> {
	console.log('Entering main ...');

	console.log('Retrieving action arguments ...');
	const actionType: io.DynamicActionType = io.DynamicArguments.getParameter('actionType') as io.DynamicActionType;
	console.log(`Action arguments retrieved !`);

	console.log('Retrieving modification arguments ...');
	const payload: string = io.DynamicArguments.getParameter('payload');
	const variableStartTag: string = io.DynamicArguments.getParameter('variableStartTag');
	const variableStopTag: string = io.DynamicArguments.getParameter('variableStopTag');
	const variableName: string = io.DynamicArguments.getParameter('variableName');
	let variableValue: string = null;

	if(actionType !== 'REMOVE') {
		variableValue = io.DynamicArguments.getParameter('variableValue');
	}

	const dynamicContent = new io.DynamicContent(
		payload,
		{
			begin: variableStartTag,
			end: variableStopTag
		}
	);

	let result: string = '';

	console.log('Processing action type ...');
	switch(actionType) {
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
			console.log('TRYING GET !\n');
			result = dynamicContent.getVariable(variableName);

			console.log(`RESULT: ${result}`);
	}

	if(actionType !== 'GET') {
		result = dynamicContent.getContent();
	}

	io.DynamicArguments.setParameter('result', result);
	io.DynamicArguments.setParameter('VALUE1', 'Valeur 1');

	console.log('Action executed !');

	console.log('Exiting main !');
}

main();