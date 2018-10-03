import * as TypeMoq from 'typemoq';
import { Logger } from '../src/logging';
import { Config } from '../src/config';
import { History } from '../src/history';
import { TidalExpression } from '../src/editor';
import { Range } from 'vscode';
import { expect } from 'chai';

suite('History', () => {
    test('Correct reporting of number of evaluated expressions', async () => {
        let mockLogger = TypeMoq.Mock.ofType<Logger>();
        let mockConfig = TypeMoq.Mock.ofType<Config>();

        let history = new History(mockLogger.object, mockConfig.object);
        history.log(new TidalExpression('maurice', new Range(0, 0, 0, 0), 0));
        history.log(new TidalExpression('roy', new Range(0, 0, 0, 0), 0));

        expect(history.getEvalCount()).to.equal(2);
    });

    test('Correct ordering of expression history', async () => {
        let mockLogger = TypeMoq.Mock.ofType<Logger>();
        let mockConfig = TypeMoq.Mock.ofType<Config>();

        let history = new History(mockLogger.object, mockConfig.object);
        history.log(new TidalExpression('maurice', new Range(0, 0, 0, 0), 0));
        history.log(new TidalExpression('roy', new Range(0, 0, 0, 0), 15));
        history.log(new TidalExpression('jen', new Range(0, 0, 0, 0), 5));
        history.log(new TidalExpression('denholm', new Range(0, 0, 0, 0), 20));

        expect(history.getEvalCount()).to.equal(4);
        expect(history.historyToString().split('\r\n').filter(l => l.length > 0)).to.deep.equal(
            ['maurice', 'jen', 'roy', 'denholm']
        );
    });
});