export type Theme = 'default' | 'dark' | 'purple' | 'ocean' | 'sunset' | 'forest'
export type ButtonStyle = 'rounded' | 'pill' | 'square' | 'outline' | 'soft-shadow'
export type BgType = 'solid' | 'gradient' | 'image'
export type FontFamily = 'inter' | 'serif' | 'mono' | 'poppins' | 'playfair'
export type AnimationStyle = 'none' | 'fade' | 'slide-up' | 'slide-down' | 'bounce' | 'zoom'

export type BlockType =
  | 'link'
  | 'header'
  | 'text'
  | 'html'        // ← DODAJ TĘ LINIĘ
  | 'image'
  | 'video'
  | 'music'
  | 'social'
  | 'email'
  | 'divider'
  | 'countdown'
  | 'map'
  | 'form'
  | 'product'
  | 'pdf'

export interface Block {
  id: string
  page_id: string
  type: BlockType
  title: string | null
  label: string | null
  url: string | null
  content: string | null
  image_url: string | null
  position: number
  is_active: boolean
  is_visible: boolean
  icon: string | null
  thumbnail: string | null
  schedule_start: string | null
  schedule_end: string | null
  visible_from: string | null
  visible_to: string | null
  settings: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface Page {
  id: string
  user_id: string
  title: string
  slug: string
  description: string | null
  profile_pic: string | null
  is_published: boolean
  theme: Theme
  button_style: ButtonStyle
  font_family: FontFamily
  bg_type: BgType
  bg_color: string | null
  bg_gradient: string | null
  gradient_from: string | null
  gradient_to: string | null
  text_color: string | null
  meta_image: string | null
  seo_title: string | null
  seo_desc: string | null
  created_at: string
  updated_at: string
  custom_css:       string | null
  block_animation:  AnimationStyle
  button_color:     string | null
  button_text_color: string | null
  font_url:         string | null
}

export interface Profile {
  id: string
  username: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  plan: 'free' | 'pro'
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  plan: 'free' | 'pro'
  status: string
  current_period_start: string | null
  current_period_end: string | null
}

export interface Click {
  id: string
  page_id: string
  block_id: string | null
  clicked_at: string
  device: string | null
  country: string | null
  referrer: string | null
}
