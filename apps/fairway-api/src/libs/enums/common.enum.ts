import { registerEnumType } from '@nestjs/graphql';

export enum Message {
	SOMETHING_WENT_WRONG = 'Something went wrong!',
	NO_DATA_FOUND = 'No data found!',
	CREATE_FAILED = 'Create failed!',
	UPDATE_FAILED = 'Update failed!',
	REMOVE_FAILED = 'Remove failed!',
	UPLOAD_FAILED = 'Upload failed!',
	BAD_REQUEST = 'Bad Request',

	USED_MEMBER_NICK_OR_PHONE = 'Already used member nick or phone',
	NO_MEMBER_NICK = 'No member with that member nick!',
	BLOCKED_USER = 'You have been blocked!',
	WRONG_PASSWORD = 'Wrong password, try again!',
	NOT_AUTHENTICATED = 'You are not authenticated, please login first!',
	TOKEN_NOT_EXIST = 'Bearer Token is not provided!',
	ONLY_SPECIFIC_ROLES_ALLOWED = 'Allowed only for members with specific roles!',
	NOT_ALLOWED_REQUEST = 'Not Allowed Request!',
	PROVIDE_ALLOWED_FORMAT = 'Please provide jpg, jpeg or png images!',
	SELF_SUBSCRIPTION_DENIED = 'Self subscription is denied!',

	STORE_INCOMPLETE = 'Please complete your store profile before adding products',
	SIZE_REQUIRED = 'Clothing and shoes must include at least one size option',

	INVALID_DATE_RANGE = 'Event start date must be before end date',
	EVENT_HAS_ACTIVE_BOOKINGS = 'Cannot update event details when active bookings exist',

	RESERVATION_DATE_NOT_AVAILABLE = 'Selected date is not available for this event',
	RESERVATION_INSUFFICIENT_CAPACITY = 'Not enough spots remaining for this date',
	RESERVATION_NOT_FOUND = 'Reservation not found',
	RESERVATION_ALREADY_CANCELLED = 'Reservation is already cancelled',
}

export enum Direction {
	ASC = 1,
	DESC = -1,
}

registerEnumType(Direction, {
	name: 'Direction',
});
