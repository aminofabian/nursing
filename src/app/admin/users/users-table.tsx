"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, User, Shield, ShieldOff } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

type UserRow = {
  id: string
  name: string
  email: string
  role: string
  createdAt: Date
  hasActiveSubscription?: boolean
}

export function AdminUsersTable({
  initialUsers,
  total: initialTotal,
}: {
  initialUsers: UserRow[]
  total: number
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [users, setUsers] = useState(initialUsers)
  const [total, setTotal] = useState(initialTotal)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [detailUser, setDetailUser] = useState<UserRow | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [userDetail, setUserDetail] = useState<{
    subscriptions: { plan: string; status: string; endsAt: string }[]
    _count: { downloads: number; purchases: number; savedResources: number }
  } | null>(null)

  const fetchUsers = () => {
    startTransition(async () => {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (roleFilter !== "all") params.set("role", roleFilter)
      const res = await fetch(`/api/admin/users?${params}`)
      if (!res.ok) return
      const data = await res.json()
      setUsers(data.users)
      setTotal(data.pagination.total)
    })
  }

  const openDetail = async (user: UserRow) => {
    setDetailUser(user)
    setUserDetail(null)
    setDetailLoading(true)
    try {
      const res = await fetch(`/api/admin/users/${user.id}`)
      if (!res.ok) throw new Error("Failed to load")
      const data = await res.json()
      setUserDetail({
        subscriptions: data.subscriptions || [],
        _count: data._count || { downloads: 0, purchases: 0, savedResources: 0 },
      })
    } catch {
      toast.error("Failed to load user details")
    } finally {
      setDetailLoading(false)
    }
  }

  const changeRole = async (userId: string, newRole: "ADMIN" | "STUDENT") => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })
      if (!res.ok) throw new Error("Failed to update")
      toast.success("Role updated")
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      )
      if (detailUser?.id === userId) setDetailUser((u) => (u ? { ...u, role: newRole } : null))
      router.refresh()
    } catch {
      toast.error("Failed to update role")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
            className="pl-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="STUDENT">Student</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={fetchUsers} disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto -mx-4 md:mx-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.hasActiveSubscription ? (
                    <Badge className="bg-green-500/10 text-green-700">Active</Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {format(new Date(user.createdAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-wrap gap-1 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => openDetail(user)} className="min-h-[44px] min-w-[44px] md:min-w-0">
                      <User className="h-4 w-4 md:mr-1" />
                      <span className="hidden md:inline">View</span>
                    </Button>
                    {user.role === "ADMIN" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => changeRole(user.id, "STUDENT")}
                        className="min-h-[44px] min-w-[44px] md:min-w-0"
                      >
                        <ShieldOff className="h-4 w-4 md:mr-1" />
                        <span className="hidden md:inline">Demote</span>
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => changeRole(user.id, "ADMIN")}
                        className="min-h-[44px] min-w-[44px] md:min-w-0"
                      >
                        <Shield className="h-4 w-4 md:mr-1" />
                        <span className="hidden md:inline">Make admin</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {users.length} of {total} users
      </p>

      <Dialog open={!!detailUser} onOpenChange={() => setDetailUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {detailUser?.name} {detailUser?.email && `(${detailUser.email})`}
            </DialogTitle>
          </DialogHeader>
          {detailLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : detailUser && userDetail ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge>{detailUser.role}</Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    changeRole(
                      detailUser.id,
                      detailUser.role === "ADMIN" ? "STUDENT" : "ADMIN"
                    )
                  }
                >
                  {detailUser.role === "ADMIN" ? "Demote to Student" : "Make Admin"}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Downloads</span>
                <span>{userDetail._count.downloads}</span>
                <span className="text-muted-foreground">Purchases</span>
                <span>{userDetail._count.purchases}</span>
                <span className="text-muted-foreground">Saved</span>
                <span>{userDetail._count.savedResources}</span>
              </div>
              {userDetail.subscriptions.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Recent subscriptions</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {userDetail.subscriptions.map((s, i) => (
                      <li key={i}>
                        {s.plan} — {s.status} (ends{" "}
                        {format(new Date(s.endsAt), "MMM d, yyyy")})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
