import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateEditionDto } from './dto/create-edition.dto';
import { UpdateEditionDto } from './dto/update-edition.dto';

@Injectable()
export class EditionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEditionDto) {
    const existing = await this.prisma.edition.findFirst({
      where: {
        name: dto.name,
        year: dto.year,
      },
    });

    if (existing) {
      throw new ConflictException('Edition already exists');
    }

    return this.prisma.$transaction(async (tx) => {
      if (dto.isActive) {
        await tx.edition.updateMany({
          data: {
            isActive: false,
          },
        });
      }

      return tx.edition.create({
        data: {
          name: dto.name,
          year: dto.year,
          description: dto.description,

          startDate: dto.startDate ? new Date(dto.startDate) : null,

          endDate: dto.endDate ? new Date(dto.endDate) : null,

          isActive: dto.isActive ?? false,
        },
      });
    });
  }

  async findAll() {
    return this.prisma.edition.findMany({
      orderBy: {
        year: 'desc',
      },
    });
  }

  async current() {
    return this.prisma.edition.findFirst({
      where: {
        isActive: true,
      },
    });
  }

  async findById(id: string) {
    const edition = await this.prisma.edition.findUnique({
      where: { id },

      include: {
        teams: true,
        events: true,
      },
    });

    if (!edition) {
      throw new NotFoundException('Edition not found');
    }

    return edition;
  }

  async update(id: string, dto: UpdateEditionDto) {
    await this.findById(id);

    return this.prisma.$transaction(async (tx) => {
      if (dto.isActive === true) {
        await tx.edition.updateMany({
          data: {
            isActive: false,
          },
        });
      }

      return tx.edition.update({
        where: { id },

        data: {
          name: dto.name,
          year: dto.year,
          description: dto.description,

          startDate: dto.startDate ? new Date(dto.startDate) : undefined,

          endDate: dto.endDate ? new Date(dto.endDate) : undefined,

          isActive: dto.isActive,
        },
      });
    });
  }

  async activate(id: string) {
    const edition = await this.prisma.edition.findUnique({
      where: { id },
    });

    if (!edition) {
      throw new NotFoundException('Edition not found');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.edition.updateMany({
        data: {
          isActive: false,
        },
      });

      return tx.edition.update({
        where: { id },

        data: {
          isActive: true,
        },
      });
    });
  }

  async deactivate(id: string) {
    await this.findById(id);

    return this.prisma.edition.update({
      where: { id },

      data: {
        isActive: false,
      },
    });
  }

  async delete(id: string) {
    const edition = await this.prisma.edition.findUnique({
      where: { id },

      include: {
        teams: true,
        events: true,
      },
    });

    if (!edition) {
      throw new NotFoundException('Edition not found');
    }

    if (edition.teams.length > 0 || edition.events.length > 0) {
      throw new BadRequestException('Edition contains dependent data');
    }

    await this.prisma.edition.delete({
      where: { id },
    });

    return {
      message: 'Edition deleted successfully',
    };
  }
}
