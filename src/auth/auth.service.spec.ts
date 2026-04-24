import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

const mockUser = {
  id: 'uuid-1',
  email: 'test@example.com',
  password: 'hashed_password',
};

const mockUsersService = {
  findByEmail: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock.jwt.token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('authenticate — new user (register)', () => {
    it('creates user and returns access_token', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await service.authenticate({
        email: 'new@example.com',
        password: 'secret123',
      });

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith('new@example.com');
      expect(mockUsersService.create).toHaveBeenCalled();
      expect(result).toEqual({ access_token: 'mock.jwt.token' });
    });
  });

  describe('authenticate — existing user (login)', () => {
    it('returns access_token when password matches', async () => {
      const hashedPassword = await bcrypt.hash('correct_password', 10);
      mockUsersService.findByEmail.mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      });

      const result = await service.authenticate({
        email: mockUser.email,
        password: 'correct_password',
      });

      expect(result).toEqual({ access_token: 'mock.jwt.token' });
    });

    it('throws UnauthorizedException when password is wrong', async () => {
      const hashedPassword = await bcrypt.hash('correct_password', 10);
      mockUsersService.findByEmail.mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      });

      await expect(
        service.authenticate({ email: mockUser.email, password: 'wrong_password' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
