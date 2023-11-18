import { injectable } from 'inversify';
import jwt from 'jsonwebtoken';

export interface JWTService {
    generateAccessToken(data: any): Promise<string>;
    generateRefreshToken(data: any): Promise<string>;
    verifyToken(token: string): Promise<any>;
}

@injectable()
export class JWTServiceImpl implements JWTService {

    async generateAccessToken(user: any): Promise<string> {
        const data = {
            name: user.name, instagram: user.instagram,
            phone: user.phone, firebaseUid: user.firebaseUid
        };
        return await jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '86400s' });
    }

    async generateRefreshToken(data: any): Promise<string> {
        return await jwt.sign(data, process.env.JWT_SECRET);
    }

    async verifyToken(token: string): Promise<any> {
        return await jwt.verify(token, process.env.JWT_SECRET);
    }

}