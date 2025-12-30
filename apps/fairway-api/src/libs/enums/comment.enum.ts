import { registerEnumType } from '@nestjs/graphql';

export enum CommentStatus {
	ACTIVE = 'ACTIVE',
	DELETE = 'DELETE',
}

registerEnumType(CommentStatus, {
	name: 'CommentStatus',
});

export enum CommentGroup {
	MEMBER = 'MEMBER',
	PRODUCT = 'PRODUCT',
	EVENT = 'EVENT',
	ARTICLE = 'ARTICLE',
}

registerEnumType(CommentGroup, {
	name: 'CommentGroup',
});
