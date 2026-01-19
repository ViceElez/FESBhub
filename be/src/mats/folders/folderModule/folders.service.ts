import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class FoldersService {
  constructor(private prisma: PrismaService) { }

  private async buildFolderTree(folderId: number) {
    const folder = await this.prisma.folder.findUnique({
      where: { id: folderId },
      include: {
        subFolders: true,
      },
    });

    if (!folder) return null;

    const children = await Promise.all(
      folder.subFolders.map(sub => this.buildFolderTree(sub.id)),
    );

    return {
      id: folder.id,
      name: folder.name,
      subfolders: children,
    };
  }

  async getAllFolders() {
    const roots = await this.prisma.folder.findFirstOrThrow({
      where: { parentFolderId: null },
    });

    return this.buildFolderTree(roots.id);
  }

  async getFilesByFolderId(folderId: number) {
    return this.prisma.file.findMany({
      where: {
        parentFolderId: folderId,
      },
      select: {
        id: true,
        name: true,
        url: true,
        updatedAt: true,
      },
    });
  }
}