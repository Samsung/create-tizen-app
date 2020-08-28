import { exec } from 'child_process';
import { promisify } from 'util';
import { Doctor, DoctorId, ResultType } from './Doctor';

class SdbCliDoctor extends Doctor {
    constructor() {
        super(DoctorId.sdbclidoctor, 'overall');
    }
    async verify() {
        const PASS = {
            id: this.doctorId,
            category: this.category,
            type: ResultType.pass,
            message: 'SDB is available.',
            isupdate: false,
            scheduler: null
        };

        const INFO = {
            id: this.doctorId,
            category: this.category,
            type: ResultType.info,
            message: `SDB path should be added to environment variable. (Default sdb path: ~{InstalledPath}/tizen-studio/tools)`,
            isupdate: false,
            scheduler: null
        };

        const execPromise = promisify(exec);

        return new Promise(async (resolve, reject) => {
            try {
                const result = await execPromise(`sdb version`);

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

const sdbCliDoctor: SdbCliDoctor = new SdbCliDoctor();
export default sdbCliDoctor;
