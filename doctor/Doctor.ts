enum DoctorId {
    atomexist = 'atom-exist',
    atomtizenextension = 'atom-tizen-extension',
    vscodeexist = 'vscode-exist',
    vscodetizenextension = 'vscode-tizen-extension',
    witsconfig = 'wits-config',
    witsexist = 'wits-exist',
    witstools = 'wits-tools',
    exception = 'exception',
    tsconfigfileexist = 'ts-config-file-exist',
    webpackconfigfileexist = 'webpack-config-file-exist',
    typescriptpackage = 'typescript-package',
    commonjspackage = 'commonjs-package',
    webpackpackage = 'webpack-package',
    parcelpackage = 'parcel-package',
    sdbclidoctor = 'sdb-cli-doctor',
    tizenclidoctor = 'tizen-cli-doctor',
    tizenstudio = 'tizen-studio',
    certification = 'certification'
}

enum ResultType {
    pass,
    fail,
    warning,
    info
}

class Doctor {
    constructor(doctorId: DoctorId, category: string) {
        this._doctorId = doctorId;
        this._category = category;
    }
    private readonly _doctorId: DoctorId;
    private readonly _category: string;

    get doctorId() {
        return this._doctorId;
    }

    get category() {
        return this._category;
    }

    async verify(): Promise<any> {}
}

export { Doctor, DoctorId, ResultType };
