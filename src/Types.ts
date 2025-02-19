export interface ApiResponseCreateLink {
    id: Number,
    ownerId?: Number,
    longURL: String,
    ShortURL: String,
    createdAt: String,
    updatedAt: String
}
export interface NavigationTypes {
    handlerClick: (query: string) => void
    activeTab: string
}
export interface userFieldProfile {
    first_name: string,
    last_name: string,
    email: string
}

export type ResponseTypeHistory = {
    id: string;
    ownerId: string;
    longURL: string;
    ShortURL: string;
    createdAt: string;
    _count: {
        visits: number;
    };
    owner: {
        id: string;
        name: string;
        email: string;
    };
};