import { LocalStorageService } from './../services/local-storage.service';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RequestUserService } from '../services/request-user.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  userName = ''
  token: string ="";

  constructor(private userService: RequestUserService, private localStorageService: LocalStorageService){ }

  ngOnInit(){
    this.localStorageService.watchStorage().subscribe({
      next: (change) => {
        this.refreshToken();
      },
      error: (err) => console.error('Storage watch error:', err)
    });
    this.refreshToken();
  }

  logout(){
    this.userService.logout(this.token);
    this.localStorageService.removeItem('Authorization');
  }


  private refreshToken() {
    this.token = this.localStorageService.getItem('Authorization');
    if(this.token){
      this.userService.getMyProfile(this.token).subscribe(res =>{
        const data:any = res.data;
        if(data) this.userName = data.firstName + data.lastName;
      });
    }
    else this.userName = '';
  }
}
