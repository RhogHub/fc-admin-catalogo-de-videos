import { CastMemberSequelizeRepository } from "@core/castMember/infra/db/sequelize/castMember-sequelize.repository";
import { UpdateCastMemberUseCase } from "../update-castMember.use-case";
import { CastMemberModel } from "@core/castMember/infra/db/sequelize/castMember-model";
import { setupSequelize } from "@core/shared/infra/testing/helpers";
import { Uuid } from "@core/shared/domain/value-objects/uuid.vo";
import { NotFoundError } from "@core/shared/domain/errors/not-found.error";
import { CastMember, CastMemberId, CastMemberType } from "@core/castMember/domain/castMember.aggregate";

describe('UpdateCastMemberUseCase Integration Tests', () => { 
    let useCase: UpdateCastMemberUseCase;
    let repository: CastMemberSequelizeRepository;

    setupSequelize({ models: [CastMemberModel] });

    beforeEach(() => {
        repository = new CastMemberSequelizeRepository(CastMemberModel);
        useCase = new UpdateCastMemberUseCase(repository);
    });
    
    it("should update a cast member", async () => {
        const director = CastMemberType.DIRECTOR;
        const actor = CastMemberType.ACTOR;
        const entity = new CastMember({
            castMember_id: new CastMemberId("aa6ceebb-2fc2-4d80-ae0c-f9c3be5768d3"),
            name: "actor-1",
            type: actor,
        });

        repository.insert(entity);        

        let output = await useCase.execute({
            castMember_id: entity.castMember_id.id,
            name: 'actor-2',
            type: director,
            createdAt: entity.created_at,
        });

        expect(output).toStrictEqual({
            id: entity.castMember_id.id,
            name: 'actor-2',            
            type: director,
            created_at: entity.created_at,
        });
    });

   
});