import React, { useEffect } from "react";
import { BackTop } from "antd";
import { connect, useDispatch } from "react-redux";
import ModuleDrawerOverlay from "~/components/shared/drawers/modules/ModuleDrawerOverlay";
import { useRouter } from "next/router";
import { toggleDrawer } from "~/store/app/action";
import DrawerPrimary from "~/components/shared/drawers/DrawerPrimary";
import { useCookies } from "react-cookie";

import NavigationBottom from "~/components/shared/navigations/NavigationBottom";
import {
    setCartItems,
    setCompareItems,
    setWishlistTtems,
} from "~/store/ecomerce/action";
import Head from "next/head";
import ModuleCustomHead from "~/components/layouts/modules/ModuleCustomHead";
import Link from "next/link";

const MasterLayout = ({ children }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [cookies] = useCookies(["cart", "compare", "wishlist"]);

    function handleSetEcomercerParameters() {
        if (cookies) {
            if (cookies.cart) {
                dispatch(setCartItems(cookies.cart));
            }
            if (cookies.wishlist) {
                dispatch(setWishlistTtems(cookies.wishlist));
            }
            if (cookies.compare) {
                dispatch(setCompareItems(cookies.compare));
            }
        }
    }

    useEffect(() => {
        handleSetEcomercerParameters();
        const handleComplete = () => {
            dispatch(toggleDrawer(false));
        };
        // CRUCIAL
        setTimeout(function () {
            document.getElementById("__next").classList.add("loaded");
        }, 100);

        router.events.on("routeChangeStart", handleComplete);
        setTimeout(function () {
            document.getElementById("__next").classList.add("ps-loaded");
        }, 100);

        return () => {
            router.events.off("routeChangeStart", handleComplete);
        };
    }, []);

    return (
        <>
            {/* // responsible for fonts */}
            <ModuleCustomHead />
            <div className="ps-page">
                <div>
                    <Link href="https://wa.me/7387086440" legacyBehavior>
                        <a  class="whatsapp-button" target="_blank">
                            <i className="fa fa-whatsapp"></i>
                            Order on WhatsApp
                        </a>
                    </Link>
                    
                </div>
                {children}
                <NavigationBottom />
                <ModuleDrawerOverlay />
                <DrawerPrimary />
                <div id="loader-wrapper">
                    <div className="loader-section section-left"></div>
                    <div className="loader-section section-right"></div>
                </div>
                <BackTop>
                    <button className="ps-btn--backtop">
                        <i className="icon-arrow-up"></i>
                    </button>
                </BackTop>
                
            </div>
        </>
    );
};

export default connect()(MasterLayout);
