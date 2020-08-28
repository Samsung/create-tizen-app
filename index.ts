import { InitOptions, PackageObject } from './defines';
import { prompterManager } from './prompter/PrompterManager';
import { readDoctorConfig, getUserInput } from './userInputManager';
import DoctorManager from './doctor/DoctorManager';

const init = async (options: InitOptions) => {
    await prompterManager.run(options);
    const userInput = getUserInput();
    await DoctorManager.getInstance().run(
        prompterManager.prompters,
        userInput as PackageObject
    );
};

const doctor = async () => {
    const doctorConfig = await readDoctorConfig();
    await DoctorManager.getInstance().run(
        prompterManager.prompters,
        doctorConfig
    );
};

export { init, doctor };
