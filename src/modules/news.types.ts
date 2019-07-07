// To parse this data:
//
//   import { Convert, News } from "./file";
//
//   const news = Convert.toNews(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface News {
    total:        number;
    per_page:     number;
    current_page: number;
    total_pages:  number;
    posts:        Post[];
}

export interface Post {
    id:                      string;
    date_gmt:                Date;
    modified_gmt:            Date;
    title:                   string;
    slug:                    string;
    status:                  Status;
    type:                    Type;
    link:                    string;
    content:                 string;
    excerpt:                 string;
    author:                  Author;
    editor:                  string;
    comment_status:          CommentStatus;
    comments_count:          number;
    comments:                any[];
    featured_image:          FeaturedImage;
    seo:                     SEO;
    categories:              Category[];
    tags:                    Category[];
    companies:               any[];
    is_sponsored:            boolean;
    sponsor:                 Sponsor;
    is_partnership:          boolean;
    external_scripts:        null;
    show_ads:                boolean;
    is_subscriber_exclusive: boolean;
    is_paywalled:            boolean;
    read_time:               number;
}

export interface Author {
    id:             string;
    first_name:     string;
    last_name:      string;
    display_name:   string;
    description:    string;
    avatar_url:     string;
    author_url:     string;
    comments_count: number;
    is_staff:       boolean;
}

export interface Category {
    id:   string;
    name: string;
    slug: string;
}

export enum CommentStatus {
    Open = "open",
}

export interface FeaturedImage {
    source:          string;
    attachment_meta: AttachmentMeta;
}

export interface AttachmentMeta {
    width:  number | null;
    height: number | null;
    sizes:  Sizes;
}

export interface Sizes {
    thumbnail?:    Large;
    medium?:       Large;
    large?:        Large;
    medium_large?: Large;
}

export interface Large {
    width:  number;
    height: number;
    url:    string;
}

export interface SEO {
    title:          string;
    description:    string;
    image:          string;
    canonical_link: null | string;
}

export interface Sponsor {
    logo: null;
    name: null;
    link: null;
}

export enum Status {
    Publish = "publish",
}

export enum Type {
    Post = "post",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toNews(json: string): News {
        return cast(JSON.parse(json), r("News"));
    }

    public static newsToJson(value: News): string {
        return JSON.stringify(uncast(value, r("News")), null, 2);
    }
}

function invalidValue(typ: any, val: any): never {
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`);
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        var map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        var map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
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

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        var result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
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
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
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
    "News": o([
        { json: "total", js: "total", typ: 0 },
        { json: "per_page", js: "per_page", typ: 0 },
        { json: "current_page", js: "current_page", typ: 0 },
        { json: "total_pages", js: "total_pages", typ: 0 },
        { json: "posts", js: "posts", typ: a(r("Post")) },
    ], false),
    "Post": o([
        { json: "id", js: "id", typ: "" },
        { json: "date_gmt", js: "date_gmt", typ: Date },
        { json: "modified_gmt", js: "modified_gmt", typ: Date },
        { json: "title", js: "title", typ: "" },
        { json: "slug", js: "slug", typ: "" },
        { json: "status", js: "status", typ: r("Status") },
        { json: "type", js: "type", typ: r("Type") },
        { json: "link", js: "link", typ: "" },
        { json: "content", js: "content", typ: "" },
        { json: "excerpt", js: "excerpt", typ: "" },
        { json: "author", js: "author", typ: r("Author") },
        { json: "editor", js: "editor", typ: "" },
        { json: "comment_status", js: "comment_status", typ: r("CommentStatus") },
        { json: "comments_count", js: "comments_count", typ: 0 },
        { json: "comments", js: "comments", typ: a("any") },
        { json: "featured_image", js: "featured_image", typ: r("FeaturedImage") },
        { json: "seo", js: "seo", typ: r("SEO") },
        { json: "categories", js: "categories", typ: a(r("Category")) },
        { json: "tags", js: "tags", typ: a(r("Category")) },
        { json: "companies", js: "companies", typ: a("any") },
        { json: "is_sponsored", js: "is_sponsored", typ: true },
        { json: "sponsor", js: "sponsor", typ: r("Sponsor") },
        { json: "is_partnership", js: "is_partnership", typ: true },
        { json: "external_scripts", js: "external_scripts", typ: null },
        { json: "show_ads", js: "show_ads", typ: true },
        { json: "is_subscriber_exclusive", js: "is_subscriber_exclusive", typ: true },
        { json: "is_paywalled", js: "is_paywalled", typ: true },
        { json: "read_time", js: "read_time", typ: 0 },
    ], false),
    "Author": o([
        { json: "id", js: "id", typ: "" },
        { json: "first_name", js: "first_name", typ: "" },
        { json: "last_name", js: "last_name", typ: "" },
        { json: "display_name", js: "display_name", typ: "" },
        { json: "description", js: "description", typ: "" },
        { json: "avatar_url", js: "avatar_url", typ: "" },
        { json: "author_url", js: "author_url", typ: "" },
        { json: "comments_count", js: "comments_count", typ: 0 },
        { json: "is_staff", js: "is_staff", typ: true },
    ], false),
    "Category": o([
        { json: "id", js: "id", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "slug", js: "slug", typ: "" },
    ], false),
    "FeaturedImage": o([
        { json: "source", js: "source", typ: "" },
        { json: "attachment_meta", js: "attachment_meta", typ: r("AttachmentMeta") },
    ], false),
    "AttachmentMeta": o([
        { json: "width", js: "width", typ: u(0, null) },
        { json: "height", js: "height", typ: u(0, null) },
        { json: "sizes", js: "sizes", typ: r("Sizes") },
    ], false),
    "Sizes": o([
        { json: "thumbnail", js: "thumbnail", typ: u(undefined, r("Large")) },
        { json: "medium", js: "medium", typ: u(undefined, r("Large")) },
        { json: "large", js: "large", typ: u(undefined, r("Large")) },
        { json: "medium_large", js: "medium_large", typ: u(undefined, r("Large")) },
    ], false),
    "Large": o([
        { json: "width", js: "width", typ: 0 },
        { json: "height", js: "height", typ: 0 },
        { json: "url", js: "url", typ: "" },
    ], false),
    "SEO": o([
        { json: "title", js: "title", typ: "" },
        { json: "description", js: "description", typ: "" },
        { json: "image", js: "image", typ: "" },
        { json: "canonical_link", js: "canonical_link", typ: u(null, "") },
    ], false),
    "Sponsor": o([
        { json: "logo", js: "logo", typ: null },
        { json: "name", js: "name", typ: null },
        { json: "link", js: "link", typ: null },
    ], false),
    "CommentStatus": [
        "open",
    ],
    "Status": [
        "publish",
    ],
    "Type": [
        "post",
    ],
};
