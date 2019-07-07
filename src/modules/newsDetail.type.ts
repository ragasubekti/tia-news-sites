// To parse this data:
//
//   import { Convert, NewsDetailType } from "./file";
//
//   const newsDetailType = Convert.toNewsDetailType(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface NewsDetailType {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
  posts: Post[];
}

export interface Post {
  id: string;
  date: Date;
  date_gmt: Date;
  guid: string;
  modified: Date;
  modified_gmt: Date;
  title: string;
  slug: string;
  status: string;
  type: string;
  template: string;
  link: string;
  content: string;
  excerpt: string;
  author: Author;
  editor: string;
  comment_status: string;
  comments_count: number;
  featured_image: FeaturedImage;
  seo: SEO;
  categories: Category[];
  tags: Category[];
  companies: any[];
  permissions: Permissions;
  is_review_post: string;
  internal_talk: boolean;
  review: null;
  featured_video: FeaturedVideo;
  ga_type: string;
  external_url: string;
  client_logo: string;
  client_name: string;
}

export interface Author {
  id: string;
  id_techinasia: string;
  first_name: string;
  last_name: string;
  display_name: string;
  description: string;
  roles: string[];
  registered_date: Date;
  avatar_url: string;
  author_url: string;
  twitter: string;
  facebook: string;
  google: string;
  comments_count: number;
  contributed_count: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  count: number;
  parent: null | string;
}

export interface FeaturedImage {
  title: string;
  caption: string;
  description: string;
  source: string;
  attachment_meta: AttachmentMeta;
}

export interface AttachmentMeta {
  width: number;
  height: number;
  sizes: Sizes;
}

export interface Sizes {
  thumbnail: Medium;
  medium: Medium;
  medium_large: Medium;
}

export interface Medium {
  width: number;
  height: number;
  url: string;
}

export interface FeaturedVideo {
  host: string;
  url: string;
}

export interface Permissions {
  can_edit: boolean;
}

export interface SEO {
  title: string;
  description: string;
  image: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toNewsDetailType(json: string): NewsDetailType {
    return cast(JSON.parse(json), r("NewsDetailType"));
  }

  public static newsDetailTypeToJson(value: NewsDetailType): string {
    return JSON.stringify(uncast(value, r("NewsDetailType")), null, 2);
  }
}

