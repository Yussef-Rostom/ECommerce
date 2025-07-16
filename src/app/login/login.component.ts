import { LocalStorageService } from './../services/local-storage.service';
import { Component } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RequestUserService } from '../services/request-user.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  successMessage = '';
  errorMessage = '';
  loginValues = {
    email: '',
    password: ''
  }
  constructor(private router: Router, private userService: RequestUserService, private localStorageService: LocalStorageService){}


  onLogin(form: any) {
    if (form.valid){
      this.userService.login(form.value).subscribe({
        next: (res) => {
          this.localStorageService.setItem('Authorization', res.token);
          this.successMessage = 'Login successful';
          setTimeout(() => {
            this.successMessage = '';
            this.router.navigate(['/']);
          }, 1000);
        },
        error: (error) => {
          if (error.status === 400) {
            this.errorMessage = error.error.message || 'Invalid email or password';
          }
          else {
            this.errorMessage = 'An unexpected error occurred';
          }
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      });
      return;
    }
    alert('enter valid mail and password');
    form.resetForm();
    this.loginValues = {
      email: '',
      password: ''
    }
  }
}
