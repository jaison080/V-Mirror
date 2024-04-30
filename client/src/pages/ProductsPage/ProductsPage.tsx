import { useContext } from "react";
import Product from "../../components/Product/Product";
import { ProductContext } from "../../contexts/ProductContext";
import { useNavigate } from "react-router-dom";
import { IProduct, ProductContextType } from "../../v-mirror.interfaces";
import "./ProductsPage.css";

const ProductsPage = () => {
  const navigate = useNavigate();
  const {
    shirts,
    pants,
    // specs,
    selectShirt,
    selectPant,
    // selectSpec,
  }: ProductContextType = useContext(ProductContext);

  return (
    <div
      style={{
        padding: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily: "'Brush Script MT', cursive",
            fontSize: "30px",
            fontWeight: "800",
          }}
        >
          V - Mirror
        </div>
        <button className="try_on_button" onClick={() => navigate("/stream")}>
          Try-On
        </button>
      </div>
      <div
        style={{
          paddingTop: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "25px",
              fontWeight: "800",
            }}
          >
            Shirts
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {shirts.map((shirt: IProduct) => {
              return <Product product={shirt} onSelect={selectShirt} />;
            })}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "25px",
              fontWeight: "800",
            }}
          >
            Pants
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {pants.map((pant: IProduct) => {
              return <Product product={pant} onSelect={selectPant} />;
            })}
          </div>
        </div>
        {/* <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "25px",
              fontWeight: "800",
            }}
          >
            Specs
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {specs.map((spec: IProduct) => {
              return <Product product={spec} onSelect={selectSpec} />;
            })}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ProductsPage;
