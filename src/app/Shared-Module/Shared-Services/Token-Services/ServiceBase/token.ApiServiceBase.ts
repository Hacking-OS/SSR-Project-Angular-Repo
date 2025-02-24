import { HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { PostType } from "../../Schemas/Enums/responseType.Enum";

export abstract class ApiServiceBase {
 protected abstract GetApiResponse<responseType, T>(path: string, obj: T, postTypeResponse?: PostType): Observable<responseType>;
//  protected abstract handleError<T = any>(error: HttpErrorResponse, continuation: () => Observable<T>): Observable<any>;
}
