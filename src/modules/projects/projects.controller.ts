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
import { CreateProjectDto } from './projects.dto';

@ApiTags('projects')
@Controller('projects')
@UseGuards(AccessGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('/')
  async getListOfUserProjects(@Req() req) {
    try {
      return this.projectService.getListOfUsersProjects(req.user.id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('/owner')
  async getOwnerProjectsList(@Req() req) {
    try {
      return this.projectService.getOwnerProjectsList(req.user.id);
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

  @Post('/')
  async createProject(@Body() body: CreateProjectDto) {
    try {
      return this.projectService.createProjectAndMembers(body);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
