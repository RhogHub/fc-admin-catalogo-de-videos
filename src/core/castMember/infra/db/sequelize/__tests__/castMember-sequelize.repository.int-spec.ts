import { setupSequelize } from "@core/shared/infra/testing/helpers";
import { CastMemberModel } from "../castMember-model";
import { CastMemberSequelizeRepository } from "../castMember-sequelize.repository";
import { CastMember, CastMemberId, CastMemberType } from "@core/castMember/domain/castMember.aggregate";
import { Uuid } from "@core/shared/domain/value-objects/uuid.vo";
import { NotFoundError } from "@core/shared/domain/errors/not-found.error";
import { CastMemberModelMapper } from "../castMember-model-mapper";
import { CastMemberSearchParams, CastMemberSearchResult } from "@core/castMember/domain/castMember.repository";
import { SearchParams } from "@core/shared/domain/repository/search-params";

describe("CastMemberSequelizeRepository Integration Test", () => {
    let repository: CastMemberSequelizeRepository;
    setupSequelize({ models: [CastMemberModel] });

    beforeEach(async () => {        
        repository = new CastMemberSequelizeRepository(CastMemberModel);
    });

    test('should inserts a new castMember', async () => {
        let castMember = new CastMember({
            castMember_id: new CastMemberId("9366b7dc-2d71-4799-b91c-c64adb205104"),
            name: 'Tarantino',           
            type: CastMemberType.DIRECTOR,
            created_at: new Date(),
        });
        await repository.insert(castMember);

        let entity = await repository.findById(castMember.castMember_id);
        expect(entity.toJSON()).toStrictEqual(castMember.toJSON());

    });

    it("should finds an entity by id", async () => {
        let entityFound = await repository.findById(new Uuid());
        expect(entityFound).toBeNull();

        const entity = new CastMember({
            castMember_id: new CastMemberId("9366b7dc-2d71-4799-b91c-c64adb205104"),
            name: 'Tarantino',           
            type: CastMemberType.DIRECTOR,
            created_at: new Date(),
        });

        await repository.insert(entity);
        entityFound = await repository.findById(entity.castMember_id);

        expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
    });

    it("should return all castMembers", async () => {
        const entity = new CastMember({
            castMember_id: new CastMemberId("9366b7dc-2d71-4799-b91c-c64adb205104"),
            name: 'Tarantino',           
            type: CastMemberType.DIRECTOR,
            created_at: new Date(),
        });
        await repository.insert(entity);
        const entities = await repository.findAll();

        expect(entities).toHaveLength(1);
        expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));
    });

    it("should throw error on update when an entity not found", async () => {
        const entity = new CastMember({
            castMember_id: new CastMemberId("9366b7dc-2d71-4799-b91c-c64adb205104"),
            name: 'Tarantino',           
            type: CastMemberType.DIRECTOR,
            created_at: new Date(),
        }); 

        await expect(repository.update(entity)).rejects.toThrow(
            new NotFoundError(entity.castMember_id.id, CastMember)
        );        
    });

    it("should update an entity", async () => {
        const entity = new CastMember({
            castMember_id: new CastMemberId("9366b7dc-2d71-4799-b91c-c64adb205104"),
            name: 'Tarantino',           
            type: CastMemberType.DIRECTOR,
            created_at: new Date(),
        }); 

        await repository.insert(entity);
    
        entity.changeName("Christopher Nolan");
        await repository.update(entity);
    
        const entityFound = await repository.findById(entity.castMember_id);

        expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
    });

    it("should throw error on delete when an entity not found", async () => {
        const castMemberId = new CastMemberId();

        await expect(repository.delete(castMemberId)).rejects.toThrow(
            new NotFoundError(castMemberId.id, CastMember)
        );
    });

    it("should delete an entity", async () => {
        const entity = new CastMember({
            castMember_id: new CastMemberId("9366b7dc-2d71-4799-b91c-c64adb205104"),
            name: 'Tarantino',           
            type: CastMemberType.DIRECTOR,
            created_at: new Date(),
        }); 

        await repository.insert(entity);
    
        await repository.delete(entity.castMember_id);

        await expect(repository.findById(entity.castMember_id)).resolves.toBeNull();
    });

});

