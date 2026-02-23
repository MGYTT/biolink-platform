export type Plan = 'free' | 'pro'
export type BlockType =
  | 'link' | 'header' | 'text' | 'divider' | 'image'
  | 'social' | 'video' | 'music' | 'countdown'
  | 'form' | 'map' | 'pdf' | 'product' | 'html'

export type ButtonStyle = 'rounded' | 'pill' | 'square' | 'outline' | 'shadow'
export type Theme = 'minimal' | 'dark' | 'gradient' | 'glassmorphism' | 'neon' | 'retro'

export interface Profile {
  id: string
  username: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  plan: Plan
  created_at: string
  updated_at: string
}

export interface Page {
  id: string
  user_id: string
  slug: string
  title: string
  description: string | null
  theme: Theme
  bg_color: string
  bg_gradient: string | null
  font_family: string
  text_color: string
  button_style: ButtonStyle
  profile_pic: string | null
  is_published: boolean
  custom_domain: string | null
  seo_title: string | null
  seo_desc: string | null
  meta_image: string | null
  created_at: string
  updated_at: string
}

export interface Block {
  id: string
  page_id: string
  type: BlockType
  label: string | null
  url: string | null
  icon: string | null
  image_url: string | null
  position: number
  is_visible: boolean
  settings: Record<string, unknown>
  visible_from: string | null
  visible_to: string | null
  created_at: string
  updated_at: string
}

export interface Click {
  id: string
  block_id: string | null
  page_id: string | null
  country: string | null
  city: string | null
  device: 'desktop' | 'mobile' | 'tablet' | null
  browser: string | null
  os: string | null
  referrer: string | null
  clicked_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  plan: Plan
  status: 'active' | 'canceled' | 'past_due' | 'trialing'
  current_period_end: string | null
}
