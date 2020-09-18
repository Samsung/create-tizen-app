import { exec } from 'child_process';
import { Doctor, DoctorId, ResultType } from './Doctor';
import { promisify } from 'util';
import DoctorManager from './DoctorManager';

class AtomExistDoctor extends Doctor {
    constructor() {
        super(DoctorId.atomexist, 'atom');
    }
    async verify() {
        const successResult = {
            id: this.doctorId,
            category: this.category,
            type: ResultType.pass,
            message: 'ATOM is installed.',
            isupdate: false,
            scheduler: null
        };

        const promiseExec = promisify(exec);

        return new Promise(async (resolve, reject) => {
            try {
                const execResult = await promiseExec('apm --version');
                if (execResult.stderr) {
                    resolve(
                        DoctorManager.createErrorInfo(
                            this.category,
                            'Check if the Atom exists.(apm --version)\n       Please check if editor is installed.(https://atom.io/)',
                            new Error(execResult.stderr)
                        )
                    );
                }
                resolve(successResult);
            } catch (e) {
                resolve(
                    DoctorManager.createErrorInfo(
                        this.category,
                        'Check if the Atom exists.(apm --version)\n       Please check if editor is installed.(https://atom.io/)',
                        e
                    )
                );
            }
        });
    }
}

const atomExistDoctor: AtomExistDoctor = new AtomExistDoctor();
export default atomExistDoctor;
