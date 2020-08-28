import { OrderType, Order } from './Order';
import { InputData } from '../defines';
import { CommandType, CustomCommand } from '../command';
import { spawn } from 'child_process';

import { atomExistDoctor, atomTizenExtensionDoctor } from '../doctor';
import DoctorManager from '../doctor/DoctorManager';
import { logger } from '../Logger';

const cmdify = require('cmdify');

class AtomOrder extends Order {
    constructor() {
        super(OrderType.atom);
    }
    exportCommand(userInput: InputData) {
        return [
            new CustomCommand(CommandType.ATOM, async () => {
                logger.info('ATOM Command');

                try {
                    await new Promise(function (resolve, reject) {
                        const atomCmd = spawn(cmdify('apm'), ['--version'], {
                            stdio: 'inherit'
                        });

                        atomCmd.on('error', err => {
                            logger.error(`error : ${err.toString()}`);
                            reject(err);
                        });
                        atomCmd.on('data', data => {
                            logger.info(data.toString());
                        });
                        atomCmd.on('close', () => {
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
                            cmdify('apm'),
                            ['install', 'atom-tizentv'],
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
                await doctorManager.createPrescription(atomExistDoctor);
                await doctorManager.createPrescription(
                    atomTizenExtensionDoctor
                );
                resolve();
            } catch (e) {
                reject();
            }
        });
    }

    writeNpmScript() {
        return {};
    }
}

export default AtomOrder;
