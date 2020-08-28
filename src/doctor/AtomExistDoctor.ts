import { exec } from 'child_process';
import { Doctor, DoctorId, ResultType } from './Doctor';
import { promisify } from 'util';

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

        const failResult = {
            id: this.doctorId,
            category: this.category,
            type: ResultType.fail,
            message:
                'ATOM is not available. \n       Please install the editor.(https://atom.io/)',
            isupdate: false,
            scheduler: null
        };

        const promiseExec = promisify(exec);

        return new Promise(async (resolve, reject) => {
            const execResult = await promiseExec('apm --version');
            if (execResult.stderr) {
                resolve(failResult);
            }
            resolve(successResult);
        });
    }
}

const atomExistDoctor: AtomExistDoctor = new AtomExistDoctor();
export default atomExistDoctor;
