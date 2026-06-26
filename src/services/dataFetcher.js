// StartupForge AI — Real web data fetcher.
// Fetches live data from news, GitHub, Hacker News, and web search APIs.
// Uses CORS proxies where needed and falls back gracefully.

const CORS_PROXIES = [
  "https://corsproxy.io/?",
  "https://api.allorigins.win/raw?url=",
];

function proxyUrl(url) {
  return `${CORS_PROXIES[0]}${encodeURIComponent(url)}`;
}

function safeJson(str) {
  try { return JSON.parse(str); } catch { return null; }
}

// ── GitHub ──

export async function fetchGitHubRepos(topic, limit = 10) {
  try {
    const q = `${topic} stars:>100 pushed:>2025-01-01`;
    const res = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=${limit}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.items || []).map((r) => ({
      type: "github",
      title: `${r.full_name} — ${r.description || "No description"}`,
      url: r.html_url,
      date: r.pushed_at,
      stars: r.stargazers_count,
      language: r.language,
      source: "github.com",
    }));
  } catch { return []; }
}

export async function fetchGitHubIssues(topic, limit = 10) {
  try {
    const q = `"${topic}" is:issue is:open sort:reactions`;
    const res = await fetch(`https://api.github.com/search/issues?q=${encodeURIComponent(q)}&sort=reactions&order=desc&per_page=${limit}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.items || []).map((i) => ({
      type: "github_issue",
      title: i.title,
      url: i.html_url,
      date: i.created_at,
      reactions: i.reactions?.total_count || 0,
      source: "github.com",
    }));
  } catch { return []; }
}

// ── Hacker News ──

export async function fetchHNStories(topic, limit = 10) {
  try {
    const res = await fetch(proxyUrl(`https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(topic)}&tags=story&hitsPerPage=${limit}`));
    if (!res.ok) return [];
    const data = safeJson(await res.text());
    if (!data?.hits) return [];
    return data.hits.map((h) => ({
      type: "hackernews",
      title: h.title,
      url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
      date: h.created_at,
      points: h.points || 0,
      comments: h.num_comments || 0,
      source: "news.ycombinator.com",
    }));
  } catch { return []; }
}

// ── Google News RSS ──

export async function fetchGoogleNews(topic, limit = 10) {
  try {
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(topic)}&hl=en&gl=US&ceid=US:en`;
    const res = await fetch(proxyUrl(rssUrl));
    if (!res.ok) return [];
    const xml = await res.text();
    const items = [];
    const regex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    let count = 0;
    while ((match = regex.exec(xml)) && count < limit) {
      const block = match[1];
      const title = (block.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "").replace(/<!\[CDATA\[|\]\]>/g, "");
      const link = (block.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "").replace(/<!\[CDATA\[|\]\]>/g, "");
      const pubDate = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "";
      const source = block.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1] || "Google News";
      if (title && link) {
        items.push({
          type: "news",
          title: title.trim(),
          url: link.trim(),
          date: pubDate,
          source: source.trim(),
        });
        count++;
      }
    }
    return items;
  } catch { return []; }
}

// ── Reddit (public JSON) ──

export async function fetchRedditPosts(topic, limit = 8) {
  try {
    const res = await fetch(proxyUrl(`https://www.reddit.com/search.json?q=${encodeURIComponent(topic)}&sort=new&limit=${limit}`));
    if (!res.ok) return [];
    const data = safeJson(await res.text());
    if (!data?.data?.children) return [];
    return data.data.children.map((c) => ({
      type: "reddit",
      title: c.data.title,
      url: `https://reddit.com${c.data.permalink}`,
      date: new Date(c.data.created_utc * 1000).toISOString(),
      score: c.data.score,
      comments: c.data.num_comments,
      subreddit: c.data.subreddit,
      source: "reddit.com",
    }));
  } catch { return []; }
}

// ── ArXiv ──

export async function fetchArxivPapers(topic, limit = 5) {
  try {
    const res = await fetch(proxyUrl(`http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(topic)}&sortBy=submittedDate&sortOrder=descending&max_results=${limit}`));
    if (!res.ok) return [];
    const xml = await res.text();
    const entries = [];
    const regex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;
    while ((match = regex.exec(xml)) && entries.length < limit) {
      const block = match[1];
      const title = (block.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "").replace(/\s+/g, " ").trim();
      const link = block.match(/<id>([\s\S]*?)<\/id>/)?.[1] || "";
      const published = block.match(/<published>([\s\S]*?)<\/published>/)?.[1] || "";
      const summary = (block.match(/<summary>([\s\S]*?)<\/summary>/)?.[1] || "").replace(/\s+/g, " ").trim().slice(0, 200);
      if (title) entries.push({
        type: "paper",
        title,
        url: link,
        date: published,
        summary,
        source: "arxiv.org",
      });
    }
    return entries;
  } catch { return []; }
}

