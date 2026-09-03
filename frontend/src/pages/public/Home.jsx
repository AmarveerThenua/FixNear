import React from 'react'
import Hero from '../../components/home/Hero'
import PopularServices from "../../components/home/PopularServices";
import HowItWorks from "../../components/home/HowItWorks";
import TopProfessionals from "../../components/home/TopProfessionals";
import WhyChooseUs from "../../components/home/WhyChooseUs";
import Reviews from "../../components/home/Reviews";
import BecomeProfessional from "../../components/home/BecomeProfessional";

const Home = () => {
    return (
        <>
            <Hero />
            <PopularServices />
            <HowItWorks />
            {/* <TopProfessionals /> */}
            <WhyChooseUs />
            <Reviews/>
            
        </>
    )
}

export default Home