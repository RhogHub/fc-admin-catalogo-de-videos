import { setupSequelize } from "@core/shared/infra/testing/helpers";
import { CreateCastMemberUseCase } from "../create-castMember.use-case";
import { Uuid } from "@core/shared/domain/value-objects/uuid.vo";
import { CastMemberType } from "@core/castMember/domain/castMember.aggregate";
import { CastMemberSequelizeRepository } from "@core/castMember/infra/db/sequelize/castMember-sequelize.repository";
import { CastMemberModel } from "@core/castMember/infra/db/sequelize/castMember-model";

describe("CreateCastMemberUseCase Integration Tests", () => {
    let useCase: CreateCastMemberUseCase;
    let repository: CastMemberSequelizeRepository;

    setupSequelize({ models: [CastMemberModel] });

    beforeEach(() => {
        repository = new CastMemberSequelizeRepository(CastMemberModel);
        useCase = new CreateCastMemberUseCase(repository);
    });

    it("should create a category", async () => {
        const director = CastMemberType.DIRECTOR;
        const actor = CastMemberType.ACTOR;
        let output = await useCase.execute({ name: "test", type: actor, });
        let entity = await repository.findById(new Uuid(output.id));

        expect(output).toStrictEqual({
            id: entity.castMember_id.id,
            name: "test",
            type: actor,
            created_at: entity.created_at,
        });

        output = await useCase.execute({
            name: "test",
            type: director,
        });

        entity = await repository.findById(new Uuid(output.id));

        expect(output).toStrictEqual({
            id: entity.castMember_id.id,
            name: "test",
            type: director,
            created_at: entity.created_at,
        });       
    });

});