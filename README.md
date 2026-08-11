# GitHub Tech Stack Card

Generate a dynamic, logo-based SVG tech stack card for GitHub profiles. Cards
are rendered on request and can be customized through URL query parameters.

## Usage

```md
<img
  src="https://github-tech-stack-card.vercel.app/api/card?username=Seungpyo1007&theme=shiny&hide_title=true&v=1"
  width="94%"
  alt="Tech stack logos grouped by category"
/>
```

## API

`GET /api/card`

| Parameter | Values | Default |
| --- | --- | --- |
| `username` | Registered profile name | `Seungpyo1007` |
| `theme` | `shiny`, `github_dark`, `light` | `shiny` |
| `layout` | `rows`, `grid`, `compact` | `rows` |
| `icon_size` | Integer from `24` to `48` | `34` |
| `hide_title` | `true`, `false` | `false` |
| `hide` | Comma-separated category or icon IDs | None |
| `bg_color` | Three- or six-digit hexadecimal color | Theme value |
| `border_color` | Three- or six-digit hexadecimal color | Theme value |
| `title_color` | Three- or six-digit hexadecimal color | Theme value |
| `text_color` | Three- or six-digit hexadecimal color | Theme value |
| `v` | Optional cache-busting value for GitHub Camo | None |

Examples:

```text
/api/card?username=Seungpyo1007&layout=grid
/api/card?username=Seungpyo1007&layout=compact&hide=tools,react
/api/card?username=Seungpyo1007&bg_color=0F1B2A&border_color=CBAACB
```

Unknown parameters and invalid customization values fall back to safe defaults.
Unknown profile names return an SVG error card with HTTP status `404`.

## Development

Requirements:

- Node.js 20 or newer
- pnpm 11

```sh
pnpm install
pnpm check
pnpm dev
```

Refresh the vendored icon files when their upstream sources change:

```sh
pnpm fetch:icons
```

The icon assets are stored in the repository and are not fetched while serving
cards. See [`assets/icons/NOTICE.md`](assets/icons/NOTICE.md) for attribution.

## Deployment

Deploy as a Vercel project from this repository or with the Vercel CLI:

```sh
pnpm dlx vercel
pnpm dlx vercel --prod
```

Responses use browser and CDN cache headers. Add or increment the `v` query
parameter in a GitHub README when an immediate Camo refresh is needed.

## License

This project is licensed under the [MIT License](LICENSE).
