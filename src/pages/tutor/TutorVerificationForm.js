/**
 * Verification Form – Dynamic: GET /tutor/verification, POST /tutor/verification.
 * Shows "No verification found" when data is null; submit sends full_name, gender, email (required) + rest.
 * URL: /tutor/verification-form
 */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { useGetTutorVerificationQuery, useSubmitTutorVerificationMutation } from '../../store/api/authApi';
import { showSuccess, showError } from '../../utils/toast';
import '../../assets/css/tutor-verification-form.css';

const emptyPersonal = { fullName: '', gender: '', email: '', nric: '', dob: '', age: '', phone: '', whatsapp: '', maritalStatus: '', bankName: '', bankAccount: '' };
const emptyAddress = { address: '', latitude: '', longitude: '', state: '', city: '', postalCode: '' };
const emptyService = { levels: '', modeOfTutoring: '', preferableLocation: '', teachingExperience: '' };
const emptyEmergency = { name: '', relationship: '', number: '' };
const emptyEducation = { highestEducation: '', fieldOfStudy: '', academicYear: '', institutionName: '' };

function TutorVerificationForm() {
  const currentUser = useSelector(selectCurrentUser);
  const [personal, setPersonal] = useState({ ...emptyPersonal });
  const [address, setAddress] = useState({ ...emptyAddress });
  const [service, setService] = useState({ ...emptyService });
  const [emergency, setEmergency] = useState({ ...emptyEmergency });
  const [education, setEducation] = useState({ ...emptyEducation });

  const { data: verificationRes, isLoading: verificationLoading, isError: verificationError } = useGetTutorVerificationQuery();
  const [submitVerification, { isLoading: submitLoading, error: submitError }] = useSubmitTutorVerificationMutation();

  const verificationOk = verificationRes?.success === true || verificationRes?.status === true;
  const verification = verificationOk ? verificationRes?.data : null;
  const noVerificationMessage = !verificationLoading && (verificationError || verification == null) ? (verificationRes?.message || 'No verification found. Please submit your verification.') : null;
  const apiErrors = submitError?.data?.errors || {};

  useEffect(() => {
    if (!verification) return;
    const v = verification;
    const reduxFullName = currentUser?.profile
      ? `${currentUser.profile.first_name || ''} ${currentUser.profile.last_name || ''}`.trim()
      : (currentUser?.name || '');
    const reduxEmail = currentUser?.profile?.email ?? currentUser?.email ?? '';
    const reduxPhone = currentUser?.profile?.phone ?? '';
    setPersonal({
      // Prefer latest profile name so verification reflects profile updates instantly
      fullName: reduxFullName || v.full_name || '',
      gender: v.gender ?? '',
      email: reduxEmail || v.email || '',
      nric: v.nric ?? '',
      dob: v.dob ?? '',
      age: v.age ?? '',
      phone: reduxPhone || v.phone || '',
      whatsapp: v.whatsapp_number ?? v.whatsapp ?? '',
      maritalStatus: v.marital_status ?? '',
      bankName: v.bank_name ?? '',
      bankAccount: v.bank_account_number ?? v.bank_account ?? '',
    });
    setAddress({ address: v.address ?? '', latitude: v.latitude ?? '', longitude: v.longitude ?? '', state: v.state ?? '', city: v.city ?? '', postalCode: v.postal_code ?? '' });
    setService({ levels: v.levels ?? '', modeOfTutoring: v.mode_of_tutoring ?? '', preferableLocation: v.preferable_location ?? '', teachingExperience: v.teaching_experience ?? '' });
    setEmergency({ name: v.emergency_contact_name ?? v.emergency_contact ?? '', relationship: v.relationship ?? '', number: v.emergency_contact_number ?? '' });
    setEducation({ highestEducation: v.highest_education ?? '', fieldOfStudy: v.field_of_study ?? '', academicYear: v.academic_year ?? '', institutionName: v.institution_name ?? '' });
  }, [verification, currentUser]);

  const buildPayload = () => ({
    full_name: personal.fullName,
    gender: personal.gender,
    email: personal.email,
    nric: personal.nric || undefined,
    dob: personal.dob || undefined,
    age: personal.age || undefined,
    phone: personal.phone || undefined,
    whatsapp_number: personal.whatsapp || undefined,
    marital_status: personal.maritalStatus || undefined,
    bank_name: personal.bankName || undefined,
    bank_account_number: personal.bankAccount || undefined,
    address: address.address || undefined,
    latitude: address.latitude || undefined,
    longitude: address.longitude || undefined,
    state: address.state || undefined,
    city: address.city || undefined,
    postal_code: address.postalCode || undefined,
    levels: service.levels || undefined,
    mode_of_tutoring: service.modeOfTutoring || undefined,
    preferable_location: service.preferableLocation || undefined,
    teaching_experience: service.teachingExperience || undefined,
    emergency_contact_name: emergency.name || undefined,
    relationship: emergency.relationship || undefined,
    emergency_contact_number: emergency.number || undefined,
    highest_education: education.highestEducation || undefined,
    field_of_study: education.fieldOfStudy || undefined,
    academic_year: education.academicYear || undefined,
    institution_name: education.institutionName || undefined,
  });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await submitVerification(buildPayload()).unwrap();
      showSuccess('Verification submitted successfully.');
    } catch (err) {
      const errors = err?.data?.errors || {};
      const firstMsg = Object.values(errors).flat()[0] || err?.data?.message || err?.message;
      showError(typeof firstMsg === 'string' ? firstMsg : 'Verification failed.');
    }
  };

  const updatePersonal = (key, value) => setPersonal((p) => ({ ...p, [key]: value }));
  const updateAddress = (key, value) => setAddress((a) => ({ ...a, [key]: value }));
  const updateService = (key, value) => setService((s) => ({ ...s, [key]: value }));
  const updateEmergency = (key, value) => setEmergency((e) => ({ ...e, [key]: value }));
  const updateEducation = (key, value) => setEducation((ed) => ({ ...ed, [key]: value }));

  const err = (key) => (apiErrors[key] ? (Array.isArray(apiErrors[key]) ? apiErrors[key][0] : apiErrors[key]) : null);

  if (verificationLoading && verification == null && !verificationError) {
    return (
      <div className="tvf-wrapper">
        <h1 className="tvf-title">Verification Form</h1>
        <p style={{ color: '#9A9A9A' }}>Loading verification...</p>
      </div>
    );
  }

  return (
    <div className="tvf-wrapper">
      <h1 className="tvf-title">Verification Form</h1>
      {noVerificationMessage && (
        <p className="tvf-message tvf-message-info" style={{ marginBottom: 16, padding: 12, background: '#EFF6FF', color: '#1E40AF', borderRadius: 8 }}>
          {noVerificationMessage}
        </p>
      )}
      {Object.keys(apiErrors).length > 0 && (
        <ul style={{ color: '#DC2626', marginBottom: 16, paddingLeft: 20 }}>
          {Object.entries(apiErrors).map(([key, msgs]) => (
            <li key={key}>{Array.isArray(msgs) ? msgs.join(', ') : msgs}</li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSave}>
        {/* 1. Tutor Personal Information */}
        <section className="tvf-section">
          <h2 className="tvf-section-title">Tutor Personal Information</h2>
          <div className="tvf-grid tvf-grid-3">
            <div className="tvf-field">
              <label className="tvf-label">Full Name *</label>
              <input type="text" className="tvf-input" value={personal.fullName} onChange={(e) => updatePersonal('fullName', e.target.value)} />
              {err('full_name') && <span style={{ color: '#DC2626', fontSize: 12 }}>{err('full_name')}</span>}
            </div>
            <div className="tvf-field tvf-field-select">
              <label className="tvf-label">Gender *</label>
              <select className="tvf-select" value={personal.gender} onChange={(e) => updatePersonal('gender', e.target.value)}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {err('gender') && <span style={{ color: '#DC2626', fontSize: 12 }}>{err('gender')}</span>}
            </div>
            <div className="tvf-field">
              <label className="tvf-label">Email Address *</label>
              <input type="email" className="tvf-input" value={personal.email} onChange={(e) => updatePersonal('email', e.target.value)} />
              {err('email') && <span style={{ color: '#DC2626', fontSize: 12 }}>{err('email')}</span>}
            </div>
            <div className="tvf-field">
              <label className="tvf-label">NRIC</label>
              <input type="text" className="tvf-input" value={personal.nric} onChange={(e) => updatePersonal('nric', e.target.value)} />
            </div>
            <div className="tvf-field">
              <label className="tvf-label">Date of Birth</label>
              <input type="date" className="tvf-input tvf-date" value={personal.dob} onChange={(e) => updatePersonal('dob', e.target.value)} placeholder="mm/dd/yyyy" />
            </div>
            <div className="tvf-field">
              <label className="tvf-label">Age</label>
              <input type="text" className="tvf-input" value={personal.age} onChange={(e) => updatePersonal('age', e.target.value)} />
            </div>
            <div className="tvf-field">
              <label className="tvf-label">Phone Number</label>
              <input type="text" className="tvf-input" value={personal.phone} onChange={(e) => updatePersonal('phone', e.target.value)} />
            </div>
            <div className="tvf-field">
              <label className="tvf-label">Whatsapp Number</label>
              <input type="text" className="tvf-input" value={personal.whatsapp} onChange={(e) => updatePersonal('whatsapp', e.target.value)} />
            </div>
            <div className="tvf-field tvf-field-select">
              <label className="tvf-label">Marital Status</label>
              <select className="tvf-select" value={personal.maritalStatus} onChange={(e) => updatePersonal('maritalStatus', e.target.value)}>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="tvf-field">
              <label className="tvf-label">Bank Name</label>
              <input type="text" className="tvf-input" value={personal.bankName} onChange={(e) => updatePersonal('bankName', e.target.value)} />
            </div>
            <div className="tvf-field">
              <label className="tvf-label">Bank Account Number</label>
              <input type="text" className="tvf-input" value={personal.bankAccount} onChange={(e) => updatePersonal('bankAccount', e.target.value)} />
            </div>
          </div>
        </section>

        {/* 2. Tutor Address */}
        <section className="tvf-section">
          <h2 className="tvf-section-title">Tutor Address</h2>
          <div className="tvf-grid tvf-grid-1">
            <div className="tvf-field">
              <label className="tvf-label">Address</label>
              <input type="text" className="tvf-input" value={address.address} onChange={(e) => updateAddress('address', e.target.value)} />
            </div>
          </div>
          <div className="tvf-grid tvf-grid-2" style={{ marginTop: '16px' }}>
            <div className="tvf-field">
              <label className="tvf-label">Latitude</label>
              <input type="text" className="tvf-input" value={address.latitude} onChange={(e) => updateAddress('latitude', e.target.value)} />
            </div>
            <div className="tvf-field">
              <label className="tvf-label">Longitude</label>
              <input type="text" className="tvf-input" placeholder="mm/dd/yyyy" value={address.longitude} onChange={(e) => updateAddress('longitude', e.target.value)} />
            </div>
          </div>
          <div className="tvf-grid tvf-grid-3" style={{ marginTop: '16px' }}>
            <div className="tvf-field">
              <label className="tvf-label">State</label>
              <input type="text" className="tvf-input" value={address.state} onChange={(e) => updateAddress('state', e.target.value)} />
            </div>
            <div className="tvf-field">
              <label className="tvf-label">City</label>
              <input type="text" className="tvf-input" value={address.city} onChange={(e) => updateAddress('city', e.target.value)} />
            </div>
            <div className="tvf-field">
              <label className="tvf-label">Postal Code</label>
              <input type="text" className="tvf-input" value={address.postalCode} onChange={(e) => updateAddress('postalCode', e.target.value)} />
            </div>
          </div>
        </section>

        {/* 3. Service Preference */}
        <section className="tvf-section">
          <h2 className="tvf-section-title">Service Preference</h2>
          <div className="tvf-grid tvf-grid-4">
            <div className="tvf-field">
              <label className="tvf-label">Levels</label>
              <input type="text" className="tvf-input" value={service.levels} onChange={(e) => updateService('levels', e.target.value)} />
            </div>
            <div className="tvf-field">
              <label className="tvf-label">Mode of Tutoring</label>
              <input type="text" className="tvf-input" value={service.modeOfTutoring} onChange={(e) => updateService('modeOfTutoring', e.target.value)} />
            </div>
            <div className="tvf-field">
              <label className="tvf-label">Preferable Location</label>
              <input type="text" className="tvf-input" value={service.preferableLocation} onChange={(e) => updateService('preferableLocation', e.target.value)} />
            </div>
            <div className="tvf-field">
              <label className="tvf-label">Teaching Experience</label>
              <input type="text" className="tvf-input" value={service.teachingExperience} onChange={(e) => updateService('teachingExperience', e.target.value)} />
            </div>
          </div>
        </section>

        {/* 4. Documents */}
        <section className="tvf-section">
          <h2 className="tvf-section-title">Documents</h2>
          <div className="tvf-doc-grid">
            <div className="tvf-doc-row">
              <div className="tvf-doc-item">
                <span className="tvf-doc-label">Resume</span>
                <label className="tvf-choose-file">
                  <input type="file" className="tvf-file-input" accept=".pdf,.doc,.docx" />
                  Choose file
                </label>
              </div>
              <div className="tvf-doc-item">
                <span className="tvf-doc-label">Educational Transcript</span>
                <label className="tvf-choose-file">
                  <input type="file" className="tvf-file-input" accept=".pdf,.doc,.docx,.jpg,.png" />
                  Choose file
                </label>
              </div>
            </div>
            <div className="tvf-doc-row">
              <div className="tvf-doc-item">
                <span className="tvf-doc-label">Formal Photo</span>
                <label className="tvf-choose-file">
                  <input type="file" className="tvf-file-input" accept=".jpg,.jpeg,.png" />
                  Choose file
                </label>
              </div>
              <div className="tvf-doc-item">
                <span className="tvf-doc-label">Identity Card Front</span>
                <label className="tvf-choose-file">
                  <input type="file" className="tvf-file-input" accept=".jpg,.jpeg,.png,.pdf" />
                  Choose file
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Emergency Contact */}
        <section className="tvf-section">
          <h2 className="tvf-section-title">Emergency Contact</h2>
          <div className="tvf-grid tvf-grid-3">
            <div className="tvf-field">
              <label className="tvf-label">Emergency Contact Name</label>
              <input type="text" className="tvf-input" value={emergency.name} onChange={(e) => updateEmergency('name', e.target.value)} />
            </div>
            <div className="tvf-field tvf-field-select">
              <label className="tvf-label">Relationship</label>
              <select className="tvf-select" value={emergency.relationship} onChange={(e) => updateEmergency('relationship', e.target.value)}>
                <option value="Husband">Husband</option>
                <option value="Wife">Wife</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Sibling">Sibling</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="tvf-field">
              <label className="tvf-label">Emergency Contact Number</label>
              <input type="text" className="tvf-input" value={emergency.number} onChange={(e) => updateEmergency('number', e.target.value)} />
            </div>
          </div>
        </section>

        {/* 6. Education */}
        <section className="tvf-section">
          <h2 className="tvf-section-title">Education</h2>
          <div className="tvf-grid tvf-grid-4">
            <div className="tvf-field tvf-field-select">
              <label className="tvf-label">Highest Education</label>
              <select className="tvf-select" value={education.highestEducation} onChange={(e) => updateEducation('highestEducation', e.target.value)}>
                <option value="Matric">Matric</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Bachelor">Bachelor</option>
                <option value="Master">Master</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
            <div className="tvf-field">
              <label className="tvf-label">Field Of Study</label>
              <input type="text" className="tvf-input" value={education.fieldOfStudy} onChange={(e) => updateEducation('fieldOfStudy', e.target.value)} />
            </div>
            <div className="tvf-field">
              <label className="tvf-label">Academic Year</label>
              <input type="text" className="tvf-input" value={education.academicYear} onChange={(e) => updateEducation('academicYear', e.target.value)} />
            </div>
            <div className="tvf-field">
              <label className="tvf-label">Institution Name</label>
              <input type="text" className="tvf-input" value={education.institutionName} onChange={(e) => updateEducation('institutionName', e.target.value)} />
            </div>
          </div>
        </section>

        <button type="submit" className="tvf-save-btn" disabled={submitLoading}>{submitLoading ? 'Saving...' : 'Save Changes'}</button>
      </form>
    </div>
  );
}

export default TutorVerificationForm;