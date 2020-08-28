import { Doctor, DoctorId, ResultType } from './Doctor';
import DoctorManager from './DoctorManager';
import { getCWD } from '../userInputManager';
import { promisify } from 'util';
import os from 'os';
import { exists, readFile } from 'fs';
import { resolve } from 'path';

class CertificationDoctor extends Doctor {
    constructor() {
        super(DoctorId.certification, 'tizenstudio');
    }
    async verify() {
        const PASS = {
            id: this.doctorId,
            category: this.category,
            type: ResultType.pass,
            message: 'Certification is ready.',
            isupdate: false,
            scheduler: null
        };

        const WARNING = {
            id: this.doctorId,
            category: this.category,
            type: ResultType.warning,
            message: 'Create a certification via your editor.',
            isupdate: false,
            scheduler: null
        };

        const existsPromise = promisify(exists);

        return new Promise(async (resolve, reject) => {
            try {
                const profilePath = await getProfilePath();
                const isExist = await existsPromise(profilePath);
                if (isExist) {
                    PASS.message = `${PASS.message} "${profilePath}"`;
                    resolve(PASS);
                } else {
                    WARNING.message = `Certification is not in "${profilePath}". ${WARNING.message} `;
                    resolve(WARNING);
                }
            } catch (error) {
                resolve(
                    DoctorManager.createErrorInfo(
                        this.category,
                        'Check if certification is exist',
                        error
                    )
                );
            }
        });
    }
}

async function getProfilePath() {
    try {
        const platform = os.platform();

        const existsPromise = promisify(exists);
        const readFilePromise = promisify(readFile);

        const witsDataPath = resolve(getCWD(), '.witsconfig.json');
        const isExist = await existsPromise(witsDataPath);
        let path = '';

        if (isExist) {
            const witsData = JSON.parse(
                await readFilePromise(witsDataPath, 'utf-8')
            );
            path = witsData.profileInfo.path;
        } else {
            switch (platform) {
                case 'win32':
                    path = resolve(
                        'C:\\tizen-studio-data\\profile\\profiles.xml'
                    );
                    break;
                case 'linux':
                default:
                    path = resolve(
                        os.homedir(),
                        'tizen-studio-data',
                        'profile',
                        'profiles.xml'
                    );
                    break;
            }
        }
        return path;
    } catch (error) {
        throw error;
    }
}

const certificationDoctor: CertificationDoctor = new CertificationDoctor();
export default certificationDoctor;
