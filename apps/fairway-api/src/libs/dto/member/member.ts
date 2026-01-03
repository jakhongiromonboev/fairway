import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import { AgentStoreRegion, MemberAuthType, MemberStatus, MemberType } from '../../enums/member.enum';

@ObjectType()
export class Member {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => MemberType)
	memberType: MemberType;

	@Field(() => MemberStatus)
	memberStatus: MemberStatus;

	@Field(() => MemberAuthType)
	memberAuthType: MemberAuthType;

	@Field(() => String, { nullable: true })
	memberPhone: string;

	@Field(() => String, { nullable: true })
	memberEmail?: string;

	@Field(() => String)
	memberNick: string;

	memberPassword?: string;

	@Field(() => String, { nullable: true })
	memberFullName?: string;

	@Field(() => String)
	memberImage: string;

	@Field(() => String, { nullable: true })
	memberAddress?: string;

	@Field(() => String, { nullable: true })
	memberDesc?: string;

	/** Agent Store Info  **/
	@Field(() => String, { nullable: true })
	agentStoreName?: string;

	@Field(() => String, { nullable: true })
	agentStoreAddress?: string;

	@Field(() => AgentStoreRegion, { nullable: true })
	agentStoreLocation?: AgentStoreRegion;

	@Field(() => String, { nullable: true })
	agentStoreDesc?: string;

	@Field(() => String, { nullable: true })
	agentStoreImage?: string;
	/** Agent Store Info  **/

	@Field(() => Int)
	memberProducts: number;

	@Field(() => Int)
	memberEvents: number;

	@Field(() => Int)
	memberArticles: number;

	@Field(() => Int)
	memberFollowers: number;

	@Field(() => Int)
	memberFollowings: number;

	@Field(() => Int)
	memberLikes: number;

	@Field(() => Int)
	memberViews: number;

	@Field(() => Int)
	memberComments: number;

	@Field(() => Int)
	memberRank: number;

	@Field(() => Int)
	memberWarnings: number;

	@Field(() => Int)
	memberBlocks: number;

	@Field(() => Date, { nullable: true })
	deletedAt?: Date;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	@Field(() => String, { nullable: true })
	accessToken?: string;

	// @Field(() => [MeLiked], { nullable: true })
	// meLiked?: MeLiked[];

	// @Field(() => [MeFollowed], { nullable: true })
	// meFollowed?: MeFollowed[];
}

@ObjectType()
export class TotalCounter {
	@Field(() => Int, { nullable: true })
	total: number;
}

@ObjectType()
export class Members {
	@Field(() => [Member])
	list: Member[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
