import { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-find-saas-ideas-from-pain-points",
    title: "How to Find SaaS Ideas from Real Customer Pain Points",
    description:
      "Stop guessing what to build. Learn how to mine Reddit, forums, and reviews for validated pain points—and turn complaints into products people actually pay for.",
    date: "2026-02-15",
    author: "PainRadar Team",
    readTime: "8 min read",
    content: `# How to Find SaaS Ideas from Real Customer Pain Points

The best SaaS ideas don't come from brainstorming sessions or "disruption" fantasies. They come from listening to people who are frustrated, annoyed, and actively searching for solutions. In this guide, we'll show you exactly where to find those pain points—and how to evaluate which ones are worth building for.

## Why Pain Points Beat Ideas

An idea is a hypothesis. A pain point is evidence. When someone posts on Reddit at 2 AM complaining about a tool, or leaves a 2-star review explaining what went wrong, they're doing your market research for you. They're telling you what's broken, how it affects them, and sometimes even what they wish existed instead.

The founders of Superhuman didn't invent "faster email." They noticed people were frustrated with Gmail's sluggishness. Loom didn't invent "video messaging"—they saw teams drowning in long written explanations. The pattern is consistent: **great products emerge from patterns of complaints**, not from ideas in a vacuum.

## Where to Find Pain Points

### Reddit

Reddit is a goldmine. Subreddits are self-selecting communities of people who care enough about a topic to join. When they complain, they're often speaking for thousands of lurkers who feel the same way.

**Strategy:**
- Search for your niche (e.g., "invoicing," "CRM," "scheduling")
- Look at both broad subs (r/smallbusiness, r/entrepreneur) and niche ones (r/freelance, r/therapists)
- Sort by "relevance" and "top" to find threads with traction
- Pay attention to comments, not just top-level posts—the real complaints often emerge in replies

### Forums and Communities

Indie Hackers, Hacker News, niche Slack communities, and industry forums (e.g., therapist forums, restaurant owner groups) contain candid discussions that never make it to polished review sites. People ask "does anyone know a better way to..." and "I'm so tired of..."—that's your signal.

### Review Sites

G2, Capterra, and TrustRadius are where people go *after* they've tried a product. The 2- and 3-star reviews are especially valuable: customers liked the product enough to buy it, but something specific frustrated them. Those "cons" sections are often a list of unmet needs.

### Support Tickets and Changelogs

If you're already building in a space, your own support tickets are a direct line to pain. Competitors' public changelogs and "we're building X because you asked" announcements also reveal what customers are demanding.

## How to Evaluate Pain Points

Not every complaint is a business opportunity. Use this framework to prioritize:

1. **Frequency** – Does this come up repeatedly across sources? One post is noise; twenty is a pattern.
2. **Urgency** – Are people actively looking for solutions, or passively complaining?
3. **Willingness to pay** – Do comments mention budgeting, switching costs, or "I'd pay for..."?
4. **Specificity** – Vague complaints ("everything sucks") are hard to build for. Specific ones ("I need X that does Y") are actionable.
5. **Competition** – Is anyone solving this well? If the leader has 4.2 stars and 2,000 "cons" about the same thing, there's room.

## Scoring Methodology

At PainRadar, we score opportunities across five dimensions:
- **Demand** – Volume and consistency of complaints
- **Urgency** – How badly people want a fix now
- **Competition** – How well (or poorly) incumbents are serving the need
- **Monetization** – Evidence of willingness to pay
- **Feasibility** – Can a small team build an MVP?

A score of 75+ suggests a strong opportunity. Below 60, tread carefully—the pain might be real but the market might be too small or too crowded.

## Turning Complaints into Products

Once you've identified a pattern:

1. **Extract the core problem** – Strip away the specifics. What's the universal need?
2. **Define the MVP** – What's the smallest solution that addresses the top 1–2 pain points?
3. **Validate before building** – Post in the same communities: "Would you use X if it did Y?" or run a simple landing page.
4. **Ship fast** – Don't over-engineer. Get something in front of users and iterate.

The goal isn't to build the perfect product. It's to build something that makes a real problem measurably less painful. Start there.`,
  },
  {
    slug: "reddit-research-workflow-saas-founders",
    title: "Reddit Research Workflow for SaaS Founders",
    description:
      "A practical guide to using Reddit as a research tool: subreddit selection, search techniques, and how to separate signal from noise when hunting for SaaS ideas.",
    date: "2026-01-28",
    author: "PainRadar Team",
    readTime: "6 min read",
    content: `# Reddit Research Workflow for SaaS Founders

Reddit is one of the most underutilized research tools for SaaS founders. Unlike LinkedIn or Twitter, Reddit conversations are raw, unpolished, and often brutally honest. People come to vent, ask for help, and complain—and that's exactly what you need when hunting for product ideas. Here's a repeatable workflow to turn Reddit into your research engine.

## Choosing the Right Subreddits

Not all subreddits are created equal. You want communities where your target audience actually hangs out and talks about their work.

**Tiers of value:**
- **Tier 1**: Niche subs directly aligned with your focus (e.g., r/freelance for freelancer tools, r/therapists for practice management). Smaller but highly relevant.
- **Tier 2**: Adjacent subs (r/smallbusiness, r/entrepreneur) where your audience participates alongside others. Broader reach, slightly noisier.
- **Tier 3**: Mega-subs (r/startups, r/SaaS) where lots of founders post. Good for competitive landscape and "what are people building?" but less direct pain-point mining.

**Pro tip:** Use [subreddit overlap tools](https://subredditstats.com) to discover related communities. If r/freelance overlaps heavily with r/Upwork, you've found another place your audience lives.

## Search Techniques That Work

Reddit's search is notoriously bad. Work around it:

1. **Google site search** – \`site:reddit.com [your niche] [pain word]\` (e.g., \`site:reddit.com invoicing frustrated\`) often surfaces threads Reddit search misses.
2. **Keyword combos** – Search for: "does anyone," "wish there was," "any alternatives," "recommend," "best tool for," "switching from." These phrases precede complaints and recommendations.
3. **Competitor names** – Search for "[CompetitorX] alternatives" or "[CompetitorX] sucks." You'll find people explaining *why* they're leaving—those reasons are feature requests.
4. **Time filters** – Use Reddit's "past year" or "past month" to avoid stale discussions. Pain points evolve; old threads may no longer reflect current frustration.

## Identifying Recurring Complaints

One post is an anecdote. Five posts are a trend. Twenty posts are a market.

**Process:**
1. Collect 50–100 relevant threads (title + top comments).
2. Tag each with the core complaint (e.g., "expensive," "too complex," "no integration").
3. Look for clusters. If "manual invoicing" and "chasing payments" show up in 30% of posts, you've found a pattern.
4. Note the *language* people use. Your landing page copy should echo their words, not your jargon.

## Extracting Signal from Noise

Reddit has plenty of noise: memes, off-topic rants, and "just use Excel" types. Filter for signal:

- **Upvotes matter** – A post with 200 upvotes and 80 comments means the topic resonated. A post with 2 upvotes might be an edge case.
- **Comment depth** – Long reply chains often contain the real nuance. Someone's 3-paragraph explanation of their workflow is gold.
- **Recency** – A complaint from 2 years ago might be solved. A complaint from 2 weeks ago is current.
- **Source credibility** – "I've tried 5 tools and they all..." carries more weight than "I heard that..."

## Building a Research Habit

Research isn't a one-time project. Pain points shift, new tools launch, and markets evolve.

**Weekly routine:**
- 30 minutes: Scan your top 5 subreddits for new "recommend" or "alternatives" threads.
- 15 minutes: Add noteworthy complaints to a spreadsheet or note doc. Tag by theme.
- Monthly: Review your tags. What's increasing? What's new? That's your roadmap signal.

**Automation:** Use Reddit RSS feeds, or tools like PainRadar, to get alerts when specific keywords appear. Don't rely on memory—build systems that surface signal automatically.

## From Research to Action

Research without action is procrastination. Once you've identified a pattern:

1. **Validate** – Post or comment in those same subs: "I'm building X for people who struggle with Y. Would that help?" Gauge response.
2. **Build a micro-MVP** – The simplest version that addresses the #1 complaint. Not a full product—a focused solution.
3. **Share your work** – Post a "Show IH" or subreddit-specific "I built this for you" update. The communities that gave you insights will often give you your first users.

Reddit is free, public, and full of people who want to be heard. Your job is to listen—and then build something that makes their lives easier.`,
  },
];
