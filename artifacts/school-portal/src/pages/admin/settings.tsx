import { useSeedData } from "@workspace/api-client-react";
import { Card, Button } from "@/components/ui-elements";
import { Database, AlertTriangle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const { mutate: seed, isPending } = useSeedData();

  const handleSeed = () => {
    if (confirm("WARNING: This will initialize demo data in the database. Continue?")) {
      seed(undefined, {
        onSuccess: () => {
          alert("Data seeded successfully!");
          queryClient.invalidateQueries();
        },
        onError: () => alert("Failed to seed data.")
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">System configuration and maintenance</p>
      </div>

      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-500/10 rounded-xl text-red-500 mt-1">
            <Database className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold">Initialize Demo Data</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Populate the database with sample students, teachers, classes, and schedules. 
              Useful for testing the portal.
            </p>
            <Button variant="danger" onClick={handleSeed} isLoading={isPending}>
              <AlertTriangle className="w-4 h-4" /> Seed Database
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
