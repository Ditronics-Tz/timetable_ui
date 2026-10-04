import ListState from "./ListState";

/** Shared responsive frame for entity data tables. */
export default function DataTable({
  children,
  className = "",
  loading = false,
  error = "",
  isEmpty = false,
  emptyMessage,
  onRetry,
}) {
  if (loading || error || isEmpty) {
    return (
      <ListState
        loading={loading}
        error={error}
        isEmpty={isEmpty}
        emptyMessage={emptyMessage}
        onRetry={onRetry}
      />
    );
  }

  return (
    <div className={["w-full overflow-x-auto", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
