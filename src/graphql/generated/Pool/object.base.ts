// @ts-nocheck
import * as Inputs from '../inputs';
import {
  defineExposeObject,
  definePrismaObject,
  defineFieldObject,
  defineRelationFunction,
  defineRelationObject,
} from '../utils';

export const PoolObject = definePrismaObject('Pool', {
  description: undefined,
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.exposeID('id', PoolIdFieldObject),
    poolAddress: t.exposeString('poolAddress', PoolPoolAddressFieldObject),
    collectionAddress: t.exposeString('collectionAddress', PoolCollectionAddressFieldObject),
    ownerAddress: t.exposeString('ownerAddress', PoolOwnerAddressFieldObject),
    chain: t.field(PoolChainFieldObject),
  }),
});

export const PoolIdFieldObject = defineExposeObject('String', {
  description: undefined,
  nullable: false,
});

export const PoolPoolAddressFieldObject = defineExposeObject('String', {
  description: undefined,
  nullable: false,
});

export const PoolCollectionAddressFieldObject = defineExposeObject('String', {
  description: undefined,
  nullable: false,
});

export const PoolOwnerAddressFieldObject = defineExposeObject('String', {
  description: undefined,
  nullable: false,
});

export const PoolChainFieldObject = defineFieldObject('Pool', {
  type: Inputs.Chain,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.chain,
});
