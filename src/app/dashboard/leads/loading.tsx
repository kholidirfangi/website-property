export default function Loading() {
  return (
    <section className="p-4 md:p-8">
      <div className="animate-pulse">
        {/* Header */}
        <div className="h-8 w-32 rounded bg-gray-200" />

        <div className="mt-3 h-5 w-72 rounded bg-gray-200" />

        {/* Search & Filter */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="h-10 flex-1 rounded-lg bg-gray-200" />

          <div className="h-10 w-full rounded-lg bg-gray-200 sm:w-40" />
        </div>

        {/* Table */}
        <div className="mt-6 overflow-hidden rounded-xl bg-white shadow">
          <div className="space-y-4 p-6">
            <div className="h-5 w-full rounded bg-gray-200" />
            <div className="h-5 w-full rounded bg-gray-200" />
            <div className="h-5 w-full rounded bg-gray-200" />
            <div className="h-5 w-full rounded bg-gray-200" />
            <div className="h-5 w-full rounded bg-gray-200" />
          </div>
        </div>
      </div>
    </section>
  );
}