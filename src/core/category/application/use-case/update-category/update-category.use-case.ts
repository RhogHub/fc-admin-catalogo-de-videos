import { IUseCase } from "../../../../shared/application/use-case.interface";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { EntityValidationError } from "../../../../shared/domain/validators/validation.error";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";
import { ICategoryRepository } from "../../../domain/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "../common/category-output";
import { UpdateCategoryInput } from "./update-category.input";

// export type UpdateCategoryOutput = {
//     id: string;
//     name: string;
//     description: string;
//     is_active: boolean;
//     created_at: Date;
// };
export type UpdateCategoryOutput = CategoryOutput;

export class UpdateCategoryUseCase
    implements IUseCase<UpdateCategoryInput, UpdateCategoryOutput>
{
    constructor(private categoryRepo: ICategoryRepository) {}

    async execute(input: UpdateCategoryInput): Promise<UpdateCategoryOutput> {
        const uuid = new Uuid(input.id);
        const category = await this.categoryRepo.findById(uuid);

        if (!category) {
            throw new NotFoundError(input.id, Category);
        }

        input.name && category.changeName(input.name);

        if (input.description !== undefined) {
            category.changeDescription(input.description);
        }

        if (input.is_active === true) {
            category.activate();
        }

        if (input.is_active === false) {
            category.deactivate();
        }

        if (category.notification.hasErrors()) {
            throw new EntityValidationError(category.notification.toJSON());
        }

        await this.categoryRepo.update(category);

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

