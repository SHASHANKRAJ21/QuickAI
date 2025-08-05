import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AiTools from "../components/AiTools";
import Testimonial from "../components/Testimonial";
import Plan from "../components/Plan";
import Fotter from "../components/Fotter";

const Home = () => {
  return (
    <>
    <Navbar></Navbar>
    <Hero/>
    <AiTools/>
    <Testimonial/>
    <Plan/>
    <Fotter/>

    </>
  );
};

export default Home;
