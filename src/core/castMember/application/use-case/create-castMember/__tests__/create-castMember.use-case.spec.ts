import { CastMemberInMemoryRepository } from "@core/castMember/infra/db/in-memory/castMember-in-memory.repository";
import { CreateCastMemberUseCase } from "../create-castMember.use-case";
import { CastMemberType } from "@core/castMember/domain/castMember.aggregate";

describe('CreateCastMemberUseCase Unit Tests', () => {
    let useCase: CreateCastMemberUseCase;
    let repository: CastMemberInMemoryRepository;

    beforeEach(() => {
        repository = new CastMemberInMemoryRepository();
        useCase = new CreateCastMemberUseCase(repository);
    });

    it('should throw an error when aggregate is not valid', async () => {
        const director = CastMemberType.DIRECTOR;
        const input = { name: 'Cast member'.repeat(256), type: director };
        await expect(() => useCase.execute(input)).rejects.toThrow(
            'Entity Validation Error',
        );
    });

    it('should create a cast member', async () => {
        const director = CastMemberType.DIRECTOR;
        const actor = CastMemberType.ACTOR;
        const spyInsert = jest.spyOn(repository, 'insert');
        let output = await useCase.execute({ name: 'Cast Member', type: director});

        expect(spyInsert).toHaveBeenCalledTimes(1);
        expect(output).toStrictEqual({
            id: repository.items[0].castMember_id.id,
            name: 'Cast Member',
            type: director,
            created_at: repository.items[0].created_at,
        });

        output = await useCase.execute({
            name: 'test',
            type: actor,            
        });

        expect(spyInsert).toHaveBeenCalledTimes(2);
        expect(output).toStrictEqual({
            id: repository.items[1].castMember_id.id,
            name: 'test',
            type: actor,
            created_at: repository.items[1].created_at,
        });
    });
    
});