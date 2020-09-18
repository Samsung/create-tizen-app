import { InitOptions, PackageObject } from './defines';
import { prompterManager } from './prompter/PrompterManager';
import { readDoctorConfig, getUserInput } from './userInputManager';
import DoctorManager from './doctor/DoctorManager';
import { logger } from './Logger';

const init = async (options: InitOptions) => {
    await prompterManager.run(options);
    const userInput = getUserInput();
    await DoctorManager.getInstance().run(
        prompterManager.prompters,
        userInput as PackageObject
    );
};

const doctor = async () => {
    try {
        const doctorConfig = await readDoctorConfig();
        await DoctorManager.getInstance().run(
            prompterManager.prompters,
            doctorConfig
        );
    } catch (e) {
        logger.error(`error: ${e}`);
    }
};

export { init, doctor };
