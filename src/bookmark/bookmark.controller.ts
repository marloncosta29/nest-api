import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}
  @Post()
  create(@GetUser('id') id: number, @Body() bookmarkDto: CreateBookmarkDto) {
    return this.bookmarkService.create(id, bookmarkDto);
  }
  @Get()
  getAll(@GetUser('id') id: number) {
    return this.bookmarkService.getAll(id);
  }
  @Get(':id')
  getBookmarkById(
    @GetUser('id') id: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.getBookmarkById(id, bookmarkId);
  }
  @Patch(':id')
  editBookmarkById(
    @GetUser('id') id: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() bookmarkDto: EditBookmarkDto,
  ) {
    return this.bookmarkService.editBookmarkById(id, bookmarkId, bookmarkDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteBookmarkById(
    @GetUser('id') id: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.deleteBookmarkById(id, bookmarkId);
  }
}
