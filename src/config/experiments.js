export const activeExperiment = {
  key: "homepage-hero-cta",
  name: "Homepage Hero CTA Experiment",
  status: "active",
  variants: [
    {
      key: "A",
      weight: 50,
      config: {
        headline: "Catch Up On The Latest In Tech",
        ctaLabel: "Read Top Stories",
        heroTheme: "sunrise"
      }
    },
    {
      key: "B",
      weight: 50,
      config: {
        headline: "Stay Ahead With Curated Tech Briefs",
        ctaLabel: "Explore Stories",
        heroTheme: "midnight"
      }
    }
  ]
};
