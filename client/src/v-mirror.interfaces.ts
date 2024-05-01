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

export interface UserContextType {
  user: IUser;
  screenshots: IScreenshot[];
  setUser: React.Dispatch<IUser>;
  handleLogin: (user: IUser) => void;
  handleSignup: (user: IUser) => void;
  handleToast: (toast: IToast) => void;
  handleLogout: () => void;
  getAccessToken: () => string;
  isUserLoggedIn: () => boolean;
  getScreenshots: () => void;
  uploadScreenshot: (formData: FormData) => void;
}

export interface IUser {
  id?: string;
  name: string;
  email: string;
  password: string;
}

export interface IToast {
  title: string;
  description?: string;
  isError: boolean;
}

export interface IScreenshot {
  filename: string;
  publicUrl: string;
  userId: number;
}
