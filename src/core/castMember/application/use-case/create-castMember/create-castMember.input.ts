import { CastMemberType } from "@core/castMember/domain/castMember.aggregate";
import {    
    IsNotEmpty,  
    IsString,   
    isInt,   
    validateSync,
} from "class-validator";
  
export type CreateCastMemberInputConstructorProps = {
    name: string;
    type: CastMemberType;   
};
  
export class CreateCastMemberInput {
    @IsString()
    @IsNotEmpty()
    name: string;   
       
    @IsNotEmpty()   
    type: CastMemberType;
  
    constructor(props: CreateCastMemberInputConstructorProps) {
        if (!props) return;
        this.name = props.name;
        this.type = props.type;        
    }
}
  
export class ValidateCreateCastMemberInput {
    static validate(input: CreateCastMemberInput) {
        return validateSync(input);
    }
}