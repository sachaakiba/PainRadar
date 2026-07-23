import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Editorial data table — white surface on cream, hairline borders,
 * uppercase mono-ish micro-labels in the header. Scrolls horizontally
 * inside its own container so the page never scrolls sideways.
 */
function DataTable({
  className,
  containerClassName,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement> & {
  containerClassName?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-card shadow-card-xs",
        containerClassName
      )}
    >
      <div className="overflow-x-auto">
        <table
          className={cn("w-full border-collapse text-left", className)}
          {...props}
        />
      </div>
    </div>
  );
}

function DataTableHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={className} {...props} />;
}

function DataTableHead({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "whitespace-nowrap border-b border-border px-4 py-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground sm:px-5",
        className
      )}
      {...props}
    />
  );
}

function DataTableBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={className} {...props} />;
}

function DataTableRow({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "border-t border-border transition-colors first:border-t-0 hover:bg-secondary/50",
        className
      )}
      {...props}
    />
  );
}

function DataTableCell({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn("px-4 py-3.5 align-middle sm:px-5", className)}
      {...props}
    />
  );
}

export {
  DataTable,
  DataTableHeader,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableCell,
};
