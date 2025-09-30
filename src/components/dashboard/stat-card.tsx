import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StatCard } from "@/lib/types";

export function StatCard({ card }: { card: StatCard }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{card.label}</CardTitle>
        <card.icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{card.value}</div>
      </CardContent>
    </Card>
  );
}
