"use client";

import Image from "next/image";

import { MadbakPet, type MadbakPetProps } from "../../components/MadbakPet";
import "../../components/madbak-pet.css";
import "./about-pet-computer.css";

type AboutPetComputerProps = Omit<MadbakPetProps, "mode" | "frame"> & {
  /** dark = About landing (glass). light = homepage cream About section. */
  tone?: "dark" | "light";
};

/**
 * About Pet installation. layout="split" places presentation left / options right
 * on desktop; stack remains the mobile fallback and default for other hosts.
 */
export function AboutPetComputer({
  tone = "dark",
  layout = "stack",
  ...petProps
}: AboutPetComputerProps) {
  return (
    <div
      className={[
        "about-pet-computer",
        "about-pet-computer--installation",
        `about-pet-computer--${tone}`,
        layout === "split" ? "about-pet-computer--split" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <MadbakPet
        mode="full"
        layout={layout}
        {...petProps}
        frame={
          <div className="about-pet-computer__monitor" aria-hidden>
            <Image
              src="/pet/old-pc.png"
              alt=""
              width={980}
              height={980}
              sizes="(max-width: 1023px) 86vw, min(42vw, 30rem)"
              priority
              draggable={false}
              className="about-pet-computer__chassis"
            />
            <span className="about-pet-computer__power" />
          </div>
        }
      />
    </div>
  );
}
