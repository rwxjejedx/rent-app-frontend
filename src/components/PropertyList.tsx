import { useState, useMemo } from "react";
import { ArrowUpDown, Filter, Search, SlidersHorizontal } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import { MOCK_PROPERTIES, CATEGORIES } from "@/lib/data";

const ITEMS_PER_PAGE = 6;

type SortKey = "price-asc" | "price-desc" | "name-asc" | "name-desc";

const PropertyList = () => {
  const [nameFilter, setNameFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortKey>("price-asc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = MOCK_PROPERTIES.filter(p => {
      const matchName = p.name.toLowerCase().includes(nameFilter.toLowerCase());
      const matchCat = categoryFilter === "all" || p.category === categoryFilter;
      return matchName && matchCat;
    });
    result.sort((a, b) => {
      if (sortBy === "price-asc") return a.lowestPrice - b.lowestPrice;
      if (sortBy === "price-desc") return b.lowestPrice - a.lowestPrice;
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });
    return result;
  }, [nameFilter, categoryFilter, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const inputBase = "w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm text-[var(--color-foreground)] transition focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-700)] focus:border-transparent placeholder:text-[var(--color-muted-fg)]";
  const selectBase = `${inputBase} cursor-pointer appearance-none`;

  return (
    <section className="py-14">
      <div className="mx-auto max-w-7xl px-4 md:px-8">

        {/* Section header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[var(--color-muted-fg)]">Available Now</p>
            <h2 className="text-2xl font-extrabold text-[var(--color-foreground)] md:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
              Explore Properties
            </h2>
          </div>
          <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-medium text-[var(--color-muted-fg)]">
            {filtered.length} properties
          </span>
        </div>

        {/* Filters bar */}
        <div className="mb-8 rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-fg)]" />
              <input
                placeholder="Search by property name..."
                value={nameFilter}
                onChange={e => { setNameFilter(e.target.value); setPage(1); }}
                className={`${inputBase} pl-10`}
              />
            </div>

            {/* Category */}
            <div className="relative w-full md:w-44">
              <Filter className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-fg)] pointer-events-none" />
              <select
                value={categoryFilter}
                onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}
                className={`${selectBase} pl-10`}
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Sort */}
            <div className="relative w-full md:w-48">
              <SlidersHorizontal className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-fg)] pointer-events-none" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortKey)}
                className={`${selectBase} pl-10`}
              >
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="name-asc">Name: A → Z</option>
                <option value="name-desc">Name: Z → A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid */}
        {paginated.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] py-20 text-center">
            <div className="mb-3 text-4xl">🏠</div>
            <p className="text-base font-semibold text-[var(--color-foreground)]">No properties found</p>
            <p className="mt-1 text-sm text-[var(--color-muted-fg)]">Try adjusting your search filters</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition hover:bg-[var(--color-muted)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`h-9 w-9 rounded-xl text-sm font-semibold transition
                  ${page === i + 1
                    ? "bg-navy-gradient text-white shadow"
                    : "border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
                  }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition hover:bg-[var(--color-muted)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertyList;
