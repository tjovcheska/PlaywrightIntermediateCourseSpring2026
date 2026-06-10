import { APIRequestContext } from "@playwright/test";
import { BASE_URL } from "./constants";

export interface UserPayload {
    email: string,
    token: string,
    username: string,
    bio: string | null,
    image: string | null
}

export interface ArticlePayload {
    slug: string,
    title: string,
    description: string,
    body: string,
    tagList: string[],
    createdAt: string,
    updatedAt: string,
    favorited: boolean,
    favoritesCount: number,
    author: {
        username: string,
        bio: string | null,
        image: string | null,
        following: boolean
    }
}

export class APIClient {
    private token: string | null = null;

    constructor(private readonly request: APIRequestContext) {
    }

    private getToken(): string {
        if (!this.token) throw new Error('Not authenticated - call register() first')
        return this.token;
    }

    setToken(token: string): void {
        this.token = token;
    }

    private authHeader(): Record <string, string> {
        return { Authorization: `Token ${this.getToken()}` }
    }

    async register(username: string, email: string, password: string): Promise<UserPayload> {
        const response = await this.request.post(`${BASE_URL}/users`, {
            data: {
                user: {
                    username,
                    email,
                    password
                }
            }
        });

        const body = await response.json();
        if (!response.ok()) throw new Error(`register failed ${response.status()}: ${JSON.stringify(body)}`)
        this.token = body.user.token;

        return body.user as UserPayload
    }

    async createArticle(data: {
        title: string,
        description: string,
        body: string,
        tagList: string[]
    }): Promise<ArticlePayload> {
        const response = await this.request.post(`${BASE_URL}/articles`, {
            headers: this.authHeader(),
            data: {
                article: {
                    title: `Demo ${Date.now()}`,
                    description: `Desc ${Date.now()}`,
                    body: `Body ${Date.now()}`,
                    tagList: ['playwright']
        
                }
            }
        });

        const body = await response.json();
        if (!response.ok()) throw new Error(`createArticle failed ${response.status()}: ${JSON.stringify(body)}`)

        return body.article as ArticlePayload
    }

    async getArticle(slug: string): Promise<ArticlePayload> {
        const response = await this.request.get(`${BASE_URL}/articles/${slug}`, {
            headers: this.authHeader()
        });

        const body = await response.json();
        if (!response.ok()) throw new Error(`createArticle failed ${response.status()}: ${JSON.stringify(body)}`)

        return body.article as ArticlePayload
    }

    async deleteArticle(slug: string): Promise<void> {
        const response = await this.request.delete(`${BASE_URL}/articles/${slug}`, {
            headers: this.authHeader()
        });

        if (!response.ok()) throw new Error(`delete article failed ${response.status()}`)
    }
}