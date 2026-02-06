// Services listing with editorial sections.
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { placeholderImage } from "../../media";
import styles from "./page.module.css";
import { ReviewsCarousel } from "../../components/ReviewsCarousel";

const services = [
  {
    name: "Standard Makeup (Studio)",
    descriptor: "Polished, timeless makeup for studio appointments.",
    bullets: ["Studio appointment", "Ideal for events or shoots", "Soft, long-wear finish"],
    price: "£70",
    duration: "One look",
  },
  {
    name: "Standard Makeup (Home Service)",
    descriptor: "Comfortable, on-location makeup tailored to your day.",
    bullets: ["On-location service", "Ideal for busy mornings", "Camera-ready finish"],
    price: "£90",
    duration: "One look",
  },
  {
    name: "Photoshoot Makeup",
    descriptor: "Refined makeup designed for camera and lighting.",
    bullets: ["Studio or location", "Optimised for photography", "Balanced, polished skin"],
    price: "£100",
    duration: "One look",
  },
  {
    name: "Makeup + Wig Styling (Studio)",
    descriptor: "Coordinated makeup and wig styling in studio.",
    bullets: ["Studio session", "Makeup + wig styling", "Soft glam alignment"],
    price: "£120",
    duration: "One look",
  },
  {
    name: "Makeup + Wig Styling (Home Service)",
    descriptor: "Full look styling delivered to your location.",
    bullets: ["On-location service", "Makeup + wig styling", "Event-ready finish"],
    price: "£150",
    duration: "One look",
  },
  {
    name: "Gele (One Style)",
    descriptor: "Elegant gele styling with a refined finish.",
    bullets: ["One traditional style", "Structured, clean lines", "Event-ready polish"],
    price: "£40",
    duration: "One style",
  },
  {
    name: "Prewedding Shoot",
    descriptor: "Soft, luminous makeup for prewedding portraits.",
    bullets: ["Photo-ready finish", "Defined yet natural", "Studio or location"],
    price: "£100",
    duration: "One look",
  },
  {
    name: "Bridal Trial Session (Studio)",
    descriptor: "A focused bridal trial to perfect your look.",
    bullets: ["Studio appointment", "Shape and tone refining", "Confidence before the day"],
    price: "£100",
    duration: "One look",
  },
  {
    name: "Bridesmaids",
    descriptor: "Cohesive bridesmaid makeup with a soft glow.",
    bullets: ["Per person", "Coordinated tones", "Event-ready longevity"],
    price: "£90",
    duration: "Per person",
  },
  {
    name: "Registry Wedding",
    descriptor: "Elegant makeup for a refined registry ceremony.",
    bullets: ["Registry ceremony", "Polished bridal finish", "Comfortable wear"],
    price: "£250",
    duration: "Package",
  },
  {
    name: "Traditional Wedding",
    descriptor: "Traditional bridal makeup with graceful detail.",
    bullets: ["Traditional ceremony", "Defined yet soft", "Long-lasting wear"],
    price: "£300",
    duration: "Package",
  },
  {
    name: "White Wedding",
    descriptor: "Classic bridal makeup with a soft, luminous finish.",
    bullets: ["White wedding", "Refined bridal glow", "Camera-ready complexion"],
    price: "£300",
    duration: "Package",
  },
  {
    name: "Traditional + White (Same Day)",
    descriptor: "Two bridal looks for a full wedding day.",
    bullets: ["Same-day coverage", "Look refresh included", "End-to-end support"],
    price: "£500",
    duration: "Package",
  },
  {
    name: "Bridal Hair Prep & Styling",
    descriptor: "Bridal hair preparation with refined styling.",
    bullets: ["Hair prep + styling", "Bridal-ready finish", "Structured elegance"],
    price: "£180",
    duration: "Package",
  },
  {
    name: "Bridal Frontal Installation & Styling",
    descriptor: "Frontal installation tailored for bridal styling.",
    bullets: ["Frontal install", "Secure, seamless finish", "Bridal styling included"],
    price: "£300",
    duration: "Package",
  },
  {
    name: "Bridal Makeup + Hair Styling (Traditional)",
    descriptor: "Traditional bridal makeup paired with hair styling.",
    bullets: ["Makeup + hair", "Cultural elegance", "Full bridal support"],
    price: "£550",
    duration: "Package",
  },
  {
    name: "Bridal Makeup + Hair Installation & Styling",
    descriptor: "Full bridal glam with hair installation and styling.",
    bullets: ["Makeup + install", "Refined bridal finish", "All-day wear"],
    price: "£540",
    duration: "Package",
  },
  {
    name: "Bride’s Gele (One Style)",
    descriptor: "Bridal gele styling with a tailored silhouette.",
    bullets: ["One bridal style", "Structured and elegant", "Ceremony-ready"],
    price: "£60",
    duration: "One style",
  },
];

