import { Mutation, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';

@Resolver()
export class MemberResolver {
	constructor(private readonly memberService: MemberService) {}

	@Mutation(() => String)
	public async signup(): Promise<string> {
		console.log('signup');
		return 'Signup executed';
	}
}
