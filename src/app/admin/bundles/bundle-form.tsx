"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/constants"

type Bundle = {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  isActive: boolean
}

type Resource = { id: string; title: string; slug: string }

interface BundleFormProps {
  bundle?: Bundle
  resources: Resource[]
}

export function BundleForm({ bundle, resources }: BundleFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(bundle?.name ?? "")
  const [slug, setSlug] = useState(bundle?.slug ?? "")
  const [description, setDescription] = useState(bundle?.description ?? "")
  const [price, setPrice] = useState(bundle?.price != null ? String(bundle.price) : "999")
  const [isActive, setIsActive] = useState(bundle?.isActive ?? true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (bundle) {
      setName(bundle.name)
      setSlug(bundle.slug)
      setDescription(bundle.description ?? "")
      setPrice(String(bundle.price))
      setIsActive(bundle.isActive)
    }
  }, [bundle])

  const loadSelected = async () => {
    if (!bundle?.id) return
    const res = await fetch(`/api/admin/bundles/${bundle.id}`)
    if (!res.ok) return
    const data = await res.json()
    const ids = (data.resources || []).map(
      (r: { resourceId?: string; resource?: { id: string } }) =>
        r.resourceId ?? r.resource?.id
    ).filter(Boolean)
    setSelectedIds(new Set(ids))
  }

  useEffect(() => {
    loadSelected()
  }, [bundle?.id])

  const generateSlug = () => {
    setSlug(
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    )
  }

  const toggleResource = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        name,
        slug,
        description: description || null,
        price: parseInt(price) || 0,
        isActive,
        resourceIds: Array.from(selectedIds),
      }
      if (bundle) {
        const res = await fetch(`/api/admin/bundles/${bundle.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error("Failed to update")
        toast.success("Bundle updated")
      } else {
        const res = await fetch("/api/admin/bundles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error("Failed to create")
        toast.success("Bundle created")
      }
      router.push("/admin/bundles")
      router.refresh()
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <div className="flex gap-2">
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Bundle name"
                required
              />
              <Button type="button" variant="outline" onClick={generateSlug}>
                Slug
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="url-slug"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="price">Price (cents, e.g. 999 = $9.99)</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="999"
            />
            {price && !isNaN(parseInt(price)) && (
              <p className="text-sm text-muted-foreground mt-1">
                {formatPrice(parseInt(price))}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={isActive}
              onCheckedChange={(c) => setIsActive(!!c)}
            />
            <Label htmlFor="isActive">Active (visible to users)</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resources</CardTitle>
          <p className="text-sm text-muted-foreground">
            Select resources to include in this bundle ({selectedIds.size} selected)
          </p>
        </CardHeader>
        <CardContent>
          <div className="max-h-64 overflow-y-auto space-y-2 rounded-md border p-3">
            {resources.length === 0 ? (
              <p className="text-sm text-muted-foreground">No resources yet.</p>
            ) : (
              resources.map((r) => (
                <label
                  key={r.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 rounded p-2"
                >
                  <Checkbox
                    checked={selectedIds.has(r.id)}
                    onCheckedChange={() => toggleResource(r.id)}
                  />
                  <span className="text-sm">{r.title}</span>
                </label>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {bundle ? "Update" : "Create"} Bundle
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
