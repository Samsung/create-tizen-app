import { OrderType, Order } from './Order';
import { npmCommand, LanguageFileCommand, TsConfigCommand } from '../command';
import { InputData } from '../defines';
import { TsConfigFileExistDoctor, InstalledPackageDoctor } from '../doctor';
import { DoctorId } from '../doctor/Doctor';
import DoctorManager from '../doctor/DoctorManager';

class TypescriptOrder extends Order {
    constructor() {
        super(OrderType.typescript);
    }
    exportCommand(userInput: InputData) {
        return [
            npmCommand.addPackages(
                { 'tizen-tv-webapis': '^1.0.0', 'tizen-common-web': '^1.0.0' },
                {
                    '@types/tizen-tv-webapis': '^1.0.0',
                    typescript: '^3.6.4',
                    '@types/tizen-common-web': '^1.0.0'
                }
            ),

            new LanguageFileCommand({
                fileName: 'index.ts',
                loadModules: [
                    `import { appcommon } from 'tizen-tv-webapis';`,
                    `import { application } from 'tizen-common-web';`
                ],
                codes: [
                    `window.onload = () => {
                        console.log('onload');
                        const version = appcommon.getVersion();
                        console.log('appcommon version : ', version);
                        document.body.addEventListener('keydown', keydownHandler);
                    };
                    
                    function keydownHandler(e: { keyCode: number }) {
                        console.log(e.keyCode);
                        switch (e.keyCode) {
                            case 10009:
                                application.getCurrentApplication().exit();
                                break;
                            default:
                                break;
                        }
                    }`
                ]
            }),
            new TsConfigCommand({
                compilerOptions: [
                    `"target": "ES2016"`,
                    `"module": "commonjs"`,
                    `"lib": ["dom", "es6"]`,
                    `"strict": true`,
                    `"noImplicitAny": true`,
                    `"noImplicitReturns": true`,
                    `"noFallthroughCasesInSwitch": true`,
                    `"esModuleInterop": true`
                ],
                include: [`"src"`]
            })
        ];
    }

    async diagnose() {
        const doctorManager = DoctorManager.getInstance();

        try {
            await Promise.all([
                doctorManager.createPrescription(TsConfigFileExistDoctor),
                doctorManager.createPrescription(
                    new InstalledPackageDoctor(
                        DoctorId.typescriptpackage,
                        'language',
                        {
                            dependencies: [
                                'tizen-tv-webapis',
                                'tizen-common-web'
                            ],
                            devDependencies: [
                                'typescript',
                                '@types/tizen-common-web',
                                '@types/tizen-tv-webapis'
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

export default TypescriptOrder;
