import Image from "next/image";
import PageIllustration from "./page-illustration";
import Avatar01 from "../../../public/images/avatar-01.jpg";
import Avatar02 from "../../../public/images/avatar-02.jpg";
import Avatar03 from "../../../public/images/avatar-03.jpg";
import Avatar04 from "../../../public/images/avatar-04.jpg";
import Avatar05 from "../../../public/images/avatar-05.jpg";
import Avatar06 from "../../../public/images/avatar-06.jpg";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroHome() {
  return (
    <>
      <section className="relative">
        <PageIllustration />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Hero content */}
          <div className="pb-12 pt-32 md:pb-20 md:pt-40">
            {/* Section header */}
            <div className="pb-12 text-center md:pb-16">
              <div
                className="mb-6 border-y [border-image:linear-gradient(to_right,transparent,theme(colors.slate.300/.8),transparent)1]"
               
              >
                <div className="-mx-0.5 flex justify-center -space-x-3">
                  <Image
                    className="box-content rounded-full border-2 border-gray-50"
                    src={Avatar01}
                    width={32}
                    height={32}
                    alt="Avatar 01"
                  />
                  <Image
                    className="box-content rounded-full border-2 border-gray-50"
                    src={Avatar02}
                    width={32}
                    height={32}
                    alt="Avatar 01"
                  />
                  <Image
                    className="box-content rounded-full border-2 border-gray-50"
                    src={Avatar03}
                    width={32}
                    height={32}
                    alt="Avatar 02"
                  />
                  <Image
                    className="box-content rounded-full border-2 border-gray-50"
                    src={Avatar04}
                    width={32}
                    height={32}
                    alt="Avatar 03"
                  />
                  <Image
                    className="box-content rounded-full border-2 border-gray-50"
                    src={Avatar05}
                    width={32}
                    height={32}
                    alt="Avatar 04"
                  />
                  <Image
                    className="box-content rounded-full border-2 border-gray-50"
                    src={Avatar06}
                    width={32}
                    height={32}
                    alt="Avatar 05"
                  />
                </div>
              </div>
              <h1
                className="mb-6 border-y text-4xl sm:text-5xl font-extrabold md:text-6xl [border-image:linear-gradient(to_right,transparent,theme(colors.slate.300/.8),transparent)1]"
              // data-aos="zoom-y-out"
              // data-aos-delay={150}
              >
                The notes generator you&apos;re <br className="max-lg:hidden" />
                looking for
              </h1>
              <div className="mx-auto max-w-3xl">
                <p
                  className="mb-8 text-lg text-gray-700"
                // data-aos="zoom-y-out"
                // data-aos-delay={300}
                >
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni ipsum doloribus quaerat illo, minima perspiciatis rem.
                </p>

                <div className="relative ">
                  <div
                    className="mx-auto w-fit flex flex-row max-[269px]:flex-col sm:justify-center gap-2"
                  > 
                    <Link href={'/dashboard'}>
                    <Button className="cursor-pointer">Start Free Trail</Button>
                    </Link>
                    <Link href={'/dashboard/upgrade'}>
                    <Button variant={'outline'}>Get Premium</Button>
                    </Link>
                  </div>
                </div>

              </div>
            </div>
            {/* Hero image */}
            <div
              className="mx-auto max-w-3xl"
            // data-aos="zoom-y-out"
            // data-aos-delay={600}
            >
              <div className="relative aspect-video rounded-2xl bg-gradient-to-br from-primary to-primary/50 px-5 py-3 shadow-xl before:pointer-events-none before:absolute before:-inset-5 before:border-y after:absolute after:-inset-5 after:-z-10 ">
                <div className="relative mb-8 flex items-center justify-between before:block before:h-[9px] before:w-[41px] before:bg-[length:16px_9px] before:[background-image:radial-gradient(circle_at_4.5px_4.5px,_theme(colors.white)_4.5px,_transparent_0)] after:w-[41px]">
                  <span className="text-[13px] font-medium text-white">
                    AI Academy
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
