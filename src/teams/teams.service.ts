import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { TeamRole } from '@prisma/client';

import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTeamDto) {
    const existingTeam = await this.prisma.team.findFirst({
      where: {
        editionId: dto.editionId,
        name: dto.name,
      },
    });

    if (existingTeam) {
      throw new ConflictException('Team already exists in this edition');
    }

    return this.prisma.team.create({
      data: {
        name: dto.name,
        block: dto.block,
        email: dto.email,

        logoUrl: dto.logoUrl,

        captainName: dto.captainName,
        captainUrl: dto.captainUrl,

        viceCaptainName: dto.viceCaptainName,
        viceCaptainUrl: dto.viceCaptainUrl,

        editionId: dto.editionId,
      },
    });
  }

  async findAll() {
    return this.prisma.team.findMany({
      include: {
        edition: true,

        members: {
          include: {
            user: true,
          },
        },
      },

      orderBy: {
        name: 'asc',
      },
    });
  }

  async findById(id: string) {
    const team = await this.prisma.team.findUnique({
      where: { id },

      include: {
        edition: true,

        members: {
          include: {
            user: true,
          },
        },

        media: true,

        results: {
          include: {
            event: true,
          },
        },
      },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    return team;
  }

  async update(id: string, dto: UpdateTeamDto) {
    await this.findById(id);

    return this.prisma.team.update({
      where: { id },

      data: {
        name: dto.name,
        block: dto.block,

        email: dto.email,

        logoUrl: dto.logoUrl,

        captainName: dto.captainName,
        captainUrl: dto.captainUrl,

        viceCaptainName: dto.viceCaptainName,

        viceCaptainUrl: dto.viceCaptainUrl,
      },
    });
  }

  async delete(id: string) {
    await this.findById(id);

    await this.prisma.team.delete({
      where: { id },
    });

    return {
      message: 'Team deleted successfully',
    };
  }

  async getMembers(teamId: string) {
    await this.findById(teamId);

    return this.prisma.teamMember.findMany({
      where: {
        teamId,
      },

      include: {
        user: true,
      },

      orderBy: {
        joinedAt: 'asc',
      },
    });
  }

  async addMember(teamId: string, userId: string) {
    await this.findById(teamId);

    const existing = await this.prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('User already belongs to team');
    }

    return this.prisma.teamMember.create({
      data: {
        userId,
        teamId,
      },

      include: {
        user: true,
      },
    });
  }

  async removeMember(teamId: string, userId: string) {
    const member = await this.prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId,
        },
      },
    });

    if (!member) {
      throw new NotFoundException('Team member not found');
    }

    await this.prisma.teamMember.delete({
      where: {
        userId_teamId: {
          userId,
          teamId,
        },
      },
    });

    return {
      message: 'Member removed successfully',
    };
  }

  async updateMemberRole(teamId: string, userId: string, role: TeamRole) {
    const member = await this.prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId,
        },
      },
    });

    if (!member) {
      throw new NotFoundException('Team member not found');
    }

    return this.prisma.teamMember.update({
      where: {
        userId_teamId: {
          userId,
          teamId,
        },
      },

      data: {
        teamRole: role,
      },

      include: {
        user: true,
      },
    });
  }
}
