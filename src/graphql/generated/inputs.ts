// @ts-nocheck
// @ts-nocheck
import type { Prisma } from "@prisma/client";
import { builder } from "graphql/schema";

type Filters = {
  string: Prisma.StringFieldUpdateOperationsInput;
  nullableString: Prisma.NullableStringFieldUpdateOperationsInput;
  dateTime: Prisma.DateTimeFieldUpdateOperationsInput;
  nullableDateTime: Prisma.NullableDateTimeFieldUpdateOperationsInput;
  int: Prisma.IntFieldUpdateOperationsInput;
  nullableInt: Prisma.NullableIntFieldUpdateOperationsInput;
  bool: Prisma.BoolFieldUpdateOperationsInput;
  nullableBool: Prisma.NullableBoolFieldUpdateOperationsInput;
  bigInt: Prisma.BigIntFieldUpdateOperationsInput;
  nullableBigInt: Prisma.NullableBigIntFieldUpdateOperationsInput;
  bytes: Prisma.BytesFieldUpdateOperationsInput;
  nullableBytes: Prisma.NullableBytesFieldUpdateOperationsInput;
  float: Prisma.FloatFieldUpdateOperationsInput;
  nullableFloat: Prisma.NullableFloatFieldUpdateOperationsInput;
  decimal: Prisma.DecimalFieldUpdateOperationsInput;
  nullableDecimal: Prisma.NullableDecimalFieldUpdateOperationsInput;
};

type ApplyFilters<InputField> = {
  [F in keyof Filters]: 0 extends 1 & Filters[F]
    ? never
    : Filters[F] extends InputField
    ? Filters[F]
    : never;
}[keyof Filters];

type PrismaUpdateOperationsInputFilter<T extends object> = {
  [K in keyof T]: [ApplyFilters<T[K]>] extends [never] ? T[K] : ApplyFilters<T[K]>
};

export const DateTime = builder.scalarType('DateTime', {
  parseValue: (value) => {
    try {
      const date = new Date(value)
      if (date.toString() === 'Invalid Date') throw new Error('Invalid Date')
      return date
    } catch (error) {
      throw new Error('Invalid Date');
    }
  },
  serialize: (value) => value ? new Date(value) : null,
});

export const TransactionIsolationLevel = builder.enumType('TransactionIsolationLevel', {
  values: ["ReadUncommitted","ReadCommitted","RepeatableRead","Serializable"] as const,
});

export const UserScalarFieldEnum = builder.enumType('UserScalarFieldEnum', {
  values: ["id","createdAt","updatedAt","walletAddress"] as const,
});

export const OrganizationScalarFieldEnum = builder.enumType('OrganizationScalarFieldEnum', {
  values: ["id","createdAt","updatedAt","name","slug"] as const,
});

export const ProjectScalarFieldEnum = builder.enumType('ProjectScalarFieldEnum', {
  values: ["id","createdAt","updatedAt","name","slug","image","description","organizationId"] as const,
});

export const PostScalarFieldEnum = builder.enumType('PostScalarFieldEnum', {
  values: ["id","createdAt","updatedAt","title","description","authorId","projectId"] as const,
});

export const UpvoteScalarFieldEnum = builder.enumType('UpvoteScalarFieldEnum', {
  values: ["id","createdAt","updatedAt","postId","userId"] as const,
});

export const SortOrder = builder.enumType('SortOrder', {
  values: ["asc","desc"] as const,
});

export const QueryMode = builder.enumType('QueryMode', {
  values: ["default","insensitive"] as const,
});

export const NullsOrder = builder.enumType('NullsOrder', {
  values: ["first","last"] as const,
});

export const UserWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[UserWhereInput]}),
  OR: t.field({"required":false,"type":[UserWhereInput]}),
  NOT: t.field({"required":false,"type":[UserWhereInput]}),
  id: t.field({"required":false,"type":StringFilter}),
  createdAt: t.field({"required":false,"type":DateTimeFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeFilter}),
  walletAddress: t.field({"required":false,"type":StringFilter}),
  Upvote: t.field({"required":false,"type":UpvoteListRelationFilter}),
  Post: t.field({"required":false,"type":PostListRelationFilter}),
});
export const UserWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserWhereInput>>('UserWhereInput').implement({
  fields: UserWhereInputFields,
});

export const UserOrderByWithRelationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  walletAddress: t.field({"required":false,"type":SortOrder}),
  Upvote: t.field({"required":false,"type":UpvoteOrderByRelationAggregateInput}),
  Post: t.field({"required":false,"type":PostOrderByRelationAggregateInput}),
});
export const UserOrderByWithRelationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserOrderByWithRelationInput>>('UserOrderByWithRelationInput').implement({
  fields: UserOrderByWithRelationInputFields,
});

export const UserWhereUniqueInputFields = (t: any) => ({
  id: t.string({"required":false}),
  walletAddress: t.string({"required":false}),
});
export const UserWhereUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserWhereUniqueInput>>('UserWhereUniqueInput').implement({
  fields: UserWhereUniqueInputFields,
});

export const UserOrderByWithAggregationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  walletAddress: t.field({"required":false,"type":SortOrder}),
  _count: t.field({"required":false,"type":UserCountOrderByAggregateInput}),
  _max: t.field({"required":false,"type":UserMaxOrderByAggregateInput}),
  _min: t.field({"required":false,"type":UserMinOrderByAggregateInput}),
});
export const UserOrderByWithAggregationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserOrderByWithAggregationInput>>('UserOrderByWithAggregationInput').implement({
  fields: UserOrderByWithAggregationInputFields,
});

export const UserScalarWhereWithAggregatesInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[UserScalarWhereWithAggregatesInput]}),
  OR: t.field({"required":false,"type":[UserScalarWhereWithAggregatesInput]}),
  NOT: t.field({"required":false,"type":[UserScalarWhereWithAggregatesInput]}),
  id: t.field({"required":false,"type":StringWithAggregatesFilter}),
  createdAt: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
  walletAddress: t.field({"required":false,"type":StringWithAggregatesFilter}),
});
export const UserScalarWhereWithAggregatesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserScalarWhereWithAggregatesInput>>('UserScalarWhereWithAggregatesInput').implement({
  fields: UserScalarWhereWithAggregatesInputFields,
});

export const OrganizationWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[OrganizationWhereInput]}),
  OR: t.field({"required":false,"type":[OrganizationWhereInput]}),
  NOT: t.field({"required":false,"type":[OrganizationWhereInput]}),
  id: t.field({"required":false,"type":StringFilter}),
  createdAt: t.field({"required":false,"type":DateTimeFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeFilter}),
  name: t.field({"required":false,"type":StringFilter}),
  slug: t.field({"required":false,"type":StringFilter}),
  projects: t.field({"required":false,"type":ProjectListRelationFilter}),
});
export const OrganizationWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.OrganizationWhereInput>>('OrganizationWhereInput').implement({
  fields: OrganizationWhereInputFields,
});

export const OrganizationOrderByWithRelationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  name: t.field({"required":false,"type":SortOrder}),
  slug: t.field({"required":false,"type":SortOrder}),
  projects: t.field({"required":false,"type":ProjectOrderByRelationAggregateInput}),
});
export const OrganizationOrderByWithRelationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.OrganizationOrderByWithRelationInput>>('OrganizationOrderByWithRelationInput').implement({
  fields: OrganizationOrderByWithRelationInputFields,
});

export const OrganizationWhereUniqueInputFields = (t: any) => ({
  id: t.string({"required":false}),
  name: t.string({"required":false}),
  slug: t.string({"required":false}),
});
export const OrganizationWhereUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.OrganizationWhereUniqueInput>>('OrganizationWhereUniqueInput').implement({
  fields: OrganizationWhereUniqueInputFields,
});

export const OrganizationOrderByWithAggregationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  name: t.field({"required":false,"type":SortOrder}),
  slug: t.field({"required":false,"type":SortOrder}),
  _count: t.field({"required":false,"type":OrganizationCountOrderByAggregateInput}),
  _max: t.field({"required":false,"type":OrganizationMaxOrderByAggregateInput}),
  _min: t.field({"required":false,"type":OrganizationMinOrderByAggregateInput}),
});
export const OrganizationOrderByWithAggregationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.OrganizationOrderByWithAggregationInput>>('OrganizationOrderByWithAggregationInput').implement({
  fields: OrganizationOrderByWithAggregationInputFields,
});

export const OrganizationScalarWhereWithAggregatesInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[OrganizationScalarWhereWithAggregatesInput]}),
  OR: t.field({"required":false,"type":[OrganizationScalarWhereWithAggregatesInput]}),
  NOT: t.field({"required":false,"type":[OrganizationScalarWhereWithAggregatesInput]}),
  id: t.field({"required":false,"type":StringWithAggregatesFilter}),
  createdAt: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
  name: t.field({"required":false,"type":StringWithAggregatesFilter}),
  slug: t.field({"required":false,"type":StringWithAggregatesFilter}),
});
export const OrganizationScalarWhereWithAggregatesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.OrganizationScalarWhereWithAggregatesInput>>('OrganizationScalarWhereWithAggregatesInput').implement({
  fields: OrganizationScalarWhereWithAggregatesInputFields,
});

export const ProjectWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[ProjectWhereInput]}),
  OR: t.field({"required":false,"type":[ProjectWhereInput]}),
  NOT: t.field({"required":false,"type":[ProjectWhereInput]}),
  id: t.field({"required":false,"type":StringFilter}),
  createdAt: t.field({"required":false,"type":DateTimeFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeFilter}),
  name: t.field({"required":false,"type":StringFilter}),
  slug: t.field({"required":false,"type":StringFilter}),
  image: t.field({"required":false,"type":StringNullableFilter}),
  description: t.field({"required":false,"type":StringNullableFilter}),
  organizationId: t.field({"required":false,"type":StringFilter}),
  organization: t.field({"required":false,"type":OrganizationWhereInput}),
  posts: t.field({"required":false,"type":PostListRelationFilter}),
});
export const ProjectWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ProjectWhereInput>>('ProjectWhereInput').implement({
  fields: ProjectWhereInputFields,
});

export const ProjectOrderByWithRelationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  name: t.field({"required":false,"type":SortOrder}),
  slug: t.field({"required":false,"type":SortOrder}),
  image: t.field({"required":false,"type":SortOrder}),
  description: t.field({"required":false,"type":SortOrder}),
  organizationId: t.field({"required":false,"type":SortOrder}),
  organization: t.field({"required":false,"type":OrganizationOrderByWithRelationInput}),
  posts: t.field({"required":false,"type":PostOrderByRelationAggregateInput}),
});
export const ProjectOrderByWithRelationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ProjectOrderByWithRelationInput>>('ProjectOrderByWithRelationInput').implement({
  fields: ProjectOrderByWithRelationInputFields,
});

export const ProjectWhereUniqueInputFields = (t: any) => ({
  id: t.string({"required":false}),
});
export const ProjectWhereUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ProjectWhereUniqueInput>>('ProjectWhereUniqueInput').implement({
  fields: ProjectWhereUniqueInputFields,
});

export const ProjectOrderByWithAggregationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  name: t.field({"required":false,"type":SortOrder}),
  slug: t.field({"required":false,"type":SortOrder}),
  image: t.field({"required":false,"type":SortOrder}),
  description: t.field({"required":false,"type":SortOrder}),
  organizationId: t.field({"required":false,"type":SortOrder}),
  _count: t.field({"required":false,"type":ProjectCountOrderByAggregateInput}),
  _max: t.field({"required":false,"type":ProjectMaxOrderByAggregateInput}),
  _min: t.field({"required":false,"type":ProjectMinOrderByAggregateInput}),
});
export const ProjectOrderByWithAggregationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ProjectOrderByWithAggregationInput>>('ProjectOrderByWithAggregationInput').implement({
  fields: ProjectOrderByWithAggregationInputFields,
});

export const ProjectScalarWhereWithAggregatesInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[ProjectScalarWhereWithAggregatesInput]}),
  OR: t.field({"required":false,"type":[ProjectScalarWhereWithAggregatesInput]}),
  NOT: t.field({"required":false,"type":[ProjectScalarWhereWithAggregatesInput]}),
  id: t.field({"required":false,"type":StringWithAggregatesFilter}),
  createdAt: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
  name: t.field({"required":false,"type":StringWithAggregatesFilter}),
  slug: t.field({"required":false,"type":StringWithAggregatesFilter}),
  image: t.field({"required":false,"type":StringNullableWithAggregatesFilter}),
  description: t.field({"required":false,"type":StringNullableWithAggregatesFilter}),
  organizationId: t.field({"required":false,"type":StringWithAggregatesFilter}),
});
export const ProjectScalarWhereWithAggregatesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ProjectScalarWhereWithAggregatesInput>>('ProjectScalarWhereWithAggregatesInput').implement({
  fields: ProjectScalarWhereWithAggregatesInputFields,
});

export const PostWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[PostWhereInput]}),
  OR: t.field({"required":false,"type":[PostWhereInput]}),
  NOT: t.field({"required":false,"type":[PostWhereInput]}),
  id: t.field({"required":false,"type":StringFilter}),
  createdAt: t.field({"required":false,"type":DateTimeFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeFilter}),
  title: t.field({"required":false,"type":StringFilter}),
  description: t.field({"required":false,"type":StringFilter}),
  authorId: t.field({"required":false,"type":StringFilter}),
  projectId: t.field({"required":false,"type":StringFilter}),
  author: t.field({"required":false,"type":UserWhereInput}),
  project: t.field({"required":false,"type":ProjectWhereInput}),
  upvotes: t.field({"required":false,"type":UpvoteListRelationFilter}),
});
export const PostWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostWhereInput>>('PostWhereInput').implement({
  fields: PostWhereInputFields,
});

export const PostOrderByWithRelationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  title: t.field({"required":false,"type":SortOrder}),
  description: t.field({"required":false,"type":SortOrder}),
  authorId: t.field({"required":false,"type":SortOrder}),
  projectId: t.field({"required":false,"type":SortOrder}),
  author: t.field({"required":false,"type":UserOrderByWithRelationInput}),
  project: t.field({"required":false,"type":ProjectOrderByWithRelationInput}),
  upvotes: t.field({"required":false,"type":UpvoteOrderByRelationAggregateInput}),
});
export const PostOrderByWithRelationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostOrderByWithRelationInput>>('PostOrderByWithRelationInput').implement({
  fields: PostOrderByWithRelationInputFields,
});

export const PostWhereUniqueInputFields = (t: any) => ({
  id: t.string({"required":false}),
});
export const PostWhereUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostWhereUniqueInput>>('PostWhereUniqueInput').implement({
  fields: PostWhereUniqueInputFields,
});

export const PostOrderByWithAggregationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  title: t.field({"required":false,"type":SortOrder}),
  description: t.field({"required":false,"type":SortOrder}),
  authorId: t.field({"required":false,"type":SortOrder}),
  projectId: t.field({"required":false,"type":SortOrder}),
  _count: t.field({"required":false,"type":PostCountOrderByAggregateInput}),
  _max: t.field({"required":false,"type":PostMaxOrderByAggregateInput}),
  _min: t.field({"required":false,"type":PostMinOrderByAggregateInput}),
});
export const PostOrderByWithAggregationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostOrderByWithAggregationInput>>('PostOrderByWithAggregationInput').implement({
  fields: PostOrderByWithAggregationInputFields,
});

export const PostScalarWhereWithAggregatesInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[PostScalarWhereWithAggregatesInput]}),
  OR: t.field({"required":false,"type":[PostScalarWhereWithAggregatesInput]}),
  NOT: t.field({"required":false,"type":[PostScalarWhereWithAggregatesInput]}),
  id: t.field({"required":false,"type":StringWithAggregatesFilter}),
  createdAt: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
  title: t.field({"required":false,"type":StringWithAggregatesFilter}),
  description: t.field({"required":false,"type":StringWithAggregatesFilter}),
  authorId: t.field({"required":false,"type":StringWithAggregatesFilter}),
  projectId: t.field({"required":false,"type":StringWithAggregatesFilter}),
});
export const PostScalarWhereWithAggregatesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostScalarWhereWithAggregatesInput>>('PostScalarWhereWithAggregatesInput').implement({
  fields: PostScalarWhereWithAggregatesInputFields,
});

export const UpvoteWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[UpvoteWhereInput]}),
  OR: t.field({"required":false,"type":[UpvoteWhereInput]}),
  NOT: t.field({"required":false,"type":[UpvoteWhereInput]}),
  id: t.field({"required":false,"type":StringFilter}),
  createdAt: t.field({"required":false,"type":DateTimeFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeFilter}),
  postId: t.field({"required":false,"type":StringFilter}),
  userId: t.field({"required":false,"type":StringFilter}),
  post: t.field({"required":false,"type":PostWhereInput}),
  user: t.field({"required":false,"type":UserWhereInput}),
});
export const UpvoteWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UpvoteWhereInput>>('UpvoteWhereInput').implement({
  fields: UpvoteWhereInputFields,
});

export const UpvoteOrderByWithRelationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  postId: t.field({"required":false,"type":SortOrder}),
  userId: t.field({"required":false,"type":SortOrder}),
  post: t.field({"required":false,"type":PostOrderByWithRelationInput}),
  user: t.field({"required":false,"type":UserOrderByWithRelationInput}),
});
export const UpvoteOrderByWithRelationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UpvoteOrderByWithRelationInput>>('UpvoteOrderByWithRelationInput').implement({
  fields: UpvoteOrderByWithRelationInputFields,
});

export const UpvoteWhereUniqueInputFields = (t: any) => ({
  id: t.string({"required":false}),
});
export const UpvoteWhereUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UpvoteWhereUniqueInput>>('UpvoteWhereUniqueInput').implement({
  fields: UpvoteWhereUniqueInputFields,
});

export const UpvoteOrderByWithAggregationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  postId: t.field({"required":false,"type":SortOrder}),
  userId: t.field({"required":false,"type":SortOrder}),
  _count: t.field({"required":false,"type":UpvoteCountOrderByAggregateInput}),
  _max: t.field({"required":false,"type":UpvoteMaxOrderByAggregateInput}),
  _min: t.field({"required":false,"type":UpvoteMinOrderByAggregateInput}),
});
export const UpvoteOrderByWithAggregationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UpvoteOrderByWithAggregationInput>>('UpvoteOrderByWithAggregationInput').implement({
  fields: UpvoteOrderByWithAggregationInputFields,
});

export const UpvoteScalarWhereWithAggregatesInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[UpvoteScalarWhereWithAggregatesInput]}),
  OR: t.field({"required":false,"type":[UpvoteScalarWhereWithAggregatesInput]}),
  NOT: t.field({"required":false,"type":[UpvoteScalarWhereWithAggregatesInput]}),
  id: t.field({"required":false,"type":StringWithAggregatesFilter}),
  createdAt: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
  postId: t.field({"required":false,"type":StringWithAggregatesFilter}),
  userId: t.field({"required":false,"type":StringWithAggregatesFilter}),
});
export const UpvoteScalarWhereWithAggregatesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UpvoteScalarWhereWithAggregatesInput>>('UpvoteScalarWhereWithAggregatesInput').implement({
  fields: UpvoteScalarWhereWithAggregatesInputFields,
});

export const UserCreateInputFields = (t: any) => ({
  id: t.string({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  walletAddress: t.string({"required":true}),
  Upvote: t.field({"required":false,"type":UpvoteCreateNestedManyWithoutUserInput}),
  Post: t.field({"required":false,"type":PostCreateNestedManyWithoutAuthorInput}),
});
export const UserCreateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserCreateInput>>('UserCreateInput').implement({
  fields: UserCreateInputFields,
});

export const UserUpdateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  walletAddress: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  Upvote: t.field({"required":false,"type":UpvoteUpdateManyWithoutUserNestedInput}),
  Post: t.field({"required":false,"type":PostUpdateManyWithoutAuthorNestedInput}),
});
export const UserUpdateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserUpdateInput>>('UserUpdateInput').implement({
  fields: UserUpdateInputFields,
});

export const UserCreateManyInputFields = (t: any) => ({
  id: t.string({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  walletAddress: t.string({"required":true}),
});
export const UserCreateManyInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserCreateManyInput>>('UserCreateManyInput').implement({
  fields: UserCreateManyInputFields,
});

export const UserUpdateManyMutationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  walletAddress: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
});
export const UserUpdateManyMutationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserUpdateManyMutationInput>>('UserUpdateManyMutationInput').implement({
  fields: UserUpdateManyMutationInputFields,
});

export const OrganizationCreateInputFields = (t: any) => ({
  id: t.string({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  name: t.string({"required":true}),
  slug: t.string({"required":true}),
  projects: t.field({"required":false,"type":ProjectCreateNestedManyWithoutOrganizationInput}),
});
export const OrganizationCreateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.OrganizationCreateInput>>('OrganizationCreateInput').implement({
  fields: OrganizationCreateInputFields,
});

export const OrganizationUpdateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  name: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  slug: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  projects: t.field({"required":false,"type":ProjectUpdateManyWithoutOrganizationNestedInput}),
});
export const OrganizationUpdateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.OrganizationUpdateInput>>('OrganizationUpdateInput').implement({
  fields: OrganizationUpdateInputFields,
});

export const OrganizationCreateManyInputFields = (t: any) => ({
  id: t.string({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  name: t.string({"required":true}),
  slug: t.string({"required":true}),
});
export const OrganizationCreateManyInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.OrganizationCreateManyInput>>('OrganizationCreateManyInput').implement({
  fields: OrganizationCreateManyInputFields,
});

export const OrganizationUpdateManyMutationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  name: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  slug: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
});
export const OrganizationUpdateManyMutationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.OrganizationUpdateManyMutationInput>>('OrganizationUpdateManyMutationInput').implement({
  fields: OrganizationUpdateManyMutationInputFields,
});

export const ProjectCreateInputFields = (t: any) => ({
  id: t.string({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  name: t.string({"required":true}),
  slug: t.string({"required":true}),
  image: t.string({"required":false}),
  description: t.string({"required":false}),
  organization: t.field({"required":true,"type":OrganizationCreateNestedOneWithoutProjectsInput}),
  posts: t.field({"required":false,"type":PostCreateNestedManyWithoutProjectInput}),
});
export const ProjectCreateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ProjectCreateInput>>('ProjectCreateInput').implement({
  fields: ProjectCreateInputFields,
});

export const ProjectUpdateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  name: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  slug: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  image: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  description: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  organization: t.field({"required":false,"type":OrganizationUpdateOneRequiredWithoutProjectsNestedInput}),
  posts: t.field({"required":false,"type":PostUpdateManyWithoutProjectNestedInput}),
});
export const ProjectUpdateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ProjectUpdateInput>>('ProjectUpdateInput').implement({
  fields: ProjectUpdateInputFields,
});

export const ProjectCreateManyInputFields = (t: any) => ({
  id: t.string({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  name: t.string({"required":true}),
  slug: t.string({"required":true}),
  image: t.string({"required":false}),
  description: t.string({"required":false}),
  organizationId: t.string({"required":true}),
});
export const ProjectCreateManyInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ProjectCreateManyInput>>('ProjectCreateManyInput').implement({
  fields: ProjectCreateManyInputFields,
});

export const ProjectUpdateManyMutationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  name: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  slug: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  image: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  description: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
});
export const ProjectUpdateManyMutationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ProjectUpdateManyMutationInput>>('ProjectUpdateManyMutationInput').implement({
  fields: ProjectUpdateManyMutationInputFields,
});

