export interface IProduct {
  id: number;
  name: string;
  type: number;
  publicUrl: string;
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
  isShirtSelected: boolean;
  setIsShirtSelected: React.Dispatch<boolean>;
  isPantSelected: boolean;
  setIsPantSelected: React.Dispatch<boolean>;
  isSpecSelected: boolean;
  setIsSpecSelected: React.Dispatch<boolean>;
  shirts: IProduct[];
  pants: IProduct[];
  specs: IProduct[];
  allProducts: IProduct[];
  selectedShirt?: IProduct;
  selectedPant?: IProduct;
  selectedSpec?: IProduct;
  selectShirt: (shirt: IProduct) => void;
  selectPant: (pant: IProduct) => void;
  selectSpec: (spec: IProduct) => void;
  addProduct: (productData: Partial<IAddProductForm>) => Promise<boolean>;
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

export interface IFormProps {
  formData: Partial<IAddProductForm>;
  setFormData: (
    updateFunction: (
      prevState: Partial<IAddProductForm>
    ) => Partial<IAddProductForm>
  ) => void;
}

export interface IAddProductForm {
  name: string;
  originalPrice: string;
  type: number;
  isNewProduct: boolean;
  image?: File;
  offerPrice: string;
}
