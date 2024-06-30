import { CastMember } from "@core/castMember/domain/castMember.aggregate";
import { EntityValidationError } from "../../../../shared/domain/validators/validation.error";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { CastMemberModel } from "./castMember-model";

export class CastMemberModelMapper {
    static toModel(entity: CastMember): CastMemberModel {
        return CastMemberModel.build({
            castMember_id: entity.castMember_id.id,
            name: entity.name,            
            type: entity.type,
            created_at: entity.created_at,
        });
    }

    static toEntity(model: CastMemberModel): CastMember {
        const castMember = new CastMember({
            castMember_id: new Uuid(model.castMember_id),
            name: model.name,           
            type: model.type,
            created_at: model.created_at,
        });
        
        castMember.validate();
        if (castMember.notification.hasErrors()) {
            throw new EntityValidationError(castMember.notification.toJSON());
        }
        return castMember;
    }

}