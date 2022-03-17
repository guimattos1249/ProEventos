import { environment } from './../../environments/environment';
import { Evento } from './../models/Evento';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable(
//  {providedIn: 'root'}
)
export class EventoService {
  baseURL = environment.apiURL + 'api/eventos';
  tokenHeader = new HttpHeaders({ 'Authorization': 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxIiwidW5pcXVlX25hbWUiOiJvZ3VpbWF0dG9zIiwibmJmIjoxNjQ3NTQ3NjEwLCJleHAiOjE2NDgxNTI0MTAsImlhdCI6MTY0NzU0NzYxMH0.814ecKfQIo8HlQ-hSmVsfMw5H9i-wdEakOtp2dapXOIocZf6Cail0XWQWKva_wWQBeAK8ynIxWejL5WERME68g' });

  constructor(private http: HttpClient) { }

  public getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.baseURL, { headers: this.tokenHeader })
      .pipe(take(1));
  }
  public getEventosByTema(tema: string): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseURL}/${tema}/tema`)
      .pipe(take(1));

  }

  public getEventoById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.baseURL}/${id}`)
      .pipe(take(1));
  }

  public post(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.baseURL, evento)
      .pipe(take(1));
  }

  public put(evento: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.baseURL}/${evento.id}`,  evento)
      .pipe(take(1));
  }

  public deleteEvento(id: number): Observable<any> {
    return this.http.delete<string>(`${this.baseURL}/${id}`)
      .pipe(take(1));
  }

  postUpload(eventoId: number, file: File): Observable<Evento> {
    const fileToUpload = file[0] as File;
    const formData = new FormData();
    formData.append('file', fileToUpload);


    return this.http.post<Evento>(`${this.baseURL}/upload-image/${eventoId}`, formData)
      .pipe(take(1));
  }

}
