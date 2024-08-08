import { CastMemberFilter, ICastMemberRepository } from "@core/castMember/domain/castMember.repository";
import { SortDirection } from "../../../../shared/domain/repository/search-params";
import { InMemorySearchableRepository } from "../../../../shared/infra/db/in-memory/in-memory.repository";
import { CastMember, CastMemberId, CastMemberType } from "@core/castMember/domain/castMember.aggregate";

export class CastMemberInMemoryRepository 
    extends InMemorySearchableRepository<CastMember, CastMemberId, CastMemberFilter>
    implements ICastMemberRepository 
{
    sortableFields: string[] = ['name', 'created_at'];
    
    protected async applyFilter(items: CastMember[], filter: CastMemberFilter | null): Promise<CastMember[]> {
        if (!filter) {
            return items;
        }       
      
        const filterLowerCase = filter.toLowerCase();

        return items.filter((item) => {
            const typeMatch = CastMemberType[item.type]?.toString().toLowerCase() === filterLowerCase;
            const nameMatch = item.name.toLowerCase().includes(filterLowerCase);
            return typeMatch || nameMatch;
        });   
    }
    
    getEntity(): new (...args: any[]) => CastMember {
        return CastMember;
    }

    //Override Sort
    protected applySort(
        items: CastMember[],
        sort: string | null,
        sort_dir: SortDirection | null,
    ) {
        return sort
            ? super.applySort(items, sort, sort_dir)
            : super.applySort(items, 'created_at', 'desc');
    }
}