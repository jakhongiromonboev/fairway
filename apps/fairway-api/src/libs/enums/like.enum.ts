import { registerEnumType } from '@nestjs/graphql';

export enum LikeGroup {
	MEMBER = 'MEMBER',
	PRODUCT = 'PRODUCT',
	EVENT = 'EVENT',
	ARTICLE = 'ARTICLE',
}

registerEnumType(LikeGroup, {
	name: 'LikeGroup',
});
