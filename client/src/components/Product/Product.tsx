import { MouseEventHandler, useContext } from "react";
import { ProductContext } from "../../contexts/ProductContext";
import {
  IProduct,
  IProductProps,
  ProductContextType,
} from "../../v-mirror.interfaces";
import "./Product.css";

function Product({ product, onSelect }: IProductProps) {
  const { selectedShirt, selectedPant, selectedSpec }: ProductContextType =
    useContext(ProductContext);

  const isSelectedProduct = (product: IProduct): boolean => {
    return (
      selectedPant.id === product.id ||
      selectedShirt.id === product.id ||
      selectedSpec.id === product.id
    );
  };

  const handleSelect = (
    product: IProduct
  ): MouseEventHandler<HTMLButtonElement> => {
    return () => onSelect(product);
  };

  return (
    <div className="product-card spacing">
      {product.isNewProduct && <div className="badge">New Product</div>}
      <div className="product-thumb">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-details">
        <h4>
          <a href="/">{product.name}</a>
        </h4>
        <div className="product-bottom-details">
          <div className="product-price">
            <small>₹ {product.originalPrice}</small>₹ {product.offerPrice}
          </div>
          <div className="product-links">
            {!isSelectedProduct(product) ? (
              <button
                className="try_now_button"
                onClick={handleSelect(product)}
                disabled={isSelectedProduct(product)}
              >
                Try Now
              </button>
            ) : (
              <div className="selected_text">Selected</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
