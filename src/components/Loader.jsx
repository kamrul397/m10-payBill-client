export default function Loader() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[50vh] gap-3">
      <span className="loading loading-ring loading-lg text-primary"></span>
      <p className="text-sm opacity-60">Please wait...</p>
    </div>
  );
}
