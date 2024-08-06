import { CastMemberInMemoryRepository } from "@core/castMember/infra/db/in-memory/castMember-in-memory.repository";
import { UpdateCastMemberUseCase } from "../update-castMember.use-case";
import { CastMember, CastMemberType } from "@core/castMember/domain/castMember.aggregate";

describe("UpdateCastMemberUseCase Unit Tests", () => {
    let useCase: UpdateCastMemberUseCase;
    let repository: CastMemberInMemoryRepository;
    const director = CastMemberType.DIRECTOR;
    const actor = CastMemberType.ACTOR;
    
    beforeEach(() => {
        repository = new CastMemberInMemoryRepository();
        useCase = new UpdateCastMemberUseCase(repository);
    });
    it("should update a castMember", async () => {
        const spyUpdate = jest.spyOn(repository, "update");
        const entity = new CastMember({ name: "actor-1", type: actor });
        repository.items = [entity];

        let output = await useCase.execute({  
            castMember_id: entity.castMember_id.id,          
            name: "actor-2",
            type: director,
            createdAt: entity.created_at,
        });

        expect(spyUpdate).toHaveBeenCalledTimes(1);
        expect(output).toStrictEqual({
            id: entity.castMember_id.id,
            name: "actor-2",
            type: director,
            created_at: output.created_at,
        });
    });

});