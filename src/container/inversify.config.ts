import "reflect-metadata";
import BlogsRepository from "../features/blogs/blogs-repository";
import BlogsQueryRepository from "../features/blogs/blogs-query-repository";
import BlogsService from "../features/blogs/blogs-service";
import BlogsQueryService from "../features/blogs/blogs-query-service";
import BlogsController from "../features/blogs/blogs-controller";
import PostsRepository from "../features/posts/posts-repository";
import PostsQueryRepository from "../features/posts/posts-query-repository";
import PostsService from "../features/posts/posts-service";
import PostsQueryService from "../features/posts/posts-query-service";
import {PostsController} from "../features/posts/posts-controller";
import CommentsQueryRepository from "../features/comments/comments-query-repository";
import CommentsService from "../features/comments/comments-service";
import CommentsRepository from "../features/comments/comments-repository";
import CommentsQueryService from "../features/comments/comments-query-service";
import CommentsController from "../features/comments/сomments-controller";
import { Container } from "inversify";
import SecurityDevicesRepository from "../features/security-devices/security-devices.repository";
import SecurityDevicesService from "../features/security-devices/security-devices.service";
import SecurityDevicesController from "../features/security-devices/security-devices.controller";
import UsersRepository from "../features/users/users-repository";
import UsersQueryRepository from "../features/users/users-query-repository";
import UsersService from "../features/users/users-service";
import UsersQueryService from "../features/users/users-query-service";
import UsersController from "../features/users/users-controller";
import AuthService from "../features/auth/auth-service";
import AuthController from "../features/auth/auth-controller";
import {BcryptService} from "../features/auth/bcrypt-service";
import {JwtService} from "../features/auth/jwt-service";
import InvalidRefreshTokensRepository from "../features/auth/invalid-refresh-tokens.repository";
import InvalidRefreshTokenService from "../features/auth/invalid.refresh.tokens-service";
import {TYPES} from "../common/types/identifiers";
import {OAuthCredentials} from "../common/types/oauth.type";
import {GmailOAuthAdapter, IOAuthAdapter} from "../common/adapters/gmail.oauth.adapter";
import {EmailAdapter, IEmailAdapter} from "../common/adapters/email.adapter";
import {GmailOAuthManager, IOAuthManager} from "../common/managers/gmail.oauth.manager";
import {EmailManager, IEmailManager} from "../common/managers/email.manager";
import {EmailTemplateManager, IEmailTemplateManager} from "../common/managers/email-template.manager";
import LikesService from "../features/likes/likes-service";
import LikesRepository from "../features/likes/likes-repository";

const container: Container = new Container();

container.bind<BlogsRepository>(BlogsRepository).toSelf();
container.bind<BlogsQueryRepository>(BlogsQueryRepository).toSelf();
container.bind<BlogsService>(BlogsService).toSelf();
container.bind<BlogsQueryService>(BlogsQueryService).toSelf();
container.bind<BlogsController>(BlogsController).toSelf();

container.bind<PostsRepository>(PostsRepository).toSelf();
container.bind<PostsQueryRepository>(PostsQueryRepository).toSelf();
container.bind<PostsService>(PostsService).toSelf();
container.bind<PostsQueryService>(PostsQueryService).toSelf();
container.bind<PostsController>(PostsController).toSelf();

container.bind<CommentsRepository>(CommentsRepository).toSelf();
container.bind<CommentsQueryRepository>(CommentsQueryRepository).toSelf();
container.bind<CommentsService>(CommentsService).toSelf();
container.bind<CommentsQueryService>(CommentsQueryService).toSelf();
container.bind<CommentsController>(CommentsController).toSelf();

container.bind<SecurityDevicesRepository>(SecurityDevicesRepository).toSelf();
container.bind<SecurityDevicesService>(SecurityDevicesService).toSelf();
container.bind<SecurityDevicesController>(SecurityDevicesController).toSelf();

container.bind<UsersRepository>(UsersRepository).toSelf();
container.bind<UsersQueryRepository>(UsersQueryRepository).toSelf();
container.bind<UsersService>(UsersService).toSelf();
container.bind<UsersQueryService>(UsersQueryService).toSelf();
container.bind<UsersController>(UsersController).toSelf();

container.bind<AuthService>(AuthService).toSelf();
container.bind<AuthController>(AuthController).toSelf();
container.bind<BcryptService>(BcryptService).toSelf();
container.bind<JwtService>(JwtService).toSelf();
container.bind<InvalidRefreshTokensRepository>(InvalidRefreshTokensRepository).toSelf();
container.bind<InvalidRefreshTokenService>(InvalidRefreshTokenService).toSelf();

container.bind<OAuthCredentials>(TYPES.OAuthCredentials).toConstantValue({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN!
});

container.bind<string>(TYPES.GmailUser).toConstantValue(process.env.GMAIL_USER!);

container.bind<IOAuthAdapter>(TYPES.IOAuthAdapter).to(GmailOAuthAdapter).inSingletonScope();
container.bind<IEmailAdapter>(TYPES.IEmailAdapter).to(EmailAdapter).inSingletonScope();

container.bind<IOAuthManager>(TYPES.IOAuthManager).to(GmailOAuthManager).inSingletonScope();
container.bind<IEmailManager>(TYPES.IEmailManager).to(EmailManager).inSingletonScope();
container.bind<IEmailTemplateManager>(TYPES.IEmailTemplateManager).to(EmailTemplateManager).inSingletonScope();

container.bind<LikesService>(LikesService).toSelf();
container.bind<LikesRepository>(LikesRepository).toSelf();

export default container;