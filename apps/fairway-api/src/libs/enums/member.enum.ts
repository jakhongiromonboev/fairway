import { registerEnumType } from '@nestjs/graphql';

export enum MemberType {
	USER = 'USER',
	AGENT = 'AGENT',
	ADMIN = 'ADMIN',
}
registerEnumType(MemberType, {
	name: 'MemberType',
});

export enum MemberStatus {
	ACTIVE = 'ACTIVE',
	BLOCK = 'BLOCK',
	DELETE = 'DELETE',
}
registerEnumType(MemberStatus, {
	name: 'MemberStatus',
});

export enum MemberAuthType {
	EMAIL = 'EMAIL',
	PHONE = 'PHONE',
}
registerEnumType(MemberAuthType, {
	name: 'MemberAuthType',
});

/** AGENT STORE LOCATION **/
export enum AgentStoreRegion {
	SEOUL = 'SEOUL',
	BUSAN = 'BUSAN',
	INCHEON = 'INCHEON',
	DAEGU = 'DAEGU',
	GWANGJU = 'GWANGJU',
	DAEJEON = 'DAEJEON',
	JEJU = 'JEJU',
}
registerEnumType(AgentStoreRegion, {
	name: 'AgentStoreRegion',
});
