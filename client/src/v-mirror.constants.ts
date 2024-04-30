import { IProduct } from "./v-mirror.interfaces";
import shirt1 from './assets/shirts/shirt1.png';
import shirt2 from './assets/shirts/shirt2.png';
import shirt51 from './assets/shirts/shirt51.png';
import pant7 from './assets/pants/pant7.png';
import pant21 from './assets/pants/pant21.png';

export const PRODUCTS: Array<IProduct> = [
  {
    id: 1,
    name: "Symbol Men's Polo T-Shirt",
    image: shirt1,
    type: 0,
    isNewProduct: true,
    originalPrice: 699,
    offerPrice: 599
  },
  {
    id: 2,
    name: "White Drawstring Pant",
    image: pant7,
    type: 1,
    isNewProduct: false,
    originalPrice: 599,
    offerPrice: 399
  },
  {
    id: 3,
    name: "Spec 1",
    image: "https://iili.io/JSKhCTQ.png",
    type: 2,
    isNewProduct: true,
    originalPrice: 499,
    offerPrice: 399
  },
  {
    id: 4,
    name: "Lymio Light Blue Shirt",
    image: shirt2,
    type: 0,
    isNewProduct: false,
    originalPrice: 799,
    offerPrice: 599
  },
  {
    id: 5,
    name: "Arctix Insulated Cargo Pants",
    image: pant21,
    type: 1,
    isNewProduct: true,
    originalPrice: 899,
    offerPrice: 699
  },
  {
    id: 6,
    name: "Spec 2",
    image: "https://iili.io/JSKhCTQ.png",
    type: 2,
    isNewProduct: false,
    originalPrice: 599,
    offerPrice: 499
  },{
    id: 7,
    name: "BULLMER Black Trendy T-Shirt",
    image: shirt51,
    type: 0,
    isNewProduct: true,
    originalPrice: 799,
    offerPrice: 499
  },
  // {
  //   id: 8,
  //   name: "Pant 3",
  //   image: "https://iili.io/JSKXDvf.png",
  //   type: 1,
  //   isNewProduct: false,
  //   originalPrice: 599,
  //   offerPrice: 299
  // },
  {
    id: 9,
    name: "Spec 3",
    image: "https://iili.io/JSKhCTQ.png",
    type: 2,
    isNewProduct: true,
    originalPrice: 199,
    offerPrice: 99
  },
  // {
  //   id: 10,
  //   name: "Leriya Fashion Shirt for Men",
  //   image: "https://iili.io/JUAXgIe.png",
  //   type: 0,
  //   isNewProduct: false,
  //   originalPrice: 299,
  //   offerPrice: 199
  // },
  // {
  //   id: 11,
  //   name: "Pant 4",
  //   image: "https://iili.io/JSKXDvf.png",
  //   type: 1,
  //   isNewProduct: true,
  //   originalPrice: 399,
  //   offerPrice: 199
  // },
  {
    id: 12,
    name: "Spec 4",
    image: "https://iili.io/JSKhCTQ.png",
    type: 2,
    isNewProduct: false,
    originalPrice: 299,
    offerPrice: 99
  }
];
