export interface MarkdownFrontmatter {
  title: string;
  slug: string;
  description: string;
  author: string;
  authorRole: string;
  pubDate: string;
  category: 'threat-hunting' | 'ia-defensiva' | 'forense-digital' | 'criptografia' | 'soc-secops';
  categoryLabel: string;
  readTime: string;
  tags: string[];
  canonicalUrl?: string;
  featured?: boolean;
}

export interface MarkdownArticle {
  frontmatter: MarkdownFrontmatter;
  rawMarkdown: string;
  excerpt: string;
}
