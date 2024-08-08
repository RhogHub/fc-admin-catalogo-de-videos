import { CastMember, CastMemberType } from "@core/castMember/domain/castMember.aggregate";
import { CastMemberInMemoryRepository } from "./castMember-in-memory.repository";

describe("CastMemberInMemoryRepository", () => {
    let repository: CastMemberInMemoryRepository;

    beforeEach(() => (repository = new CastMemberInMemoryRepository()));

    it("should no filter items when filter object is null", async () => {
        const items = [
            new CastMember({ name: "Tarantino", type: CastMemberType.DIRECTOR }),
            new CastMember({ 
                name: "Mia Goth", 
                type: CastMemberType.ACTOR,
                created_at: new Date(new Date().getTime() + 200),
            }),
        ];
        const filterSpy = jest.spyOn(items, "filter" as any);

        const itemsFiltered = await repository["applyFilter"](items, null);

        expect(filterSpy).not.toHaveBeenCalled();
        expect(itemsFiltered).toStrictEqual(items);
    });

    it("should filter items using filter parameter", async () => {
        const items = [
            new CastMember({ name: "Tarantino", type: CastMemberType.DIRECTOR }),
            new CastMember({ 
                name: "Mia Goth", 
                type: CastMemberType.ACTOR,
                created_at: new Date(new Date().getTime() + 200),
            }),
        ];
        const filterSpy = jest.spyOn(items, "filter" as any);

        let itemsFiltered = await repository["applyFilter"](items, "Tarantino");

        expect(filterSpy).toHaveBeenCalledTimes(1);
        expect(itemsFiltered).toStrictEqual([items[0]]);

        itemsFiltered = await repository["applyFilter"](items, "actor");
        expect(filterSpy).toHaveBeenCalledTimes(2);
        expect(itemsFiltered).toStrictEqual([items[1]]);
    });

    it("should sort by created_at when sort param is null", async () => {
        const created_at = new Date();

        const items = [
            new CastMember({ 
                name: "Tarantino", 
                type: CastMemberType.DIRECTOR, 
                created_at: new Date(new Date().getTime() + 100) }),
            new CastMember({ 
                name: "Mia Goth", 
                type: CastMemberType.ACTOR,
                created_at: new Date(new Date().getTime() + 200),
            }),
            new CastMember({ 
                name: "Jerry Seinfeld", 
                type: CastMemberType.ACTOR,
                created_at: new Date(new Date().getTime() + 300),
            }),
        ];

        const itemsSorted = await repository["applySort"](items, null, null);

        expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
    });

    it("should sort by name", async () => {
        const items = [
            new CastMember({ 
                name: "Tarantino", 
                type: CastMemberType.DIRECTOR, 
                created_at: new Date(new Date().getTime() + 100) }),
            new CastMember({ 
                name: "Mia Goth", 
                type: CastMemberType.ACTOR,
                created_at: new Date(new Date().getTime() + 200),
            }),
            new CastMember({ 
                name: "Jerry Seinfeld", 
                type: CastMemberType.ACTOR,
                created_at: new Date(new Date().getTime() + 300),
            }),
        ];

        let itemsSorted = await repository["applySort"](items, "name", "asc");
        expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);

        itemsSorted = await repository["applySort"](items, "name", "desc");
        expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]]);
    });
    

    it("should sort by created_at", async () => {
        const created_at = new Date();

        const items = [
            new CastMember({ 
                name: "Tarantino", 
                type: CastMemberType.DIRECTOR, 
                created_at: new Date(new Date().getTime() + 100) }),
            new CastMember({ 
                name: "Mia Goth", 
                type: CastMemberType.ACTOR,
                created_at: new Date(new Date().getTime() + 200),
            }),
            new CastMember({ 
                name: "Jerry Seinfeld", 
                type: CastMemberType.ACTOR,
                created_at: new Date(new Date().getTime() + 300),
            }),
        ];

        let itemsSorted = await repository["applySort"](items, "created_at", "asc");
        expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]]);

        itemsSorted = await repository["applySort"](items, "created_at", "desc");
        expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
    });

});