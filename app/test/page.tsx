"use client";
import React, { useEffect, useRef } from "react";
import "@/app/globals.css";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import FindListingsComponent from "../components/listings/search-listings";
import Image from "next/image";
import { Outfit } from "next/font/google";
import homebg from "@/public/images/home-images/ezhbg2.webp";
import consumer from "@/public/images/home-images/ezhconsumer.webp";
import producer from "@/public/images/home-images/ezhproducer.webp";

const outfit = Outfit({
  weight: ["600"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

gsap.registerPlugin(ScrollTrigger);

interface AppProps {}
interface AppState {
  name: string;
}

export default function App(props: AppProps, state: AppState) {
  const number = useRef(null);

  useEffect(() => {
    gsap.to("#h1", {
      scrollTrigger: {
        trigger: "#header",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
      yPercent: 50,
      scale: 0.1,
      opacity: 0,
    });
    // Section 1 H2
    gsap.from("#h2", {
      scrollTrigger: {
        trigger: "#h2",
        start: "top bottom+=100px",
        toggleActions: "play complete none reset",
      },
      xPercent: -100,
      opacity: 0,
      duration: 2,
    });
    // Execution heading
    gsap.from("#h3", {
      scrollTrigger: {
        trigger: "#h3",
        start: "top bottom+=100px",
        // scrub: true
        toggleActions: "play complete none reset",
      },
      xPercent: 100,
      opacity: 0.5,
      duration: 1,
    });
    // Custom trigger
    ScrollTrigger.create({
      trigger: "#h3",
      start: "top bottom+=-200px", // 200px after the top passes the bottom of the viewport
      endTrigger: "#section2",
      end: "bottom top",
      onUpdate: (self) => {
        const progress = Math.max(2, Math.ceil(self.progress * 100)); //No lower than 2.
        if (number.current) {
          (number.current as HTMLSpanElement).innerHTML = progress.toString();
        }
      },
    });
    ScrollTrigger.create({
      trigger: "#h2",
      start: "top bottom+=-200px", // 200px after the top passes the bottom of the viewport
      endTrigger: "#section2",
      end: "bottom top",
      onUpdate: (self) => {
        const progress = Math.max(2, Math.ceil(self.progress * 1)); //No lower than 2.
        if (number.current) {
          (number.current as HTMLSpanElement).innerHTML = progress.toString();
        }
      },
    });

    ScrollTrigger.refresh();
  }, []);

  return (
    <main>
      <header id="header">
        <div
          id="h1"
          className="relative min-h-screen w-full flex justify-center md:justify-evenly items-center"
        >
          <article>
            <h1 className="2xl:text-5xl text-sm font-bold tracking-tight mb-2 outfit">
              <div className={outfit.className}>
                Fresh, Local, & Organic with
              </div>
            </h1>
            <h1 className="2xl:text-5xl text-sm font-bold tracking-tight mb-2 outfit">
              <div className={outfit.className}>EZ Homesteading</div>
            </h1>
            <p className="2xl:text-lg text-sm mb-2">
              Creating communities & connecting family scale farmers & gardeners
              with local consumers
            </p>
            <div className="flex">
              <FindListingsComponent />
            </div>
          </article>
          <div>
            <Image
              src={homebg}
              alt="Farmer Holding Basket of Vegetables"
              blurDataURL="data:..."
              placeholder="blur"
              width={600}
              height={400}
              className="object-cover"
            />
          </div>
        </div>
      </header>
      <section className="section2 relative min-h-screen w-full flex justify-center md:justify-evenly">
        <Image
          src={consumer}
          alt="Farmer Holding Basket of Vegetables"
          blurDataURL="data:..."
          placeholder="blur"
          width={300}
          height={300}
          className="object-cover rounded-lg"
        />
        <div id="section2">
          <h2
            id="h3"
            className="2xl:text-5xl text-sm font-bold tracking-tight mb-2 outfit"
          >
            Become an EZH Co-Op
          </h2>
        </div>
      </section>
      <div className="section relative min-h-screen w-full flex justify-center md:justify-evenly items-center">
        <section>
          <div id="h2">
            <div className="relative">
              <div className="relative min-h-screen w-full flex justify-center md:justify-evenly items-center">
                <div></div>
                <h1 className="2xl:text-5xl text-sm font-bold tracking-tight mb-2 outfit">
                  <div className={outfit.className}>Become an EZH Producer</div>
                </h1>
              </div>
            </div>
          </div>
        </section>
        <Image
          src={producer}
          alt="Farmer Holding Basket of Vegetables"
          blurDataURL="data:..."
          placeholder="blur"
          width={300}
          height={300}
          className="object-cover rounded-lg"
        />
      </div>
    </main>
  );
}
