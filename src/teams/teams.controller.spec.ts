import { Test } from '@nestjs/testing';

import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';

describe('TeamsController', () => {
  let controller: TeamsController;

  const mockTeamsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getMembers: jest.fn(),
    addMember: jest.fn(),
    removeMember: jest.fn(),
    updateMemberRole: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TeamsController],

      providers: [
        {
          provide: TeamsService,
          useValue: mockTeamsService,
        },
      ],
    }).compile();

    controller = moduleRef.get<TeamsController>(TeamsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create team', async () => {
      mockTeamsService.create.mockResolvedValue({
        id: '1',
        name: 'Blue Team',
      });

      const result = await controller.create({
        name: 'Blue Team',
        block: 'A Block',
        editionId: 'edition-id',
      } as any);

      expect(mockTeamsService.create).toHaveBeenCalled();

      expect(result.id).toEqual('1');
    });
  });

  describe('findAll', () => {
    it('should return teams', async () => {
      mockTeamsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(mockTeamsService.findAll).toHaveBeenCalled();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return team', async () => {
      mockTeamsService.findById.mockResolvedValue({
        id: 'team-id',
      });

      const result = await controller.findById('team-id');

      expect(mockTeamsService.findById).toHaveBeenCalledWith('team-id');

      expect(result.id).toEqual('team-id');
    });
  });
});
