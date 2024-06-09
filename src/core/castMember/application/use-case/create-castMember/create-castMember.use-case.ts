// import { IUseCase } from "../../../../shared/application/use-case.interface";
// import { EntityValidationError } from "../../../../shared/domain/validators/validation.error";

// export type CreateCategoryOutput = CategoryOutput;

// export class CreateCategoryUseCase implements IUseCase<CreateCategoryInput, CreateCategoryOutput> {
//     constructor(private readonly categoryRepo: ICategoryRepository) {}
    
//     async execute(input: CreateCategoryInput): Promise<CreateCategoryOutput> {
//         const entity = Category.create(input);
        
//         if (entity.notification.hasErrors()) {
//             throw new EntityValidationError(entity.notification.toJSON());
//         }

//         await this.categoryRepo.insert(entity);

       
//         return CategoryOutputMapper.toOutput(entity);
//     }
// }
