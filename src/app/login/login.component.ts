import { Component } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginValues = {
    email: '',
    password: ''
  }
  constructor(private router: Router){}
  onLogin(form: any) {
    if (form.valid){
      console.log('form.value');
      this.router.navigate(['/']);
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
