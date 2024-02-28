import axios from 'axios';

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
	content: string;
	sha: string;
}

class GithubAPIInformations {
	public static URL: string = 'https://api.github.com';
}

class GithubAPIResourceForbiddenError extends Error {
	constructor() {
		super(`Requested resource cannot be accessed without appropriate authorizations !`);
	}
}
class GithubAPIResourceConflictError extends Error {
	constructor() {
		super(`Requested resource is conflicting with another !`);
	}
}
class GithubAPIResourceNotFoundError extends Error {
	constructor() {
		super(`Requested resource can not be found !`);
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
		};
	}

	private async __getData(itemPath, type: 'HEAD' | 'BODY'): Promise<IGithubGetItemResponse> {
		try {
			const githubPath: string = `${GithubAPIInformations.URL}/repos/${itemPath}`;
			let response: any;

			if(type === 'HEAD') {
				response = await axios.head(
					githubPath,
					this._headers
				);
			} else {
				response = await axios.get(
					githubPath,
					this._headers
				);
			}

			switch(response.status) {
				case 403 :
					throw new GithubAPIResourceForbiddenError();
				case 404 :
					throw new GithubAPIResourceNotFoundError();
				default :
					return {
						status: response.status,
						data: {
							sha: response.data.sha,
							content: response.data.content,
							size: response.data.size
						}
					};
			}
		} catch {
			throw new GithubAPIConnectionFailed();
		}
	}

	private async __getItemId(owner: string, repository: string, filepath: string): Promise<IGithubGetItemResponse> {
		return this.__getData(`${owner}/${repository}/contents/${filepath}`, 'HEAD');
	}

	public async getItem(owner: string, repository: string, filepath: string): Promise<IGithubGetItemResponse> {
		return this.__getData(`${owner}/${repository}/contents/${filepath}`, 'BODY');
	}

	public async updateItem(content: string, owner: string, repository: string, filepath: string): Promise<void> {
		const data = await this.__getItemId(owner, repository, filepath);
		console.log(`DATA RETRIEVED FROM ITEM ID: ${JSON.stringify(data, null, 4)}`);

		const options: IGithubAPIOptions = {
			owner: owner,
			repo: repository,
			path: filepath,
			message: 'Auto updating changelog',
			committer: {
				name: 'Changelog updater',
				email: 'octocat@github.com'
			},
			content: Buffer.from(content).toString('base64'),
			sha: data.data.sha
		};

		try {
			const response: any = await axios.put(
				`${GithubAPIInformations.URL}/repos/${owner}/${repository}/contents/${filepath}`,
				options,
				this._headers
			);

			switch(response.status) {
				case 404 :
					throw new GithubAPIResourceNotFoundError();
				case 409 :
					throw new GithubAPIResourceConflictError();
				case 422 :
					throw new GithubAPIResourceForbiddenError();
				default :
					return;
			}
		} catch {
			throw new GithubAPIConnectionFailed();
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

	console.log(`DATA RETRIEVED FROM ITEM ID: ${JSON.stringify(content, null, 4)}`);

	await api.updateItem(value, 'xaynecast', 'actiontest', file_path);

	console.log('Exiting main !');
}

main();