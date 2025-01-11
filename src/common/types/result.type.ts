export enum ResultStatus {
    Success = 'Success',
    BadRequest = 'BadRequest',
    Unauthorized = 'Unauthorized',
    Forbidden = 'Forbidden',
    NotFound = 'NotFound',
    ServerError = 'ServerError'
}

export type ExtensionType = {
    field: string | null;
    message: string;
};

export type Result<T = null> = {
    status: ResultStatus;
    errorMessage?: string;
    extensions: ExtensionType[];
    data: T | null;
};