export const PostCreateInputFields = (t: any) => ({
  id: t.string({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  title: t.string({"required":true}),
  description: t.string({"required":true}),
  author: t.field({"required":true,"type":UserCreateNestedOneWithoutPostInput}),
  project: t.field({"required":true,"type":ProjectCreateNestedOneWithoutPostsInput}),
  upvotes: t.field({"required":false,"type":UpvoteCreateNestedManyWithoutPostInput}),
});
export const PostCreateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostCreateInput>>('PostCreateInput').implement({
  fields: PostCreateInputFields,
});

export const PostUpdateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  title: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  description: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  author: t.field({"required":false,"type":UserUpdateOneRequiredWithoutPostNestedInput}),
  project: t.field({"required":false,"type":ProjectUpdateOneRequiredWithoutPostsNestedInput}),
  upvotes: t.field({"required":false,"type":UpvoteUpdateManyWithoutPostNestedInput}),
});
export const PostUpdateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostUpdateInput>>('PostUpdateInput').implement({
  fields: PostUpdateInputFields,
});

export const PostCreateManyInputFields = (t: any) => ({
  id: t.string({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  title: t.string({"required":true}),
  description: t.string({"required":true}),
  authorId: t.string({"required":true}),
  projectId: t.string({"required":true}),
});
export const PostCreateManyInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostCreateManyInput>>('PostCreateManyInput').implement({
  fields: PostCreateManyInputFields,
});

export const PostUpdateManyMutationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  title: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  description: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
});
export const PostUpdateManyMutationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostUpdateManyMutationInput>>('PostUpdateManyMutationInput').implement({
  fields: PostUpdateManyMutationInputFields,
});

export const UpvoteCreateInputFields = (t: any) => ({
  id: t.string({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  post: t.field({"required":true,"type":PostCreateNestedOneWithoutUpvotesInput}),
  user: t.field({"required":true,"type":UserCreateNestedOneWithoutUpvoteInput}),
});
export const UpvoteCreateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UpvoteCreateInput>>('UpvoteCreateInput').implement({
  fields: UpvoteCreateInputFields,
});

export const UpvoteUpdateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  post: t.field({"required":false,"type":PostUpdateOneRequiredWithoutUpvotesNestedInput}),
  user: t.field({"required":false,"type":UserUpdateOneRequiredWithoutUpvoteNestedInput}),
});
export const UpvoteUpdateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UpvoteUpdateInput>>('UpvoteUpdateInput').implement({
  fields: UpvoteUpdateInputFields,
});

export const UpvoteCreateManyInputFields = (t: any) => ({
  id: t.string({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  postId: t.string({"required":true}),
  userId: t.string({"required":true}),
});
export const UpvoteCreateManyInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UpvoteCreateManyInput>>('UpvoteCreateManyInput').implement({
  fields: UpvoteCreateManyInputFields,
});

export const UpvoteUpdateManyMutationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
});
export const UpvoteUpdateManyMutationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UpvoteUpdateManyMutationInput>>('UpvoteUpdateManyMutationInput').implement({
  fields: UpvoteUpdateManyMutationInputFields,
});

export const StringFilterFields = (t: any) => ({
  equals: t.string({"required":false}),
  in: t.stringList({"required":false}),
  notIn: t.stringList({"required":false}),
  lt: t.string({"required":false}),
  lte: t.string({"required":false}),
  gt: t.string({"required":false}),
  gte: t.string({"required":false}),
  contains: t.string({"required":false}),
  startsWith: t.string({"required":false}),
  endsWith: t.string({"required":false}),
  mode: t.field({"required":false,"type":QueryMode}),
  not: t.field({"required":false,"type":NestedStringFilter}),
});
export const StringFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.StringFilter>>('StringFilter').implement({
  fields: StringFilterFields,
});

export const DateTimeFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":DateTime}),
  in: t.field({"required":false,"type":[DateTime]}),
  notIn: t.field({"required":false,"type":[DateTime]}),
  lt: t.field({"required":false,"type":DateTime}),
  lte: t.field({"required":false,"type":DateTime}),
  gt: t.field({"required":false,"type":DateTime}),
  gte: t.field({"required":false,"type":DateTime}),
  not: t.field({"required":false,"type":NestedDateTimeFilter}),
});
export const DateTimeFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.DateTimeFilter>>('DateTimeFilter').implement({
  fields: DateTimeFilterFields,
});

export const UpvoteListRelationFilterFields = (t: any) => ({
  every: t.field({"required":false,"type":UpvoteWhereInput}),
  some: t.field({"required":false,"type":UpvoteWhereInput}),
  none: t.field({"required":false,"type":UpvoteWhereInput}),
});
export const UpvoteListRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UpvoteListRelationFilter>>('UpvoteListRelationFilter').implement({
  fields: UpvoteListRelationFilterFields,
});

export const PostListRelationFilterFields = (t: any) => ({
  every: t.field({"required":false,"type":PostWhereInput}),
  some: t.field({"required":false,"type":PostWhereInput}),
  none: t.field({"required":false,"type":PostWhereInput}),
});
export const PostListRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostListRelationFilter>>('PostListRelationFilter').implement({
  fields: PostListRelationFilterFields,
});

export const UpvoteOrderByRelationAggregateInputFields = (t: any) => ({
  _count: t.field({"required":false,"type":SortOrder}),
});
export const UpvoteOrderByRelationAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UpvoteOrderByRelationAggregateInput>>('UpvoteOrderByRelationAggregateInput').implement({
  fields: UpvoteOrderByRelationAggregateInputFields,
});

export const PostOrderByRelationAggregateInputFields = (t: any) => ({
  _count: t.field({"required":false,"type":SortOrder}),
});
export const PostOrderByRelationAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostOrderByRelationAggregateInput>>('PostOrderByRelationAggregateInput').implement({
  fields: PostOrderByRelationAggregateInputFields,
});

export const UserCountOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  walletAddress: t.field({"required":false,"type":SortOrder}),
});
export const UserCountOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserCountOrderByAggregateInput>>('UserCountOrderByAggregateInput').implement({
  fields: UserCountOrderByAggregateInputFields,
});

export const UserMaxOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  walletAddress: t.field({"required":false,"type":SortOrder}),
});
export const UserMaxOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserMaxOrderByAggregateInput>>('UserMaxOrderByAggregateInput').implement({
  fields: UserMaxOrderByAggregateInputFields,
});

export const UserMinOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  walletAddress: t.field({"required":false,"type":SortOrder}),
});
export const UserMinOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserMinOrderByAggregateInput>>('UserMinOrderByAggregateInput').implement({
  fields: UserMinOrderByAggregateInputFields,
});

export const StringWithAggregatesFilterFields = (t: any) => ({
  equals: t.string({"required":false}),
  in: t.stringList({"required":false}),
  notIn: t.stringList({"required":false}),
  lt: t.string({"required":false}),
  lte: t.string({"required":false}),
  gt: t.string({"required":false}),
  gte: t.string({"required":false}),
  contains: t.string({"required":false}),
  startsWith: t.string({"required":false}),
  endsWith: t.string({"required":false}),
  mode: t.field({"required":false,"type":QueryMode}),
  not: t.field({"required":false,"type":NestedStringWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedStringFilter}),
  _max: t.field({"required":false,"type":NestedStringFilter}),
});
export const StringWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.StringWithAggregatesFilter>>('StringWithAggregatesFilter').implement({
  fields: StringWithAggregatesFilterFields,
});

export const DateTimeWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":DateTime}),
  in: t.field({"required":false,"type":[DateTime]}),
  notIn: t.field({"required":false,"type":[DateTime]}),
  lt: t.field({"required":false,"type":DateTime}),
  lte: t.field({"required":false,"type":DateTime}),
  gt: t.field({"required":false,"type":DateTime}),
  gte: t.field({"required":false,"type":DateTime}),
  not: t.field({"required":false,"type":NestedDateTimeWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedDateTimeFilter}),
  _max: t.field({"required":false,"type":NestedDateTimeFilter}),
});
export const DateTimeWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.DateTimeWithAggregatesFilter>>('DateTimeWithAggregatesFilter').implement({
  fields: DateTimeWithAggregatesFilterFields,
});

export const ProjectListRelationFilterFields = (t: any) => ({
  every: t.field({"required":false,"type":ProjectWhereInput}),
  some: t.field({"required":false,"type":ProjectWhereInput}),
  none: t.field({"required":false,"type":ProjectWhereInput}),
});
export const ProjectListRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ProjectListRelationFilter>>('ProjectListRelationFilter').implement({
  fields: ProjectListRelationFilterFields,
});

export const ProjectOrderByRelationAggregateInputFields = (t: any) => ({
  _count: t.field({"required":false,"type":SortOrder}),
});
export const ProjectOrderByRelationAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ProjectOrderByRelationAggregateInput>>('ProjectOrderByRelationAggregateInput').implement({
  fields: ProjectOrderByRelationAggregateInputFields,
});

export const OrganizationCountOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  name: t.field({"required":false,"type":SortOrder}),
  slug: t.field({"required":false,"type":SortOrder}),
});
export const OrganizationCountOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.OrganizationCountOrderByAggregateInput>>('OrganizationCountOrderByAggregateInput').implement({
  fields: OrganizationCountOrderByAggregateInputFields,
});

export const OrganizationMaxOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  name: t.field({"required":false,"type":SortOrder}),
  slug: t.field({"required":false,"type":SortOrder}),
});
export const OrganizationMaxOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.OrganizationMaxOrderByAggregateInput>>('OrganizationMaxOrderByAggregateInput').implement({
  fields: OrganizationMaxOrderByAggregateInputFields,
});

export const OrganizationMinOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  name: t.field({"required":false,"type":SortOrder}),
  slug: t.field({"required":false,"type":SortOrder}),
});
export const OrganizationMinOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.OrganizationMinOrderByAggregateInput>>('OrganizationMinOrderByAggregateInput').implement({
  fields: OrganizationMinOrderByAggregateInputFields,
});

export const StringNullableFilterFields = (t: any) => ({
  equals: t.string({"required":false}),
  in: t.stringList({"required":false}),
  notIn: t.stringList({"required":false}),
  lt: t.string({"required":false}),
  lte: t.string({"required":false}),
  gt: t.string({"required":false}),
  gte: t.string({"required":false}),
  contains: t.string({"required":false}),
  startsWith: t.string({"required":false}),
  endsWith: t.string({"required":false}),
  mode: t.field({"required":false,"type":QueryMode}),
  not: t.field({"required":false,"type":NestedStringNullableFilter}),
});
export const StringNullableFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.StringNullableFilter>>('StringNullableFilter').implement({
  fields: StringNullableFilterFields,
});

export const OrganizationRelationFilterFields = (t: any) => ({
  is: t.field({"required":false,"type":OrganizationWhereInput}),
  isNot: t.field({"required":false,"type":OrganizationWhereInput}),
});
export const OrganizationRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.OrganizationRelationFilter>>('OrganizationRelationFilter').implement({
  fields: OrganizationRelationFilterFields,
});

export const ProjectCountOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  name: t.field({"required":false,"type":SortOrder}),
  slug: t.field({"required":false,"type":SortOrder}),
  image: t.field({"required":false,"type":SortOrder}),
  description: t.field({"required":false,"type":SortOrder}),
  organizationId: t.field({"required":false,"type":SortOrder}),
});
export const ProjectCountOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ProjectCountOrderByAggregateInput>>('ProjectCountOrderByAggregateInput').implement({
  fields: ProjectCountOrderByAggregateInputFields,
});

export const ProjectMaxOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  name: t.field({"required":false,"type":SortOrder}),
  slug: t.field({"required":false,"type":SortOrder}),
  image: t.field({"required":false,"type":SortOrder}),
  description: t.field({"required":false,"type":SortOrder}),
  organizationId: t.field({"required":false,"type":SortOrder}),
});
export const ProjectMaxOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ProjectMaxOrderByAggregateInput>>('ProjectMaxOrderByAggregateInput').implement({
  fields: ProjectMaxOrderByAggregateInputFields,
});

