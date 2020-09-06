<a href="https://de.serlo.org" target="_blank"><img src="https://assets.serlo.org/meta/logo.png" alt="Serlo logo" title="Serlo" align="right" height="60" /></a>

# serlo/frontend

Welcome to the new frontend.

## Overview

The frontend fetches data from the [API server](https://github.com/serlo/api.serlo.org) and renders it to a web page. A standalone deployment of the frontend is enough to view most parts of Serlo.

In a more complete environment, the frontend sits behind a [cloudflare worker](https://github.com/serlo/serlo.org-cloudflare-worker) that handles routing and redirections. Many editing features are still handled by our [legacy server](https://github.com/serlo/serlo.org).

## Getting started

### Enable frontend

You need to opt-in to see the frontend:

Enable frontend in _production environment_: [de.serlo.org/enable-frontend](https://de.serlo.org/enable-frontend)<br>
Production deployment: [frontend.serlo.org](https://frontend.serlo.org)

Enable frontend in _staging environment_: [de.serlo-staging.dev/enable-frontend](https://de.serlo-staging.dev/enable-frontend)<br>
Staging deployment: [frontend-git-staging.serlo.vercel.app](https://frontend-git-staging.serlo.vercel.app)

### Local installation

You can run the frontend on your local system. For that, install [Node.js](https://nodejs.org/en/) (current LTS) and [yarn](https://classic.yarnpkg.com/en/docs/install).

Then, run following commands:

```sh
git clone https://github.com/serlo/frontend.git
cd frontend
yarn
yarn dev
```

The server is now running on [localhost:3000](http://localhost:3000).

## Features

At the moment, the frontend implements these features:

- **Entities**. Serlo consists of different entities like articles, videos or taxonomy terms. The frontend uses the data from the API to render them. You can access an entity by alias (e.g. https://frontend.serlo.org/mathe) or by id (e.g. https://frontend.serlo.org/54210). Look further down for a complete list of supported entity types.

- **Navigation**. The frontend adds a header, breadcrumbs, secondary navigation and a footer to every page (where applicable).

- **Language versions**. The UI changes language if you are viewing an entity of another language instance. You can access them by using the id or by prefixing the alias with a language subfolder (e.g. https://frontend.serlo.org/en/serlo).

- **Custom pages**. Some pages are built separately in the frontend, like the landing page or the german donation page (https://frontend.serlo.org/spenden).

- **Horizon**. The german version contains a horizon that features selected items.

- **Google Custom Search**. Search with the built-in search input or by visiting the search page: https://frontend.serlo.org/search?q=hypotenuse

- **Login**. You can login to your account with your username (not e-mail) and the password `123456` (currently only available on staging and localhost).

- **Notifications**. After login, you can view your notifications by clicking on the notification icon in the top menu.

- **Menus for editing**. After login, you can view several menus that allows you to edit the content. The links are pointing to the legacy server and are not handled by the frontend.

## Entities

Every entity belongs to a content type. These are the supported types:

| Content Type      | Description                                                                                                                  | Example   |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------- | --------- |
| `Page`            | A single page of static content.                                                                                             | `/serlo`  |
| `Article`         | A single page of learning content.                                                                                           | `/27801`  |
| `CoursePage`      | A single page of learning content that is part of a course.                                                                  | `/52020`  |
| `Video`           | A single video element with a description.                                                                                   | `/40744`  |
| `Applet`          | A single Geogebra applet.                                                                                                    | `/138114` |
| `TaxonomyTerm`    | Index page with links to descendant entities. Some entities are shown directly in the taxonomy (e.g. subterms or exercises). | `/5`      |
| `Exercise`        | A single exercise with solution, possibly with interactive element.                                                          | `/54210`  |
| `ExerciseGroup`   | A list of exercises in a group with a shared description in the beginning.                                                   | `/53205`  |
| `GroupedExercise` | A single exercise that is part of a exercise group.                                                                          | `/53209`  |
| `Course`          | Meta-entity of a course, redirects to first page.                                                                            | `/51979`  |
| `Event`           | Information about an upcoming event.                                                                                         | `/145590` |

## Navigation

The frontend provides several means of navigation from one page to another.

### Header and Footer

Header and footer are present on every page (only exception: donation page). The entries are hard-coded in `/src/data`, changing them needs a new deployment.

### Secondary Navigation

Some pages have a secondary navigation associated with them. This show up as a horizontal scrolling menu or on the left side. The data is fetched from the backend.

### Breadcrumbs

If no secondary navigation is present, most entities have a path within the taxonomy that is shown as breadcrumbs.

### Horizon

One or three entries are shown at the bottom of an entity in the horizon. The data is also hard-coded.

### Client-Side Navigation and Pretty Links

All links within entities and the navigation should use the default alias. The frontend looks up links that are using ids and use this information to render all links as pretty links.

Clicking a link in the frontend will trigger a backend request instead of a browser navigation, the page switches without a full reload. The request is cached for the duration of the session.

## Internationalization

Currently the frontend supports six instances: de, en, es, fr, hi, ta

In `src/data` you can find all the translations and the menu data for the instances.
The `index.ts` files are seperated into four variables.

- `instanceData`: Strings for every page of the instance
- `instanceLandingData`: Strings the landing page only
- `serverSideStrings`: Strings for the server only
- `loggedInData`: Strings for logged in users only

To add a new string, add it to the right variable inside the main language file `src/data/en/index.ts`.
To access the strings in your components use the relevant hook (`useInstanceData`,`useLoggedInData`, …).
When new strings (in en/index.ts) get merged into `staging`, they automatically get uploaded to our [crowdin project](https://crowdin.com/project/serlo) and can then be translated there.

### Example

```ts
import { useInstanceData } from '@/contexts/instance-context'

export function SerloBird() {
  const { strings } = useInstanceData()
  render (
    <h1>{strings.header.slogan}</h1>
  )
```

## Repository

Here are some useful places to get started:

- `/src/pages/[[...slug]].js` currently we handle pages manually with a [catch all route](https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes). This is a good place to start.

- `/src/components`: Collection of react components for the frontend.

- `/src/components/pages`: Components that `[[...slug.js]]` calls as pages.

- `/src/fetcher`: Requesting data from the GraphQL backend and process it.

- `/src/schema`: Definition of the frontend content format, with renderer, and converter for edtr-io and legacy.

- `/src/data`: Translations, entries navigation

- `/public/_assets`: A place for public assets, served as static files under the path `/_assets/`. Don't use `import` from here, see [Assets](#assets).

- `/external`: Third-party code that is not maintained by the frontend.

Some useful commands:

```
yarn dev
```

Starts the development server. This enables hot reloading and development warnings. Create a PR in this repository to get a preview deployment that uses production settings.

```
yarn format
```

Runs eslint and prettier, fixes issues automatically if possible.

```
yarn lint
```

Runs tsc, eslint and prettier. This command needs to pass before merging into staging.

```
yarn analyze
```

Creates a build of the frontend, shows summary of build artefacts and creates in-depth analysis of the bundles.

```
yarn test
```

Runs jest tests.

All files are named with kebab-case. You should use `@/` to import files from `src/` instead of relative paths.

## Schema

Entities may contain a wide range of different elements. See `@/data-types.ts` for a detailed description.

Here is the list of supported element types:

- text
- a
- inline-math
- p
- h
- math
- img
- spoiler-container
- spoiler-title
- spoiler-body
- ul
- ol
- li
- row
- col
- important
- anchor
- table
- tr
- th
- td
- geogebra
- injection
- exercise
- exercise-group
- video
- code
- equations

<br><br><br><br><br>

---

Previous documentation below here, pretty much still valid.

### Creating pages

Routes are mapped to individual files in the `pages`-folder. Create a [page](https://nextjs.org/docs/basic-features/pages) by adding following file:

```tsx
// src/pages/hello-world.tsx

export default function HelloWorld() {
  return <p>Welcome to the frontend!</p>
}
```

Visit `localhost:3000/helloworld` to view this page.

### Adding styles

You can attach [styles](https://styled-components.com/docs/basics#getting-started) to html elements and use them in your component:

```tsx
// src/pages/hello-world.tsx

import styled from 'styled-components'

export default function HelloWorld() {
  return <BigParagraph>Welcome to the frontend!</BigParagraph>
}

const BigParagraph = styled.p`
  text-align: center;
  font-size: 3rem;
  color: lightgreen;
`
```

### Building components

Use functional components and [hooks](https://reactjs.org/docs/hooks-overview.html) to split your code into reusable pieces. Some basic features are shown in this example:

```tsx
// src/pages/hello-world.tsx

import React from 'react'
import styled from 'styled-components'

export default function HelloWorld() {
  return <ClickMeTitle title="Welcome to the frontend!" />
}

function ClickMeTitle({ title }) {
  const [clicked, setClicked] = React.useState(false)
  const smiley = clicked ? ' :)' : ''
  return (
    <BigParagraph onClick={() => setClicked(!clicked)}>
      {title + smiley}
    </BigParagraph>
  )
}

const BigParagraph = styled.p`
  text-align: center;
  font-size: 3rem;
  color: lightgreen;
`
```

Visit `localhost:3000/hello-world`. Click on the text. Every click should toggle a smiley face:

![grafik](https://user-images.githubusercontent.com/13507950/76195662-1a048700-61e9-11ea-8abb-e98cf1bf3e32.png)

## Basic Features

### TypeScript

We love types. They help us to maintain code and keep the codebase consistent. We also love rapid development and prototyping. You decide: Add your type declarations immediately as you code or later when the codebase stabilizes. The choice is up to you:

```tsx
export default function HelloWorld() {
  return <Greeter title="Hello" subline="Welcome to the frontend!" />
}

interface GreeterProps {
  title: string
  subline?: string
}

function Greeter({ title, subline }: GreeterProps) {
  return (
    <>
      <h1>{title}</h1>
      {subline && <small>{subline}</small>}
    </>
  )
}
```

### Components

The frontend is a growing collection of components. Package every part of the UI as a component, save them in `src/components` and let the file name match the components name in kebab-case. Export the component and type the props. A complete component file would look like this:

```tsx
// src/components/greeter.tsx

interface GreeterProps {
  title: string
  subline?: string
}

export function Greeter({ title, subline }: GreeterProps) {
  return (
    <>
      <h1>{title}</h1>
      {subline && <small>{subline}</small>}
    </>
  )
}
```

### Responsive Design

Users will come to the frontend using very different devices, from narrow smartphones to very wide screens. Adapt your components and change there appearing with media queries:

```tsx
import styled from 'styled-components'

export function HelloWorld() {
  return (
    <ResponsiveBox>
      <GrowingParagraph>Hallo</GrowingParagraph>
      <GrowingParagraph>Welt</GrowingParagraph>
    </ResponsiveBox>
  )
}

const ResponsiveBox = styled.div`
  display: flex;
  @media (max-width: 500px) {
    flex-direction: column;
  }
`

const GrowingParagraph = styled.p`
  flex-grow: 1;
  text-align: center;
  font-size: 2rem;
  padding: 16px;
  background-color: lightgreen;
`
```

This example makes use of [flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/). On wide screens, both paragraphs are shown next to each other:

![](https://user-images.githubusercontent.com/13507950/76287324-7d9fba80-62a4-11ea-9f59-6d682aa8ac36.png)

On smaller screens, they are below each other:

![](https://user-images.githubusercontent.com/13507950/76287406-b17ae000-62a4-11ea-9901-73f7b6b868cc.png)

### Theming

We can improve the previous example by extracting commenly used constants like breakpoints or colors into a [theme](https://styled-components.com/docs/advanced#theming). The file `src/theme.tsx` defines our global theme which you can access in every component:

```tsx
import styled from 'styled-components'

export function HelloWorld() {
  return (
    <ResponsiveBox>
      <GrowingParagraph>Hallo</GrowingParagraph>
      <GrowingParagraph>Welt</GrowingParagraph>
    </ResponsiveBox>
  )
}

const ResponsiveBox = styled.div`
  display: flex;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    flex-direction: column;
  }
`

const GrowingParagraph = styled.p`
  flex-grow: 1;
  text-align: center;
  font-size: 2rem;
  padding: 16px;
  background-color: ${(props) => props.theme.colors.brand};
`
```

### Units

There exists a bunch of different length units. Most of the time, [px](https://stackoverflow.com/questions/11799236/should-i-use-px-or-rem-value-units-in-my-css) is fine. Sometimes there are better alternativs, especially in regard of [a11y](https://www.24a11y.com/2019/pixels-vs-relative-units-in-css-why-its-still-a-big-deal/):

- Use `rem` for `font-size`, so users can zoom the text (e.g. farsighted people or users on 4k monitors)
- Use dimensionless values for `line-height` to scale well.
- Test your component how it behaves when text zooms and eventually make adjustments.

### Icons

Add some eye candy by using icons. We integrated [Font Awesome](https://github.com/FortAwesome/react-fontawesome) and adding icons is straight forward:

```tsx
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'

export function HelloWorld() {
  return (
    <BigIcon>
      <FontAwesomeIcon icon={faCoffee} size="1x" />
    </BigIcon>
  )
}

const BigIcon = styled.div`
  text-align: center;
  font-size: 3rem;
  color: brown;
  margin: 30px;
`
```

### Style Adaption

Often you need two components with only slightly different styles. Adapt your styles [based on props](https://styled-components.com/docs/basics#adapting-based-on-props):

```tsx
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCandyCane } from '@fortawesome/free-solid-svg-icons'

export function HelloWorld() {
  return (
    <BigIcon iconColor="pink">
      <FontAwesomeIcon icon={faCandyCane} size="1x" />
    </BigIcon>
  )
}

const BigIcon = styled.div<{ iconColor: string }>`
  text-align: center;
  font-size: 3rem;
  color: ${(props) => props.iconColor};
  margin: 30px;
`
```

This is one of the rare places where types are mandatory.

### Polished

To boost your creativity, we included a bunch of useful css [helper from polished](https://polished.js.org/docs/):

```tsx
import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCandyCane } from '@fortawesome/free-solid-svg-icons'
import { lighten } from 'polished'

export function HelloWorld() {
  const [lighter, setLighter] = React.useState(0)
  return (
    <>
      <p>Click it:</p>
      <BigIcon lighter={lighter} onClick={() => setLighter(lighter + 0.01)}>
        <FontAwesomeIcon icon={faCandyCane} size="1x" />
      </BigIcon>
    </>
  )
}

const BigIcon = styled.div<{ lighter: number }>`
  text-align: center;
  font-size: 3rem;
  color: ${(props) => lighten(props.lighter, 'pink')};
  margin: 30px;
`
```

Import your helper from polished and use it in interpolations.

### Assets

Put static content like images or documents into the `public/_assets` folder.

Example: The file `public/_assets/img/placeholder.png` is accessible via `localhost:3000/_assets/img/placeholder.png`

You can use assets in your components:

```tsx
export function HelloWorld() {
  return <img src="/_assets/img/placeholder.png" alt="placeholder" />
}
```

### SVG

You can import a svg directly. They are inlined and usable as component:

```tsx
import ParticipateSVG from '@/assets-webkit/img/footer-participate.svg'

export function HelloWorld() {
  return <ParticipateSVG />
}
```

### Tooltips, Dropdowns & Menus

You can add elements that [pop out](https://atomiks.github.io/tippyjs/) of the page with [Tippy](https://github.com/atomiks/tippyjs-react). A basic drop button looks like this:

```tsx
import styled from 'styled-components'
import Tippy from '@tippyjs/react'

export function HelloWorld() {
  return (
    <Wall>
      <Tippy
        content={<Drop>Surprise )(</Drop>}
        trigger="click"
        placement="bottom-start"
      >
        <button>Click Me!</button>
      </Tippy>
    </Wall>
  )
}

const Wall = styled.div`
  margin-top: 100px;
  display: flex;
  justify-content: center;
`

const Drop = styled.div`
  background-color: lightgreen;
  padding: 5px;
  box-shadow: 8px 8px 2px 1px rgba(0, 255, 0, 0.2);
`
```

Surround the target element with the `Tippy` component and pass the content to it. There are many more [props](https://atomiks.github.io/tippyjs/v6/all-props/) to explore.

### Modals

Show information to the user with modals. [react-modal](https://github.com/reactjs/react-modal) provides the necessary functionality. This example shows how you can get started:

```tsx
import React from 'react'
import { Modal } from '@/components/Modal' // our wrapper

const centeredModal = {
  overlay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    position: 'static',
  },
}

export function HelloWorld() {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)}>Open modal</button>
      <Modal
        isOpen={open}
        onRequestClose={() => setOpen(false)}
        style={centeredModal}
      >
        This is the content of the modal
      </Modal>
    </>
  )
}
```

You handle the state by yourself. The `Modal` component has [many options](http://reactcommunity.org/react-modal/) available. Import the modal from `src/reactmodal.tsx`. This takes care of the app element.

### Formulas

You can use [KaTeX](https://github.com/KaTeX/KaTeX) to render formulas:

```tsx
import styled from 'styled-components'
import { Math } from '@/components/content/Math'

export function HelloWorld() {
  return (
    <>
      <Paragraph>
        This changed the world:{' '}
        <Math formula={'c = \\pm\\sqrt{a^2 + b^2}'} inline />.
      </Paragraph>
      <Paragraph>This too:</Paragraph>
      <CenteredParagraph>
        <Math formula={'E = mc^2'} />
      </CenteredParagraph>
    </>
  )
}

const Paragraph = styled.p`
  margin: 20px;
  font-size: 18px;
`

const CenteredParagraph = styled.p`
  text-align: center;
  font-size: 18px;
`
```

Our math component takes two props: `formula` is the LaTeX string, `inline` is optional and will make the formula a bit smaller. The rendered formula is a `span` that can be placed anywhere.

## Advanced Topics

### Importing Component dynamically

If some part of a page is heavy and only relevant for a smaller fraction of users, import it dynamically. Write your component as usual:

```tsx
// src/components/fancy-component.tsx

export function FancyComponent() {
  return <p>This is some heavy component</p>
}
```

Use a [dynamic import](https://nextjs.org/docs/advanced-features/dynamic-import) to load the component:

```tsx
// src/pages/hello-world.tsx

import React from 'react'
import dynamic from 'next/dynamic'

const FancyComponent = dynamic(() =>
  import('@/components/fancy-component').then((mod) => mod.FancyComponent)
)

export default function HelloWorld() {
  const [visible, setVisible] = React.useState(false)
  return (
    <>
      <p>
        <button onClick={() => setVisible(true)}>Load ...</button>
      </p>
      {visible && <FancyComponent />}
    </>
  )
}
```

The source code of `FancyComponent` is splitting into a separate chunk and is only loaded when users click the button.

### Reusing CSS Snippets

You can extend components by adding style snippets. These snippets are functions that add new props to a styled component:

```tsx
import styled from 'styled-components'

export function HelloWorld() {
  return (
    <>
      <ChatParagraph side="left">Hey, how are you?</ChatParagraph>
      <ChatParagraph side="right">I'm fine!</ChatParagraph>
    </>
  )
}

interface SideProps {
  side: 'left' | 'right'
}

function withSide(props: SideProps) {
  if (props.side === 'left') {
    return `
      color: blue;
      text-align: left;
    `
  } else if (props.side === 'right') {
    return `
      color: green;
      text-align: right;
    `
  } else {
    return ''
  }
}

const ChatParagraph = styled.p<SideProps>`
  ${withSide}
  margin: 20px;
`
```

This example adds the `side` prop to the `ChatParagraph` and allows users to change the appearance of the component.

You can reuse this function in another component:

```tsx
const AnotherChatParagraph = styled.p<SideProps>`
  ${withSide}
  margin: 15px;
  border: 3px solid gray;
`
```

### \_document.tsx and \_app.jsx

Your pages get wrapped in two components, [\_document.tsx](https://nextjs.org/docs/advanced-features/custom-document) and [\_app.tsx](https://nextjs.org/docs/advanced-features/custom-app). You can override both files. The document contains everything that is outside of your react app, especially the html and body tag. This is a good place to set styles on these or to define the language. The document is rendered on the server only.

The app is the entrypoint of your page and is rendered client-side as well. You can add global providers or import css files here.

### Peer dependencies

Here is a list of included peer dependencies:

- `styled-components` depends on `react-is`
- `graphiql` depends on `prop-types`
- `babel-jest` depends on `@babel/core`

## FAQ

### Is there any css reset?

No, we are not using any [css resets](https://github.com/jaydenseric/Fix/issues/3). Each component should reset their own styles.

### Do I have to vendor prefix my css?

No, styled components [takes care](https://styled-components.com/docs/basics#motivation) of this already.

### Can I add external css?

Only if it is absolutely necessary. You are able to import external `.css` files in `src/pages/_app.tsx`. These stylesheets are always global and included in every page. If possible, use a package that supports styled components.

### Some client specific objects (window, document) are causing trouble with server side rendering. What can I do?

Delay these parts of the code after your component mounted, using the `useEffect` hook:

```tsx
import React from 'react'
import styled from 'styled-components'

function HelloWorld() {
  const [href, setHref] = React.useState(undefined)

  React.useEffect(() => {
    setHref(window.location.href)
  }, [])

  return href ? <BigDiv>Your site's url is {href}</BigDiv> : null
}

const BigDiv = styled.div`
  text-align: center;
  margin-top: 100px;
`

export default HelloWorld
```

Using the state is important: This ensures that server side rendering and client side hydration matches up.

### How can I detect whether I am serverside or clientside?

The most idomatic way to do this is checking the type of window:

```tsx
if (typeof window === 'undefined') {
  // serverside
}
```

Attention: Make sure that the result of SSR and client side rendering is the same! Making a difference between environments can cause inconsistencies and will lead to react warnings.

### How can I focus an element?

To focus a html element, you need access to the underlying DOM node. Use the [ref hook](https://reactjs.org/docs/hooks-reference.html#useref) for this.

### What does this syntax mean?

JavaScript compilers allow a greater range of syntax. Here is a small cheatsheet.

#### Destructuring Object

```tsx
const { title, url } = props
// -->
const title = props.title
const url = props.url
```

#### Destructuing Array

```tsx
const [open, setOpen] = React.useState(false)
// -->
const __temp = React.useState(false)
const open = __temp[0]
const setOpen = __temp[1]
```

#### Object Property Shorthand

```tsx
return { title, content }
// -->
return { title: title, content: content }
```

#### String Interpolation

```tsx
return `The key ${key} can not be found in ${db}.`
// -->
return 'The key ' + key + ' can not be found in ' + db + '.'
```

#### JSX

```tsx
return <Par gray={true}>This is a paragraph</Par>
// -->
return React.createElement(Par, { gray: true }, `This is a paragraph`)
```

### How can I change the state of a sibling?

Generally, you can't and shouldn't. Extract the state to the parent instead and pass change handlers:

```tsx
import React from 'react'

function HelloWorld() {
  return <Parent />
}

function Parent() {
  const [msg, setMsg] = React.useState('hello')
  return (
    <>
      <Brother setMsg={setMsg} />
      <hr />
      <Sister msg={msg} />
    </>
  )
}

function Brother(props) {
  const { setMsg } = props
  return <button onClick={() => setMsg('Yeah!')}>Click here</button>
}

function Sister(props) {
  const { msg } = props
  return <p>{msg}</p>
}
```

The brother can pass a message to its sister by declaring the state in the parent. React takes care of updating and rendering.

### How can I change the port of the dev server?

You can change the port by running `yarn dev --port 8080`.
