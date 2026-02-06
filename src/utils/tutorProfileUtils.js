// src/utils/tutorProfileUtils.js
// Get a stable id/slug for tutor profile URL (supports id, tutor_id, slug, or encoded name)

export function getTutorProfileId(instructor) {
  if (!instructor) return '';
  const id = instructor.id ?? instructor.tutor_id ?? instructor.slug;
  if (id != null && id !== '') return String(id);
  if (instructor.name) return encodeURIComponent(String(instructor.name).trim());
  return '';
}

export function getTutorProfilePath(instructor) {
  const id = getTutorProfileId(instructor);
  return id ? `/tutor-profile/${id}` : null;
}
