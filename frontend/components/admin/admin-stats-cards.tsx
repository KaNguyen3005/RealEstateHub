import { Building2, MessageCircle, Users, Workflow } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminStats } from "@/types/admin";

interface AdminStatsCardsProps {
  stats: AdminStats;
}

const numberFormatter = new Intl.NumberFormat("en-US");

export function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  const cards = [
    {
      title: "Users",
      value: stats.users.total,
      detail: `${stats.users.active} active, ${stats.users.blocked} blocked`,
      icon: Users,
    },
    {
      title: "Properties",
      value: stats.properties.total,
      detail: `${stats.properties.pending} pending, ${stats.properties.approved} approved`,
      icon: Building2,
    },
    {
      title: "Contact requests",
      value: stats.contactRequests.total,
      detail: `${stats.contactRequests.new} new requests`,
      icon: MessageCircle,
    },
    {
      title: "Conversations",
      value: stats.conversations.total,
      detail: "Realtime chat threads",
      icon: Workflow,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.title} className="rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <Icon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-foreground">{numberFormatter.format(card.value)}</p>
              <p className="mt-2 text-sm text-muted-foreground">{card.detail}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
