import { Entity } from "./entity";

export abstract class AggregateRoot extends Entity {}
// Agregado lida principalmente com eventos de dominio.
// Abstração de entidade não lida com eventos.