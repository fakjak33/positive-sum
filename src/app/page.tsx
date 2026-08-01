export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <h1 className="display measure text-4xl sm:text-5xl">
        Half of all stocks lose money. The market still goes up.
      </h1>
      <p className="measure mt-6 text-lg text-text-muted">
        Both of those are true. Understanding why is the difference between
        investing and gambling.
      </p>
      <p className="tabular mt-10 text-5xl text-gain">51.6%</p>
      <p className="tabular mt-2 text-5xl text-loss">5.26%</p>
      <p className="tabular mt-2 text-5xl text-rare">4%</p>
    </div>
  );
}
