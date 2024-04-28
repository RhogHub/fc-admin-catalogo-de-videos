import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import { CategoryInMemoryRepository } from '@core/category/infra/db/in-memory/category-in-memory.repository';
import { CategoriesController } from '../categories.controller';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from '../categories.module';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        //DatabaseModule,
        CategoriesModule,
      ],           
    }).overrideProvider(getModelToken(CategoryModel))
      .useValue({})
      .overrideProvider('CategoryRepository')
      .useValue(CategoryInMemoryRepository)
      .compile();

    controller = module.get<CategoriesController>(CategoriesController);
    //console.log(module.get(ConfigService));
  });

  it('should be defined', () => {
    console.log(controller);

    expect(controller).toBeDefined();
  });

});
