import { exec } from 'child_process';
import { Doctor, DoctorId, ResultType } from './Doctor';
import { promisify } from 'util';
import DoctorManager from './DoctorManager';

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

        const promiseExec = promisify(exec);

        return new Promise(async (resolve, reject) => {
            try {
                const execResult = await promiseExec('code --version');
                if (execResult.stderr) {
                    resolve(
                        DoctorManager.createErrorInfo(
                            this.category,
                            'Check if the VSCode exists.(code --version)\n       Please check if editor is installed.(https://code.visualstudio.com/)',
                            new Error(execResult.stderr)
                        )
                    );
                }
                resolve(successResult);
            } catch (e) {
                resolve(
                    DoctorManager.createErrorInfo(
                        this.category,
                        'Check if the VSCode exists.(code --version)\n       Please check if editor is installed.(https://code.visualstudio.com/)',
                        e
                    )
                );
            }
        });
    }
}

const vscodeExistDoctor: VSCodeExistDoctor = new VSCodeExistDoctor();
export default vscodeExistDoctor;