describe("search method tests", () => {
    let repository: CastMemberSequelizeRepository;
    setupSequelize({ models: [CastMemberModel] });

    beforeEach(async () => {        
        repository = new CastMemberSequelizeRepository(CastMemberModel);
    });

    it("should only apply paginate when other params are null", async () => {
        const castMembers = [
            new CastMember({ name: "Tarantino", type: CastMemberType.DIRECTOR }),
            new CastMember({ name: "Mia Goth", type: CastMemberType.ACTOR }),
            new CastMember({ name: "Christopher Nolan", type: CastMemberType.DIRECTOR }),
            new CastMember({ name: "Keanu Reeves", type: CastMemberType.ACTOR }),
        ];
        await repository.bulkInsert(castMembers);

        const spyToEntity = jest.spyOn(CastMemberModelMapper, "toEntity");
    
        const searchOutput = await repository.search(new CastMemberSearchParams());
        expect(searchOutput).toBeInstanceOf(CastMemberSearchResult);
        expect(spyToEntity).toHaveBeenCalledTimes(4);
        expect(searchOutput.toJSON()).toMatchObject({
            total: 4,
            current_page: 1,
            last_page: 1,
            per_page: 15,
        });
        searchOutput.items.forEach((item) => {
            expect(item).toBeInstanceOf(CastMember);
            expect(item.castMember_id).toBeDefined();
        });            
    });

    it("should order by created_at DESC when search params are null", async () => {
        const created_at = new Date();
        const castMembers = [
            new CastMember({ name: "Tarantino", type: CastMemberType.DIRECTOR }),
            new CastMember({ name: "Mia Goth", type: CastMemberType.ACTOR }),
            new CastMember({ name: "Christopher Nolan", type: CastMemberType.DIRECTOR }),
            new CastMember({ name: "Keanu Reeves", type: CastMemberType.ACTOR }),
        ];
        await repository.bulkInsert(castMembers);

        const searchOutput = await repository.search(new CastMemberSearchParams());
        const items = searchOutput.items;
        [...items].reverse().forEach((item, index) => {
            expect(`${castMembers[index].name}`).toBe(`${castMembers[index].name}`);
        });
    });

    it("should apply paginate and filter", async () => {
        const castMembers = [
            new CastMember({ name: "a", type: CastMemberType.ACTOR }),
            new CastMember({ name: "AAA", type: CastMemberType.ACTOR }),
            new CastMember({ name: "AaA", type: CastMemberType.ACTOR }),
            new CastMember({ name: "b", type: CastMemberType.DIRECTOR }),  
            new CastMember({ name: "c", type: CastMemberType.DIRECTOR }),          
        ];
        await repository.bulkInsert(castMembers);

        let searchOutput = await repository.search(
            new CastMemberSearchParams({
                page: 1,
                per_page: 2,
                filter: "AA",
            })
        );
        
        expect(searchOutput.toJSON(true)).toMatchObject(
            new CastMemberSearchResult({
                items: [castMembers[1], castMembers[2]],
                total: 2,
                current_page: 1,                
                per_page: 2,
            }).toJSON(true)
        );

        searchOutput = await repository.search(
            new CastMemberSearchParams({
                page: 2,
                per_page: 2,
                filter: "a",
            })
        );
        
        expect(searchOutput.toJSON(true)).toMatchObject(
            new CastMemberSearchResult({
                items: [castMembers[2]],
                total: 3,               
                current_page: 2,
                per_page: 2,
            }).toJSON(true)
        );

        searchOutput = await repository.search(
            new CastMemberSearchParams({
                page: 1,
                per_page: 2,
                filter: "director",
            })
        );
        
        expect(searchOutput.toJSON(true)).toMatchObject(
            new CastMemberSearchResult({
                items: [castMembers[3], castMembers[4]],
                total: 2,
                current_page: 1,                
                per_page: 2,
            }).toJSON(true)
        );
    });

    it("should apply paginate and sort", async () => {
        expect(repository.sortableFields).toStrictEqual(["name", "created_at"]);

        const castMembers = [
            new CastMember({ name: "a", type: CastMemberType.ACTOR }),
            new CastMember({ name: "AAA", type: CastMemberType.ACTOR }),
            new CastMember({ name: "AaA", type: CastMemberType.ACTOR }),
            new CastMember({ name: "b", type: CastMemberType.DIRECTOR }),  
            new CastMember({ name: "c", type: CastMemberType.DIRECTOR }),          
        ];
        await repository.bulkInsert(castMembers);

        const arrange = [
            {
                params: new CastMemberSearchParams({
                    page: 1,
                    per_page: 2,
                    sort: "name",                    
                }),
                result: new CastMemberSearchResult({
                    items: [castMembers[1],castMembers[2]],
                    total: 5,
                    current_page: 1,
                    per_page: 2,
                }),
            },
            {
                params: new CastMemberSearchParams({
                    page: 2,
                    per_page: 2,
                    sort: "name",                    
                }),
                result: new CastMemberSearchResult({
                    items: [castMembers[0],castMembers[3]],
                    total: 5,
                    current_page: 2,
                    per_page: 2,
                }),
            },
            {
                params: new CastMemberSearchParams({
                    page: 1,
                    per_page: 2,
                    sort: "name", 
                    sort_dir: "desc",                   
                }),
                result: new CastMemberSearchResult({
                    items: [castMembers[4],castMembers[3]],
                    total: 5,
                    current_page: 1,
                    per_page: 2,
                }),
            },
        ];
        for (const i of arrange) {
            const result = await repository.search(i.params);
            expect(result.toJSON(true)).toMatchObject(i.result.toJSON(true));
        }
    });

});

