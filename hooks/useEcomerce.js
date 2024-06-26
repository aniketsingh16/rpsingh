import React, { useState, useEffect } from "react";
import ProductRepository from "~/repositories/ProductRepository";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import {
    setCompareItems,
    setWishlistTtems,
    setCartItems,
} from "~/store/ecomerce/action";
import { client } from "~/utilities/client";

export default function useEcomerce() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [cartItemsOnCookie] = useState(null);
    const [cookies, setCookie] = useCookies(["cart"]);
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        let isMounted = true;

        const fetchProducts = async () => {
            try {
                setLoading(true);
                const query = '*[_type == "allProducts"]'; // adjust the query as needed
                const all_products = await client.fetch(query);
                if (isMounted) {
                    setAllProducts(all_products);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchProducts();

        return () => {
            isMounted = false;
        };
    }, []);

    return {
        loading,
        cartItemsOnCookie,
        products,
        //payload = // cart values = [36,45,77];
        getProducts: (payload, group = "") => {
            console.log("Sanity se Productsssssssssss",payload)
            // const tempArray = [];
            if (payload && payload.length > 0) {
                // products
                const idsToFind = payload.map(obj => obj.id);
                const responseData = allProducts.filter(product => idsToFind.includes(product.id));
                // setProducts(responseData);
                console.log("TemppppppppAryyy",responseData);
                return responseData;

                // if (responseData && responseData.length > 0) {
                //     setProducts(responseData);
                // }
                //     if (group === "cart") {
                //         let cartItems = responseData;
                //         payload.forEach((item, index) => {
                //             if (item.id === cartItems[index].id) {
                //                 console.log(true);
                //                 cartItems[index].quantity = item.quantity;
                //             }
                //         });
                //         setProducts(cartItems);
                //     } else {
                //         setProducts(responseData);
                //     }
                //     setTimeout(
                //         function () {
                //             setLoading(false);
                //         }.bind(this),
                //         250
                //     );
                // }
            }
        },
        increaseQty: (payload, currentCart) => {
            let cart = [];
            if (currentCart) {
                cart = currentCart;
                const existItem = cart.find((item) => item.id === payload.id);
                if (existItem) {
                    existItem.quantity = existItem.quantity + 1;
                }
                setCookie("cart", cart, { path: "/" });
                dispatch(setCartItems(cart));
            }
            return cart;
        },

        decreaseQty: (payload, currentCart) => {
            let cart = [];
            if (currentCart) {
                cart = currentCart;
                const existItem = cart.find((item) => item.id === payload.id);
                if (existItem) {
                    if (existItem.quantity > 1) {
                        existItem.quantity = existItem.quantity - 1;
                    }
                }
                setCookie("cart", cart, { path: "/" });
                dispatch(setCartItems(cart));
            }
            return cart;
        },
        // newItem means Product on which we are on
        addItem: (newItem, items, group) => {
            let newItems = [];
            if (items) {
                newItems = items;
                const existItem = items.find((item) => item.id === newItem.id);
                if (existItem) {
                    if (group === "cart") {
                        existItem.quantity += newItem.quantity;
                    }
                } else {
                    newItems.push(newItem);
                }
            } else {
                newItems.push(newItem);
            }
            if (group === "cart") {
                setCookie("cart", newItems, { path: "/" });
                dispatch(setCartItems(newItems));
            }
            if (group === "wishlist") {
                console.log("NewwwwwwItems",newItems);
                console.log("Itemmmmm",newItem);
                setCookie("wishlist", newItems, { path: "/" });
                dispatch(setWishlistTtems(newItems));
            }

            if (group === "compare") {
                setCookie("compare", newItems, { path: "/" });
                dispatch(setCompareItems(newItems));
            }
            return newItems;
        },

        removeItem: (selectedItem, items, group) => {
            let currentItems = items;
            if (currentItems.length > 0) {
                const index = currentItems.findIndex(
                    (item) => item.id === selectedItem.id
                );
                currentItems.splice(index, 1);
            }
            if (group === "cart") {
                setCookie("cart", currentItems, { path: "/" });
                dispatch(setCartItems(currentItems));
            }

            if (group === "wishlist") {
                setCookie("wishlist", currentItems, { path: "/" });
                dispatch(setWishlistTtems(currentItems));
            }

            if (group === "compare") {
                setCookie("compare", currentItems, { path: "/" });
            }
        },

        removeItems: (group) => {
            if (group === "wishlist") {
                setCookie("wishlist", [], { path: "/" });
                dispatch(setWishlistTtems([]));
            }
            if (group === "compare") {
                setCookie("compare", [], { path: "/" });
                dispatch(setCompareItems([]));
            }
            if (group === "cart") {
                setCookie("cart", [], { path: "/" });
                dispatch(setCartItems([]));
            }
        },
    };
}
