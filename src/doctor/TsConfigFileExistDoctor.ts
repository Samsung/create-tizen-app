import { resolve } from 'path';
import { promisify } from 'util';
import { exists } from 'fs';
import { Doctor, DoctorId, ResultType } from './Doctor';
import { getCWD } from '../userInputManager';
import DoctorManager from './DoctorManager';

class TsConfigFileExistDoctor extends Doctor {
    constructor() {
        super(DoctorId.tsconfigfileexist, 'language');
    }
    async verify() {
        const doctorFile = resolve(getCWD(), 'tsconfig.json');

        const PASS = {
            id: this.doctorId,
            category: this.category,
            type: ResultType.pass,
            message: 'tsconfig.json is exist',
            isupdate: false,
            scheduler: null
        };

        const FAIL = {
            id: this.doctorId,
            category: this.category,
            type: ResultType.fail,
            message: 'please do make tsconfig.json file.',
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
                        'Check if tsconfig.json file is exist',
                        error
                    )
                );
            }
        });
    }
}

const tsConfigFileExistDoctor: TsConfigFileExistDoctor = new TsConfigFileExistDoctor();
export default tsConfigFileExistDoctor;
