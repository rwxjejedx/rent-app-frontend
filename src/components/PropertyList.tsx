import { useState, useEffect, useCallback } from "react";
import { Search, Filter, SlidersHorizontal, Loader2 } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import { propertyApi, categoryApi, type Property, type Category } from "@/lib/property";

type SortKey = "price_asc" | "price_desc" | "name_asc" | "name_desc";

interface SearchFilters {
  city?: string;
  checkIn?: string;
  checkOut?: string;
}

const PropertyList = ({ searchFilters }: { searchFilters?: SearchFilters }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [nameFilter, setNameFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("price_asc");
  const [page, setPage] = useState(1);

  const fetchProperties = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await propertyApi.getAll({
        name: nameFilter || undefined,
        categoryId: categoryFilter ? parseInt(categoryFilter) : undefined,
        sort: sortBy,
        page,
        limit: 6,
        city: searchFilters?.city,
        checkIn: searchFilters?.checkIn,
        checkOut: searchFilters?.checkOut,
      });
      setProperties(res.data);
      setTotal(res.pagination.total);
      setTotalPages(res.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    } finally {
      setIsLoading(false);
    }
  }, [nameFilter, categoryFilter, sortBy, page, searchFilters]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  useEffect(() => {
    categoryApi.getAll().then(setCategories).catch(console.error);
  }, []);

  const handleFilterChange = (setter: (v: any) => void) => (val: any) => {
    setter(val);
    setPage(1);
  };

  const inputBase = "w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm text-[var(--color-foreground)] transition focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-700)] focus:border-transparent placeholder:text-[var(--color-muted-fg)]";
  const selectBase = `${inputBase} cursor-pointer appearance-none`;

  return (
    <section className="py-14">
      <div className="mx-auto max-w-7xl px-4 md:px-8">

        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[var(--color-muted-fg)]">Available Now</p>
            <h2 className="text-2xl font-extrabold text-[var(--color-foreground)] md:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
              Explore Properties
            </h2>
          </div>
          <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-medium text-[var(--color-muted-fg)]">
            {total} properties
          </span>
        </div>

        {/* Filters */}
        <div className="mb-8 rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-fg)]" />
              <input
                placeholder="Search by property name..."
                value={nameFilter}
                onChange={e => handleFilterChange(setNameFilter)(e.target.value)}
                className={`${inputBase} pl-10`}
              />
            </div>

            <div className="relative w-full md:w-44">
              <Filter className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-fg)] pointer-events-none" />
              <select
                value={categoryFilter}
                onChange={e => handleFilterChange(setCategoryFilter)(e.target.value)}
                className={`${selectBase} pl-10`}
              >
                <option value="">All Categories</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="relative w-full md:w-48">
              <SlidersHorizontal className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-fg)] pointer-events-none" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortKey)}
                className={`${selectBase} pl-10`}
              >
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="name_asc">Name: A → Z</option>
                <option value="name_desc">Name: Z → A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-navy-700)]" />
          </div>
        ) : properties.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map(p => <PropertyCard key={p.id} property={p} />)}
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
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition hover:bg-[var(--color-muted)] disabled:cursor-not-allowed disabled:opacity-40">
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`h-9 w-9 rounded-xl text-sm font-semibold transition ${page === i + 1 ? "bg-navy-gradient text-white shadow" : "border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"}`}>
                {i + 1}
              </button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
              className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition hover:bg-[var(--color-muted)] disabled:cursor-not-allowed disabled:opacity-40">
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertyList;
