import { LocalStorageService } from './../services/local-storage.service';
import { RequestProductsService } from './../services/request-products.service';
import { Component } from '@angular/core';
import {Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../interfaces/user';
import { RequestUserService } from '../services/request-user.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm : FormGroup;
  successMessage = "";
  errorMessage = "";


  constructor(private fb: FormBuilder, private router: Router, private userService: RequestUserService, private localStorageService: LocalStorageService){
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^0(1[0-2]|15)\d{8}$/)]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[*@%$#])[A-Za-z\d*@%$#]{8,}$/)]],
    })
  }

  get formControls(){
    return this.registerForm.controls;
  }

  register(){
    let user: User = this.createUser(this.registerForm.value);
    this.userService.register(user).subscribe({
      next: (res: any) => {
        this.localStorageService.setItem('Authorization', res.token);
        this.successMessage = 'Registration successful';
        this.registerForm.disable();
        setTimeout(() => {
          this.errorMessage = '';
          this.router.navigate(['/']);
        }, 1000);
      },
      error: (error) => {
        if (error.status === 400) {
          this.errorMessage = error.error.message || 'Invalid registration data';
        }
        else {
          this.errorMessage = 'An unexpected error occurred';
        }
        this.registerForm.reset();
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });


  }

  createUser(data: any): Required<User>{
    let names = data.name.split(' ')
    delete data.name;
    data.firstName = names[0];
    data.lastName = names.length>1 ? names[names.length - 1] : " ";
    return {
      ...data,
      role: data.role ?? 'USER'
    };
  }
}
