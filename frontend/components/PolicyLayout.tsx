type PolicyLayoutProps = {
  title: string;
  lastUpdated?: string;
  children: React.ReactNode;
};

export default function PolicyLayout({
  title,
  lastUpdated,
  children,
}: PolicyLayoutProps) {
  return (
    <main className="min-h-screen bg-bg-app px-6 py-16">
      <div className="max-w-3xl mx-auto bg-bg-card rounded-2xl p-8 border border-border">
        <h1 className="text-4xl font-title text-primary mb-2">
          {title}
        </h1>

        {lastUpdated && (
          <p className="text-sm text-text-body/70 mb-6">
            Last updated: {lastUpdated}
          </p>
        )}

        <div className="prose prose-lg max-w-none text-text-body">
          {children}
        </div>
      </div>
    </main>
  );
}
