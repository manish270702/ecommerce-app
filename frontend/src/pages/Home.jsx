import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { mountProducts } from "../store/reducers/Product.Slice";
import { mountCart } from "../store/reducers/Cart.Slice";
import Product from "../components/Product";

function Home() {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.token.value);
  const products = useSelector((state) => state.product.value);
  const cartitems = useSelector((state) => state.cart.value);

  const [page, setPage] = useState(1);

  const getProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3002/api/products", {
        params: { page }, // params, not query
      });

      dispatch(mountProducts(res.data.products));
    } catch (err) {
      console.log(err);
    }
  };

  const getCart = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res.data);

      // Safe extraction
      const items = res.data.items?.[0]?.items || [];

      dispatch(mountCart(items));
    } catch (err) {
      console.log(err);
      dispatch(mountCart([]));
    }
  };

  const addTocart = async (product, quantity, discountedPrice) => {
    try {
      const res = await axios.post(
        "http://localhost:3001/api/cart",
        {
          productid: product._id,
          quantity,
          price: discountedPrice,
          stock: product.stock,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);

      dispatch(mountCart(res.data.item.items));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getProducts();
  }, [page]);

  useEffect(() => {
    if (token) {
      getCart();
    }
  }, [token]);

  return (
    <div>
      <Navbar />

      <div className="grid grid-cols-4 gap-4 p-4">
        {products.map((product) => {
          const cartItem = Array.isArray(cartitems)
            ? cartitems.find(
                (item) => item.productid === product._id
              )
            : undefined;

          return (
            <Product
              key={product._id}
              product={product}
              cartItem={cartItem}
              addTocart={addTocart}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Home;