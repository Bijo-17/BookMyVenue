
import axios from "axios"
import { useCallback, useMemo, useRef, useState } from "react"
import Cropper from "react-easy-crop"
import { BASE_URL } from "../../utils/constants"
import { buildVenueFormData } from "../../utils/buildVenueFormData"
import { Link } from "react-router"


const Icon = {
  building: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M9 7h.01M15 7h.01M9 11h.01M15 11h.01M9 15h.01M15 15h.01" />
    </svg>
  ),
  tag: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 2 2 12l10 10 10-10z" /><circle cx="8.5" cy="8.5" r="1.5" />
    </svg>
  ),
  users: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  doc: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h6" />
    </svg>
  ),
  pin: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  phone: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  ),
  hash: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" />
    </svg>
  ),
  globe: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20Z" />
    </svg>
  ),
  navigation: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m3 11 19-9-9 19-2-8z" />
    </svg>
  ),
  rupee: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M6 3h12M6 8h12M16 3c0 5-4 7-9 7l7 11" />
    </svg>
  ),
  clock: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
    </svg>
  ),
  layers: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m12 2 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 17l9 5 9-5" />
    </svg>
  ),
  sparkle: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z" />
    </svg>
  ),
  image: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.5-3.5L8 21" />
    </svg>
  ),
  camera: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z" /><circle cx="12" cy="13" r="3" />
    </svg>
  ),
  upload: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
    </svg>
  ),
  message: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
    </svg>
  ),
  check: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
    </svg>
  ),
  alert: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
    </svg>
  ),
  x: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
  heart: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  ),
  music: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
    </svg>
  ),
  cake: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 21h16M4 21v-7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7M4 15s1.5 1 4 1 4-1 4-1 1.5 1 4 1 4-1 4-1M12 8V5M9 5h.01M15 5h.01" />
    </svg>
  ),
  sparkles: (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles-icon lucide-sparkles">
    <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/>
    <path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/>
  </svg>
  )
}

/* Faint venue-themed background decorations */
const DECOR = [
  { C: Icon.building, top: "12%", left: "2%", size: 40, rotate: -10 },
  { C: Icon.layers, top: "24%", left: "8%", size: 36, rotate: 6 },
  { C: Icon.music, top: "46%", left: "3%", size: 34, rotate: -8 },
  { C: Icon.camera, top: "74%", left: "6%", size: 38, rotate: 10 },
  { C: Icon.heart, top: "88%", left: "2%", size: 30, rotate: -6 },
  { C: Icon.sparkle, top: "16%", right: "5%", size: 26, rotate: 0 },
  { C: Icon.pin, top: "38%", right: "3%", size: 32, rotate: 8 },
  { C: Icon.users, top: "58%", right: "6%", size: 34, rotate: -4 },
  { C: Icon.cake, top: "80%", right: "4%", size: 32, rotate: 8 },
]

/* Option data — mirrors the venue model enums */
const VENUE_TYPES = [
  "Banquet hall",
  "Rooftop venue",
  "Lawn / garden",
  "Conference hall",
  "Resort",
  "Restaurant / cafe",
  "Auditorium",
  "Farmhouse",
  "Convention center",
]
const FACILITIES = ["Parking", "WiFi", "AC", "Projector", "Stage", "Sound System", "Catering", "Power Backup"]
const IDEAL_FOR = ["Reception", "Wedding", "Birthday", "Meeting", "Conference", "Party", "Corporate Event"]
const MAX_PHOTOS = 10
const MAX_SIZE = 5 * 1024 * 1024

const inputBase =
  "input input-bordered h-12 w-full rounded-xl border-brand-accent/20 bg-white text-brand-accent placeholder:text-brand-accent/40 focus:outline-none focus:ring-1"
const inputOk = "focus:border-brand-secondary focus:ring-brand-secondary/10"
const inputErr = "border-error focus:border-error focus:ring-error/20"

/* Label with red icon, required asterisk, optional char counter */
function Label({ icon: I, children, required, counter }) {
  return (
    <div className="mb-1.5 flex items-center justify-between">
      <span className="flex items-center gap-1.5 text-sm font-semibold text-brand-accent">
        <I className="h-4 w-4 text-brand-secondary" />
        {children}
        {required ? <span className="text-brand-accent">*</span> : null}
      </span>
      {counter ? <span className="text-xs text-brand-accent/45">{counter}</span> : null}
    </div>
  )
}

