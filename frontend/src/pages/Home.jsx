import React from 'react'
import Navbar from '../components/Navbar'
import axios from "axios"
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { mountProducts } from '../store/reducers/Product.Slice'
import Product from '../components/Product'
import { mountCart } from '../store/reducers/Cart.Slice'

function Home() {

  const token = useSelector((state) => state.token.value)
  const products = useSelector((state) => state.product.value)
  const cartitems = useSelector((state) => state.cart.value)

  const [page, setPage] = useState(1)

  const dispatch = useDispatch()

  // console.log(token)

  const getProducts = async () => {
    try {
      let res = await axios.get("http://localhost:3002/api/products/", {
        query: { page }
      })
      console.log(res.data.products)
      dispatch(mountProducts(res.data.products))

    } catch (err) {
      console.log(err)
    }
  }

  const getCart = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/cart/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res.data.items[0].items);
      dispatch(mountCart(res.data.items[0].items));
    } catch (err) {
      console.log(err);
    }
  };

  const addTocart = async (product, quantity) => {
    try {
      const res = await axios.post("http://localhost:3001/api/cart/", {
        productid: product._id,
        quantity,
        price: product.price,
        stock: product.stock
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      console.log(res.data);
      console.log(res.data.item);
      console.log(res.data.item);
      console.log(res.data.item.items);

      dispatch(mountCart(res.data.item.items));
    } catch (err) {
      console.log(err)
    }
  }

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
          const cartItem = cartitems.find(
            (item) => item.productid === product._id
          );

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
  )
}

export default Home