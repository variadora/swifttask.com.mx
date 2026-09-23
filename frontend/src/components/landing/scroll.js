export const scrollToId = (href) => {
  const el = document.querySelector(href);
  if (!el) {
    // Section lives on the landing page; navigate there with the hash.
    window.location.href = `/${href}`;
    return;
  }
  const lenis = typeof window !== "undefined" ? window.__lenis : null;
  if (lenis) {
    lenis.scrollTo(el, { offset: -68, duration: 1.2 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
};
