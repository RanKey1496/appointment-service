import { injectable } from 'inversify';
import axios from 'axios';

export interface MessageBirdService {
    sendOTPCode(phone: string, otp: string): Promise<void>;
    sendOrderConfirmation(phone: string, details: any): Promise<void>;
}

@injectable()
export class MessageBirdServiceImpl implements MessageBirdService {

    public async sendOTPCode(phone: string, otp: string): Promise<void> {
        const url = `https://nest.messagebird.com/workspaces/${process.env.MESSAGEBIRD_WORKSPACE_ID}/channels/${process.env.MESSAGEBIRD_CHANNEL_ID}/messages`;
        const data = {
            receiver: {
                contacts: [
                    {
                        identifierValue: phone,
                        identifierKey: 'phonenumber'
                    }
                ]
            },
            template: {
                projectId: '975d15b6-46b6-4929-9ed2-a3f3979d7d9a',
                version: 'ca0f8f66-5f6d-42e4-92f1-b668247d7428',
                locale: 'es',
                variables: {
                    otp
                }
            }
        };

        const headers = {
            Authorization: `AccessKey ${process.env.MESSAGEBIRD_KEY}`
        };

        return axios.post(url, data, { headers });
    }

    public async sendOrderConfirmation(phone: string, details: any): Promise<void> {
        const url = `https://nest.messagebird.com/workspaces/${process.env.MESSAGEBIRD_WORKSPACE_ID}/channels/${process.env.MESSAGEBIRD_CHANNEL_ID}/messages`;
        const data = {
            receiver: {
                contacts: [
                    {
                        identifierValue: phone,
                        identifierKey: 'phonenumber'
                    }
                ]
            },
            template: {
                projectId: '64051419-1dde-4031-a697-2ff201cd8718',
                version: '83458325-97f6-49f0-b2ac-e3046081afa4',
                locale: 'es',
                variables: {}
            }
        };

        const headers = {
            Authorization: `AccessKey ${process.env.MESSAGEBIRD_KEY}`
        };

        return axios.post(url, data, { headers });
    }

}