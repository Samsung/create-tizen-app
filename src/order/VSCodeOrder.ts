import { OrderType, Order } from './Order';
import { InputData } from '../defines';
import { CommandType, CustomCommand } from '../command';
import { spawn } from 'child_process';

import { vscodeExistDoctor, vscodeTizenExtensionDoctor } from '../doctor';
import DoctorManager from '../doctor/DoctorManager';
import { logger } from '../Logger';

const cmdify = require('cmdify');

class VSCodeOrder extends Order {
    constructor() {
        super(OrderType.vscode);
    }
    exportCommand(userInput: InputData) {
        return [
            new CustomCommand(CommandType.VSCODE, async () => {
                logger.info('VSCode Command');

                try {
                    await new Promise(function (resolve, reject) {
                        const vscodeCmd = spawn(cmdify('code'), ['--version'], {
                            stdio: 'inherit'
                        });

                        vscodeCmd.on('error', err => {
                            logger.error(`error : ${err.toString()}`);
                            reject(err);
                        });
                        vscodeCmd.on('data', data => {
                            logger.info(data.toString());
                        });
                        vscodeCmd.on('close', () => {
                            logger.info('Finish!\n');
                            resolve();
                        });
                    });
                } catch (e) {
                    logger.error(`error: ${e}`);
                    return;
                }

                try {
                    await new Promise(function (resolve, reject) {
                        const extensionCmd = spawn(
                            cmdify('code'),
                            ['--install-extension', 'tizensdk.tizentv'],
                            {
                                stdio: 'inherit'
                            }
                        );

                        extensionCmd.on('error', err => {
                            logger.error(`error : ${err.toString()}`);
                            reject(err);
                        });
                        extensionCmd.on('data', data => {
                            logger.info(data.toString());
                        });
                        extensionCmd.on('close', data => {
                            logger.info('Finish!\n');
                            resolve();
                        });
                    });
                } catch (e) {
                    logger.error(`error: ${e}`);
                    return;
                }
            })
        ];
    }

    async diagnose() {
        const doctorManager = DoctorManager.getInstance();
        return new Promise<void>(async (resolve, reject) => {
            try {
                await doctorManager.createPrescription(vscodeExistDoctor);
                await doctorManager.createPrescription(
                    vscodeTizenExtensionDoctor
                );
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    writeNpmScript() {
        return {};
    }
}

export default VSCodeOrder;
