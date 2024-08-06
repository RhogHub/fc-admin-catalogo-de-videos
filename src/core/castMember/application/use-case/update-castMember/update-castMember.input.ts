import { CastMemberType } from "@core/castMember/domain/castMember.aggregate";
import { isDate, IsEnum, IsNotEmpty, IsOptional, IsString, validateSync } from "class-validator";

export type UpdateCastMemberInputConstructorProps = {
    castMember_id: string;
    name?: string;
    type?: CastMemberType;
    created_at?: Date;
};

export class UpdateCastMemberInput {
    @IsString()
    @IsNotEmpty()
    castMember_id: string;

    @IsString()
    @IsOptional()
    name: string;

    @IsEnum(CastMemberType)
    @IsOptional()
    type?: CastMemberType;
    
    @IsOptional()
    createdAt: Date;

    constructor(props?: UpdateCastMemberInputConstructorProps) {
        if (!props) return;
        this.castMember_id = props.castMember_id;
        props.name && (this.name = props.name);
        props.type && (this.type = props.type);
        props.created_at && (this.createdAt = props.created_at);
    }
}

export class ValidateUpdateCastMemberInput {
    static validate(input: UpdateCastMemberInput) {
        return validateSync(input);
    }
}