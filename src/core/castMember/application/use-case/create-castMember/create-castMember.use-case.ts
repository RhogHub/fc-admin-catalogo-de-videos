import { ICastMemberRepository } from "@core/castMember/domain/castMember.repository";
import { IUseCase } from "../../../../shared/application/use-case.interface";
import { EntityValidationError } from "../../../../shared/domain/validators/validation.error";
import { CastMemberOutput, CastMemberOutputMapper } from "../common/castMember-output";
import { CreateCastMemberInput } from "./create-castMember.input";
import { CastMember } from "@core/castMember/domain/castMember.aggregate";

export type CreateCastMemberOutput = CastMemberOutput;

export class CreateCastMemberUseCase implements IUseCase<CreateCastMemberOutput, CreateCastMemberOutput> {
    constructor(private readonly castMemberRepo: ICastMemberRepository) {}
    
    async execute(input: CreateCastMemberInput): Promise<CreateCastMemberOutput> {
        const entity = CastMember.create(input);
        
        if (entity.notification.hasErrors()) {
            throw new EntityValidationError(entity.notification.toJSON());
        }

        await this.castMemberRepo.insert(entity);

       
        return CastMemberOutputMapper.toOutput(entity);
    }
}
