import { CastMemberSequelizeRepository } from "@core/castMember/infra/db/sequelize/castMember-sequelize.repository";
import { ListCastMembersUseCase } from "../list-castMembers.use-case";
import { CastMemberModel } from "@core/castMember/infra/db/sequelize/castMember-model";
import { setupSequelize } from "@core/shared/infra/testing/helpers";
import { CastMember, CastMemberType } from "@core/castMember/domain/castMember.aggregate";
import { CastMemberOutputMapper } from "../../common/castMember-output";

describe('ListCastMembersUseCase Integration Tests', () => {
    let useCase: ListCastMembersUseCase;
    let repository: CastMemberSequelizeRepository;

    setupSequelize({ models: [CastMemberModel] });

    beforeEach(() => {
        repository = new CastMemberSequelizeRepository(CastMemberModel);
        useCase = new ListCastMembersUseCase(repository);
    });

    it('should return output sorted by created_at when input param is empty', async () => {
        const items = [
            new CastMember({ name: "Tarantino", type: CastMemberType.DIRECTOR }),
            new CastMember({ 
                name: "Mia Goth", 
                type: CastMemberType.ACTOR,
                created_at: new Date(new Date().getTime() + 200),
            }),
        ];
        repository.bulkInsert(items);

        const output = await useCase.execute({});

        expect(output).toStrictEqual({
            items: [...items].reverse().map(CastMemberOutputMapper.toOutput),
            total: 2,
            current_page: 1,
            per_page: 15,
            last_page: 1,
        });
    });

    it('should return output using pagination, sort and filter', async () => {
        const items = [
            new CastMember({ name: "a", type: CastMemberType.ACTOR }),
            new CastMember({ name: "AAA", type: CastMemberType.ACTOR }),
            new CastMember({ name: "AaA", type: CastMemberType.DIRECTOR }),
            new CastMember({ name: "b", type: CastMemberType.DIRECTOR }),  
            new CastMember({ name: "c", type: CastMemberType.DIRECTOR }),          
        ];

        repository.bulkInsert(items);

        let output = await useCase.execute({
            page: 1,
            per_page: 2,
            sort: 'name',
            filter: 'a',
        });

        expect(output).toStrictEqual({
            items: [items[1], items[2]].map(CastMemberOutputMapper.toOutput),
            total: 3,
            current_page: 1,
            per_page: 2,
            last_page: 2,
        });

        output = await useCase.execute({
            page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
            filter: 'a',
        });
        
        expect(output).toStrictEqual({
            items: [items[1]].map(CastMemberOutputMapper.toOutput),
            total: 3,
            current_page: 2,
            per_page: 2,
            last_page: 2,
        });

        output = await useCase.execute({
            page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
            filter: 'a',
        });
        expect(output).toStrictEqual({
            items: [items[0], items[2]].map(CastMemberOutputMapper.toOutput),
            total: 3,
            current_page: 1,
            per_page: 2,
            last_page: 2,            
        });

        output = await useCase.execute({
            page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
            filter: 'actor',
        });
        expect(output).toStrictEqual({
            items: [items[0], items[1]].map(CastMemberOutputMapper.toOutput),
            total: 2,
            current_page: 1,
            per_page: 2,
            last_page: 1,            
        });
    });

});