/**
 * Normalize axios/API errors into a user-facing string.
 */
export function extractApiError(error) {
  return (
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    error?.response?.data?.details ||
    error?.message ||
    "Something went wrong"
  );
}

/**
 * Extract unsat reasons / soft constraint notes from solver responses.
 */
export function extractSolverDetails(error) {
  const data = error?.response?.data || {};
  return {
    unsat_reasons: data.unsat_reasons || [],
    violated_soft_constraints: data.violated_soft_constraints || [],
    status: data.status,
    engine: data.engine,
  };
}
