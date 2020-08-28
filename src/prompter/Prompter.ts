import * as inquirer from 'inquirer';
import { setUserInput, getUserInput } from '../userInputManager';
import { Order } from '../order';
import { EmptyOrder } from '../order/Order';
import _ from 'lodash';
import { logger } from '../Logger';

enum PrompterId {
    projectName = 'projectName',
    language = 'language',
    bundler = 'bundler',
    editor = 'editor',
    wits = 'wits'
}

type PrompterType = 'confirm' | 'list' | 'input';
// | 'number'
// | 'rawlist'
// | 'expand'
// | 'checkbox'
// | 'password'
// | 'editor';

interface PromopterDesc {
    type: PrompterType;
    name: string;
    message: string;
    default?: boolean;
    choices?: [];
}

class Prompter {
    constructor(desc?: PromopterDesc) {
        this.input = {};
        this._desc = desc || {};
    }
    input: { [key: string]: any };
    protected _desc: any;

    set desc(input: any) {
        this._desc = _.assignIn(this._desc, input);
    }

    prompt() {
        return inquirer.prompt(this._desc).then((input: any) => {
            this.input = input;
            setUserInput(input);
            return Promise.resolve(input);
        });
    }
}

class CommandPrompter extends Prompter {
    constructor() {
        super();
        this.orders = {};
        this.promptId = '';
        this.predicator = {
            list: this.predicateList.bind(this),
            confirm: this.predicateConfirm.bind(this),
            input: this.predicateSingle.bind(this)
        };
    }
    orders:
        | {
              [key: string]: Order;
          }
        | Order;
    promptId: PrompterId | '';

    predicator: {
        [key: string]: () => Order;
    };

    predicateList() {
        if (this.orders instanceof Order) {
            return this.orders;
        } else {
            const select = Object.values(this.input).pop();
            if (select && this.orders[select] instanceof Order) {
                return this.orders[select];
            } else {
                throw new Error(`Check the this.commands ${select}`);
            }
        }
    }

    predicateConfirm() {
        logger.debug(`predicateConfirm`);

        if (Object.values(this.input).pop()) {
            return this.predicateSingle();
        } else {
            return new EmptyOrder();
        }
    }

    predicateSingle() {
        logger.debug(`predicateSingle`);
        if (this.orders instanceof Order) {
            return this.orders;
        } else {
            throw new Error('The confirm type only support single Order');
        }
    }
    checkPrev() {
        return true;
    }

    collectCommand() {
        const order = this.checkOrder();
        return order.exportCommand(getUserInput());
    }

    checkOrder() {
        return this.predicator[this._desc.type]();
    }

    prompt() {
        if (this.checkPrev()) {
            return inquirer.prompt(this._desc).then((input: any) => {
                this.input = input;
                setUserInput(input, this.checkOrder().writeNpmScript());
                return Promise.resolve(input);
            });
        } else {
            return Promise.resolve();
        }
    }
}

export { CommandPrompter, Prompter as BasicPrompter, PrompterId };
