import { OrderType, Order } from './Order';
import { InputData } from '../defines';
import { npmCommand, HTMLCommand, PackageJsonCommand } from './../command';
import DoctorManager from '../doctor/DoctorManager';
import { InstalledPackageDoctor } from '../doctor';
import { DoctorId } from '../doctor/Doctor';

class ParcelOrder extends Order {
    constructor() {
        super(OrderType.parcel);
    }
    exportCommand(userInput: InputData) {
        return [
            npmCommand.addPackages(
                {},
                {
                    parcel: '^1.12.4',
                    'parcel-plugin-change-file': '^1.3.0'
                }
            ),
            new HTMLCommand({
                headTag: [
                    `<!--[ <script type="text/javascript" src="$WEBAPIS/webapis/webapis.js"></script> ]-->`,
                    `<script src="index.${getFileExtension(
                        userInput.language
                    )}"></script>`
                ]
            }),
            new PackageJsonCommand({ isParcelPluginChangeFile: true })
        ];
    }

    async diagnose() {
        const doctorManager = DoctorManager.getInstance();

        try {
            await doctorManager.createPrescription(
                new InstalledPackageDoctor(DoctorId.parcelpackage, 'bundler', {
                    devDependencies: ['parcel', 'parcel-plugin-change-file']
                })
            );
            return;
        } catch (e) {
            throw e;
        }
    }

    writeNpmScript() {
        return { build: 'parcel src/index.html --public-url ./ --no-hmr' };
    }
}

function getFileExtension(language: string = 'typescript') {
    if (language === 'typescript') {
        return 'ts';
    } else {
        return 'js';
    }
}

export default ParcelOrder;
