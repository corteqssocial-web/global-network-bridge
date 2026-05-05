// Lightweight client-side store for blogger-submitted blog post links.
// These appear in the Medya (CityNews) page under the "Türk Diaspora Medyası" filter.

export interface DiasporaBlogLink {
  id: string;
  url: string;
  title: string;
  author: string;
  city?: string;
  country?: string;
  description?: string;
  createdAt: string;
}

const KEY = "corteqs:diaspora-blog-links";

function read(): DiasporaBlogLink[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw) as DiasporaBlogLink[];
    return Array.isArray(parsed) ? parsed : seed();
  } catch {
    return seed();
  }
}

function write(items: DiasporaBlogLink[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

function seed(): DiasporaBlogLink[] {
  const initial: DiasporaBlogLink[] = [
    {
      id: "seed-1",
      url: "https://example.com/amsterdam-turk-mahalleleri",
      title: "Amsterdam'da Türk Mahalleleri",
      author: "Selin Akış",
      city: "Amsterdam",
      country: "Hollanda",
      description: "Hollanda'daki Türk diasporasının yoğun olduğu mahalleleri keşfedin.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "seed-2",
      url: "https://example.com/berlin-diaspora-yemek",
      title: "Berlin Diaspora Mutfağı",
      author: "Mehmet Yıldız",
      city: "Berlin",
      country: "Almanya",
      description: "Berlin'deki en otantik Türk lezzetleri.",
      createdAt: new Date().toISOString(),
    },
  ];
  write(initial);
  return initial;
}

export function getDiasporaBlogLinks(city?: string, country?: string): DiasporaBlogLink[] {
  return read().filter((b) => {
    const cityOk = !city || city === "all" || b.city === city;
    const countryOk = !country || country === "all" || b.country === country;
    return cityOk && countryOk;
  });
}

export function addDiasporaBlogLink(input: Omit<DiasporaBlogLink, "id" | "createdAt">): DiasporaBlogLink {
  const items = read();
  const item: DiasporaBlogLink = {
    ...input,
    id: `link-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  write([item, ...items]);
  return item;
}

export function removeDiasporaBlogLink(id: string) {
  write(read().filter((b) => b.id !== id));
}

export function getDiasporaBlogLinksByAuthor(author: string): DiasporaBlogLink[] {
  return read().filter((b) => b.author === author);
}
