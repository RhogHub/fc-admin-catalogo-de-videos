import { CastMemberInMemoryRepository } from "@core/castMember/infra/db/in-memory/castMember-in-memory.repository";
import { ListCastMembersUseCase } from "../list-castMembers.use-case";
import { CastMemberSearchResult } from "@core/castMember/domain/castMember.repository";
import { CastMember, CastMemberType } from "@core/castMember/domain/castMember.aggregate";
import { CastMemberOutputMapper } from "../../common/castMember-output";

describe("ListCastMemersUseCase Unit Test", () => {
    let useCase: ListCastMembersUseCase;
    let repository: CastMemberInMemoryRepository;

    beforeEach(() => {
        repository = new CastMemberInMemoryRepository;
        useCase = new ListCastMembersUseCase(repository);
    });

    test('toOutput method', () => {
        let result = new CastMemberSearchResult({
            items: [],
            total: 1,
            current_page: 1,
            per_page: 5,
        });
        let output = useCase['toOutput'](result);

        expect(output).toStrictEqual({
            items: [],
            total: 1,
            current_page: 1,
            per_page: 5,
            last_page: 1,
        });

        const entity = CastMember.create({ name: "Tarantino", type: CastMemberType.DIRECTOR });
        
        result = new CastMemberSearchResult({
            items: [entity],
            total: 1,
            current_page: 1,
            per_page: 5,
        });

        output = useCase['toOutput'](result);

        expect(output).toStrictEqual({
            items: [entity].map(CastMemberOutputMapper.toOutput),
            total: 1,
            current_page: 1,
            per_page: 5,
            last_page: 1,
        });       
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
        repository.items = items;

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

        repository.items = items;

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
    });


});