describe("should search using filter, sort and paginate", () => {
    const director = CastMemberType.DIRECTOR;
    const actor = CastMemberType.ACTOR;
    const castMembers = [
        new CastMember({ name: "Test", type: director }),
        new CastMember({ name: "TEST", type: actor }),
        new CastMember({ name: "a", type: actor }),
        new CastMember({ name: "test", type: director }),
        new CastMember({ name: "tt", type: actor }),
    ];

    const arrange = [
        {
            search_params: new CastMemberSearchParams({
                page: 1,
                per_page: 2,
                sort: "name",
                filter: "TEST",
            }),
            search_result: new CastMemberSearchResult({
                items: [castMembers[1],castMembers[0]],
                total: 3,
                current_page: 1,
                per_page: 2,
            }),
        },
        {
            search_params: new CastMemberSearchParams({
                page: 2,
                per_page: 2,
                sort: "name",
                filter: "TEST",
            }),
            search_result: new CastMemberSearchResult({
                items: [castMembers[3]],
                total: 3,
                current_page: 2,
                per_page: 2,
            }),
        },
        {
            search_params: new CastMemberSearchParams({
                page: 1,
                per_page: 2,
                sort: "name",
                filter: "actor",
            }),
            search_result: new CastMemberSearchResult({
                items: [castMembers[1],castMembers[2]],
                total: 3,
                current_page: 1,
                per_page: 2,
            }),
        },
        {
            search_params: new CastMemberSearchParams({
                page: 2,
                per_page: 2,
                sort: "name",
                filter: "actor",
            }),
            search_result: new CastMemberSearchResult({
                items: [castMembers[4]],
                total: 3,
                current_page: 2,
                per_page: 2,
            }),
        },
    ];

    let repository: CastMemberSequelizeRepository;
    setupSequelize({ models: [CastMemberModel] });

    beforeEach(async () => {        
        repository = new CastMemberSequelizeRepository(CastMemberModel);
        await repository.bulkInsert(castMembers);
    });   

    test.each(arrange)(
        "when value is $search_params",
        async ({ search_params, search_result }) => {
            const result = await repository.search(search_params);
            expect(result.toJSON(true)).toMatchObject(search_result.toJSON(true));
        }
    );

});
