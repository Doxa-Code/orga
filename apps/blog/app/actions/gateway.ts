"use server";
import { createClient } from "contentful";

export type Post = {
  createdAt: Date;
  slug: string;
  title: string;
  tags: string[];
  content: string;
  thumbnail: string;
};


const client = createClient({
  space: 'p4quygq61thq',
  accessToken: "xFAzOWkNX8SIn70dfiI-fwlIOaAqKUv6ltzQEX3iR4o"
})
type Formatters = { [key: string]: (document: Document) => string }
const Formatters: Formatters = {
  'embedded-asset-block': document => 
      `<img src="https:${document?.data?.target?.fields?.file?.url}" style={{ width: 100% }} />`,
  'hr': () => 
      `<hr/>`,
  "unordered-list": document => {
    let finalHTML = `<ul class="list-disc">`
    for(const content of document.content) {
      const format = Formatters[content.nodeType]
      if(!format) {
        continue
      }
      finalHTML += format(content)
    }
    finalHTML += "</ul>"
    return finalHTML
  },
  "ordered-list": document => {
    let finalHTML = `<ol class="list-decimal">`
    for(const content of document.content) {
      const format = Formatters[content.nodeType]
      if(!format) {
        continue
      }
      finalHTML += format(content)
    }
    finalHTML += "</ol>"
    return finalHTML
  },
  "hyperlink": document => {
    let finalHTML = `<a class="text-sky-500 underline" href="${document.data.uri}" target="_blank">`
    for(const content of document.content) {
      const format = Formatters[content.nodeType]      
      if(!format) {
        continue
      }
      finalHTML += format(content)
    }
    finalHTML += "</a>"
    return finalHTML
  },
  "list-item": document => {
    let finalHTML = "<li>"
    for(const content of document.content) {
      const format = Formatters[content.nodeType]      
      if(!format) {
        continue
      }
      finalHTML += format(content)
    }
    finalHTML += "</li>"
    return finalHTML
  },
  'document': document => {
    let finalHTML = ""
    for(const content of document.content) {
      const format = Formatters[content.nodeType]
      if(!format) {
        continue
      }
      finalHTML += format(content)
      finalHTML += "<br/>"
    }
    return finalHTML
  },
  'heading-1': document => {
    let finalHTML = `<h1 class="text-3xl">`
    for(const content of document.content) {
      const format = Formatters[content.nodeType]
      if(!format) {
        continue
      }
      finalHTML += format(content)
    }
    finalHTML += "</h1>"
    return finalHTML
  },
  'paragraph': document => {
    let finalHTML = "<p>"
    for(const content of document.content) {
      const format = Formatters[content.nodeType]
      if(!format) {
        continue
      }
      finalHTML += format(content)
    }
    finalHTML += "</p>"
    return finalHTML
  },
  "text": document => {
    let value = document.value
    for(const mark of document.marks) {
      if(mark.type === "bold") {
        value = `<span class="font-bold">${value}</span>`
        continue
      }
      if(mark.type === "italic") {
        value = `<span class="italic">${value}</span>`
        continue
      }
      if(mark.type === "underline") {
        value = `<span class="underline">${value}</span>`
        continue
      }
    }
    return value
  }
}
type Document = { nodeType: keyof typeof Formatters, content: Document[], value: any, marks: {type: string}[], data: any }

function render(document: Document) {
  const format = Formatters[document.nodeType]
  return format(document)
}

export async function retrievePostContent(slug: string) {
  const post = await client.getEntry(slug)

  const properties = post.fields

  if (!properties) {
    return null;
  }
  const content = render(properties.content as any)

  return {
    content,
    createdAt: new Date(properties.createdAt as string),
    slug: post.sys.id,
    tags: properties.tags,
    title: properties.title,
    thumbnail: `https:${(properties?.cover as any)?.fields?.file?.url}`,
  } as Post;
}

export async function listPostsContent() {
  const posts = (await client.getEntries()).items

  return posts.map((post) => {
      const properties = post.fields;
      return {
        content: "",
        createdAt: new Date(properties.createdAt as string),
        slug: post.sys.id,
        tags: properties.tags,
        title: properties.title,
        thumbnail: `https:${(properties?.cover as any)?.fields?.file?.url}`,
      } as Post;
    })
}
