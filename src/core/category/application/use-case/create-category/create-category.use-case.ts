import { IUseCase } from "../../../../shared/application/use-case.interface";
import { EntityValidationError } from "../../../../shared/domain/validators/validation.error";
import { Category } from "../../../domain/category.aggregate";
import { ICategoryRepository } from "../../../domain/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "../common/category-output";
import { CreateCategoryInput } from "./create-category.input";

// export type CreateCategoryOutput = {
//     id: string;
//     name: string;
//     description?: string | null;
//     is_active?: boolean;
//     created_at: Date;    
// };
export type CreateCategoryOutput = CategoryOutput;

export class CreateCategoryUseCase implements IUseCase<CreateCategoryInput, CreateCategoryOutput> {
    constructor(private readonly categoryRepo: ICategoryRepository) {}
    
    async execute(input: CreateCategoryInput): Promise<CreateCategoryOutput> {
        const entity = Category.create(input);
        
        if (entity.notification.hasErrors()) {
            throw new EntityValidationError(entity.notification.toJSON());
        }

        await this.categoryRepo.insert(entity);

        // return {
        //     id: entity.category_id.id,
        //     name: entity.name,
        //     description: entity.description,
        //     is_active: entity.is_active,
        //     created_at: entity.created_at,
        // };
        return CategoryOutputMapper.toOutput(entity);
    }
}
