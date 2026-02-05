// Full reviews page with all client feedback.
"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./page.module.css";

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

export default function ReviewsPage() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpanded = (id: string) => {
    setExpanded((current) => ({ ...current, [id]: !current[id] }));
  };

  return (
    <main className={styles.page}>
      <section className={styles.header}>
        <p className={styles.eyebrow}>Reviews</p>
        <h1>Client experiences with GLEEMAKEOVERS.</h1>
        <p className={styles.subheading}>
          A calm collection of words shared by clients after their appointment.
        </p>
      </section>

      <section className={styles.grid}>
        {reviews.map((review) => {
          const isLong = review.text.length > 180;
          const isExpanded = expanded[review.id];
          return (
            <article key={review.id} className={styles.card}>
              <div className={styles.reviewStars}>{stars}</div>
              <p
                className={`${styles.reviewText} ${
                  isLong && !isExpanded ? styles.reviewClamp : ""
                }`}
              >
                {review.text}
              </p>
              {isLong ? (
                <button
                  type="button"
                  className={styles.toggle}
                  onClick={() => toggleExpanded(review.id)}
                >
                  {isExpanded ? "Show less" : "Show more"}
                </button>
              ) : null}
              <p className={styles.reviewName}>{review.name}</p>
            </article>
          );
        })}
      </section>

      <div className={styles.reviewCtaWrap}>
        <Link href="/review" className={styles.reviewCta}>
          Leave a review
        </Link>
      </div>
    </main>
  );
}
