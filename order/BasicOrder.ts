import { mkdir } from 'fs';
import { promisify } from 'util';

import { OrderType, Order } from './Order';
import {
    CommandType,
    CustomCommand,
    ConfigFileCommand,
    HTMLCommand,
    PackageJsonCommand,
    npmCommand
} from '../command';
import { InputData } from '../defines';
import {
    createDoctorConfig,
    getCWD,
    getAllNpmScript
} from '../userInputManager';
import DoctorManager from '../doctor/DoctorManager';
import {
    sdbCliDoctor,
    tizenCliDoctor,
    tizenStudioDoctor,
    certificationDoctor
} from '../doctor';

const mkdirPromisify = promisify(mkdir);
class BasicOrder extends Order {
    constructor() {
        super(OrderType.entry);
    }

    exportCommand(userInput: InputData) {
        const filePackageJson = new PackageJsonCommand({});
        if (!userInput.projectName) {
            throw new Error('userInput.projectName is null');
        }
        filePackageJson.name = userInput.projectName;
        filePackageJson.script = getAllNpmScript();

        return [
            new CustomCommand(CommandType.PROJECT_DIR, async () => {
                return await mkdirPromisify(getCWD());
            }),
            filePackageJson,
            new ConfigFileCommand({
                projectName: userInput.projectName,
                tags: [
                    '<tizen:privilege name="http://developer.samsung.com/privilege/productinfo"/>'
                ]
            }),
            new HTMLCommand({
                headTag: [`<title>${userInput.projectName}</title>`]
            }),
            new CustomCommand(CommandType.PACKAGE, async () => {
                await createDoctorConfig(getCWD());
            }),
            npmCommand.generateNpmInstall()
        ];
    }

    async diagnose() {
        const doctorManager = DoctorManager.getInstance();
        try {
            await Promise.all([
                doctorManager.createPrescription(certificationDoctor),
                doctorManager.createPrescription(tizenStudioDoctor)
            ]);
            return;
        } catch (e) {
            throw e;
        }
    }
}

export default BasicOrder;
