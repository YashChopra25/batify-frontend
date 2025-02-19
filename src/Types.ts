export interface ApiResponseCreateLink {
    id: number,
    ownerId?: number,
    longURL: string,
    ShortURL: string,
    createdAt: string,
    updatedAt: string
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