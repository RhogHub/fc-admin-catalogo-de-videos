import { setupSequelize } from "@core/shared/infra/testing/helpers";
import { CastMemberModel } from "../castMember-model";
import { CastMember, CastMemberId, CastMemberType } from "@core/castMember/domain/castMember.aggregate";
import { EntityValidationError } from "@core/shared/domain/validators/validation.error";
import { CastMemberModelMapper } from "../castMember-model-mapper";

describe('CastMemberModelMapper Integration Tests', () => {
    setupSequelize({ models: [CastMemberModel] });

    it('should throws error when castMember is invalid', () => {
        expect.assertions(2);

        const castMemberModel = CastMemberModel.build({
            castMember_id: "9366b7dc-2d71-4799-b91c-c64adb205104",
            name: 'a'.repeat(256),           
            type: CastMemberType.ACTOR,
            created_at: new Date(),
        });

        try {
            CastMemberModelMapper.toEntity(castMemberModel);
            fail('The castMember is valid, but it needs throws a EntityValidationError');
        } catch (e) {
            expect(e).toBeInstanceOf(EntityValidationError);
            expect((e as EntityValidationError).error).toMatchObject([
                {
                    name: ['name must be shorter than or equal to 255 characters'],
                },
            ]);
        }
    });

    it('should convert a castMember model to a castMember aggregate', () => {
        const created_at = new Date();
        const castMemberModel = CastMemberModel.build({
            castMember_id: "9366b7dc-2d71-4799-b91c-c64adb205104",
            name: 'some value',           
            type: CastMemberType.ACTOR,
            created_at: created_at,
        });
        const aggregate = CastMemberModelMapper.toEntity(castMemberModel);

        expect(aggregate.toJSON()).toStrictEqual(
            new CastMember({
                castMember_id: new CastMemberId("9366b7dc-2d71-4799-b91c-c64adb205104"),
                name: 'some value',           
                type: 2,
                created_at: created_at,
            }).toJSON(),
        );
    });
    
});