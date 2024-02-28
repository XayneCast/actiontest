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
		const response: GetFileShaResponse = await axios.head(`${GithubInformations.URL}/repos/${owner}/${repository}/contents/${filepath}`, this._headers);

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
	const token = GithubParameters.getParameter('secret_token');
	const api = new GithubAPI(token);

	const content = await api.getFileContent('xaynecast', 'test', 'test.md');
	console.log(content);
	await api.updateFile('LMAO !', 'xaynecast', 'test', 'test.md');
}

main();