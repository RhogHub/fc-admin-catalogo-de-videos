import { CastMemberInMemoryRepository } from "@core/castMember/infra/db/in-memory/castMember-in-memory.repository";
import { DeleteCastMemberUseCase } from "../delete-castMember.use-case";
import { CastMember, CastMemberType } from "@core/castMember/domain/castMember.aggregate";

describe("DeleteCastMemberUseCase Unit Tests", () => {
    let useCase: DeleteCastMemberUseCase;
    let repository: CastMemberInMemoryRepository;

    beforeEach(() => {
        repository = new CastMemberInMemoryRepository();
        useCase = new DeleteCastMemberUseCase(repository);
    });
   
    it("should delete a cast member", async () => {
        const items = [new CastMember({ name: "Al Pacino", type: CastMemberType.ACTOR })];
        repository.items = items;

        await useCase.execute({
            id: items[0].castMember_id.id,
        });

        expect(repository.items).toHaveLength(0);
    });

});