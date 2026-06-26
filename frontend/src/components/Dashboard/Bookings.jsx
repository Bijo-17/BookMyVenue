 
 import { useEffect, useMemo, useRef, useState } from "react"
import { Search, MapPin, CalendarDays, Users, Loader2 } from "lucide-react"

const PAGE_SIZE = 10

const VENUES = [
  ["The Royal Orchid Ballroom", "Mumbai", "TR"],
  ["Skyline Rooftop Lounge", "Bengaluru", "SR"],
  ["Lakeside Banquet Hall", "Udaipur", "LB"],
  ["The Grand Pavilion", "Delhi", "GP"],
  ["Emerald Garden Resort", "Goa", "EG"],
  ["Heritage Courtyard", "Jaipur", "HC"],
  ["Marina Bay Convention", "Chennai", "MB"],
  ["Crystal Palace Hall", "Hyderabad", "CP"],
  ["Sunset Terrace Club", "Pune", "ST"],
  ["The Ivory Mansion", "Kolkata", "IM"],
  ["Riverfront Banquets", "Kochi", "RB"],
  ["Aurora Event Center", "Ahmedabad", "AE"],
]

const STATUSES = ["upcoming", "completed", "cancelled"]

// Deterministic mock dataset of 48 bookings
const ALL_BOOKINGS = Array.from({ length: 48 }, (_, i) => {
  const [name, city, initials] = VENUES[i % VENUES.length]
  const status = STATUSES[i % 3]
  const guests = 40 + ((i * 17) % 260)
  const amount = 35000 + ((i * 9173) % 200000)
  const year = 2026
  const month = (i % 12) + 1
  const day = ((i * 7) % 27) + 1
  return {
    id: i + 1,
    name,
    city,
    initials,
    status,
    guests,
    amount,
    date: new Date(year, month - 1, day),
  }
})

const TABS = [
  { key: "all", label: "All" },
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
]

const STATUS_BADGE = {
  upcoming: "badge-warning",
  completed: "badge-success",
  cancelled: "badge-error",
}

function formatINR(n) {
  return "₹" + n.toLocaleString("en-IN")
}

function formatDate(d) {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

function BookingCard({ b }) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl bg-base-100 p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:p-5">
      <div className="grid size-16 shrink-0 place-items-center rounded-xl bg-primary text-lg font-bold text-primary-content">
        {b.initials}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-bold text-base-content">{b.name}</h3>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-base-content/60">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-4" /> {b.city}
          </span>
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="size-4" /> {formatDate(b.date)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="size-4" /> {b.guests} guests
          </span>
          <span className="font-semibold text-base-content">{formatINR(b.amount)}</span>
        </div>
        <span className={`badge badge-sm mt-3 rounded-md font-semibold uppercase ${STATUS_BADGE[b.status]}`}>
          {b.status}
        </span>
      </div>

      <button type="button" className="btn btn-sm rounded-xl bg-secondary text-secondary-content hover:bg-secondary/90 sm:self-center">
        View details
      </button>
    </article>
  )
}

const Bookings = ()=> {
  const [tab, setTab] = useState("upcoming")
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState("newest")
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [loadingMore, setLoadingMore] = useState(false)
  const sentinelRef = useRef(null)

  const filtered = useMemo(() => {
    let list = ALL_BOOKINGS.filter((b) => (tab === "all" ? true : b.status === tab))
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter((b) => b.name.toLowerCase().includes(q) || b.city.toLowerCase().includes(q))
    }
    list = [...list].sort((a, b) =>
      sort === "newest" ? b.date - a.date : sort === "oldest" ? a.date - b.date : b.amount - a.amount,
    )
    return list
  }, [tab, query, sort])

  // Reset paging whenever filters change
  useEffect(() => {
    setVisible(PAGE_SIZE)
  }, [tab, query, sort])

  const shown = filtered.slice(0, visible)
  const hasMore = visible < filtered.length

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    if (!hasMore) return
    const el = sentinelRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          setLoadingMore(true)
          // simulate async fetch of the next page
          setTimeout(() => {
            setVisible((v) => Math.min(v + PAGE_SIZE, filtered.length))
            setLoadingMore(false)
          }, 600)
        }
      },
      { rootMargin: "200px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, loadingMore, filtered.length])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-base-content">Your bookings</h2>
        <p className="mt-1 text-sm text-base-content/60">Track, filter and rate your venue experiences.</p>
      </div>

      {/* Filters card */}
      <section className="rounded-2xl bg-base-100 p-4 shadow-sm sm:p-6">
        {/* Status tabs */}
        <div role="tablist" className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                tab === t.key ? "bg-primary text-primary-content" : "bg-base-200 text-base-content/70 hover:bg-base-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search + dates + sort */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="input input-bordered flex h-11 items-center gap-2 rounded-xl bg-base-200/50 lg:col-span-2">
            <Search className="size-4 opacity-60" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search venue or city"
              className="grow text-sm"
            />
          </label>
          <input type="date" className="input input-bordered h-11 rounded-xl bg-base-200/50 text-sm" aria-label="From date" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="select select-bordered h-11 rounded-xl bg-base-200/50 text-sm"
            aria-label="Sort bookings"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="amount">Highest amount</option>
          </select>
        </div>
      </section>

      {/* Results */}
      <div className="flex flex-col gap-4">
        <p className="text-sm text-base-content/50">
          Showing {shown.length} of {filtered.length} bookings
        </p>

        {shown.length === 0 ? (
          <div className="rounded-2xl bg-base-100 p-10 text-center text-base-content/60 shadow-sm">
            No bookings match your filters.
          </div>
        ) : (
          shown.map((b) => <BookingCard key={b.id} b={b} />)
        )}

        {/* Sentinel / loader for infinite scroll */}
        {hasMore ? (
          <div ref={sentinelRef} className="flex items-center justify-center py-4 text-sm text-base-content/60">
            <Loader2 className="mr-2 size-4 animate-spin" />
            Loading more bookings…
          </div>
        ) : shown.length > 0 ? (
          <p className="py-4 text-center text-sm text-base-content/40">You've reached the end.</p>
        ) : null}
      </div>
    </div>
  )
}

export default Bookings;