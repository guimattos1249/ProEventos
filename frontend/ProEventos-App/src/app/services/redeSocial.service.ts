import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { RedeSocial } from '@app/models/RedeSocial';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RedeSocialService {
  baseURL = environment.apiURL + 'api/redesSociais';

  constructor(
    private http: HttpClient) { }


    /**
     *
     * @param origem recive 'palestrante' or 'evento' to do the request in api
     * @param id
     * @returns Observable of RedeSocial[]
     */
  public getRedesSociais(origem: string, id: number): Observable<RedeSocial[]> {
    let URL =
      id === 0
        ? `${this.baseURL}/${origem}`
        : `${this.baseURL}/${origem}/${id}`

    return this.http.get<RedeSocial[]>(URL).pipe(take(1));
  }

}
