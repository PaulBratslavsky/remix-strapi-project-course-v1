import { json, type LoaderFunctionArgs } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import PageHeader from "~/components/PageHeader";
import BlogList from "~/components/BlogList";
import { fetchStrapiData } from "~/api/fetch-strapi-data.server";

export async function loader({ request }: LoaderFunctionArgs ) {
  const path = `/articles`;
  
  const urlParamsObject = {
    sort: { createdAt: "desc" },
    populate: {
      cover: { fields: ["url"] },
      category: { populate: "*" },
      authorsBio: {
        populate: "*",
      },
    },
  };

  const response = await fetchStrapiData(path, urlParamsObject);
  return json(response);
}

export const meta: MetaFunction<typeof loader> = () => {
  return [{ title: "Blog Page" }];
};

export default function BlogRoute() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <PageHeader heading="Our Blog" text="Checkout Something Cool" />
      <BlogList data={data.data} />
    </div>
  );
}
