import { setupSequelize } from "@core/shared/infra/testing/helpers";
import { CastMemberModel } from "../castMember-model";
import { CastMember, CastMemberId, CastMemberType } from "@core/castMember/domain/castMember.aggregate";
import { CastMemberModelMapper } from "../castMember-model-mapper";
import { DataType } from "sequelize-typescript";

describe('CastMemberModel Integration Test', () => {
    setupSequelize({ models: [CastMemberModel] });

    test('should create a castMember', async () => {
        const entity = new CastMember({castMember_id: new CastMemberId("738e8c7e-9a4e-4792-8a6c-c614952234ee"), name: "Tarantino", type: CastMemberType.DIRECTOR, created_at: new Date(3) });
        const modelProps = CastMemberModelMapper.toModel(entity);      

        CastMemberModel.create(modelProps.toJSON());        
    });

    test("mapping props", async () => {
        const attributesMap = CastMemberModel.getAttributes();
        const attributes = Object.keys(CastMemberModel.getAttributes());
    
        expect(attributes).toStrictEqual([
            "castMember_id",
            "name",
            "type",          
            "created_at",
        ]);
    
        const castMemberIdAttr = attributesMap.castMember_id;
        expect(castMemberIdAttr).toMatchObject({
            field: "castMember_id",
            fieldName: "castMember_id",
            primaryKey: true,
            allowNull: false,
            type: DataType.UUID(),
        });
    
        const nameAttr = attributesMap.name;
        expect(nameAttr).toMatchObject({
            field: "name",
            fieldName: "name",
            allowNull: false,
            type: DataType.STRING(255),
        });   
       
        const typeAttr = attributesMap.type;
        expect(typeAttr).toMatchObject({
            field: "type",
            fieldName: "type",
            allowNull: false,
            type: DataType.INTEGER(),
        });
    
        const createdAtAttr = attributesMap.created_at;
        expect(createdAtAttr).toMatchObject({
            field: "created_at",
            fieldName: "created_at",
            allowNull: false,
            type: DataType.DATE(3),
        });

    });

});