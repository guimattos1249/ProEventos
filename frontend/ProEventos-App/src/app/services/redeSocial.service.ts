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
     * @param id if origem == evento the id will be a reference to eventoId
     * @returns Observable of RedeSocial[]
     */
  public getRedesSociais(origem: string, id: number): Observable<RedeSocial[]> {
    let URL =
      id === 0
        ? `${this.baseURL}/${origem}`
        : `${this.baseURL}/${origem}/${id}`

    return this.http.get<RedeSocial[]>(URL).pipe(take(1));
  }

  /**
     *
     * @param origem recive 'palestrante' or 'evento' to do the request in api
     * @param id if origem == evento the id will be a reference to eventoId
     * @param redesSociais recive a list of RedeSocial to save
     * @returns Observable of RedeSocial[]
     */
  public saveRedesSociais(
    origem: string,
    id: number,
    redesSociais: RedeSocial[]
  ): Observable<RedeSocial[]> {
    let URL =
      id === 0
        ? `${this.baseURL}/${origem}`
        : `${this.baseURL}/${origem}/${id}`

    return this.http.put<RedeSocial[]>(URL, redesSociais).pipe(take(1));
  }

  /**
     *
     * @param origem recive 'palestrante' or 'evento' to do the request in api
     * @param id if origem == evento the id will be a reference to eventoId
     * @param redeSocialId recive the id of RedeSocial to delete
     * @returns Observable of any
     */
   public deleteRedeSocial(
    origem: string,
    id: number,
    redeSocialId: number
  ): Observable<any> {
    let URL =
      id === 0
        ? `${this.baseURL}/${origem}/${redeSocialId}`
        : `${this.baseURL}/${origem}/${id}/${redeSocialId}`

    return this.http.delete<RedeSocial[]>(URL).pipe(take(1));
  }

}
