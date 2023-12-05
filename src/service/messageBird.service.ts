import { injectable } from 'inversify';

export interface MessageBirdService {
    sendOTPCode(phone: string, otp: string): Promise<void>;
}

@injectable()
export class MessageBirdServiceImpl implements MessageBirdService {

    public async sendOTPCode(phone: string, otp: string): Promise<void> {
        
    }

}