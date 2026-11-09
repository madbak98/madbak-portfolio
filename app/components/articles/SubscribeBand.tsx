import { SubscribeForm } from "./SubscribeForm";

export function SubscribeBand() {
  return (
    <section aria-labelledby="subscribe-band-title" className="relative overflow-hidden bg-(--a-purple) text-white">
      <div className="a-wrap grid grid-cols-1 gap-10 py-16 lg:grid-cols-12 lg:gap-0 lg:py-[6vw]">
        <div className="lg:col-span-8">
          <p className="a-label flex justify-between border-b border-white/35 pb-3 font-semibold lg:mr-[4vw]">
            <span>The MADBAK Letter</span>
            <span className="text-white/70">Dispatch 001</span>
          </p>
          <h2
            id="subscribe-band-title"
            className="a-display mt-6 text-[length:17vw] leading-[0.8] lg:text-[length:9.5vw]"
          >
            Stay close
            <br />
            to the <span className="text-(--a-purple-black)">ideas.</span>
          </h2>
        </div>
        <div className="flex flex-col justify-end lg:col-span-4">
          <p className="max-w-sm text-[1.05rem] font-medium leading-snug text-white/85">
            New essays on design, code and security — delivered when they are ready, never on a
            schedule.
          </p>
          <div className="mt-6">
            <SubscribeForm tone="dark" />
          </div>
        </div>
      </div>
    </section>
  );
}
