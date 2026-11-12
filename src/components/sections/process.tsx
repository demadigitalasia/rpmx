import { getServiceIcon, processSteps } from "@/lib/content";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";

export function Process() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <SectionHeading
          prefix="alur"
          word="Proses"
          description="Lima langkah dari brief sampai paket tiba di tangan Anda."
        />
        <div className="mt-12 grid gap-px border border-raw-line bg-raw-line sm:grid-cols-2 lg:grid-cols-5">
          {processSteps.map((step, i) => {
            const Icon = getServiceIcon(step.icon);
            return (
              <Reveal key={step.step} delay={i * 0.05}>
                <div className="relative h-full bg-raw p-6">
                  <span className="font-raw text-4xl font-bold text-accent/30 tabular-nums">
                    {step.step}
                  </span>
                  <h3 className="mt-4 font-raw text-base font-bold uppercase tracking-tight text-raw-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-raw-muted">
                    {step.description}
                  </p>
                  <Icon
                    className="absolute right-5 top-5 h-5 w-5 text-raw-muted"
                    aria-hidden="true"
                  />
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
