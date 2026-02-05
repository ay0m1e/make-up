// Homepage for the luxury makeup artist studio.
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { placeholderImage } from "../media";
import styles from "./page.module.css";

const editorialImages = [
  { alt: "Editorial beauty portrait in soft light" },
  { alt: "Warm bridal look with luminous skin" },
  { alt: "Studio portrait with neutral tones" },
  { alt: "Evening makeup with refined glow" },
  { alt: "Campaign portrait with sculpted finish" },
  { alt: "Soft glam close-up with satin skin" },
];

const reviews = [
  {
    id: "sasha",
    name: "Sasha",
    text:
      "I came across Gleemakeovers on Instagram and her work looked incredible, I had to book her and I was so glad I did! Ife did a wonderful job on my wedding makeup, I felt very beautiful and got lots of compliments. Not only did she listen and do everything I asked for, she was also so helpful during the busy morning including feeding me breakfast mid getting my hair done, helping me with my veil and capture some great content. I would definitely recommend!",
  },
  {
    id: "sandra",
    name: "Sandra",
    text:
      "From the moment I found Glee Makeovers on Instagram and reached out, I had peace from her first response until the end. She has such a calming and reassuring presence. She listened to me every step of the way. Makeup already ate at my trial but she encouraged me to look at everything critically and make adjustments so that I’ll be 100% happy. She even bought new products to give me the exact shade of blush I wanted! On both my wedding days she went above and beyond, stepping in to help with my dresses, shoes, jewellery- and my makeup was banging! I looked like the most beautiful version of myself ever, not like someone else. I won’t stop singing her praises. Book her!",
  },
  {
    id: "maureen",
    name: "Maureen",
    text:
      "First of all, I want to commend Ife for her punctuality. She was always on time. Her kindness, patience and God fearing nature are all very admirable. I will always recommend Ife’s services. Book her for your big day 🙂",
  },
  {
    id: "oluwatobiloba",
    name: "Oluwatobiloba",
    text:
      "Where do I start from ????\nThe first time I came across Glee on instagram, I knew that she was going to be my makeup artist on my big day. As a makeup artist myself, there are certain qualities I look out for beyond the glam. Ife’s professionalism is top notch, she exudes grace. I didn’t book her for trial but she delivered excellently, she worked on my face as though I am a regular client. Ohh before I forget, the relaxing face massage I got before the makeup was mind blowing. My makeup stayed on for over 16 hours and it did not move despite the dance and tears.\nThank you for being a wonderful person.",
  },
  {
    id: "christine",
    name: "Christine",
    text:
      "Glee was recommended to me by another makeup artist/hair stylist within Leeds. Prior to this I had come across her social media (tiktock and instagram). I was really impressed with the quality of her work that was displayed on her social media so I decided to book her and Demola and they did not disappoint. Communication prior to the day was easy. On the day they were punctual and very professional. They also brought the vibes creating a relaxed and positive energy. They listened to me, making my vision a reality. I felt so beautiful on the day and it was all down to their work. If I ever have the opportunity to work with them again I will. Thank you both so much for your support.",
  },
  {
    id: "vivian",
    name: "Vivian",
    text:
      "Ife and her team were exceptional in every way. They were timely and very professional but also super friendly.\nI’m not a girl who wears make up that often and I expressed my fears to Ife, I was very indecisive but she eased any worry I had. She took me through each step and askede how I truly felt. We worked together to create the best look! I had never felt so pretty. My bridesmaid were also given the best treatment and any issues were rectified immediately.\n\nPlease book Ife if you want the best bridal make up experience. I am filled with gratitude xx",
  },
  {
    id: "damiloju",
    name: "Damiloju",
    text:
      "OMG! I absolutely love my make-up. You did an amazing job sis.\nThank you",
  },
  {
    id: "ngozi",
    name: "Ngozi Agunwa",
    text:
      "Gleemakeovers did an absolutely stunning job on my bridal makeup! They perfectly captured my vision, giving me a flawless, radiant look that lasted all day. The products felt light yet held up beautifully, and I got so many compliments! Their professionalism and attention to detail made the experience stress-free and enjoyable. Highly recommend for any bride!",
  },
  {
    id: "nehis",
    name: "Nehis",
    text:
      "I really appreciated Ife’s effort, time, and professionalism. Her jokes and relaxed mannerism helped calm my nerves. Her work boosted my confidence and made me feel stunning 😍",
  },
  {
    id: "jane",
    name: "Jane",
    text:
      "Ife did my makeup and my mum’s makeup for my wedding, and I couldn’t have been happier! She is incredibly talented—my makeup was absolutely perfect, and my mum looked stunning too. Ife was such a calming, lovely presence on the day and went above and beyond to help us both. It was truly a joy working with her. Thank you so much, Ife—you’re an absolute star!",
  },
  {
    id: "client",
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

export default function HomePage() {
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [reviewsPaused, setReviewsPaused] = useState(false);
  const [reviewsDragging, setReviewsDragging] = useState(false);

  const carouselLayers = useMemo(
    () => [
      { y: 0, scale: 1, rotate: 0, opacity: 1, z: 3 },
      { y: 50, scale: 0.96, rotate: -2, opacity: 0.75, z: 2 },
      { y: 95, scale: 0.92, rotate: 2, opacity: 0.55, z: 1 },
    ],
    [],
  );

  const getImageIndex = (offset: number) =>
    (activeIndex + offset + editorialImages.length) % editorialImages.length;

  const handleDragEnd = (_: unknown, info: { offset: { y: number } }) => {
    if (info.offset.y < -60) {
      setActiveIndex((prev) => (prev + 1) % editorialImages.length);
    }
    if (info.offset.y > 60) {
      setActiveIndex((prev) => (prev - 1 + editorialImages.length) % editorialImages.length);
    }
  };

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduceMotion || isMobile) return;
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % editorialImages.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, [reduceMotion, isMobile]);
  const motionOff = reduceMotion || isMobile;
  const previewLength = 170;
  const previewReviews = reviews.slice(0, 6);
  const getPreview = (text: string) =>
    text.length > previewLength
      ? `${text.slice(0, previewLength).trim()}...`
      : text;

  useEffect(() => {
    if (reduceMotion || reviewsPaused || reviewsDragging) return;
    const id = window.setInterval(() => {
      setReviewIndex((prev) => (prev + 1) % previewReviews.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [reduceMotion, reviewsPaused, reviewsDragging, previewReviews.length]);

  const heroMediaProps = motionOff
    ? {}
    : {
        initial: { scale: 1.15, y: -20 },
        animate: { scale: 1, y: 0 },
        transition: {
          scale: { duration: 1.8, ease: "easeOut" },
          y: { duration: 8, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" },
        },
      };

  const heroTextProps = motionOff
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.9, delay: 0.6, ease: "easeOut" },
      };

  const galleryReveal = (index: number) =>
    motionOff
      ? {}
      : {
          initial: { opacity: 0, y: 40, x: index % 2 === 0 ? -30 : 30, rotate: index % 3 === 0 ? -2 : 2 },
          whileInView: { opacity: 1, y: 0, x: 0, rotate: 0 },
          viewport: { once: true, amount: 0.35 },
          transition: { duration: 0.9, ease: "easeOut", delay: index * 0.06 },
        };

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <motion.div className={styles.heroMedia} {...heroMediaProps}>
          <Image
            src={placeholderImage}
            alt="Luxury makeup artistry portrait"
            fill
            className={styles.heroImage}
            priority
            sizes="100vw"
          />
          <div className={styles.heroOverlay} />
        </motion.div>
        <div className={styles.heroInner}>
          <motion.div className={styles.heroContent} {...heroTextProps}>
            <p className={styles.heroEyebrow}>GLEEMAKEOVERS</p>
            <h1 className={styles.heroTitle}>Beauty refined with elegance.</h1>
            <p className={styles.heroSubtitle}>
              Makeup, hair styling, and semi-permanent brows designed to
              highlight your natural features.
            </p>
            <Link
              href="/book/service"
              className={styles.heroCta}
            >
              Book an Appointment
            </Link>
          </motion.div>
        </div>
      </section>

      <section className={styles.carouselSection}>
        <div className={styles.carouselLayout}>
          <motion.div
            className={styles.carouselText}
            {...(motionOff
              ? {}
              : {
                  initial: { opacity: 0, y: 18 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, amount: 0.6 },
                  transition: { duration: 0.7, ease: "easeOut" },
                })}
          >
            <p className={styles.carouselEyebrow}>Portfolio</p>
            <h2>Editorial movement, bridal softness.</h2>
            <p className={styles.carouselTextBody}>
              A rotating edit of signature looks. Drag to explore.
            </p>
          </motion.div>

          <div className={styles.carouselStage}>
            {carouselLayers.map((layer, layerIndex) => {
              const image = editorialImages[getImageIndex(layerIndex)];
              const isTop = layerIndex === 0;
              return (
                <motion.div
                  key={`${image.alt}-${layerIndex}`}
                  className={styles.carouselCard}
                  style={{ zIndex: layer.z }}
                  initial={false}
                animate={
                  motionOff
                    ? { opacity: 1 }
                    : {
                        opacity: layer.opacity,
                        scale: layer.scale,
                        y: layer.y,
                        rotate: layer.rotate,
                      }
                }
                transition={
                  motionOff
                    ? { duration: 0.3 }
                    : { duration: 0.9, ease: "easeOut" }
                }
                drag={motionOff || !isTop ? false : "y"}
                dragConstraints={{ top: 0, bottom: 0 }}
                onDragEnd={isTop ? handleDragEnd : undefined}
              >
                <motion.div
                  className={styles.carouselImageWrap}
                  animate={
                    motionOff
                      ? { scale: 1 }
                      : { scale: [1.02, 1.06, 1.02], y: [-6, 6, -6] }
                  }
                  transition={
                    motionOff
                      ? { duration: 0.3 }
                      : { duration: 8, ease: "easeInOut", repeat: Infinity }
                  }
                >
                    <Image
                      src={placeholderImage}
                      alt={image.alt}
                      fill
                      className={styles.carouselImage}
                      sizes="(min-width: 1024px) 45vw, 90vw"
                    />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.trustSection}>
        <motion.div
          className={styles.trustInner}
          {...(motionOff
            ? {}
            : {
                initial: { opacity: 0, y: 24 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.6 },
                transition: { duration: 0.8, ease: "easeOut" },
              })}
        >
          <p className={styles.trustEyebrow}>About</p>
          <h2>Soft, timeless, and polished.</h2>
          <p className={styles.trustText}>
            GLEEMAKEOVERS provides makeup artistry with a calm, attentive
            approach that enhances natural features and respects individuality.
          </p>
        </motion.div>
      </section>

      <section className={styles.reviewsSection}>
        <div className={styles.reviewsHeader}>
          <p className={styles.reviewsEyebrow}>Reviews</p>
          <h2>Client words on the experience.</h2>
        </div>
        <div
          className={styles.reviewsCarousel}
          onMouseEnter={() => setReviewsPaused(true)}
          onMouseLeave={() => setReviewsPaused(false)}
          onTouchStart={() => setReviewsPaused(true)}
          onTouchEnd={() => setReviewsPaused(false)}
        >
          <motion.div
            className={styles.reviewsTrack}
            animate={{ x: `-${reviewIndex * 100}%` }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            drag="x"
            dragConstraints={{ left: -120, right: 120 }}
            dragElastic={0.2}
            onDragStart={() => setReviewsDragging(true)}
            onDragEnd={(_, info) => {
              setReviewsDragging(false);
              if (info.offset.x < -60) {
                setReviewIndex((prev) => (prev + 1) % reviews.length);
              } else if (info.offset.x > 60) {
                setReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
              }
            }}
          >
            {previewReviews.map((review) => (
              <div key={review.id} className={styles.reviewSlide}>
                <div className={styles.reviewCard}>
                  <div className={styles.reviewStars}>{stars}</div>
                  <p className={styles.reviewText}>{getPreview(review.text)}</p>
                  <p className={styles.reviewName}>{review.name}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
        <Link href="/reviews" className={styles.reviewLink}>
          Read more reviews
        </Link>
        <Link href="/review" className={styles.reviewCta}>
          Leave a review
        </Link>
      </section>

      <section className={styles.ctaSection}>
        <motion.div
          className={styles.ctaInner}
          {...(motionOff
            ? {}
            : {
                initial: { opacity: 0, y: 28 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.6 },
                transition: { duration: 0.9, ease: "easeOut" },
              })}
        >
          <p className={styles.ctaEyebrow}>Book an Appointment</p>
          <h2>Makeup, bridal hair, and brows.</h2>
          <p className={styles.ctaText}>
            From bridal and photoshoots to special events, each service is
            tailored to your features and the occasion.
          </p>
          <Link
            href="/book/service"
            className={styles.ctaButton}
          >
            Book an Appointment
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
