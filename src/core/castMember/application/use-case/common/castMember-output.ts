import { CastMember } from "@core/castMember/domain/castMember.aggregate";

export type CastMemberOutput = {
    id: string;
    name: string;
    type: number;
    created_at: Date;
}

export class CastMemberOutputMapper {
    static toOutput(entity: CastMember): CastMemberOutput {
        const { castMember_id, ...otherProps } = entity.toJSON();
        return {
            id: entity.castMember_id.id,
            ...otherProps,
        };
    }
}