import { exec } from 'child_process';
import { Doctor, DoctorId, ResultType } from './Doctor';
import { promisify } from 'util';
import DoctorManager from './DoctorManager';

class AtomTizenExtensionDoctor extends Doctor {
    constructor() {
        super(DoctorId.atomtizenextension, 'atom');
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
                'Tizen extension is not available.\n       Please install the extension.(apm install atom-tizentv)',
            isupdate: false,
            scheduler: null
        };

        const tizenExtensionName = 'atom-tizentv';

        const promiseExec = promisify(exec);

        return new Promise(async (resolve, reject) => {
            try {
                const execResult = await promiseExec('apm list --installed');

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
                        'Tizen extension is not available.\n       Check if ATOM is ready to use',
                        e
                    )
                );
            }
        });
    }
}

const atomTizenExtensionDoctor: AtomTizenExtensionDoctor = new AtomTizenExtensionDoctor();
export default atomTizenExtensionDoctor;