// ── All-in-one fetcher ──

export async function fetchAllData(topic, onProgress) {
  const log = (msg) => onProgress?.(msg);

  log("Searching GitHub repositories and issues...");
  const [repos, issues] = await Promise.all([
    fetchGitHubRepos(topic, 8),
    fetchGitHubIssues(topic, 8),
  ]);

  log("Fetching Hacker News discussions...");
  const hn = await fetchHNStories(topic, 8);

  log("Scanning Google News articles...");
  const news = await fetchGoogleNews(topic, 10);

  log("Searching Reddit for pain points...");
  const reddit = await fetchRedditPosts(topic, 8);

  log("Checking latest research papers...");
  const papers = await fetchArxivPapers(topic, 5);

  const all = [...news, ...repos, ...issues, ...hn, ...reddit, ...papers];

  const painPoints = extractPainPoints(all, topic);
  const trends = analyzeTrends(all, topic);
  const competitorMentions = extractCompetitorMentions(all);

  return { signals: all, painPoints, trends, competitorMentions, repos, issues, hn, news, reddit, papers };
}

function extractPainPoints(signals, topic) {
  const painKeywords = [
    "problem", "issue", "pain", "struggle", "difficult", "frustrat", "complaint",
    "broken", "lacking", "missing", "gap", "challenge", "bottleneck", "inefficient",
    "expensive", "slow", "manual", "tedious", "legacy", "outdated", "complex",
    "can't", "cannot", "no good", "no way", "need", "want", "wish", "looking for",
    "alternative", "better", "improve", "fix", "solve", "workaround",
  ];

  const painItems = signals.filter((s) => {
    const text = s.title.toLowerCase();
    return painKeywords.some((kw) => text.includes(kw));
  });

  const painPoints = [];
  const seen = new Set();

  for (const item of painItems.slice(0, 10)) {
    const key = item.title.slice(0, 60).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    painPoints.push({
      title: item.title,
      source: item.source,
      url: item.url,
      type: item.type,
      signalStrength: item.reactions || item.points || item.score || 1,
    });
  }

  return painPoints.sort((a, b) => b.signalStrength - a.signalStrength);
}

function analyzeTrends(signals, topic) {
  const timeFrames = { "24h": 0, "7d": 0, "30d": 0 };
  const now = Date.now();

  for (const s of signals) {
    const d = new Date(s.date).getTime();
    if (isNaN(d)) continue;
    const age = now - d;
    if (age < 86400000) timeFrames["24h"]++;
    else if (age < 604800000) timeFrames["7d"]++;
    else if (age < 2592000000) timeFrames["30d"]++;
  }

  const typeCounts = {};
  for (const s of signals) {
    typeCounts[s.type] = (typeCounts[s.type] || 0) + 1;
  }

  const sourceCounts = {};
  for (const s of signals) {
    const domain = s.source || "unknown";
    sourceCounts[domain] = (sourceCounts[domain] || 0) + 1;
  }

  return {
    timeFrames,
    totalSignals: signals.length,
    typeDistribution: typeCounts,
    topSources: Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]).slice(0, 5),
    momentum: timeFrames["24h"] > 3 ? "hot" : timeFrames["7d"] > 8 ? "rising" : "steady",
  };
}

function extractCompetitorMentions(signals) {
  const knownCompanies = [
    "OpenAI", "Anthropic", "Google", "Microsoft", "Meta", "Amazon", "Apple",
    "Stripe", "Vercel", "Cloudflare", "Supabase", "Linear", "Notion",
    "Figma", "Canva", "Slack", "Discord", "Twilio", "MongoDB",
    "Datadog", "Sentry", "PostHog", "Amplitude", "Mixpanel",
    "Salesforce", "HubSpot", "Zendesk", "Intercom",
  ];

  const mentions = {};
  for (const s of signals) {
    const text = s.title + " " + (s.summary || "");
    for (const co of knownCompanies) {
      if (text.toLowerCase().includes(co.toLowerCase())) {
        mentions[co] = (mentions[co] || 0) + 1;
      }
    }
  }

  return Object.entries(mentions).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, count]) => ({ name, mentions: count }));
}
