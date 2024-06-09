import { AggregateRoot } from "@core/shared/domain/aggregate-root";
import { ValueObject } from "../../shared/domain/value-object";
import { Uuid } from "../../shared/domain/value-objects/uuid.vo";
import { CastMemberValidatorFactory } from "./castMember.validator";

export type CastMemberConstructorProps = {
    castMember_id?: CastMemberId;
    name: string;
    type: CastMemberType;
    created_at?: Date;
}

export type CastMemberCreateCommand = {
    name: string;
    type: CastMemberType;
}

export enum CastMemberType {
    DIRECTOR = 1,
    ACTOR = 2
}

export class CastMemberId extends Uuid {}

export class CastMember extends AggregateRoot {    
    castMember_id: CastMemberId;
    name: string;
    type: CastMemberType;
    created_at: Date;

    constructor(props: CastMemberConstructorProps) {
        super();
        this.castMember_id = props.castMember_id ?? new CastMemberId();
        this.name = props.name;
        this.type = props.type;
        this.created_at = props.created_at ?? new Date();
    }

    get entity_id(): ValueObject {
        return this.castMember_id;
    }

    //Factory method
    static create(props: CastMemberCreateCommand): CastMember {
        const castMember = new CastMember(props);       
        castMember.validate(['name']);
        return castMember;
    }

    changeName(name: string): void {
        this.name = name;        
        this.validate(['name']);
    }
    
    changeType(type: CastMemberType): void {
        this.type = type;
    }

    //Notification patterns:
    validate(fields?: string[]) {
        const validator = CastMemberValidatorFactory.create();
        return validator.validate(this.notification, this, fields);
    }

    // static fake() {
    //     return CastMemberFakeBuilder;
    // }

    toJSON() {
        return {
            castMember_id: this.castMember_id.id,
            name: this.name,
            type: this.type,
            created_at: this.created_at,
        };
    }
    
}