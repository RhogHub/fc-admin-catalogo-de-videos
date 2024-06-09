import { CastMember, CastMemberType } from "@core/castMember/domain/castMember.aggregate";
import { CastMemberOutputMapper } from "./castMember-output";

describe('CastMemberOutputMapper Unit Tests', () => {
    it('should convert a castMember in output', () => {
        const actor = CastMemberType.ACTOR;
        const entity = CastMember.create({
            name: 'Cast Member',
            type: actor,
        });
        const spyToJSON = jest.spyOn(entity, 'toJSON');
        const output = CastMemberOutputMapper.toOutput(entity);

        expect(spyToJSON).toHaveBeenCalled();
        expect(output).toStrictEqual({
            id: entity.castMember_id.id,
            name: 'Cast Member',           
            type: entity.type,
            created_at: entity.created_at,
        });
        //console.log(entity.castMember_id.id);
    });
    
});