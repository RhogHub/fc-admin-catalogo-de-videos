import { CastMemberId } from "@core/castMember/domain/castMember.aggregate";
import { ICastMemberRepository } from "@core/castMember/domain/castMember.repository";
import { IUseCase } from "@core/shared/application/use-case.interface";

export type DeleteCastMemberInput = {
    id: string;
}

type DeleteCastMemberOutput = void;

export class DeleteCastMemberUseCase implements IUseCase<DeleteCastMemberInput, DeleteCastMemberOutput> {
    constructor(private castMemberRepo: ICastMemberRepository) {}

    async execute(input: DeleteCastMemberInput): Promise<DeleteCastMemberOutput> {
        const castMemberId = new CastMemberId(input.id);
        await this.castMemberRepo.delete(castMemberId);
    }
}