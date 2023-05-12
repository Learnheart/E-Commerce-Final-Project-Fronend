import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
})
export class OrderDetailsComponent implements OnInit {
  dataSource = [];
  displayedColumns: string[] = [
    'Id',
    'Product Name',
    'Name',
    'Address',
    'Contact No.',
    'Status',
    'Action',
  ];

  status: string = 'All';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getAllOrderDetailsForAdmin(this.status);
  }

  getAllOrderDetailsForAdmin(status: string) {
    this.productService.getAllOrderDetailsForAdmin(status).subscribe(
      (resp) => {
        console.log(resp);
        this.dataSource = resp;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  markAsDelivered(orderId) {
    console.log(orderId);
    this.productService.markAsDelivered(orderId).subscribe(
      (response) => {
        console.log(response);
        this.getAllOrderDetailsForAdmin(this.status);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
