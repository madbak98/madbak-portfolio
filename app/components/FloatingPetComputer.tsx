"use client";

import Image from "next/image";

import { MadbakPet, type MadbakPetProps } from "./MadbakPet";
import "./madbak-pet.css";
import "./floating-pet-computer.css";

type FloatingPetComputerProps = Omit<MadbakPetProps, "mode" | "frame"> & {
  /** Homepage #about in view — fade out without unmounting */
  suppressed?: boolean;
};

/**
 * Persistent floating companion: one fixed parent for dialogue + Old PC + options.
 * Frame mounts inside MadbakPet's stage so the CRT never detaches from dialogue.
 */
export function FloatingPetComputer({
  suppressed = false,
  ...props
}: FloatingPetComputerProps) {
  return (
    <div
      className={[
        "floating-pet-computer",
        suppressed ? "is-suppressed" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden={suppressed || undefined}
    >
      <MadbakPet
        mode="compact"
        {...props}
        frame={
          <div className="floating-pet-computer__monitor" aria-hidden>
            <Image
              src="/pet/old-pc.png"
              alt=""
              width={980}
              height={980}
              sizes="160px"
              priority
              draggable={false}
              className="floating-pet-computer__chassis"
            />
            <span className="floating-pet-computer__power" />
          </div>
        }
      />
    </div>
  );
}
