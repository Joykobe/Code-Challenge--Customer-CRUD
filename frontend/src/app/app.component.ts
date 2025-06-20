import { Component } from '@angular/core';
import { Customer } from './services/customer.service';
import { RouterOutlet } from '@angular/router'; // ✅ This is the key fix

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // ✅ THIS is correct
  templateUrl: './app.component.html'
})
export class AppComponent {
  selectedCustomer?: Customer;
  viewingCustomer?: Customer;

  onEditCustomer(customer: Customer) {
    this.selectedCustomer = customer;
    this.viewingCustomer = undefined;
  }

  onViewCustomer(customer: Customer) {
    this.viewingCustomer = customer;
    this.selectedCustomer = undefined;
  }

  onFormSubmitted() {
    this.selectedCustomer = undefined;
    this.viewingCustomer = undefined;
  }
}

