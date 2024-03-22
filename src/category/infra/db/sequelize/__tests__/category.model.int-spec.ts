import { DataType, Sequelize } from "sequelize-typescript";
import { CategoryModel } from "../category.model";
import { Category } from "../../../../domain/category.entity";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";

describe('CategoryModel Integration Test', () => {
    setupSequelize({ models: [CategoryModel] });

    test('should create a category', async() => {
       
        const category = Category.fake().aCategory().build();

        CategoryModel.create({
            category_id: category.category_id.id,
            name: category.name,
            description: category.description,
            is_active: category.is_active,
            created_at: category.created_at
        });
        
    });

    test("mapping props", () => {
        const attributesMap = CategoryModel.getAttributes();
        const attributes = Object.keys(CategoryModel.getAttributes());
    
        expect(attributes).toStrictEqual([
            "category_id",
            "name",
            "description",
            "is_active",
            "created_at",
        ]);
    
        const categoryIdAttr = attributesMap.category_id;
        expect(categoryIdAttr).toMatchObject({
            field: "category_id",
            fieldName: "category_id",
            primaryKey: true,
            type: DataType.UUID(),
        });
    
        const nameAttr = attributesMap.name;
        expect(nameAttr).toMatchObject({
            field: "name",
            fieldName: "name",
            allowNull: false,
            type: DataType.STRING(255),
        });
    
        const descriptionAttr = attributesMap.description;
        expect(descriptionAttr).toMatchObject({
            field: "description",
            fieldName: "description",
            allowNull: true,
            type: DataType.TEXT(),
        });
    
        const isActiveAttr = attributesMap.is_active;
        expect(isActiveAttr).toMatchObject({
            field: "is_active",
            fieldName: "is_active",
            allowNull: false,
            type: DataType.BOOLEAN(),
        });
    
        const createdAtAttr = attributesMap.created_at;
        expect(createdAtAttr).toMatchObject({
            field: "created_at",
            fieldName: "created_at",
            allowNull: false,
            type: DataType.DATE(3),
        });

    });

    test('Create', async () => {
        //arrange
        const arrange = {
            category_id: "ebecfdca-8c8f-46ff-9f3a-e42592049854",
            name: "test",
            is_active: true,
            created_at: new Date(),
        };

        //act
        const category = await CategoryModel.create(arrange);

        //assert
        expect(category.toJSON()).toStrictEqual(arrange);
    });

});