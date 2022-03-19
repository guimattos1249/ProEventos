import { AccountService } from './../../services/account.service';
import { NavigationEnd, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  isCollapsed = true;
  public loggedUser = false;

  constructor(public accountService: AccountService,
              private router: Router) {
    router.events.subscribe(
      (val) => {
        if(val instanceof NavigationEnd) {
          this.accountService.currentUser$.subscribe(
            (value) => this.loggedUser = value !== null
          );
          console.log(this.loggedUser);
        }
      }
    )
  }

  ngOnInit() {
  }

  logout(): void {
    this.accountService.logout();
    this.router.navigateByUrl('/user/login');
    window.location.reload();
  }

  showMenu(): boolean {
    return this.router.url !== '/user/login';
  }

}
