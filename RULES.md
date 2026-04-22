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