export const ProjectMinOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  name: t.field({"required":false,"type":SortOrder}),
  slug: t.field({"required":false,"type":SortOrder}),
  image: t.field({"required":false,"type":SortOrder}),
  description: t.field({"required":false,"type":SortOrder}),
  organizationId: t.field({"required":false,"type":SortOrder}),
});
export const ProjectMinOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ProjectMinOrderByAggregateInput>>('ProjectMinOrderByAggregateInput').implement({
  fields: ProjectMinOrderByAggregateInputFields,
});

export const StringNullableWithAggregatesFilterFields = (t: any) => ({
  equals: t.string({"required":false}),
  in: t.stringList({"required":false}),
  notIn: t.stringList({"required":false}),
  lt: t.string({"required":false}),
  lte: t.string({"required":false}),
  gt: t.string({"required":false}),
  gte: t.string({"required":false}),
  contains: t.string({"required":false}),
  startsWith: t.string({"required":false}),
  endsWith: t.string({"required":false}),
  mode: t.field({"required":false,"type":QueryMode}),
  not: t.field({"required":false,"type":NestedStringNullableWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntNullableFilter}),
  _min: t.field({"required":false,"type":NestedStringNullableFilter}),
  _max: t.field({"required":false,"type":NestedStringNullableFilter}),
});
export const StringNullableWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.StringNullableWithAggregatesFilter>>('StringNullableWithAggregatesFilter').implement({
  fields: StringNullableWithAggregatesFilterFields,
});

export const UserRelationFilterFields = (t: any) => ({
  is: t.field({"required":false,"type":UserWhereInput}),
  isNot: t.field({"required":false,"type":UserWhereInput}),
});
export const UserRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserRelationFilter>>('UserRelationFilter').implement({
  fields: UserRelationFilterFields,
});

export const ProjectRelationFilterFields = (t: any) => ({
  is: t.field({"required":false,"type":ProjectWhereInput}),
  isNot: t.field({"required":false,"type":ProjectWhereInput}),
});
export const ProjectRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ProjectRelationFilter>>('ProjectRelationFilter').implement({
  fields: ProjectRelationFilterFields,
});

export const PostCountOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  title: t.field({"required":false,"type":SortOrder}),
  description: t.field({"required":false,"type":SortOrder}),
  authorId: t.field({"required":false,"type":SortOrder}),
  projectId: t.field({"required":false,"type":SortOrder}),
});
export const PostCountOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostCountOrderByAggregateInput>>('PostCountOrderByAggregateInput').implement({
  fields: PostCountOrderByAggregateInputFields,
});

export const PostMaxOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  title: t.field({"required":false,"type":SortOrder}),
  description: t.field({"required":false,"type":SortOrder}),
  authorId: t.field({"required":false,"type":SortOrder}),
  projectId: t.field({"required":false,"type":SortOrder}),
});
export const PostMaxOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostMaxOrderByAggregateInput>>('PostMaxOrderByAggregateInput').implement({
  fields: PostMaxOrderByAggregateInputFields,
});

export const PostMinOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  title: t.field({"required":false,"type":SortOrder}),
  description: t.field({"required":false,"type":SortOrder}),
  authorId: t.field({"required":false,"type":SortOrder}),
  projectId: t.field({"required":false,"type":SortOrder}),
});
export const PostMinOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostMinOrderByAggregateInput>>('PostMinOrderByAggregateInput').implement({
  fields: PostMinOrderByAggregateInputFields,
});

export const PostRelationFilterFields = (t: any) => ({
  is: t.field({"required":false,"type":PostWhereInput}),
  isNot: t.field({"required":false,"type":PostWhereInput}),
});
export const PostRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostRelationFilter>>('PostRelationFilter').implement({
  fields: PostRelationFilterFields,
});

export const UpvoteCountOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  postId: t.field({"required":false,"type":SortOrder}),
  userId: t.field({"required":false,"type":SortOrder}),
});
export const UpvoteCountOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UpvoteCountOrderByAggregateInput>>('UpvoteCountOrderByAggregateInput').implement({
  fields: UpvoteCountOrderByAggregateInputFields,
});

export const UpvoteMaxOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  postId: t.field({"required":false,"type":SortOrder}),
  userId: t.field({"required":false,"type":SortOrder}),
});
export const UpvoteMaxOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UpvoteMaxOrderByAggregateInput>>('UpvoteMaxOrderByAggregateInput').implement({
  fields: UpvoteMaxOrderByAggregateInputFields,
});

export const UpvoteMinOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  createdAt: t.field({"required":false,"type":SortOrder}),
  updatedAt: t.field({"required":false,"type":SortOrder}),
  postId: t.field({"required":false,"type":SortOrder}),
  userId: t.field({"required":false,"type":SortOrder}),
});
export const UpvoteMinOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UpvoteMinOrderByAggregateInput>>('UpvoteMinOrderByAggregateInput').implement({
  fields: UpvoteMinOrderByAggregateInputFields,
});

export const UpvoteCreateNestedManyWithoutUserInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[UpvoteCreateWithoutUserInput]}),
  connectOrCreate: t.field({"required":false,"type":[UpvoteCreateOrConnectWithoutUserInput]}),
  createMany: t.field({"required":false,"type":UpvoteCreateManyUserInputEnvelope}),
  connect: t.field({"required":false,"type":[UpvoteWhereUniqueInput]}),
});
export const UpvoteCreateNestedManyWithoutUserInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UpvoteCreateNestedManyWithoutUserInput>>('UpvoteCreateNestedManyWithoutUserInput').implement({
  fields: UpvoteCreateNestedManyWithoutUserInputFields,
});

export const PostCreateNestedManyWithoutAuthorInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[PostCreateWithoutAuthorInput]}),
  connectOrCreate: t.field({"required":false,"type":[PostCreateOrConnectWithoutAuthorInput]}),
  createMany: t.field({"required":false,"type":PostCreateManyAuthorInputEnvelope}),
  connect: t.field({"required":false,"type":[PostWhereUniqueInput]}),
});
export const PostCreateNestedManyWithoutAuthorInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostCreateNestedManyWithoutAuthorInput>>('PostCreateNestedManyWithoutAuthorInput').implement({
  fields: PostCreateNestedManyWithoutAuthorInputFields,
});

export const StringFieldUpdateOperationsInputFields = (t: any) => ({
  set: t.string({"required":false}),
});
export const StringFieldUpdateOperationsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.StringFieldUpdateOperationsInput>>('StringFieldUpdateOperationsInput').implement({
  fields: StringFieldUpdateOperationsInputFields,
});

export const DateTimeFieldUpdateOperationsInputFields = (t: any) => ({
  set: t.field({"required":false,"type":DateTime}),
});
export const DateTimeFieldUpdateOperationsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.DateTimeFieldUpdateOperationsInput>>('DateTimeFieldUpdateOperationsInput').implement({
  fields: DateTimeFieldUpdateOperationsInputFields,
});

export const UpvoteUpdateManyWithoutUserNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[UpvoteCreateWithoutUserInput]}),
  connectOrCreate: t.field({"required":false,"type":[UpvoteCreateOrConnectWithoutUserInput]}),
  upsert: t.field({"required":false,"type":[UpvoteUpsertWithWhereUniqueWithoutUserInput]}),
  createMany: t.field({"required":false,"type":UpvoteCreateManyUserInputEnvelope}),
  set: t.field({"required":false,"type":[UpvoteWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[UpvoteWhereUniqueInput]}),
  delete: t.field({"required":false,"type":[UpvoteWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[UpvoteWhereUniqueInput]}),
  update: t.field({"required":false,"type":[UpvoteUpdateWithWhereUniqueWithoutUserInput]}),
  updateMany: t.field({"required":false,"type":[UpvoteUpdateManyWithWhereWithoutUserInput]}),
  deleteMany: t.field({"required":false,"type":[UpvoteScalarWhereInput]}),
});
export const UpvoteUpdateManyWithoutUserNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UpvoteUpdateManyWithoutUserNestedInput>>('UpvoteUpdateManyWithoutUserNestedInput').implement({
  fields: UpvoteUpdateManyWithoutUserNestedInputFields,
});

export const PostUpdateManyWithoutAuthorNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[PostCreateWithoutAuthorInput]}),
  connectOrCreate: t.field({"required":false,"type":[PostCreateOrConnectWithoutAuthorInput]}),
  upsert: t.field({"required":false,"type":[PostUpsertWithWhereUniqueWithoutAuthorInput]}),
  createMany: t.field({"required":false,"type":PostCreateManyAuthorInputEnvelope}),
  set: t.field({"required":false,"type":[PostWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[PostWhereUniqueInput]}),
  delete: t.field({"required":false,"type":[PostWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[PostWhereUniqueInput]}),
  update: t.field({"required":false,"type":[PostUpdateWithWhereUniqueWithoutAuthorInput]}),
  updateMany: t.field({"required":false,"type":[PostUpdateManyWithWhereWithoutAuthorInput]}),
  deleteMany: t.field({"required":false,"type":[PostScalarWhereInput]}),
});
export const PostUpdateManyWithoutAuthorNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostUpdateManyWithoutAuthorNestedInput>>('PostUpdateManyWithoutAuthorNestedInput').implement({
  fields: PostUpdateManyWithoutAuthorNestedInputFields,
});

export const ProjectCreateNestedManyWithoutOrganizationInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[ProjectCreateWithoutOrganizationInput]}),
  connectOrCreate: t.field({"required":false,"type":[ProjectCreateOrConnectWithoutOrganizationInput]}),
  createMany: t.field({"required":false,"type":ProjectCreateManyOrganizationInputEnvelope}),
  connect: t.field({"required":false,"type":[ProjectWhereUniqueInput]}),
});
export const ProjectCreateNestedManyWithoutOrganizationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ProjectCreateNestedManyWithoutOrganizationInput>>('ProjectCreateNestedManyWithoutOrganizationInput').implement({
  fields: ProjectCreateNestedManyWithoutOrganizationInputFields,
});

export const ProjectUpdateManyWithoutOrganizationNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[ProjectCreateWithoutOrganizationInput]}),
  connectOrCreate: t.field({"required":false,"type":[ProjectCreateOrConnectWithoutOrganizationInput]}),
  upsert: t.field({"required":false,"type":[ProjectUpsertWithWhereUniqueWithoutOrganizationInput]}),
  createMany: t.field({"required":false,"type":ProjectCreateManyOrganizationInputEnvelope}),
  set: t.field({"required":false,"type":[ProjectWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[ProjectWhereUniqueInput]}),
  delete: t.field({"required":false,"type":[ProjectWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[ProjectWhereUniqueInput]}),
  update: t.field({"required":false,"type":[ProjectUpdateWithWhereUniqueWithoutOrganizationInput]}),
  updateMany: t.field({"required":false,"type":[ProjectUpdateManyWithWhereWithoutOrganizationInput]}),
  deleteMany: t.field({"required":false,"type":[ProjectScalarWhereInput]}),
});
export const ProjectUpdateManyWithoutOrganizationNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ProjectUpdateManyWithoutOrganizationNestedInput>>('ProjectUpdateManyWithoutOrganizationNestedInput').implement({
  fields: ProjectUpdateManyWithoutOrganizationNestedInputFields,
});

export const OrganizationCreateNestedOneWithoutProjectsInputFields = (t: any) => ({
  create: t.field({"required":false,"type":OrganizationCreateWithoutProjectsInput}),
  connectOrCreate: t.field({"required":false,"type":OrganizationCreateOrConnectWithoutProjectsInput}),
  connect: t.field({"required":false,"type":OrganizationWhereUniqueInput}),
});
export const OrganizationCreateNestedOneWithoutProjectsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.OrganizationCreateNestedOneWithoutProjectsInput>>('OrganizationCreateNestedOneWithoutProjectsInput').implement({
  fields: OrganizationCreateNestedOneWithoutProjectsInputFields,
});

export const PostCreateNestedManyWithoutProjectInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[PostCreateWithoutProjectInput]}),
  connectOrCreate: t.field({"required":false,"type":[PostCreateOrConnectWithoutProjectInput]}),
  createMany: t.field({"required":false,"type":PostCreateManyProjectInputEnvelope}),
  connect: t.field({"required":false,"type":[PostWhereUniqueInput]}),
});
export const PostCreateNestedManyWithoutProjectInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostCreateNestedManyWithoutProjectInput>>('PostCreateNestedManyWithoutProjectInput').implement({
  fields: PostCreateNestedManyWithoutProjectInputFields,
});

export const NullableStringFieldUpdateOperationsInputFields = (t: any) => ({
  set: t.string({"required":false}),
});
export const NullableStringFieldUpdateOperationsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NullableStringFieldUpdateOperationsInput>>('NullableStringFieldUpdateOperationsInput').implement({
  fields: NullableStringFieldUpdateOperationsInputFields,
});

export const OrganizationUpdateOneRequiredWithoutProjectsNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":OrganizationCreateWithoutProjectsInput}),
  connectOrCreate: t.field({"required":false,"type":OrganizationCreateOrConnectWithoutProjectsInput}),
  upsert: t.field({"required":false,"type":OrganizationUpsertWithoutProjectsInput}),
  connect: t.field({"required":false,"type":OrganizationWhereUniqueInput}),
  update: t.field({"required":false,"type":OrganizationUpdateWithoutProjectsInput}),
});
export const OrganizationUpdateOneRequiredWithoutProjectsNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.OrganizationUpdateOneRequiredWithoutProjectsNestedInput>>('OrganizationUpdateOneRequiredWithoutProjectsNestedInput').implement({
  fields: OrganizationUpdateOneRequiredWithoutProjectsNestedInputFields,
});

export const PostUpdateManyWithoutProjectNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[PostCreateWithoutProjectInput]}),
  connectOrCreate: t.field({"required":false,"type":[PostCreateOrConnectWithoutProjectInput]}),
  upsert: t.field({"required":false,"type":[PostUpsertWithWhereUniqueWithoutProjectInput]}),
  createMany: t.field({"required":false,"type":PostCreateManyProjectInputEnvelope}),
  set: t.field({"required":false,"type":[PostWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[PostWhereUniqueInput]}),
  delete: t.field({"required":false,"type":[PostWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[PostWhereUniqueInput]}),
  update: t.field({"required":false,"type":[PostUpdateWithWhereUniqueWithoutProjectInput]}),
  updateMany: t.field({"required":false,"type":[PostUpdateManyWithWhereWithoutProjectInput]}),
  deleteMany: t.field({"required":false,"type":[PostScalarWhereInput]}),
});
export const PostUpdateManyWithoutProjectNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostUpdateManyWithoutProjectNestedInput>>('PostUpdateManyWithoutProjectNestedInput').implement({
  fields: PostUpdateManyWithoutProjectNestedInputFields,
});

export const UserCreateNestedOneWithoutPostInputFields = (t: any) => ({
  create: t.field({"required":false,"type":UserCreateWithoutPostInput}),
  connectOrCreate: t.field({"required":false,"type":UserCreateOrConnectWithoutPostInput}),
  connect: t.field({"required":false,"type":UserWhereUniqueInput}),
});
export const UserCreateNestedOneWithoutPostInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserCreateNestedOneWithoutPostInput>>('UserCreateNestedOneWithoutPostInput').implement({
  fields: UserCreateNestedOneWithoutPostInputFields,
});

export const ProjectCreateNestedOneWithoutPostsInputFields = (t: any) => ({
  create: t.field({"required":false,"type":ProjectCreateWithoutPostsInput}),
  connectOrCreate: t.field({"required":false,"type":ProjectCreateOrConnectWithoutPostsInput}),
  connect: t.field({"required":false,"type":ProjectWhereUniqueInput}),
});
export const ProjectCreateNestedOneWithoutPostsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ProjectCreateNestedOneWithoutPostsInput>>('ProjectCreateNestedOneWithoutPostsInput').implement({
  fields: ProjectCreateNestedOneWithoutPostsInputFields,
});

export const UpvoteCreateNestedManyWithoutPostInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[UpvoteCreateWithoutPostInput]}),
  connectOrCreate: t.field({"required":false,"type":[UpvoteCreateOrConnectWithoutPostInput]}),
  createMany: t.field({"required":false,"type":UpvoteCreateManyPostInputEnvelope}),
  connect: t.field({"required":false,"type":[UpvoteWhereUniqueInput]}),
});
export const UpvoteCreateNestedManyWithoutPostInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UpvoteCreateNestedManyWithoutPostInput>>('UpvoteCreateNestedManyWithoutPostInput').implement({
  fields: UpvoteCreateNestedManyWithoutPostInputFields,
});

export const UserUpdateOneRequiredWithoutPostNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":UserCreateWithoutPostInput}),
  connectOrCreate: t.field({"required":false,"type":UserCreateOrConnectWithoutPostInput}),
  upsert: t.field({"required":false,"type":UserUpsertWithoutPostInput}),
  connect: t.field({"required":false,"type":UserWhereUniqueInput}),
  update: t.field({"required":false,"type":UserUpdateWithoutPostInput}),
});
export const UserUpdateOneRequiredWithoutPostNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserUpdateOneRequiredWithoutPostNestedInput>>('UserUpdateOneRequiredWithoutPostNestedInput').implement({
  fields: UserUpdateOneRequiredWithoutPostNestedInputFields,
});

export const ProjectUpdateOneRequiredWithoutPostsNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":ProjectCreateWithoutPostsInput}),
  connectOrCreate: t.field({"required":false,"type":ProjectCreateOrConnectWithoutPostsInput}),
  upsert: t.field({"required":false,"type":ProjectUpsertWithoutPostsInput}),
  connect: t.field({"required":false,"type":ProjectWhereUniqueInput}),
  update: t.field({"required":false,"type":ProjectUpdateWithoutPostsInput}),
});
export const ProjectUpdateOneRequiredWithoutPostsNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ProjectUpdateOneRequiredWithoutPostsNestedInput>>('ProjectUpdateOneRequiredWithoutPostsNestedInput').implement({
  fields: ProjectUpdateOneRequiredWithoutPostsNestedInputFields,
});

export const UpvoteUpdateManyWithoutPostNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[UpvoteCreateWithoutPostInput]}),
  connectOrCreate: t.field({"required":false,"type":[UpvoteCreateOrConnectWithoutPostInput]}),
  upsert: t.field({"required":false,"type":[UpvoteUpsertWithWhereUniqueWithoutPostInput]}),
  createMany: t.field({"required":false,"type":UpvoteCreateManyPostInputEnvelope}),
  set: t.field({"required":false,"type":[UpvoteWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[UpvoteWhereUniqueInput]}),
  delete: t.field({"required":false,"type":[UpvoteWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[UpvoteWhereUniqueInput]}),
  update: t.field({"required":false,"type":[UpvoteUpdateWithWhereUniqueWithoutPostInput]}),
  updateMany: t.field({"required":false,"type":[UpvoteUpdateManyWithWhereWithoutPostInput]}),
  deleteMany: t.field({"required":false,"type":[UpvoteScalarWhereInput]}),
});
export const UpvoteUpdateManyWithoutPostNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UpvoteUpdateManyWithoutPostNestedInput>>('UpvoteUpdateManyWithoutPostNestedInput').implement({
  fields: UpvoteUpdateManyWithoutPostNestedInputFields,
});

export const PostCreateNestedOneWithoutUpvotesInputFields = (t: any) => ({
  create: t.field({"required":false,"type":PostCreateWithoutUpvotesInput}),
  connectOrCreate: t.field({"required":false,"type":PostCreateOrConnectWithoutUpvotesInput}),
  connect: t.field({"required":false,"type":PostWhereUniqueInput}),
});
export const PostCreateNestedOneWithoutUpvotesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostCreateNestedOneWithoutUpvotesInput>>('PostCreateNestedOneWithoutUpvotesInput').implement({
  fields: PostCreateNestedOneWithoutUpvotesInputFields,
});

export const UserCreateNestedOneWithoutUpvoteInputFields = (t: any) => ({
  create: t.field({"required":false,"type":UserCreateWithoutUpvoteInput}),
  connectOrCreate: t.field({"required":false,"type":UserCreateOrConnectWithoutUpvoteInput}),
  connect: t.field({"required":false,"type":UserWhereUniqueInput}),
});
export const UserCreateNestedOneWithoutUpvoteInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserCreateNestedOneWithoutUpvoteInput>>('UserCreateNestedOneWithoutUpvoteInput').implement({
  fields: UserCreateNestedOneWithoutUpvoteInputFields,
});

export const PostUpdateOneRequiredWithoutUpvotesNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":PostCreateWithoutUpvotesInput}),
  connectOrCreate: t.field({"required":false,"type":PostCreateOrConnectWithoutUpvotesInput}),
  upsert: t.field({"required":false,"type":PostUpsertWithoutUpvotesInput}),
  connect: t.field({"required":false,"type":PostWhereUniqueInput}),
  update: t.field({"required":false,"type":PostUpdateWithoutUpvotesInput}),
});
export const PostUpdateOneRequiredWithoutUpvotesNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostUpdateOneRequiredWithoutUpvotesNestedInput>>('PostUpdateOneRequiredWithoutUpvotesNestedInput').implement({
  fields: PostUpdateOneRequiredWithoutUpvotesNestedInputFields,
});

export const UserUpdateOneRequiredWithoutUpvoteNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":UserCreateWithoutUpvoteInput}),
  connectOrCreate: t.field({"required":false,"type":UserCreateOrConnectWithoutUpvoteInput}),
  upsert: t.field({"required":false,"type":UserUpsertWithoutUpvoteInput}),
  connect: t.field({"required":false,"type":UserWhereUniqueInput}),
  update: t.field({"required":false,"type":UserUpdateWithoutUpvoteInput}),
});
export const UserUpdateOneRequiredWithoutUpvoteNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserUpdateOneRequiredWithoutUpvoteNestedInput>>('UserUpdateOneRequiredWithoutUpvoteNestedInput').implement({
  fields: UserUpdateOneRequiredWithoutUpvoteNestedInputFields,
});

export const NestedStringFilterFields = (t: any) => ({
  equals: t.string({"required":false}),
  in: t.stringList({"required":false}),
  notIn: t.stringList({"required":false}),
  lt: t.string({"required":false}),
  lte: t.string({"required":false}),
  gt: t.string({"required":false}),
  gte: t.string({"required":false}),
  contains: t.string({"required":false}),
  startsWith: t.string({"required":false}),
  endsWith: t.string({"required":false}),
  not: t.field({"required":false,"type":NestedStringFilter}),
});
export const NestedStringFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedStringFilter>>('NestedStringFilter').implement({
  fields: NestedStringFilterFields,
});

export const NestedDateTimeFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":DateTime}),
  in: t.field({"required":false,"type":[DateTime]}),
  notIn: t.field({"required":false,"type":[DateTime]}),
  lt: t.field({"required":false,"type":DateTime}),
  lte: t.field({"required":false,"type":DateTime}),
  gt: t.field({"required":false,"type":DateTime}),
  gte: t.field({"required":false,"type":DateTime}),
  not: t.field({"required":false,"type":NestedDateTimeFilter}),
});
export const NestedDateTimeFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedDateTimeFilter>>('NestedDateTimeFilter').implement({
  fields: NestedDateTimeFilterFields,
});

