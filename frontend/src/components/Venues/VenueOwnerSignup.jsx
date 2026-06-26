

import axios from "axios"
import { useMemo, useState } from "react"
import { BASE_URL } from "../../utils/constants"


const Icon = {
  user: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  ),
  building: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M9 7h.01M15 7h.01M9 11h.01M15 11h.01M9 15h.01M15 15h.01" />
    </svg>
  ),
  mail: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" />
    </svg>
  ),
  phone: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  ),
  tag: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 2 2 12l10 10 10-10z" /><circle cx="8.5" cy="8.5" r="1.5" />
    </svg>
  ),
  pin: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  globe: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20Z" />
    </svg>
  ),
  card: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20M6 15h4" />
    </svg>
  ),
  check: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
    </svg>
  ),
  doc: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h6" />
    </svg>
  ),
  sparkle: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z" />
    </svg>
  ),
  music: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
    </svg>
  ),
  heart: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  ),
  cake: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 21h16M4 21v-7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7M4 15s1.5 1 4 1 4-1 4-1 1.5 1 4 1 4-1 4-1M12 8V5M9 5h.01M15 5h.01" />
    </svg>
  ),
  gift: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="8" width="18" height="4" rx="1" /><path d="M5 12v9h14v-9M12 8v13M12 8S10 3 7.5 5 12 8 12 8ZM12 8s2-5 4.5-3S12 8 12 8Z" />
    </svg>
  ),
  utensils: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 2v7a3 3 0 0 0 6 0V2M6 2v20M16 2a4 4 0 0 0-4 4v6h4v10" />
    </svg>
  ),
  popper: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M2 22l4-12 8 8-12 4ZM14 10l2-2M16 4l1 1M20 8l1-1M19 13h2M12 3h.01" />
    </svg>
  ),
  tent: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 4 3 20h18zM12 4v16" />
    </svg>
  ),
}

/* Faint background decorations spread behind the card */
const DECOR = [
  { C: Icon.utensils, top: "18%", left: "10%", size: 34, rotate: -12 },
  { C: Icon.popper, top: "26%", left: "20%", size: 30, rotate: 8 },
  { C: Icon.music, top: "52%", left: "5%", size: 38, rotate: -6 },
  { C: Icon.pin, top: "57%", left: "13%", size: 28, rotate: 0 },
  { C: Icon.heart, top: "82%", left: "6%", size: 30, rotate: 10 },
  { C: Icon.gift, top: "90%", left: "18%", size: 32, rotate: -8 },
  { C: Icon.sparkle, top: "78%", left: "24%", size: 22, rotate: 0 },
  { C: Icon.pin, top: "6%", right: "12%", size: 30, rotate: 6 },
  { C: Icon.heart, top: "34%", right: "9%", size: 28, rotate: -10 },
  { C: Icon.tent, top: "62%", right: "22%", size: 34, rotate: 4 },
  { C: Icon.cake, top: "68%", right: "14%", size: 32, rotate: -6 },
  { C: Icon.building, top: "90%", right: "20%", size: 32, rotate: 8 },
  { C: Icon.popper, top: "88%", right: "8%", size: 30, rotate: -12 },
  { C: Icon.sparkle, top: "48%", right: "6%", size: 22, rotate: 0 },
]

const STATUSES = [
  { value: "active", label: "Active — open for bookings" },
  { value: "coming-soon", label: "Coming soon" },
  { value: "renovation", label: "Under renovation" },
  { value: "inactive", label: "Inactive (paused)" },
]

const VENUE_TYPES = [
  "Banquet hall",
  "Rooftop venue",
  "Lawn / garden",
  "Conference hall",
  "Resort",
  "Restaurant / cafe",
  "Auditorium",
  "Farmhouse",
]

/* Labelled field wrapper with a red icon */
function Field({ icon: I, label, optional, error, children }) {
  return (
    <label className="form-control w-full">
      <span className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-base-content">
        <I className="h-4 w-4 text-brand-secondary" />
        {label}
        {optional ? <span className="font-normal text-base-content/45">(optional)</span> : null}
      </span>
      {children}
      {error ? (
        <span className="mt-1.5 flex items-center gap-1 text-xs font-medium text-error">
          <Icon.check className="h-3.5 w-3.5" />
          {error}
        </span>
      ) : null}
    </label>
  )
}

