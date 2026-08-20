import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { mountOrder } from '../store/reducers/Order.Slice';

function MyOrders() {
    const token = useSelector((state) => state.token.value);
    const dispatch = useDispatch();

    const getOrders = async () => {
        try {
            const orders = await axios.get("http://localhost:3003/api/orders", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(orders.data.order);
            dispatch(mountOrder(orders.data.order))

        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    getOrders();

    // console.log(orders)
  return (
    <div>MyOrders</div>
  )
}

export default MyOrders