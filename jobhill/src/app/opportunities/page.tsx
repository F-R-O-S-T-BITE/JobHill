"use client"

import React, { useState, useEffect } from "react";
import HeaderWrapper from "@/components/HeaderWrapper";
import OfferCardHolder from "@/components/OfferCardHolder";
import DataFilterPanel from "@/components/DataFilter";
import { OfferCardProps } from "@/interfaces/OfferCard";


const Offers: OfferCardProps[] = [
    {
        logoSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png",
        publish_date: "1 day ago",
        title: "Software Engineer Intern",
        company: "Google",
        location: ["San Francisco, CA"],
        tags: [
            { label: "Software", type: "category" },
            { label: "Full Time", type: "hours_job_type" },
            { label: "On Site", type: "modality" },
            { label: "Full Stack", type: "work_branch" },
        ],
    },
    {
        logoSrc: "data:image/png;base64,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",
        publish_date: "1 day ago",
        title: "Compiler Engineer Intern",
        company: "Nvidia",
        location: ["San Francisco, CA"],
        tags: [
            { label: "Software", type: "category" },
            { label: "Full Time", type: "hours_job_type" },
            { label: "On Site", type: "modality" },
            { label: "Computer Science", type: "work_branch" },
        ],
    },
    {
        logoSrc: "https://cdn-icons-png.flaticon.com/512/25/25231.png",
        publish_date: "1 day ago",
        title: "Software Engineer Intern",
        company: "Github",
        location: ["San Francisco, CA","San Francisco, CA","San Francisco, CA","San Francisco, CA"],
        tags: [
            { label: "Software", type: "category" },
            { label: "Full Time", type: "hours_job_type" },
            { label: "Remote", type: "modality" },
            { label: "Full Stack", type: "work_branch" },
            { label: "No Sponsorship", type: "extra_critical_requirements" },
        ],
    },
    {
        logoSrc: "https://1000marcas.net/wp-content/uploads/2020/03/logo-Cisco.png",
        publish_date: "1 day ago",
        title: "Full Stack Intern Meraki",
        company: "Cisco",
        location: ["San Francisco, CA"],
        tags: [
            { label: "Software", type: "category" },
            { label: "Full Time", type: "hours_job_type" },
            { label: "On Site", type: "modality" },
            { label: "Full Stack", type: "work_branch" },
            { label: "US Citizenship", type: "extra_critical_requirements" },
        ],
    },
    {
        logoSrc: "https://upload.wikimedia.org/wikipedia/commons/7/78/Ubisoft_logo.svg",
        publish_date: "2 day ago",
        title: "Gameplay Programmer Intern",
        company: "Ubisoft",
        location: ["San Francisco, CA"],
        tags: [
            { label: "Software", type: "category" },
            { label: "Full Time", type: "hours_job_type" },
            { label: "On Site", type: "modality" },
            { label: "Other", type: "work_branch" },
        ],
    },
    {
        logoSrc: "https://static-00.iconduck.com/assets.00/notion-icon-1965x2048-gj5ss1j1.png",
        publish_date: "1 day ago",
        title: "Software Engineer, AI Intern",
        company: "Notion",
        location: ["San Francisco, CA"],
        tags: [
            { label: "Software", type: "category" },
            { label: "Full Time", type: "hours_job_type" },
            { label: "On Site", type: "modality" },
            { label: "AI", type: "work_branch" },
        ],
    },
    {
        logoSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/DigitalOcean_logo.svg/2048px-DigitalOcean_logo.svg.png",
        publish_date: "1 day ago",
        title: "Software Engineer, Intern",
        company: "DigitalOcean",
        location: ["San Francisco, CA"],
        tags: [
            { label: "Software", type: "category" },
            { label: "Full Time", type: "hours_job_type" },
            { label: "On Site", type: "modality" },
            { label: "ComputerScience", type: "work_branch" },
        ],
    },
    {
        logoSrc: "https://1000logos.net/wp-content/uploads/2017/04/Oracle-Logo-1.png",
        publish_date: "1 day ago",
        title: "Software Development Intern",
        company: "Oracle",
        location: ["San Francisco, CA"],
        tags: [
            { label: "Software", type: "category" },
            { label: "Full Time", type: "hours_job_type" },
            { label: "On Site", type: "modality" },
            { label: "Computer Science", type: "work_branch" },
            { label: "No Sponsorship", type: "extra_critical_requirements"},
        ],
    },
];

export default function OpportunitiesPage() {
    const [filteredOffers, setFilteredOffers] = useState<OfferCardProps[]>(Offers);

    return (
        <div className="bg-white min-h-screen">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 max-w-screen-2xl mx-auto px-4">
    
                {/* Placeholder */}
                <div className="flex lg:w-[40vw] xl:w-[25vw] flex justify-center mb-12">
                    <DataFilterPanel data={Offers} onFilter={setFilteredOffers} />
                </div>

                {/* Cards */}
                {filteredOffers.length === 0 ?(
                    <div className="w-full flex items-center justify-center mb-12 h-[400px]">
                        <span 
                        className="text-base xm:text-[1.25rem] sm:text-[1.5rem] font-mono font-bold text-black leading-tight">
                            No offers to show
                        </span>
                    </div>
                ):(
                    <div className="flex w-full flex justify-center mb-12"> 
                        <OfferCardHolder offers={filteredOffers} />
                    </div>
                )}
                

            </div>
        </div>
    );
}