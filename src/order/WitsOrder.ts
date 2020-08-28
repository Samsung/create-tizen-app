import { greenBright } from 'chalk';
import { resolve } from 'path';
import { spawn } from 'child_process';
import { OrderType, Order } from './Order';
import { InputData } from '../defines';
import { CommandType, CustomCommand, npmCommand } from '../command';
import { getProxy, getCWD } from '../userInputManager';
import { witsToolsDoctor, witsExistDoctor, witsConfigDoctor } from '../doctor';
import DoctorManager from '../doctor/DoctorManager';
import { logger } from '../Logger';

const cmdify = require('cmdify');

class WitsOrder extends Order {
    constructor() {
        super(OrderType.wits);
    }
    exportCommand(userInput: InputData) {
        return [
            npmCommand.addPackages({
                '@tizentv/wits': '^2.2.0'
            }),
            new CustomCommand(CommandType.WITS, async () => {
                const projectPath = getCWD();

                logger.info(
                    `\nCurrent Project is ${greenBright(`${projectPath}`)}`
                );

                const cmd = spawn(
                    resolve(getCWD(), 'node_modules', '.bin', cmdify('wits')),
                    ['--init', getProxy()],
                    {
                        cwd: projectPath,
                        stdio: 'inherit'
                    }
                );

                await new Promise((resolve, reject) => {
                    cmd.on('close', () => {
                        resolve();
                    });
                });
            })
        ];
    }

    async diagnose() {
        const doctorManager = DoctorManager.getInstance();

        try {
            await doctorManager.createPrescription(witsExistDoctor);
            await doctorManager.createPrescription(witsToolsDoctor);
            await doctorManager.createPrescription(witsConfigDoctor);
            return;
        } catch (e) {
            throw e;
        }
    }

    writeNpmScript() {
        return {
            'wits-init': 'wits --init',
            'wits-start': 'wits --start',
            'wits-watch': 'wits --watch'
        };
    }
}

export default WitsOrder;
