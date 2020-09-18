import { writeFile, readFile, existsSync } from 'fs';
import { cwd } from 'process';
import path from 'path';
import { release, platform } from 'os';
import _ from 'lodash';
import { greenBright } from 'chalk';
import { InputData, PackageObject } from './defines';
import { logger } from './Logger';

const OUTPUT_FILE = '.tizen-doctor.json';
let allInput: InputData = { projectName: '' };
let allNpmScript: PackageObject;
let workingDir: string;
let proxy: string;
let doctorConfigData: InputData;
const setUserInput = (input: InputData, npmScript?: PackageObject) => {
    allInput = {
        ...allInput,
        ...input
    };

    allNpmScript = _.assignIn(allNpmScript, npmScript);
};

const getAllNpmScript = () => {
    return allNpmScript;
};

const getUserInput = (): InputData => {
    return allInput;
};

const createDoctorConfig = async (cwd: string) => {
    return new Promise((resolve, reject) => {
        writeFile(
            path.resolve(cwd, OUTPUT_FILE),
            JSON.stringify({
                project: getUserInput(),
                platform: platform(),
                release: release(),
                node: process.version
            }),
            err => {
                if (err) reject(err);
                logger.info(`Create the ${greenBright(OUTPUT_FILE)}\n`);
                resolve();
            }
        );
    });
};

const readDoctorConfig: () => Promise<any> = async () => {
    return new Promise((resolve, reject) => {
        try {
            if (doctorConfigData) {
                resolve(doctorConfigData);
            }
            const doctorConfigFile = path.resolve(getCWD(), OUTPUT_FILE);
            if (existsSync(doctorConfigFile)) {
                readFile(doctorConfigFile, 'utf-8', (error, data) => {
                    if (error) {
                        reject(error);
                    }
                    let doctorData = JSON.parse(data);
                    if(!_.has(doctorData, 'project')) {
                        reject(new Error('.tizen-doctor.json is invalid. Doctor will not run properly.'))
                    }
                    doctorConfigData = doctorData.project;
                    resolve(doctorConfigData);
                });
            }
        } catch (error) {
            reject(error)
        }
    });
};

const readTizenConfig = async () => {};

const getProxy = () => {
    return proxy;
};

const setProxy = (_proxy: string) => {
    proxy = _proxy;
};

const getCWD = () => {
    if (workingDir) {
        return workingDir;
    }

    workingDir = path.resolve(cwd(), allInput.projectName ?? '');

    return workingDir;
};

export {
    setUserInput,
    getUserInput,
    createDoctorConfig,
    readDoctorConfig,
    getCWD,
    setProxy,
    getProxy,
    getAllNpmScript
};
