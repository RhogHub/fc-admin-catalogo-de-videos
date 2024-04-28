import { Module } from '@nestjs/common';
import { DatabaseModule } from './nest-modules/database-module/database.module';
//import { ConfigModule } from '@nestjs/config';
import { ConfigModule } from './nest-modules/config-module/config.module';
import { CategoriesModule } from './nest-modules/categories-module/categories.module';
import { SharedModule } from './nest-modules/shared-module/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule, 
    CategoriesModule, SharedModule,     
  ],
})
export class AppModule {}
