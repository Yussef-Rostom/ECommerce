import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RequestUserService } from '../services/request-user.service';
import { LocalStorageService } from '../services/local-storage.service';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-edit-user',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent {

  userForm: FormGroup;
  token: string  = "";
  email: string = "";
  successMessage: string = "";
  errorMessage: string = "";


  constructor(private fb: FormBuilder, private router: Router, private userService: RequestUserService, private localStorageService: LocalStorageService){
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^0(1[0-2]|15)\d{8}$/)]],
      password: ['', [Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[*@%$#])[A-Za-z\d*@%$#]{8,}$/)]],
    })
  }

  ngOnInit(){
    this.localStorageService.watchStorage().subscribe({
      next: (change) => {
        this.refreshToken();
      },
      error: (err) => console.error('Storage watch error:', err)
    });
    this.refreshToken();
  }


  private refreshToken() {
    this.token = this.localStorageService.getItem('Authorization');
    if(this.token){
      this.userService.getMyProfile(this.token).subscribe(res =>{
        const data:any = res.data;
        if(data) {
          this.email = data.email;
          this.userForm.setValue({
            name: data.firstName + " " + data.lastName,
            phoneNumber: data.phoneNumber,
            password: ""
          })
        }
      });
    }
    else this.router.navigate(['/login'])
  }

  get formControls(){
    return this.userForm.controls;
  }

  updateUser(){
    let user: User = this.createUser(this.userForm.value);
    this.userService.updateMyProfile(user, this.token).subscribe({
      next: (res: any) => {
        this.successMessage = 'Updated successful';
        this.userForm.disable();
        setTimeout(() => {
          this.successMessage = '';
          this.login({'email': this.email, 'password': this.userForm.value.password})
          this.router.navigate(['/']);
        }, 1000);
      },
      error: (error) => {
        if (error.status === 400) {
          this.errorMessage = error.error.message || 'Invalid user data';
        }
        else {
          this.errorMessage = 'An unexpected error occurred';
        }
        this.userForm.reset();
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  login(user: any){
    this.userService.login(user).subscribe({
        next: (res) => {
          this.localStorageService.setItem('Authorization', res.token);
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
  }

  createUser(data: any): Required<User>{
    let names = data.name.split(' ')
    delete data.name;
    data.firstName = names[0];
    data.lastName = names.length>1 ? names[names.length - 1] : " ";
    if (!data.password) delete data.password;
    return {
      ...data,
      role: data.role ?? 'USER'
    };
  }

}
