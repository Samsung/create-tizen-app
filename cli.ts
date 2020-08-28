const { program } = require('commander');
import { version } from '../package.json';
import { init, doctor } from './index';
import { initLogger } from './Logger';

const cli = () => {
    program
        .version(version)
        .option('--verbose', 'Show verbose debug information');

    program
        .command('init [projectName]', { isDefault: true })
        .description('Setup your project with a prompter')
        .option('-p, --proxy <address>', 'Which setup mode to use')
        .action(async (projectName: string, options: { proxy?: string }) => {
            const { proxy } = options;
            await init({ projectName, proxy });
        });

    program
        .command('doctor')
        .description(
            'Check all of the condition to build and run the tizen app'
        )
        .action(async () => {
            await doctor();
        });

    program.parse(process.argv);
    initLogger(program.verbose);
    return program;
};

cli();
