import { resolve } from 'path';
import { promisify } from 'util';
import { exists } from 'fs';
import { Doctor, DoctorId, ResultType } from './Doctor';
import { getCWD } from '../userInputManager';
import DoctorManager from './DoctorManager';

class WebpackConfigFileExistDoctor extends Doctor {
    constructor() {
        super(DoctorId.webpackconfigfileexist, 'bundler');
    }
    async verify() {
        const doctorFile = resolve(getCWD(), 'webpack.config.js');

        const PASS = {
            id: this.doctorId,
            category: this.category,
            type: ResultType.pass,
            message: 'webpack.config.js file is exist',
            isupdate: false,
            scheduler: null
        };

        const FAIL = {
            id: this.doctorId,
            category: this.category,
            type: ResultType.fail,
            message: 'please do make webpack.config.js file.',
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
                        'Check if webpack.config.js file is exist',
                        error
                    )
                );
            }
        });
    }
}

const webpackConfigFileExistDoctor: WebpackConfigFileExistDoctor = new WebpackConfigFileExistDoctor();
export default webpackConfigFileExistDoctor;