const inputCls =
  "input input-bordered h-12 w-full rounded-xl border-base-300 bg-base-100 text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"

  function VenueOwnerSignup() {
  const [form, setForm] = useState({
    owner: "",
    organization: "",
    email: "",
    phone: "",
    venueType: "",
    city: "",
    address: "",
    website: "",
    gst: "",
    status: "active",
    description: "",
    agree: false,
  })
  const [submitted, setSubmitted] = useState(false)
  const [done, setDone] = useState(false)

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }))

  const errors = useMemo(() => {
    const e = {}
    if (!form.organization.trim()) e.organization = "Organization name is required"
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid business email"
    if (form.phone.replace(/\D/g, "").length < 8) e.phone = "Enter a valid business phone"
    if (!form.gst.trim()) e.gst = "GST / Business ID is required"
    if (!form.status) e.status = "Select a status"
    if (form.description.trim().length < 20) e.description = "Description should be at least 20 characters"
    if (!form.agree) e.agree = "Please accept the Partner Terms to continue"
    return e
  }, [form])

  const showError = (key) => (submitted ? errors[key] : undefined)

  const handleSubmit = async (e) => {
    e.preventDefault()
 
        setSubmitted(true)


    try{ 
    const res = await axios.post( BASE_URL+'/api/venues/venueOwner/signup',
        {
            organizationName : form.organization,
            businessEmail    : form.email,
            businessPhone    : form.phone ,
            description      : form.description
         
        } , { withCredentials:true }
    )

      if(res.data.success){
        // redirect ot the venueOwner
          if (Object.keys(errors).length === 0) {
      setDone(true)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
   
      }

    } catch(error){
        console.log(error);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-primary px-4 py-10 sm:py-16">
      {/* Faint venue-themed background decorations */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
        {DECOR.map(({ C, size, rotate, ...pos }, i) => (
          <div
            key={i}
            className="absolute text-brand-secondary/15"
            style={{ ...pos, transform: `rotate(${rotate}deg)` }}
          >
            <C style={{ width: size, height: size }} />
          </div>
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-3xl">
        <div className="rounded-3xl bg-base-100 p-6 shadow-xl shadow-brand-accent/20 ring-1 ring-base-300/60 sm:p-10">
          {done ? (
            <div className="flex flex-col items-center py-10 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
                <Icon.check className="h-9 w-9" />
              </span>
              <h2 className="mt-5 text-2xl font-bold text-base-content">Venue submitted for review</h2>
              <p className="mt-2 max-w-sm text-sm text-base-content/60">
                Thanks for partnering with BookMyVenue. Our team will verify your details and get back to you within
                24-48 hours.
              </p>
              <button
                type="button"
                onClick={() => {
                  setDone(false)
                  setSubmitted(false)
                }}
                className="btn btn-primary mt-6 rounded-xl"
              >
                Register another venue
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {/* Header */}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-secondary">
                <Icon.popper className="h-3.5 w-3.5" />
                Become a partner
              </span>
              <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight text-base-content sm:text-5xl">
                Register as a <span className="italic text-brand-secondary">Venue Owner</span>
              </h1>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-base-content/60">
                List your space on BookMyVenue and reach thousands of customers planning their next celebration.
              </p>

              {/* Fields */}
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field icon={Icon.user} label="Owner / Contact name">
                  <input className={inputCls} placeholder="e.g. Aarav Sharma" value={form.owner} onChange={set("owner")} />
                </Field>
                <Field icon={Icon.building} label="Organization name" error={showError("organization")}>
                  <input
                    className={inputCls}
                    placeholder="e.g. Grand Palace Banquets Pvt Ltd"
                    value={form.organization}
                    onChange={set("organization")}
                  />
                </Field>
                <Field icon={Icon.mail} label="Business email" error={showError("email")}>
                  <input
                    type="email"
                    className={inputCls}
                    placeholder="bookings@yourvenue.com"
                    value={form.email}
                    onChange={set("email")}
                  />
                </Field>
                <Field icon={Icon.phone} label="Business phone" error={showError("phone")}>
                  <input
                    className={inputCls}
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={set("phone")}
                  />
                </Field>
                <Field icon={Icon.tag} label="Venue type">
                  <select
                    className={`select select-bordered h-12 w-full rounded-xl border-base-300 bg-base-100 font-normal text-base-content focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      form.venueType ? "" : "text-base-content/40"
                    }`}
                    value={form.venueType}
                    onChange={set("venueType")}
                  >
                    <option value="" disabled>
                      Select venue type
                    </option>
                    {VENUE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field icon={Icon.pin} label="City">
                  <input className={inputCls} placeholder="e.g. Mumbai" value={form.city} onChange={set("city")} />
                </Field>
                <div className="sm:col-span-2">
                  <Field icon={Icon.pin} label="Full address">
                    <input
                      className={inputCls}
                      placeholder="Street, area, landmark, PIN"
                      value={form.address}
                      onChange={set("address")}
                    />
                  </Field>
                </div>
                <Field icon={Icon.globe} label="Website" optional>
                  <input
                    className={inputCls}
                    placeholder="https://yourvenue.com"
                    value={form.website}
                    onChange={set("website")}
                  />
                </Field>
                <Field icon={Icon.card} label="GST / Business ID" error={showError("gst")}>
                  <input
                    className={inputCls}
                    placeholder="22AAAAA0000A1Z5"
                    value={form.gst}
                    onChange={set("gst")}
                  />
                </Field>
              </div>

              {/* Status pills */}
              <div className="mt-6">
                <span className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-base-content">
                  <Icon.check className="h-4 w-4 text-brand-secondary" />
                  Status
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {STATUSES.map((s) => {
                    const selected = form.status === s.value
                    return (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, status: s.value }))}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                          selected
                            ? "border-brand-primary bg-brand-secondary text-brand-primary-content shadow-lg"
                            : "border-base-300 bg-base-100 text-base-content/70 hover:border-primary/40 hover:text-brand-secondary"
                        }`}
                      >
                        {s.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-base-content">
                    <Icon.doc className="h-4 w-4 text-brand-secondary" />
                    Description
                  </span>
                  <span className="text-xs text-base-content/45">{form.description.length}/600</span>
                </div>
                <textarea
                  maxLength={600}
                  rows={4}
                  value={form.description}
                  onChange={set("description")}
                  placeholder="Tell customers what makes your venue special — capacity, ambience, amenities, parking, in-house catering, etc."
                  className={`textarea textarea-bordered w-full rounded-xl border-base-300 bg-base-100 text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    showError("description") ? "border-error focus:border-error focus:ring-error/20" : ""
                  }`}
                />
                {showError("description") ? (
                  <span className="mt-1.5 flex items-center gap-1 text-xs font-medium text-error">
                    <Icon.check className="h-3.5 w-3.5" />
                    {errors.description}
                  </span>
                ) : null}
              </div>

              {/* Terms */}
              <div className="mt-6">
                <label className="flex cursor-pointer items-start gap-3 text-sm text-base-content/80">
                  <input
                    type="checkbox"
                    checked={form.agree}
                    onChange={set("agree")}
                    className="checkbox checkbox-sm mt-0.5 border-base-300 [--chkfg:white] checked:border-primary checked:bg-brand-secondary"
                  />
                  <span>
                    I confirm the details are accurate and I agree to BookMyVenue's{" "}
                    <a className="font-semibold text-brand-secondary hover:underline" href="#terms">
                      Partner Terms
                    </a>{" "}
                    &{" "}
                    <a className="font-semibold text-brand-secondary hover:underline" href="#privacy">
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>
                {showError("agree") ? (
                  <span className="mt-1.5 flex items-center gap-1 text-xs font-medium text-error">
                    <Icon.check className="h-3.5 w-3.5" />
                    {errors.agree}
                  </span>
                ) : null}
              </div>

              {/* Submit */}
              <button
                type="submit"

                className="btn bg-brand-secondary mt-7 h-14 w-full rounded-2xl text-base font-bold shadow-lg shadow-brand-accent/20 transition-transform hover:-translate-y-0.5"
              >
                Register my venue
                <Icon.sparkle className="ml-1 h-5 w-5" />
              </button>

              <p className="mt-5 text-center text-sm text-base-content/60">
                Already a partner?{" "}
                <a className="font-bold text-brand-secondary hover:underline" href="#signin">
                  Sign in
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default VenueOwnerSignup;