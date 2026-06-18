import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { Test } from '@nestjs/testing';

import { EditionsService } from './editions.service';
import { PrismaService } from '../prisma/prisma.service';

describe('EditionsService', () => {
  let service: EditionsService;

  const mockPrismaService = {
    edition: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        EditionsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = moduleRef.get<EditionsService>(EditionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new edition', async () => {
      mockPrismaService.edition.findFirst.mockResolvedValue(null);

      mockPrismaService.edition.create.mockResolvedValue({
        id: 'edition-id',
        name: 'Annual Celebrations',
        year: 2026,
      });

      const result = await service.create({
        name: 'Annual Celebrations',
        year: 2026,
        description: 'Company event',
        startDate: '2026-08-01',
        endDate: '2026-08-07',
      });

      expect(mockPrismaService.edition.create).toHaveBeenCalled();

      expect(result.id).toEqual('edition-id');
    });

    it('should throw conflict exception when edition already exists', async () => {
      mockPrismaService.edition.findFirst.mockResolvedValue({
        id: 'existing-edition',
      });

      await expect(
        service.create({
          name: 'Annual Celebrations',
          year: 2026,
          startDate: '2026-08-01',
          endDate: '2026-08-07',
        } as any),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return editions', async () => {
      mockPrismaService.edition.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(mockPrismaService.edition.findMany).toHaveBeenCalled();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return edition', async () => {
      mockPrismaService.edition.findUnique.mockResolvedValue({
        id: 'edition-id',
      });

      const result = await service.findById('edition-id');

      expect(mockPrismaService.edition.findUnique).toHaveBeenCalled();

      expect(result.id).toEqual('edition-id');
    });

    it('should throw not found exception', async () => {
      mockPrismaService.edition.findUnique.mockResolvedValue(null);

      await expect(service.findById('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update edition', async () => {
      mockPrismaService.edition.findUnique.mockResolvedValue({
        id: 'edition-id',
      });

      mockPrismaService.edition.update.mockResolvedValue({
        id: 'edition-id',
        description: 'Updated Description',
      });

      const result = await service.update('edition-id', {
        description: 'Updated Description',
      });

      expect(mockPrismaService.edition.update).toHaveBeenCalled();

      expect(result.description).toEqual('Updated Description');
    });
  });

  describe('publish', () => {
    it('should publish selected edition', async () => {
      mockPrismaService.edition.findUnique.mockResolvedValue({
        id: 'edition-id',
      });

      mockPrismaService.edition.update.mockResolvedValue({
        id: 'edition-id',
        isActive: true,
      });

      const result = await service.publish('edition-id');

      expect(mockPrismaService.edition.updateMany).toHaveBeenCalled();

      expect(mockPrismaService.edition.update).toHaveBeenCalled();

      expect(result.isActive).toBe(true);
    });
  });

  describe('delete', () => {
    it('should delete edition without dependencies', async () => {
      mockPrismaService.edition.findUnique.mockResolvedValue({
        id: 'edition-id',
        teams: [],
        events: [],
        categories: [],
      });

      mockPrismaService.edition.delete.mockResolvedValue({
        id: 'edition-id',
      });

      const result = await service.delete('edition-id');

      expect(mockPrismaService.edition.delete).toHaveBeenCalled();

      expect(result.message).toEqual('Edition deleted successfully');
    });

    it('should throw bad request exception when edition contains dependencies', async () => {
      mockPrismaService.edition.findUnique.mockResolvedValue({
        id: 'edition-id',
        teams: [{ id: 'team-id' }],
        events: [],
        categories: [],
      });

      await expect(service.delete('edition-id')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('current', () => {
    it('should return current published edition', async () => {
      mockPrismaService.edition.findFirst.mockResolvedValue({
        id: 'edition-id',
        isActive: true,
      });

      const result = await service.current();

      expect(mockPrismaService.edition.findFirst).toHaveBeenCalled();

      expect(result.isActive).toBe(true);
    });
  });
});
