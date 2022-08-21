import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

import { AccessGuard } from '../../common/guards';

import { ProjectService } from './projects.service';

@ApiTags('projects')
@Controller('projects')
@UseGuards(AccessGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('/')
  async getListOfUserProjects(@Req() req) {
    try {
      console.log(req.user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('/:id')
  async getCurrentProject(@Param('id') id: string) {
    try {
      console.log(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
