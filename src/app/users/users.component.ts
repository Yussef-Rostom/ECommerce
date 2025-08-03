import { LocalStorageService } from './../services/local-storage.service';
import { RequestUserService } from './../services/request-user.service';
import { Component } from '@angular/core';
import { User } from '../interfaces/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  imports: [],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  users: User[] = [];
  originalUser: User[] = [];
  token: string = "";
  userId: string = "";
  errorMessage: string = "";
  successMessage: string = "";
  timer: any;
  interval: any;

  constructor(private localStorageService: LocalStorageService, private userService: RequestUserService, private router: Router) { }

  ngOnInit(){
    this.localStorageService.watchStorage().subscribe({
      next: (change) => {
        this.refreshPage();
      },
      error: (err) => console.error('Storage watch error:', err)
    });
    this.refreshPage();
  }

  refreshPage(){
    this.token = this.localStorageService.getItem('Authorization');
    if(this.token){
      this.userService.getMyProfile(this.token).subscribe(res =>{
        const data:any = res.data;
        this.userId = data._id;
        if(data && data.role == 'ADMIN') {
          this.userService.getAllUsers(this.token).subscribe({
            next: (res) => {
              this.users = res.data;
            },
            error: (err) => {
              this.errorMessage = err;
              setTimeout(() => {
                this.errorMessage = "";
                this.refreshPage();
              }, 5000)
            }
          })
        }
        else this.router.navigate(['/404']);
      });
    }
    else this.router.navigate(['/404']);
  }


  toggleUserRole(user: User): void {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    this.userService.updateUserRole(user, this.token, newRole).subscribe({
      next: (res) => {
        const index = this.users.findIndex(u => u._id === user._id);
        if (index !== -1) {
          this.users[index].role = newRole;
        }
      },
      error: (err) => {
        console.error('Failed to update user role', err);
        this.errorMessage = err;
        setTimeout(() => {
          this.errorMessage = "";
        }, 5000)
      }
    });
  }

   deleteUser(userId: string){
    let remTime = 10;
    this.errorMessage = `the user will deleted after ${remTime--} seconds`;
    this.interval = setInterval(()=>{
      this.errorMessage = `the user will deleted after ${remTime--} seconds`;
    }, 1000)

    this.originalUser = this.users;
    this.users = this.users.filter(i => i._id != userId);

    this.timer = setTimeout(() => {
      this.errorMessage = "";
      clearInterval(this.interval);
      this.userService.deleteUser(userId, this.token).subscribe({
        next: (res) => {
          this.successMessage = "user deleted successfully";
          setTimeout(() => {
            this.successMessage = "";
          }, 2000);        },
        error: (err) => {
          console.error("can't delete this product", err)
          this.errorMessage = "can't delete this product";
          setTimeout(() => {
            this.errorMessage = "";
          }, 2000);
        }
      })

    }, 10000);

  }

  cancelDeletion(){
    if(this.timer) clearTimeout(this.timer), this.timer = null;
    if(this.interval) clearInterval(this.interval), this.interval = null;
    this.errorMessage = "";
    this.users = this.originalUser;
  }
}
