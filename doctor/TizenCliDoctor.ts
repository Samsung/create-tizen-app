import { exec } from 'child_process';
import { promisify } from 'util';
import { Doctor, DoctorId, ResultType } from './Doctor';

class TizenCliDoctor extends Doctor {
    constructor() {
        super(DoctorId.tizenclidoctor, 'overall');
    }
    async verify() {
        const PASS = {
            id: this.doctorId,
            category: this.category,
            type: ResultType.pass,
            message: 'Tizen is available.',
            isupdate: false,
            scheduler: null
        };

        const INFO = {
            id: this.doctorId,
            category: this.category,
            type: ResultType.info,
            message: `Tizen path should be added to environment variable. (Default tizen path: ~{InstalledPath}/tizen-studio/tools/ide/bin)`,
            isupdate: false,
            scheduler: null
        };

        const execPromise = promisify(exec);

        return new Promise(async (resolve, reject) => {
            try {
                const result = await execPromise(`tizen version`);

                if (result.stderr) {
                    resolve(INFO);
                } else {
                    resolve(PASS);
                }
            } catch (error) {
                resolve(INFO);
            }
        });
    }
}

const tizenCliDoctor: TizenCliDoctor = new TizenCliDoctor();
export default tizenCliDoctor;
