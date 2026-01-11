import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../../libs/dto/product/product';
import { MemberService } from '../member/member.service';
import { ViewService } from '../view/view.service';
import { LikeService } from '../like/like.service';
import { ProductInput } from '../../libs/dto/product/product.input';
import { Member } from '../../libs/dto/member/member';
import { Message } from '../../libs/enums/common.enum';

@Injectable()
export class ProductService {
	constructor(
		@InjectModel('Product') private readonly productModel: Model<Product>,
		private readonly memberService: MemberService,
		private readonly viewService: ViewService,
		private readonly likeService: LikeService,
	) {}

	public async createProduct(input: ProductInput): Promise<Product> {
		const agent: Member = await this.memberService.getMember(null, input.memberId);

		if (!agent.agentStoreName || !agent.agentStoreLocation || !agent.agentStoreAddress) {
			throw new BadRequestException(Message.STORE_INCOMPLETE);
		}

		try {
			const result = await this.productModel.create(input);

			await this.memberService.memberStatsEditor({
				_id: input.memberId,
				targetKey: 'memberProducts',
				modifier: 1,
			});

			return result;
		} catch (err) {
			console.log('Error, productService.model:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}
}
