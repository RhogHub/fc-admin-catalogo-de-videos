import { Entity } from '@core/shared/domain/entity';
import { Controller, Get, INestApplication } from '@nestjs/common';
import { NotFoundFilter } from './not-found.filter';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

class StubEntity extends Entity {
    entity_id: any;
    toJSON(): Required<any> {
        return {};
    }
}

@Controller('stub')
class StubController {
    @Get()
    index() {
        throw new NotFoundError('fake id', StubEntity);
    }
}

describe('NotFoundErrorFilter Unit Tests', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [StubController],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.useGlobalFilters(new NotFoundFilter());
        await app.init();
    });

    it('should catch a EntityValidationError', () => {
        return request(app.getHttpServer()).get('/stub').expect(404).expect({
            statusCode: 404,
            error: 'Not Found',
            message: 'StubEntity Not Found using ID fake id',
        });
    });
    
});
