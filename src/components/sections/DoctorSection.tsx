import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const DOCTORS = [
  {
    name: "Dr. Lena Marsh, MD",
    title: "Head of Metabolic & Weight Care",
    specialties: ["Metabolic Health", "GLP-1 Therapies", "Obesity Medicine"],
    bio: "Board-certified in obesity medicine with 14 years guiding patients through GLP-1 therapy, metabolic health, and sustainable weight outcomes.",
    photo:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=420&h=560&q=85&fit=crop",
  },
  {
    name: "Dr. Omar Khalil, MD",
    title: "Head of Hormonal Health",
    specialties: ["Men's Health", "Hormone Optimisation", "Performance"],
    bio: "Specialises in hormone optimisation and men's health, with a focus on evidence-based protocols for energy, recovery, and long-term vitality.",
    photo:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=420&h=560&q=85&fit=crop",
  },
  {
    name: "Dr. Sara Chen, MD",
    title: "Head of Longevity Medicine",
    specialties: ["Peptide Therapy", "Cellular Health", "Anti-Ageing"],
    bio: "Leads TIDL's longevity protocols with expertise in peptide therapy and preventive medicine for patients focused on healthspan and recovery.",
    photo:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=420&h=560&q=85&fit=crop",
  },
  {
    name: "Dr. James Osei, MD",
    title: "Head of Medical Affairs",
    specialties: ["Clinical Safety", "Pharmacology", "Prescribing Standards"],
    bio: "Oversees clinical safety and prescribing standards across TIDL's physician network, ensuring every treatment meets regulatory and ethical guidelines.",
    photo:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=420&h=560&q=85&fit=crop",
  },
] as const;

export function DoctorSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const cards = section.querySelectorAll<HTMLElement>(".doctor-profile");
    const ctx = gsap.context(() => {
      gsap.from(cards, {
        y: 48,
        opacity: 0,
        duration: 0.85,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 82%",
          once: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-nav-zone="doctor"
      className="doctor-section relative overflow-hidden px-5 pb-16 pt-14 md:px-10 md:pb-20 md:pt-16 lg:px-14"
      aria-label="Our physician team"
    >
      <style>{`
        .doctor-section {
          --doctor-yellow: #f3c300;
          --doctor-black: #231f20;
          --doctor-white: #ffffff;
          background: rgb(226, 226, 226);
          color: var(--doctor-black);
        }
        .doctor-track {
          display: flex;
          gap: 1.25rem;
          overflow-x: auto;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          padding-bottom: 0.5rem;
          margin-inline: -0.25rem;
        }
        .doctor-track::-webkit-scrollbar {
          display: none;
        }
        @media (min-width: 1024px) {
          .doctor-track {
            gap: 1.5rem;
            justify-content: center;
            overflow-x: visible;
            flex-wrap: nowrap;
          }
        }
        .doctor-profile {
          flex: 0 0 min(78vw, 19.5rem);
          scroll-snap-align: start;
        }
        @media (min-width: 640px) {
          .doctor-profile {
            flex: 0 0 19.5rem;
          }
        }
        @media (min-width: 1024px) {
          .doctor-profile {
            flex: 1 1 0;
            min-width: 0;
            max-width: 17.5rem;
          }
        }
        .doctor-card-panel {
          display: flex;
          align-items: stretch;
          min-height: 11.5rem;
          border-radius: 1.25rem;
          background: var(--doctor-white);
          overflow: hidden;
        }
        .doctor-card-photo {
          flex: 0 0 42%;
          position: relative;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          overflow: hidden;
        }
        .doctor-card-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
        }
        .doctor-card-meta {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 1rem 1rem 1rem 0.75rem;
        }
        .doctor-card-title {
          font-family: var(--font-display);
          font-size: 0.9375rem;
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.01em;
          color: var(--doctor-black);
          margin: 0 0 0.75rem;
        }
        .doctor-specialty-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .doctor-specialty-list li {
          display: flex;
          align-items: baseline;
          gap: 0.4rem;
          font-family: var(--font-sans);
          font-size: 0.8125rem;
          line-height: 1.35;
          color: var(--doctor-black);
        }
        .doctor-specialty-pipe {
          flex-shrink: 0;
          font-weight: 700;
          color: var(--doctor-yellow);
          line-height: 1;
        }
        .doctor-profile-name {
          margin: 0.875rem 0 0.5rem;
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.01em;
          color: var(--doctor-black);
        }
        .doctor-profile-bio {
          margin: 0;
          font-family: var(--font-sans);
          font-size: 0.8125rem;
          line-height: 1.55;
          color: var(--doctor-black);
        }
      `}</style>

      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center md:mb-12">
          <h2
            className="leading-[1.05] tracking-[-0.02em]"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)" }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontWeight: 400,
                color: "#f3c300",
              }}
            >
              The best care
            </span>
            <br />
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                color: "#231f20",
              }}
            >
              by the best in medicine
            </span>
          </h2>
          <p
            className="mx-auto mt-4 max-w-xl text-[0.9375rem] leading-relaxed md:text-base"
            style={{ color: "#231f20", fontFamily: "var(--font-sans)" }}
          >
            Meet the team of leading specialists with decades of combined experience
            across key specialties.
          </p>
        </div>

        <div className="doctor-track">
          {DOCTORS.map((doc) => (
            <article key={doc.name} className="doctor-profile">
              <div className="doctor-card-panel">
                <div className="doctor-card-photo">
                  <img src={doc.photo} alt="" loading="lazy" decoding="async" />
                </div>
                <div className="doctor-card-meta">
                  <h3 className="doctor-card-title">{doc.title}</h3>
                  <ul className="doctor-specialty-list">
                    {doc.specialties.map((specialty) => (
                      <li key={specialty}>
                        <span className="doctor-specialty-pipe" aria-hidden>
                          |
                        </span>
                        {specialty}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <h4 className="doctor-profile-name">{doc.name}</h4>
              <p className="doctor-profile-bio">{doc.bio}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
