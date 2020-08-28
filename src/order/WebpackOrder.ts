import { OrderType, Order } from './Order';
import { InputData, PackageObject } from '../defines';
import { npmCommand, HTMLCommand, WebpackConfigCommand } from './../command';
import {
    WebpackConfigFileExistDoctor,
    InstalledPackageDoctor
} from '../doctor';
import { DoctorId } from '../doctor/Doctor';
import DoctorManager from '../doctor/DoctorManager';

class WebpackOrder extends Order {
    constructor() {
        super(OrderType.webpack);
        this.packageList = [];
    }
    private readonly packageList: string[];
    exportCommand(userInput: InputData) {
        const fileExtension = getFileExtension(userInput.language);
        const rules = getBundleRules(userInput.language);
        const resolveExtensions = getResolveExtensions(userInput.language);
        const packages = getPackages(userInput.language);
        for (let key in packages) {
            this.packageList.push(key);
        }
        return [
            npmCommand.addPackages({}, packages),
            new WebpackConfigCommand({
                loadModules: [`const path = require('path');`],
                properties: [
                    `entry: [path.resolve(__dirname, 'src/index.${fileExtension}'),
                    path.resolve(__dirname, 'src/index.html')]`,
                    `devtool: 'inline-source-map'`,
                    `mode: 'development'`,
                    `module: {
                        rules: ${rules}
                    }`,
                    `resolve: {
                        extensions: ${resolveExtensions}
                    }`,
                    `output: {
                        path: path.resolve(__dirname, 'dist'),
                        filename: 'bundle.js',
                        sourceMapFilename: 'bundle.map'
                    }`
                ]
            }),
            new HTMLCommand({
                headTag: [
                    `<script type="text/javascript" src="$WEBAPIS/webapis/webapis.js"></script>`,
                    `<script src="bundle.js"></script>`
                ]
            })
        ];
    }

    async diagnose() {
        const doctorManager = DoctorManager.getInstance();

        try {
            await Promise.all([
                doctorManager.createPrescription(WebpackConfigFileExistDoctor),
                doctorManager.createPrescription(
                    new InstalledPackageDoctor(
                        DoctorId.webpackpackage,
                        'bundler',
                        {
                            devDependencies: this.packageList
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
        return { build: 'webpack --watch' };
    }
}

function getFileExtension(language: string = 'typescript') {
    if (language === 'typescript') {
        return 'ts';
    } else if (language === 'commonjs') {
        return 'js';
    } else {
        return '';
    }
}

function getBundleRules(language: string = 'typescript') {
    if (language === 'typescript') {
        return `[
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(html|css)$/i,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            }
        ]`;
    } else if (language === 'commonjs') {
        return `[
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
                exclude: /(node_modules|bower_components)/
            },
            {
                test: /\.(html|css)$/i,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            }
        ]`;
    } else {
        return `[]`;
    }
}

function getResolveExtensions(language: string = 'typescript') {
    if (language === 'typescript') {
        return `['.tsx', '.ts', '.js']`;
    } else if (language === 'commonjs') {
        return `[]`;
    } else {
        return `[]`;
    }
}

function getPackages(language: string = 'typescript'): PackageObject {
    if (language === 'typescript') {
        return {
            webpack: '^4.41.2',
            'webpack-cli': '^3.3.11',
            'ts-loader': '^6.2.1',
            'file-loader': '^6.0.0'
        };
    } else if (language === 'commonjs') {
        return {
            webpack: '^4.41.2',
            'webpack-cli': '^3.3.11',
            'babel-loader': '^8.1.0',
            '@babel/core': '^7.10.2',
            '@babel/preset-env': '^7.10.2',
            'file-loader': '^6.0.0'
        };
    } else {
        return {};
    }
}

export default WebpackOrder;
