import { CastMember, CastMemberId } from "@core/castMember/domain/castMember.aggregate";
import { ICastMemberRepository } from "@core/castMember/domain/castMember.repository";
import { IUseCase } from "@core/shared/application/use-case.interface";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { CastMemberOutput, CastMemberOutputMapper } from "../common/castMember-output";

export type GetCastMemberInput = {
    id: string;
}

export type GetCastMemberOutput = CastMemberOutput;

export class GetCastMemberUseCase implements IUseCase<GetCastMemberInput, GetCastMemberOutput> {
    constructor(private castMemberRepo: ICastMemberRepository) {}
    async execute(input: GetCastMemberInput): Promise<GetCastMemberOutput> {
        const castMemberId = new CastMemberId(input.id);
        const castMember = await this.castMemberRepo.findById(castMemberId);

        if(!castMember) {
            throw new NotFoundError(input.id, CastMember);
        }

        return CastMemberOutputMapper.toOutput(castMember);
    }
    
}
