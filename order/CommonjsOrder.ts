import { OrderType, Order } from './Order';
import { npmCommand, LanguageFileCommand } from '../command';
import { InputData } from '../defines';
import { InstalledPackageDoctor } from '../doctor';
import { DoctorId } from '../doctor/Doctor';
import DoctorManager from '../doctor/DoctorManager';

class CommonjsOrder extends Order {
    constructor() {
        super(OrderType.commonjs);
    }
    exportCommand(userInput: InputData) {
        return [
            npmCommand.addPackages({
                'tizen-tv-webapis': '^1.0.0',
                'tizen-common-web': '^1.0.0'
            }),
            new LanguageFileCommand({
                fileName: 'index.js',
                loadModules: [
                    `import { appcommon } from 'tizen-tv-webapis';`,
                    `import { application } from 'tizen-common-web';`
                ],
                codes: [
                    `window.onload = () => {
                        console.log('onload');
                        const version = appcommon.getVersion();
                        console.log('appcommon version : ', version)
                        document.body.addEventListener('keydown',keydownHandler);
                    };

                    const keyName = {
                        10009: 'return'
                    };
                    
                    function keydownHandler(e) {
                        console.log(e.keyCode);
                        switch (keyName[e.keyCode]) {
                            case 'return':
                                application.getCurrentApplication().exit();
                                break;
                        }
                    }`
                ]
            })
        ];
    }

    async diagnose() {
        const doctorManager = DoctorManager.getInstance();

        try {
            await Promise.all([
                doctorManager.createPrescription(
                    new InstalledPackageDoctor(
                        DoctorId.commonjspackage,
                        'language',
                        {
                            dependencies: [
                                'tizen-tv-webapis',
                                'tizen-common-web'
                            ]
                        }
                    )
                )
            ]);
            return;
        } catch (e) {
            throw e;
        }
    }

    writeNpmScript() {
        return {};
    }
}
export default CommonjsOrder;
