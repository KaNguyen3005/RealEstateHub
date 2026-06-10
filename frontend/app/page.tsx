export default function HomePage() {
  return (
    <section className="page-shell">
      <section className="hero">
        <p className="eyebrow">RealEstateHub</p>
        <h1>Frontend foundation is ready.</h1>
        <p className="lead">
          This Next.js App Router scaffold is ready for the next phase:
          styling, shared layout, authentication, and reusable UI.
        </p>

        <div className="card-grid">
          <article className="card">
            <h2>App Router</h2>
            <p>Folder structure and root layout are initialized.</p>
          </article>
          <article className="card">
            <h2>TypeScript</h2>
            <p>Strict TypeScript settings are prepared for feature work.</p>
          </article>
          <article className="card">
            <h2>Next steps</h2>
            <p>Tailwind, shadcn/ui, and shared components can build on this base.</p>
          </article>
        </div>
      </section>
    </section>
  );
}
