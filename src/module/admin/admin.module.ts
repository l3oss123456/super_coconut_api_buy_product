import { Module } from '@nestjs/common';
import { AdminController } from '@/controller/admin/admin.controller';
import { AdminService } from '@/service/admin/admin.service';

@Module({
  controllers: [AdminController],
  providers: [
    AdminService,
    // SchedulerService,
  ],
})
export class AdminModule {}
