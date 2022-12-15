import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { User, UserToken } from './models/users.model';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User')
    private readonly usersModel: Model<User>,
    private readonly authService: AuthService,
  ) {}

  public async signup(signupDto: SignupDto): Promise<User> {
    const user = await this.findByEmail(signupDto.email);
    console
    if (!user) {
      const userSave = new this.usersModel(signupDto);

      return userSave.save();
    } else {
      throw new BadRequestException('Email already exists.');
    }
  }

  public async signin(signinDto: SigninDto): Promise<UserToken> {
    const user = await this.findByEmail(signinDto.email);
    const match = await this.checkPassword(signinDto.password, user);

    if (!match) {
      throw new NotFoundException('Invalid credentials.');
    } else {
      const jwtToken = await this.authService.createAccessToken(user._id);

      return {
        id: user._id,
        name: user.name,
        email: user.email,
        token: jwtToken,
      };
    }
  }

  public async findAll(): Promise<User[]> {
    const users = await this.usersModel.find();

    if (!users) {
      throw new NotFoundException('Users no found!');
    } else {
      return users;
    }
  }

  private async findByEmail(email: string): Promise<User> {
    const user = await this.usersModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('Email not found');
    } else {
      return user;
    }
  }

  private async checkPassword(password: string, user: User): Promise<boolean> {
    console.log(password);
    console.log(user.password);
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      return true;
    } else {
      return false;
    }
  }
}
