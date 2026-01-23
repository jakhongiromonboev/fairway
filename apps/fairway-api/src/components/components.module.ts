import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { ProductModule } from './product/product.module';
import { EventModule } from './event/event.module';
import { LikeModule } from './like/like.module';
import { FollowModule } from './follow/follow.module';
import { BoardArticleModule } from './board-article/board-article.module';
import { CommentModule } from './comment/comment.module';
import { ViewModule } from './view/view.module';
import { NotificationModule } from './notification/notification.module';
import { AuthModule } from './auth/auth.module';
import { EventReservationModule } from './event-reservation/event-reservation.module';

@Module({
	imports: [
		MemberModule,
		ProductModule,
		EventModule,
		LikeModule,
		FollowModule,
		BoardArticleModule,
		CommentModule,
		ViewModule,
		NotificationModule,
		AuthModule,
		EventReservationModule,
	],
})
export class ComponentsModule {}
