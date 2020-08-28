import { resolve } from 'path';
import { promisify } from 'util';
import { exists } from 'fs';
import { Doctor, DoctorId, ResultType } from './Doctor';
import { getCWD } from '../userInputManager';
import { bgRed } from 'chalk';
import DoctorManager from './DoctorManager';

class WitsConfigDoctor extends Doctor {
    constructor() {
        super(DoctorId.witsconfig, 'wits');
    }
    async verify() {
        const doctorFile = resolve(getCWD(), '.witsconfig.json');

        const PASS = {
            id: this.doctorId,
            category: this.category,
            type: ResultType.pass,
            message: '.witsconfig.json is exist',
            isupdate: false,
            scheduler: null
        };

        const FAIL = {
            id: this.doctorId,
            category: this.category,
            type: ResultType.fail,
            message: `Please do ${bgRed(
                'npm run wits-init'
            )} in your project for WITs configuration`,
            isupdate: false,
            scheduler: null
        };

        const existsPromise = promisify(exists);

        return new Promise(async (resolve, reject) => {
            try {
                const isExist = await existsPromise(doctorFile);
                if (isExist) {
                    resolve(PASS);
                } else {
                    resolve(FAIL);
                }
            } catch (error) {
                resolve(
                    DoctorManager.createErrorInfo(
                        this.category,
                        'Check if WITs configfile is exist',
                        error
                    )
                );
            }
        });
    }
}

const witsConfigDoctor: WitsConfigDoctor = new WitsConfigDoctor();
export default witsConfigDoctor;
