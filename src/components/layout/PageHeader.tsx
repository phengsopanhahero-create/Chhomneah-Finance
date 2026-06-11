export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="lang-km text-2xl font-extrabold sm:text-3xl">{title}</h1>
        {subtitle && (
          <p className="lang-km mt-2 max-w-2xl text-primary-foreground/85">
            {subtitle}
          </p>
        )}
      </div>
      <div className="khmer-border-motif-thin" />
    </div>
  );
}
