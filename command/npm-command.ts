import { greenBright } from 'chalk';
import CLICommand from './CLICommand';
import { PackageObject } from '../defines';
import { getCWD } from '../userInputManager';
import PackageJsonCommand from './PackageJsonCommand';
import { logger } from '../Logger';

const npmCommand = {
    generateNpmInstall: () => {
        logger.info(`\nInstalling ${greenBright('packages')}...`);
        return new CLICommand('npm', {
            cliOptions: ['install'],
            cwd: getCWD()
        });
    },
    addPackages: (
        dependencies: PackageObject = {},
        devDependencies: PackageObject = {}
    ) => {
        return new PackageJsonCommand({
            dependencies,
            devDependencies
        });
    }
};

export default npmCommand;
