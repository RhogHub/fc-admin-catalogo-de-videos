import { CastMember, CastMemberId, CastMemberType } from "../castMember.aggregate";

describe("CastMember Unit Test", () => {
    beforeEach(() => {
        CastMember.prototype.validate = jest.fn()
        .mockImplementation(CastMember.prototype.validate);
    });

    //Arrange Act Assert
    describe("constructor", () => { 
        test('constructor of cast member', () =>
        {
            const director = CastMemberType.DIRECTOR;
            let castMember = new CastMember({
                name: 'Cast Member 1',
                type: director,
            });

            expect(castMember.castMember_id).toBeInstanceOf(CastMemberId);
            expect(castMember.name).toBe('Cast Member 1');
            expect(castMember.type).toEqual(director);
            expect(castMember.created_at).toBeInstanceOf(Date); 

            const created_at = new Date();
            castMember = new CastMember({
                name: 'Cast Member 2',
                type: director,
                created_at,
            });

            expect(castMember.castMember_id).toBeInstanceOf(CastMemberId);
            expect(castMember.name).toBe('Cast Member 2');
            expect(castMember.type).toEqual(director);
            expect(castMember.created_at).toBe(created_at); 
        });        
    });

    describe('create command', () => {
        test('should create a cast member', () => {
            const actor = CastMemberType.ACTOR;
            const castMember = CastMember.create({
                name: "Cast Member",
                type: actor,
            });

            expect(castMember.castMember_id).toBeInstanceOf(CastMemberId);
            expect(castMember.name).toBe('Cast Member');
            expect(castMember.type).toEqual(actor);
            expect(castMember.created_at).toBeInstanceOf(Date);   
            expect(CastMember.prototype.validate).toHaveBeenCalledTimes(1);
            expect(castMember.notification.hasErrors()).toBe(false);  
        });
    });

    describe('castMember_id field', () => {
        const actor = CastMemberType.ACTOR;
        const arrange = [
            {castMember_id: null}, 
            {castMember_id: undefined}, 
            {castMember_id: new CastMemberId()},
        ];
        test.each(arrange)("id = %j", ({castMember_id}) => {
            const castMember = new CastMember({
                name: "Cast Member",
                type: actor,
                castMember_id: castMember_id as any,
            });

            expect(castMember.castMember_id).toBeInstanceOf(CastMemberId);
        });
    });

    test('should change name', () => {
        const castMember = CastMember.create({
            name: "Cast Member 1",
            type: CastMemberType.ACTOR,
        });

        castMember.changeName("Cast Member 2");

        expect(castMember.name).toBe("Cast Member 2");  
        expect(CastMember.prototype.validate).toHaveBeenCalledTimes(2);
        expect(castMember.notification.hasErrors()).toBe(false);     
    });

    test('should change type', () => {
        const actor = CastMemberType.ACTOR;
        const castMember = CastMember.create({
            name: "Cast Member",
            type: actor,
        });
        const director = CastMemberType.DIRECTOR;
        castMember.changeType(director);

        expect(castMember.name).toBe("Cast Member");  
        expect(castMember.type).toEqual(director);        
        expect(castMember.notification.hasErrors()).toBe(false);     
    });

    describe("Cast Member Validator", () => {
        test("should an invalid cast member with name property", () => {
            const director = CastMemberType.DIRECTOR;
            const castMember = CastMember.create({ name: "t".repeat(256), type: director});
    
            expect(castMember.notification.hasErrors()).toBe(true);
            expect(castMember.notification).notificationContainsErrorMessages([
                {
                    name: ["name must be shorter than or equal to 255 characters"],
                },
            ]);
        });
    });

    describe("changeName method", () => {
        it("should a invalid cast member using name property", () => {
            const director = CastMemberType.DIRECTOR;
            const castMember = CastMember.create({ name: "t".repeat(256), type: director});
            
            castMember.changeName("t".repeat(256));

            expect(castMember.notification.hasErrors()).toBe(true);
            expect(castMember.notification).notificationContainsErrorMessages([
                {
                    name: ["name must be shorter than or equal to 255 characters"],
                },
            ]);
        });
    });   

});