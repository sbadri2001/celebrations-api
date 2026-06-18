import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { TeamRole } from '@prisma/client';

import { TeamsService } from './teams.service';

import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Teams')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  create(
    @Body()
    dto: CreateTeamDto,
  ) {
    return this.teamsService.create(dto);
  }

  @Get()
  findAll() {
    return this.teamsService.findAll();
  }

  @Get(':id')
  findById(
    @Param('id')
    id: string,
  ) {
    return this.teamsService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id')
    id: string,

    @Body()
    dto: UpdateTeamDto,
  ) {
    return this.teamsService.update(id, dto);
  }

  @Delete(':id')
  delete(
    @Param('id')
    id: string,
  ) {
    return this.teamsService.delete(id);
  }

  @Get(':teamId/members')
  getMembers(
    @Param('teamId')
    teamId: string,
  ) {
    return this.teamsService.getMembers(teamId);
  }

  @Post(':teamId/members')
  addMember(
    @Param('teamId')
    teamId: string,

    @Body()
    dto: AddMemberDto,
  ) {
    return this.teamsService.addMember(teamId, dto.userId);
  }

  @Delete(':teamId/members/:userId')
  removeMember(
    @Param('teamId')
    teamId: string,

    @Param('userId')
    userId: string,
  ) {
    return this.teamsService.removeMember(teamId, userId);
  }

  @Patch(':teamId/members/:userId/role')
  updateRole(
    @Param('teamId')
    teamId: string,

    @Param('userId')
    userId: string,

    @Body()
    dto: UpdateMemberRoleDto,
  ) {
    return this.teamsService.updateMemberRole(
      teamId,
      userId,
      dto.role as TeamRole,
    );
  }
}
