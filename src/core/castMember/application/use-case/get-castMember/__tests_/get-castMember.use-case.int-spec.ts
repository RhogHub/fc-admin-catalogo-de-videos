import { CastMemberSequelizeRepository } from "@core/castMember/infra/db/sequelize/castMember-sequelize.repository";
import { GetCastMemberUseCase } from "../get-castMember.use-case";
import { CastMemberModel } from "@core/castMember/infra/db/sequelize/castMember-model";
import { setupSequelize } from "@core/shared/infra/testing/helpers";
import { InvalidUuidError, Uuid } from "@core/shared/domain/value-objects/uuid.vo";
import { NotFoundError } from "@core/shared/domain/errors/not-found.error";
import { CastMember, CastMemberType } from "@core/castMember/domain/castMember.aggregate";

describe('GetCastMemberUseCase Integration Tests', () => {
    let useCase: GetCastMemberUseCase;
    let repository: CastMemberSequelizeRepository;

    setupSequelize({ models: [CastMemberModel] });

    beforeEach(() => {
        repository = new CastMemberSequelizeRepository(CastMemberModel);
        useCase = new GetCastMemberUseCase(repository);
    });

    it("should throws error when entity not found", async () => {
        await expect(() => useCase.execute({id: "id-1"})).rejects.toThrow(
            new InvalidUuidError()
        );

        const uuid = new Uuid();

        await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
            new NotFoundError(uuid.id, CastMember)
        );
    });

    it("should returns a cast member", async () => {
        const castMember = [CastMember.create({ name: "Tarantino", type: CastMemberType.DIRECTOR })];
        repository.bulkInsert(castMember);      

        const output = await useCase.execute({ id: castMember[0].castMember_id.id });
       
        expect(output).toStrictEqual({
            id: castMember[0].castMember_id.id,
            name: "Tarantino",
            type: CastMemberType.DIRECTOR,
            created_at: castMember[0].created_at,
        });
    });

});