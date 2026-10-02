"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { compressImage } from "@/lib/imageCompressor";
import { createClient } from "@/lib/supabase/client";
import type { WorkshopProjectItem } from "./types";

interface UseWorkshopProjectSubmissionProps {
  workshopId: string;
  workshopTitle: string;
  workshopDomain: string | null;
  existingProject?: WorkshopProjectItem | null;
  userId: string;
}

export function useWorkshopProjectSubmission({
  workshopId,
  workshopTitle,
  workshopDomain,
  existingProject,
  userId,
}: UseWorkshopProjectSubmissionProps) {
  const t = useTranslations("ateliers.enrolled.project");
  const [project, setProject] = useState<WorkshopProjectItem | null>(
    existingProject ?? null,
  );
  const [isEditing, setIsEditing] = useState(!existingProject);

  const [title, setTitle] = useState(
    existingProject?.title || `${workshopTitle} - Mon projet`,
  );
  const [description, setDescription] = useState(
    existingProject?.description || "",
  );
  const [githubUrl, setGithubUrl] = useState(existingProject?.github_url || "");
  const [demoUrl, setDemoUrl] = useState(existingProject?.demo_url || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    existingProject?.image_url || null,
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(t("titleRequired"));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const supabase = createClient();

      let uploadedImageUrl = previewUrl;

      if (imageFile) {
        try {
          const compressed = await compressImage(imageFile);
          const fileName = `${userId}/ws_${workshopId}_${Date.now()}.webp`;
          const { error: uploadError } = await supabase.storage
            .from("community-projects")
            .upload(fileName, compressed, {
              contentType: "image/webp",
              upsert: true,
            });

          if (!uploadError) {
            const { data } = supabase.storage
              .from("community-projects")
              .getPublicUrl(fileName);
            uploadedImageUrl = data.publicUrl;
          }
        } catch (uploadErr) {
          console.warn(
            "[WorkshopProject] Image upload skipped or failed:",
            uploadErr,
          );
        }
      }

      const projectData = {
        title: title.trim(),
        description: description.trim() || null,
        github_url: githubUrl.trim() || null,
        demo_url: demoUrl.trim() || null,
        image_url: uploadedImageUrl,
        category: workshopDomain || "Atelier",
        technologies: [workshopDomain || "Atelier", "Workshop Project"].filter(
          Boolean,
        ),
        user_id: userId,
      };

      const { data: inserted, error: insertError } = await supabase
        .from("community_projects")
        .insert(projectData)
        .select(
          "id, title, description, image_url, github_url, demo_url, created_at",
        )
        .single();

      if (insertError) {
        throw insertError;
      }

      setProject(inserted);
      setIsEditing(false);
    } catch (err) {
      console.error("[WorkshopProject] Submission error:", err);
      setError(t("submitError"));
    } finally {
      setLoading(false);
    }
  };

  return {
    t,
    project,
    isEditing,
    setIsEditing,
    title,
    setTitle,
    description,
    setDescription,
    githubUrl,
    setGithubUrl,
    demoUrl,
    setDemoUrl,
    previewUrl,
    handleFileChange,
    handleSubmit,
    loading,
    error,
  };
}
