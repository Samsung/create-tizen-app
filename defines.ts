interface InputData {
    projectName?: string;
    language?: 'typescript' | 'commonjs';
    bundler?: string;
    editor?: string;
    wits?: boolean;
}

interface InitOptions {
    projectName?: string;
    proxy?: string;
}

type PackageObject = {
    [key: string]: string;
};

export { InputData, InitOptions, PackageObject };
