import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
            validateUserById: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate a user', async () => {
    const user = new User();
    user.id = 1;
    user.email = 'test@example.com';
    user.password = await bcrypt.hash('password123', 10);

    jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);

    const result = await service.validateUser(
      'test@example.com',
      'password123',
    );

    expect(result).toEqual(user);
  });

  it('should return null if user validation fails', async () => {
    jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);

    const result = await service.validateUser(
      'test@example.com',
      'password123',
    );

    expect(result).toBeNull();
  });

  it('should create a user', async () => {
    const createUserDto: CreateUserDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    const user = new User();
    user.id = 1;
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.password = await bcrypt.hash(createUserDto.password, 10);

    jest.spyOn(userService, 'create').mockResolvedValue(user);

    const result = await service.register(createUserDto);

    expect(result).toEqual(user);
  });

  it('should generate a JWT token', async () => {
    const user = new User();
    user.id = 1;
    user.email = 'test@example.com';

    const token = 'jwt-token';
    jest.spyOn(jwtService, 'sign').mockReturnValue(token);

    const result = await service.login(user);

    expect(result).toEqual({ access_token: token });
  });
});
