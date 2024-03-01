import axios from 'axios';

interface IGithubGetItemIdResponse {
	status: number;
	sha: string;
}
interface IGithubGetItemResponse {
	status: number;

	data: {
		sha: string;
		content: string;
		size: number;
	}
}

interface IGithubAPIHeaders {
	responseEncoding: string;
	responseType: 'json';

	headers: {
		Authorization: string;
		Accept: string;
	}
}

interface IGithubAPIOptions {
	owner: string;
	repo: string;
	path: string;

	message: string;
	committer: {
		name: string;
		email: string;
	};

	sha: string;
}

interface IGithubAPIContentOptions extends IGithubAPIOptions {
	content: string;
}

class GithubAPIInformations {
	public static URL: string = 'https://api.github.com';
}

class GithubAPIResourceError extends Error {
	constructor(errorMessage: string) {
		super(errorMessage);
	}
}

class GithubAPIResourceForbiddenError extends GithubAPIResourceError {
	constructor(resourcePath: string) {
		super(`Requested resource cannot be accessed without appropriate authorizations:\n\t'${resourcePath}'`);
	}
}
class GithubAPIResourceConflictError extends GithubAPIResourceError {
	constructor(resourcePath: string) {
		super(`Requested resource is conflicting with another:\n\t'${resourcePath}'`);
	}
}
class GithubAPIResourceNotFoundError extends GithubAPIResourceError {
	constructor(resourcePath: string) {
		super(`Requested resource can not be found:\n\t'${resourcePath}'`);
	}
}
class GithubAPIConnectionFailed extends Error {
	constructor() {
		super(`Connection to the Github API failed !`);
	}
}

class GithubAPI {
	private _headers: IGithubAPIHeaders;

	public constructor(
		token: string
	) {
		this._headers = {
			responseEncoding: 'utf-8',
			responseType: 'json',
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/vnd.github+json'
			}
		}; //Define the necessary Github API headers
	}

	private __createLink(ownerName: string, repositoryName: string, itemPath: string): string {
		return `${GithubAPIInformations.URL}/repos/${ownerName}/${repositoryName}/contents/${itemPath}`;
	}

	private async __getItemId(resourcePath: string): Promise<IGithubGetItemIdResponse> {
		try {
			const response: any = await axios.head(
				resourcePath,
				this._headers
			);

			return {
				status: response.status,
				sha: response.headers.etag.slice(3, -1)
			};
		} catch(error) {
			switch(error.response.status) {
				case 403 :
					throw new GithubAPIResourceForbiddenError(resourcePath);
				case 404 :
					throw new GithubAPIResourceNotFoundError(resourcePath);
				default :
					throw new GithubAPIConnectionFailed();
			}
		}
	}

	public async getItem(ownerName: string, repositoryName: string, itemPath: string): Promise<IGithubGetItemResponse> {
		const resourcePath: string = this.__createLink(
			ownerName,
			repositoryName,
			itemPath
		);

		try {
			const response: any = await axios.get(
				resourcePath,
				this._headers
			);

			return {
				status: response.status,
				data: {
					sha: response.data.sha,
					content: Buffer.from(response.data.content, 'base64').toString('utf-8'),
					size: response.data.size
				}
			};
		} catch(error) {
			switch(error.response.status) {
				case 403 :
					throw new GithubAPIResourceForbiddenError(resourcePath);
				case 404 :
					throw new GithubAPIResourceNotFoundError(resourcePath);
				default :
					throw new GithubAPIConnectionFailed();
			}
		}
	}

	public async updateItem(content: string, ownerName: string, repositoryName: string, itemPath: string): Promise<void> {
		const resourcePath: string = this.__createLink(
			ownerName,
			repositoryName,
			itemPath
		);

		const data: IGithubGetItemIdResponse = await this.__getItemId(resourcePath);

		const options: IGithubAPIContentOptions = {
			owner: ownerName,
			repo: repositoryName,
			path: itemPath,
			message: 'Auto updating changelog',
			committer: {
				name: 'Changelog updater',
				email: 'octocat@github.com'
			},
			content: Buffer.from(content, 'utf-8').toString('base64'),
			sha: data.sha
		};

		try {
			await axios.put(
				resourcePath,
				options,
				this._headers
			);
		} catch(error) {
			switch(error.response.status) {
				case 404 :
					throw new GithubAPIResourceNotFoundError(resourcePath);
				case 409 :
					throw new GithubAPIResourceConflictError(resourcePath);
				case 422 :
					throw new GithubAPIResourceForbiddenError(resourcePath);
				default :
					throw new GithubAPIConnectionFailed();
			}
		}
	}

	public async deleteItem(ownerName: string, repositoryName: string, itemPath: string): Promise<void> {
		const resourcePath: string = this.__createLink(
			ownerName,
			repositoryName,
			itemPath
		);

		const data: IGithubGetItemIdResponse = await this.__getItemId(resourcePath);

		const options: IGithubAPIOptions = {
			owner: ownerName,
			repo: repositoryName,
			path: itemPath,
			message: 'Auto updating changelog',
			committer: {
				name: 'Changelog updater',
				email: 'octocat@github.com'
			},
			sha: data.sha
		};

		try {
			await axios.delete(
				resourcePath,
				{
					data: options,
					params: this._headers
				}
			);
		} catch(error) {
			switch(error.response.status) {
				case 404 :
					throw new GithubAPIResourceNotFoundError(resourcePath);
				case 409 :
					throw new GithubAPIResourceConflictError(resourcePath);
				case 422 :
					throw new GithubAPIResourceForbiddenError(resourcePath);
				default :
					throw new GithubAPIConnectionFailed();
			}
		}
	}
}

class GithubParameters {
	public static getParameter(name: string) {
		return process.env[`INPUT_${name.replace(' ', '_').toUpperCase()}`] || null;
	}
}

async function main(): Promise<void> {
	console.log('Entering main ...');

	console.log('Retrieving action arguments ...');
	const secret_token: string = GithubParameters.getParameter('secret_token');
	const file_path: string = GithubParameters.getParameter('file_path');
	//const action_type: string = GithubParameters.getParameter('action_type');
	//const variable: string = GithubParameters.getParameter('variable');
	const value: string = 'VALUE !'//GithubParameters.getParameter('value');
	console.log(`Action arguments retrieved !`);

	console.log('Creating Github API connection');
	const api = new GithubAPI(secret_token);
	console.log('Github API connection created !');

	const content = await api.getItem('xaynecast', 'actiontest', 'test.md');

	console.log(`Old content: ${content.data.content}`);

	await api.updateItem(`${content.data.content} + ${value}`, 'xaynecast', 'actiontest', file_path);

	await api.deleteItem('xaynecast', 'actiontest', file_path);

	console.log('Exiting main !');

	process.exitCode = 1; //If program failed
}

main();