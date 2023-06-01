// @ts-nocheck
import * as Inputs from '../inputs';
import {
  defineExposeObject,
  definePrismaObject,
  defineFieldObject,
  defineRelationFunction,
  defineRelationObject,
} from '../utils';

export const ProjectObject = definePrismaObject('Project', {
  description: undefined,
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.exposeID('id', ProjectIdFieldObject),
    createdAt: t.field(ProjectCreatedAtFieldObject),
    updatedAt: t.field(ProjectUpdatedAtFieldObject),
    name: t.exposeString('name', ProjectNameFieldObject),
    slug: t.exposeString('slug', ProjectSlugFieldObject),
    image: t.exposeString('image', ProjectImageFieldObject),
    description: t.exposeString('description', ProjectDescriptionFieldObject),
    organization: t.relation('organization', ProjectOrganizationFieldObject),
    organizationId: t.exposeString('organizationId', ProjectOrganizationIdFieldObject),
    posts: t.relation('posts', ProjectPostsFieldObject(t)),
  }),
});

export const ProjectIdFieldObject = defineExposeObject('String', {
  description: undefined,
  nullable: false,
});

export const ProjectCreatedAtFieldObject = defineFieldObject('Project', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.createdAt,
});

export const ProjectUpdatedAtFieldObject = defineFieldObject('Project', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.updatedAt,
});

export const ProjectNameFieldObject = defineExposeObject('String', {
  description: undefined,
  nullable: false,
});

export const ProjectSlugFieldObject = defineExposeObject('String', {
  description: undefined,
  nullable: false,
});

export const ProjectImageFieldObject = defineExposeObject('String', {
  description: undefined,
  nullable: true,
});

export const ProjectDescriptionFieldObject = defineExposeObject('String', {
  description: undefined,
  nullable: true,
});

export const ProjectOrganizationFieldObject = defineRelationObject('Project', 'organization', {
  description: undefined,
  nullable: false,
  args: undefined,
  query: undefined,
});

export const ProjectOrganizationIdFieldObject = defineExposeObject('String', {
  description: undefined,
  nullable: false,
});

export const ProjectPostsFieldObject = defineRelationFunction('Project', (t) =>
  defineRelationObject('Project', 'posts', {
    description: undefined,
    nullable: false,
    args: {
      where: t.arg({ type: Inputs.PostWhereInput, required: false }),
      orderBy: t.arg({ type: [Inputs.PostOrderByWithRelationInput], required: false }),
      cursor: t.arg({ type: Inputs.PostWhereUniqueInput, required: false }),
      take: t.arg({ type: 'Int', required: false }),
      skip: t.arg({ type: 'Int', required: false }),
      distinct: t.arg({ type: [Inputs.PostScalarFieldEnum], required: false }),
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
