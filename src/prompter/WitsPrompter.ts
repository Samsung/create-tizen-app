import { yellow } from 'chalk';
import { CommandPrompter, PrompterId } from './Prompter';
import { WitsOrder } from '../order';

class WitsPrompter extends CommandPrompter {
    constructor() {
        super();
        this.promptId = PrompterId.wits;
        this.orders = new WitsOrder();
        this._desc = {
            type: 'confirm',
            name: this.promptId,
            message: `Do you want to use ${yellow('WITs(Live Reload)')} : `,
            default: true
        };
    }
}

const witsPrompter: WitsPrompter = new WitsPrompter();

export default witsPrompter;
