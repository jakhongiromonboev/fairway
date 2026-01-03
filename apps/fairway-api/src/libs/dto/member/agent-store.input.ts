import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { AgentStoreRegion } from '../../enums/member.enum';

@InputType()
export class AgentStoreInput {
	@IsNotEmpty()
	@Field(() => String)
	agentStoreName: string;

	@IsNotEmpty()
	@Field(() => String)
	agentStoreAddress: string;

	@IsNotEmpty()
	@Field(() => AgentStoreRegion)
	agentStoreLocation: AgentStoreRegion;

	@IsOptional()
	@Field(() => String, { nullable: true })
	agentStoreDesc?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	agentStoreImage?: string;
}

@InputType()
export class AgentStoreUpdate {
	@IsOptional()
	@Field(() => String, { nullable: true })
	agentStoreName?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	agentStoreAddress?: string;

	@IsOptional()
	@Field(() => AgentStoreRegion, { nullable: true })
	agentStoreLocation?: AgentStoreRegion;

	@IsOptional()
	@Field(() => String, { nullable: true })
	agentStoreDesc?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	agentStoreImage?: string;
}
