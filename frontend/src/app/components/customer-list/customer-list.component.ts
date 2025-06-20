import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Customer, CustomerService } from '../../services/customer.service';

@Component({
  standalone: true,
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  imports: [CommonModule, FormsModule, RouterModule],
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  search = '';

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.fetchCustomers();
  }

  fetchCustomers(): void {
    this.customerService.getAll(this.search).subscribe(data => {
      this.customers = data;
    });
  }

  deleteCustomer(id: number): void {
  if (!id) return;

  this.customerService.delete(id).subscribe({
    next: () => {
      console.log(`Customer ${id} deleted`);
      this.fetchCustomers();
    },
    error: err => {
      console.error('Failed to delete customer:', err);
      alert('Delete failed. Check console.');
    }
  });
}
}
