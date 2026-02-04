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

export default function HomePage() {
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

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