export const NestedStringWithAggregatesFilterFields = (t: any) => ({
  equals: t.string({"required":false}),
  in: t.stringList({"required":false}),
  notIn: t.stringList({"required":false}),
  lt: t.string({"required":false}),
  lte: t.string({"required":false}),
  gt: t.string({"required":false}),
  gte: t.string({"required":false}),
  contains: t.string({"required":false}),
  startsWith: t.string({"required":false}),
  endsWith: t.string({"required":false}),
  not: t.field({"required":false,"type":NestedStringWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedStringFilter}),
  _max: t.field({"required":false,"type":NestedStringFilter}),
});
export const NestedStringWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedStringWithAggregatesFilter>>('NestedStringWithAggregatesFilter').implement({
  fields: NestedStringWithAggregatesFilterFields,
});

export const NestedIntFilterFields = (t: any) => ({
  equals: t.int({"required":false}),
  in: t.intList({"required":false}),
  notIn: t.intList({"required":false}),
  lt: t.int({"required":false}),
  lte: t.int({"required":false}),
  gt: t.int({"required":false}),
  gte: t.int({"required":false}),
  not: t.field({"required":false,"type":NestedIntFilter}),
});
export const NestedIntFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedIntFilter>>('NestedIntFilter').implement({
  fields: NestedIntFilterFields,
});

export const NestedDateTimeWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":DateTime}),
  in: t.field({"required":false,"type":[DateTime]}),
  notIn: t.field({"required":false,"type":[DateTime]}),
  lt: t.field({"required":false,"type":DateTime}),
  lte: t.field({"required":false,"type":DateTime}),
  gt: t.field({"required":false,"type":DateTime}),
  gte: t.field({"required":false,"type":DateTime}),
  not: t.field({"required":false,"type":NestedDateTimeWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedDateTimeFilter}),
  _max: t.field({"required":false,"type":NestedDateTimeFilter}),
});
export const NestedDateTimeWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedDateTimeWithAggregatesFilter>>('NestedDateTimeWithAggregatesFilter').implement({
  fields: NestedDateTimeWithAggregatesFilterFields,
});

export const NestedStringNullableFilterFields = (t: any) => ({
  equals: t.string({"required":false}),
  in: t.stringList({"required":false}),
  notIn: t.stringList({"required":false}),
  lt: t.string({"required":false}),
  lte: t.string({"required":false}),
  gt: t.string({"required":false}),
  gte: t.string({"required":false}),
  contains: t.string({"required":false}),
  startsWith: t.string({"required":false}),
  endsWith: t.string({"required":false}),
  not: t.field({"required":false,"type":NestedStringNullableFilter}),
});
export const NestedStringNullableFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedStringNullableFilter>>('NestedStringNullableFilter').implement({
  fields: NestedStringNullableFilterFields,
});

export const NestedStringNullableWithAggregatesFilterFields = (t: any) => ({
  equals: t.string({"required":false}),
  in: t.stringList({"required":false}),
  notIn: t.stringList({"required":false}),
  lt: t.string({"required":false}),
  lte: t.string({"required":false}),
  gt: t.string({"required":false}),
  gte: t.string({"required":false}),
  contains: t.string({"required":false}),
  startsWith: t.string({"required":false}),
  endsWith: t.string({"required":false}),
  not: t.field({"required":false,"type":NestedStringNullableWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntNullableFilter}),
  _min: t.field({"required":false,"type":NestedStringNullableFilter}),
  _max: t.field({"required":false,"type":NestedStringNullableFilter}),
});
export const NestedStringNullableWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedStringNullableWithAggregatesFilter>>('NestedStringNullableWithAggregatesFilter').implement({
  fields: NestedStringNullableWithAggregatesFilterFields,
});

export const NestedIntNullableFilterFields = (t: any) => ({
  equals: t.int({"required":false}),
  in: t.intList({"required":false}),
  notIn: t.intList({"required":false}),
  lt: t.int({"required":false}),
  lte: t.int({"required":false}),
  gt: t.int({"required":false}),
  gte: t.int({"required":false}),
  not: t.field({"required":false,"type":NestedIntNullableFilter}),
});
export const NestedIntNullableFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedIntNullableFilter>>('NestedIntNullableFilter').implement({
  fields: NestedIntNullableFilterFields,
});

export const UpvoteCreateWithoutUserInputFields = (t: any) => ({
  id: t.string({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  post: t.field({"required":true,"type":PostCreateNestedOneWithoutUpvotesInput}),
});
export const UpvoteCreateWithoutUserInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UpvoteCreateWithoutUserInput>>('UpvoteCreateWithoutUserInput').implement({
  fields: UpvoteCreateWithoutUserInputFields,
});

export const UpvoteCreateOrConnectWithoutUserInputFields = (t: any) => ({
  where: t.field({"required":true,"type":UpvoteWhereUniqueInput}),
  create: t.field({"required":true,"type":UpvoteCreateWithoutUserInput}),
});
export const UpvoteCreateOrConnectWithoutUserInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UpvoteCreateOrConnectWithoutUserInput>>('UpvoteCreateOrConnectWithoutUserInput').implement({
  fields: UpvoteCreateOrConnectWithoutUserInputFields,
});

export const UpvoteCreateManyUserInputEnvelopeFields = (t: any) => ({
  data: t.field({"required":true,"type":[UpvoteCreateManyUserInput]}),
  skipDuplicates: t.boolean({"required":false}),
});
export const UpvoteCreateManyUserInputEnvelope = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UpvoteCreateManyUserInputEnvelope>>('UpvoteCreateManyUserInputEnvelope').implement({
  fields: UpvoteCreateManyUserInputEnvelopeFields,
});

export const PostCreateWithoutAuthorInputFields = (t: any) => ({
  id: t.string({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  title: t.string({"required":true}),
  description: t.string({"required":true}),
  project: t.field({"required":true,"type":ProjectCreateNestedOneWithoutPostsInput}),
  upvotes: t.field({"required":false,"type":UpvoteCreateNestedManyWithoutPostInput}),
});
export const PostCreateWithoutAuthorInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostCreateWithoutAuthorInput>>('PostCreateWithoutAuthorInput').implement({
  fields: PostCreateWithoutAuthorInputFields,
});

export const PostCreateOrConnectWithoutAuthorInputFields = (t: any) => ({
  where: t.field({"required":true,"type":PostWhereUniqueInput}),
  create: t.field({"required":true,"type":PostCreateWithoutAuthorInput}),
});
export const PostCreateOrConnectWithoutAuthorInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostCreateOrConnectWithoutAuthorInput>>('PostCreateOrConnectWithoutAuthorInput').implement({
  fields: PostCreateOrConnectWithoutAuthorInputFields,
});

export const PostCreateManyAuthorInputEnvelopeFields = (t: any) => ({
  data: t.field({"required":true,"type":[PostCreateManyAuthorInput]}),
  skipDuplicates: t.boolean({"required":false}),
});
export const PostCreateManyAuthorInputEnvelope = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostCreateManyAuthorInputEnvelope>>('PostCreateManyAuthorInputEnvelope').implement({
  fields: PostCreateManyAuthorInputEnvelopeFields,
});

export const UpvoteUpsertWithWhereUniqueWithoutUserInputFields = (t: any) => ({
  where: t.field({"required":true,"type":UpvoteWhereUniqueInput}),
  update: t.field({"required":true,"type":UpvoteUpdateWithoutUserInput}),
  create: t.field({"required":true,"type":UpvoteCreateWithoutUserInput}),
});
export const UpvoteUpsertWithWhereUniqueWithoutUserInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UpvoteUpsertWithWhereUniqueWithoutUserInput>>('UpvoteUpsertWithWhereUniqueWithoutUserInput').implement({
  fields: UpvoteUpsertWithWhereUniqueWithoutUserInputFields,
});

export const UpvoteUpdateWithWhereUniqueWithoutUserInputFields = (t: any) => ({
  where: t.field({"required":true,"type":UpvoteWhereUniqueInput}),
  data: t.field({"required":true,"type":UpvoteUpdateWithoutUserInput}),
});
export const UpvoteUpdateWithWhereUniqueWithoutUserInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UpvoteUpdateWithWhereUniqueWithoutUserInput>>('UpvoteUpdateWithWhereUniqueWithoutUserInput').implement({
  fields: UpvoteUpdateWithWhereUniqueWithoutUserInputFields,
});

export const UpvoteUpdateManyWithWhereWithoutUserInputFields = (t: any) => ({
  where: t.field({"required":true,"type":UpvoteScalarWhereInput}),
  data: t.field({"required":true,"type":UpvoteUpdateManyMutationInput}),
});
export const UpvoteUpdateManyWithWhereWithoutUserInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UpvoteUpdateManyWithWhereWithoutUserInput>>('UpvoteUpdateManyWithWhereWithoutUserInput').implement({
  fields: UpvoteUpdateManyWithWhereWithoutUserInputFields,
});

export const UpvoteScalarWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[UpvoteScalarWhereInput]}),
  OR: t.field({"required":false,"type":[UpvoteScalarWhereInput]}),
  NOT: t.field({"required":false,"type":[UpvoteScalarWhereInput]}),
  id: t.field({"required":false,"type":StringFilter}),
  createdAt: t.field({"required":false,"type":DateTimeFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeFilter}),
  postId: t.field({"required":false,"type":StringFilter}),
  userId: t.field({"required":false,"type":StringFilter}),
});
export const UpvoteScalarWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UpvoteScalarWhereInput>>('UpvoteScalarWhereInput').implement({
  fields: UpvoteScalarWhereInputFields,
});

export const PostUpsertWithWhereUniqueWithoutAuthorInputFields = (t: any) => ({
  where: t.field({"required":true,"type":PostWhereUniqueInput}),
  update: t.field({"required":true,"type":PostUpdateWithoutAuthorInput}),
  create: t.field({"required":true,"type":PostCreateWithoutAuthorInput}),
});
export const PostUpsertWithWhereUniqueWithoutAuthorInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostUpsertWithWhereUniqueWithoutAuthorInput>>('PostUpsertWithWhereUniqueWithoutAuthorInput').implement({
  fields: PostUpsertWithWhereUniqueWithoutAuthorInputFields,
});

export const PostUpdateWithWhereUniqueWithoutAuthorInputFields = (t: any) => ({
  where: t.field({"required":true,"type":PostWhereUniqueInput}),
  data: t.field({"required":true,"type":PostUpdateWithoutAuthorInput}),
});
export const PostUpdateWithWhereUniqueWithoutAuthorInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostUpdateWithWhereUniqueWithoutAuthorInput>>('PostUpdateWithWhereUniqueWithoutAuthorInput').implement({
  fields: PostUpdateWithWhereUniqueWithoutAuthorInputFields,
});

export const PostUpdateManyWithWhereWithoutAuthorInputFields = (t: any) => ({
  where: t.field({"required":true,"type":PostScalarWhereInput}),
  data: t.field({"required":true,"type":PostUpdateManyMutationInput}),
});
export const PostUpdateManyWithWhereWithoutAuthorInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostUpdateManyWithWhereWithoutAuthorInput>>('PostUpdateManyWithWhereWithoutAuthorInput').implement({
  fields: PostUpdateManyWithWhereWithoutAuthorInputFields,
});

export const PostScalarWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[PostScalarWhereInput]}),
  OR: t.field({"required":false,"type":[PostScalarWhereInput]}),
  NOT: t.field({"required":false,"type":[PostScalarWhereInput]}),
  id: t.field({"required":false,"type":StringFilter}),
  createdAt: t.field({"required":false,"type":DateTimeFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeFilter}),
  title: t.field({"required":false,"type":StringFilter}),
  description: t.field({"required":false,"type":StringFilter}),
  authorId: t.field({"required":false,"type":StringFilter}),
  projectId: t.field({"required":false,"type":StringFilter}),
});
export const PostScalarWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostScalarWhereInput>>('PostScalarWhereInput').implement({
  fields: PostScalarWhereInputFields,
});

