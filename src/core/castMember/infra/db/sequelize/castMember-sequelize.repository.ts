import { CastMember } from "@core/castMember/domain/castMember.aggregate";
import { CastMemberSearchParams, CastMemberSearchResult, ICastMemberRepository } from "@core/castMember/domain/castMember.repository";
import { SortDirection } from "@core/shared/domain/repository/search-params";
import { Uuid } from "@core/shared/domain/value-objects/uuid.vo";
import { Op, literal } from "sequelize";
import { CastMemberModel } from "./castMember-model";
import { CastMemberModelMapper } from "./castMember-model-mapper";
import { NotFoundError } from "@core/shared/domain/errors/not-found.error";

export class CastMemberSequelizeRepository implements ICastMemberRepository {
    sortableFields: string[] = ['name', 'created_at'];
    orderBy = {
        mysql: {
            name: (sort_dir: SortDirection) => literal(`binary name ${sort_dir}`), //ascii
        },
    };

    constructor(private castMemberModel: typeof CastMemberModel) {}
   
    async search(props: CastMemberSearchParams): Promise<CastMemberSearchResult> {
        const offset = (props.page - 1) * props.per_page;
        const limit = props.per_page;

        const { rows: models, count } = await this.castMemberModel.findAndCountAll({
            ...(props.filter && {
                where: {
                    name: { [Op.like]: `%${props.filter}%` },
                },
            }),
            ...(props.sort && this.sortableFields.includes(props.sort)
                ? //? { order: [[props.sort, props.sort_dir]] }
                    { order: this.formatSort(props.sort, props.sort_dir!) }
                : { order: [['created_at', 'desc']] }),
            offset,
            limit,
        });

        return new CastMemberSearchResult({
            items: models.map((model) => {
                return CastMemberModelMapper.toEntity(model);
            }),
            current_page: props.page,
            per_page: props.per_page,
            total: count,
        });
    }

    async insert(entity: CastMember): Promise<void> {
        const modelProps = CastMemberModelMapper.toModel(entity);
        await this.castMemberModel.create(modelProps.toJSON());        
    }
    
    async bulkInsert(entities: CastMember[]): Promise<void> {
        await this.castMemberModel.bulkCreate(entities.map((e) => e.toJSON()));
    }

    async update(entity: CastMember): Promise<void> {
        //throw new Error("Method not implemented.");
        const id = entity.castMember_id.id;
        const model = await this.castMemberModel.findByPk(id);
        if (!model) {
            throw new NotFoundError(id, this.getEntity());
        }

        const modelProps = CastMemberModelMapper.toModel(entity);
        await this.castMemberModel.update(modelProps.toJSON(), {
            where: { castMember_id: id },
        });
    }

    async delete(entity_id: Uuid): Promise<void> {
        const id = entity_id.id;

        const affectedRows = await this.castMemberModel.destroy({
            where: { castMember_id: id },
        });

        if (affectedRows !== 1) {
            throw new NotFoundError(id, this.getEntity());
        }
    }

    async findById(entity_id: Uuid): Promise<CastMember> {
        const model = await this.castMemberModel.findByPk(entity_id.id);
        return CastMemberModelMapper.toEntity(model);
    }

    async findAll(): Promise<CastMember[]> {
        const models = await this.castMemberModel.findAll();
        return models.map((model) => {
            return CastMemberModelMapper.toEntity(model);
        });
    }

    private formatSort(sort: string, sort_dir: SortDirection) {
        const dialect = this.castMemberModel.sequelize!.getDialect() as 'mysql';
        if (this.orderBy[dialect] && this.orderBy[dialect][sort]) {
            return this.orderBy[dialect][sort](sort_dir);
        }
        return [[sort, sort_dir]];
    }

    getEntity(): new (...args: any[]) => CastMember {
        return CastMember;
    }
}