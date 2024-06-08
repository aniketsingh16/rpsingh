import React from "react";
import Link from "next/link";

const Logo = ({ url = "/", type = "default" }) => {
    if (type == "white") {
        return (
            <Link href={url}>
                <a className="ps-logo">
                    <img src="/static/img/health-first.png" alt="logo" />
                </a>
            </Link>
        );
    } else {
        return (
            <Link href={url}>
                <a className="ps-logo">
                    <img src="/static/img/health-first.png" alt="logo" />
                </a>
            </Link>
        );
    }
};

export default Logo;
