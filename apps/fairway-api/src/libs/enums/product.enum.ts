import { registerEnumType } from '@nestjs/graphql';

export enum ProductCategory {
	CLUB = 'CLUB',
	BALL = 'BALL',
	BAG = 'BAG',
	CLOTHING = 'CLOTHING',
	SHOES = 'SHOES',
	ACCESSORY = 'ACCESSORY',
	CART = 'CART', // golf carts / big items
}

registerEnumType(ProductCategory, {
	name: 'ProductCategory',
});

export enum ProductStatus {
	ACTIVE = 'ACTIVE',
	SOLD = 'SOLD',
	OUT_OF_STOCK = 'OUT_OF_STOCK',
	DELETE = 'DELETE',
}

registerEnumType(ProductStatus, {
	name: 'ProductStatus',
});
