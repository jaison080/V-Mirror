
export interface IProduct {
  id: number;
  name: string;
  type: number;
  image: string;
  isNewProduct: boolean;
  originalPrice: number;
  offerPrice: number;
}

export interface IProductProps {
  onSelect: (item: IProduct) => void;
  product: IProduct;
}

export interface ProductContextType {
  products: IProduct[];
  setProducts: React.Dispatch<IProduct[]>;
  shirts: IProduct[];
  pants: IProduct[];
  specs: IProduct[];
  allProducts: IProduct[];
  selectedShirt: IProduct;
  selectedPant: IProduct;
  selectedSpec: IProduct;
  selectShirt: (shirt: IProduct) => void;
  selectPant: (pant: IProduct) => void;
  selectSpec: (spec: IProduct) => void;
}
