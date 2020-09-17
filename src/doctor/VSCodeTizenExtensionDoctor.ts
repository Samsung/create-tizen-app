import { exec } from 'child_process';
import { Doctor, DoctorId, ResultType } from './Doctor';
import { promisify } from 'util';
import DoctorManager from './DoctorManager';

class VSCodeTizenExtensionDoctor extends Doctor {
    constructor() {
        super(DoctorId.vscodetizenextension, 'vscode');
    }
    async verify() {
        const successResult = {
            id: this.doctorId,
            category: this.category,
            type: ResultType.pass,
            message: 'Tizen extension is installed.',
            isupdate: false,
            scheduler: null
        };

        const failResult = {
            id: this.doctorId,
            category: this.category,
            type: ResultType.fail,
            message:
                'Tizen extension is not available.\n       Please install the extension.(code --install-extension tizensdk.tizentv)',
            isupdate: false,
            scheduler: null
        };

        const tizenExtensionName = 'tizensdk.tizentv';

        const promiseExec = promisify(exec);

        return new Promise(async (resolve, reject) => {
            try {
                const execResult = await promiseExec('code --list-extensions');
                if (execResult.stderr) {
                    resolve(failResult);
                }
                if (execResult.stdout.toString().includes(tizenExtensionName)) {
                    resolve(successResult);
                }
                resolve(failResult);
            } catch (e) {
                resolve(
                    DoctorManager.createErrorInfo(
                        this.category,
                        'Tizen extension is not available.\n       Check if VSCode is ready to use',
                        e
                    )
                );
            }
        });
    }
}

const vscodeTizenExtensionDoctor: VSCodeTizenExtensionDoctor = new VSCodeTizenExtensionDoctor();
export default vscodeTizenExtensionDoctor;
