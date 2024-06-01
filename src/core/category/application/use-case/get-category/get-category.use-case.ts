import { IUseCase } from "../../../../shared/application/use-case.interface";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category, CategoryId } from "../../../domain/category.aggregate";
import { ICategoryRepository } from "../../../domain/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "../common/category-output";

export type GetCategoryInput = {
    id: string;
};

// export type GetCategoryOutput = {
//     id: string;
//     name: string;
//     description: string;
//     is_active: boolean;
//     created_at: Date;
// };
export type GetCategoryOutput = CategoryOutput;

export class GetCategoryUseCase
    implements IUseCase<GetCategoryInput, GetCategoryOutput>
{
    constructor(private categoryRepo: ICategoryRepository) {}

    async execute(input: GetCategoryInput): Promise<GetCategoryOutput> {
        const categoryId = new CategoryId(input.id);
        const category = await this.categoryRepo.findById(categoryId);
        
        if (!category) {
            throw new NotFoundError(input.id, Category);
        }

        // return {
        //     id: category.category_id.id,
        //     name: category.name,
        //     description: category.description,
        //     is_active: category.is_active,
        //     created_at: category.created_at,
        // };
        return CategoryOutputMapper.toOutput(category);
    }
}

