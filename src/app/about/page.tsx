// About page with mission, portfolio CTA, and brand story.
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { placeholderImage } from "../../media";
import styles from "./page.module.css";

export default function AboutPage() {
  const reduceMotion = useReducedMotion();

  return (
    <main className={styles.page}>
      <section className={styles.topGrid}>
        <motion.article
          className={styles.missionCard}
          {...(reduceMotion
            ? {}
            : {
                initial: { opacity: 0, y: 22 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.6 },
                transition: { duration: 0.8, ease: "easeOut" },
              })}
        >
          <p className={styles.eyebrow}>Our Mission</p>
          <h1>Our Mission</h1>
          <p className={styles.missionText}>
            To enhance every client’s beauty without taking away their natural
            uniqueness. Our looks are often described as soft, timeless and
            classy!
          </p>
          <p className={styles.missionText}>
            Our values include integrity, excellence, promptness and satisfying
            customer experience.
          </p>
        </motion.article>

        <motion.div
          className={styles.portfolioCard}
          {...(reduceMotion
            ? {}
            : {
                initial: { opacity: 0, y: 26 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.5 },
                transition: { duration: 0.9, ease: "easeOut" },
              })}
        >
          <Image
            src={placeholderImage}
            alt="Portfolio preview"
            fill
            className={styles.portfolioImage}
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
          />
          <div className={styles.portfolioOverlay}>
            <h2>Explore Our Portfolio!</h2>
            <Link href="/work" className={styles.portfolioButton}>
              Portfolio
            </Link>
          </div>
        </motion.div>
      </section>

      <motion.section
        className={styles.storyCard}
        {...(reduceMotion
          ? {}
          : {
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, amount: 0.5 },
              transition: { duration: 0.8, ease: "easeOut" },
            })}
      >
        <h2>About Glee Makeovers</h2>
        <div className={styles.storyText}>
          <p>
            At Glee makeovers, we believe that every face is a canvas and our
            mission is to enhance your beauty with the perfect blend of artistry
            and expertise. We offer exquisite makeup and hair styling services
            that accentuate your unique features and keep you radiant all day
            long!
          </p>
          <p>
            Wake up flawless with our semi-permanent brow services. We are
            masters of precision, ensuring your brows are not just shaped, but
            perfectly tailored to your facial structure.
          </p>
          <p>
            At Glee makeovers, we don’t just provide services, we create beauty
            experiences that leave a lasting impression. Look no further, when
            it comes to beauty, you are home!
          </p>
        </div>
      </motion.section>

      <motion.section
        className={styles.founderSection}
        {...(reduceMotion
          ? {}
          : {
              initial: { opacity: 0, y: 22 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, amount: 0.45 },
              transition: { duration: 0.8, ease: "easeOut" },
            })}
      >
        <div className={styles.founderImageWrap}>
          <Image
            src={placeholderImage}
            alt="Ife, founder and lead makeup artist at Glee Makeovers"
            fill
            className={styles.founderImage}
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
        </div>
        <div className={styles.founderContent}>
          <p className={styles.eyebrow}>Meet the Artist</p>
          <h2>Meet the Artist</h2>
          <p className={styles.founderSubtitle}>
            Founder & Lead Makeup Artist
          </p>
          <div className={styles.founderText}>
            <p>
              Ife is the founder and lead makeup artist at Glee Makeovers. With
              years of hands-on experience in bridal, editorial and event
              makeup, she is known for her calm presence, attention to detail
              and ability to enhance natural beauty without overdoing it.
            </p>
            <p>
              Her approach to makeup is rooted in precision, artistry and
              understanding each client’s individuality. Whether working with
              brides, creatives or everyday clients, Ife is passionate about
              creating looks that feel effortless, polished and timeless.
            </p>
            <p>
              Clients often describe working with Ife as a stress-free and
              reassuring experience, especially on important days. Her goal is
              simple: for every client to feel confident, beautiful and truly
              themselves.
            </p>
          </div>
          <div className={styles.founderCredentials}>
            <h3>Experience & Expertise</h3>
            <ul>
              <li>Founder &amp; Lead Makeup Artist at Glee Makeovers</li>
              <li>Extensive experience in bridal, editorial, and event makeup</li>
              <li>Specialist in soft, timeless, and polished makeup looks</li>
              <li>Expertise in semi-permanent brow services and precision detailing</li>
              <li>Trusted for high-pressure wedding mornings and special occasions</li>
              <li>Known for a calm, professional, and client-focused approach</li>
            </ul>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
