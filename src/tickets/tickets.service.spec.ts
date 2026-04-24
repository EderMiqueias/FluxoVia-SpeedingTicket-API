import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ticket } from './ticket.entity';

const mockTicket: Partial<Ticket> = {
  id: 'uuid-ticket-1',
  placa: 'ABC-1234',
  velocidade_registrada: 120,
  limite_permitido: 80,
  id_aparelho_medidor: 'RADAR-001',
};

const mockRepository = {
  create: jest.fn().mockReturnValue(mockTicket),
  save: jest.fn().mockResolvedValue(mockTicket),
};

describe('TicketsService', () => {
  let service: TicketsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        { provide: getRepositoryToken(Ticket), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates and saves a ticket', async () => {
    mockRepository.create.mockReturnValue(mockTicket);
    mockRepository.save.mockResolvedValue(mockTicket);

    const result = await service.create(
      {
        placa: 'ABC-1234',
        velocidade_registrada: 120,
        limite_permitido: 80,
        id_aparelho_medidor: 'RADAR-001',
      },
      'user-uuid',
    );

    expect(mockRepository.create).toHaveBeenCalled();
    expect(mockRepository.save).toHaveBeenCalled();
    expect(result).toEqual(mockTicket);
  });
});
