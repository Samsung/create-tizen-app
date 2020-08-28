import { exec } from 'child_process';
import { Doctor, DoctorId, ResultType } from './Doctor';

class TizenStudioDoctor extends Doctor {
    constructor() {
        super(DoctorId.tizenstudio, 'tizenstudio');
    }
    async verify() {
        const result = {
            id: this.doctorId,
            category: this.category,
            type: ResultType.info,
            message:
                'All applications must be signed with valid samsung certificates before you submit the application to seller office. \n       You should check the below guide for creating the samsung certificates. \n       https://developer.samsung.com/smarttv/develop/getting-started/setting-up-sdk/creating-certificates.html',
            isupdate: false,
            scheduler: null
        };

        return Promise.resolve(result);
    }
}

const tizenStudioDoctor: TizenStudioDoctor = new TizenStudioDoctor();
export default tizenStudioDoctor;
