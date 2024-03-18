class DynamicArgumentsError extends Error {
	constructor(errorMessage: string) {
		super(errorMessage);
	}
}

class DynamicArgumentsRequiredArgumentNotSuppliedError extends DynamicArgumentsError {
	constructor(argumentName: string) {
		super(`Required argument was not supplied:\n\t'${argumentName}'`);
	}
}

interface IDynamicContentVariableTag {
	begin: string;
	end: string;
}

class DynamicContent {
	private _content: string;
	private _variableTag: IDynamicContentVariableTag;

	private _allExpression: RegExp = /[\S\s]*?/;

	public constructor(content: string, variableTag: IDynamicContentVariableTag) {
		this._content = content;
		this._variableTag = variableTag;
	}

	private __buildTag(name: string): string {
		return `${this._variableTag.begin} ${name} ${this._variableTag.end}`;
	}

	public setVariable(name: string, value: string): void {
		const tag = this.__buildTag(name);
		this._content = this._content.replace(
			new RegExp(`${tag}\n?${this._allExpression.source}${tag}`, 'g'),
			value
		);
	}
	public insertVariable(name: string, value: string): void {
		const tag = this.__buildTag(name);
		this._content = this._content.replace(new RegExp(`(${tag}\n?)(${this._allExpression.source}${tag})`, 'g'), `$1${value}$2`);
	}
	public replaceVariable(name: string, value: string): void {
		const tag = this.__buildTag(name);
		this._content = this._content.replace(new RegExp(`(${tag}\n?)${this._allExpression.source}(${tag})`, 'g'),
			`$1${value}$2`
		);
	}
	public removeVariable(name: string): void {
		this._content = this._content.replace(this.__buildTag(name), '');
	}
	public getVariable(name: string): string {
		const tag = this.__buildTag(name);
		const search: RegExpExecArray | null = new RegExp(
			`${tag}\n?(${this._allExpression.source})${tag}`,
			'g'
		).exec(this._content);

		return search ? search[1] : '';
	}

	public getContent(): string {
		return this._content;
	}
}

class DynamicArguments {
	public static getParameter(argumentName: string): string {
		const argumentValue: string | null =  process.env[`INPUT_${argumentName.replace(' ', '_').toUpperCase()}`] || null;

		if(!argumentValue) {
			throw new DynamicArgumentsRequiredArgumentNotSuppliedError(argumentName);
		}

		return argumentValue;
	}
}

export { //Export the necessary data, classes and functions
	DynamicContent,
	DynamicArguments
};