const reviews = [
  {
    name: "Sasha",
    text:
      "I came across Gleemakeovers on Instagram and her work looked incredible, I had to book her and I was so glad I did! Ife did a wonderful job on my wedding makeup, I felt very beautiful and got lots of compliments. Not only did she listen and do everything I asked for, she was also so helpful during the busy morning including feeding me breakfast mid getting my hair done, helping me with my veil and capture some great content. I would definitely recommend!",
  },
  {
    name: "Sandra",
    text:
      "From the moment I found Glee Makeovers on Instagram and reached out, I had peace from her first response until the end. She has such a calming and reassuring presence. She listened to me every step of the way. Makeup already ate at my trial but she encouraged me to look at everything critically and make adjustments so that I’ll be 100% happy. She even bought new products to give me the exact shade of blush I wanted! On both my wedding days she went above and beyond, stepping in to help with my dresses, shoes, jewellery- and my makeup was banging! I looked like the most beautiful version of myself ever, not like someone else. I won’t stop singing her praises. Book her!",
  },
  {
    name: "Maureen",
    text:
      "First of all, I want to commend Ife for her punctuality. She was always on time. Her kindness, patience and God fearing nature are all very admirable. I will always recommend Ife’s services. Book her for your big day 🙂",
  },
  {
    name: "Oluwatobiloba",
    text:
      "Where do I start from ????\nThe first time I came across Glee on instagram, I knew that she was going to be my makeup artist on my big day. As a makeup artist myself, there are certain qualities I look out for beyond the glam. Ife’s professionalism is top notch, she exudes grace. I didn’t book her for trial but she delivered excellently, she worked on my face as though I am a regular client. Ohh before I forget, the relaxing face massage I got before the makeup was mind blowing. My makeup stayed on for over 16 hours and it did not move despite the dance and tears.\nThank you for being a wonderful person.",
  },
  {
    name: "Damiloju",
    text:
      "OMG! I absolutely love my make-up. You did an amazing job sis.\nThank you",
  },
  {
    name: "Ngozi Agunwa",
    text:
      "Gleemakeovers did an absolutely stunning job on my bridal makeup! They perfectly captured my vision, giving me a flawless, radiant look that lasted all day. The products felt light yet held up beautifully, and I got so many compliments! Their professionalism and attention to detail made the experience stress-free and enjoyable. Highly recommend for any bride!",
  },
  {
    name: "Nehis",
    text:
      "I really appreciated Ife’s effort, time, and professionalism. Her jokes and relaxed mannerism helped calm my nerves. Her work boosted my confidence and made me feel stunning 😍",
  },
  {
    name: "Jane",
    text:
      "Ife did my makeup and my mum’s makeup for my wedding, and I couldn’t have been happier! She is incredibly talented—my makeup was absolutely perfect, and my mum looked stunning too. Ife was such a calming, lovely presence on the day and went above and beyond to help us both. It was truly a joy working with her. Thank you so much, Ife—you’re an absolute star!",
  },
  {
    name: "Client",
    text:
      "Absolutely loved getting my makeup done. It was done in good time, the artist was so friendly and best of all, I came out looking so stunning!",
  },
];


export default function ServicesPage() {
  const reduceMotion = useReducedMotion();

  return (
    <main className={styles.page}>
      <motion.section
        className={styles.intro}
        {...(reduceMotion
          ? {}
          : {
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, amount: 0.6 },
              transition: { duration: 0.8, ease: "easeOut" },
            })}
      >
        <h1>Services</h1>
        <p className={styles.introText}>
          Makeup, hair styling, and bridal packages with clear, published
          rates.
        </p>
      </motion.section>

      <section className={styles.list}>
        {services.map((service, index) => {
          const isReversed = index % 2 !== 0;
          return (
            <motion.article
              key={service.name}
              className={`${styles.serviceSection} ${
                isReversed ? styles.serviceSectionAlt : ""
              }`}
              {...(reduceMotion
                ? {}
                : {
                    initial: { opacity: 0, y: 24 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true, amount: 0.35 },
                    transition: { duration: 0.7, ease: "easeOut" },
                  })}
            >
              <div
                className={`${styles.serviceContent} ${
                  isReversed ? styles.serviceContentReverse : ""
                }`}
              >
                <div className={styles.serviceText}>
                  <h2 className={styles.cardTitle}>{service.name}</h2>
                  <p className={styles.serviceDescriptor}>{service.descriptor}</p>
                  <ul className={styles.serviceBullets}>
                    {service.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardPrice}>{service.price}</span>
                    <span className={styles.cardDuration}>{service.duration}</span>
                  </div>
                  <Link href="/book/service" className={styles.cardLink}>
                    Book this service
                  </Link>
                </div>
                <div className={styles.serviceImageWrap}>
                  <Image
                    src={placeholderImage}
                    alt={`${service.name} preview`}
                    fill
                    className={styles.serviceImage}
                    sizes="(min-width: 1024px) 40vw, 100vw"
                  />
                </div>
              </div>
            </motion.article>
          );
        })}
      </section>

      <div className={styles.reviewsWrap}>
        <ReviewsCarousel
          title="Client words on the experience."
          reviews={reviews.slice(0, 4)}
          previewLength={160}
          intervalMs={5000}
        />
        <div className={styles.reviewActions}>
          <Link href="/reviews" className={styles.reviewLink}>
            See more reviews
          </Link>
          <Link href="/review" className={styles.reviewCta}>
            Leave a review
          </Link>
        </div>
      </div>
    </main>
  );
}
