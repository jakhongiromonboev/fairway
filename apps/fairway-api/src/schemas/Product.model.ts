import { Schema } from 'mongoose';
import { ProductCategory, ProductStatus } from '../libs/enums/product.enum';

const ProductSchema = new Schema(
	{
		productCategory: {
			type: String,
			enum: ProductCategory,
			required: true,
		},

		productStatus: {
			type: String,
			enum: ProductStatus,
			default: ProductStatus.ACTIVE,
		},

		productName: {
			type: String,
			required: true,
		},

		productPrice: {
			type: Number,
			required: true,
		},

		productImages: {
			type: [String],
			required: true,
		},

		productDesc: {
			type: String,
		},

		productQuantity: {
			type: Number,
			default: 1,
		},

		productSizes: {
			type: [String],
			default: [],
		},

		productBrand: {
			type: String,
		},

		productViews: {
			type: Number,
			default: 0,
		},

		productLikes: {
			type: Number,
			default: 0,
		},

		productComments: {
			type: Number,
			default: 0,
		},

		productRank: {
			type: Number,
			default: 0,
		},

		memberId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

		soldAt: {
			type: Date,
		},

		deletedAt: {
			type: Date,
		},
	},
	{
		timestamps: true,
		collection: 'products',
	},
);

ProductSchema.index({ memberId: 1, productName: 1, productPrice: 1 }, { unique: true });

export default ProductSchema;
