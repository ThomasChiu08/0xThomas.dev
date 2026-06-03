export const siteConfig = {
  name: "0xThomas",
  title: "0xThomas | AI, Finance, Crypto, and Focus Systems",
  description:
    "Thomas builds tools, research systems, and products across AI, finance, crypto, trading systems, developer tools, and personal operating systems.",
  url: "https://0xthomas.dev",
};

export const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Notes", href: "#notes" },
  { label: "Contact", href: "#contact" },
] as const;

export const identities = [
  {
    title: "Builder",
    description: "Turns abstract ideas into shipped systems with clear edges.",
  },
  {
    title: "Researcher",
    description: "Studies markets, AI, and workflows before committing exposure.",
  },
  {
    title: "Trader",
    description: "Treats decisions as feedback loops, not isolated bets.",
  },
  {
    title: "Developer",
    description: "Builds useful tools with simple interfaces and observable behavior.",
  },
  {
    title: "Systems Thinker",
    description: "Designs around constraints, incentives, and compounding effects.",
  },
] as const;

export const projects = [
  {
    name: "agentOS",
    description:
      "A multi-agent operating system framework for reliable, composable, and observable AI workflows.",
    status: "Building",
    category: "AI / System",
  },
  {
    name: "AlphaLoop",
    description:
      "A trading decision and review system designed to turn market actions into structured feedback loops.",
    status: "Research",
    category: "Finance / Trading",
  },
  {
    name: "XTopicMonitor",
    description:
      "A real-time topic monitoring system for markets, crypto, narratives, and social signals.",
    status: "Prototype",
    category: "Crypto / Signals",
  },
  {
    name: "FocusBox",
    description:
      "A minimalist focus system combining timeboxing, AI task breakdown, and deep work rituals.",
    status: "Prototype",
    category: "Focus / System",
  },
] as const;

export const noteTopics = [
  {
    title: "Market structure",
    description: "Notes on liquidity, incentives, risk, and regime shifts.",
  },
  {
    title: "AI agents",
    description: "Experiments with composable workflows and reliable tool use.",
  },
  {
    title: "Trading systems",
    description: "Decision journals, review loops, and process design.",
  },
  {
    title: "Personal operating systems",
    description: "Frameworks for focus, execution, and compounding output.",
  },
  {
    title: "Product thinking",
    description: "Short observations on useful systems and founder craft.",
  },
] as const;

export const principles = [
  "Build systems, not noise.",
  "Think in loops.",
  "Protect downside.",
  "Ship small, compound long.",
  "Research before exposure.",
] as const;

export const contactLinks = [
  { label: "X", href: "https://x.com/Thomas_0822" },
  { label: "GitHub", href: "https://github.com/ThomasChiu08" },
  { label: "Email", href: "mailto:thomaschiu0822@gmail.com" },
  { label: "Telegram", href: "https://t.me/thomas_cinematic08" },
] as const;
