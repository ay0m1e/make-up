// Services listing with editorial cards.
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import styles from "./page.module.css";

const services = [
  {
    name: "Standard Makeup (Studio)",
    description: "Studio-based makeup appointment.",
    price: "£70",
    duration: "One look",
  },
  {
    name: "Standard Makeup (Home Service)",
    description: "Makeup appointment at your location.",
    price: "£90",
    duration: "One look",
  },
  {
    name: "Photoshoot Makeup",
    description: "Single look for studio or location shoots.",
    price: "£100",
    duration: "One look",
  },
  {
    name: "Makeup + Wig Styling (Studio)",
    description: "Makeup with wig styling in studio.",
    price: "£120",
    duration: "One look",
  },
  {
    name: "Makeup + Wig Styling (Home Service)",
    description: "Makeup with wig styling at your location.",
    price: "£150",
    duration: "One look",
  },
  {
    name: "Gele (One Style)",
    description: "Traditional gele styling.",
    price: "£40",
    duration: "One style",
  },
  {
    name: "Prewedding Shoot",
    description: "Makeup for prewedding photoshoot.",
    price: "£100",
    duration: "One look",
  },
  {
    name: "Bridal Trial Session (Studio)",
    description: "Bridal trial appointment in studio.",
    price: "£100",
    duration: "One look",
  },
  {
    name: "Bridesmaids",
    description: "Makeup for bridesmaids.",
    price: "£90",
    duration: "Per person",
  },
  {
    name: "Registry Wedding",
    description: "Makeup for registry ceremony.",
    price: "£250",
    duration: "Package",
  },
  {
    name: "Traditional Wedding",
    description: "Makeup for traditional ceremony.",
    price: "£300",
    duration: "Package",
  },
  {
    name: "White Wedding",
    description: "Makeup for white wedding ceremony.",
    price: "£300",
    duration: "Package",
  },
  {
    name: "Traditional + White (Same Day)",
    description: "Makeup for both ceremonies on the same day.",
    price: "£500",
    duration: "Package",
  },
  {
    name: "Bridal Hair Prep & Styling",
    description: "Hair preparation and bridal styling.",
    price: "£180",
    duration: "Package",
  },
  {
    name: "Bridal Frontal Installation & Styling",
    description: "Frontal installation with bridal styling.",
    price: "£300",
    duration: "Package",
  },
  {
    name: "Bridal Makeup + Hair Styling (Traditional)",
    description: "Traditional bridal makeup with hair styling.",
    price: "£550",
    duration: "Package",
  },
  {
    name: "Bridal Makeup + Hair Installation & Styling",
    description: "Bridal makeup with hair installation and styling.",
    price: "£540",
    duration: "Package",
  },
  {
    name: "Bride’s Gele (One Style)",
    description: "Gele styling for the bride.",
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

const stars = Array.from({ length: 5 }, (_, index) => (
  <svg
    key={`star-${index}`}
    viewBox="0 0 20 20"
    aria-hidden="true"
    className={styles.star}
  >
    <path
      d="M10 2.5l2.25 4.56 5.03.73-3.64 3.55.86 5.02L10 14.2l-4.5 2.21.86-5.02-3.64-3.55 5.03-.73L10 2.5z"
      fill="currentColor"
    />
  </svg>
));

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
        {services.map((service) => (
          <motion.article
            key={service.name}
            className={styles.card}
            {...(reduceMotion
              ? {}
              : {
                  initial: { opacity: 0, y: 24 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, amount: 0.4 },
                  transition: { duration: 0.7, ease: "easeOut" },
                })}
            whileHover={reduceMotion ? undefined : { y: -6 }}
          >
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>{service.name}</h2>
              <p className={styles.cardText}>{service.description}</p>
            </div>
            <div className={styles.cardMeta}>
              <span className={styles.cardPrice}>{service.price}</span>
              <span className={styles.cardDuration}>{service.duration}</span>
            </div>
            <Link
              href="/book/service"
              className={styles.cardLink}
            >
              Book this service
            </Link>
            <div className={styles.cardDivider} />
          </motion.article>
        ))}
      </section>

      <section className={styles.reviewsSection}>
        <div className={styles.reviewsHeader}>
          <p className={styles.reviewsEyebrow}>Reviews</p>
          <h2>Client words on the experience.</h2>
        </div>
        <div className={styles.reviewsGrid}>
          {reviews.map((review) => (
            <div key={review.name} className={styles.reviewCard}>
              <div className={styles.reviewStars}>{stars}</div>
              <p className={styles.reviewText}>{review.text}</p>
              <p className={styles.reviewName}>{review.name}</p>
            </div>
          ))}
        </div>
        <Link href="/review" className={styles.reviewCta}>
          Leave a review
        </Link>
      </section>
    </main>
  );
}
