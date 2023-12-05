import { injectable } from 'inversify';
import jwt from 'jsonwebtoken';

export interface JWTService {
    generateAccessToken(data: any): Promise<string>;
    generateRefreshToken(data: any): Promise<string>;
    verifyToken(token: string): Promise<any>;
    generateAccessTokenIfUserExists(user: any): Promise<string>;
}

@injectable()
export class JWTServiceImpl implements JWTService {

    public async generateAccessToken(user: any): Promise<string> {
        const data = {
            name: user.name, instagram: user.instagram,
            phone: user.phone
        };
        return await jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '86400s' });
    }

    public async generateRefreshToken(data: any): Promise<string> {
        return await jwt.sign(data, process.env.JWT_SECRET);
    }

    public async verifyToken(token: string): Promise<any> {
        return await jwt.verify(token, process.env.JWT_SECRET);
    }

    public async generateAccessTokenIfUserExists(user: any): Promise<string> {
        if (!user) return undefined;
        return await this.generateAccessToken(user);
    }

}