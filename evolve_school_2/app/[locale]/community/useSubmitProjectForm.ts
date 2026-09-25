"use client";

import { useState } from "react";
import { compressImage, validateUploadFile } from "@/lib/imageCompressor";
import { createClient } from "@/lib/supabase/client";

type Message = { text: string; type: "success" | "error" };

// All form state, handlers and the submit flow for SubmitProjectForm.
// Kept separate so the component file stays under the size limit.
export function useSubmitProjectForm(locale: string) {
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const addTech = (t: string) => {
    const list = technologies
      ? technologies
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    if (!list.includes(t)) {
      list.push(t);
      setTechnologies(list.join(", "));
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setTechnologies("");
    setGithubUrl("");
    setDemoUrl("");
    setImageFile(null);
    setPreviewUrl(null);
  };

  async function uploadProjectImage(userId: string) {
    const validation = validateUploadFile(imageFile as File);
    if (!validation.valid) {
      throw new Error(validation.error || "Fichier image invalide.");
    }

    const fileToUpload = await compressImage(imageFile as File);
    const fileName = `${crypto.randomUUID()}.webp`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("community-projects")
      .upload(filePath, fileToUpload, {
        cacheControl: "3600",
        upsert: false,
        contentType: "image/webp",
      });

    if (uploadError) {
      console.error("[Image Upload]", uploadError);
      throw new Error(uploadError.message);
    }

    const { data: publicUrlData } = supabase.storage
      .from("community-projects")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setMessage(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage({
        text:
          locale === "ar"
            ? "يجب تسجيل الدخول لنشر مشروع"
            : "Vous devez être connecté pour publier un projet.",
        type: "error",
      });
      setLoading(false);
      return;
    }

    const { data: duplicate } = await supabase
      .from("community_projects")
      .select("id")
      .eq("user_id", user.id)
      .eq("title", title.trim())
      .maybeSingle();

    if (duplicate) {
      setMessage({
        text: "Vous avez déjà publié un projet avec ce titre.",
        type: "error",
      });
      setLoading(false);
      return;
    }

    let imageUrl: string | null = null;

    if (imageFile) {
      try {
        imageUrl = await uploadProjectImage(user.id);
      } catch (err) {
        setMessage({
          text: err instanceof Error ? err.message : "Erreur d'upload.",
          type: "error",
        });
        setLoading(false);
        return;
      }
    }

    const { error } = await supabase.from("community_projects").insert({
      user_id: user.id,
      title,
      description,
      category: category || null,
      technologies: technologies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      github_url: githubUrl || null,
      demo_url: demoUrl || null,
      image_url: imageUrl,
    });

    if (error) {
      console.error("[Project Create]", error);
      setMessage({ text: error.message, type: "error" });
      setLoading(false);
      return;
    }

    resetForm();
    setMessage({
      text: "Félicitations ! Votre projet a été publié avec succès dans la communauté.",
      type: "success",
    });
    setLoading(false);
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
    previewUrl,
    loading,
    message,
    addTech,
    handleImageChange,
    handleSubmit,
  };
}
