import { ToastrService } from 'ngx-toastr';
import { AccountService } from './../../../services/account.service';
import { Component, OnInit } from '@angular/core';
import { UserLogin } from '@app/models/Identity/UserLogin';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  model = {} as UserLogin;

  constructor(private accountService: AccountService,
              private router: Router,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  public login(): void {
    this.spinner.show();
    this.accountService.login(this.model).subscribe({
      next: () => this.router.navigateByUrl('/dashboard'),
      error: (error: any) => {
        if(error.status == 401)
          this.toastr.error('Usuário ou Senha inválidos.', 'Erro!');
        else console.error(error);
      },
    }).add(() => this.spinner.hide());;
  }

}
