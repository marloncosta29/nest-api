import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  create(userId: number, bookmardDto: CreateBookmarkDto) {
    return this.prisma.bookmark.create({
      data: {
        title: bookmardDto.title,
        link: bookmardDto.link,
        description: bookmardDto.description,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  getAll(userId: number) {
    return this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });
  }

  getBookmarkById(userId: number, bookmarkId: number) {
    return this.prisma.bookmark.findFirst({
      where: {
        userId,
        id: bookmarkId,
      },
    });
  }

  async editBookmarkById(
    userId: number,
    bookmarkId: number,
    bookmarkDto: EditBookmarkDto,
  ) {
    const bookmarkFound = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmarkFound || bookmarkFound.userId !== userId) {
      throw new ForbiddenException('Access to resouces denied');
    }

    return this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        title: bookmarkDto.title,
        description: bookmarkDto.description,
        link: bookmarkDto.link,
      },
    });
  }

  async deleteBookmarkById(userId: number, bookmarkId: number) {
    const bookmarkFound = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmarkFound || bookmarkFound.userId !== userId) {
      throw new ForbiddenException('Access to resouces denied');
    }

    await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
    return;
  }
}
