import { injectable } from 'inversify';
import admin from 'firebase-admin';
import { BadRequest } from '../util/exceptions';
const serviceAccount = require('../../firebase.json');

export interface FirebaseService {
    verifyToken(token: string): Promise<any>;
}

@injectable()
export class FirebaseServiceImpl implements FirebaseService {

    private static app: any;

    constructor() {
        if (!FirebaseServiceImpl.app) {
            FirebaseServiceImpl.app = admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
        }
    }

    public async verifyToken(token: string): Promise<any> {
        try {
            return await admin.auth().verifyIdToken(token);
        } catch (error) {
            throw new BadRequest('Token expired');
        }
    }

}