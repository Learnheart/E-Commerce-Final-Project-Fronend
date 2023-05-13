import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { map } from 'rxjs/operators';
import { Product } from '../_model/product.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ImageProcessingService } from '../image-processing.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  pageNumber: number = 0;
  productDetails = [];
  showLoadButton = false;

  constructor(
    private productService: ProductService,
    private imageProcessingService: ImageProcessingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  searchByKeyword(searchkeyword) {
    console.log(searchkeyword);
    this.pageNumber = 0;
    this.productDetails = [];
    this.getAllProducts(searchkeyword);
  }

  public getAllProducts(searchKey: string = '') {
    this.productService
      .getAllProducts(this.pageNumber, searchKey)
      .pipe(
        map((x: Product[], i) =>
          x.map((product: Product) =>
            this.imageProcessingService.createImages(product)
          )
        )
      )
      .subscribe(
        (resp: Product[]) => {
          console.log(resp);
          if (resp.length == 12) {
            this.showLoadButton = true;
          } else {
            this.showLoadButton = false;
          }
          // load more -> concatenate current page
          resp.forEach((p) => this.productDetails.push(p));
          // Load more -> move to next page
          // this.productDetails = resp;
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      );
  }

  public loadMoreProduct() {
    this.pageNumber = this.pageNumber + 1;
    this.getAllProducts();
  }

  showProductDetails(productId) {
    this.router.navigate(['/productViewDetails', { productId: productId }]);
  }

  // Function for sharing in footer
  // showShare = false;
  // inputValue = '';
  // shareLink = document.querySelector('.share-container');

  // share(): void {
  //   this.showShare = true;
  //   this.shareLink.classList.add('open');
  //   console.log('Sharing message:', this.inputValue);
  // }
  // closeShare() {
  //   this.shareLink.classList.remove('open');
  //   this.showShare = false;
  // }

  shareLink() {
    const link = 'https://www.example.com';

    const width = 600;
    const height = 400;
    const left = screen.width / 2 - width / 2;
    const top = screen.height / 2 - height / 2;
    window.open(
      link,
      'Share Window',
      `width=${width}, height=${height}, left=${left}, top=${top}`
    );
  }
}