export const ProjectCreateWithoutOrganizationInputFields = (t: any) => ({
  id: t.string({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  name: t.string({"required":true}),
  slug: t.string({"required":true}),
  image: t.string({"required":false}),
  description: t.string({"required":false}),
  posts: t.field({"required":false,"type":PostCreateNestedManyWithoutProjectInput}),
});
export const ProjectCreateWithoutOrganizationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ProjectCreateWithoutOrganizationInput>>('ProjectCreateWithoutOrganizationInput').implement({
  fields: ProjectCreateWithoutOrganizationInputFields,
});

export const ProjectCreateOrConnectWithoutOrganizationInputFields = (t: any) => ({
  where: t.field({"required":true,"type":ProjectWhereUniqueInput}),
  create: t.field({"required":true,"type":ProjectCreateWithoutOrganizationInput}),
});
export const ProjectCreateOrConnectWithoutOrganizationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ProjectCreateOrConnectWithoutOrganizationInput>>('ProjectCreateOrConnectWithoutOrganizationInput').implement({
  fields: ProjectCreateOrConnectWithoutOrganizationInputFields,
});

export const ProjectCreateManyOrganizationInputEnvelopeFields = (t: any) => ({
  data: t.field({"required":true,"type":[ProjectCreateManyOrganizationInput]}),
  skipDuplicates: t.boolean({"required":false}),
});
export const ProjectCreateManyOrganizationInputEnvelope = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ProjectCreateManyOrganizationInputEnvelope>>('ProjectCreateManyOrganizationInputEnvelope').implement({
  fields: ProjectCreateManyOrganizationInputEnvelopeFields,
});

export const ProjectUpsertWithWhereUniqueWithoutOrganizationInputFields = (t: any) => ({
  where: t.field({"required":true,"type":ProjectWhereUniqueInput}),
  update: t.field({"required":true,"type":ProjectUpdateWithoutOrganizationInput}),
  create: t.field({"required":true,"type":ProjectCreateWithoutOrganizationInput}),
});
export const ProjectUpsertWithWhereUniqueWithoutOrganizationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ProjectUpsertWithWhereUniqueWithoutOrganizationInput>>('ProjectUpsertWithWhereUniqueWithoutOrganizationInput').implement({
  fields: ProjectUpsertWithWhereUniqueWithoutOrganizationInputFields,
});

export const ProjectUpdateWithWhereUniqueWithoutOrganizationInputFields = (t: any) => ({
  where: t.field({"required":true,"type":ProjectWhereUniqueInput}),
  data: t.field({"required":true,"type":ProjectUpdateWithoutOrganizationInput}),
});
export const ProjectUpdateWithWhereUniqueWithoutOrganizationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ProjectUpdateWithWhereUniqueWithoutOrganizationInput>>('ProjectUpdateWithWhereUniqueWithoutOrganizationInput').implement({
  fields: ProjectUpdateWithWhereUniqueWithoutOrganizationInputFields,
});

export const ProjectUpdateManyWithWhereWithoutOrganizationInputFields = (t: any) => ({
  where: t.field({"required":true,"type":ProjectScalarWhereInput}),
  data: t.field({"required":true,"type":ProjectUpdateManyMutationInput}),
});
export const ProjectUpdateManyWithWhereWithoutOrganizationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ProjectUpdateManyWithWhereWithoutOrganizationInput>>('ProjectUpdateManyWithWhereWithoutOrganizationInput').implement({
  fields: ProjectUpdateManyWithWhereWithoutOrganizationInputFields,
});

export const ProjectScalarWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[ProjectScalarWhereInput]}),
  OR: t.field({"required":false,"type":[ProjectScalarWhereInput]}),
  NOT: t.field({"required":false,"type":[ProjectScalarWhereInput]}),
  id: t.field({"required":false,"type":StringFilter}),
  createdAt: t.field({"required":false,"type":DateTimeFilter}),
  updatedAt: t.field({"required":false,"type":DateTimeFilter}),
  name: t.field({"required":false,"type":StringFilter}),
  slug: t.field({"required":false,"type":StringFilter}),
  image: t.field({"required":false,"type":StringNullableFilter}),
  description: t.field({"required":false,"type":StringNullableFilter}),
  organizationId: t.field({"required":false,"type":StringFilter}),
});
export const ProjectScalarWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ProjectScalarWhereInput>>('ProjectScalarWhereInput').implement({
  fields: ProjectScalarWhereInputFields,
});

