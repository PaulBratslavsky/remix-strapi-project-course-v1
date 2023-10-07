import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import stylesheet from "~/tailwind.css";
import { json } from "@remix-run/node";
import { getStrapiMedia } from "./utils/api-helpers";
import { fetchStrapiData } from "~/api/fetch-strapi-data.server";

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
  useLoaderData,
} from "@remix-run/react";

import Navbar from "~/components/Navbar";
import Banner from "~/components/Banner";
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const path = `/global`;

  const urlParamsObject = {
    populate: [
      "metadata.shareImage",
      "favicon",
      "notificationBanner.link",
      "navbar.links",
      "navbar.navbarLogo.logoImg",
    ],
  };

  let options = {};

  const response = await fetchStrapiData(path, urlParamsObject, options);

  return json({ ...response });
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}

export default function App() {
  const data = useLoaderData<typeof loader>();
  const { notificationBanner, navbar } = data.data.attributes;

  const navbarLogoUrl = getStrapiMedia(
    navbar.navbarLogo.logoImg.data.attributes.url
  );

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>

      <body className="bg-gray-900 min-h-screen">
        <Navbar
          links={navbar.links}
          logoUrl={navbarLogoUrl}
          logoText={navbar.navbarLogo.logoText}
        />
        <div className="container p-6 mx-auto">
          <Outlet />
        </div>

        <Banner data={notificationBanner} />

        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
