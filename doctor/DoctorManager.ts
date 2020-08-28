import {
    cyanBright,
    greenBright,
    bgRed,
    yellowBright,
    blueBright
} from 'chalk';
const overwrite = require('log-update');
const logSymbols = require('log-symbols');

import { DoctorId, ResultType } from '../doctor/Doctor';
import { Order } from '../order';
import { CommandPrompter } from '../prompter/Prompter';
import { PackageObject } from '../defines';
import { logger } from '../Logger';

type DoctorResult = {
    id: DoctorId;
    category: string;
    type: ResultType;
    message: string;
    isupdate: boolean;
    scheduler: any;
};

const INTERVAL = 1000;

class DoctorManager {
    private static _instance: DoctorManager;
    private constructor() {}
    public static getInstance(): DoctorManager {
        if (!DoctorManager._instance) {
            DoctorManager._instance = new DoctorManager();
        }
        return DoctorManager._instance;
    }

    _prescription: DoctorResult[] = [];
    _doctors: any[] = [];

    async run(prompters: CommandPrompter[], doctorConfig: PackageObject) {
        displayIntroduction();

        try {
            await Promise.all(
                prompters.map(async prompter => {
                    const orderId = doctorConfig[prompter.promptId];
                    if (!orderId) {
                        return;
                    }
                    let order: Order;
                    if (prompter.orders instanceof Order) {
                        order = prompter.orders;
                    } else {
                        order = prompter.orders[orderId];
                    }
                    await order.diagnose();
                    return;
                })
            );
            this.execute();
            return;
        } catch (error) {
            this.createErrorReport(error);
        }
    }

    update(result: DoctorResult) {
        if (result.isupdate === false) {
            return;
        }

        if (!result.scheduler) {
            result.scheduler = setInterval(
                () => {
                    this.updatePrescription();
                    this.execute();
                },
                INTERVAL,
                true
            );
        }
    }

    execute() {
        this._prescription.forEach(result => {
            if (result.id === DoctorId.exception) {
                return;
            }
            if (result.type === ResultType.fail) {
                result.isupdate = true;
                this.update(result);
                return;
            } else {
                clearInterval(result.scheduler);
                result.scheduler = null;
                result.isupdate = false;
                return;
            }
        });
        this.displayResult();
    }

    createErrorReport(error: DoctorResult) {
        error.id = DoctorId.exception;
        this._prescription.push(error);
    }

    static createErrorInfo(
        _category: string,
        description: string,
        error: Error
    ) {
        return {
            id: DoctorId.exception,
            category: _category,
            type: ResultType.fail,
            message: `${description} : ERROR: ${error.message}`,
            isupdate: false,
            scheduler: null
        };
    }

    async createPrescription(doctor: any) {
        try {
            const result = await doctor.verify();
            if (result.type === ResultType.fail) {
                this._doctors.push(doctor);
            }
            this._prescription.push(result);
            return;
        } catch (error) {
            throw error;
        }
    }

    updatePrescription() {
        this._doctors.forEach(async doctor => {
            try {
                const result = await doctor.verify();
                this._prescription.forEach(item => {
                    if (item.id === result.id) {
                        item.id = result.id;
                        item.type = result.type;
                        item.message = result.message;
                    }
                });
            } catch (error) {
                throw error;
            }
        });
    }

    getStatusSymbol(type: ResultType) {
        switch (type) {
            case ResultType.pass:
                return `${logSymbols.success}`;
            case ResultType.fail:
                return `${logSymbols.error}`;
            case ResultType.warning:
                return `${yellowBright('▲')}`;
            case ResultType.info:
                return `${blueBright('#')}`;
            default:
                return ``;
        }
    }

    categorizePrescription() {
        let temp = this._prescription;
        if (temp.length < 2) {
            return;
        }
        temp.sort((before, after) => {
            return before.category < after.category
                ? -1
                : before.category > after.category
                ? 1
                : 0;
        });
        this._prescription = temp;
    }

    displayResult() {
        let scription = '';
        let prevCategory = '';
        let isExceptionOccur = false;
        let passCount = 0;
        this.categorizePrescription();
        this._prescription.forEach(result => {
            if (result.type === ResultType.pass) {
                passCount++;
            }
            if (result.id === DoctorId.exception) {
                isExceptionOccur = true;
            }
            if (prevCategory !== result.category) {
                scription = scription.concat(
                    `  ${greenBright(result.category)}\n`
                );
                prevCategory = result.category;
            }
            scription = scription.concat(
                `     ${this.getStatusSymbol(result.type)} ${result.message}\n`
            );
        });

        overwrite(scription);

        if (this._prescription.length === passCount) {
            process.exit(0);
        }

        if (
            this._doctors.length === this._prescription.length &&
            isExceptionOccur
        ) {
            logger.error(
                `${bgRed(
                    'Exceptions occurred!!! A new project might not be created successfully.'
                )}`
            );
            logger.error(
                `If you've got this message, please create an issue with this log on Github.\n`
            );
            process.exit(0);
        }
    }
}

function displayIntroduction() {
    logger.info(`\n\n${cyanBright('Doctor')} is running...`);
    logger.info(`  ${logSymbols.success} : PASS`);
    logger.info(`  ${logSymbols.error} : FAIL (Must be resolved)`);
    logger.info(`  ${yellowBright('▲')} : WARNING (Better to be resolved)`);
    logger.info(`  ${blueBright('#')} : INFO (For You Information)\n`);
}

export default DoctorManager;
