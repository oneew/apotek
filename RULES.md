# Project Rules: Untitled UI Professional Standard

This document defines the UI/UX standards for the Pharmacy Management System, based on the **Untitled UI** design system. All future developments must strictly adhere to these rules to ensure a professional, clean, and high-density interface.

## 1. Core Principles
*   **Minimalism**: Clean white backgrounds, subtle borders, and professional typography.
*   **High Density**: Information-rich layouts without clutter. Avoid oversized padding or margins.
*   **Clarity**: Clear hierarchy with subtle color accents. Use Inter (or browser sans-serif) for all text.
*   **Professionalism**: Neutral grays (`gray-100` to `gray-900`) should be the dominant palette.

## 2. Design Tokens
*   **Colors**:
    *   Primary: `primary-600` (#7F56D9 / Lilac-Purple) - Use sparingly for buttons and active states.
    *   Background: `bg-white` (Light) / `bg-gray-950` (Dark).
    *   Borders: `border-gray-200` (Light) / `border-gray-800` (Dark).
    *   Text: `text-gray-900` (Title), `text-gray-600` (Body), `text-gray-400` (Secondary).
*   **Border Radius**:
    *   Small: `rounded-md` (4px) - For small buttons/icons.
    *   Standard: `rounded-lg` (8px) - For inputs and default buttons.
    *   Large: `rounded-xl` (12px) - For cards and modals.
    *   *Avoid any radius larger than `rounded-2xl`.*
*   **Shadows**:
    *   Use `shadow-sm` or `shadow-md` only. Avoid oversized, colorful shadows.

## 3. UI Components

### 3.1. Tables (`DataTable.jsx`)
*   **Outer Container**: `rounded-xl`, `border border-gray-200`, `overflow-hidden`, `bg-white`.
*   **Header**: `bg-gray-50`, `text-[11px]`, `font-semibold`, `text-gray-500`, `uppercase`, `tracking-wider`, `py-3`, `px-4`.
*   **Rows**: `border-b border-gray-200` (last row no border), vertical padding `py-3` to `py-4`.
*   **Hover State**: `hover:bg-gray-50`.
*   **Typography**: `text-sm font-medium text-gray-700`.

### 3.2. Modals (`ModalDialog.jsx`)
*   **Overlay**: `bg-gray-800/60`, `backdrop-blur-sm`.
*   **Header**: White background, `border-b border-gray-200`, `p-6` (or `p-4` for small modals).
*   **Footer**: White background with top border, `px-6 py-4`, right-aligned buttons.
*   **Radius**: `rounded-xl` or `rounded-2xl`.

### 3.3. Inputs & Forms
*   **Form Control**: `bg-white`, `border border-gray-300`, `rounded-lg`, `px-3 py-2`, `text-sm`, `focus:ring-2`, `focus:ring-primary-500/20`, `focus:border-primary-500`.
*   **Labels**: `text-sm font-medium text-gray-700`, margin bottom `mb-1.5`.

## 4. Coding Standards
*   **No Placeholders**: Use real data or standard mock values.
*   **Responsive**: Always test on Mobile (375px) and Desktop (1440px).
*   **Iconography**: Use `react-icons/fi` (Feather Icons) for a thin, professional look.

## 5. Page Layout Anatomy (Dashboard/List)
To ensure absolute consistency across all modules (e.g., Penjualan, Kunjungan, Konseling, Resep), every standard list page **MUST** follow this exact structural hierarchy:

### 5.1. Main Container
```jsx
<div className="animate-unt-fade">
```

### 5.2. Section Header
Use the `SectionHeader` component for the page title, subtitle, and primary actions.
```jsx
<SectionHeader title="Nama Modul" subtitle="Deskripsi singkat modul.">
  <div className="flex items-center gap-3">
    {/* Action buttons (Button Component) */}
  </div>
</SectionHeader>
```

### 5.3. Filter Bar
Placed directly below the header. Must use `bg-white dark:bg-gray-900 border border-gray-200 ... rounded-xl shadow-sm`.
```jsx
<div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8 mb-6">
  {/* Left: Primary Select Filters */}
  {/* Right: Date Filters & Filter Lanjutan Button */}
</div>
```

### 5.4. Data Table
Render the `DataTable` directly without wrapping it in additional white boxes/cards. The `DataTable` component already handles its own container styling internally.
```jsx
<DataTable columns={columns} data={data} ... />
```

### 5.5. Rekapitulasi Banner (Bottom)
Always include a summary banner at the bottom of the page to show key metrics about the currently viewed data.
```jsx
<div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden mt-6 flex justify-between items-center">
  <div className="p-5 flex items-center gap-4 border-l-4 border-primary-500">
     <div>
       <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1 tracking-tight">Rekapitulasi Data</h4>
       <p className="text-xs text-gray-500 dark:text-gray-400">Deskripsi rekap.</p>
     </div>
  </div>
  <div className="p-5 flex items-center gap-6 pr-8">
     {/* Stat Items separated by vertical lines (w-px h-10 bg-gray-200) */}
  </div>
</div>
```

## 6. Standard Spacing & Spacing Scale
To ensure consistent UI " breathing room\ across all modules, follow these specific utility classes:

* **Page Container**: Always use <div className=\animate-unt-fade\> as the root wrapper.
* **Header to Content**: The space between SectionHeader and the next element (usually the filter bar) must be exactly mt-8.
* **Content to Table**: The space between the filter bar and the DataTable must be mb-6.
* **Card/Filter Bar Padding**: All cards and filter bars must use p-4 (16px) or p-5 (20px).
* **Inner Gaps**: Use gap-3 (12px) for button groups and gap-4 (16px) for larger layout sections.
* **Table Cell Padding**: DataTable handles this, but custom tables should use py-3 and px-4.

### Layout Checklist for Every Module:
1. [ ] Root div: nimate-unt-fade.
2. [ ] Header: <SectionHeader />.
3. [ ] Filter Bar: mt-8 mb-6 p-4 rounded-xl border border-gray-200.
4. [ ] Table: DataTable (no wrapper).
5. [ ] Footer: Metric Banner with mt-6 border-l-4 border-primary-500.
