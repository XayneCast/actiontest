import axios from 'axios';

interface GetFileShaResponse {
	status: number;
	headers: {
		etag: string
	};
}

interface GithubAPIHeaders {
	responseEncoding: string;
	responseType: string;

	headers: {
		Authorization: string;
		Accept: string;
	}
}

class GithubInformations {
	public static URL: string = 'https://api.github.com';
}

class GithubAPI {
	private _headers: {};

	public constructor(
		token: string
	) {
		this._headers = this.__createHeaders(token);
	}

	/**
	 * @brief Create the necessary headers to connect to the Github API
	 *
	 * @param {string} token: The token to securize the Github API connection
	 *
	 * @returns {GithubAPIHeaders} Return the necessary headers to connect to the Github API
	*/
	private __createHeaders(token: string): GithubAPIHeaders {
		return {
			responseEncoding: 'utf-8',
			responseType: 'json',
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/vnd.github+json'
			}
		}
	}

	private async __getContentSha(owner: string, repository: string, filepath: string): Promise<string> {
		try {
			const response: GetFileShaResponse = await axios.head(`${GithubInformations.URL}/repos/${owner}/${repository}/contents/${filepath}`, this._headers);
		} catch (error) {
			console.log("Error on trying to get content SHA !\n");
		}

		if (response.status !== 200) {
			throw Error('File don\'t exists !');
		}

		return response.headers.etag.slice(3, -1);
	}

	public async getFileContent(owner: string, repository: string, filepath: string): Promise<any> {
		return axios.get(`${GithubInformations.URL}/repos/${owner}/${repository}/contents/${filepath}`, this._headers);
	}

	public async updateFile(content: string, owner: string, repository: string, filepath: string): Promise<any> {
		try {
			const fileSha = await this.__getContentSha(owner, repository, filepath);

			console.log(fileSha);
			process.stderr.write(fileSha);

			return axios.put(`${GithubInformations.URL}/repos/${owner}/${repository}/contents/${filepath}`,
				{
					owner: owner,
					repo: repository,
					path: filepath,
					message: 'Auto updating changelog',
					committer: {
						name: 'Changelog updater',
						email: 'octocat@github.com'
					},
					content: Buffer.from(content).toString('base64'),
					sha: fileSha
				},
				this._headers
			);
		} catch (error: unknown) {
			throw Error('File not found !');
		}
	}

	public async compareCommit(owner: string, repository: string, firstUser: string, olderBranch: string, secondUser: string, newerBranch: string): Promise<any> {
		return axios.get(`${GithubInformations.URL}/repos/${owner}/${repository}/compare/${olderBranch}...${newerBranch}`);
	}
}

class GithubParameters {
	public static getParameter(name: string) {
		return process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
	}
}

async function main(): Promise<void> {
	console.log('Entering main ...');

	console.log('Getting secret token ...');
	const token = GithubParameters.getParameter('secret_token');
	console.log(`Secret token retrieved: ${token} !`);

	console.log('Creating Github API connection');
	const api = new GithubAPI(token);
	console.log('Github API connection created !');

	//const content = await api.getFileContent('xaynecast', 'actiontest', 'test.md');
	//console.log(content);
	await api.updateFile('LMAO !', 'xaynecast', 'actiontest', 'test.md');

	console.log('Exiting main !');
}

main();