import { registerEnumType } from '@nestjs/graphql';

export enum BoardArticleCategory {
	GENERAL = 'GENERAL',
	TIPS = 'TIPS',
	NEWS = 'NEWS',
	REVIEW = 'REVIEW',
	HUMOR = 'HUMOR',
}

registerEnumType(BoardArticleCategory, {
	name: 'BoardArticleCategory',
});

export enum BoardArticleStatus {
	ACTIVE = 'ACTIVE',
	DELETE = 'DELETE',
}

registerEnumType(BoardArticleStatus, {
	name: 'BoardArticleStatus',
});
