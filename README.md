<div align="center">

# GitHub Tech Stack Card

Dynamic, customizable SVG tech stack cards for GitHub profiles and project READMEs, with a visual Astro builder.

[Open the customizer](https://github-tech-stack-card.vercel.app/) · [Live card](https://github-tech-stack-card.vercel.app/api/card?username=Seungpyo1007&theme=shiny&hide_title=true&v=1) · [API options](#api-options) · [Self-hosting](#self-hosting) · [Contributing](#contributing)

</div>

<p align="center">
  <img
    src="https://github-tech-stack-card.vercel.app/api/card?username=Seungpyo1007&theme=shiny&hide_title=true&v=1"
    width="94%"
    alt="Seungpyo1007 tech stack logos grouped by category"
  />
</p>

## Features

- SVG cards generated dynamically from a single URL
- Locally vendored logos with no runtime icon-service dependency
- Rows, grid, and compact layouts
- Built-in Shiny, GitHub Dark, and light themes
- Custom colors, icon sizes, hidden categories, and hidden technologies
- Visual stack selection and drag-to-reorder controls
- Shareable builder URLs with browser-local autosave
- English and Korean builder interface
- Accessible logo names through SVG titles and descriptions
- Staggered logo entrance, subtle floating motion, and an animated border accent
- CDN caching for stable GitHub README rendering
- Invalid-input filtering and SVG-safe text rendering

## Quick start

The easiest option is the [visual customizer](https://github-tech-stack-card.vercel.app/). Choose and reorder technologies, adjust the card, then copy the generated URL, Markdown, or HTML.

To use the default profile directly, paste the following into a GitHub profile or project README:

```md
<p align="center">
  <img
    src="https://github-tech-stack-card.vercel.app/api/card?username=Seungpyo1007&theme=shiny&hide_title=true&v=1"
    width="94%"
    alt="Tech stack logos grouped by category"
  />
</p>
```

Without a `stack` token, the public card uses the registered `Seungpyo1007`
profile. The visual customizer creates a validated, versioned `stack` token so
any GitHub username can publish a card without an account or server-side data.

## Layouts

Set `layout` to `rows`, `grid`, or `compact`.

<details>
<summary><strong>Rows</strong> — best for a full-width profile README</summary>

<p align="center">
  <img src="https://github-tech-stack-card.vercel.app/api/card?username=Seungpyo1007&layout=rows&hide_title=true&v=1" width="94%" alt="Rows layout preview" />
</p>

</details>

<details>
<summary><strong>Grid</strong> — category cards in two columns</summary>

<p align="center">
  <img src="https://github-tech-stack-card.vercel.app/api/card?username=Seungpyo1007&layout=grid&hide_title=true&v=1" width="94%" alt="Grid layout preview" />
</p>

</details>

<details>
<summary><strong>Compact</strong> — reduced spacing without icon tiles</summary>

<p align="center">
  <img src="https://github-tech-stack-card.vercel.app/api/card?username=Seungpyo1007&layout=compact&hide_title=true&v=1" width="94%" alt="Compact layout preview" />
</p>

</details>

## Themes

| Theme | Query value | Description |
| --- | --- | --- |
| Shiny | `theme=shiny` | Navy, pastel blue, and lavender profile theme |
| GitHub Dark | `theme=github_dark` | Colors matched to GitHub's dark interface |
| Light | `theme=light` | High-contrast light card |

Theme colors can be overridden individually:

```text
https://github-tech-stack-card.vercel.app/api/card
  ?username=Seungpyo1007
  &bg_color=0F1B2A
  &border_color=CBAACB
  &title_color=89CFF0
  &text_color=FFFFFF
```

Remove the line breaks when using this URL in Markdown.

## Motion

Animation is enabled by default. Categories and logos enter in sequence, icons
then float subtly, and an accent travels around the card border. The SVG honors
`prefers-reduced-motion` and stops all effects for users who request reduced
motion.

Use `animation=false` for a fully static card:

```text
/api/card?username=Seungpyo1007&animation=false
```

## API options

`GET /api/card`

| Parameter | Accepted values | Default |
| --- | --- | --- |
| `animation` | `true`, `false`, `1`, `0`, `yes`, `no` | `true` |
| `username` | Registered profile name, or any GitHub username with `stack` | `Seungpyo1007` |
| `theme` | `shiny`, `github_dark`, `light` | `shiny` |
| `layout` | `rows`, `grid`, `compact` | `rows` |
| `icon_size` | Integer from `24` through `48` | `34` |
| `hide_title` | `true`, `false`, `1`, `yes` | `false` |
| `hide` | Comma-separated category or icon IDs | None |
| `stack` | Base64URL-encoded version 1 stack configuration | Registered profile |
| `title` | Card title, up to 48 characters | `Tech Stack` |
| `bg_color` | Three- or six-digit hexadecimal color | Theme value |
| `border_color` | Three- or six-digit hexadecimal color | Theme value |
| `title_color` | Three- or six-digit hexadecimal color | Theme value |
| `text_color` | Three- or six-digit hexadecimal color | Theme value |
| `tile_color` | Three- or six-digit hexadecimal icon-tile color | Theme value |
| `v` | Arbitrary cache-busting value for GitHub Camo | None |

Examples:

```text
/api/card?username=Seungpyo1007&layout=grid
/api/card?username=Seungpyo1007&layout=compact&hide=tools,react
/api/card?username=Seungpyo1007&icon_size=40&hide_title=true
```

Custom stacks use the following token payload before Base64URL encoding:

```json
{
  "v": 1,
  "groups": [
    { "id": "web", "items": ["typescript", "react", "css"] },
    { "id": "tools", "items": ["git", "vercel"] }
  ]
}
```

Tokens are limited to 4,096 characters and may only reference bundled category
and technology IDs. Malformed, empty, duplicate, or unknown entries return an
SVG error card with HTTP status `400`.

<details>
<summary><strong>Available hide IDs</strong></summary>

Categories:

```text
mobile, web, ai-ml, game-hardware, cloud-database, tools
```

Technologies:

```text
android, androidstudio, apache, arduino, autodesk, aws, blender,
cplusplus, csharp, css, dart, dotnet, expo, express, firebase, flask,
flutter, git, googlecloud, html5, huggingface, intellijidea, ios, java,
javascript, jupyter, kotlin, mdx, nextjs, nix, oracle, postgresql,
python, pytorch, react, rider, sass, swift, typescript, unity, vercel,
xcode
```

</details>

Invalid customization values fall back to safe defaults. Unknown profiles
return an SVG error card with HTTP status `404`.

## Caching

Cards are cached by the browser for five minutes and by the deployment CDN for
six hours. GitHub additionally proxies remote README images through Camo. When
a card has changed but GitHub still shows an older copy, increment the `v`
parameter in the image URL.

## Development

Requirements:

- Node.js 20 or newer
- pnpm 11

```sh
pnpm install
pnpm check
pnpm dev
```

`pnpm dev` runs the integrated Astro and Vercel Function environment. Use
`pnpm dev:web` when only the static builder UI is needed.

Refresh the vendored icon files when their upstream sources change:

```sh
pnpm fetch:icons
```

The API adapter lives in `api/card.ts`; the Astro page, shared technology
catalog, profile data, and SVG renderer remain separate in `src/`. Tests
validate stack tokens, URL generation, query parsing, HTTP behavior, XML
validity, layout snapshots, and real PNG rendering.

## Self-hosting

### Vercel

Vercel is the maintained deployment adapter and the simplest supported path:

```sh
pnpm dlx vercel
pnpm dlx vercel --prod
```

No secrets or GitHub token are required because v1 uses curated, versioned
profile data rather than fetching GitHub statistics.

### Other platforms

Vercel is not required by the SVG renderer. The functions in `src/` use standard
Node.js APIs and can be wrapped by another Node or serverless HTTP adapter. A
non-Vercel adapter must:

1. Pass query parameters to `parseCardOptions`.
2. Select and filter a registered profile.
3. Return `renderCard` output as `image/svg+xml`.
4. Include `assets/icons/**` with the deployed function.
5. Configure equivalent CDN caching headers.

Cloudflare Workers requires an asset-bundling adapter because its runtime does
not expose the Node.js filesystem used by the current icon loader.

## Contributing

1. Branch from `develop` using `feature/<name>`.
2. Use Conventional Commits.
3. Run `pnpm check` before opening a pull request.
4. Target `develop`; releases are merged into `main` through Git Flow.

Logo updates must retain source attribution in
[`assets/icons/NOTICE.md`](assets/icons/NOTICE.md).

## Acknowledgements

- Inspired by [GitHub Readme Stats](https://github.com/anuraghazra/github-readme-stats)
- Icon-card usage patterns inspired by [Skill Icons](https://github.com/tandpfun/skill-icons)
- Logos provided by [Simple Icons](https://simpleicons.org/) and [Devicon](https://devicon.dev/)

## License

Licensed under the [MIT License](LICENSE).
