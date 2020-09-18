import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { Doctor, DoctorId, ResultType } from './Doctor';
import { getCWD } from '../userInputManager';
import { exists } from 'fs';
import DoctorManager from './DoctorManager';
import { bgRed } from 'chalk';

const cmdify = require('cmdify');

class WitsExistDoctor extends Doctor {
    constructor() {
        super(DoctorId.witsexist, 'wits');
    }
    async verify() {
        const witsPath = path.resolve(
            path.join(getCWD(), 'node_modules', '.bin', cmdify('wits'))
        );

        const PASS = {
            id: this.doctorId,
            category: this.category,
            type: ResultType.pass,
            message: 'WITs is already installed',
            isupdate: false,
            scheduler: null
        };

        const FAIL = {
            id: this.doctorId,
            category: this.category,
            type: ResultType.fail,
            message: `Please do ${bgRed(
                'npm install @tizentv/wits'
            )} in your project.`,
            isupdate: false,
            scheduler: null
        };

        const existsPromise = promisify(exists);
        const execPromise = promisify(exec);

        return new Promise(async (resolve, reject) => {
            try {
                const isExist = await existsPromise(witsPath);
                if (!isExist) {
                    resolve(FAIL);
                }
                const result = await execPromise(`${witsPath} --version`);

                if (result.stderr) {
                    resolve(FAIL);
                } else {
                    resolve(PASS);
                }
            } catch (error) {
                resolve({
                    id: this.doctorId,
                    category: this.category,
                    type: ResultType.fail,
                    message: `Please check wits is available: ${error.message}`,
                    isupdate: false,
                    scheduler: null
                });
            }
        });
    }
}

const witsExistDoctor: WitsExistDoctor = new WitsExistDoctor();
export default witsExistDoctor;
