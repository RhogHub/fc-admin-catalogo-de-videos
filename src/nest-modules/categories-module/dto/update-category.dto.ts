// --- Criado automaticamente pelo nest (ver docs mapped-types)
//import { PartialType } from '@nestjs/mapped-types';
// import { CreateCategoryDto } from './create-category.dto';
// export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

import { UpdateCategoryInput } from "@core/category/application/use-case/update-category/update-category.input";
import { OmitType } from "@nestjs/mapped-types";

export class UpdateCategoryInputWithoutId extends OmitType(UpdateCategoryInput, [
    'id',
] as const) {}

export class UpdateCategoryDto extends UpdateCategoryInputWithoutId {}