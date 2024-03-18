import axios from 'axios';

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

type TStringMap = { [key: string]: string };

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

const GITHUB_API_VARIABLES: TStringMap = {
	API_URL: 'https://api.github.com',
	API_BOT_NAME: 'Legacy System',
	API_BOT_EMAIL: 'xaynecast.core@gmail.com'
} as const;

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

	/**
	 * @brief Create the given link to the github resource path from the given informations
	 *
	 * @param {string} ownerName: The name of the owner of the repository to get the item to create a link from
	 * @param {string} repositoryName: The name of the repository to get the item to create a link from
	 * @param {string} itemPath: The path of the item to create a link from
	 *
	 * @returns {string} The github resource path
	*/
	private __createLink(ownerName: string, repositoryName: string, itemPath: string): string {
		return `${GITHUB_API_VARIABLES.API_URL}/repos/${ownerName}/${repositoryName}/contents/${itemPath}`; //Create the github resource path from the specified informations
	}

	/**
	 * @brief Get the requested unique identifier from the resource path
	 *
	 * @param {string} resourcePath: The path of the resource to get the unique identifier from
	 *
	 * @returns {Promise<IGithubGetItemIdResponse>} The result of the get
	*/
	private async __getItemId(resourcePath: string): Promise<IGithubGetItemIdResponse> {
		try { //Try to execute the next lines
			const response: any = await axios.head(
				resourcePath,
				this._headers
			); //Request the informations of the specified resource

			console.log('HERE: ' + JSON.stringify(response, null, 4));

			return {
				status: response.status,
				sha: response.headers.etag.slice(3, -1)
			}; //Return the unique identifier of the specified resource
		} catch(error) { //Catch the possible error
			console.log(JSON.stringify(error, null, 4));
			switch(error.response.status) { //Handle the error status
				case 403 : //If 403 status
					throw new GithubAPIResourceForbiddenError(resourcePath); //Throw resource forbidden error
				case 404 : //If 404 status
					throw new GithubAPIResourceNotFoundError(resourcePath); //Throw resource not found error
				default : //If other unspecified status
					throw new GithubAPIConnectionFailed(); //Throw connection error
			}
		}
	}

	/**
	 * @brief Get the requested item from the given user repository
	 *
	 * @param {string} ownerName: The name of the owner of the repository to get the item from
	 * @param {string} repositoryName: The name of the repository to get the item from
	 * @param {string} itemPath: The path of the item to get
	 *
	 * @returns {Promise<IGithubGetItemResponse>} The result of the get
	*/
	public async getItem(ownerName: string, repositoryName: string, itemPath: string): Promise<IGithubGetItemResponse> {
		const resourcePath: string = this.__createLink(
			ownerName,
			repositoryName,
			itemPath
		); //Create the github resource path

		try { //Try to execute the next lines
			const response: any = await axios.get(
				resourcePath,
				this._headers
			); //Request the content of the specified resource

			return {
				status: response.status,
				data: {
					sha: response.data.sha,
					content: Buffer.from(response.data.content, 'base64').toString('utf-8'),
					size: response.data.size
				}
			}; //Return the requested item
		} catch(error) { //Catch the possible error
			console.log(JSON.stringify(error, null, 4));
			switch(error.response.status) { //Handle the error status
				case 403 : //If 403 status
					throw new GithubAPIResourceForbiddenError(resourcePath); //Throw resource forbidden error
				case 404 : //If 404 status
					throw new GithubAPIResourceNotFoundError(resourcePath); //Throw resource not found error
				default : //If other unspecified status
					throw new GithubAPIConnectionFailed(); //Throw connection error
			}
		}
	}

	/**
	 * @brief Update the requested item in the given user repository with the given content
	 *
	 * @param {message} messageContent: The message to show in the commit
	 * @param {string} content: The content to update
	 * @param {string} ownerName: The name of the owner of the repository to update the item from
	 * @param {string} repositoryName: The name of the repository to update the item from
	 * @param {string} itemPath: The path of the item to update
	*/
	public async updateItem(messageContent: string, content: string, ownerName: string, repositoryName: string, itemPath: string): Promise<void> {
		const resourcePath: string = this.__createLink(
			ownerName,
			repositoryName,
			itemPath
		); //Create the github resource path

		const data: IGithubGetItemIdResponse = await this.__getItemId(resourcePath); //Get the last unique identifier for the requested github resource

		const options: IGithubAPIContentOptions = {
			owner: ownerName,
			repo: repositoryName,
			path: itemPath,
			message: messageContent,
			committer: {
				name: GITHUB_API_VARIABLES.API_BOT_NAME,
				email: GITHUB_API_VARIABLES.API_BOT_EMAIL
			},
			content: Buffer.from(content, 'utf-8').toString('base64'),
			sha: data.sha
		}; //Specify the github options for the API

		try { //Try to execute the next lines
			await axios.put(
				resourcePath,
				options,
				this._headers
			); //Request the creation or the update of the specified resource
		} catch(error) { //Catch the possible error
			console.log(JSON.stringify(error, null, 4));
			switch(error.response.status) { //Handle the error status
				case 404 : //If 404 status
					throw new GithubAPIResourceNotFoundError(resourcePath); //Throw resource not found error
				case 409 : //If 409 status
					throw new GithubAPIResourceConflictError(resourcePath); //Throw resource conflict error
				case 422 : //If 422 status
					throw new GithubAPIResourceForbiddenError(resourcePath); //Throw resource forbidden error
				default : //If other unspecified status
					throw new GithubAPIConnectionFailed(); //Throw connection error
			}
		}
	}

	/**
	 * @brief Delete the requested item in the given user repository
	 *
	 * @param {message} messageContent: The message to show in the commit
	 * @param {string} ownerName: The name of the owner of the repository to delete the item from
	 * @param {string} repositoryName: The name of the repository to delete the item from
	 * @param {string} itemPath: The path of the item to delete
	*/
	public async deleteItem(messageContent: string, ownerName: string, repositoryName: string, itemPath: string): Promise<void> {
		const resourcePath: string = this.__createLink(
			ownerName,
			repositoryName,
			itemPath
		); //Create the github resource path

		const data: IGithubGetItemIdResponse = await this.__getItemId(resourcePath); //Get the last unique identifier for the requested github resource

		const options: IGithubAPIOptions = {
			owner: ownerName,
			repo: repositoryName,
			path: itemPath,
			message: messageContent,
			committer: {
				name: GITHUB_API_VARIABLES.API_BOT_NAME,
				email: GITHUB_API_VARIABLES.API_BOT_EMAIL
			},
			sha: data.sha
		}; //Specify the github options for the API

		try { //Try to execute the next lines
			await axios.delete(
				resourcePath,
				{
					data: options,
					params: this._headers
				}
			); //Request the deletion of the specified resource
		} catch(error) { //Catch the possible error
			switch(error.response.status) { //Handle the error status
				case 404 : //If 404 status
					throw new GithubAPIResourceNotFoundError(resourcePath); //Throw resource not found error
				case 409 : //If 409 status
					throw new GithubAPIResourceConflictError(resourcePath); //Throw resource conflict error
				case 422 : //If 422 status
					throw new GithubAPIResourceForbiddenError(resourcePath); //Throw resource forbidden error
				default : //If other unspecified status
					throw new GithubAPIConnectionFailed();
			}
		}
	}
}

export { //Export the necessary data, classes and functions
	IGithubGetItemResponse,
	GithubAPIResourceForbiddenError,
	GithubAPIResourceConflictError,
	GithubAPIResourceNotFoundError,
	GithubAPIConnectionFailed,
	GithubAPI
};