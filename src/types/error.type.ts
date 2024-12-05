type ErrorMessage = {
    field: string;
    message: string;
};

type ErrorResponse = {
    errorsMessages: ErrorMessage[];
};