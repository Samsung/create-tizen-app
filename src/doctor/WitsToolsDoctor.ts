import path from 'path';
import { promisify } from 'util';
import { Doctor, DoctorId, ResultType } from './Doctor';
import { getCWD } from '../userInputManager';
import { exists } from 'fs';
import DoctorManager from './DoctorManager';
import { bgRed } from 'chalk';

class WitsToolsDoctor extends Doctor {
    constructor() {
        super(DoctorId.witstools, 'wits');
    }
    async verify() {
        const witsPath = path.join(
            getCWD(),
            'node_modules',
            '@tizentv',
            'wits'
        );
        const tools = ['container', 'resource', 'tools'];
        let count = 0;

        const PASS = {
            id: this.doctorId,
            category: this.category,
            type: ResultType.pass,
            message: 'Tools for WITs are available',
            isupdate: false,
            scheduler: null
        };

        const FAIL = {
            id: this.doctorId,
            category: this.category,
            type: ResultType.fail,
            message: `Please do ${bgRed(
                'npm run wits-init'
            )} for downloading tools, or please check if you are behind proxy`,
            isupdate: false,
            scheduler: null
        };

        const existsPromise = promisify(exists);

        return new Promise(async (resolve, reject) => {
            try {
                for (const tool of tools) {
                    const toolsPath = path.resolve(path.join(witsPath, tool));

                    const isExist = await existsPromise(toolsPath);
                    if (isExist) {
                        count++;
                    }
                }
                if (count === tools.length) {
                    resolve(PASS);
                } else {
                    resolve(FAIL);
                }
            } catch (error) {
                resolve(
                    DoctorManager.createErrorInfo(
                        this.category,
                        'Check if WITs tools were prepared',
                        error
                    )
                );
            }
        });
    }
}

const witsToolsDoctor: WitsToolsDoctor = new WitsToolsDoctor();
export default witsToolsDoctor;
