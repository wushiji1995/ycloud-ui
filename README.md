# React + TypeScript + Vite + shadcn/ui

This is a template for a new Vite project with React, TypeScript, and shadcn/ui.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `src/components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```

## Registry

Validate and build the shadcn registry:

```bash
pnpm registry:validate
pnpm registry:build
```

The public registry JSON files are generated in `public/r`.

Install the OTP Field component from this registry:

```bash
npx shadcn@latest add https://raw.githubusercontent.com/wushiji1995/ycloud-ui/main/public/r/otp-field.json
```