function invalidValue(typ: any, val: any): never {
  throw Error(
    `Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`
  );
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    var map: any = {};
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    var map: any = {};
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    var l = typs.length;
    for (var i = 0; i < l; i++) {
      var typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(cases, val);
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue("array", val);
    return val.map(el => transform(el, typ, getProps));
  }

  function transformDate(typ: any, val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue("Date", val);
    }
    return d;
  }

  function transformObject(
    props: { [k: string]: any },
    additional: any,
    val: any
  ): any {
    if (val === null || typeof val !== "object" || Array.isArray(val)) {
      return invalidValue("object", val);
    }
    var result: any = {};
    Object.getOwnPropertyNames(props).forEach(key => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key)
        ? val[key]
        : undefined;
      result[prop.key] = transform(v, prop.typ, getProps);
    });
    Object.getOwnPropertyNames(val).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps);
      }
    });
    return result;
  }

  if (typ === "any") return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val);
  }
  if (typ === false) return invalidValue(typ, val);
  while (typeof typ === "object" && typ.ref !== undefined) {
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === "object") {
    return typ.hasOwnProperty("unionMembers")
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty("arrayItems")
      ? transformArray(typ.arrayItems, val)
      : typ.hasOwnProperty("props")
      ? transformObject(getProps(typ), typ.additional, val)
      : invalidValue(typ, val);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== "number") return transformDate(typ, val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  NewsDetailType: o(
    [
      { json: "total", js: "total", typ: 0 },
      { json: "per_page", js: "per_page", typ: 0 },
      { json: "current_page", js: "current_page", typ: 0 },
      { json: "total_pages", js: "total_pages", typ: 0 },
      { json: "posts", js: "posts", typ: a(r("Post")) }
    ],
    false
  ),
  Post: o(
    [
      { json: "id", js: "id", typ: "" },
      { json: "date", js: "date", typ: Date },
      { json: "date_gmt", js: "date_gmt", typ: Date },
      { json: "guid", js: "guid", typ: "" },
      { json: "modified", js: "modified", typ: Date },
      { json: "modified_gmt", js: "modified_gmt", typ: Date },
      { json: "title", js: "title", typ: "" },
      { json: "slug", js: "slug", typ: "" },
      { json: "status", js: "status", typ: "" },
      { json: "type", js: "type", typ: "" },
      { json: "template", js: "template", typ: "" },
      { json: "link", js: "link", typ: "" },
      { json: "content", js: "content", typ: "" },
      { json: "excerpt", js: "excerpt", typ: "" },
      { json: "author", js: "author", typ: r("Author") },
      { json: "editor", js: "editor", typ: "" },
      { json: "comment_status", js: "comment_status", typ: "" },
      { json: "comments_count", js: "comments_count", typ: 0 },
      { json: "featured_image", js: "featured_image", typ: r("FeaturedImage") },
      { json: "seo", js: "seo", typ: r("SEO") },
      { json: "categories", js: "categories", typ: a(r("Category")) },
      { json: "tags", js: "tags", typ: a(r("Category")) },
      { json: "companies", js: "companies", typ: a("any") },
      { json: "permissions", js: "permissions", typ: r("Permissions") },
      { json: "is_review_post", js: "is_review_post", typ: "" },
      { json: "internal_talk", js: "internal_talk", typ: true },
      { json: "review", js: "review", typ: null },
      { json: "featured_video", js: "featured_video", typ: r("FeaturedVideo") },
      { json: "ga_type", js: "ga_type", typ: "" },
      { json: "external_url", js: "external_url", typ: "" },
      { json: "client_logo", js: "client_logo", typ: "" },
      { json: "client_name", js: "client_name", typ: "" }
    ],
    false
  ),
  Author: o(
    [
      { json: "id", js: "id", typ: "" },
      { json: "id_techinasia", js: "id_techinasia", typ: "" },
      { json: "first_name", js: "first_name", typ: "" },
      { json: "last_name", js: "last_name", typ: "" },
      { json: "display_name", js: "display_name", typ: "" },
      { json: "description", js: "description", typ: "" },
      { json: "roles", js: "roles", typ: a("") },
      { json: "registered_date", js: "registered_date", typ: Date },
      { json: "avatar_url", js: "avatar_url", typ: "" },
      { json: "author_url", js: "author_url", typ: "" },
      { json: "twitter", js: "twitter", typ: "" },
      { json: "facebook", js: "facebook", typ: "" },
      { json: "google", js: "google", typ: "" },
      { json: "comments_count", js: "comments_count", typ: 0 },
      { json: "contributed_count", js: "contributed_count", typ: 0 }
    ],
    false
  ),
  Category: o(
    [
      { json: "id", js: "id", typ: "" },
      { json: "name", js: "name", typ: "" },
      { json: "slug", js: "slug", typ: "" },
      { json: "description", js: "description", typ: "" },
      { json: "count", js: "count", typ: 0 },
      { json: "parent", js: "parent", typ: u(null, "") }
    ],
    false
  ),
  FeaturedImage: o(
    [
      { json: "title", js: "title", typ: "" },
      { json: "caption", js: "caption", typ: "" },
      { json: "description", js: "description", typ: "" },
      { json: "source", js: "source", typ: "" },
      {
        json: "attachment_meta",
        js: "attachment_meta",
        typ: r("AttachmentMeta")
      }
    ],
    false
  ),
  AttachmentMeta: o(
    [
      { json: "width", js: "width", typ: 0 },
      { json: "height", js: "height", typ: 0 },
      { json: "sizes", js: "sizes", typ: r("Sizes") }
    ],
    false
  ),
  Sizes: o(
    [
      { json: "thumbnail", js: "thumbnail", typ: r("Medium") },
      { json: "medium", js: "medium", typ: r("Medium") },
      { json: "medium_large", js: "medium_large", typ: r("Medium") }
    ],
    false
  ),
  Medium: o(
    [
      { json: "width", js: "width", typ: 0 },
      { json: "height", js: "height", typ: 0 },
      { json: "url", js: "url", typ: "" }
    ],
    false
  ),
  FeaturedVideo: o(
    [
      { json: "host", js: "host", typ: "" },
      { json: "url", js: "url", typ: "" }
    ],
    false
  ),
  Permissions: o([{ json: "can_edit", js: "can_edit", typ: true }], false),
  SEO: o(
    [
      { json: "title", js: "title", typ: "" },
      { json: "description", js: "description", typ: "" },
      { json: "image", js: "image", typ: "" }
    ],
    false
  )
};
