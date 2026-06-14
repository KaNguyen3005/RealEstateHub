"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { UserStatus } from "@/types/admin";
import type { User, UserRole } from "@/types/user";

interface UserManagementTableProps {
  users: User[];
  onUpdateRole: (userId: string, role: UserRole) => Promise<void>;
  onUpdateStatus: (userId: string, status: UserStatus) => Promise<void>;
}

export function UserManagementTable({ users, onUpdateRole, onUpdateStatus }: UserManagementTableProps) {
  const [busyUserId, setBusyUserId] = useState<string | null>(null);

  const runAction = async (userId: string, action: () => Promise<void>) => {
    setBusyUserId(userId);

    try {
      await action();
    } finally {
      setBusyUserId(null);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border/70 bg-background/90 shadow-sm">
      <div className="hidden grid-cols-[1.3fr_0.8fr_0.7fr_1.1fr] border-b border-border/70 bg-muted/40 px-4 py-3 text-sm font-semibold text-muted-foreground md:grid">
        <span>User</span>
        <span>Role</span>
        <span>Status</span>
        <span className="text-right">Actions</span>
      </div>
      <div className="divide-y divide-border/70">
        {users.map((user) => (
          <div key={user._id} className="grid gap-3 px-4 py-4 md:grid-cols-[1.3fr_0.8fr_0.7fr_1.1fr] md:items-center">
            <div>
              <p className="font-semibold text-foreground">{user.fullName}</p>
              <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
            </div>
            <select
              value={user.role}
              disabled={busyUserId === user._id}
              className="h-9 rounded-md border border-input bg-background px-2 text-sm"
              onChange={(event) => runAction(user._id, () => onUpdateRole(user._id, event.target.value as UserRole))}
            >
              <option value="admin">Admin</option>
              <option value="seller">Seller</option>
              <option value="user">User</option>
            </select>
            <span className={user.status === "active" ? "text-sm font-medium text-emerald-700" : "text-sm font-medium text-red-700"}>
              {user.status}
            </span>
            <div className="flex justify-start gap-2 md:justify-end">
              <Button
                type="button"
                size="sm"
                variant={user.status === "active" ? "outline" : "default"}
                disabled={busyUserId === user._id}
                onClick={() =>
                  runAction(user._id, () =>
                    onUpdateStatus(user._id, user.status === "active" ? "blocked" : "active")
                  )
                }
              >
                {user.status === "active" ? "Block" : "Activate"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
