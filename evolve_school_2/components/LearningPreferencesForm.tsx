"use client";

import { useEffect, useState } from "react";
import PreferencesFormFields from "@/components/profile/PreferencesFormFields";
import PreferencesInterestsPicker from "@/components/profile/PreferencesInterestsPicker";
import { createClient } from "@/lib/supabase/client";

export default function LearningPreferencesForm() {
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [format, setFormat] = useState("");
  const [language, setLanguage] = useState("");
  const [learningTime, setLearningTime] = useState("");

  const [interests, setInterests] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );

  useEffect(() => {
    let cancelled = false;

    const loadPreferences = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || cancelled) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_learning_preferences")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error && !cancelled) {
        console.error("[Evolve] Error loading preferences:", error);
        setMessage(error.message);
        setMessageType("error");
      }

      if (data && !cancelled) {
        setGoal(data.learning_goal ?? "");
        setLevel(data.current_level ?? "");
        setCategory(data.preferred_category ?? "");
        setDifficulty(data.preferred_difficulty ?? "");
        setFormat(data.preferred_learning_format ?? "");
        setLanguage(data.preferred_language ?? "");
        setLearningTime(data.learning_time ?? "");
        setInterests(Array.isArray(data.interests) ? data.interests : []);
        setSkills(Array.isArray(data.skills) ? data.skills : []);
      }

      if (!cancelled) {
        setLoading(false);
      }
    };

    void loadPreferences();

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleInterest = (interest: string) => {
    setInterests((current) => {
      if (current.includes(interest)) {
        return current.filter((item) => item !== interest);
      }
      return [...current, interest];
    });
  };

  const savePreferences = async () => {
    setSaving(true);
    setMessage("");

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage("You must be logged in.");
        setMessageType("error");
        return;
      }

      const preferences = {
        user_id: user.id,
        learning_goal: goal.trim(),
        current_level: level || null,
        preferred_category: category || null,
        interests,
        skills,
        preferred_difficulty: difficulty || null,
        preferred_learning_format: format || null,
        learning_time: learningTime.trim(),
        preferred_language: language || null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("user_learning_preferences")
        .upsert(preferences, {
          onConflict: "user_id",
        })
        .select("user_id")
        .single();

      if (error) {
        console.error("[Evolve] Error saving preferences:", error);
        setMessage(`Could not save preferences: ${error.message}`);
        setMessageType("error");
        return;
      }

      if (!data || data.user_id !== user.id) {
        setMessage(
          "The preferences were not saved. Please check your account permissions.",
        );
        setMessageType("error");
        return;
      }

      setMessage("Preferences saved successfully.");
      setMessageType("success");
    } catch (error) {
      console.error("[Evolve] Unexpected preferences error:", error);
      setMessage("Something went wrong while saving your preferences.");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
        <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-brand" />
        <p className="mt-4 text-sm text-white/50">
          Loading your preferences...
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
      <div className="space-y-8">
        {/* Goals, Levels, Formats & Languages */}
        <PreferencesFormFields
          goal={goal}
          setGoal={setGoal}
          level={level}
          setLevel={setLevel}
          category={category}
          setCategory={setCategory}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          format={format}
          setFormat={setFormat}
          learningTime={learningTime}
          setLearningTime={setLearningTime}
          language={language}
          setLanguage={setLanguage}
          saving={saving}
        />

        {/* Interests multi-select pills */}
        <PreferencesInterestsPicker
          interests={interests}
          toggleInterest={toggleInterest}
          saving={saving}
        />

        {/* Skills Tag Input */}
        <div>
          <label className="mb-2 block text-sm font-medium text-white/80">
            Skills
          </label>
          <input
            type="text"
            value={skills.join(", ")}
            onChange={(e) => {
              setSkills(
                e.target.value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
              );
            }}
            disabled={saving}
            placeholder="Example: JavaScript, Python, SQL"
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-white/25 transition focus:border-brand/60 focus:ring-1 focus:ring-brand/30 disabled:opacity-50"
          />
          <p className="mt-2 text-xs text-white/30">
            Separate multiple skills with commas.
          </p>
        </div>

        {/* Save button & status feedback */}
        <div className="border-t border-white/10 pt-6">
          <button
            type="button"
            onClick={() => {
              void savePreferences();
            }}
            disabled={saving}
            className="w-full rounded-2xl bg-brand px-6 py-3.5 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving preferences..." : "Save preferences"}
          </button>

          {message && (
            <div
              className={`mt-4 rounded-xl border px-4 py-3 text-center text-sm ${
                messageType === "success"
                  ? "border-brand/20 bg-brand/10 text-brand"
                  : "border-red-500/20 bg-red-500/10 text-red-400"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
