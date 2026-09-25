interface EditCourseBasicInfoProps {
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  domain: string;
  setDomain: (val: string) => void;
  level: string;
  setLevel: (val: string) => void;
  type: string;
  setType: (val: string) => void;
  imageUrl: string;
  setImageUrl: (val: string) => void;
}

/**
 * EditCourseBasicInfo provides form fields for title, description,
 * domain, difficulty level, course type, and cover image URL.
 */
export default function EditCourseBasicInfo({
  title,
  setTitle,
  description,
  setDescription,
  domain,
  setDomain,
  level,
  setLevel,
  type,
  setType,
  imageUrl,
  setImageUrl,
}: EditCourseBasicInfoProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
      <h2 className="text-2xl font-bold">Basic Information</h2>

      <div className="mt-6 space-y-5">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Course title"
          className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-brand"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Course description"
          rows={5}
          className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-brand"
        />

        <input
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="Domain"
          className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-brand"
        />

        <div className="grid gap-5 md:grid-cols-2">
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-brand"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <input
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Course type"
            className="rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-brand"
          />
        </div>

        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Course image URL"
          className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-brand"
        />
      </div>
    </section>
  );
}
