
import { useState } from "react"
import { Heart, MapPin, Star } from "lucide-react"

const INITIAL = [
  { id: 1, name: "The Royal Orchid Ballroom", city: "Mumbai", initials: "TR", rating: 4.8, price: 185000, capacity: 300 },
  { id: 2, name: "Skyline Rooftop Lounge", city: "Bengaluru", initials: "SR", rating: 4.6, price: 42000, capacity: 80 },
  { id: 3, name: "Lakeside Banquet Hall", city: "Udaipur", initials: "LB", rating: 4.9, price: 220000, capacity: 450 },
  { id: 4, name: "Emerald Garden Resort", city: "Goa", initials: "EG", rating: 4.7, price: 165000, capacity: 250 },
  { id: 5, name: "Heritage Courtyard", city: "Jaipur", initials: "HC", rating: 4.5, price: 98000, capacity: 180 },
  { id: 6, name: "Marina Bay Convention", city: "Chennai", initials: "MB", rating: 4.4, price: 130000, capacity: 500 },
]

const Wishlist = ()=> {
  const [items, setItems] = useState(INITIAL)
  const remove = (id) => setItems((list) => list.filter((i) => i.id !== id))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-base-content">Wishlist</h2>
        <p className="mt-1 text-sm text-base-content/60">Venues you've saved for later. {items.length} saved.</p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl bg-base-100 p-10 text-center text-base-content/60 shadow-sm">
          Your wishlist is empty. Start exploring venues to save your favourites.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((v) => (
            <article key={v.id} className="overflow-hidden rounded-2xl bg-base-100 shadow-sm transition-shadow hover:shadow-md">
              <div className="relative grid h-32 place-items-center bg-secondary text-3xl font-bold text-secondary-content">
                {v.initials}
                <button
                  type="button"
                  onClick={() => remove(v.id)}
                  aria-label={`Remove ${v.name} from wishlist`}
                  className="btn btn-circle btn-sm absolute right-3 top-3 border-none bg-base-100 text-primary hover:bg-base-100"
                >
                  <Heart className="size-4 fill-current" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="truncate font-bold text-base-content">{v.name}</h3>
                <div className="mt-1 flex items-center justify-between text-sm text-base-content/60">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-4" /> {v.city}
                  </span>
                  <span className="inline-flex items-center gap-1 font-medium text-base-content">
                    <Star className="size-4 fill-warning text-warning" /> {v.rating}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-base-content/60">Up to {v.capacity}</span>
                  <span className="font-bold text-base-content">₹{v.price.toLocaleString("en-IN")}</span>
                </div>
                <button type="button" className="btn btn-primary btn-sm mt-4 w-full rounded-xl">
                  Book now
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}


export default Wishlist;