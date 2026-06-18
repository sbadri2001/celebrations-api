import { Test } from '@nestjs/testing';

import { EditionsController } from './editions.controller';
import { EditionsService } from './editions.service';

describe('EditionsController', () => {
  let controller: EditionsController;

  const mockEditionsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    current: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    publish: jest.fn(),
    unpublish: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [EditionsController],

      providers: [
        {
          provide: EditionsService,
          useValue: mockEditionsService,
        },
      ],
    }).compile();

    controller = moduleRef.get<EditionsController>(EditionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return editions', async () => {
      mockEditionsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(mockEditionsService.findAll).toHaveBeenCalled();

      expect(result).toEqual([]);
    });
  });

  describe('current', () => {
    it('should return current edition', async () => {
      mockEditionsService.current.mockResolvedValue({
        id: 'edition-id',
      });

      const result = await controller.current();

      expect(mockEditionsService.current).toHaveBeenCalled();

      expect(result.id).toEqual('edition-id');
    });
  });

  describe('findById', () => {
    it('should return edition', async () => {
      mockEditionsService.findById.mockResolvedValue({
        id: 'edition-id',
      });

      const result = await controller.findById('edition-id');

      expect(mockEditionsService.findById).toHaveBeenCalledWith('edition-id');

      expect(result.id).toEqual('edition-id');
    });
  });

  describe('publish', () => {
    it('should publish edition', async () => {
      mockEditionsService.publish.mockResolvedValue({
        isActive: true,
      });

      const result = await controller.activate('edition-id');

      expect(mockEditionsService.publish).toHaveBeenCalledWith('edition-id');

      expect(result.isActive).toBe(true);
    });
  });
});
