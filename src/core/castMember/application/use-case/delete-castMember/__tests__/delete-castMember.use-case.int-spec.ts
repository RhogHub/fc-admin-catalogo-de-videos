import { CastMemberSequelizeRepository } from "@core/castMember/infra/db/sequelize/castMember-sequelize.repository";
import { DeleteCastMemberUseCase } from "../delete-castMember.use-case";
import { setupSequelize } from "@core/shared/infra/testing/helpers";
import { CastMemberModel } from "@core/castMember/infra/db/sequelize/castMember-model";
import { Uuid } from "@core/shared/domain/value-objects/uuid.vo";
import { CastMember, CastMemberId, CastMemberType } from "@core/castMember/domain/castMember.aggregate";
import { NotFoundError } from "@core/shared/domain/errors/not-found.error";

describe("DeleteCastMemberUseCase Integration Tests", () => {
    let useCase: DeleteCastMemberUseCase;
    let repository: CastMemberSequelizeRepository;

    setupSequelize({ models: [CastMemberModel] });

    beforeEach(() => {
        repository = new CastMemberSequelizeRepository(CastMemberModel);
        useCase = new DeleteCastMemberUseCase(repository);
    });

    it("should throws error when entity not found", async () => {
        const uuid = new Uuid();

        await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
            new NotFoundError(uuid.id, CastMember)
        );
    });

    it("should delete a castMember", async () => {
        const castMember = CastMember.create({            
            name: "Tarantino",
            type: CastMemberType.DIRECTOR,
        });
        
        await repository.insert(castMember);
        
        await useCase.execute({
            id: castMember.castMember_id.id,
        });        
      
        await expect(repository.findById(castMember.castMember_id)).resolves.toBeNull();
    });
});