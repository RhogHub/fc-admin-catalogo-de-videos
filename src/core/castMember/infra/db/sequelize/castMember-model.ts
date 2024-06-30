import { CastMemberType } from "@core/castMember/domain/castMember.aggregate";
import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

export type CastMemberModelProps = {
    castMember_id: string;
    name: string;
    type: CastMemberType;
    created_at: Date;
}

@Table({ tableName: 'cast_members', timestamps: false })
export class CastMemberModel extends Model<CastMemberModelProps> {
    @PrimaryKey
    @Column({ type: DataType.UUID })
    declare castMember_id: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    declare name: string;

    @Column({ allowNull: false, type: DataType.INTEGER })
    declare type: CastMemberType;


    @Column({ allowNull: false, type: DataType.DATE(3) })
    declare created_at: Date;
}