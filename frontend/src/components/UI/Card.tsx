export default function Card({ children }: any) {
    return (
      <div className="bg-card-light dark:bg-card-dark rounded-xl2 shadow-card p-6 border border-gray-200/50 dark:border-white/10">
        {children}
      </div>
    );
  }
  