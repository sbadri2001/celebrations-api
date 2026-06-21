import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { EditionsService } from './editions.service';

import { CreateEditionDto } from './dto/create-edition.dto';
import { UpdateEditionDto } from './dto/update-edition.dto';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Editions')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('editions')
export class EditionsController {
  constructor(private readonly editionsService: EditionsService) {}

  @Post()
  create(
    @Body()
    dto: CreateEditionDto,
  ) {
    return this.editionsService.create(dto);
  }

  @Get()
  findAll() {
    return this.editionsService.findAll();
  }

  @Get('current')
  current() {
    return this.editionsService.current();
  }

  @Get(':id')
  findById(
    @Param('id')
    id: string,
  ) {
    return this.editionsService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id')
    id: string,

    @Body()
    dto: UpdateEditionDto,
  ) {
    return this.editionsService.update(id, dto);
  }

  @Put(':id/activate')
  activate(@Param('id') id: string) {
    return this.editionsService.activate(id);
  }

  @Put(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.editionsService.deactivate(id);
  }

  @Delete(':id')
  delete(
    @Param('id')
    id: string,
  ) {
    return this.editionsService.delete(id);
  }

  @Get(':id/teams')
  getTeamsByEdition(@Param('id') id: string) {
    return this.editionsService.getTeamsByEdition(id);
  }
}
