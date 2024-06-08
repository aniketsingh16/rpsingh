import React, { useEffect } from "react";
import Container from "~/components/layouts/Container";
import BreadCrumb from "~/components/elements/BreadCrumb";
import Shop from "~/components/partials/shop/Shop";
import { connect } from "react-redux";
import { caculateArrayQuantity } from "~/utilities/ecomerce-helpers";
import useEcomerce from "~/hooks/useEcomerce";
import ModuleEcomerceWishlist from "~/components/ecomerce/modules/ModuleEcomerceWishlist";
import SkeletonTable from "~/components/elements/skeletons/SkeletonTable";
import { Result } from "antd";
import { client } from "~/utilities/client";

const breadcrumb = [
    {
        text: "Home",
        url: "/",
    },
    {
        text: "Shop",
        url: "/shop",
    },
    {
        text: "Wishlist",
    },
];
// cart values = []36,45,77;
const WishlistScreen = ({ ecomerce, allProducts }) => {
    const { loading, products, getProducts } = useEcomerce();
    console.log("ollllllllllllllllllllllll",allProducts)
    console.log("ECOMM WLIST ITEMSSSSS",ecomerce.wishlistItems)
    // const nayeProducts = getProducts(ecomerce.wishlistItems);
    // console.log("SANITY  SE PRODUCTSSS",nayeProducts)
    // useEffect(() => {
    //     if (ecomerce) {
    //         getProducts(ecomerce.wishlistItems);
    //         console.log("Usefeect se..",getProducts(ecomerce.wishlistItems))
    //     }
    // }, [ecomerce]);
    // view
    let totalView, wishListView;
    if (allProducts && allProducts.length > 0) {
        totalView = caculateArrayQuantity(allProducts);
        wishListView = <ModuleEcomerceWishlist source={allProducts} />;
    } else {
        if (loading) {
            wishListView = <SkeletonTable rows={1} />;
        } else {
            wishListView = (
                <Result status="warning" title="No product in your wishlist." />
            );
        }
    }
    //view
    return (
        <Container title="Wishlist">
            <div className="ps-page ps-page--inner">
                <div className="container">
                    <div className="ps-page__header">
                        <BreadCrumb breacrumb={breadcrumb} />
                        <h1 className="ps-page__heading">
                            Wishlist
                            {totalView ? <sup>({totalView})</sup> : ""}
                        </h1>
                    </div>
                    <div className="ps-page__content">{wishListView}</div>
                </div>
            </div>
        </Container>
    );
};
export default connect((state) => state)(WishlistScreen);

export const getServerSideProps = async () => {
    const query = '*[_type == "allProducts" && featured == true]'
    const allProducts = await client.fetch(query)
    return {
        props : {
            allProducts,
        },
    }
}