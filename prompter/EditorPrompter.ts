import { yellow } from 'chalk';
import { CommandPrompter, PrompterId } from './Prompter';
import {
    VSCodeOrder,
    AtomOrder,
    // TizenStudioOrder,
    OrderType,
    EmptyOrder
} from '../order';

class EditorPrompter extends CommandPrompter {
    constructor() {
        super();
        this.promptId = PrompterId.editor;
        this.orders = {
            [OrderType.vscode]: new VSCodeOrder(),
            [OrderType.atom]: new AtomOrder(),
            [OrderType.none]: new EmptyOrder()
        };

        this._desc = {
            type: 'list',
            name: this.promptId,
            message: `Select the ${yellow('editor')}.`,
            choices: Object.values(this.orders).map(v => v.name)
        };
    }

    checkPrev() {
        return true;
    }
}

const editorPrompter: EditorPrompter = new EditorPrompter();

export default editorPrompter;
