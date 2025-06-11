"use client"

import React, { useState, useEffect } from "react";
import MainHeader from "@/components/MainHeader";
import OfferCard from "@/components/OfferCard";

export default function Homepage() {
    return (
        <div>
            <MainHeader />
            <main className="container mx-auto px-4 py-8">
            <OfferCard
                logoSrc="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png"
                date="1 day ago"
                title="Software Engineer Intern"
                company="Google"
                location="San Francisco, CA"
                tags={[
                    { label: "Software", type: "category" },
                    { label: "Full Time", type: "common" },
                    { label: "On Site", type: "common" },
                    { label: "Full Stack", type: "common" },
                ]}
            ></OfferCard>

            </main>
        </div>
    )
}