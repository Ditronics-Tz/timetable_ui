import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted && char === '"' && text[index + 1] === '"') {
      field += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (!quoted && char === ",") {
      row.push(field);
      field = "";
    } else if (!quoted && (char === "\n" || char === "\r")) {
      if (char === "\r" && text[index + 1] === "\n") index += 1;
      row.push(field);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  row.push(field);
  if (row.some((value) => value.trim())) rows.push(row);
  if (quoted) throw new Error("The CSV has an unfinished quoted value.");
  return rows;
}

function downloadText(name, content, type = "text/csv;charset=utf-8") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

/** CSV upload with row validation, review, confirmation, and error report hooks. */
export default function CsvImport({
  columns,
  templateName = "import-template.csv",
  onDryRun,
  onConfirm,
}) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const template = columns.map((column) => column.key).join(",");

  const selectFile = async (event) => {
    const file = event.target.files?.[0];
    setRows([]);
    setErrors([]);
    setMessage("");
    if (!file) return;

    setBusy(true);
    try {
      const parsed = parseCsv(await file.text());
      if (parsed.length < 2) throw new Error("Add a header row and at least one data row.");
      const headers = parsed[0].map((header) => header.trim());
      const missingHeaders = columns.filter((column) => !headers.includes(column.key));
      if (missingHeaders.length) {
        throw new Error(`Missing required columns: ${missingHeaders.map((item) => item.key).join(", ")}`);
      }

      const mapped = parsed.slice(1).map((values, index) => ({
        rowNumber: index + 2,
        values: Object.fromEntries(headers.map((header, columnIndex) => [header, values[columnIndex] ?? ""])),
      }));
      let validationErrors = mapped.flatMap(({ rowNumber, values }) =>
        columns
          .filter((column) => column.required && !String(values[column.key] ?? "").trim())
          .map((column) => ({ row: rowNumber, field: column.key, message: `${column.label} is required.` }))
      );

      if (onDryRun) {
        const result = await onDryRun({ headers, rows: mapped });
        validationErrors = result?.errors ?? validationErrors;
      }
      setRows(mapped);
      setErrors(validationErrors);
      setMessage(validationErrors.length ? "Review the row errors before importing." : `${mapped.length} rows are ready to import.`);
    } catch (error) {
      setMessage(error?.message || "The CSV file could not be read.");
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  };

  const confirmImport = async () => {
    if (!rows.length || errors.length || !onConfirm) return;
    setBusy(true);
    setMessage("");
    try {
      const result = await onConfirm(rows);
      setMessage(result?.message || `${rows.length} rows imported successfully.`);
      setRows([]);
    } catch (error) {
      setMessage(error?.message || "The import could not be completed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button type="button" variant="outline" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        {open ? "Close CSV import" : "Upload CSV"}
      </Button>
      {open && (
        <Card className="max-w-4xl space-y-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">Import from CSV</h2>
              <p className="text-sm text-slate-600">Download a template, select a file, review row errors, then confirm.</p>
            </div>
            <Button type="button" variant="outline" onClick={() => downloadText(templateName, `${template}\n`)}>
              Download template
            </Button>
          </div>
          <label className="block space-y-2 text-sm font-medium">
            CSV file
            <input type="file" accept=".csv,text/csv" onChange={selectFile} disabled={busy} className="block w-full rounded-md border p-2" />
          </label>
          {message && <p className="text-sm" role="status">{message}</p>}
          {errors.length > 0 && (
            <div className="space-y-2" role="alert">
              <h3 className="text-sm font-semibold text-red-700">Rows to fix ({errors.length})</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-red-700">
                {errors.map((error, index) => <li key={`${error.row}-${error.field}-${index}`}>Row {error.row}, {error.field}: {error.message}</li>)}
              </ul>
              <Button type="button" variant="outline" onClick={() => downloadText("import-errors.csv", `row,field,message\n${errors.map((error) => `${error.row},${error.field},"${String(error.message).replaceAll('"', '""')}"`).join("\n")}\n`)}>
                Download error report
              </Button>
            </div>
          )}
          {rows.length > 0 && (
            <div className="space-y-3">
              <div className="overflow-x-auto rounded border">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50"><tr>{columns.map((column) => <th key={column.key} className="px-3 py-2">{column.label}</th>)}</tr></thead>
                  <tbody>{rows.slice(0, 5).map((row) => <tr key={row.rowNumber} className="border-t">{columns.map((column) => <td key={column.key} className="px-3 py-2">{row.values[column.key]}</td>)}</tr>)}</tbody>
                </table>
              </div>
              {rows.length > 5 && <p className="text-xs text-slate-500">Showing the first 5 of {rows.length} rows.</p>}
              <Button type="button" onClick={confirmImport} disabled={busy || errors.length > 0 || !onConfirm}>
                {busy ? "Working…" : "Confirm import"}
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
