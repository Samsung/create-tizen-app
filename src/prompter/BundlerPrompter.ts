import { yellow } from 'chalk';
import { CommandPrompter, PrompterId } from './Prompter';
import { getUserInput } from '../userInputManager';
import { WebpackOrder, ParcelOrder, OrderType } from '../order';

class BundlerPrompter extends CommandPrompter {
    constructor() {
        super();
        this.promptId = PrompterId.bundler;
        this.orders = {
            [OrderType.webpack]: new WebpackOrder(),
            [OrderType.parcel]: new ParcelOrder()
        };

        this._desc = {
            type: 'list',
            name: this.promptId,
            message: `Select the ${yellow('bundler')}.`,
            choices: Object.values(this.orders).map(v => v.name)
        };
    }

    checkPrev() {
        return (
            getUserInput().language === OrderType.commonjs ||
            getUserInput().language === OrderType.typescript
        );
    }
}

const bundlerPrompter: BundlerPrompter = new BundlerPrompter();

export default bundlerPrompter;
