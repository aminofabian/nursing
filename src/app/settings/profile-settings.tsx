"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, User } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PROGRAM_TYPES, YEAR_LEVELS } from "@/lib/constants"

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  programType: z.string().optional(),
  yearOfStudy: z.string().optional(),
  school: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface ProfileSettingsProps {
  user: {
    id: string
    name: string
    email: string
    programType: string | null
    yearOfStudy: number | null
    school: string | null
  }
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      programType: user.programType || "",
      yearOfStudy: user.yearOfStudy?.toString() || "",
      school: user.school || "",
    },
  })

  async function onSubmit(data: ProfileFormValues) {
    setLoading(true)

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          programType: data.programType || null,
          yearOfStudy: data.yearOfStudy ? parseInt(data.yearOfStudy) : null,
          school: data.school || null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      toast.success("Profile updated successfully")
      router.refresh()
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Profile Information</CardTitle>
        </div>
        <CardDescription>
          Update your personal information and study details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email (read-only) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input value={user.email} disabled className="bg-muted" />
              <p className="text-sm text-muted-foreground">
                Email cannot be changed
              </p>
            </div>

            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Program Type */}
            <FormField
              control={form.control}
              name="programType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your program" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PROGRAM_TYPES.map((program) => (
                        <SelectItem key={program.value} value={program.value}>
                          {program.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Your nursing program type
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Year of Study */}
            <FormField
              control={form.control}
              name="yearOfStudy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year of Study</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {YEAR_LEVELS.map((year) => (
                        <SelectItem key={year.value} value={String(year.value)}>
                          {year.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* School */}
            <FormField
              control={form.control}
              name="school"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School/Institution</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="University of Nursing"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
