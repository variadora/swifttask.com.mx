export const scrollToId = (href) => {
  const el = document.querySelector(href);
  if (!el) return;
  const lenis = typeof window !== "undefined" ? window.__lenis : null;
  if (lenis) {
    lenis.scrollTo(el, { offset: -68, duration: 1.2 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
};
