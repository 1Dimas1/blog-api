import {ResultStatus} from "../types/result.type";
import {HTTP_CODES} from "../http.statuses";

export const resultCodeToHttpException = (resultCode: ResultStatus): number => {
    switch (resultCode) {
        case ResultStatus.BadRequest:
            return HTTP_CODES.BAD_REQUEST_400;
        case ResultStatus.Forbidden:
            return HTTP_CODES.FORBIDDEN_403;
        case ResultStatus.Unauthorized:
            return HTTP_CODES.UNAUTHORIZED_401;
        case ResultStatus.NotFound:
            return HTTP_CODES.NOT_FOUND_404;
        case ResultStatus.Success:
            return HTTP_CODES.OK_200;
        default:
            return HTTP_CODES.INTERNAL_SERVER_ERROR_500;
    }
};