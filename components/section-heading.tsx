type SectionHeadingProps = {
  title: string;
  description?: string;
};

export function SectionHeading({ title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl" data-motion="section-heading">
      <h2 className="rule-label text-text-soft">
        / {title}
      </h2>
      {description ? (
        <p className="mt-5 max-w-xl text-pretty text-sm leading-6 text-muted md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