export const OrganizationCreateWithoutProjectsInputFields = (t: any) => ({
  id: t.string({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  name: t.string({"required":true}),
  slug: t.string({"required":true}),
});
export const OrganizationCreateWithoutProjectsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.OrganizationCreateWithoutProjectsInput>>('OrganizationCreateWithoutProjectsInput').implement({
  fields: OrganizationCreateWithoutProjectsInputFields,
});

export const OrganizationCreateOrConnectWithoutProjectsInputFields = (t: any) => ({
  where: t.field({"required":true,"type":OrganizationWhereUniqueInput}),
  create: t.field({"required":true,"type":OrganizationCreateWithoutProjectsInput}),
});
export const OrganizationCreateOrConnectWithoutProjectsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.OrganizationCreateOrConnectWithoutProjectsInput>>('OrganizationCreateOrConnectWithoutProjectsInput').implement({
  fields: OrganizationCreateOrConnectWithoutProjectsInputFields,
});

export const PostCreateWithoutProjectInputFields = (t: any) => ({
  id: t.string({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  title: t.string({"required":true}),
  description: t.string({"required":true}),
  author: t.field({"required":true,"type":UserCreateNestedOneWithoutPostInput}),
  upvotes: t.field({"required":false,"type":UpvoteCreateNestedManyWithoutPostInput}),
});
export const PostCreateWithoutProjectInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostCreateWithoutProjectInput>>('PostCreateWithoutProjectInput').implement({
  fields: PostCreateWithoutProjectInputFields,
});

export const PostCreateOrConnectWithoutProjectInputFields = (t: any) => ({
  where: t.field({"required":true,"type":PostWhereUniqueInput}),
  create: t.field({"required":true,"type":PostCreateWithoutProjectInput}),
});
export const PostCreateOrConnectWithoutProjectInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostCreateOrConnectWithoutProjectInput>>('PostCreateOrConnectWithoutProjectInput').implement({
  fields: PostCreateOrConnectWithoutProjectInputFields,
});

export const PostCreateManyProjectInputEnvelopeFields = (t: any) => ({
  data: t.field({"required":true,"type":[PostCreateManyProjectInput]}),
  skipDuplicates: t.boolean({"required":false}),
});
export const PostCreateManyProjectInputEnvelope = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostCreateManyProjectInputEnvelope>>('PostCreateManyProjectInputEnvelope').implement({
  fields: PostCreateManyProjectInputEnvelopeFields,
});

export const OrganizationUpsertWithoutProjectsInputFields = (t: any) => ({
  update: t.field({"required":true,"type":OrganizationUpdateWithoutProjectsInput}),
  create: t.field({"required":true,"type":OrganizationCreateWithoutProjectsInput}),
});
export const OrganizationUpsertWithoutProjectsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.OrganizationUpsertWithoutProjectsInput>>('OrganizationUpsertWithoutProjectsInput').implement({
  fields: OrganizationUpsertWithoutProjectsInputFields,
});

export const OrganizationUpdateWithoutProjectsInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  name: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  slug: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
});
export const OrganizationUpdateWithoutProjectsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.OrganizationUpdateWithoutProjectsInput>>('OrganizationUpdateWithoutProjectsInput').implement({
  fields: OrganizationUpdateWithoutProjectsInputFields,
});

export const PostUpsertWithWhereUniqueWithoutProjectInputFields = (t: any) => ({
  where: t.field({"required":true,"type":PostWhereUniqueInput}),
  update: t.field({"required":true,"type":PostUpdateWithoutProjectInput}),
  create: t.field({"required":true,"type":PostCreateWithoutProjectInput}),
});
export const PostUpsertWithWhereUniqueWithoutProjectInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostUpsertWithWhereUniqueWithoutProjectInput>>('PostUpsertWithWhereUniqueWithoutProjectInput').implement({
  fields: PostUpsertWithWhereUniqueWithoutProjectInputFields,
});

export const PostUpdateWithWhereUniqueWithoutProjectInputFields = (t: any) => ({
  where: t.field({"required":true,"type":PostWhereUniqueInput}),
  data: t.field({"required":true,"type":PostUpdateWithoutProjectInput}),
});
export const PostUpdateWithWhereUniqueWithoutProjectInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostUpdateWithWhereUniqueWithoutProjectInput>>('PostUpdateWithWhereUniqueWithoutProjectInput').implement({
  fields: PostUpdateWithWhereUniqueWithoutProjectInputFields,
});

export const PostUpdateManyWithWhereWithoutProjectInputFields = (t: any) => ({
  where: t.field({"required":true,"type":PostScalarWhereInput}),
  data: t.field({"required":true,"type":PostUpdateManyMutationInput}),
});
export const PostUpdateManyWithWhereWithoutProjectInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostUpdateManyWithWhereWithoutProjectInput>>('PostUpdateManyWithWhereWithoutProjectInput').implement({
  fields: PostUpdateManyWithWhereWithoutProjectInputFields,
});

export const UserCreateWithoutPostInputFields = (t: any) => ({
  id: t.string({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  walletAddress: t.string({"required":true}),
  Upvote: t.field({"required":false,"type":UpvoteCreateNestedManyWithoutUserInput}),
});
export const UserCreateWithoutPostInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserCreateWithoutPostInput>>('UserCreateWithoutPostInput').implement({
  fields: UserCreateWithoutPostInputFields,
});

export const UserCreateOrConnectWithoutPostInputFields = (t: any) => ({
  where: t.field({"required":true,"type":UserWhereUniqueInput}),
  create: t.field({"required":true,"type":UserCreateWithoutPostInput}),
});
export const UserCreateOrConnectWithoutPostInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserCreateOrConnectWithoutPostInput>>('UserCreateOrConnectWithoutPostInput').implement({
  fields: UserCreateOrConnectWithoutPostInputFields,
});

export const ProjectCreateWithoutPostsInputFields = (t: any) => ({
  id: t.string({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  name: t.string({"required":true}),
  slug: t.string({"required":true}),
  image: t.string({"required":false}),
  description: t.string({"required":false}),
  organization: t.field({"required":true,"type":OrganizationCreateNestedOneWithoutProjectsInput}),
});
export const ProjectCreateWithoutPostsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ProjectCreateWithoutPostsInput>>('ProjectCreateWithoutPostsInput').implement({
  fields: ProjectCreateWithoutPostsInputFields,
});

export const ProjectCreateOrConnectWithoutPostsInputFields = (t: any) => ({
  where: t.field({"required":true,"type":ProjectWhereUniqueInput}),
  create: t.field({"required":true,"type":ProjectCreateWithoutPostsInput}),
});
export const ProjectCreateOrConnectWithoutPostsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ProjectCreateOrConnectWithoutPostsInput>>('ProjectCreateOrConnectWithoutPostsInput').implement({
  fields: ProjectCreateOrConnectWithoutPostsInputFields,
});

export const UpvoteCreateWithoutPostInputFields = (t: any) => ({
  id: t.string({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  user: t.field({"required":true,"type":UserCreateNestedOneWithoutUpvoteInput}),
});
export const UpvoteCreateWithoutPostInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UpvoteCreateWithoutPostInput>>('UpvoteCreateWithoutPostInput').implement({
  fields: UpvoteCreateWithoutPostInputFields,
});

export const UpvoteCreateOrConnectWithoutPostInputFields = (t: any) => ({
  where: t.field({"required":true,"type":UpvoteWhereUniqueInput}),
  create: t.field({"required":true,"type":UpvoteCreateWithoutPostInput}),
});
export const UpvoteCreateOrConnectWithoutPostInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UpvoteCreateOrConnectWithoutPostInput>>('UpvoteCreateOrConnectWithoutPostInput').implement({
  fields: UpvoteCreateOrConnectWithoutPostInputFields,
});

export const UpvoteCreateManyPostInputEnvelopeFields = (t: any) => ({
  data: t.field({"required":true,"type":[UpvoteCreateManyPostInput]}),
  skipDuplicates: t.boolean({"required":false}),
});
export const UpvoteCreateManyPostInputEnvelope = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UpvoteCreateManyPostInputEnvelope>>('UpvoteCreateManyPostInputEnvelope').implement({
  fields: UpvoteCreateManyPostInputEnvelopeFields,
});

export const UserUpsertWithoutPostInputFields = (t: any) => ({
  update: t.field({"required":true,"type":UserUpdateWithoutPostInput}),
  create: t.field({"required":true,"type":UserCreateWithoutPostInput}),
});
export const UserUpsertWithoutPostInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserUpsertWithoutPostInput>>('UserUpsertWithoutPostInput').implement({
  fields: UserUpsertWithoutPostInputFields,
});

export const UserUpdateWithoutPostInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  walletAddress: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  Upvote: t.field({"required":false,"type":UpvoteUpdateManyWithoutUserNestedInput}),
});
export const UserUpdateWithoutPostInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserUpdateWithoutPostInput>>('UserUpdateWithoutPostInput').implement({
  fields: UserUpdateWithoutPostInputFields,
});

export const ProjectUpsertWithoutPostsInputFields = (t: any) => ({
  update: t.field({"required":true,"type":ProjectUpdateWithoutPostsInput}),
  create: t.field({"required":true,"type":ProjectCreateWithoutPostsInput}),
});
export const ProjectUpsertWithoutPostsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ProjectUpsertWithoutPostsInput>>('ProjectUpsertWithoutPostsInput').implement({
  fields: ProjectUpsertWithoutPostsInputFields,
});

export const ProjectUpdateWithoutPostsInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  name: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  slug: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  image: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  description: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  organization: t.field({"required":false,"type":OrganizationUpdateOneRequiredWithoutProjectsNestedInput}),
});
export const ProjectUpdateWithoutPostsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ProjectUpdateWithoutPostsInput>>('ProjectUpdateWithoutPostsInput').implement({
  fields: ProjectUpdateWithoutPostsInputFields,
});

export const UpvoteUpsertWithWhereUniqueWithoutPostInputFields = (t: any) => ({
  where: t.field({"required":true,"type":UpvoteWhereUniqueInput}),
  update: t.field({"required":true,"type":UpvoteUpdateWithoutPostInput}),
  create: t.field({"required":true,"type":UpvoteCreateWithoutPostInput}),
});
export const UpvoteUpsertWithWhereUniqueWithoutPostInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UpvoteUpsertWithWhereUniqueWithoutPostInput>>('UpvoteUpsertWithWhereUniqueWithoutPostInput').implement({
  fields: UpvoteUpsertWithWhereUniqueWithoutPostInputFields,
});

export const UpvoteUpdateWithWhereUniqueWithoutPostInputFields = (t: any) => ({
  where: t.field({"required":true,"type":UpvoteWhereUniqueInput}),
  data: t.field({"required":true,"type":UpvoteUpdateWithoutPostInput}),
});
export const UpvoteUpdateWithWhereUniqueWithoutPostInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UpvoteUpdateWithWhereUniqueWithoutPostInput>>('UpvoteUpdateWithWhereUniqueWithoutPostInput').implement({
  fields: UpvoteUpdateWithWhereUniqueWithoutPostInputFields,
});

export const UpvoteUpdateManyWithWhereWithoutPostInputFields = (t: any) => ({
  where: t.field({"required":true,"type":UpvoteScalarWhereInput}),
  data: t.field({"required":true,"type":UpvoteUpdateManyMutationInput}),
});
export const UpvoteUpdateManyWithWhereWithoutPostInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UpvoteUpdateManyWithWhereWithoutPostInput>>('UpvoteUpdateManyWithWhereWithoutPostInput').implement({
  fields: UpvoteUpdateManyWithWhereWithoutPostInputFields,
});

export const PostCreateWithoutUpvotesInputFields = (t: any) => ({
  id: t.string({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  title: t.string({"required":true}),
  description: t.string({"required":true}),
  author: t.field({"required":true,"type":UserCreateNestedOneWithoutPostInput}),
  project: t.field({"required":true,"type":ProjectCreateNestedOneWithoutPostsInput}),
});
export const PostCreateWithoutUpvotesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostCreateWithoutUpvotesInput>>('PostCreateWithoutUpvotesInput').implement({
  fields: PostCreateWithoutUpvotesInputFields,
});

export const PostCreateOrConnectWithoutUpvotesInputFields = (t: any) => ({
  where: t.field({"required":true,"type":PostWhereUniqueInput}),
  create: t.field({"required":true,"type":PostCreateWithoutUpvotesInput}),
});
export const PostCreateOrConnectWithoutUpvotesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostCreateOrConnectWithoutUpvotesInput>>('PostCreateOrConnectWithoutUpvotesInput').implement({
  fields: PostCreateOrConnectWithoutUpvotesInputFields,
});

export const UserCreateWithoutUpvoteInputFields = (t: any) => ({
  id: t.string({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  walletAddress: t.string({"required":true}),
  Post: t.field({"required":false,"type":PostCreateNestedManyWithoutAuthorInput}),
});
export const UserCreateWithoutUpvoteInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserCreateWithoutUpvoteInput>>('UserCreateWithoutUpvoteInput').implement({
  fields: UserCreateWithoutUpvoteInputFields,
});

export const UserCreateOrConnectWithoutUpvoteInputFields = (t: any) => ({
  where: t.field({"required":true,"type":UserWhereUniqueInput}),
  create: t.field({"required":true,"type":UserCreateWithoutUpvoteInput}),
});
export const UserCreateOrConnectWithoutUpvoteInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserCreateOrConnectWithoutUpvoteInput>>('UserCreateOrConnectWithoutUpvoteInput').implement({
  fields: UserCreateOrConnectWithoutUpvoteInputFields,
});

export const PostUpsertWithoutUpvotesInputFields = (t: any) => ({
  update: t.field({"required":true,"type":PostUpdateWithoutUpvotesInput}),
  create: t.field({"required":true,"type":PostCreateWithoutUpvotesInput}),
});
export const PostUpsertWithoutUpvotesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostUpsertWithoutUpvotesInput>>('PostUpsertWithoutUpvotesInput').implement({
  fields: PostUpsertWithoutUpvotesInputFields,
});

export const PostUpdateWithoutUpvotesInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  title: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  description: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  author: t.field({"required":false,"type":UserUpdateOneRequiredWithoutPostNestedInput}),
  project: t.field({"required":false,"type":ProjectUpdateOneRequiredWithoutPostsNestedInput}),
});
export const PostUpdateWithoutUpvotesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostUpdateWithoutUpvotesInput>>('PostUpdateWithoutUpvotesInput').implement({
  fields: PostUpdateWithoutUpvotesInputFields,
});

export const UserUpsertWithoutUpvoteInputFields = (t: any) => ({
  update: t.field({"required":true,"type":UserUpdateWithoutUpvoteInput}),
  create: t.field({"required":true,"type":UserCreateWithoutUpvoteInput}),
});
export const UserUpsertWithoutUpvoteInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserUpsertWithoutUpvoteInput>>('UserUpsertWithoutUpvoteInput').implement({
  fields: UserUpsertWithoutUpvoteInputFields,
});

export const UserUpdateWithoutUpvoteInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  walletAddress: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  Post: t.field({"required":false,"type":PostUpdateManyWithoutAuthorNestedInput}),
});
export const UserUpdateWithoutUpvoteInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserUpdateWithoutUpvoteInput>>('UserUpdateWithoutUpvoteInput').implement({
  fields: UserUpdateWithoutUpvoteInputFields,
});

export const UpvoteCreateManyUserInputFields = (t: any) => ({
  id: t.string({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  postId: t.string({"required":true}),
});
export const UpvoteCreateManyUserInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UpvoteCreateManyUserInput>>('UpvoteCreateManyUserInput').implement({
  fields: UpvoteCreateManyUserInputFields,
});

export const PostCreateManyAuthorInputFields = (t: any) => ({
  id: t.string({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  title: t.string({"required":true}),
  description: t.string({"required":true}),
  projectId: t.string({"required":true}),
});
export const PostCreateManyAuthorInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostCreateManyAuthorInput>>('PostCreateManyAuthorInput').implement({
  fields: PostCreateManyAuthorInputFields,
});

export const UpvoteUpdateWithoutUserInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  post: t.field({"required":false,"type":PostUpdateOneRequiredWithoutUpvotesNestedInput}),
});
export const UpvoteUpdateWithoutUserInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UpvoteUpdateWithoutUserInput>>('UpvoteUpdateWithoutUserInput').implement({
  fields: UpvoteUpdateWithoutUserInputFields,
});

export const PostUpdateWithoutAuthorInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  title: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  description: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  project: t.field({"required":false,"type":ProjectUpdateOneRequiredWithoutPostsNestedInput}),
  upvotes: t.field({"required":false,"type":UpvoteUpdateManyWithoutPostNestedInput}),
});
export const PostUpdateWithoutAuthorInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostUpdateWithoutAuthorInput>>('PostUpdateWithoutAuthorInput').implement({
  fields: PostUpdateWithoutAuthorInputFields,
});

export const ProjectCreateManyOrganizationInputFields = (t: any) => ({
  id: t.string({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  name: t.string({"required":true}),
  slug: t.string({"required":true}),
  image: t.string({"required":false}),
  description: t.string({"required":false}),
});
export const ProjectCreateManyOrganizationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ProjectCreateManyOrganizationInput>>('ProjectCreateManyOrganizationInput').implement({
  fields: ProjectCreateManyOrganizationInputFields,
});

export const ProjectUpdateWithoutOrganizationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  name: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  slug: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  image: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  description: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  posts: t.field({"required":false,"type":PostUpdateManyWithoutProjectNestedInput}),
});
export const ProjectUpdateWithoutOrganizationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ProjectUpdateWithoutOrganizationInput>>('ProjectUpdateWithoutOrganizationInput').implement({
  fields: ProjectUpdateWithoutOrganizationInputFields,
});

export const PostCreateManyProjectInputFields = (t: any) => ({
  id: t.string({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  title: t.string({"required":true}),
  description: t.string({"required":true}),
  authorId: t.string({"required":true}),
});
export const PostCreateManyProjectInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostCreateManyProjectInput>>('PostCreateManyProjectInput').implement({
  fields: PostCreateManyProjectInputFields,
});

export const PostUpdateWithoutProjectInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  title: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  description: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  author: t.field({"required":false,"type":UserUpdateOneRequiredWithoutPostNestedInput}),
  upvotes: t.field({"required":false,"type":UpvoteUpdateManyWithoutPostNestedInput}),
});
export const PostUpdateWithoutProjectInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.PostUpdateWithoutProjectInput>>('PostUpdateWithoutProjectInput').implement({
  fields: PostUpdateWithoutProjectInputFields,
});

export const UpvoteCreateManyPostInputFields = (t: any) => ({
  id: t.string({"required":false}),
  createdAt: t.field({"required":false,"type":DateTime}),
  updatedAt: t.field({"required":false,"type":DateTime}),
  userId: t.string({"required":true}),
});
export const UpvoteCreateManyPostInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UpvoteCreateManyPostInput>>('UpvoteCreateManyPostInput').implement({
  fields: UpvoteCreateManyPostInputFields,
});

export const UpvoteUpdateWithoutPostInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  createdAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updatedAt: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  user: t.field({"required":false,"type":UserUpdateOneRequiredWithoutUpvoteNestedInput}),
});
export const UpvoteUpdateWithoutPostInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UpvoteUpdateWithoutPostInput>>('UpvoteUpdateWithoutPostInput').implement({
  fields: UpvoteUpdateWithoutPostInputFields,
});