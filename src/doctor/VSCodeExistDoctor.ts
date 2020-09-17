import { exec } from 'child_process';
import { Doctor, DoctorId, ResultType } from './Doctor';
import { promisify } from 'util';

class VSCodeExistDoctor extends Doctor {
    constructor() {
        super(DoctorId.vscodeexist, 'vscode');
    }
    async verify() {
        const successResult = {
            id: this.doctorId,
            category: this.category,
            type: ResultType.pass,
            message: 'vscode is installed.',
            isupdate: false,
            scheduler: null
        };

        const failResult = {
            id: this.doctorId,
            category: this.category,
            type: ResultType.fail,
            message:
                'vscode is not available.\n       Please install the editor.(https://code.visualstudio.com/)',
            isupdate: false,
            scheduler: null
        };

        const promiseExec = promisify(exec);

        return new Promise(async (resolve, reject) => {
            try {
                const execResult = await promiseExec('code --version');
                if (execResult.stderr) {
                    resolve(failResult);
                }
                resolve(successResult);
            } catch (e) {
                resolve(failResult);
            }
        });
    }
}

const vscodeExistDoctor: VSCodeExistDoctor = new VSCodeExistDoctor();
export default vscodeExistDoctor;
