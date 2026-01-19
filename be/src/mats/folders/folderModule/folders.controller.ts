import { Controller, Get, Param, ParseIntPipe,UseGuards } from '@nestjs/common';
import { FoldersService } from './folders.service';
import {UserGuard} from "../../../guards";

@UseGuards(UserGuard)
@Controller('mats')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}   
  @Get('folders')
  getFolderTree() {
    return this.foldersService.getAllFolders();
  }

  @Get('folders/:id/files')
  getFiles(@Param('id', ParseIntPipe) id: number) {
    return this.foldersService.getFilesByFolderId(id);
  }
}
