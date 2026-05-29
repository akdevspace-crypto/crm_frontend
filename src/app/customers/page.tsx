export const metadata = {
  title: 'Customers | ElderCare CRM',
};

export default function CustomersPage() {
  return (
    <div className="h-full flex flex-col">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Customers Directory</h1>
        <p className="text-slate-500 mt-1">Browse and manage elderly care profiles and family contacts.</p>
      </header>
      
      <div className="flex-1 bg-card rounded-3xl border border-border shadow-sm p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Customer 360 Database</h2>
          <p className="text-slate-500">Loading Supabase records...</p>
        </div>
      </div>
    </div>
  );
}
