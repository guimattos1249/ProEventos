import { environment } from '@environments/environment';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaginatedResult, Pagination } from '@app/models/Pagination';
import { Palestrante } from '@app/models/Palestrante';
import { PalestranteService } from '@app/services/palestrante.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-palestrante-lista',
  templateUrl: './palestrante-lista.component.html',
  styleUrls: ['./palestrante-lista.component.scss']
})
export class PalestranteListaComponent implements OnInit {

  termChanged: Subject<string> = new Subject<string>();
  public pagination = {} as Pagination;
  public palestrantes: Palestrante[] = [];
  public palestranteId: number = 0;

  constructor(
    private palestranteService: PalestranteService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router) { }

  ngOnInit() {
    this.pagination = {currentPage: 1, itemsPerPage: 3, totalItems: 1} as Pagination;
    this.getPalestrantes();
  }

  public filteredPalestrantes(event: any): void {
    if(this.termChanged.observers.length === 0) {
      this.termChanged.pipe(debounceTime(500)).subscribe(
        filtrarPor => {
          this.spinner.show();
          this.palestranteService.getPalestrantes(
            this.pagination.currentPage,
            this.pagination.itemsPerPage,
            filtrarPor
          ).subscribe({
            next: (paginatedResult: PaginatedResult<Palestrante[]>) => {
              this.palestrantes = paginatedResult.result;
              this.pagination  = paginatedResult.pagination;
            },
            error: (error: any) => this.toastr.error('Erro ao carregar os palestrantes.', 'Erro!'),
          }).add(() => this.spinner.hide())
        }
      );
    }
    this.termChanged.next(event.value);
  }

  public getImagemURL(imageName: string): string {
    if(imageName)
      return environment.apiURL + `resources/perfil/${imageName}`;
    else
      return `./assets/img/perfil.png`;
  }

  public getPalestrantes(): void {
    this.spinner.show();
    this.palestranteService.getPalestrantes(this.pagination.currentPage, this.pagination.itemsPerPage).subscribe({
      next: (paginatedResult: PaginatedResult<Palestrante[]>) => {
        this.palestrantes = paginatedResult.result;
        this.pagination  = paginatedResult.pagination;
      },
      error: (error: any) => this.toastr.error('Erro ao carregar os palestrantes.', 'Erro!'),
    }).add(() => this.spinner.hide());
  }
}
