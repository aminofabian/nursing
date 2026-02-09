"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RESOURCE_TYPES, DIFFICULTY_LEVELS, YEAR_LEVELS } from "@/lib/constants"
import type { ResourceType } from "@prisma/client"

const resourceSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  slug: z.string().min(2, "Slug is required"),
  resourceType: z.enum([
    "NOTES",
    "PRACTICE_EXAM",
    "CARE_PLAN",
    "DRUG_GUIDE",
    "NCLEX",
    "CLINICAL",
  ]),
  categoryId: z.string().optional(),
  yearLevel: z.string().optional(),
  difficulty: z.string().optional(),
  fileUrl: z.string().url().optional().or(z.literal("")),
  previewUrl: z.string().url().optional().or(z.literal("")),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
  fileSize: z.string().optional(),
  isPremium: z.boolean(),
  price: z.string().optional(),
  isPublished: z.boolean(),
})

type ResourceFormValues = z.infer<typeof resourceSchema>

interface ResourceFormProps {
  resource?: {
    id: string
    title: string
    description: string | null
    slug: string
    resourceType: ResourceType
    categoryId: string | null
    yearLevel: number | null
    difficulty: string | null
    fileUrl: string | null
    previewUrl: string | null
    thumbnailUrl: string | null
    fileSize: number | null
    isPremium: boolean
    price: number | null
    isPublished: boolean
  }
  categories: { id: string; name: string }[]
}

export function ResourceForm({ resource, categories }: ResourceFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      title: resource?.title || "",
      description: resource?.description || "",
      slug: resource?.slug || "",
      resourceType: resource?.resourceType || "NOTES",
      categoryId: resource?.categoryId || "",
      yearLevel: resource?.yearLevel?.toString() || "",
      difficulty: resource?.difficulty || "",
      fileUrl: resource?.fileUrl || "",
      previewUrl: resource?.previewUrl || "",
      thumbnailUrl: resource?.thumbnailUrl || "",
      fileSize: resource?.fileSize?.toString() || "",
      isPremium: resource?.isPremium ?? false,
      price: resource?.price?.toString() || "",
      isPublished: resource?.isPublished ?? true,
    },
  })

  const watchTitle = form.watch("title")

  const generateSlug = () => {
    const slug = watchTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    form.setValue("slug", slug)
  }

  const onSubmit = async (data: ResourceFormValues) => {
    setLoading(true)
    try {
      const payload = {
        ...data,
        categoryId: data.categoryId || null,
        yearLevel: data.yearLevel || null,
        difficulty: data.difficulty || null,
        fileUrl: data.fileUrl || null,
        previewUrl: data.previewUrl || null,
        thumbnailUrl: data.thumbnailUrl || null,
        fileSize: data.fileSize ? parseInt(data.fileSize) : null,
        price: data.price ? parseInt(data.price) : null,
      }

      if (resource) {
        const res = await fetch(`/api/admin/resources/${resource.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error("Failed to update")
        toast.success("Resource updated")
        router.push("/admin/resources")
      } else {
        const res = await fetch("/api/admin/resources", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error("Failed to create")
        toast.success("Resource created")
        router.push("/admin/resources")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <div className="flex gap-2">
              <Input
                id="title"
                {...form.register("title")}
                placeholder="Resource title"
              />
              <Button type="button" variant="outline" onClick={generateSlug}>
                Generate slug
              </Button>
            </div>
            {form.formState.errors.title && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              {...form.register("slug")}
              placeholder="url-friendly-slug"
            />
            {form.formState.errors.slug && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.slug.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Resource description"
              rows={4}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Type</Label>
              <Select
                value={form.watch("resourceType")}
                onValueChange={(v) => form.setValue("resourceType", v as ResourceFormValues["resourceType"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(RESOURCE_TYPES).map(([key, val]) => (
                    <SelectItem key={key} value={key}>
                      {val.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={form.watch("categoryId") || "none"}
                onValueChange={(v) =>
                  form.setValue("categoryId", v === "none" ? "" : v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Year Level</Label>
              <Select
                value={form.watch("yearLevel") || "none"}
                onValueChange={(v) =>
                  form.setValue("yearLevel", v === "none" ? "" : v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {YEAR_LEVELS.map((y) => (
                    <SelectItem key={y.value} value={String(y.value)}>
                      {y.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Difficulty</Label>
              <Select
                value={form.watch("difficulty") || "none"}
                onValueChange={(v) =>
                  form.setValue("difficulty", v === "none" ? "" : v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {DIFFICULTY_LEVELS.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Files & Access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="fileUrl">File URL</Label>
            <Input
              id="fileUrl"
              {...form.register("fileUrl")}
              placeholder="https://..."
            />
          </div>
          <div>
            <Label htmlFor="previewUrl">Preview URL</Label>
            <Input
              id="previewUrl"
              {...form.register("previewUrl")}
              placeholder="https://..."
            />
          </div>
          <div>
            <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
            <Input
              id="thumbnailUrl"
              {...form.register("thumbnailUrl")}
              placeholder="https://..."
            />
          </div>
          <div>
            <Label htmlFor="fileSize">File Size (bytes)</Label>
            <Input
              id="fileSize"
              type="number"
              {...form.register("fileSize")}
              placeholder="0"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPremium"
              checked={form.watch("isPremium")}
              onCheckedChange={(c) => form.setValue("isPremium", !!c)}
            />
            <Label htmlFor="isPremium">Premium resource (requires subscription or purchase)</Label>
          </div>
          {form.watch("isPremium") && (
            <div>
              <Label htmlFor="price">Price (cents, e.g. 499 = $4.99)</Label>
              <Input
                id="price"
                type="number"
                {...form.register("price")}
                placeholder="499"
              />
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPublished"
              checked={form.watch("isPublished")}
              onCheckedChange={(c) => form.setValue("isPublished", !!c)}
            />
            <Label htmlFor="isPublished">Published (visible to users)</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {resource ? "Update" : "Create"} Resource
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
