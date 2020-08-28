import { resolve } from 'path';
import { promisify } from 'util';
import { readFile } from 'fs';
import { Doctor, DoctorId, ResultType } from './Doctor';
import { getCWD } from '../userInputManager';
import DoctorManager from './DoctorManager';

type packageList = {
    dependencies?: string[];
    devDependencies?: string[];
};

class InstalledPackageDoctor extends Doctor {
    constructor(
        doctorId: DoctorId,
        category: string,
        packageList: packageList
    ) {
        super(doctorId, category);

        this._packageDoctorId = doctorId;
        this._packageCategory = category;
        this._dependencies = packageList.dependencies ?? [];
        this._devDependencies = packageList.devDependencies ?? [];
    }

    private readonly _packageDoctorId: DoctorId;
    private readonly _packageCategory: string = '';
    private readonly _dependencies: string[];
    private readonly _devDependencies: string[];

    async verify() {
        const packageFile = resolve(getCWD(), 'package.json');
        const packageDoctorId = this._packageDoctorId;
        const packageCategory = this._packageCategory;

        const dependencies = this._dependencies;
        const devDependencies = this._devDependencies;

        const readFilePromise = promisify(readFile);

        return new Promise(async (resolve, reject) => {
            try {
                const packageFileData = JSON.parse(
                    await readFilePromise(packageFile, 'utf-8')
                );

                let dependence = '';
                let dependenceNum = 0;

                let devDependence = '';
                let devDependenceNum = 0;

                let notInstalledPackages = '';

                dependencies.forEach((value: string) => {
                    if (packageFileData.dependencies[value]) {
                        dependenceNum++;
                    } else {
                        dependence += `${value} `;
                    }
                });

                devDependencies.forEach((value: string) => {
                    if (packageFileData.devDependencies[value]) {
                        devDependenceNum++;
                    } else {
                        devDependence += `${value} `;
                    }
                });

                notInstalledPackages = getNotInstalledPackages(
                    dependence,
                    devDependence
                );

                const PASS = {
                    id: this.doctorId,
                    category: this.category,
                    type: ResultType.pass,
                    message: `${packageDoctorId} ${packageCategory} required packages installation completed.`,
                    isupdate: false,
                    scheduler: null
                };

                const FAIL = {
                    id: this.doctorId,
                    category: this.category,
                    type: ResultType.fail,
                    message: `please do install packages (${notInstalledPackages})`,
                    isupdate: false,
                    scheduler: null
                };
                if (
                    devDependenceNum === devDependencies.length &&
                    dependenceNum === dependencies.length
                ) {
                    resolve(PASS);
                } else {
                    resolve(FAIL);
                }
            } catch (error) {
                resolve(
                    DoctorManager.createErrorInfo(
                        this.category,
                        'Check if package.json file is exist',
                        error
                    )
                );
            }
        });
    }
}

function getNotInstalledPackages(
    dependence: string = '',
    devDependence: string = ''
): string {
    let msg = ``;
    if (dependence.length > 0) {
        msg += `[dependencies] : ${dependence} `;
    }

    if (devDependence.length > 0) {
        msg += `[devDependencies] : ${devDependence} `;
    }

    return msg;
}

export default InstalledPackageDoctor;
