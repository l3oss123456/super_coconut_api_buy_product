import { AdminDTO } from '@/dto/admin/admin.dto';
import { PaginationDTO, SortDTO } from '@/dto/global.dto';
import { AdminService } from '@/service/admin/admin.service';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Get(`/`)
  getAllAdmin(
    @Query() { sort_field, sort_order }: SortDTO,
    @Query() { page, per_page }: PaginationDTO,
  ) {
    return this.service.getAllAdmin({ sort_field, sort_order, page, per_page });
  }

  @Post(`/`)
  //   @ApiBearerAuth()
  // @UseGuards(AuthGuard, PermissionsGuard)
  // @Permissions({
  //     menu_permission_id: 2,
  //     edit: true,
  //   })
  createAdmin(
    @Body() body: AdminDTO,
    // @UploadedFiles()
    // files: {
    //   truck_freight_file?: Express.Multer.File;
    // },
  ) {
    return this.service.createAdmin({ body: body });
  }
}
