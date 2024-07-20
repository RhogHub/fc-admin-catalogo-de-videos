import { CastMemberInMemoryRepository } from "@core/castMember/infra/db/in-memory/castMember-in-memory.repository";
import { GetCastMemberUseCase } from "../get-castMember.use-case";
import { InvalidUuidError, Uuid } from "@core/shared/domain/value-objects/uuid.vo";
import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import { CastMember, CastMemberType } from "@core/castMember/domain/castMember.aggregate";

describe("GetCastMemberUseCase Unit Tests", () => {
    let useCase: GetCastMemberUseCase;
    let repository: CastMemberInMemoryRepository;

    beforeEach(() => {
        repository = new CastMemberInMemoryRepository();
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
        repository.items = castMember;
        const spyFindById = jest.spyOn(repository, "findById");

        const output = await useCase.execute({ id: castMember[0].castMember_id.id });

        expect(spyFindById).toHaveBeenCalledTimes(1);
        expect(output).toStrictEqual({
            id: castMember[0].castMember_id.id,
            name: "Tarantino",
            type: CastMemberType.DIRECTOR,
            created_at: castMember[0].created_at,
        });
    });

});