function ErrorText({ children }) {
  if (!children) return null
  return (
    <span className="mt-1.5 flex items-center gap-1 text-xs font-medium text-brand-secondary">
      <Icon.alert className="h-3.5 w-3.5" />
      {children}
    </span>
  )
}

function SectionHead({ icon: I, title, subtitle }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-secondary/10 text-brand-secondary">
        <I className="h-5 w-5" />
      </span>
      <div>
        <h2 className="text-lg font-bold text-brand-accent">{title}</h2>
        <p className="text-xs text-brand-accent/60">{subtitle}</p>
      </div>
    </div>
  )
}

/* Multi-select pill chips */
function ChipGroup({ options, selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((opt) => {
        const on = selected.includes(opt)
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(opt)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
              on
                ? "border-brand-accent/30 bg-brand-secondary text-white shadow-lg"
                : "border-brand-accent/20 bg-white text-brand-accent/90 hover:border-brand-secondary/40 hover:text-brand-secondary"
            }`}
          >
            {on ? <span className="mr-1">✓</span> : null}
            {opt}
          </button>
        )
      })}
    </div>
  )
}

/* Build a cropped JPEG blob/dataURL from the crop area */
async function getCroppedImg(src, cropPixels) {
  const image = await new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
  const canvas = document.createElement("canvas")
  canvas.width = 1600;
  canvas.height = 1200;
  const ctx = canvas.getContext("2d")
  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    canvas.width,
    canvas.height,
  )
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => { 
        resolve({ 
                   url: URL.createObjectURL(blob), 
                   blob,
                   file: new File(
                      [blob],
                      `venue-${Date.now()}.jpg`,
                      {
                        type: "image/jpeg"
                      }
                   ),
                  });
                },
                  "image/jpeg",
                    0.9,
    
              )
            })
         }

const AddVenue = ()=> {

  const [form, setForm] = useState({
    name: "",
    type: "",
    capacity: "",
    description: "",
    address: "",
    phone: "",
    pincode: "",
    city: "",
    state: "Kerala",
    country: "India",
    latitude: "",
    longitude: "",
    pricePerHour: "",
    pricePerDay: "",
    facilities: [],
    idealFor: [],
    message: "",
  })
  
  const [photos, setPhotos] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [done, setDone] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [photoError, setPhotoError] = useState("")
  const fileRef = useRef(null)

  /* Crop modal state */
  const [cropState, setCropState] = useState(null) // { queue: [dataUrls], src }
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [cropPixels, setCropPixels] = useState(null)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const toggleArr = (key, val) =>
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter((x) => x !== val) : [...f[key], val],
    }))

  const errors = useMemo(() => {
    const e = {}
    if (!form.name.trim()) e.name = "Venue name is required"
    if (!form.type) e.type = "Select a venue type"
    if (!String(form.capacity).trim()) e.capacity = "Capacity is required"
    else if (Number(form.capacity) < 5) e.capacity = "Min capacity required is 5"
    if (form.phone.replace(/\D/g, "").length !== 10) e.phone = "Enter a valid 10-digit number"
    if (!form.city.trim()) e.city = "City is required"
    if (!form.state.trim()) e.state = "State is required"
    if (!form.country.trim()) e.country = "Country is required"
    if (!form.pincode && !/^\d{6}$/.test(form.pincode)) e.pincode = "Pincode must be 6 digits"
    if(!String(form.pricePerDay).trim()) e.price = "Enter Price per day"
    if (!String(form.pricePerHour).trim() && !String(form.pricePerDay).trim())
      e.price = "Enter atleast one price"
    if(!form.facilities.length) e.facilities = "Select atleast one!"
    if(!form.idealFor.length) e.idealFor = "Select atleast one!"
    if(!form.address.trim()) e.address = "Enter you address"
    if(!form.description.trim()) e.description = "Enter description"
    return e
  }, [form])

  const err = (k) => (submitted ? errors[k] : undefined)

  /* ---- Photo handling ---- */
  const queueFiles = (fileList) => {
    setPhotoError("")
    const files = Array.from(fileList)
    const room = MAX_PHOTOS - photos.length
    if (room <= 0) {
      setPhotoError(`You can upload a maximum of ${MAX_PHOTOS} photos.`)
      return
    }
    const valid = []
    for (const file of files.slice(0, room)) {
      if (!/^image\/(jpeg|png)$/.test(file.type)) {
        setPhotoError("Only JPG or PNG images are allowed.")
        continue
      }
      if (file.size > MAX_SIZE) {
        setPhotoError("Each photo must be 5MB or smaller.")
        continue
      }
      valid.push(file)
    }

    if (!valid.length) return

    Promise.all(
      valid.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader()
            reader.onload = () =>{ resolve({
                                              src: reader.result,
                                              file
                                          }) }

             reader.readAsDataURL(file);
             }),
      ),
    ).then((dataUrls) => {
      const [first, ...rest] = dataUrls
      setCropState({ queue: rest, current: first })
      setCrop({ x: 0, y: 0 })
      setZoom(1)
    })
  }

  const onCropComplete = useCallback((_, areaPixels) => setCropPixels(areaPixels), [])

  const confirmCrop = async () => {
    if (!cropState || !cropPixels) return
    const cropped = await getCroppedImg(cropState.current.src, cropPixels)
    setPhotos((p) => [...p, { id: crypto.randomUUID(), url: cropped.url, file:cropped.file }])
    const [next, ...rest] = cropState.queue
    if (next) {
      setCropState({ queue: rest, src: next })
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setCropPixels(null)
    } else {
      setCropState(null)
      setCropPixels(null)
    }
  }

  const skipCrop = () => {
    const [next, ...rest] = cropState.queue
    if (next) {
      setCropState({ queue: rest, src: next })
      setCrop({ x: 0, y: 0 })
      setZoom(1)
    } else {
      setCropState(null)
    }
    // URL.revokeObjectURL(photo.url);
  }

  const removePhoto = (id) => setPhotos((p) => p.filter((x) => x.id !== id))

  const handleSubmit = async (e) => {

    e.preventDefault()
    setSubmitted(true)

    try {

    
      if (Object.keys(errors).length === 0) {
        
        
        if(photos.length < 1){
          setPhotoError("Upload atleast one image");
          return;
        }

        const formData = buildVenueFormData(form,photos);     


        const res = await axios.post(BASE_URL+'/api/venues/venue/addVenue',

             formData
      ,
        { withCredentials:true }
      )
      
          if(res.status === 201){      
      
        setDone(true)
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        const first = document.querySelector("[data-invalid='true']")
        first?.scrollIntoView({ behavior: "smooth", block: "center" })
      }

    }

    } catch (error) {
      if(error.response){
        
        console.log(error.response.data)
      } else {
         console.log("something went wrong")
      }

      
    }

  }

  const thumbSlots = Math.max(0, 4 - (photos.length % 4 === 0 && photos.length > 0 ? 0 : 4 - (photos.length % 4)))

  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-primary px-4 py-10 sm:py-16">
      {/* Background decorations */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
        {DECOR.map(({ C, size, rotate, ...pos }, i) => (
          <div key={i} className="absolute text-brand-accent/10" style={{ ...pos, transform: `rotate(${rotate}deg)` }}>
            <C style={{ width: size, height: size }} />
          </div>
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-3xl">
        <div className="rounded-3xl bg-white p-6 shadow-xl shadow-primary/5 ring-1 ring-brand-accent/10 mt-10 sm:p-10">
          {done ? ( 
            <div className="flex flex-col items-center py-12 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
                <Icon.check className="h-9 w-9" />
              </span>
              <h2 className="mt-5 text-2xl font-bold text-brand-accent">Venue submitted for review</h2>
              <p className="mt-2 max-w-sm text-sm text-brand-accent">
                Thanks for listing <span className="font-semibold text-brand-accent text-xl">{form.name}</span>. Our team will
                verify the details and notify you within 24-48 hours.
              </p>
              <div className="flex mt-6 gap-3" > 
              <button
                type="button"
                onClick={() => {
                  setDone(false)
                  setSubmitted(false)
                }}
                className="btn bg-brand-secondary rounded-xl"
              >
                List another venue
              </button>
                <Link to='/venue-owner-dashboard' className="btn bg-brand-accent">Go to Dashboard</Link>
                </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {/* Header */}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-secondary/10 px-3 py-2 text-xs font-bold tracking-wider text-brand-secondary">
                <Icon.sparkles className="h-3.5 w-3.5" />
                VENUE OWNER CONSOLE
              </span>
              <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight text-brand-accent sm:text-4xl">
                List your <span className="italic bg-[linear-gradient(135deg,#990302_0%,#d4423f_60%,#2D3436_100%)] bg-clip-text text-transparent">venue</span>
              </h1>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-brand-accent/60">
                Share the details that help guests fall in love with your space — accurate info and great photos lead to
                faster approvals and more bookings.
              </p>

              {/* ---- Basic information ---- */}
              <div className="mt-9">
                <SectionHead icon={Icon.building} title="Basic information" subtitle="The essentials guests see first." />

                <div data-invalid={!!err("name")}>
                  <Label icon={Icon.building} required counter={`${form.name.length}/100`}>
                    Venue name
                  </Label>
                  <input
                    maxLength={100}
                    className={`${inputBase} ${err("name") ? inputErr : inputOk}`}
                    placeholder="e.g. The Royal Pavilion Banquet"
                    value={form.name}
                    onChange={set("name")}
                  />
                  <ErrorText>{err("name")}</ErrorText>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div data-invalid={!!err("type")}>
                    <Label icon={Icon.tag} required>
                      Venue type
                    </Label>
                    <select
                      className={`select select-bordered h-12 w-full  rounded-xl border-brand-accent/10 bg-white focus:outline-none focus:ring-1 ${
                        err("type") ? inputErr : inputOk
                      } ${form.type ? "text-brand-accent" : "text-brand-accent/50"}`}
                      value={form.type}
                      onChange={set("type")}
                    >
                      <option value="" disabled>
                        Select a category...
                      </option>
                      {VENUE_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <ErrorText>{err("type")}</ErrorText>
                  </div>

                  <div data-invalid={!!err("capacity")}>
                    <Label icon={Icon.users} required>
                      Capacity (guests)
                    </Label>
                    <input
                      inputMode="numeric"
                      className={`${inputBase} ${err("capacity") ? inputErr : inputOk}`}
                      placeholder="e.g. 250"
                      value={form.capacity}
                      onChange={(e)=> setForm((f) => ({ ...f, capacity: e.target.value.replace(/\D/g, "").slice(0,8)}))}
                    />
                    <ErrorText>{err("capacity")}</ErrorText>
                  </div>
                </div>

                <div className="mt-4">
                  <Label icon={Icon.doc} counter={`${form.description.length}/200`} required>
                    Description
                  </Label>
                  <textarea
                    rows={3}
                    maxLength={200}
                    className="textarea textarea-bordered w-full rounded-xl border-brand-accent/10 bg-white text-brand-accent placeholder:text-brand-accent/40  focus:outline-none focus:ring-1 focus:ring-brand-accent/60"
                    placeholder="A short, inviting description of your venue..."
                    value={form.description}
                    onChange={set("description")}
                  />
                </div>
                 <ErrorText>{err("description")}</ErrorText>
              </div>

              <div className="my-8 border-t border-dashed border-base-300" />

              {/* ---- Location & contact ---- */}
              <div>
                <SectionHead icon={Icon.pin} title="Location & contact" subtitle="Where it is and how guests can reach you." />

                <div>
                  <Label icon={Icon.navigation} counter={`${form.address.length}/100`} required>
                    Street address
                  </Label>
                  <input
                    maxLength={100}
                    className={`${inputBase} ${inputOk}`}
                    placeholder="House / building, street, landmark"
                    value={form.address}
                    onChange={set("address")}
                  />
                   <ErrorText>{err("address")}</ErrorText>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div data-invalid={!!err("phone")}>
                    <Label icon={Icon.phone} required>
                      Venue phone
                    </Label>
                    <input
                      inputMode="numeric"
                      className={`${inputBase} ${err("phone") ? inputErr : inputOk}`}
                      placeholder="10-digit number"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
                    />
                    <ErrorText>{err("phone")}</ErrorText>
                  </div>
                  <div data-invalid={!!err("pincode")}>
                    <Label icon={Icon.hash}>Pincode</Label>
                    <input
                      inputMode="numeric"
                      className={`${inputBase} ${err("pincode") ? inputErr : inputOk}`}
                      placeholder="e.g. 560001"
                      value={form.pincode}
                      onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) }))}
                    />
                    <ErrorText>{err("pincode")}</ErrorText>
                  </div>
                  <div data-invalid={!!err("city")}>
                    <Label icon={Icon.pin} required>
                      City
                    </Label>
                    <input
                      className={`${inputBase} ${err("city") ? inputErr : inputOk}`}
                      placeholder="e.g. Bengaluru"
                      value={form.city}
                      onChange={set("city")}
                    />
                    <ErrorText>{err("city")}</ErrorText>
                  </div>
                  <div data-invalid={!!err("state")}>
                    <Label icon={Icon.pin} required>
                      State
                    </Label>
                    <input
                      className={`${inputBase} ${err("state") ? inputErr : inputOk}`}
                      placeholder="e.g. Karnataka"
                      value={form.state}
                      onChange={set("state")}
                    />
                    <ErrorText>{err("state")}</ErrorText>
                  </div>
                  <div data-invalid={!!err("country")}>
                    <Label icon={Icon.globe} required>
                      Country
                    </Label>
                    <input
                      className={`${inputBase} ${err("country") ? inputErr : inputOk}`}
                      value={form.country}
                      onChange={set("country")}
                    />
                    <ErrorText>{err("country")}</ErrorText>
                  </div>
                  <div>
                    <Label icon={Icon.navigation}>Latitude</Label>
                    <input
                      className={`${inputBase} ${inputOk}`}
                      placeholder="e.g. 12.9716"
                      value={form.latitude}
                      onChange={set("latitude")}
                    />
                  </div>
                  <div>
                    <Label icon={Icon.navigation}>Longitude</Label>
                    <input
                      className={`${inputBase} ${inputOk}`}
                      placeholder="e.g. 77.5946"
                      value={form.longitude}
                      onChange={set("longitude")}
                    />
                  </div>
                </div>
              </div>

              <div className="my-8 border-t border-dashed border-base-300" />

              {/* ---- Pricing ---- */}
              <div data-invalid={!!err("price")}>
                <SectionHead icon={Icon.rupee} title="Pricing" subtitle="Provide at least one rate — you can adjust later." />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label icon={Icon.clock} required>
                      Price per hour
                    </Label>
                    <label className={`flex items-center gap-2 ${inputBase} ${err("price") ? inputErr : inputOk}`}>
                      <span className="text-base-content/50">₹</span>
                      <input
                        inputMode="numeric"
                        className="w-full bg-transparent focus:outline-none"
                        placeholder="e.g. 2500"
                        value={form.pricePerHour}
                        onChange={(e) => setForm((f) => ({ ...f, pricePerHour: e.target.value.replace(/\D/g, "") }))}
                      />
                    </label>
                  </div>
                  <div>
                    <Label icon={Icon.rupee}>Price per day</Label>
                    <label className={`flex items-center gap-2 ${inputBase} ${inputOk}`}>
                      <span className="text-base-content/50">₹</span>
                      <input
                        inputMode="numeric"
                        className="w-full bg-transparent focus:outline-none"
                        placeholder="e.g. 35000"
                        value={form.pricePerDay}
                        onChange={(e) => setForm((f) => ({ ...f, pricePerDay: e.target.value.replace(/\D/g, "") }))}
                      />
                    </label>
                  </div>
                </div>
                <ErrorText>{err("price")}</ErrorText>
              </div>

              <div className="my-8 border-t border-dashed border-base-300" />

              {/* ---- Facilities ---- */}
              <div>
                <SectionHead icon={Icon.layers} title="Facilities" subtitle="Pick everything your venue provides on-site." />
                <ChipGroup options={FACILITIES} selected={form.facilities} onToggle={(v) => toggleArr("facilities", v)} />
                   <ErrorText>{err("facilities")}</ErrorText>
              </div>

              <div className="my-8 border-t border-dashed border-base-300" />

              {/* ---- Ideal for ---- */}
              <div>
                <SectionHead icon={Icon.sparkle} title="Ideal for" subtitle="Help guests discover your space for the right occasion." />
                <ChipGroup options={IDEAL_FOR} selected={form.idealFor} onToggle={(v) => toggleArr("idealFor", v)} />
                  <ErrorText>{err("idealFor")}</ErrorText>
              </div>

              <div className="my-8 border-t border-dashed border-base-300" />

              {/* ---- Venue photos ---- */}
              <div>
                <SectionHead
                  icon={Icon.image}
                  title="Venue photos"
                  subtitle={`Upload up to ${MAX_PHOTOS} high-quality photos. JPG or PNG, max 5MB each.`}
                />

                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDragOver(true)
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setDragOver(false)
                    queueFiles(e.dataTransfer.files)
                  }}
                  className={`flex flex-col items-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
                    dragOver ? "border-brand-secondary bg-brand-secondary/20" : "border-base-300 "
                  }`}
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-secondary/10 text-brand-secondary">
                    <Icon.upload className="h-7 w-7" />
                  </span>
                  <p className="mt-3 font-bold text-brand-accent">Drag &amp; drop photos here</p>
                  <p className="text-sm text-brand-accent/55">or click to browse from your device</p>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="btn btn-outline text-brand-secondary mt-4 rounded-xl hover:text-white hover:bg-amber-800"
                  >
                    <Icon.camera className="h-4 w-4" />
                    Choose photos
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      queueFiles(e.target.files)
                      e.target.value = ""
                    }}
                  />
                </div>

                {photoError ? <ErrorText>{photoError}</ErrorText> : null}

                {/* Thumbnails grid */}
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {photos.map((p) => (
                    <div key={p.id} className="group relative aspect-square overflow-hidden rounded-xl ring-1 ring-base-300">
                      <img src={p.url || "/placeholder.svg"} alt="Venue" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhoto(p.id)}
                        className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-base-content/70 text-base-100 opacity-0 transition-opacity group-hover:opacity-100"
                        aria-label="Remove photo"
                      >
                        <Icon.x className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {Array.from({ length: thumbSlots }).map((_, i) => (
                    <button
                      key={`slot-${i}`}
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-base-300 bg-base-200/40 text-base-content/30 transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      {i === 0 && photos.length === 0 ? <Icon.image className="h-6 w-6" /> : <Icon.camera className="h-6 w-6" />}
                    </button>
                  ))}
                </div>
                {photos.length > 0 ? (
                  <p className="mt-2 text-xs text-base-content/50">
                    {photos.length} of {MAX_PHOTOS} photos added
                  </p>
                ) : null}
               
              </div>

              <div className="my-8 border-t border-dashed border-base-300" />

              {/* ---- Additional message ---- */}
              <div>
                <SectionHead icon={Icon.message} title="Additional message" subtitle="Anything special for our review team?" />
                <Label icon={Icon.message}>Message to reviewer</Label>
                <textarea
                  rows={3}
                  className="textarea textarea-bordered w-full rounded-xl border-brand-accent/10 bg-white text-brand-accent placeholder:text-brand-accent/40 focus:border-brand-accent/50 focus:outline-none focus:ring-1 focus:ring-brand-accent/10"
                  placeholder="Optional — special notes, certifications, premium offerings..."
                  value={form.message}
                  onChange={set("message")}
                />
              </div>

              {/* ---- Actions ---- */}
              <div className="mt-9 flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
                <button type="button" className="btn rounded-xl border border-base-300 sm:w-36">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-brand-secondary h-14 flex-1 rounded-2xl text-base font-bold shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
                >
                  <Icon.check className="h-5 w-5" />
                  Submit venue for review
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* ---- Crop modal ---- */}
      {cropState ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-content/60 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-base-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-base-300 px-5 py-3">
              <h3 className="flex items-center gap-2 font-bold text-base-content">
                <Icon.image className="h-5 w-5 text-primary" />
                Crop photo
              </h3>
              <button type="button" onClick={() => setCropState(null)} className="btn btn-ghost btn-sm btn-circle">
                <Icon.x className="h-5 w-5" />
              </button>
            </div>

            <div className="relative h-72 w-full bg-base-content/90">
              <Cropper
                image={cropState.current.src}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="px-5 py-4">
              <label className="mb-3 flex items-center gap-3">
                <span className="text-sm font-medium text-base-content/70">Zoom</span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="range range-primary range-xs flex-1"
                />
              </label>
              <div className="flex items-center justify-between gap-3">
                {cropState.queue.length > 0 ? (
                  <span className="text-xs text-base-content/50">{cropState.queue.length} more in queue</span>
                ) : (
                  <span />
                )}
                <div className="flex gap-2">
                  <button type="button" onClick={skipCrop} className="btn btn-ghost btn-sm rounded-xl">
                    Cancel
                  </button>
                  <button type="button" onClick={confirmCrop} className="btn btn-primary btn-sm rounded-xl">
                    <Icon.check className="h-4 w-4" />
                    Crop &amp; add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}


export default AddVenue;