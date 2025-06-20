import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Customer, CustomerService } from '../../services/customer.service';

@Component({
  standalone: true,
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  imports: [CommonModule, FormsModule, RouterModule],
})
export class CustomerFormComponent implements OnInit {
  customer: Customer = {
    first_name: '',
    last_name: '',
    email: '',
    contact_number: '',
  };

  isEdit = false;
  id: number | null = null;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
  const idParam = this.route.snapshot.paramMap.get('id');
  this.id = idParam ? parseInt(idParam, 10) : null;

  if (this.id) {
    this.isEdit = true;
    this.customerService.get(this.id).subscribe({
      next: (data) => {
        this.customer = data;
      },
      error: () => {
        this.errorMessage = 'Customer not found.';
      },
    });
  }
}


  saveCustomer(): void {
  if (this.isEdit && this.id) {
    this.customerService.update(this.id, this.customer).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        if (err.status === 422) {
          this.errorMessage = 'Email already exists or invalid input.';
        } else {
          this.errorMessage = 'Failed to update customer.';
        }
      },
    });
  } else {
    this.customerService.create(this.customer).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        if (err.status === 422) {
          this.errorMessage = 'Email already exists or invalid input.';
        } else {
          this.errorMessage = 'Failed to create customer.';
        }
      },
    });
  }
}

}
