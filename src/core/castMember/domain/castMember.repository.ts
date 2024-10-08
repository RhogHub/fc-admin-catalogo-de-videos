import { ISearchableRepository } from "../../shared/domain/repository/repository-interface";
import { SearchParams } from "../../shared/domain/repository/search-params";
import { SearchResult } from "../../shared/domain/repository/search-result";
import { Uuid } from "../../shared/domain/value-objects/uuid.vo";
import { CastMember } from "./castMember.aggregate";

// export type CastMemberFilter = {
//     name?: string | null;
//     type?: string | null;
// }
export type CastMemberFilter = string;

export class CastMemberSearchParams extends SearchParams<CastMemberFilter>{}

export class CastMemberSearchResult extends SearchResult<CastMember>{}

export interface ICastMemberRepository extends ISearchableRepository<CastMember, Uuid, CastMemberFilter, CastMemberSearchParams, CastMemberSearchResult> {}