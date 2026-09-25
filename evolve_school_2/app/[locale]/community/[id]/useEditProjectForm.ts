"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { compressImage, validateUploadFile } from "@/lib/imageCompressor";
import { createClient } from "@/lib/supabase/client";

type InitialValues = {
  projectId: string;
  locale: string;
  initialTitle: string;
  initialDescription: string;
  initialCategory: string;
  initialTechnologies: string;
  initialGithubUrl: string;
  initialDemoUrl: string;
  initialImageUrl: string;
};

// All state, handlers and the submit flow for EditProjectForm.
// Kept separate so the component file stays under the size limit.
export function useEditProjectForm({
  projectId,
  locale,
  initialTitle,
  initialDescription,
  initialCategory,
  initialTechnologies,
  initialGithubUrl,
  initialDemoUrl,
  initialImageUrl,
}: InitialValues) {
  const supabase = createClient();
  const router = useRouter();

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [category, setCategory] = useState(initialCategory);
  const [technologies, setTechnologies] = useState(initialTechnologies);
  const [githubUrl, setGithubUrl] = useState(initialGithubUrl);
  const [demoUrl, setDemoUrl] = useState(initialDemoUrl);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialImageUrl || null,
  );

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateUploadFile(file);

    if (!validation.valid) {
      setMessage(validation.error || "Fichier image invalide.");
      return;
    }

    try {
      const compressed = await compressImage(file, 1600, 0.85);
      setImageFile(compressed);
      setImagePreview(URL.createObjectURL(compressed));
      setMessage("");
    } catch {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const addTechnologyTag = (tag: string) => {
    const currentTags = technologies
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (!currentTags.includes(tag)) {
      setTechnologies(currentTags.length > 0 ? `${technologies}, ${tag}` : tag);
    }
  };

  async function uploadNewImage(userId: string) {
    const fileExt = (imageFile as File).name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("community-projects")
      .upload(filePath, imageFile as File, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("[Image Upload]", uploadError);
      throw new Error(
        `Impossible de télécharger l'image : ${uploadError.message}`,
      );
    }

    const { data } = supabase.storage
      .from("community-projects")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Vous devez être connecté.");
      setLoading(false);
      return;
    }

    let finalImageUrl = initialImageUrl || null;

    if (imageFile) {
      try {
        finalImageUrl = await uploadNewImage(user.id);
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Erreur d'upload.");
        setLoading(false);
        return;
      }
    }

    const { error } = await supabase
      .from("community_projects")
      .update({
        title: title.trim(),
        description: description.trim(),
        category: category.trim() || null,
        technologies: technologies
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        github_url: githubUrl.trim() || null,
        demo_url: demoUrl.trim() || null,
        image_url: finalImageUrl,
      })
      .eq("id", projectId)
      .eq("user_id", user.id);

    if (error) {
      console.error("[Project Update]", error);
      setMessage(`Erreur lors de la mise à jour : ${error.message}`);
      setLoading(false);
      return;
    }

    router.push(`/${locale}/community/${projectId}`);
    router.refresh();
  }

  return {
    title,
    setTitle,
    description,
    setDescription,
    category,
    setCategory,
    technologies,
    setTechnologies,
    githubUrl,
    setGithubUrl,
    demoUrl,
    setDemoUrl,
    imageFile,
    imagePreview,
    loading,
    message,
    handleImageChange,
    addTechnologyTag,
    handleSubmit,
  };
}
