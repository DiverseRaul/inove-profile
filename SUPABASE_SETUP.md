# Supabase Database Schema

This document outlines the database schema for the inove.studio profile website.

## Tables

### contact_submissions
Stores contact form submissions from potential clients.

```sql
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  phone VARCHAR(50),
  project_type VARCHAR(100) NOT NULL,
  budget VARCHAR(50),
  timeline VARCHAR(50),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### newsletter_subscriptions
Stores email addresses for newsletter subscriptions.

```sql
CREATE TABLE newsletter_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### projects
Stores portfolio projects for display on the website.

```sql
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  technologies TEXT[] NOT NULL,
  image_url VARCHAR(500),
  project_url VARCHAR(500),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### page_views
Tracks page views for analytics (optional).

```sql
CREATE TABLE page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page VARCHAR(255) NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT
);
```

## Row Level Security (RLS)

Enable RLS on all tables and create appropriate policies:

```sql
-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Policies for contact_submissions
CREATE POLICY "Allow insert for all users" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Policies for newsletter_subscriptions
CREATE POLICY "Allow insert for all users" ON newsletter_subscriptions
  FOR INSERT WITH CHECK (true);

-- Policies for projects
CREATE POLICY "Allow read for all users" ON projects
  FOR SELECT USING (true);

-- Policies for page_views
CREATE POLICY "Allow insert for all users" ON page_views
  FOR INSERT WITH CHECK (true);
```

## Sample Data

### Projects
```sql
INSERT INTO projects (title, description, category, technologies, featured) VALUES
('TechFlow Dashboard', 'A comprehensive analytics dashboard for a SaaS platform with real-time data visualization.', 'web', ARRAY['Vue.js', 'D3.js', 'Node.js', 'MongoDB'], true),
('EcoShop Mobile App', 'Sustainable shopping app with AR features for product visualization and carbon footprint tracking.', 'mobile', ARRAY['React Native', 'ARKit', 'Firebase', 'Stripe'], true),
('Zenith Brand Identity', 'Complete brand redesign for a luxury wellness company including logo, guidelines, and marketing materials.', 'branding', ARRAY['Adobe Creative Suite', 'Figma', 'Brand Strategy'], false);
```

## Environment Variables

Add these to your `.env.local` file:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

