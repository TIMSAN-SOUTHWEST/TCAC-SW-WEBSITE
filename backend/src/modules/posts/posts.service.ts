import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.post.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findPublished(page: number = 1, limit: number = 2) {
    const take = Math.min(limit, 3);
    const skip = (page - 1) * take;

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: { isPublished: true },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        skip,
        take,
      }),
      this.prisma.post.count({ where: { isPublished: true } }),
    ]);

    return { success: true, data: posts, total, page, limit: take };
  }

  async create(data: { name: string; postType: string; isPublished?: boolean; content?: any }) {
    const maxPost = await this.prisma.post.findFirst({
      orderBy: { sortOrder: 'desc' },
    });
    const newSortOrder = maxPost ? maxPost.sortOrder + 1 : 0;

    return this.prisma.post.create({
      data: {
        name: data.name,
        postType: data.postType as any,
        isPublished: data.isPublished || false,
        content: data.content || {},
        sortOrder: newSortOrder,
      },
    });
  }

  async update(id: string, data: any) {
    const { id: _id, ...updateData } = data;
    return this.prisma.post.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string) {
    await this.prisma.post.delete({ where: { id } });
    return { success: true, message: 'Deleted successfully' };
  }

  async reorder(posts: { id: string; sortOrder: number }[]) {
    if (!posts || !Array.isArray(posts)) {
      throw new BadRequestException('Posts array is required');
    }

    const updatePromises = posts.map(({ id, sortOrder }) =>
      this.prisma.post.update({ where: { id }, data: { sortOrder } }),
    );

    await Promise.all(updatePromises);
    return { success: true, message: 'Posts reordered successfully' };
  }
}
