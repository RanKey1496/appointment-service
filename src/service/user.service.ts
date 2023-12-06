import { inject, injectable } from 'inversify';
import { User } from '../entity/user.entity';
import { UserRepository } from '../repository/user.repository';
import { BadRequest, Conflict, NotFound } from '../util/exceptions';
import Types from '../config/types';
import { OTPRepository } from '../repository/otp.repository';
import { OTP } from '../entity/otp.entity';
import otpGenerator from 'otp-generator';
import moment from 'moment';
import CryptoUtil from '../util/crypto';

export interface UserService {
    getAll(): Promise<User[]>;
    findById(id: number): Promise<User>;
    validateUserDoesntExists(phone: string): Promise<void>;
    findByPhone(phone: string): Promise<User>;
    signUp(name: string, phone: string, instagram: string): Promise<User>;
    saveOTP(details: string): Promise<OTP>;
    encodeOTPDetails(phone: string): Promise<string>;
    findOTPByDetails(details: string): Promise<OTP>;
    validateOTP(otp: OTP, code: string): Promise<void>;
    decodePhoneFromDetails(details: string): Promise<string>;
    findIfUserExistsByPhone(phone: string): Promise<User>;
    validateOTPForSignUp(otp: OTP, phone: string): Promise<void>;
    updateOTPVerified(otp: OTP): Promise<void>;
}

@injectable()
export class UserServiceImpl implements UserService {

    @inject(Types.UserRepository)
    private userRepository: UserRepository;

    @inject(Types.OTPRepository)
    private otpRepository: OTPRepository;

    public async findById(id: number): Promise<User> {
        const user = await this.userRepository.findById(id);
        if (!user) throw new NotFound('Unable to find user');
        return user;
    }

    public async getAll(): Promise<User[]> {
        return await this.userRepository.findAll();
    }

    public async validateUserDoesntExists(phone: string): Promise<void> {
        const result = await this.userRepository.findByPhone(phone);
        if (result) {
            throw new Conflict('User already exists');
        }
    }

    public async signUp(name: string, phone: string, instagram: string): Promise<User> {
        const user = new User();
        user.name = name;
        user.phone = phone;
        user.instagram = instagram;
        return await this.userRepository.save(user);
    }

    public async findByPhone(phone: string): Promise<User> {
        const result = await this.userRepository.findByPhone(phone);
        if (!result) {
            throw new NotFound('Unable to find user');
        }
        return result;
    }

    public async saveOTP(otpDetails: string): Promise<OTP> {
        const otp = new OTP();
        otp.code = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        otp.expirationTime = moment().add(5, 'minutes').toDate();
        otp.details = otpDetails;
        return await this.otpRepository.save(otp);
    }

    public async encodeOTPDetails(phone: string): Promise<string> {
        const details = {
            timestamp: new Date(),
            check: phone,
            success: true,
            message: 'OTP sent to user'
        };
        return CryptoUtil.encrypt(JSON.stringify(details));
    }

    public async findOTPByDetails(details: string): Promise<OTP> {
        const result = await this.otpRepository.findByDetails(details);
        if (!result) {
            throw new NotFound('Unable to find OTP');
        }
        return result;
    }

    public async validateOTP(otp: OTP, code: string): Promise<void> {
        if (moment(otp.expirationTime).isBefore(moment())) throw new BadRequest('OTP Expired');
        if (otp.code !== code) throw new BadRequest('OTP Not matched');
    }

    public async decodePhoneFromDetails(details: string): Promise<string> {
        try {
            const data = JSON.parse(CryptoUtil.decrypt(details));
            return data.check;
        } catch (error) {
            throw new BadRequest('Unable to decrypt details');
        }
    }

    public async findIfUserExistsByPhone(phone: string): Promise<User> {
        return await this.userRepository.findByPhone(phone);
    }

    public async validateOTPForSignUp(otp: OTP, phone: string): Promise<void> {
        if (!otp.verified) throw new BadRequest('Unable to verify user');
        const phoneDetails = await this.decodePhoneFromDetails(otp.details);
        if (phone !== phoneDetails) throw new BadRequest('Invalid phone for details');
    }

    public async updateOTPVerified(otp: OTP): Promise<void> {
        await this.otpRepository.update(otp.id, { verified: true });
    }

}