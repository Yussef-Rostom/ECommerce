import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RequestProductsService } from '../services/request-products.service';
import { RequestUserService } from '../services/request-user.service';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-add-product',
  imports: [ReactiveFormsModule,],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {

  @ViewChild('fileInput') fileInput!: ElementRef;
  productForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  categories = [
    { id: 'Electronics', value: 'Electronics', label: 'Electronics' },
    { id: 'Clothing', value: 'Clothing', label: 'Clothing' },
    { id: 'Cars', value: 'Cars', label: 'Cars' },
    { id: 'Books', value: 'Books', label: 'Books' },
    { id: 'Toys', value: 'Toys', label: 'Toys' },
    { id: 'Sports', value: 'Sports', label: 'Sports' },
  ];

  constructor(private fb: FormBuilder, private router: Router, private productsService: RequestProductsService, private userService: RequestUserService, private localStorageService: LocalStorageService){
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      photo: [null]
    })
  }

  ngOnInit(){
    const token = this.localStorageService.getItem('Authorization');
    if(token){
      this.userService.getMyProfile(token).subscribe({
        next: (response) => {
        },
        error: (error) => {
          this.errorMessage = 'You should login first';
          setTimeout(() => {
            this.errorMessage = '';
            this.router.navigate(['/login']);
          }, 3000);
        }
      });
    }
    else {
      this.errorMessage = 'You should login first';
      setTimeout(() => {
        this.errorMessage = '';
        this.router.navigate(['/login']);
      }, 3000);
    }
  }

  get formControls(){
    return this.productForm.controls;
  }


  addProduct(): void {

    if (this.productForm.valid) {
      const formData = new FormData();

      formData.append('name', this.productForm.value.name);
      formData.append('description', this.productForm.value.description);
      formData.append('price', this.productForm.value.price);
      formData.append('category', this.productForm.value.category);

      const photoControl = this.productForm.get('photo');
      if (photoControl?.value) {
        formData.append('image', photoControl.value);
      }
      else {
        this.errorMessage = 'You Should add image';
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
        return;
      }

      this.productsService.addProduct(formData, this.localStorageService.getItem('Authorization')).subscribe({
        next: (response) => {
          this.successMessage = 'Product added successfully';
          setTimeout(() => {
            this.successMessage = '';
            this.router.navigate(['/']);
          }, 1000);
        },
         error: (error) => {
          if (error.status === 400 && error.error?.errors) {
            const firstError = error.error.errors[0];
            this.errorMessage = firstError.message || 'Invalid data submitted';
            if (firstError.field) {
              const control = this.productForm.get(firstError.field);
              if (control) {
                control.setErrors({ serverError: firstError.message });
              }
            }
          } else {
            this.errorMessage = error.error?.message || 'Failed to create product';
          }
          setTimeout(() => {
            this.errorMessage = '';
            this.productForm.reset();
          }, 3000);
        }
      });
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      this.productForm.get('photo')?.setErrors({ invalidType: true });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.productForm.get('photo')?.setErrors({ maxSize: true });
      return;
    }

    this.productForm.patchValue({ photo: file });
  }

}
