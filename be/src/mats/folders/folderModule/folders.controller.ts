import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { FoldersService } from './folders.service';

@Controller('mats')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}   
  @Get('folders')
  getFolderTree() {
    return this.foldersService.getAllFolders();
  }

  @Get('folders/:id/files')
  getFiles(@Param('id', ParseIntPipe) id: number) {
    console.log('Fetching files for folder ID:', id);
    return this.foldersService.getFilesByFolderId(id);
  }
}
