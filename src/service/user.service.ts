import { inject, injectable } from 'inversify';
import { User } from '../entity/user.entity';
import { UserRepository } from '../repository/user.repository';
import { Conflict, NotFound } from '../util/exceptions';
import Types from '../config/types';

export interface UserService {
    getAll(): Promise<User[]>;
    validateUserDoesntExists(phone: string, firebaseUid: string): Promise<void>;
    findByPhoneAndFirebaseUid(phone: string, firebaseUid: string): Promise<User>;
    signUp(name: string, phone: string, instagram: string, firebaseUid: string): Promise<User>;
}

@injectable()
export class UserServiceImpl implements UserService {

    @inject(Types.UserRepository)
    private userRepository: UserRepository;

    public async getAll(): Promise<User[]> {
        return await this.userRepository.findAll();
    }

    public async validateUserDoesntExists(phone: string, firebaseUid: string): Promise<void> {
        const result = await this.userRepository.findByPhoneOrFirebaseUid(phone, firebaseUid);
        if (result) {
            throw new Conflict('User already exists');
        }
    }

    public async signUp(name: string, phone: string, instagram: string, firebaseUid: string): Promise<User> {
        const user = new User();
        user.name = name;
        user.phone = phone;
        user.instagram = instagram;
        user.firebaseUid = firebaseUid;
        return await this.userRepository.save(user);
    }

    public async findByPhoneAndFirebaseUid(phone: string, firebaseUid: string): Promise<User> {
        const result = await this.userRepository.findByPhoneAndFirebaseUid(phone, firebaseUid);
        if (!result) {
            throw new NotFound('Unable to find user');
        }
        return result;
    }

}