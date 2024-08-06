import { CastMemberFilter, CastMemberSearchParams, CastMemberSearchResult, ICastMemberRepository } from "@core/castMember/domain/castMember.repository";
import { PaginationOutput, PaginationOutputMapper } from "@core/shared/application/pagination-output";
import { IUseCase } from "@core/shared/application/use-case.interface";
import { SortDirection } from "@core/shared/domain/repository/search-params";
import { CastMemberOutput, CastMemberOutputMapper } from "../common/castMember-output";

export type ListCastMembersInput = {
    page?: number;
    per_page?: number;
    sort?: string | null;
    sort_dir?: SortDirection | null;
    filter?: CastMemberFilter | null;
}

export type ListCastMembersOutput = PaginationOutput<CastMemberOutput>;

export class ListCastMembersUseCase implements IUseCase<ListCastMembersInput, ListCastMembersOutput> {
    constructor(private castMemberRepo: ICastMemberRepository) {}
    
    async execute(input: ListCastMembersInput): Promise<ListCastMembersOutput> {
        const params = new CastMemberSearchParams(input);
        const searchResult = await this.castMemberRepo.search(params);
        return this.toOutput(searchResult);
    }

    private toOutput(searchResult: CastMemberSearchResult): ListCastMembersOutput {
        const { items: _items } = searchResult;
        const items = _items.map((c) => {
            return CastMemberOutputMapper.toOutput(c);
        });
        return PaginationOutputMapper.toOutput(items, searchResult);
    }

}