import { registerEnumType } from '@nestjs/graphql';

export enum ViewGroup {
	MEMBER = 'MEMBER',
	PRODUCT = 'PRODUCT',
	EVENT = 'EVENT',
	ARTICLE = 'ARTICLE',
}

registerEnumType(ViewGroup, {
	name: 'ViewGroup',
});
