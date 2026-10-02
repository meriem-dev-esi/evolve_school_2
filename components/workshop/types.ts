export interface WorkshopVideoItem {
  id: string;
  title: string;
  duration: number | null;
  order_index: number | null;
  video_url: string | null;
}

export interface WorkshopProjectItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  github_url: string | null;
  demo_url: string | null;
  created_at: string;
}
