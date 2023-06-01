// @ts-nocheck
import * as Inputs from '../inputs';
import {
  defineExposeObject,
  definePrismaObject,
  defineFieldObject,
  defineRelationFunction,
  defineRelationObject,
} from '../utils';

export const OrganizationObject = definePrismaObject('Organization', {
  description: undefined,
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.exposeID('id', OrganizationIdFieldObject),
    createdAt: t.field(OrganizationCreatedAtFieldObject),
    updatedAt: t.field(OrganizationUpdatedAtFieldObject),
    name: t.exposeString('name', OrganizationNameFieldObject),
    slug: t.exposeString('slug', OrganizationSlugFieldObject),
    projects: t.relation('projects', OrganizationProjectsFieldObject(t)),
  }),
});

export const OrganizationIdFieldObject = defineExposeObject('String', {
  description: undefined,
  nullable: false,
});

export const OrganizationCreatedAtFieldObject = defineFieldObject('Organization', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.createdAt,
});

export const OrganizationUpdatedAtFieldObject = defineFieldObject('Organization', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.updatedAt,
});

export const OrganizationNameFieldObject = defineExposeObject('String', {
  description: undefined,
  nullable: false,
});

export const OrganizationSlugFieldObject = defineExposeObject('String', {
  description: undefined,
  nullable: false,
});

export const OrganizationProjectsFieldObject = defineRelationFunction('Organization', (t) =>
  defineRelationObject('Organization', 'projects', {
    description: undefined,
    nullable: false,
    args: {
      where: t.arg({ type: Inputs.ProjectWhereInput, required: false }),
      orderBy: t.arg({ type: [Inputs.ProjectOrderByWithRelationInput], required: false }),
      cursor: t.arg({ type: Inputs.ProjectWhereUniqueInput, required: false }),
      take: t.arg({ type: 'Int', required: false }),
      skip: t.arg({ type: 'Int', required: false }),
      distinct: t.arg({ type: [Inputs.ProjectScalarFieldEnum], required: false }),
    },
    query: (args) => ({
      where: args.where || undefined,
      cursor: args.cursor || undefined,
      take: args.take || undefined,
      distinct: args.distinct || undefined,
      skip: args.skip || undefined,
      orderBy: args.orderBy || undefined,
    }),
  }),
);
