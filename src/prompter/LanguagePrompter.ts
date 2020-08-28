import { yellow } from 'chalk';
import { CommandPrompter, PrompterId } from './Prompter';
import {
    CommonjsOrder,
    TypescriptOrder,
    DotNetOrder,
    OrderType
} from '../order';

class LanguagePrompter extends CommandPrompter {
    constructor() {
        super();
        this.orders = {
            [OrderType.commonjs]: new CommonjsOrder(),
            [OrderType.typescript]: new TypescriptOrder()
            // [OrderType.dotnet]: new DotNetOrder()
        };
        this.promptId = PrompterId.language;
        this._desc = {
            type: 'list',
            name: this.promptId,
            message: `Select the ${yellow('language')}.`,
            choices: Object.values(this.orders).map(v => v.name)
        };
    }

    checkPrev() {
        return true;
    }
}

const languagePrompter: LanguagePrompter = new LanguagePrompter();

export default languagePrompter;
