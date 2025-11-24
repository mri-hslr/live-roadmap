export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="min-h-screen bg-surface-light dark:bg-surface-dark text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-10">
          {children}
        </div>
      </div>
    );
  }
  