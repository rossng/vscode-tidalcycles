import { TidalExpression } from './editor';
import { ILogger } from './logging';
import { Config } from './config';
import * as vscode from 'vscode';

/**
 * Logs the history of a Tidal session.
 */
export interface IHistory {
    getEvalCount(): number;
    log(expression: TidalExpression): void;
}

export class History implements IHistory {
    private expressions: TidalExpression[] = [];

    constructor(private readonly logger: ILogger, private readonly config: Config) {
    }

    public log(expression: TidalExpression): void {
        this.expressions.push(expression);
        if (this.config.showEvalCount()) {
            this.logger.log(`Evals: ${this.getEvalCount()}`);
        }
    }

    public getEvalCount(): number {
        return this.expressions.length;
    }

    public async showHistory() {
        const eol = vscode.workspace.getConfiguration('files', null).get('eol', '\n');
        const history = this.expressions.reduce((text: string, expression: TidalExpression) => {
            return text + expression.expression + eol + eol;
        }, '');
        let document = await vscode.workspace.openTextDocument({ content: history });
        vscode.window.showTextDocument(document);
    }
}