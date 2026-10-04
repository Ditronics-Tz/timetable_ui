import { Button } from "./ui/button";

/** Consistent loading, request-error, and empty states for data lists. */
export default function ListState({
  loading,
  error,
  isEmpty,
  emptyMessage = "No records found.",
  onRetry,
}) {
  if (loading) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground" role="status">
        Loading…
      </p>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center" role="alert">
        <p className="text-sm text-destructive">{error}</p>
        {onRetry ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => void Promise.resolve(onRetry()).catch(() => {})}
          >
            Try again
          </Button>
        ) : null}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground" role="status">
        {emptyMessage}
      </p>
    );
  }

  return null;
}
